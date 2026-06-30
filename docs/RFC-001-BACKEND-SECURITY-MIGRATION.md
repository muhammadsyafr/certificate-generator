# RFC-001: Backend Security & Production Readiness Migration

**Status:** Draft  
**Created:** 2026-06-30  
**Author:** System  
**Type:** Architecture Decision

---

## 1. Executive Summary

Migrate current SQLite-based backend to production-ready architecture with security hardening, scalable file storage, and proper authentication/authorization. Address all 8 production recommendations from BACKEND_API.md.

**Timeline:** 4-6 weeks  
**Effort:** ~120-160 hours  
**Priority:** High (blocks production deployment)

---

## 2. Background

### Current State
- SQLite database with auto-increment IDs
- Files stored in `public/uploads/` (publicly accessible)
- No authentication/authorization
- No server-side rate limiting
- No input validation on backend
- No CORS configuration
- Frontend-only sanitization

### Problems
1. **Security:** No auth = anyone can upload/delete/modify
2. **Scale:** SQLite + local files won't scale horizontally
3. **Data exposure:** Auto-increment IDs reveal business metrics
4. **File security:** All uploads publicly accessible via direct URL
5. **DoS risk:** No rate limiting on upload endpoints
6. **Data integrity:** No schema validation for JSON payloads

### Goals
- Production-grade security (auth, input validation, rate limiting)
- Horizontal scalability (cloud DB + object storage)
- UUID-based IDs
- Schema validation
- Signed URLs for private files
- CORS configuration
- Zero breaking changes to frontend

---

## 3. Proposed Solution

