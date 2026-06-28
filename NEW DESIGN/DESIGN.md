# Awesomic — Style Reference
> Rounded midnight marketplace — a portfolio gallery cut from matte black tiles on a white tablecloth, where large rounded corners and a single custom typeface do all the expressive work.

**Theme:** light

Awesomic operates on a white-and-near-black canvas with maximum roundness — 36px cards and pill-shaped containers dominate every surface, creating a soft, approachable tension against the very dark #09090b fills used for primary actions. The neutral scale is dense and graduated (gray-50 through gray-950), but only 3-4 steps appear in any single view, keeping contrast high without complexity. The single custom typeface, Cosmica, spans the entire system from 10px badge labels to 64px display headlines — its weight range (300–700) does all tonal work that color doesn't. Accent color is almost entirely absent from the UI layer: vivid orange (#ff5a00) surfaces only on YC badge labels, and the vivid pink (#fe45e2) is a single decorative card wash — the system's restraint makes these moments land harder.

## Colors

| Name | Value | Role |
|------|-------|------|
| Obsidian | `#09090b` | Primary filled button backgrounds, display heading text on white surfaces — the system's anchor dark, nearly true black |
| Ink | `#18181b` | Body text, nav text, badge text on light surfaces — one shade lighter than Obsidian, used for reading-weight text |
| Graphite | `#3f3f46` | Button borders, badge backgrounds (dark variant), border strokes across components — the dominant UI border tone |
| Slate | `#52525b` | Mid-dark card backgrounds in dark sections, subtle icon fills |
| Steel | `#71717a` | Muted body copy, helper text labels such as stat captions |
| Ash | `#a1a1aa` | Subdued heading variants, placeholder text, decorative rule strokes |
| Pebble | `#d4d4d8` | Hairline dividers, inactive link backgrounds, lightest visible border on white cards |
| Fog | `#ececee` | Card backgrounds (mid variant), badge borders, section dividers — the second surface step above the canvas |
| Mist | `#f4f4f5` | Page canvas, light card backgrounds, tag/link hover surface — the dominant background tone |
| Snow | `#ffffff` | White card surfaces, input backgrounds, button fill for outlined variant — the brightest surface in the stack |
| Ember | `#ff5a00` | YC batch badge backgrounds — vivid orange signals startup-ecosystem provenance, appears only on badge-sized labels |
| Orchid Flash | `#fe45e2` | Decorative card wash accent — single-use vivid pink on a large card background to punctuate the portfolio grid |

## Typography

### Cosmica — The sole typeface across the entire system — every badge, button, nav link, heading, and body copy uses Cosmica. Its wide weight range means all typographic hierarchy is weight-driven rather than family-switching. At 56–64px the light-to-medium weights feel assertive without shouting; at 10–14px the medium-to-semibold weights keep small labels legible at compact density.
- **Substitute:** DM Sans, Plus Jakarta Sans
- **Weights:** 300, 400, 500, 600, 700
- **Sizes:** 10px, 12px, 13px, 14px, 15px, 16px, 18px, 20px, 32px, 40px, 56px, 64px
- **Line height:** 1.0–1.8 (tighter at display sizes ~1.0–1.12, looser at body sizes ~1.45–1.68)
- **Letter spacing:** normal across all sizes — no tracked-out headlines or tight-tracked display text

### Type Scale

| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
| caption | 10px | 1.8 | — |
| body | 14px | 1.56 | — |
| body-lg | 16px | 1.5 | — |
| subheading | 18px | 1.45 | — |
| heading-sm | 20px | 1.35 | — |
| heading | 32px | 1.28 | — |
| heading-lg | 40px | 1.25 | — |
| display-sm | 56px | 1.12 | — |
| display | 64px | 1 | — |

## Spacing & Layout

**Base unit:** 4px

**Density:** compact

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24-28px
- **Element gap:** 8px

### Border Radius

- **hero:** 48px
- **pill:** 10000px
- **cards:** 36px (primary) or 28px (compact)
- **icons:** 40px
- **badges:** 12px
- **inputs:** 14px
- **buttons:** 36px (pill) or 14-16px (rounded rect)

## Components

### Primary Pill Button
**Role:** Main page CTA — Book demo, Get started, View all projects

