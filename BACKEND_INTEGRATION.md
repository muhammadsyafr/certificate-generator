# Backend Integration Guide

Frontend successfully integrated with Express backend API.

## Architecture

- **Frontend**: Nuxt 3 (SPA mode) - `certificate-generator/`
- **Backend**: Express + SQLite - `backend-certificate-generator/`
- **API Client**: `useApi()` composable with JWT auth

## Setup

### 1. Start Backend

```bash
cd backend-certificate-generator
npm install
npm run dev
# Backend runs on http://localhost:4000
```

### 2. Start Frontend

```bash
cd certificate-generator
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Environment Variables

Frontend `.env` (already configured):
```
NUXT_PUBLIC_API_BASE_URL=http://localhost:4000
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

Backend `.env` (check existing):
```
PORT=4000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-secret-key-change-in-production
```

## API Integration

### Auth Flow

1. **Sign Up** (`/signup`)
   - POST `/api/auth/register` → Returns JWT token
   - Token stored in localStorage
   - Auto-redirect to `/templates`

2. **Sign In** (`/signin`)
   - POST `/api/auth/login` → Returns JWT token
   - Token stored in localStorage
   - Auto-redirect to `/templates`

3. **Protected Routes**
   - Global middleware checks token
   - Redirects to `/signin` if not authenticated
   - Token sent in `Authorization: Bearer <token>` header

### API Endpoints Used

**Auth** (public):
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

**Templates** (protected):
- `GET /api/templates` - List user templates
- `POST /api/templates` - Create template
- `GET /api/templates/:id` - Get template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

**Assets** (protected):
- `GET /api/assets` - List user assets
- `POST /api/assets` - Upload asset (multipart/form-data)
- `DELETE /api/assets/:id` - Delete asset

**Fonts** (protected):
- `GET /api/fonts` - List user fonts
- `POST /api/fonts` - Upload fonts (multipart/form-data)
- `DELETE /api/fonts/:id` - Delete font

## Modified Files

### New Files
- `app/composables/useApi.ts` - API client with JWT interceptor
- `app/middleware/auth.global.ts` - Route protection
- `.env` - Environment variables

### Updated Files
- `app/pages/signin.vue` - Backend auth integration
- `app/pages/signup.vue` - Backend auth integration
- `app/pages/templates/index.vue` - Backend API calls
- `app/pages/templates/[id].vue` - Backend API calls
- `app/pages/templates/assets.vue` - Backend API calls
- `app/pages/generate.vue` - Backend API calls
- `nuxt.config.ts` - Runtime config for API URL

## Testing

### Manual Test Flow

1. **Sign Up**
   ```
   - Go to http://localhost:3000/signup
   - Fill form: email, password, name
   - Submit → Should create account + redirect to /templates
   ```

2. **Sign In**
   ```
   - Go to http://localhost:3000/signin
   - Enter credentials
   - Submit → Should authenticate + redirect to /templates
   ```

3. **Templates**
   ```
   - Should load user templates from backend
   - Create new template → Should save to backend
   - Edit template → Should auto-save to backend
   - Delete template → Should delete from backend
   ```

4. **Assets**
   ```
   - Go to /templates/assets
   - Upload background/logo → Should upload to backend
   - Delete asset → Should delete from backend
   ```

5. **Generate**
   ```
   - Go to /generate
   - Select template → Should load from backend
   - Upload CSV → Generate certificates
   ```

### API Test with cURL

Test backend directly:

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get templates (with token)
TOKEN="your-jwt-token-here"
curl -X GET http://localhost:4000/api/templates \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

### CORS Issues
- Check backend `CORS_ORIGIN` includes frontend URL
- Backend should allow `http://localhost:3000`

### 401 Unauthorized
- Check token in localStorage: `localStorage.getItem('auth_token')`
- Token may be expired - sign in again

### Connection Refused
- Verify backend is running on port 4000
- Check `.env` has correct `NUXT_PUBLIC_API_BASE_URL`

### Assets Not Loading
- Backend serves files from `data/uploads/`
- Check file paths in database match filesystem
- Verify backend has write permissions

## Production Deployment

### Environment Variables

Frontend:
```
NUXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NUXT_PUBLIC_APP_URL=https://app.yourdomain.com
```

Backend:
```
PORT=4000
CORS_ORIGIN=https://app.yourdomain.com
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
```

### Build

```bash
# Frontend
cd certificate-generator
npm run build
npm run preview

# Backend
cd backend-certificate-generator
npm run build
npm start
```

## Next Steps

1. Add file upload validation (size, type)
2. Add rate limiting for auth endpoints
3. Add refresh token mechanism
4. Add user profile management
5. Add password reset flow
6. Add email verification
7. Add image compression before upload
8. Add batch upload for assets
9. Add template sharing/collaboration
10. Add analytics tracking

## Notes

- Frontend uses localStorage for token (consider httpOnly cookies for production)
- Backend uses SQLite (consider PostgreSQL for production)
- No file size limits enforced yet (add in production)
- No rate limiting implemented (add in production)
- JWT expiry not implemented (add in production)