### 3.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Nuxt)                      │
│  - Same API contracts                                        │
│  - JWT stored in httpOnly cookie                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    API Layer (Nuxt Server)                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Middleware Stack                                     │    │
│  │ 1. CORS (nuxt-security)                             │    │
│  │ 2. Rate Limiting (nuxt-rate-limit)                  │    │
│  │ 3. Auth (nuxt-auth-utils + JWT)                     │    │
│  │ 4. Input Validation (zod)                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Endpoints                                            │    │
│  │ - /api/auth/* (login, register, logout, refresh)   │    │
│  │ - /api/templates/* (CRUD with ownership)            │    │
│  │ - /api/assets/* (upload → S3, signed URLs)          │    │
│  │ - /api/fonts/* (upload → S3, signed URLs)           │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
     ┌──────────▼──────────┐       ┌─────────▼──────────┐
     │   PostgreSQL        │       │  S3-Compatible     │
     │   (Supabase/Neon)   │       │  Object Storage    │
     │                     │       │  (AWS S3/R2/Minio) │
     │  - users            │       │                    │
     │  - templates (UUID) │       │  /assets/{uuid}    │
     │  - assets (UUID)    │       │  /fonts/{uuid}     │
     │  - fonts (UUID)     │       │                    │
     └─────────────────────┘       └────────────────────┘
```

### 3.2 Technology Choices

| Component | Current | Proposed | Rationale |
|-----------|---------|----------|-----------|
| **Database** | SQLite | PostgreSQL (Supabase/Neon) | Horizontal scale, ACID, UUID support |
| **File Storage** | Local FS | S3-compatible (R2/S3/Minio) | CDN integration, signed URLs, scale |
| **Auth** | None | JWT + nuxt-auth-utils | Nuxt-native, simple, secure |
| **Validation** | Frontend only | Zod schemas | Type-safe, runtime validation |
| **Rate Limiting** | None | nuxt-rate-limit | IP-based, configurable |
| **CORS** | None | nuxt-security | Production hardening |
| **IDs** | Auto-increment | UUID v7 | Time-sortable, non-sequential |

---

## 4. Detailed Design

### 4.1 Database Schema Migration

#### New Schema (PostgreSQL)
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (new)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates table (migrated)
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  layout JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table (migrated)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  storage_key VARCHAR(500) NOT NULL, -- S3 key
  type VARCHAR(50) NOT NULL,
  metadata JSONB,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fonts table (migrated)
CREATE TABLE fonts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  storage_key VARCHAR(500) NOT NULL, -- S3 key
  font_family VARCHAR(100) NOT NULL,
  font_weight VARCHAR(10) DEFAULT '400',
  font_style VARCHAR(20) DEFAULT 'normal',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_fonts_user_id ON fonts(user_id);
CREATE INDEX idx_templates_created_at ON templates(created_at DESC);
```

#### Migration Strategy
1. **Dual-write period:** Write to both SQLite + PostgreSQL
2. **Data migration script:** Bulk copy existing data
3. **Validation:** Compare record counts
4. **Cutover:** Switch read path to PostgreSQL
5. **Cleanup:** Archive SQLite after 7 days

### 4.2 Authentication System

#### JWT Flow
```typescript
// server/middleware/auth.ts
import { verifyToken } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  const protectedPaths = ['/api/templates', '/api/assets', '/api/fonts']
  const path = event.path
  
  if (!protectedPaths.some(p => path.startsWith(p))) {
    return // Public endpoint
  }

  const token = getCookie(event, 'auth_token')
  
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const payload = await verifyToken(token)
    event.context.user = payload
  } catch (e) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }
})
```

#### Endpoints
- `POST /api/auth/register` - Create account (email + password)
- `POST /api/auth/login` - Get JWT token
- `POST /api/auth/logout` - Clear cookie
- `POST /api/auth/refresh` - Refresh token

### 4.3 File Storage (S3)

#### Upload Flow
```typescript
// server/api/assets/index.post.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'

const uploadSchema = z.object({
  file: z.instanceof(Buffer),
  filename: z.string().max(255),
  type: z.enum(['background', 'logo', 'free-image'])
})

export default defineEventHandler(async (event) => {
  const user = event.context.user // From auth middleware
  const formData = await readMultipartFormData(event)
  
  // Validate + sanitize
  const file = formData[0]
  const sanitized = sanitizeFilename(file.filename)
  
  // Generate S3 key
  const key = `assets/${user.id}/${uuidv7()}-${sanitized}`
  
  // Upload to S3
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file.data,
    ContentType: file.type
  }))
  
  // Save metadata to DB
  const asset = await db.insert(assets).values({
    id: uuidv7(),
    userId: user.id,
    filename: sanitized,
    storageKey: key,
    type: file.type,
    metadata: await extractMetadata(file.data)
  }).returning()
  
  // Generate signed URL (24h expiry)
  const url = await getSignedUrl(s3, new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key
  }), { expiresIn: 86400 })
  
  return { ...asset, url }
})
```

### 4.4 Input Validation

#### Zod Schemas
```typescript
// server/schemas/template.ts
import { z } from 'zod'

export const layoutElementSchema = z.object({
  id: z.string(),
  kind: z.enum(['text', 'field', 'seal', 'bar', 'image', 'shape']),
  label: z.string().max(100),
  x: z.number().min(0),
  y: z.number().min(0),
  w: z.number().min(1),
  h: z.number().min(1),
  text: z.string().optional(),
  field: z.string().optional(),
  font: z.string().optional(),
  size: z.number().optional(),
  weight: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  opacity: z.number().min(0).max(100).optional(),
  src: z.string().url().optional()
})

export const layoutSchema = z.object({
  width: z.number().min(200).max(5000),
  height: z.number().min(200).max(5000),
  background: z.string().optional(),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  elements: z.array(layoutElementSchema).max(100)
})

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[\w\s\-\.]+$/),
  layout: layoutSchema
})
```

### 4.5 Rate Limiting

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-rate-limit'],
  rateLimit: {
    enabled: true,
    routes: {
      '/api/auth/login': {
        maxRequests: 5,
        intervalSeconds: 60
      },
      '/api/assets': {
        maxRequests: 20,
        intervalSeconds: 60
      },
      '/api/fonts': {
        maxRequests: 10,
        intervalSeconds: 60
      },
      '/api/templates': {
        maxRequests: 100,
        intervalSeconds: 60
      }
    }
  }
})
```

### 4.6 CORS Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  security: {
    headers: {
      crossOriginEmbedderPolicy: 'require-corp',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'same-origin',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'blob:', process.env.S3_CDN_URL]
      }
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }
  }
})
```

---

## 5. Migration Phases

### Phase 1: Foundation (Week 1-2)
**Goal:** Infrastructure + auth system

#### Tasks
1. **Database Setup**
   - [ ] Provision PostgreSQL (Supabase/Neon)
   - [ ] Create new schema with UUID support
   - [ ] Setup Drizzle ORM for PostgreSQL
   - [ ] Create migration scripts

2. **S3 Setup**
   - [ ] Provision S3 bucket (or Cloudflare R2)
   - [ ] Configure IAM/API keys
   - [ ] Setup CDN (CloudFront/R2 CDN)
   - [ ] Test signed URL generation

3. **Authentication**
   - [ ] Install `nuxt-auth-utils`
   - [ ] Create JWT utils (sign/verify)
   - [ ] Build auth endpoints (register, login, logout)
   - [ ] Create auth middleware
   - [ ] Add frontend login/register pages

**Deliverables:**
- PostgreSQL schema deployed
- S3 bucket operational
- Auth system functional
- Frontend can register/login

**Validation:**
- User can register account
- User can login and receive JWT cookie
- Protected endpoints return 401 without token

---

### Phase 2: Core API Migration (Week 3-4)
**Goal:** Migrate templates/assets/fonts to new architecture

#### Tasks
4. **Input Validation**
   - [ ] Create Zod schemas for all endpoints
   - [ ] Add validation middleware
   - [ ] Sanitize filenames on server
   - [ ] Validate image dimensions (max 4096x4096)
   - [ ] Validate file sizes (images 10MB, fonts 5MB)

5. **Templates API**
   - [ ] Add `user_id` to template queries
   - [ ] Switch to UUID IDs
   - [ ] Validate layout schema
   - [ ] Add ownership checks
   - [ ] Update frontend to handle UUIDs

6. **Assets API**
   - [ ] Implement S3 upload logic
   - [ ] Generate signed URLs for downloads
   - [ ] Add Sharp image resize (max 4096px)
   - [ ] Switch to UUID IDs
   - [ ] Update frontend to use signed URLs

7. **Fonts API**
   - [ ] Implement S3 upload logic
   - [ ] Generate signed URLs for font files
   - [ ] Switch to UUID IDs
   - [ ] Update frontend to use signed URLs

**Deliverables:**
- All endpoints use PostgreSQL + S3
- All IDs are UUIDs
- All inputs validated
- Signed URLs working

**Validation:**
- Create template → stored in PostgreSQL with UUID
- Upload asset → stored in S3, signed URL returned
- Upload font → stored in S3, loaded in editor
- No direct public access to uploads

---

### Phase 3: Security Hardening (Week 5)
**Goal:** Add rate limiting, CORS, and security headers

#### Tasks
8. **Rate Limiting**
   - [ ] Install `nuxt-rate-limit`
   - [ ] Configure limits per endpoint
   - [ ] Add rate limit bypass for tests
   - [ ] Monitor Redis/memory store

9. **CORS & Headers**
   - [ ] Install `nuxt-security`
   - [ ] Configure CORS origins
   - [ ] Add CSP headers
   - [ ] Add security headers (HSTS, X-Frame-Options)

10. **Additional Hardening**
    - [ ] Add request logging
    - [ ] Add error tracking (Sentry)
    - [ ] Add file virus scanning (ClamAV optional)
    - [ ] Add CAPTCHA on register/login (Turnstile)

**Deliverables:**
- Rate limiting active
- CORS configured
- Security headers set
- Error tracking operational

**Validation:**
- Rate limit triggers after N requests
- CORS blocks unauthorized origins
- Security headers present in responses

---

### Phase 4: Data Migration & Cutover (Week 6)
**Goal:** Migrate existing data and go live

#### Tasks
11. **Data Migration**
    - [ ] Create migration script (SQLite → PostgreSQL)
    - [ ] Migrate files (local → S3)
    - [ ] Assign existing data to admin user
    - [ ] Validate data integrity

12. **Testing**
    - [ ] Integration tests for all endpoints
    - [ ] Load testing (k6)
    - [ ] Security testing (OWASP ZAP)
    - [ ] Manual QA

13. **Deployment**
    - [ ] Update environment variables
    - [ ] Deploy to staging
    - [ ] Run smoke tests
    - [ ] Deploy to production
    - [ ] Monitor logs

14. **Cleanup**
    - [ ] Archive SQLite database
    - [ ] Remove local file uploads
    - [ ] Update documentation
    - [ ] Create runbook

**Deliverables:**
- All data migrated
- Production deployment successful
- Monitoring dashboards active
- Documentation updated

**Validation:**
- Zero data loss
- All features working
- Performance acceptable (p95 < 500ms)

---

## 6. Implementation Checklist

### 6.1 Infrastructure
- [ ] PostgreSQL database provisioned
- [ ] S3 bucket created
- [ ] CDN configured
- [ ] Environment variables set
- [ ] Backup strategy configured

### 6.2 Backend
- [ ] Auth middleware implemented
- [ ] JWT sign/verify utils
- [ ] Zod schemas for all endpoints
- [ ] Input sanitization on server
- [ ] Rate limiting configured
- [ ] CORS configured
- [ ] S3 upload/download logic
- [ ] Signed URL generation
- [ ] UUID migration complete
- [ ] Error handling standardized

### 6.3 Frontend
- [ ] Login/register pages
- [ ] JWT cookie handling
- [ ] Signed URL support
- [ ] UUID support in all components
- [ ] Error messages for auth failures
- [ ] Loading states for async ops

### 6.4 Testing
- [ ] Unit tests for auth utils
- [ ] Integration tests for all endpoints
- [ ] E2E tests for critical flows
- [ ] Load tests (1000 req/s)
- [ ] Security scan (OWASP ZAP)

### 6.5 Monitoring
- [ ] Error tracking (Sentry)
- [ ] APM (Datadog/New Relic)
- [ ] Log aggregation (CloudWatch/Loki)
- [ ] Uptime monitoring (Pingdom)
- [ ] Alerting configured

### 6.6 Documentation
- [ ] API documentation updated
- [ ] Architecture diagrams
- [ ] Migration runbook
- [ ] Security policy
- [ ] Incident response plan

---

## 7. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Data loss during migration** | Critical | Low | Dual-write period, backup before cutover |
| **Frontend breaks with UUIDs** | High | Medium | Gradual rollout, feature flags |
| **S3 costs exceed budget** | Medium | Medium | Set lifecycle policies, monitor usage |
| **Auth breaks existing sessions** | High | Low | Implement graceful login prompt |
| **Rate limiting too aggressive** | Medium | Medium | Monitor false positives, adjust limits |
| **Slow signed URL generation** | Medium | Low | Cache signed URLs (24h), CDN |
| **PostgreSQL bottleneck** | High | Low | Connection pooling, read replicas |

---

## 8. Rollback Plan

### Immediate Rollback (< 1 hour)
1. Revert to previous deployment
2. Point API to SQLite
3. Disable auth middleware
4. Switch file paths to local FS

### Partial Rollback (< 4 hours)
1. Keep PostgreSQL, revert S3
2. Keep auth, revert rate limiting
3. Feature flag specific endpoints

### Data Recovery
1. Restore PostgreSQL from backup
2. Restore S3 from versioning
3. Re-run migration script

---

## 9. Success Metrics

### Security
- [ ] Zero public file access without auth
- [ ] Zero SQL injection vulnerabilities
- [ ] Zero XSS vulnerabilities
- [ ] 100% endpoints with rate limiting

### Performance
- [ ] p50 API latency < 100ms
- [ ] p95 API latency < 500ms
- [ ] p99 API latency < 1000ms
- [ ] 99.9% uptime

### Scale
- [ ] Support 10,000 users
- [ ] Support 100,000 templates
- [ ] Support 1,000 concurrent uploads
- [ ] 1TB file storage

---

## 10. Open Questions

1. **Which PostgreSQL provider?** Supabase (managed auth) vs Neon (pure DB)?
2. **Which S3 provider?** AWS S3 (standard) vs Cloudflare R2 (zero egress)?
3. **Session duration?** 7 days vs 30 days for JWT expiry?
4. **File retention policy?** Keep deleted files for 30 days?
5. **Multi-tenancy?** Support organizations/teams in future?

---

## 11. Appendix

### A. Cost Estimates (Monthly)

| Service | Provider | Usage | Cost |
|---------|----------|-------|------|
| PostgreSQL | Neon | 10GB, 1M rows | $19 |
| Object Storage | Cloudflare R2 | 100GB, 1M ops | $1.50 |
| CDN | Cloudflare R2 | Included | $0 |
| Error Tracking | Sentry | 10k events | $26 |
| **Total** | | | **~$47/mo** |

### B. Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# S3
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=certificate-generator-prod
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
S3_REGION=us-east-1
S3_CDN_URL=https://cdn.example.com

# Auth
JWT_SECRET=xxx (64 char random)
JWT_EXPIRY=7d

# CORS
ALLOWED_ORIGINS=https://app.example.com,https://www.example.com

# Rate Limiting
RATE_LIMIT_STORE=redis://localhost:6379
```

### C. References
- [Nuxt Auth Utils](https://github.com/Atinux/nuxt-auth-utils)
- [Nuxt Security](https://nuxt-security.vercel.app/)
- [Drizzle ORM PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [AWS SDK S3 Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Zod Documentation](https://zod.dev/)

---

**Next Steps:**
1. Review and approve this RFC
2. Provision infrastructure (PostgreSQL, S3)
3. Create GitHub project with task breakdown
4. Begin Phase 1 implementation
