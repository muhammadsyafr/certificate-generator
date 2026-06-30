# Backend API Documentation

## Overview

Certificate Generator backend built on Nuxt 4 server API with SQLite (better-sqlite3) + Drizzle ORM. Handles templates, assets (images), and fonts with file upload/storage.

---

## Architecture

### Stack
- **Framework**: Nuxt 4 Nitro server
- **Database**: SQLite via better-sqlite3
- **ORM**: Drizzle ORM
- **File Processing**: Sharp (image metadata extraction)
- **Storage**: Local filesystem (`public/uploads/`)

### Directory Structure
```
server/
├── api/
│   ├── templates/
│   │   ├── index.ts       # GET /api/templates, POST /api/templates
│   │   └── [id].ts        # GET /api/templates/:id, PUT /api/templates/:id, DELETE /api/templates/:id
│   ├── assets/
│   │   ├── index.ts       # GET /api/assets, POST /api/assets
│   │   └── [id].ts        # DELETE /api/assets/:id
│   └── fonts/
│       ├── index.ts       # GET /api/fonts, POST /api/fonts
│       └── [id].ts        # DELETE /api/fonts/:id
├── database/
│   ├── client.ts          # Database connection
│   └── schema.ts          # Drizzle schema definitions
├── plugins/
│   └── db-init.ts         # DB initialization + migrations + seeding
└── utils/
    └── paths.ts           # Path resolution utility
```

---

## Database Schema

### `templates`
Stores certificate template layouts.

| Column       | Type      | Description                                    |
|--------------|-----------|------------------------------------------------|
| `id`         | INTEGER   | Primary key, auto-increment                    |
| `name`       | TEXT      | Template name (e.g., "Certificate of Completion") |
| `layout`     | TEXT      | JSON string: `{ width, height, background, elements: [...] }` |
| `created_at` | INTEGER   | Unix timestamp (milliseconds)                  |
| `updated_at` | INTEGER   | Unix timestamp (milliseconds)                  |

**Layout JSON Structure:**
```json
{
  "width": 1754,
  "height": 1240,
  "background": "/uploads/background/image.png",
  "elements": [
    {
      "type": "text",
      "x": 0,
      "y": 200,
      "width": 1754,
      "height": 120,
      "content": "{{name}}",
      "fontSize": 56,
      "color": "#1a1a2e",
      "fontWeight": "700",
      "fontStyle": "normal",
      "textDecoration": "none",
      "textAlign": "center"
    }
  ]
}
```

### `assets`
Stores uploaded images (backgrounds, logos, free images).

| Column        | Type      | Description                                    |
|---------------|-----------|------------------------------------------------|
| `id`          | INTEGER   | Primary key, auto-increment                    |
| `filename`    | TEXT      | Original filename                              |
| `filepath`    | TEXT      | Relative path from `public/` (e.g., `/uploads/background/1234-image.png`) |
| `type`        | TEXT      | Asset type: `logo`, `background`, `free-image`, custom |
| `metadata`    | TEXT      | JSON string: `{ width, height, size }`         |
| `uploaded_at` | INTEGER   | Unix timestamp (milliseconds)                  |

**Metadata JSON Structure:**
```json
{
  "width": 1920,
  "height": 1080,
  "size": 245678
}
```

### `fonts`
Stores uploaded custom fonts.

| Column        | Type      | Description                                    |
|---------------|-----------|------------------------------------------------|
| `id`          | INTEGER   | Primary key, auto-increment                    |
| `name`        | TEXT      | Display name (original filename)               |
| `filename`    | TEXT      | Original filename                              |
| `filepath`    | TEXT      | Relative path from `public/` (e.g., `/uploads/fonts/1234-font.woff2`) |
| `font_family` | TEXT      | CSS font-family name (e.g., "Montserrat")     |
| `font_weight` | TEXT      | Font weight: `100-900`, `normal`, `bold`       |
| `font_style`  | TEXT      | Font style: `normal`, `italic`                 |
| `uploaded_at` | INTEGER   | Unix timestamp (milliseconds)                  |

---

## API Endpoints

### Templates

#### `GET /api/templates`
List all templates.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Certificate of Completion",
    "layout": "{...}",
    "created_at": 1719713319000,
    "updated_at": 1719713319000
  }
]
```

#### `POST /api/templates`
Create new template.

**Request Body:**
```json
{
  "name": "Modern Certificate",
  "layout": {
    "width": 1754,
    "height": 1240,
    "background": "",
    "elements": []
  }
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Modern Certificate",
  "layout": "{...}",
  "created_at": 1719713400000,
  "updated_at": 1719713400000
}
```

**Errors:**
- `400`: Missing `name` or `layout`

#### `GET /api/templates/:id`
Get single template by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Certificate of Completion",
  "layout": "{...}",
  "created_at": 1719713319000,
  "updated_at": 1719713319000
}
```

**Errors:**
- `400`: Invalid ID
- `404`: Template not found

#### `PUT /api/templates/:id`
Update template.

**Request Body:**
```json
{
  "name": "Updated Name",
  "layout": { ... }
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Name",
  "layout": "{...}",
  "created_at": 1719713319000,
  "updated_at": 1719713500000
}
```

