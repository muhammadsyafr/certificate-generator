# Certificate Generator

Design certificate templates, upload recipient data, and generate hundreds of production-ready PDFs or PNGs in seconds. Fully local — no sign-up, no API keys.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features

- **Template Editor** — Drag-and-drop canvas. Text, images, logos, backgrounds. Custom fonts.
- **Bulk Generate** — Upload CSV or paste JSON. Map fields to placeholders. Download ZIP.
- **Asset Library** — Logos, backgrounds, free images. Drag in any file.
- **Custom Fonts** — TTF, OTF, WOFF. Per-element font selection.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4 (Vue 3, Vite, Nitro) |
| Styling | Tailwind 4 + custom design tokens |
| Database | SQLite via better-sqlite3 |
| ORM | Drizzle |
| Rendering | SPA (`ssr: false`) |
| Fonts | Playfair Display, Source Serif 4, JetBrains Mono |

## Project Structure

```
├── app/
│   ├── pages/           # File-based routes
│   │   ├── index.vue        # Landing
│   │   ├── generate.vue     # Bulk generation
│   │   └── templates/       # Template CRUD
│   └── assets/css/          # Global styles + design tokens
├── server/
│   ├── api/             # REST endpoints (templates, assets, fonts)
│   ├── database/        # Schema + SQLite client
│   └── plugins/         # DB init + seed
├── public/              # Static assets + uploads
└── docs/
    ├── DEPLOYMENT.md    # Full deployment guide
    ├── DESIGN.md        # Design system reference
    └── PRD.md           # Product requirements
```

## Deploy

```bash
npm run build
node .output/server/index.mjs
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

## License

Private — internal use.
