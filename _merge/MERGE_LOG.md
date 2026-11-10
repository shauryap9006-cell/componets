# MERGE LOG

Tracking log for components imported into main UI library from source folders.

---

## Baseline
- Main library commit: `1952979`
- Branch: `merge/import-components`
- Pre-import backup: `C:\Users\shaur\Downloads\main_backup_pre_import`
- Starting plate count: 37 plates (FIG. 001 - FIG. 037)

---

## Batch 0: Pilot Batch
- Target: 5 components of diverse types (1 variant, 1 hold-action, 1 animated path data, 1 toggle switch, 1 counter)

### 1. perforated-ticket (Added as Variant)
- **Source**: `C:\Users\shaur\Downloads\hairline-ui-master-build\src\plates\post-rail.tsx`
- **Destination**: Variant of `FIG. 001 perforated-tear` in `src/kit/catalog1.ts` and `src/demos/a.tsx`
- **Decision**: Added as variant `Admission ticket` under `perforated-tear` with setting `style: "Ticket"`.
- **Adaptations**:
  - Maintained 100% backward compatibility for original `Stub` style.
  - Adapted ticket body, serial number, and tear stub to use standard `--ln`, `--rad`, `--sp`, `--ez`, and `--acc` CSS variables.
  - Integrated with `useAct`, keyboard Enter/Space, and reduced-motion.
- **Left out**: Sound effect (`blip()`) - main library relies on pure visual motion.

### 2. rubber-stamp (Imported as New Plate)
- **Source**: `C:\Users\shaur\Downloads\hairline-ui-master-build\src\plates\post-rail.tsx`
- **Destination**: `FIG. 038 rubber-stamp` in `src/kit/catalog3.ts` and `src/demos/g.tsx`
- **Decision**: Imported as new plate in Buttons / Confirmations (Customs & Bureaucracy).
- **Adaptations**:
  - Replaced S1 runtime hooks (`useM`, `useMoment`) with main's `useAct` and `DemoProps`.
  - Conic-gradient radial charging ring in accent color.
  - Double-struck imprint with configurable misregistration offset and stamp angle.
  - Keyboard hold (Space/Enter) and reset on click.
- **Left out**: Audio sound blip.

### 3. signal-lever (Imported as New Plate)
- **Source**: `C:\Users\shaur\Downloads\hairline-ui-master-build\src\plates\post-rail.tsx`
- **Destination**: `FIG. 039 signal-lever` in `src/kit/catalog3.ts` and `src/demos/g.tsx`
- **Decision**: Imported as new plate in Toggles (Railway).
- **Adaptations**:
  - Replaced S1 runtime with main's `useAct`.
  - SVG semaphore mast with rotating blade arm, mast rungs, and mechanical give on hover.
  - Keyboard toggle support with ArrowUp / ArrowDown / Enter.
- **Left out**: Audio sound blip.

### 4. plotter-sparkline (Imported as New Plate)
- **Source**: `C:\Users\shaur\Downloads\hairline-ui-master-build\src\plates\drawing-lab.tsx`
- **Destination**: `FIG. 040 plotter-sparkline` in `src/kit/catalog3.ts` and `src/demos/g.tsx`
- **Decision**: Imported as new plate in Data (Drawing Office).
- **Adaptations**:
  - Replaced S1 runtime with main's `useAct` and `rng`.
  - Progressive SVG path unroll with animated crosshair pen carriage.
  - Pointer and keyboard ArrowLeft/ArrowRight scrubber with tooltip readout.
  - Instant trace completion under reduced-motion.
- **Left out**: None.

### 5. tally-counter (Imported as New Plate)
- **Source**: `C:\Users\shaur\Downloads\hairline-ui-master-build\src\plates\control-sky.tsx`
- **Destination**: `FIG. 041 tally-counter` in `src/kit/catalog3.ts` and `src/demos/g.tsx`
- **Decision**: Imported as new plate in Counters (Control Room).
- **Adaptations**:
  - Replaced S1 runtime with main's `useAct`.
  - Rendered grouped 5-bar gate marks with organic vertical tilt and diagonal 5th strike.
  - Click to add, context menu / backspace / minus to remove.
  - Moment problem state ("MISCOUNT") in accent.
- **Left out**: Audio sound blip.

---

## Batch 1: Buttons, Toggles & Switches
- **envelope-card (Added as Variant)**: Merged as `"Pocket"` variant of FIG. 003 `envelope-flap` (Cards). Adds wax seal, official dispatch envelope style, and transit stamp.
- **punch-checkbox (Added as Variant)**: Merged as `"Manifest"` variant of FIG. 006 `ticket-punch` (Toggles). Adds multi-item customs checklist format with interactive punch holes.
- **queue-ticket (Imported as New Plate)**: FIG. 042 in `src/kit/catalog3.ts` and `src/demos/g.tsx`. Take-a-number dispenser with slide-out ticket and live queue length readout.
- **postage-meter (Imported as New Plate)**: FIG. 043 in `src/kit/catalog3.ts` and `src/demos/g.tsx`. Franking machine with rolling decimal odometer digit drums and keyboard step controls.
- **safety-interlock (Imported as New Plate)**: FIG. 044 in `src/kit/catalog3.ts` and `src/demos/g.tsx`. Industrial switch with hinged protective guard cover and arming mechanism.
- **signal-lamp (Imported as New Plate)**: FIG. 045 in `src/kit/catalog3.ts` and `src/demos/g.tsx`. Multi-state railway semaphore arm and illuminated aspect indicator (Clear / Caution / Stop).

