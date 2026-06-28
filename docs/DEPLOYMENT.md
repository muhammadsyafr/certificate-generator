# Deployment & Development Guide

## Requirements

- **Node.js** >= 18 (local dev) or **Docker** (container)
- **npm** >= 9 (local dev)

---

## Container (Recommended)

### Quick Start

```bash
# Build and run
docker compose up -d

# Open http://localhost:3000
```

Data persists in a named Docker volume (`cert-data`). Stop with `docker compose down`.

### Manual Docker

```bash
# Build image
docker build -t cert-generator .

# Run with persistent storage
docker run -d \
  -p 3000:3000 \
  -v cert-data:/data \
  --name cert-generator \
  cert-generator
```

### Podman

Same commands — replace `docker` with `podman`.

### Volumes

| Path | Contents |
|------|----------|
| `/data/app.db` | SQLite database (auto-created) |
| `/data/public/uploads/` | Uploaded assets, backgrounds, fonts |

---

## Local Development

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

The app uses `DATA_DIR` env var (defaults to project root). For local dev, data files live alongside the repo.

---

## Production Build

```bash
npm run build
node .output/server/index.mjs
```

Set `DATA_DIR` for custom data path:

```bash
DATA_DIR=/var/lib/cert-generator node .output/server/index.mjs
```

---

## Project Structure

```
├── app/                     # Vue frontend
│   ├── pages/               # File-based routes
│   │   ├── index.vue        # Landing page
│   │   ├── generate.vue     # Bulk generation
│   │   └── templates/       # Template management
│   │       ├── index.vue    # Template list
│   │       ├── [id].vue     # Template editor
│   │       ├── assets.vue   # Asset library
│   │       └── fonts.vue    # Font manager
│   ├── app.vue              # Root component
│   └── assets/css/          # Global styles + design tokens
├── server/                  # Nitro API server
│   ├── api/                 # REST endpoints
│   ├── database/            # Schema + SQLite client
│   └── utils/               # Shared utilities (paths)
├── public/                  # Static assets
├── Dockerfile               # Container build
├── docker-compose.yml       # Container orchestration
├── nuxt.config.ts           # Nuxt configuration
└── package.json
```

## Database

- **Engine:** SQLite via better-sqlite3
- **ORM:** Drizzle
- **File:** `app.db` in `DATA_DIR`
- **Tables:** `templates`, `assets`, `fonts`

Tables auto-created on first start. First template ("Certificate of Completion") auto-seeded if DB is empty.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `DATA_DIR` | `process.cwd()` | Directory for `app.db` and `public/uploads/` |