**Notes:**
- Both `name` and `layout` are optional
- `layout` is automatically JSON.stringify'd
- `updated_at` is automatically updated

**Errors:**
- `400`: Invalid ID
- `404`: Template not found

#### `DELETE /api/templates/:id`
Delete template.

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `400`: Invalid ID
- `404`: Template not found

---

### Assets

#### `GET /api/assets`
List all assets with parsed metadata.

**Response:**
```json
[
  {
    "id": 1,
    "filename": "background.png",
    "filepath": "/uploads/background/1719713319000-background.png",
    "type": "background",
    "metadata": {
      "width": 1920,
      "height": 1080,
      "size": 245678
    },
    "uploaded_at": 1719713319000
  }
]
```

#### `POST /api/assets`
Upload new asset (image).

**Request:** `multipart/form-data`
- `file`: Image file (PNG, JPG, JPEG)
- `type` (optional): Asset type (default: `logo`)

**Response:**
```json
{
  "id": 1,
  "filename": "background.png",
  "filepath": "/uploads/background/1719713319000-background.png",
  "type": "background",
  "metadata": "{\"width\":1920,\"height\":1080,\"size\":245678}",
  "uploaded_at": 1719713319000
}
```

**Process:**
1. Validate file type (PNG, JPG, JPEG only)
2. Generate unique filename: `{timestamp}-{original}`
3. Save to `public/uploads/{type}/`
4. Extract metadata via Sharp
5. Store in database

**Errors:**
- `400`: No file uploaded
- `400`: Invalid file type (only PNG/JPG allowed)

#### `DELETE /api/assets/:id`
Delete asset (file + DB record).

**Response:**
```json
{
  "success": true
}
```

**Process:**
1. Fetch asset from DB
2. Delete file from filesystem
3. Delete DB record

**Errors:**
- `400`: Invalid ID
- `404`: Asset not found

**Notes:**
- File deletion failure is logged but doesn't block DB deletion

---

### Fonts

#### `GET /api/fonts`
List all fonts.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Montserrat-Bold.woff2",
    "filename": "Montserrat-Bold.woff2",
    "filepath": "/uploads/fonts/1719713319000-Montserrat-Bold.woff2",
    "font_family": "Montserrat",
    "font_weight": "700",
    "font_style": "normal",
    "uploaded_at": 1719713319000
  }
]
```

#### `POST /api/fonts`
Upload font files (supports multiple).

**Request:** `multipart/form-data`
- `fontFamily`: CSS font-family name (required)
- `files`: One or more font files (TTF, OTF, WOFF, WOFF2)

**Response:**
```json
{
  "uploaded": 2,
  "fonts": [
    {
      "id": 1,
      "name": "Montserrat-Bold.woff2",
      "filename": "Montserrat-Bold.woff2",
      "filepath": "/uploads/fonts/1719713319000-Montserrat-Bold.woff2",
      "font_family": "Montserrat",
      "font_weight": "700",
      "font_style": "normal",
      "uploaded_at": 1719713319000
    }
  ]
}
```

**Process:**
1. Validate `fontFamily` field
2. Validate each file type (TTF, OTF, WOFF, WOFF2)
3. Validate file size (max 5MB per file)
4. Auto-detect `font_weight` and `font_style` from filename:
   - **Weight detection:** `thin`, `light`, `regular`, `medium`, `semibold`, `bold`, `extrabold`, `black`
   - **Style detection:** `italic`, `oblique`
5. Generate unique filename: `{timestamp}-{original}`
6. Save to `public/uploads/fonts/`
7. Store each font in database

**Filename Parsing Examples:**
- `Montserrat-Bold.woff2` → `fontWeight: '700'`, `fontStyle: 'normal'`
- `Montserrat-BoldItalic.woff2` → `fontWeight: '700'`, `fontStyle: 'italic'`
- `Montserrat-Light.woff2` → `fontWeight: '300'`, `fontStyle: 'normal'`
- `Montserrat-Regular.woff2` → `fontWeight: '400'`, `fontStyle: 'normal'`

**Errors:**
- `400`: Missing `fontFamily`
- `400`: No files uploaded
- `400`: No valid font files (wrong format or too large)

**Notes:**
- Invalid files are skipped with console warning
- Returns error only if ALL files are invalid

#### `DELETE /api/fonts/:id`
Delete font (file + DB record).

**Response:**
```json
{
  "success": true
}
```

**Process:**
1. Fetch font from DB
2. Delete file from filesystem
3. Delete DB record

**Errors:**
- `400`: Invalid ID
- `404`: Font not found

**Notes:**
- File deletion failure is logged but doesn't block DB deletion

---

## Database Initialization

### Plugin: `server/plugins/db-init.ts`

Runs on Nitro startup. Performs:

1. **Table Creation** (if not exists):
   - `templates`
   - `assets`
   - `fonts`

2. **Migrations**:
   - Adds `metadata` column to `assets` if missing

3. **Seeding**:
   - Creates default "Certificate of Completion" template if DB is empty
   - Default template has 8 text elements with placeholders: `{{name}}`, `{{course}}`, `{{date}}`, `{{certificate_id}}`

**Default Template Layout:**
- Width: 1754px, Height: 1240px
- Elements: Title, subtitle, name field, course field, date, ID
- No background image by default

---

## Utilities

### `server/utils/paths.ts`

**Function: `dataDir(...parts: string[])`**

Resolves absolute paths relative to data directory.

**Usage:**
```typescript
dataDir('public', 'uploads', 'fonts', 'file.woff2')
// → /path/to/project/public/uploads/fonts/file.woff2
```

**Environment:**
- Uses `process.env.DATA_DIR` if set
- Falls back to `process.cwd()`

---

## File Storage

### Upload Directory Structure
```
public/
└── uploads/
    ├── background/
    │   └── {timestamp}-{filename}
    ├── logo/
    │   └── {timestamp}-{filename}
    ├── free-image/
    │   └── {timestamp}-{filename}
    └── fonts/
        └── {timestamp}-{filename}
