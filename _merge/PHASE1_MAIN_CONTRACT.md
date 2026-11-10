# PHASE 1 — MAIN LIBRARY CONTRACT
_Generated: 2026-11-10 · Read-only analysis, no changes made to main._

---

## 1. Stack & Versions

| Item | Value |
|------|-------|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5.9.3 (strict mode, `allowJs: false`) |
| Runtime | React 19.2.6 / react-dom 19.2.6 |
| Styling | Tailwind CSS v4.1.17 + PostCSS 8.5.8 |
| Animation | Pure CSS transitions/animations via Stage CSS variables — **no external animation library** |
| DB / API | Drizzle ORM 0.45.2 + pg 8.20.0 (stats & takes API only) |
| AI | @anthropic-ai/sdk 1.7.0 (Bench/takes only) |
| Path alias | `@/*` → `./src/*` |
| Build commands | `next dev` · `next build` · `tsc --noEmit` · `eslint .` |
| Test setup | **None — no test runner or test files exist** |

---

## 2. Design Tokens (src/tokens.css + src/app/globals.css)

### CSS Custom Properties (available inside `.stage`)

#### Site/theme surface tokens
| Token | Description |
|-------|-------------|
| `--paper` | Background surface |
| `--paper-2` / `--plate` | Slightly darker background |
| `--ink` | Primary foreground |
| `--ink-2` | Secondary foreground |
| `--rule` | Divider/border grey |
| `--accent` | Single accent colour (varies by theme) |
| `--accent-ink` / `--on-accent` | Text on accent |

#### Stage-scoped drawing tokens (set by `Stage.tsx` from spec settings)
| Token | Description |
|-------|-------------|
| `--ln` | Line weight (px) — from `v.line` |
| `--sp` | Speed multiplier — from `feel.mul / v.speed` |
| `--ez` | Easing curve — from feel |
| `--acc` | Active accent or ink (toggled by `v.accent`) |
| `--rad` | Corner radius (px) — from `v.corners` |
| `--soft` | Faint-ink opacity (%) — from `v.soft` |
| `--cap` | Caption font size (px) — from `v.cap` |
| `--trk` | Caption letter-spacing (em) — from `v.trk` |

#### Typography
- `--f-sans`: Hanken Grotesk → Helvetica Neue fallback
- `--f-display`: Archivo → Hanken Grotesk fallback
- `--f-mono`: Courier Prime → IBM Plex Mono → Courier New

#### Spacing scale (8px baseline)
`--space-4` through `--space-192`; `--baseline: 8px`; `--gutter: 32px`; `--margin: 32px`

#### Duration scale
| Token | ms |
|-------|----|
| `--t1` / `--dur-micro` | 120ms |
| `--t2` / `--dur-ui` | 240ms |
| `--t3` / `--dur-layout` | 480ms |
| `--t4` / `--dur-reveal` | 800ms |
| `--stagger` | 24ms |

#### Themes (6 total)
`paper` · `newsprint` · `ink` · `concrete` · `bauhaus` · `blueprint`
Both light (paper, newsprint, concrete, bauhaus) and dark (ink, blueprint) covered.

#### Global reduced-motion
- CSS media query: `@media (prefers-reduced-motion: reduce)` zeroes all durations.
- JS `data-reduced-motion="true"` attribute on `.stage` also zeroes them.
- Stage uses `usePrefersReduced()` hook + `v.calm` setting.

---

## 3. Component Architecture

