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