---

## Batch 2: Loaders & Time
- **flip-clock (Added as Variant)**: Merged as `"Clock"` variant of FIG. 005 `split-flap` (Counters/Time). Renders split-flap station digital clock cards with pulsing separator colon.
- **counting-preloader (Imported as New Plate)**: FIG. 046 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Digital tabular percentage counter with synchronized progress track.
- **line-draw-loader (Imported as New Plate)**: FIG. 047 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Continuous rectangular SVG perimeter draw-in and draw-out without rewinding.
- **dot-wave-loader (Imported as New Plate)**: FIG. 048 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Nine-node baseline wave with mathematical sine wave oscillation.
- **clock-hand-loader (Imported as New Plate)**: FIG. 049 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Analog 12-step ticking railway pointer loader.
- **block-cursor-loader (Imported as New Plate)**: FIG. 050 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Monospace terminal command loader with blinking 12×20 block cursor.
- **sundial-clock (Imported as New Plate)**: FIG. 051 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Astronomical gnomon sun shadow clock with Roman numerals and UTC offset adjustment.
- **star-chart (Imported as New Plate)**: FIG. 052 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Celestial rating chart with interactive connecting constellation vector lines.
- **analog-clock (Imported as New Plate)**: FIG. 053 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Authentic Swiss station clock with baton indices, disc second hand, and 60-interval dial.
- **seven-segment (Imported as New Plate)**: FIG. 054 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Retro LED digital indicator with genuine unlit ghost bar contrast.
- **stopwatch (Imported as New Plate)**: FIG. 055 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Split-second mechanical chronograph with 60s central sweep and 30-min accumulator dial.
- **ticker-clock (Imported as New Plate)**: FIG. 056 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. Linear horizontal continuous time tape with center indicator needle.
- **film-leader (Imported as New Plate)**: FIG. 057 in `src/kit/catalog3.ts` and `src/demos/h.tsx`. SMPTE universal cinema countdown leader with 360° sweeping optical radial arm.

---

## Batch 3: Selectors, Inputs & Sliders
- **caliper-ruler (Added as Variant)**: Merged as `"Ruler"` variant of FIG. 010 `caliper-slider` (Sliders). Engraved drafting desk rule with sliding hairline optical runner cursor.
- **dimension-drafting (Added as Variant)**: Merged as `"Drafting"` variant of FIG. 011 `dimension-input` (Inputs). Architectural extension/witness lines with 45° corner tick cuts and baseline rule.
- **contact-tabs (Added as Variant)**: Merged as `"Tabs"` variant of FIG. 014 `contact-sheet` (Selectors). Film sleeve index tabs with active exposure notch.
- **detent-dial (Added as Variant)**: Merged as `"Dial"` variant of FIG. 018 `detent-knob` (Selectors). Continuous FM radio frequency dial with 280° sweep and high-density fine degree markings.
- **index-cabinet (Added as Variant)**: Merged as `"Cabinet"` variant of FIG. 019 `index-drawer` (Navigation). Oak library catalogue drawer casing with Dewey classification header.
- **fader-bank (Added as Variant)**: Merged as `"Bank"` variant of FIG. 025 `fader` (Sliders). Three-channel console mixer bank with companion channel meters and master level.
- **patch-bay (Imported as New Plate)**: FIG. 058 in `src/kit/catalog3.ts` and `src/demos/i.tsx`. Audio switchboard jackfield with catenary patch cords and live signal routing matrix.
- **teleprinter (Imported as New Plate)**: FIG. 059 in `src/kit/catalog3.ts` and `src/demos/i.tsx`. Teletype dispatch field with uppercase translation, baud status, and blinking block caret.
- **scrubbable-number (Imported as New Plate)**: FIG. 060 in `src/kit/catalog3.ts` and `src/demos/i.tsx`. Drafting value scrubber with horizontal drag capture, fine tick scale, and numeric readout.
- **combination-lock (Imported as New Plate)**: FIG. 061 in `src/kit/catalog3.ts` and `src/demos/i.tsx`. Triple-tumbler vault combination lock with interactive stepping and shackle unlock release.
- **protractor (Imported as New Plate)**: FIG. 062 in `src/kit/catalog3.ts` and `src/demos/i.tsx`. Semicircular 180° precision drafting protractor with sweeping cursor arm and digital degree readout.
- **file-dropzone (Imported as New Plate)**: FIG. 063 in `src/kit/catalog3.ts` and `src/demos/i.tsx`. Darkroom light table negative inspection tray with crop corners and metadata file receipt.
- **shortcut-recorder (Imported as New Plate)**: FIG. 064 in `src/kit/catalog3.ts` and `src/demos/i.tsx`. Mechanical keycap binding recorder with live keystroke capture and embossed tile aesthetic.