### Folder layout
```
src/
  kit/
    spec.ts        — ComponentSpec type, Setting helpers (mk, R, T, C, B), SHARED settings, promptFor()
    catalog.ts     — Assembles CATALOG from catalog1+catalog2; search(), nearest()
    catalog1.ts    — ComponentSpec definitions (figs 1–18 + 37)
    catalog2.ts    — ComponentSpec definitions (figs 19–36)
    act.ts         — Shared hooks: useAct, usePrefersReduced, useInView, useTick, useCopy, rng
    Stage.tsx      — The one renderer: injects CSS vars, scales to fit, renders Demo component
    Dial.tsx       — Workshop controls (range/choice/toggle/text); useWeights(); RollLabel
    yours.ts       — "Yours" localStorage store + fetchCode() + bump() + share encode/decode
  demos/
    a.tsx … f.tsx  — Hand-built React components, one per plate, tagged `// @plate <id>`
    index.ts       — DEMOS map: id → ComponentType<DemoProps>
  gallery/
    Gallery.tsx    — Main gallery page with search, filters, tabs, 5 view modes
    Plate.tsx      — Gallery card (Plate) + slide-out QuickView panel
    Modes.tsx      — IndexMode, WallMode, Projector views
  director/
    Director.tsx   — Page transitions + Cue link + foley sounds
  app/
    globals.css    — Tailwind import + all utility classes + keyframes
    layout.tsx     — Root layout
    page.tsx       — Home page
    gallery/page   — Gallery route
    detail/[slug]/ — Full detail view
    workshop/      — The Bench (AI + Dial workshop)
    embed/         — Iframe embed
    api/registry/[slug] — Copy-code endpoint (reads source, injects settings)
    api/stats/     — Copy counts (Drizzle/pg)
    api/takes/     — Bench AI takes endpoint
  tokens.css       — Standalone token file (also published for end-users)
  site.config.ts   — All copy, categories, themes, rooms, bench config
```

### How a component ("plate") is defined — `ComponentSpec`
```ts
interface ComponentSpec {
  id: string          // kebab-case, unique, used as URL slug & DEMOS key
  fig: number         // plate number (integer, sequential, never reused)
  name: string        // display name
  category: string    // one of site.categories[]
  world: string       // one of site.rooms[].world
  verb: string        // one-word action verb
  kind: "instrument" | "theatre" | "specimen"
  uncommon: boolean   // true = rarer detail, shown in Uncommon filter
  motion: "still" | "subtle" | "active" | "cinematic"
  tags: string[]
  tagline: string     // ALL CAPS, printed on card
  description: string // 1–2 sentences
  pitch: string       // longer description for Bench prompt
  parts: Part[]       // anatomy of the component
  settings: Setting[] // dials (component-specific + SHARED appended by mk())
  versions: Version[] // named presets (component-specific + BASE_VERSIONS appended by mk())
  details: Detail[]   // craft ring items, type a–e
  signature: { name: string; ms: number }  // the replay-able signature moment
  plateControl?: string   // optional: which setting key the plate-card scrubber controls
  author: string
}
```

### How a demo component is built
- Lives in `src/demos/a.tsx` through `f.tsx`
- Marked with `// @plate <id>` comment (used by registry API for Copy code)
- Receives `DemoProps`: `{ v: Values; moment: Moment; play: number; reduced: boolean; set: (k,v)=>void }`
- Uses `useAct(p, ms)` for unified hover/press/sig/off states
- Uses CSS classes: `.m` (mono caption), `.soft` (faint ink), `.ln` (SVG stroke), `.tr` (transition), `.hatch`, `.hatch-acc`, `.key`
- Draws with hairlines, hatching, type — **no shadows, gradients, or external SVG icons**

### Props / variants / sizes pattern
- No React prop-based variant system (no `variant="outline"`)
- Variants are expressed through **Settings** (`v.feel`, `v.accent`, named Versions)
- Sizes controlled via `v.size` (0.6–1.6×, safe 0.85–1.3×) through Stage's scale
- All eight Moments rendered by one component: `rest|over|pressed|keyboard|busy|done|problem|off`
- `plateControl` on the spec enables a live scrubber on the gallery card

---

## 4. MAIN LIBRARY CONTRACT — Checklist for a Native Plate

A component counts as native if and only if it has ALL of the following:

### A. Spec entry (`catalog1.ts` or `catalog2.ts` via `mk()`)
- [ ] Unique `id` (kebab-case)
- [ ] Unique sequential `fig` number (next available integer)
- [ ] `name`, `category`, `world`, `verb`, `kind`, `uncommon`, `motion`
- [ ] `tags[]`, `tagline`, `description`, `pitch`
- [ ] `parts[]` with `n, name, role, loupe[]`
- [ ] Component-specific `settings[]` (R/T/C/B helpers); SHARED appended by `mk()`
- [ ] Component-specific `versions[]`; BASE_VERSIONS appended by `mk()`
- [ ] `details[]` covering at least 3 of the 5 detail classes (a–e); 4+ preferred
- [ ] `signature: { name, ms }` for the R-key replay
- [ ] `plateControl?` if the card should have a live scrubber
- [ ] `author` (auto-set by `mk()`)