```

### File Naming Convention
- Format: `{timestamp}-{original_filename}`
- Example: `1719713319000-background.png`
- Timestamp: `Date.now()` in milliseconds

### File Validation

**Assets (Images):**
- Allowed: PNG, JPG, JPEG
- No size limit enforced (Sharp handles validation)

**Fonts:**
- Allowed: TTF, OTF, WOFF, WOFF2
- Max size: 5MB per file
- Multiple files supported in single request

---

## Error Handling

All endpoints use Nuxt `createError()` with:
- `statusCode`: HTTP status (400, 404, 405)
- `message`: Human-readable error

**Common Errors:**
- `400 Bad Request`: Invalid input, missing fields, wrong file type
- `404 Not Found`: Resource doesn't exist
- `405 Method Not Allowed`: Unsupported HTTP method

**File Deletion:**
- Filesystem errors are logged but don't throw
- DB record is deleted even if file deletion fails

---

## Database Operations

### Connection
- SQLite file: `app.db` (root directory or `DATA_DIR`)
- Connection: Singleton via `server/database/client.ts`
- Exports: `db` (Drizzle), `rawDb` (better-sqlite3)

### Queries
All DB operations use Drizzle ORM:
```typescript
// Select
db.select().from(templates).all()
db.select().from(templates).where(eq(templates.id, 1)).get()

// Insert
db.insert(templates).values({ ... }).returning()

// Update
db.update(templates).set({ ... }).where(eq(templates.id, 1)).returning()

// Delete
db.delete(templates).where(eq(templates.id, 1)).returning()
```

### Transactions
Not currently used (all operations are single queries)

---

## Metadata Extraction

### Assets (Images)
Uses **Sharp** to extract:
- `width`: Image width in pixels
- `height`: Image height in pixels
- `size`: File size in bytes

Stored as JSON string in `metadata` column.

**Failure Handling:**
- Logs error to console
- Sets `metadata` to `null`
- Still saves asset record

### Fonts
Uses **filename parsing** to detect:
- `font_weight`: `100-900` (mapped from keywords)
- `font_style`: `normal` or `italic`

No binary parsing of font files.

---

## Security Considerations

### Current Implementation
- ✅ File type validation (extensions)
- ✅ Font file size limit (5MB)
- ❌ No authentication
- ❌ No authorization
- ❌ No CSRF protection
- ❌ No rate limiting
- ❌ No input sanitization (filenames, JSON)
- ❌ Image size limit not enforced

### Recommendations for Production
1. Add authentication middleware
2. Validate/sanitize file names (strip dangerous chars)
3. Enforce image size limits (Sharp can resize)
4. Add rate limiting for uploads
5. Validate JSON schemas for `layout`
6. Use UUIDs instead of auto-increment IDs
7. Add CORS configuration
8. Store files outside `public/` with signed URLs

---

## Performance Notes

### Database
- SQLite in-process (no network latency)
- All queries use indexes (primary keys)
- JSON stored as text (parsed on retrieval)

### File Operations
- Synchronous writes via `fs/promises`
- No streaming (full file in memory)
- Sharp processes images in-memory

### Scaling Considerations
- SQLite suitable for low-medium traffic
- File storage requires persistent volume in containers
- No CDN integration (files served directly)

---

## Development Tips

### Testing Endpoints
```bash
# List templates
curl http://localhost:3000/api/templates

# Create template
curl -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","layout":{"width":1754,"height":1240,"background":"","elements":[]}}'

# Upload asset
curl -X POST http://localhost:3000/api/assets \
  -F "file=@image.png" \
  -F "type=background"

# Upload fonts
curl -X POST http://localhost:3000/api/fonts \
  -F "fontFamily=Montserrat" \
  -F "files=@Montserrat-Regular.woff2" \
  -F "files=@Montserrat-Bold.woff2"
```

### Database Reset
```bash
rm app.db
# Restart dev server to re-seed
```

### Logs
- DB initialization: `[DB] ...`
- Font upload warnings: `Skipping invalid file type: ...`
- File deletion errors: `Failed to delete file: ...`

---

## Changelog

### 2026-06-30
- Initial documentation
- Covers all API endpoints, database schema, file handling