Background #09090b, white text, Cosmica 14–16px weight 500, border-radius 36px, padding 12px 16px, 1.5px ring at rgb(44,46,52) with layered inset highlight and soft drop shadow. The multi-layer shadow gives the black pill a pressed-glass tactile quality unique to this system.

### Outlined White Button
**Role:** Secondary actions, nav-adjacent controls

Background #ffffff, text #3f3f46, border 1px solid #3f3f46, border-radius 36px, padding 20px. Same pill silhouette as primary but inverted — white fill against the dark border reads as a ghost on light backgrounds.

### Rounded Dark Button
**Role:** In-context actions within dark card panels

Background #09090b, white text, border 1px solid rgba(255,255,255,0.2), border-radius 14–16px, padding 12–14px 16–18px. The softer radius (not pill) distinguishes panel-embedded actions from page-level CTAs.

### Light Surface Card
**Role:** Stat blocks, feature sections, testimonials on white canvas

Background #ffffff, border-radius 36px, padding 28px horizontal and vertical, no box-shadow (flat). The extreme 36px radius makes white rectangles read as bubbles rather than panels.

### Muted Surface Card
**Role:** Secondary content blocks and social proof rows

Background #ececee, border-radius 28px, padding 24px all sides, no shadow. Slightly smaller radius and darker fill than white cards creates a quiet depth step without elevation.

### Dark Problem Panel
**Role:** Contrast section listing bottleneck points (e.g. 'We solve the bottlenecks' section)

Background #09090b or #222222, border-radius 28–36px, white and #a1a1aa text. Keyword phrases use Cosmica weight 600–700 while lead-in words use weight 300–400, creating inline weight contrast within single lines.

### Portfolio Tile Card
**Role:** Work showcase grid — full-bleed image with category badges overlaid

