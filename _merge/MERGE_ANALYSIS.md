# MERGE ANALYSIS — Phases 2 & 3
_Generated: 2026-11-10 · Read-only survey of all 7 sources._

---

## Source Identity Summary

| # | Folder | Stack | Kind | Status |
|---|--------|-------|------|--------|
| S1 | `hairline-ui-master-build` | Next.js 16 / React 19 / Tailwind v4 | **Evolved fork of main** — same plate/spec system, expanded to 30 plates, more advanced renderer | Complete code |
| S2 | `swiss-design-ui-library` | Vite + React + Tailwind | **Different paradigm** — component-per-category files, props-based, CSS files, `clsx`/`tailwind-merge` deps | Complete code |
| S3 | `swiss-design-component-library` | Vite + React + Tailwind | **Same paradigm as S2**, built registry with 43 components, includes Playwright tests | Complete code |
| S4 | `building-hairlineui-design-system` | Next.js / React / Tailwind | **Evolved fork of main** — same plate system, massively expanded (~115 specs), two registry files | Complete code |
| S5 | `hairline-ui-master-prompt` | Next.js 16 / React 19 / Tailwind v4 | **Sister fork of main** — same spec/plate system, 35 components, renderers in kit/ | Complete code |
| S6 | `swiss-design-component-library(1)` | Vite + React + Tailwind | **Different paradigm** — same as S2/S3 lineage, different subset (35 components) | Complete code |
| S7 | `swiss-design-component-library(2)` | Vite + React + Tailwind | **IDENTICAL to S3** — same src file list, same catalog.json structure | Duplicate of S3 |

> **S7 = S3 confirmed**: Same root-level JSON files, identical src directory structure.

---

## Two Distinct Paradigm Groups

### Group A — Plate / Spec system (compatible with main)
Sources S1, S4, S5. Same `ComponentSpec` interface, same `mk()` / `def()` pattern, same 8 Moments, same CSS variable approach. These can be adapted to main's exact contract.