---

## Batch 4: Typography, Print & Media
- **misregister-heading (Added as Variant)**: Merged as `"Heading"` variant of FIG. 007 `misregister` (Print). Editorial title masthead with registration corner marks and CMYK chromatic shift.
- **halftone-avatar (Added as Variant)**: Merged as `"Avatar"` variant of FIG. 008 `halftone-dial` (Print). Circular halftone screen portrait mask with responsive pointer luminance.
- **ink-pull-dither (Added as Variant)**: Merged as `"Dither"` variant of FIG. 009 `ink-pull` (Loaders). Ordered Bayer 4×4 bitmap dither screen reveal.
- **width-specimen (Added as Variant)**: Merged as `"Specimen"` variant of FIG. 036 `width-axis` (Type). Multi-weight typographic specimen card displaying simultaneous variable width axis tracks.
- **scramble-decode (Imported as New Plate)**: FIG. 065 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Typographic cipher descrambler resolving random glyphs into clean letterforms.
- **rolling-numerals (Imported as New Plate)**: FIG. 066 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Mechanical digit roller with vertical reel scrolling and step controls.
- **outline-numerals (Imported as New Plate)**: FIG. 067 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Architectural zinc stencil numerals with bridge breaks and hairline outline stroke.
- **running-head (Imported as New Plate)**: FIG. 068 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Swiss editorial folio runner bar with dual page numbers and coordinate hairline rule.
- **ticker-tape (Imported as New Plate)**: FIG. 069 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Perforated paper tape reader with 5-channel Baudot punch marks and text stream.
- **kerning-rope (Imported as New Plate)**: FIG. 070 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Elastic catenary tension cord linking glyph side-bearings for precision kerning.
- **redline-diff (Imported as New Plate)**: FIG. 071 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Legal editorial revision plate with redline strikeout and approved superseding text.
- **misregistration-text (Imported as New Plate)**: FIG. 072 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. CMYK 4-plate color separation with pointer-driven chromatic plate misalignment.
- **sparkwords (Imported as New Plate)**: FIG. 073 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Tufte inline typographic sparkline glyph embedded directly within running prose.
- **type-on-grid (Imported as New Plate)**: FIG. 074 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Swiss modular typography grid with baseline ruler coordinates and column gutters.
- **dither-image (Imported as New Plate)**: FIG. 075 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Bayer 4×4 ordered matrix bitmap dither with interactive threshold illumination.
- **ascii-image (Imported as New Plate)**: FIG. 076 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. CRT phosphor character raster matrix mapping image luminance to monospaced glyph density.
- **scan-line-reveal (Imported as New Plate)**: FIG. 077 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Radar cathode ray tube raster wiper with continuous traveling electron beam.
- **before-after (Imported as New Plate)**: FIG. 078 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Photographic inspection split wiper with hairline divider curtain between raw negative and fixed print.
- **waveform-player (Imported as New Plate)**: FIG. 079 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Reel-to-reel magnetic tape head scrubber with 28-bar audio waveform and playhead cursor.
- **perforated-frame (Imported as New Plate)**: FIG. 080 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. 35mm film negative strip with rectangular sprocket drive holes and manufacturer edge rebate.
- **small-multiples (Imported as New Plate)**: FIG. 081 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Edward Tufte small multiples comparison grid sharing common baseline scales.
- **risograph-image (Imported as New Plate)**: FIG. 082 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Dual-drum Risograph press with Teal and Fluo Pink cylinders and multiply overprint mixing.
- **letterpress (Imported as New Plate)**: FIG. 083 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Deep letterpress cotton paper deboss with fiber relief shadow and typeset impression.
- **crop-frame (Imported as New Plate)**: FIG. 084 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Darkroom easel masking crop frame with 3:2, 4:3, 1:1, 16:9 ratio detents and rule-of-thirds grid.
- **tear-card (Imported as New Plate)**: FIG. 085 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Bulletin placard with perforated tear-off fringe tabs that tear away individually.
- **dossier (Imported as New Plate)**: FIG. 086 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Confidential archive folder sealed with dual rivet eyelets and figure-eight wrapping cord.
- **aperture-tip (Imported as New Plate)**: FIG. 087 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Optical camera iris tooltip rotating diaphragm leaves open to frame contextual annotation.
- **declaration-dialog (Imported as New Plate)**: FIG. 088 in `src/kit/catalog3.ts` and `src/demos/j.tsx`. Customs clearance modal dialog with itemized manifest and authorization stamp.