Background is the full-bleed project image or a vivid accent fill (#fe45e2 for decorative tiles). Border-radius 36px clipping the image. Badge labels float over the image at bottom-left, using the transparent dark badge variant.

### Dark Overlay Badge
**Role:** Category/skill tags on dark or image backgrounds

Background transparent, text #ffffff, border 1px solid rgba(255,255,255,0.3–0.5), border-radius 12px, padding 4px 8px, Cosmica 12px weight 500.

### Dark Filled Badge
**Role:** Skill/service tags on light backgrounds

Background #3f3f46, text #fafafa, border-radius 12px, padding 4px 8px, Cosmica 12px weight 500.

### Ember Badge (YC Marker)
**Role:** Y Combinator batch identifier on project cards and testimonials

Background #ff5a00, text #ffffff, border-radius 12px, padding 4px 8px, Cosmica 12px weight 600. Its use is exclusive to YC affiliation labels — never repurpose for generic status.

### Email Input + CTA Row
**Role:** Hero email capture form

Input: background #ffffff, text #333333, border transparent, border-radius 14px, padding 12px 12px 12px 16px, Cosmica 14px weight 400, placeholder text in #a1a1aa. Paired inline with a Primary Pill Button (Book demo) in a flex row.

### Announcement Banner
**Role:** Full-width notification strip above the nav

Background #222222 or near-black, rounded-rect pill shape at border-radius 48px, text white Cosmica 14px, with a ghost inline CTA link on the right. Uses backdrop-filter blur for a frosted dark treatment.

### Stat Number Block
**Role:** Key metric highlights (20 000+, 4 000+, 70%, 40%, 60%)

Large numeral at 40–56px Cosmica weight 700 in #09090b or #18181b. Descriptor label below at 12–14px weight 400 in #71717a. No card border — sits directly on section background for raw typographic emphasis.

## Do's and Don'ts

### Do
- Use border-radius 36px for all primary cards and portfolio tiles — this extreme rounding is the system's most recognizable surface trait.
- Apply the multi-layer button shadow (rgba(255,255,255,0.5) inset + rgba(117,123,133,0.4) inset + rgb(44,46,52) 1.5px ring + rgba(0,0,0,0.14) drop) only on the primary #09090b pill button — it defines the CTA's physicality.
- Reserve Ember (#ff5a00) exclusively for YC batch badges and Orchid Flash (#fe45e2) exclusively for single decorative card washes — these vivid colors derive their impact from appearing nowhere else.
- Use Cosmica weight 300–400 for lead-in words and weight 600–700 for the key noun/verb in the same line to create inline tonal contrast without changing size.
- Maintain a 4-step neutral surface stack (Mist → Snow → Fog → Obsidian) per page — don't introduce more than four background tones in a single section view.
- Apply border-radius 12px to all badge and tag components regardless of content length — pill tags use 10000px only for navigation-level controls.
- Use backdrop-filter blur (5–17px range) on overlaid panels and the announcement banner to create depth without hard shadows on light surfaces.

### Don't
- Don't use any color other than #09090b/#222222 for filled button backgrounds — the system has no chromatic CTA color; dark filled + white text is the only primary action pattern.
- Don't reduce card border-radius below 28px — smaller radii break the soft-container language and make surfaces read as generic rectangles.
- Don't introduce new typefaces — Cosmica's weight range handles all hierarchy; adding a second family destroys the single-voice typographic system.
- Don't apply drop shadows to cards — card depth is expressed through background color steps (#ffffff vs #ececee vs #09090b), not elevation shadows.
- Don't use #ff5a00 or #fe45e2 for UI states, hover effects, or repeated interface elements — their power is scarcity; repeated use collapses their impact.
- Don't use letter-spacing overrides on headlines — Cosmica's normal tracking at large sizes is a deliberate choice; tracked-out display text would clash with the type system.
- Don't place text directly on the vivid Orchid Flash (#fe45e2) card background at body size — it is a decorative wash only; any overlaid text must use display weight white.

## Elevation

- **Primary Action Button:** `rgba(255,255,255,0.5) 0px 0.5px 0px 0px inset, rgba(117,123,133,0.4) 0px 9px 14px -5px inset, rgb(44,46,52) 0px 0px 0px 1.5px, rgba(0,0,0,0.14) 0px 4px 6px 0px`
- **Card (inset bottom border):** `rgb(228,228,231) 0px 1px 0px 0px inset`
- **Card (subtle drop shadow):** `rgba(0,0,0,0.04) 0px 4px 12px 0px`

## Surfaces

- **Canvas** (`#f4f4f5`) — Page background and default section fill
- **Card White** (`#ffffff`) — Primary card surface on the canvas
- **Card Muted** (`#ececee`) — Secondary card or tag surface, slightly elevated feel against white
- **Dark Surface** (`#09090b`) — Dark card sections, filled button backgrounds, problem-statement panels

## Imagery

Awesomic uses full-bleed product and motion screenshots as portfolio tile fills — the work IS the image, with no lifestyle photography or human-context staging. Tiles are clipped to 36px rounded rectangles, giving raw screen captures a contained, curated feel. Video production tiles use dark cinematic stills (moody red neon on black) cropped tight to the 36px rounded container. Illustration and graphic-design work tiles show vibrant multi-color client deliverables framed inside the same tile shape, creating a gallery-wall effect. Icons throughout the UI are minimal, monochrome, single-stroke or flat fills at ~20px, never decorative. The system is imagery-dependent for the portfolio section but typography-dominant for all informational and conversion sections — roughly 60% text, 40% imagery across the full page.

## Layout

Max-width approximately 1200px, centered on the canvas (#f4f4f5). The hero is a 2-column split: large display headline left (weight 700, 56–64px) with an accented cycling word in a lighter tonal color, and a compact right column with subtext, email input, and CTA. Below the hero, a horizontal logo-strip scrolls client logos at full bleed. Subsequent sections alternate: white-canvas text+card layouts, then a full-width dark panel (#09090b) for problem-statement copy, back to a light canvas for social proof and stat blocks. The portfolio grid is a horizontal scroll row of tall rounded tiles rather than a static grid. Feature/benefit cards use a 2-3 column grid at 36px-radius white cards on the Mist canvas. Section vertical gaps are 80px; internal card padding 24–28px. Navigation is a sticky top bar at ~40px height with inline text links and a black pill 'Book demo' button at the right edge.

## Similar Brands

- **Designjoy** — Same subscription-design-service model with dark filled pill buttons and portfolio-tile-as-hero grid layout
- **Superside** — Full-bleed portfolio tiles, single-typeface system, and dark/light alternating section bands for a design marketplace
- **Arc.dev** — Near-black primary action buttons on white canvas with a graduated gray neutral scale and rounded card containers
- **Contra** — Talent marketplace with portfolio card grids using extreme rounded corners and minimal accent color against achromatic surfaces
- **Framer** — Custom typeface used at all sizes for full system consistency, large rounded cards, and dark filled CTA buttons on a light page