### Group B — Props-based component library (different paradigm)
Sources S2, S3=S7, S6. Different stack: Vite, `clsx`, `tailwind-merge`, CSS modules/files, props-based variants. Components are standalone React components, not plate-spec objects. **Cannot be imported as plates** — the paradigm is incompatible. Would require writing spec entries from scratch (against Hard Rule #7).

> **Decision needed (Phase 4 Q1):** Group B sources need a ruling.

---

## Phase 2 — Source Health Checks

### SOURCE 1 — `hairline-ui-master-build`
**Stack:** Next.js 16.2 · React 19 · TypeScript strict · Tailwind v4 · No test runner
**Structure:** `src/plates/` (meta-a.ts, meta-b.ts, post-rail.tsx, drawing-lab.tsx, print-type.tsx, control-sky.tsx) + `src/lib/` (spec.ts, kit.ts, catalog.ts, codegen.ts)

**Plate list (30 plates):**

| Slug | Category | World | Motion | Maps to main? |
|------|----------|-------|--------|---------------|
| arrow-relay | Buttons | Railway | Subtle | ✓ ALREADY IN MAIN (fig 4) |
| split-flap | Data / Counters | Railway | Cinematic | ✓ ALREADY IN MAIN (fig 5) — renamed to "Split-Flap Board", category changed |
| perforated-ticket | Confirmations | Post Office | Active | ~ VARIANT of main's perforated-tear (fig 1) — drag mechanic vs click |
| rubber-stamp | Confirmations | Customs & Bureaucracy | Active | NEW — hold-to-confirm stamp mechanic, no equivalent in main |
| envelope-card | Overlays | Post Office | Cinematic | ~ VARIANT of main's envelope-flap (fig 3) — drag mechanic, disclosure vs card |
| postage-meter | Indicators | Post Office | Active | NEW — postal franking machine display |
| signal-lever | Toggles | Railway | Active | NEW — railway lever frame switch |
| queue-ticket | Buttons | Post Office | Active | NEW — take-a-number queue ticket dispenser |
| caliper-range | Sliders | Drawing Office | Subtle | ~ VARIANT of main's caliper-slider (fig 10) — enhanced range version |
| spirit-level | Toggles | Instrument Lab | Active | ✓ ALREADY IN MAIN (fig 16) |
| dimension-input | Inputs | Drawing Office | Subtle | ✓ ALREADY IN MAIN (fig 11) |
| rotary-knob | Selectors | Instrument Lab | Subtle | ~ VARIANT of main's detent-knob (fig 18) — improved |
| needle-gauge | Indicators | Instrument Lab | Active | ✓ ALREADY IN MAIN (fig 17) |
| plotter-sparkline | Data | Drawing Office | Cinematic | NEW — pen plotter data chart |
| section-cut | Disclosure | Drawing Office | Subtle | ✓ ALREADY IN MAIN (fig 12) |
| halftone-avatar | Print / Media | Darkroom | Active | ~ VARIANT of main's halftone-dial (fig 8) — applies to image, not field |
| misregister-heading | Print | Print Shop | Subtle | ~ VARIANT of main's misregister (fig 7) — interactive heading vs specimen |
| darkroom-develop | Media | Darkroom | Cinematic | ✓ ALREADY IN MAIN as "develop" (fig 13) |
| contact-sheet-tabs | Selectors | Darkroom | Subtle | ~ VARIANT of main's contact-sheet (fig 14) — tab variant |
| type-specimen | Type | Typesetter's Case | Active | ~ VARIANT of main's width-axis (fig 36) — full specimen vs slider |
| kerning-pair | Type | Typesetter's Case | Subtle | ✓ ALREADY IN MAIN (fig 35) |
| dithered-progress | Loaders | Darkroom | Active | ~ VARIANT of main's ink-pull (fig 9) — dither pattern progress |
| card-catalogue | Navigation | Library & Archive | Subtle | ~ VARIANT of main's index-drawer (fig 19) — card drawer for navigation |
| tally-counter | Counters | Control Room | Active | NEW — click-to-count tally with notch marks |
| patch-bay | Data | Music Studio | Subtle | NEW — cable patch bay routing display |
| annunciator | Feedback | Control Room | Active | ✓ ALREADY IN MAIN (fig 23) |
| sundial-clock | Time | Observatory & Weather | Subtle | NEW — gnomon sun position clock |
| star-chart | Data | Observatory & Weather | Cinematic | NEW — stellar cartography field |
| punch-checkbox | Toggles | Customs & Bureaucracy | Subtle | ~ VARIANT of main's ticket-punch (fig 6) — paperwork form checkbox |
| metronome-loader | Loaders | Music Studio | Active | ✓ ALREADY IN MAIN as "metronome" (fig 26) |

**Health:** Complete, TypeScript strict, correct Tailwind v4, same spec shape. `spec.ts` is evolved vs main's (more fields: `intent`, `concept`, `metaphor`, `states`, `motionTable`, `interaction`, `edge`). No broken imports found. Uses `@/lib/spec` instead of `@/kit/spec` — path alias difference only.

---

### SOURCE 2 — `swiss-design-ui-library`
**Stack:** Vite + React + TypeScript + Tailwind + `clsx` + `tailwind-merge`
**Structure:** `src/registry/{buttons,cards,navbars,sidebars,layout}/` with `component.tsx`, `demos.tsx`, `meta.ts`, `styles.css` per category.

**Component list (from registry index — categories with slugs):**

**Buttons (12):** arrow-relay, text-roll, hairline-wipe, ink-inversion, registration-marks, index-button, square-to-circle-morph, hold-to-confirm, shortcut-chip, dot-matrix-state, ruler-edge, weight-shift

**Cards (5):** contact-sheet-card, giant-numeral-card, hairline-row-stack, label-card, receipt-card, spec-sheet-card, specimen-card, swatch-chip-card

**Navbars (5):** elastic-rule-nav, index-nav, status-bar-nav, progress-hairline-nav, collapsing-wordmark-nav

**Sidebars (5):** typographic-sidebar, miller-columns, resizable-snap-sidebar, cursor-preview-menu, minimap-sidebar, inspector-sidebar

**Layout (varies):** hairline-divider, bleed-container, crop-marked-frame, gutter-label, grid-overlay, measurement-inspector, mosaic-reveal, ruler-toc

**Health:** Group B paradigm. Props-based, requires `clsx`/`tailwind-merge`, CSS files per component. Zod validation schema. Motion level: none/low/medium/high. a11y explicitly documented per component. **Paradigm mismatch with main.**

---

### SOURCE 3 — `swiss-design-component-library` (= SOURCE 7)
**Stack:** Vite + React + TypeScript + Tailwind + `clsx` + `tailwind-merge` + Playwright tests
**Structure:** `registry/{buttons,cards,navbars,sidebars,layout-primitives,inputs-forms,time-displays,generative}/` per-component folders with component.tsx + *.json bundles. Full browser audit, contrast check, Lighthouse mobile JSON.

**43 components:**

| Slug | Category | 
|------|----------|
| arrow-relay | buttons |
| dot-matrix-state | buttons |
| hairline-wipe | buttons |
| hold-to-confirm | buttons |
| index-button | buttons |
| ink-inversion | buttons |
| magnetic-dot | buttons |
| registration-marks | buttons |
| ruler-edge | buttons |
| shortcut-chip | buttons |
| split-cell | buttons |
| square-to-circle-morph | buttons |
| stacked-label | buttons |
| status-led | buttons |
| text-roll | buttons |
| weight-shift | buttons |
| crop-marked-card | cards |
| giant-numeral-card | cards |
| hairline-row-stack | cards |
| label-card | cards |
| receipt-card | cards |
| spec-sheet-card | cards |
| specimen-card | cards |
| swatch-chip-card | cards |
| moire-field | generative |
| ruler-slider | inputs-forms |
| bleed-container | layout-primitives |
| crop-marked-frame | layout-primitives |
| grid-baseline-overlay | layout-primitives |
| gutter-label | layout-primitives |
| hairline-divider | layout-primitives |
| measurement-inspector | layout-primitives |
| section-header | layout-primitives |
| spec-table | layout-primitives |
| breadcrumb-nav | navbars |
| elastic-rule-nav | navbars |
| index-nav | navbars |
| progress-hairline-nav | navbars |
| status-bar-nav | navbars |
| collapsible-rail | sidebars |
| miller-columns-sidebar | sidebars |
| typographic-sidebar | sidebars |
| split-flap-board | time-displays |

**Health:** Best-quality Group B source. Has real Playwright tests, Lighthouse audits, contrast checks. All components have complete `component.tsx`, proper a11y. Moire-field overlaps with main's fig 37. **Paradigm mismatch.**

---

### SOURCE 4 — `building-hairlineui-design-system`
**Stack:** Next.js / React / Tailwind — same as main's lineage
**Structure:** `src/registry/{specs-a.ts, specs-b.ts, demos/}` — massive expansion. specs-a has ~83 specs; specs-b has ~43 specs. Demos are in category files (`buttons.tsx`, `cards.tsx`, `inputs.tsx`, etc.)

**Notable plate list (specs-a, ~83 items):**
arrow-relay, text-roll, hairline-wipe, ink-inversion, registration-marks, index-button, square-to-circle, split-cell, hold-to-confirm, shortcut-chip, dot-matrix-state, ruler-edge, magnetic-dot, weight-shift, status-led, stacked-label, rubber-stamp, keycap, overprint-button, spec-sheet, contact-sheet, specimen-card, giant-numeral, mosaic-reveal, hairline-row-stack, receipt, swatch-chip, figure-plate, archive-drawer, duotone-reveal, diagonal-split, folio, data-card, crop-marked-card, label-card, exploded-view, section-cut, orthographic-card, split-flap-board, dot-matrix-display, flip-clock, analog-clock, world-clock-strip, tabular-countdown, year-progress-dots, seven-segment, stopwatch, dial-gauge, moire-field, bauhaus-generator, flow-field, cursor-bend-grid, dot-grid-lens, concentric-rings, isometric-grid, dithered-gradient, blueprint-grid, topographic-contours, crosshair-field, paper-grain, seismograph, pen-plotter, ruler-slider, caliper-input, spirit-level, rotary-dial, underline-field, ghost-combobox, odometer-stepper, year-in-dots, segmented-otp, mechanical-switch, oklch-plane, scrubbable-number, shortcut-recorder, file-dropzone, protractor, combination-lock, fader-bank, week-grid, punch-card, tally-counter, cable-patch, analog-time-picker, dual-thumb-scale

**specs-b (~43 items):** navigation, overlays, type, media, data, generative, heroes, templates items (index-nav, elastic-rule-nav, typographic-sidebar, miller-columns, various templates)

**Health:** Group A (plate-spec system). Very comprehensive. Some specs may be SPEC ONLY (templates, heroes). Demo files are large (40KB+). Many plates overlap with main and S1/S5. Some new: keycap, overprint-button, duotone-reveal, diagonal-split, flip-clock, analog-clock, seven-segment, stopwatch, dial-gauge, bauhaus-generator, flow-field, etc.

---

### SOURCE 5 — `hairline-ui-master-prompt`
**Stack:** Next.js 16 / React 19 / Tailwind v4 (same as main)
**Structure:** `src/lib/specs/index.ts` (SPECS array, 35 items) + `src/lib/kit/renderers-{a,b,c}.tsx`

**Plate list (35 items — from spec slugs found in renderers):**
arrow-relay, postmark, split-flap-toggle, spirit-level, ticket-punch, teleprinter, card-catalog, caliper, detent-dial, fader, interlock, elastic-tabs, leader-menu, tear-card, dossier, departure-board, due-date-list, customs-seal, registration-loader, film-leader, aperture-tip, declaration-dialog, signal-lamp, odometer, ticker-clock, needle-gauge, vu-meter, plotter-chart, seismograph, letterpress, type-specimen, developing-image, halftone-avatar, crop-frame, contact-sheet

**Mapping to main:**
- arrow-relay, postmark ≈ ALREADY IN MAIN (figs 4, 2)
- spirit-level, ticket-punch, caliper ≈ ALREADY IN MAIN
- detent-dial ≈ VARIANT of detent-knob (fig 18)
- fader ≈ ALREADY IN MAIN (fig 25)
- elastic-tabs ≈ VARIANT of elastic-rule (fig 22)
- leader-menu ≈ VARIANT of dotted-leader (fig 21)
- departure-board ≈ VARIANT of split-flap (fig 5)
- due-date-list ≈ VARIANT of due-date-slip (fig 20)
- odometer ≈ ALREADY IN MAIN (fig 24)
- needle-gauge ≈ ALREADY IN MAIN (fig 17)
- developing-image ≈ VARIANT of develop (fig 13)
- halftone-avatar ≈ VARIANT of halftone-dial (fig 8)
- contact-sheet ≈ ALREADY IN MAIN (fig 14) / VARIANT
- **NEW candidates:** teleprinter (novel input), card-catalog (drawer selector), interlock (safety switch pair), tear-card (tearable card reveal), dossier (folder reveal), customs-seal (hold-to-approve), registration-loader (progress loader with registration marks), film-leader (video/media leader), aperture-tip (tooltip), declaration-dialog (modal), signal-lamp (indicator), ticker-clock (time), vu-meter (audio indicator), plotter-chart (data viz), seismograph (live data), letterpress (type display), crop-frame (image)

**Health:** Group A (compatible with main). Spec system matches main's. Some SPEC ONLY items (declaration-dialog = modal, aperture-tip = tooltip). `src/lib/spec.ts` has richer ComponentSpec vs main's (adds `mechanisms`, `sentence`, `reducedPath`, `weightKb`, `concept`, `intent`).

---

### SOURCE 6 — `swiss-design-component-library(1)`
**Stack:** Vite + React + TypeScript + Tailwind
**Structure:** `src/registry/{buttons,cards,navbars,sidebars,layout}/` with component.tsx + demo.tsx per slug

**35 components:** (from registry index)
Buttons: arrow-relay, dot-matrix-state, hairline-wipe, hold-to-confirm, index-button, ink-inversion, registration-marks, ruler-edge, shortcut-chip, text-roll (10)
Cards: contact-sheet-card, figure-plate-card, giant-numeral-card, label-card, mosaic-reveal, receipt-card, spec-sheet-card, swatch-chip-card (8)
Navbars: elastic-rule-nav, index-nav, locale-flip-nav, progress-hairline-nav, status-bar-nav, vertical-spine-nav (6)
Sidebars: collapsible-rail, miller-columns, resizable-snap-sidebar, ruler-toc, tree-with-guides, typographic-sidebar (6)
Layout: bleed-container, crop-marked-frame, gutter-label, hairline-divider, measurement-inspector, section-header, spec-table (7) — wait, 37 total; some extra in full scan.

**Health:** Group B. Complete, same quality as S2/S3. Has `locale-flip-nav` and `vertical-spine-nav` not in S3. Has `tree-with-guides` not in S2. No test suite.

---

## Phase 3 — Comparison and Mapping

### Cross-source overlap analysis

**S3 = S7:** Identical (confirmed). Treat as one.
**S2 ⊂ S3:** S2 has 12 button components; S3 has all of them plus 31 more.
**S6 is between S2 and S3:** Contains locale-flip-nav, vertical-spine-nav, tree-with-guides (not in S3), misses some S3 items.

### Group A (Plate-spec) — Full mapping

> Legend: ✓ MAIN = already exists in main · V = ADD AS VARIANT · N = ADD NEW · ? = needs decision

| Slug | Best Source | Main fig | Decision | Notes |
|------|-------------|----------|----------|-------|
| arrow-relay | S1/S4/S5 | 004 | ✓ MAIN | Multiple richer versions exist |
| split-flap / split-flap-board | S1/S4/S5 | 005 | ✓ MAIN | Same concept |
| perforated-ticket | S1 | — | V → fig 1 (perforated-tear) | Drag-to-tear vs click-to-confirm; different gesture, same metaphor |
| rubber-stamp / hold-to-confirm | S1/S4 | — | N | Hold-to-approve mechanic; no equivalent |
| envelope-card | S1 | — | V → fig 3 (envelope-flap) | More animation states, disclosure vs card |
| postage-meter | S1 | — | N | Postal franking machine; unique |
| signal-lever | S1 | — | N | Railway interlocking lever |
| queue-ticket | S1 | — | N | Take-a-number dispenser |
| caliper-range / caliper | S1/S5 | 010 | V → fig 10 (caliper-slider) | Richer version of same caliper |
| spirit-level | S1/S5 | 016 | ✓ MAIN | Same |
| dimension-input | S1 | 011 | ✓ MAIN | Same |
| rotary-knob / detent-dial | S1/S5 | 018 | V → fig 18 (detent-knob) | Rotary knob vs detent-knob — same concept |
| needle-gauge | S1/S5 | 017 | ✓ MAIN | Same |
| plotter-sparkline / plotter-chart | S1/S5 | — | N | Pen-plotter data vis; unique |
| section-cut | S1 | 012 | ✓ MAIN | Same |
| halftone-avatar | S1/S5 | — | V → fig 8 (halftone-dial) | Avatar vs field; same halftone mechanic |
| misregister-heading | S1 | — | V → fig 7 (misregister) | Interactive heading vs specimen |
| darkroom-develop | S1 | 013 | ✓ MAIN | Same (develop) |
| contact-sheet-tabs | S1 | 014 | V → fig 14 (contact-sheet) | Tab selector vs grease-pencil |
| type-specimen | S1/S5 | — | V → fig 36 (width-axis) | Full font specimen vs single axis |
| kerning-pair | S1 | 035 | ✓ MAIN | Same |
| dithered-progress | S1 | — | V → fig 9 (ink-pull) | Dither pattern vs squeegee |
| card-catalogue / card-catalog | S1/S5 | 019 | V → fig 19 (index-drawer) | Card drawer selector vs guide-card tabs |
| tally-counter | S1/S4 | — | N | Clicker tally, different from odometer |
| patch-bay / cable-patch | S1/S4 | — | N | Cable routing display; unique |
| annunciator | S1 | 023 | ✓ MAIN | Same |
| sundial-clock | S1 | — | N | Gnomon sun clock; unique |
| star-chart | S1 | — | N | Stellar cartography; unique |
| punch-checkbox | S1/S4 | 006 | V → fig 6 (ticket-punch) | Paperwork form vs railway ticket |
| metronome-loader | S1 | 026 | ✓ MAIN | Same |
| postmark | S5 | 002 | ✓ MAIN | Same |
| teleprinter | S5 | — | N | Teleprinter/tape input; unique |
| interlock | S5 | — | N | Safety switch pair; unique |
| tear-card | S5 | — | N | Tearable reveal card |
| dossier | S5 | — | N | Folder reveal disclosure |
| customs-seal / rubber-stamp | S5/S1 | — | N (merge w/ rubber-stamp) | Hold-to-approve; group S1+S5 versions |
| registration-loader | S5 | — | N | Progress loader with reg marks |
| film-leader | S5 | — | N | Film/video leader countdown |
| aperture-tip | S5 | — | ? | Tooltip/iris — Tooltip may be out of scope for this library |
| declaration-dialog | S5 | — | ? | Modal — May be too complex/generic |
| signal-lamp | S5 | — | N | Panel indicator lamp |
| ticker-clock | S5 | — | N | Live rolling clock |
| vu-meter | S5 | — | N | Audio VU meter |
| seismograph | S4/S5 | — | N | Live seismograph waveform |
| letterpress | S5 | — | N | Letterpress type display |
| crop-frame | S5 | — | N | Darkroom crop overlay |
| keycap | S4 | — | N | Physical keyboard key chip |
| overprint-button | S4 | — | V → fig 1? | Overprinting button variant |
| duotone-reveal | S4 | — | N | Duotone image reveal |
| diagonal-split | S4 | — | N | Diagonal split card/before-after |
| flip-clock | S4 | — | V → fig 5 (split-flap) | Same mechanism, clock variant |
| analog-clock | S4 | — | N | Analogue clock face |
| seven-segment | S4 | — | N | LED seven-segment display |
| stopwatch | S4 | — | N | Stopwatch timer |
| dial-gauge | S4 | — | V → fig 17 (needle-gauge) | Dial variant with more controls |
| bauhaus-generator | S4 | — | N | Generative Bauhaus pattern |
| flow-field | S4 | — | N | Generative flow field |
| seismograph (S4) | S4 | — | N | Same as S5 |
| pen-plotter | S4 | — | V → plotter-sparkline (S1) | Same concept, group as one |
| ruler-slider | S4/S3 | 010/? | V → fig 10 (caliper-slider) | Ruler-based range slider |
| caliper-input | S4 | — | V → fig 11 (dimension-input) | Caliper-styled input |
| rotary-dial | S4 | 018 | V → fig 18 (detent-knob) | Rotary dial vs knob |
| underline-field | S4 | 011 | V → fig 11 (dimension-input) | Underline-only text field variant |
| odometer-stepper | S4 | 024 | V → fig 24 (odometer) | Stepper variant of odometer |
| mechanical-switch | S4 | — | V → fig 6 (ticket-punch) OR new | Mechanical switch plate |
| scrubbable-number | S4 | — | N | Click-drag to change number |
| shortcut-recorder | S4 | — | N | Record keyboard shortcut |
| file-dropzone | S4 | — | N | File drop zone |
| protractor | S4 | — | N | Protractor angle selector |
| combination-lock | S4 | — | N | Dial combination lock |
| fader-bank | S4 | — | V → fig 25 (fader) | Multi-fader bank |
| week-grid | S4 | — | N | Week view calendar grid |
| punch-card | S4 | — | N | Punched card data display |
| analog-time-picker | S4 | — | N | Clock-face time picker |
| dual-thumb-scale | S4 | — | N | Two-thumb range |
| (specs-b nav/overlay/type/media/data/template items) | S4 | — | ? | Most are SPEC ONLY or too generic |

---

### Group B (Props-based) — All sources

**Conclusion: Group B components cannot be directly imported as plates.**
- They require `clsx`, `tailwind-merge` dependencies (not in main)
- They use `component.tsx + styles.css` pattern — not `// @plate <id>` tagged
- They have no `ComponentSpec` / `mk()` structure
- Building a spec entry from scratch would violate Hard Rule #7

**However**, several Group B components are conceptually novel and their implementations could serve as a blueprint for a new SPEC ONLY entry that is then built from scratch. This requires a Phase 4 decision.

**Most valuable Group B concepts not in Group A:**
- `dot-matrix-state` (LED dot-matrix button with loading/success/error states)
- `text-roll` (letter-roll hover animation button)
- `hairline-wipe` (underline wipe button)
- `ink-inversion` (cursor-direction fill sweep button)
- `hold-to-confirm` (hold button — but S1 rubber-stamp covers this better)
- `shortcut-chip` (keyboard shortcut display button)
- `ruler-edge` (measurement ruler button)
- `weight-shift` (variable-font weight button)
- `magnetic-dot` (cursor magnet button)
- `registration-marks` (print registration mark button)
- `index-button` (numbered list button)
- `split-cell` (split/chevron cell button)
- `status-led` (indicator LED)
- `stacked-label` (stacked label chip)
- `square-to-circle-morph` (shape morphing button)
- **Cards:** hairline-row-stack, label-card, receipt-card, spec-sheet-card, specimen-card, swatch-chip-card, giant-numeral-card, crop-marked-card
- **Layout:** hairline-divider, bleed-container, gutter-label, measurement-inspector, section-header, spec-table, crop-marked-frame, grid-baseline-overlay
- **Nav:** elastic-rule-nav (overlaps main's elastic-rule fig 22), index-nav, progress-hairline-nav, status-bar-nav, typographic-sidebar, miller-columns, breadcrumb-nav, collapsible-rail
- **Special (S6-only):** locale-flip-nav (language switcher), vertical-spine-nav, tree-with-guides, ruler-toc
- **Split-flap-board** (time-displays) — overlaps main's split-flap (fig 5)

---

## Duplicate/Conflict Analysis

| Conflict | Between | Resolution |
|----------|---------|------------|
| arrow-relay | ALL sources | Already in main (fig 4). Skip all. |
| split-flap / split-flap-board | S1, S4, S5, S3 | Already in main (fig 5). Skip all. |
| spirit-level | S1, S5 | Already in main (fig 16). Skip all. |
| moire-field | S3, S4 | Already in main (fig 37). Skip all. |
| elastic-rule / elastic-rule-nav | S2, S3, S6, main | Already in main (fig 22). Skip Group B nav versions. |
| hold-to-confirm | S2, S3, S6, S1 rubber-stamp | Group A (rubber-stamp/S1) is richer; skip Group B hold-to-confirm. |
| halftone-avatar | S1, S5 | Group as variant of fig 8. Best source: S1. |
| dot-matrix-state | S2, S3, S6 | Group B only. Needs Phase 4 decision. |
| plotter-chart / plotter-sparkline | S1, S5 | Same concept. Best source: S1. One plate. |
| ruler-slider | S3, S4 | Group A version (S4) preferred. Maps to caliper-slider variant. |
| rubber-stamp / customs-seal | S1, S5 | Same concept. S1 is richer (more settings, full states). One plate. |
| flip-clock / split-flap | S4, S1/main | flip-clock → variant of main's split-flap (fig 5). |
| dial-gauge / needle-gauge | S4, main | dial-gauge → variant of main's needle-gauge (fig 17). |

---

## Counts Summary (for Phase 4)

| Source | Total plates | Already in main | Add as variant | Add new | Skip/TBD |
|--------|-------------|-----------------|----------------|---------|-----------|
| S1 | 30 | 10 | 7 | 13 | 0 |
| S4 (Group A, non-overlap) | ~50 new | 0 (already counted) | ~15 | ~20 | ~15 template/generic |
| S5 (Group A, non-overlap) | ~15 new | 0 | ~5 | ~8 | ~2 |
| S2 | 12+ | 1 (arrow-relay) | 0 | 0 | all (Group B) |
| S3=S7 | 43 | 2 (arrow-relay, moire-field) | 0 | 0 | all (Group B) |
| S6 | 35 | 2 | 0 | 0 | all (Group B) |

**Before:** 37 plates in main
**New (Group A only, conservative estimate):** ~35–40 new + ~25 variants = **~95–102 total plates**
**Group B decision pending:** 40+ additional conceptually novel items

---

## Open Questions for Phase 4

1. **Group B paradigm:** S2, S3=S7, S6 are props-based Vite components incompatible with main's plate/spec system. Options:
   - (a) SKIP ALL — they cannot be imported as plates and writing specs from scratch violates Rule #7
   - (b) SPEC ONLY — mark conceptually novel ones as "SPEC ONLY" and treat their source code as reference, writing a new plate that is inspired by them (this is effectively building new, may violate Rule #7)
   - (c) Pick a subset and ask you to approve building the spec entries
   - **Recommended: (a) SKIP ALL Group B.** The Group A sources alone provide ~35–40 new plates and ~25 variants. The question is whether you want any Group B work too.

2. **S4 template slugs** (tpl-studio, tpl-saas, tpl-docs, tpl-editorial etc.): These are page templates, not components. Skip entirely?
   - (a) Skip all tpl-* items
   - (b) Extract any reusable sub-components from them
   - **Recommended: (a) Skip.**

3. **S4 hero slugs** (giant-wordmark-hero, index-hero, poster-hero, dither-hero, flap-headline-hero, moire-hero, statement-hero, live-data-hero): Are these importable as plates, or too layout-specific?
   - (a) Skip — they are page-level, not component-level
   - (b) Import as a new "Heroes" or "Print" category
   - **Recommended: (a) Skip for now.**

4. **S4 loader slugs** (counting-preloader, line-draw-loader, dot-wave-loader, clock-hand-loader, block-cursor-loader): 5 new loader plates. All seem novel. Import all?
   - (a) Import all 5 (adds to Loaders category)
   - (b) Import best 2–3
   - **Recommended: (a) import all 5 — they are distinct mechanisms.**

5. **S4 overlay/dialog slugs** (anchor-popover, command-palette, edge-ticker, countdown-toast, snap-bottom-sheet, typographic-context-menu, exif-lightbox, link-hover-card): These are complex UI patterns (modals, tooltips). Import as a new "Overlays" category?
   - (a) Import all as new plates under a new "Overlays" category
   - (b) Skip — too generic/complex for this library's character
   - (c) Import only the most distinctive ones (countdown-toast, edge-ticker)
   - **Recommended: (c) Import only the most characterful ones.**

6. **S4 type/typography slugs** (scramble-decode, rolling-numerals, outline-numerals, running-head, ticker-tape, kerning-rope, redline-diff, misregistration-text, sparkwords, type-on-grid): New Type category plates. Import all?
   - (a) Import all — rich addition to the Type category
   - (b) Import best 5
   - **Recommended: (a) import all — they match the library's typographic character.**

7. **S4 media slugs** (dither-image, ascii-image, halftone-image, duotone-image, loupe, risograph-image, hatching-image, scan-line-reveal, before-after, slice-transition, grid-snap-trail, index-grid-gallery, contact-strip, waveform-player, minimal-video-controls, perforated-frame, small-multiples): New media processing plates. Import a subset?
   - (a) Import all
   - (b) Import the most distinctive: dither-image, ascii-image, risograph-image, hatching-image, loupe, scan-line-reveal, before-after, perforated-frame
   - **Recommended: (b) import the most characterful 8.**

8. **S4 data viz slugs** (heatmap-calendar, typographic-bars, line-chart-scrub, radial-tick-gauge, dumbbell-chart, hairline-treemap, ribbon-flow, leaderboard-flip, live-ticker-table, hatching-chart, isometric-stack, bullet-graph, slopegraph): Import all?
   - (a) Import all 13
   - (b) Import most distinctive: heatmap-calendar, radial-tick-gauge, hatching-chart, isometric-stack, bullet-graph, slopegraph
   - **Recommended: (a) import all — data viz is a category already in main.**

9. **Demo file placement (S4):** S4 has demos split into category files (`buttons.tsx`, `inputs.tsx`, etc.) — 12 files. Main uses `a.tsx`–`f.tsx`. Should we continue a–f naming or introduce category-named files for the new plates?
   - (a) Continue a–f (g.tsx, h.tsx, etc.)
   - (b) Switch to category names (buttons.tsx, etc.)
   - **Recommended: (a) continue a–f naming for consistency.**

10. **Naming convention for variants:** When a source calls a plate something different than main (e.g., S1's `rubber-stamp` vs S5's `customs-seal`), which name wins?
    - Convention: use the most descriptive/evocative name, not the library name
    - For rubber-stamp: `rubber-stamp` is clearer than `customs-seal`
    - **Recommended: use the name that best describes the physical metaphor.**

11. **New worlds:** Some S4/S5 plates reference worlds not yet in `site.config.ts` (e.g., some generative plates don't map to any existing room). Create new rooms, or fit into existing?
    - (a) Create new rooms for truly new worlds
    - (b) Fit everything into existing 12 rooms
    - **Recommended: (a) add rooms where genuinely needed; ask per batch.**

12. **S5 `aperture-tip` and `declaration-dialog`:** These are a tooltip and a modal — fundamentally different UX patterns. Skip?
    - (a) Skip — too generic
    - (b) Import as new plates (they have strong physical metaphors)
    - **Recommended: (b) import — aperture-tip has an iris-shutter metaphor, declaration-dialog has a customs form metaphor — both are characterful enough.**