### B. Demo component (`src/demos/*.tsx`)
- [ ] `"use client"` at top
- [ ] Marked `// @plate <id>` immediately before the `export function`
- [ ] Accepts `DemoProps` signature
- [ ] Uses `useAct(p, ms)` for moment/hover/press/sig/off
- [ ] Implements all 8 moments visually
- [ ] Tokens only — no hardcoded colours, fonts, or sizes (uses `--ln`, `--acc`, `--rad`, `--soft`, `--cap`, `--trk`, `--sp`, `--ez`)
- [ ] `data-part="n"` attributes on each named part
- [ ] Keyboard accessible (focus, Enter/Space, arrow keys where appropriate)
- [ ] `aria-label`, `aria-pressed`, or `role` on interactive elements
- [ ] Reduced-motion respected (`p.reduced` flag or `--sp` zeroed)
- [ ] RTL safe (uses `--rtl` or `dir` from Stage)
- [ ] Survives long text, no data, and touch

### C. DEMOS map registration (`src/demos/index.ts`)
- [ ] Added to `DEMOS` object: `"<id>": File.ComponentName`
- [ ] Import added to the correct file (a–f) or a new file added with import in index.ts

### D. Registry/API (auto-served, no extra file needed)
- [ ] `// @plate <id>` comment means Copy code works automatically
- [ ] The copied code must be self-contained (component + kit hooks)

### E. Gallery features (auto from spec + Stage)
- [ ] Plate card rendered with fig number, tagline, uncommon marker, KB weight
- [ ] Live Stage demo on hover/in-view
- [ ] Replay button (↻) triggers `play` counter → `useAct` signature
- [ ] `plateControl` scrubber on card (if set)
- [ ] Copy code button (fetches from API)
- [ ] Copy prompt button (calls `promptFor()`)
- [ ] Category tab, weight filter, motion filter, uncommon filter
- [ ] Quick view (moment cycle, 7 dials, props table with Weight/Depends/Motion/World)
- [ ] Full detail page at `/detail/<id>`

### F. Keyboard & a11y (auto from Stage + correct ARIA)
- [ ] `data-plate` attribute on `<article>` → arrow-key navigation in gallery
- [ ] `c` → copy code, `p` → copy prompt, `r` → replay, Enter → open detail
- [ ] `focus-visible` 2px accent outline
- [ ] `prefers-reduced-motion` handled globally

### G. Theming (auto from CSS variables)
- [ ] Works in all 6 themes (paper, newsprint, ink, concrete, bauhaus, blueprint)
- [ ] No hardcoded colour values anywhere

---

## 5. MAIN_INVENTORY — 37 existing plates

> Source: catalog1.ts (figs 1–18, 37) + catalog2.ts (figs 19–36)

