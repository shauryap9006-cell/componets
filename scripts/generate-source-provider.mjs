import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const dir = path.join(process.cwd(), "src");
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];
const actSource = fs.readFileSync(path.join(dir, "kit", "act.ts"), "utf8").trim();

const plates = {};
const weights = {};

for (const f of FILES) {
  const fileContent = fs.readFileSync(path.join(dir, "demos", `${f}.tsx`), "utf8");
  const firstPlateIdx = fileContent.indexOf("// @plate ");
  if (firstPlateIdx < 0) continue;
  const pre = fileContent.slice(0, firstPlateIdx).trim();

  const regex = /\/\/ @plate ([^\r\n]+)/g;
  let match;
  const matches = [];
  while ((match = regex.exec(fileContent)) !== null) {
    matches.push({ id: match[1].trim(), index: match.index });
  }

  for (let i = 0; i < matches.length; i++) {
    const { id, index } = matches[i];
    const nextIndex = i + 1 < matches.length ? matches[i + 1].index : undefined;
    const body = fileContent.slice(index, nextIndex).trim();
    const fnMatch = /export function (\w+)/.exec(body);
    const fn = fnMatch ? fnMatch[1] : "Detail";

    plates[id] = { fn, pre, body };
    const gz = zlib.gzipSync(Buffer.from(body, "utf8"));
    weights[id] = gz.length;
  }
}

const outputFile = path.join(dir, "kit", "source-provider.ts");

const header = `// Auto-generated pre-compiled in-process plate source provider.
import type { ComponentSpec, Values } from "./spec";
import { clampPatch, fig } from "./spec";
import { site } from "@/site.config";

export interface PlateSource {
  fn: string;
  pre: string;
  body: string;
}

export const ACT_SOURCE = ${JSON.stringify(actSource)};

export const PLATE_WEIGHTS: Record<string, number> = ${JSON.stringify(weights, null, 2)};

export const PLATE_SOURCES: Record<string, PlateSource> = ${JSON.stringify(plates, null, 2)};

export function getPlateSource(slug: string): PlateSource | null {
  return PLATE_SOURCES[slug] ?? null;
}

export function generatePlateCode(spec: ComponentSpec, values: Record<string, unknown> = {}): string | null {
  const src = PLATE_SOURCES[spec.id];
  if (!src) return null;
  const v = { ...Object.fromEntries(spec.settings.map((s) => [s.key, s.def])), ...clampPatch(spec, values, true) };
  const fn = src.fn || "Detail";
  return \`/* \${spec.name} — \${fig(spec.fig)} — \${site.name}
 * \${spec.tagline} \${spec.description}
 * World: \${spec.world} · Verb: \${spec.verb} · Author: \${spec.author}
 * Needs: React 19, Tailwind v4, and three CSS variables (--paper, --ink, --accent).
 * Wrap it in an element that sets: --ln (line px), --sp (speed multiplier), --ez (easing), --acc, --rad, --soft, --cap, --trk.
 */

// ───────── detail ─────────
\${src.pre}

\${src.body}

// ───────── usage, with these settings ─────────
// <div className="stage" style={{ "--ln": "\${v.line}px", "--sp": "\${(1 / Number(v.speed)).toFixed(2)}", "--ez": "cubic-bezier(0.16,1,0.3,1)", "--acc": "\${v.accent ? "var(--accent)" : "var(--ink)"}", "--rad": "\${v.corners}px", "--soft": "\${v.soft}%", "--cap": "\${v.cap}px", "--trk": "\${v.trk}em" }}>
//   <\${fn} v={\${JSON.stringify(v)}} moment="rest" play={0} reduced={false} set={() => {}} />
// </div>

// ───────── @/kit/act (shared hooks) ─────────
\${ACT_SOURCE}
\`;
}
`;

fs.writeFileSync(outputFile, header, "utf8");
console.log("Successfully wrote", outputFile, "with", Object.keys(plates).length, "plates.");
