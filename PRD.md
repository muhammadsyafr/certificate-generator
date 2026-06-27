Here is the revised Product Requirement Document (PRD), specifically updated to reflect a **Nuxt 4 (Vue 3)** frontend architecture.

---

# Product Requirement Document (PRD): Lightweight Certificate Generator

## 1. Executive Summary

The **Certificate Generator** is a self-contained, lightweight web application designed to allow users to design certificate templates, upload a list of recipients, and bulk-generate high-quality certificates. Utilizing **Nuxt 4** for a high-performance, structured Vue 3 frontend and **SQLite** for a zero-installation database, the system is highly portable, fast, and easy to deploy.

---

## 2. System Architecture & Tech Stack

* **Frontend:** **Nuxt 4** (Vue 3, Vite, Nitro server engine, File-based routing).
* **Backend Layers:** * Nuxt 4 Server Routes (`/server/api/*`) for lightweight data handling.
* Optional separate Python/Node.js microservice *only* if heavy server-side PDF manipulation is offloaded; otherwise, fully integrated into Nuxt's Nitro engine.


* **Database:** **SQLite** (Zero-configuration, single-file database managed via an ORM like Prisma or Drizzle inside the Nuxt ecosystem).
* **Storage:** Local file system (`public/uploads/` or a localized directory) for uploaded assets (logos, backgrounds) and generated outputs.

---

## 3. Epics & Feature Requirements

### Epic 1: Template Builder & Media Management (Separate Page)

Users need a dedicated workspace to manage global assets (logos) and customize the visual layout of certificates.

* **FR-1.1: Logo & Asset Library (`/pages/templates/assets.vue`)**
* A dedicated view to upload, preview, and delete custom logos/images (`.png`, `.jpg`).
* System must preserve transparency for uploaded logos.


* **FR-1.2: Template Designer Canvas (`/pages/templates/designer.vue`)**
* A draggable, coordinate-based canvas editor using Vue 3 reactive states to position elements.
* Ability to set a background image for the template.
* Ability to place dynamic placeholder variables: `{{name}}`, `{{date}}`, `{{certificate_id}}`.


* **FR-1.3: Typography Customization**
* Live-updating Vue bindings for selecting font families, sizes, colors, and alignments for each text element on the canvas.



### Epic 2: Certificate Generation Engine

The core engine responsible for merging data templates with recipient variables.

* **FR-2.1: Multi-Template Support**
* Users can save multiple distinct templates (e.g., "Participation Certificate", "Excellence Award") to the SQLite database.


* **FR-2.2: Dynamic Rendering**
* The engine replaces `{{name}}` and other placeholders with actual data at runtime.
* Output format must be high-resolution **PDF** or compressed **ZIP** containing individual files.
* *Nuxt Specific:* Client-side rendering options (using HTML5 Canvas/jspdf) or server-side rendering via Nitro server routes.



### Epic 3: Bulk Data Ingestion (`/pages/generate.vue`)

To generate hundreds of certificates efficiently, users must be able to upload structured data.

* **FR-3.1: CSV Upload**
* Users can upload a standard `.csv` file.
* The frontend parses the file (using a library like PapaParse) into a reactive Vue array, mapping headers to the template's placeholders.


* **FR-3.2: JSON Ingestion**
* An alternative text-area input or file upload accepting an array of JSON objects:
```json
[
  { "name": "John Doe", "date": "2026-06-27" },
  { "name": "Jane Smith", "date": "2026-06-28" }
]

```




* **FR-3.3: Data Validation & Preview**
* Before execution, Nuxt renders a dynamic `v-for` data table previewing the mapped data so the user can check for formatting errors.



### Epic 4: Data Persistence (SQLite Storage via Nuxt Server)

* **FR-4.1: Database Schema Integration**
* Tables for `templates` (storing JSON layouts, dimensions, background paths).
* Tables for `assets` (metadata for logos and fonts).


* **FR-4.2: Zero-Conf Migration**
* On Nuxt server initialization (`modules` or `plugins`), the SQLite database file (`app.db`) must automatically initialize schemas if they do not exist.



---

## 4. Nuxt 4 Directory Structure & Workflow

The app leverages Nuxt 4's updated folder layout structure:

```
├── app/
│   ├── pages/
│   │   ├── index.vue                # Dashboard / Choice of action
│   │   ├── generate.vue             # CSV/JSON Upload & Bulk Processing
│   │   └── templates/
│   │       ├── index.vue            # Template selection grid
│   │       ├── assets.vue           # Separate logo/font upload manager
│   │       └── [id].vue             # Canvas builder / layout designer
├── server/
│   ├── api/
│   │   ├── templates.ts             # CRUD endpoints for SQLite templates
│   │   ├── assets.ts                # File upload handlers for logos
│   │   └── export.ts                # Server-side PDF/ZIP generation logic
│   └── database/
│       └── schema.ts                # SQLite Drizzle/Prisma definitions

```

---

## 5. Non-Functional Requirements (NFRs)

* **Performance:** Processing 100 entries via CSV should complete in under 10 seconds using localized hydration/rendering.
* **Portability:** The entire system state stays inside the project directory (`app.db` file + uploaded assets folder), keeping backups as simple as a folder copy.
* **Bundle Size:** Utilize Nuxt's code-splitting so heavy canvas or PDF parsing packages are only loaded on the specific generation routes.