| Fig | ID | Name | Category | World | Motion | Uncommon |
|-----|----|------|----------|-------|--------|----------|
| 001 | perforated-tear | Perforated Tear | Buttons | Post Office | active | ✓ |
| 002 | postmark | Postmark | Feedback | Post Office | active | ✓ |
| 003 | envelope-flap | Envelope Flap | Cards | Post Office | cinematic | ✓ |
| 004 | arrow-relay | Arrow Relay | Buttons | Railway | subtle | ✓ |
| 005 | split-flap | Split Flap | Counters | Railway | cinematic | ✓ |
| 006 | ticket-punch | Ticket Punch | Toggles | Railway | subtle | ✓ |
| 007 | misregister | Misregister | Print | Print Shop | subtle | ✓ |
| 008 | halftone-dial | Halftone Screen | Print | Print Shop | active | ✓ |
| 009 | ink-pull | Ink Pull | Loaders | Print Shop | active | ✓ |
| 010 | caliper-slider | Caliper Slider | Sliders | Drawing Office | subtle | ✓ |
| 011 | dimension-input | Dimension Input | Inputs | Drawing Office | subtle | ✓ |
| 012 | section-cut | Section Cut | Disclosure | Drawing Office | subtle | ✗ |
| 013 | develop | Developer Tray | Media | Darkroom | cinematic | ✓ |
| 014 | contact-sheet | Grease Pencil | Selectors | Darkroom | subtle | ✓ |
| 015 | shutter-toggle | Aperture Switch | Toggles | Darkroom | active | ✓ |
| 016 | spirit-level | Spirit Level | Toggles | Instrument Lab | active | ✓ |
| 017 | needle-gauge | Needle Gauge | Indicators | Instrument Lab | active | ✓ |
| 018 | detent-knob | Detent Knob | Selectors | Instrument Lab | subtle | ✓ |
| 019 | index-drawer | Index Drawer | Navigation | Library & Archive | subtle | ✓ |
| 020 | due-date-slip | Due Date Slip | Time | Library & Archive | subtle | ✓ |
| 021 | dotted-leader | Dotted Leader | Data | Library & Archive | subtle | ✗ |
| 022 | elastic-rule | Elastic Rule | Navigation | Control Room | subtle | ✗ |
| 023 | annunciator | Annunciator | Feedback | Control Room | active | ✓ |
| 024 | odometer | Odometer | Counters | Control Room | active | ✗ |
| 025 | fader | Channel Fader | Sliders | Music Studio | active | ✗ |
| 026 | metronome | Metronome | Loaders | Music Studio | active | ✓ |
| 027 | step-sequencer | Step Sequencer | Data | Music Studio | active | ✓ |
| 028 | comb-field | Comb Field | Inputs | Customs & Bureaucracy | subtle | ✓ |
| 029 | barcode-scan | Barcode Scan | Loaders | Customs & Bureaucracy | active | ✓ |
| 030 | strike-out | Strike Out | Selectors | Customs & Bureaucracy | subtle | ✓ |
| 031 | barograph | Barograph | Data | Observatory & Weather | cinematic | ✓ |
| 032 | compass-bearing | Bearing | Indicators | Observatory & Weather | active | ✓ |
| 033 | moon-phase | Moon Phase | Time | Observatory & Weather | subtle | ✓ |
| 034 | composing-stick | Composing Stick | Type | Typesetter's Case | cinematic | ✓ |
| 035 | kerning-pair | Kerning Pair | Type | Typesetter's Case | subtle | ✓ |
| 036 | width-axis | Width Axis | Type | Typesetter's Case | active | ✓ |
| 037 | moire-field | Moiré Field | Print | Print Shop | active | ✓ |

**Total: 37 plates**  
**Next available fig number: 38**

---

## 6. Categories in use

`Buttons` · `Toggles` · `Inputs` · `Sliders` · `Selectors` · `Navigation` · `Indicators` · `Loaders` · `Counters` · `Cards` · `Disclosure` · `Feedback` · `Data` · `Time` · `Type` · `Print` · `Media`

## 7. Worlds in use

Post Office · Railway · Print Shop · Drawing Office · Darkroom · Instrument Lab · Library & Archive · Control Room · Music Studio · Customs & Bureaucracy · Observatory & Weather · Typesetter's Case

## 8. Lint / Typecheck / Build / Test setup

| Command | Config |
|---------|--------|
| `npm run lint` | ESLint 9, eslint-config-next/core-web-vitals (flat config) |
| `npm run typecheck` | `tsc --noEmit` strict mode |
| `npm run build` | `next build` |
| `npm run dev` | `next dev` |
| Tests | **None** — no test runner configured |

## 9. Git status

- Git repo exists (`master` branch, **no commits yet** — empty repo)
- All files are untracked
- Plan: create branch `merge/import-components`, make initial commit, then proceed

## 10. Key constraints noted for import

1. **No external animation library** — all animation is CSS transitions via Stage CSS vars.
2. **No component-level CSS files** — styling is done via Tailwind utility classes + global CSS utility classes in `globals.css`.
3. **No variant prop system** — variants are Settings (dials) on the spec, not React props.
4. **Copy code is source-extracted** — the `// @plate <id>` comment is the registry hook; it must be present and the function must be `export function`.
5. **fig numbers must be sequential integers** — fig 38 is next.
6. **Worlds must exist in `site.config.ts` `rooms` array** — a new world requires adding a room entry.
7. **Categories must exist in `site.config.ts` `categories` array** — a new category requires adding it there.
8. **Source files for demos are plain single-file** — no sub-folders; files are `a.tsx`–`f.tsx`; a new file (e.g., `g.tsx`) requires a new import in `index.ts` and a constant in the registry route's `FILES` array.
