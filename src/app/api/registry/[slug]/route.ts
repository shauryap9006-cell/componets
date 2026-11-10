import { promises as fs } from "fs";
import path from "path";
import { byId } from "@/kit/catalog";
import { clampPatch, fig } from "@/kit/spec";
import { site } from "@/site.config";

export const dynamic = "force-dynamic";
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

async function source(slug: string) {
  const dir = path.join(process.cwd(), "src");
  for (const f of FILES) {
    const txt = await fs.readFile(path.join(dir, "demos", `${f}.tsx`), "utf8").catch(() => "");
    let at = txt.indexOf(`// @plate ${slug}\n`);
    if (at < 0) at = txt.indexOf(`// @plate ${slug}\r\n`);
    if (at < 0) continue;
    const next = txt.indexOf("// @plate ", at + 10);
    const body = txt.slice(at, next < 0 ? undefined : next).trim();
    const pre = txt.slice(0, txt.indexOf("// @plate ")).trim();
    const kit = await fs.readFile(path.join(dir, "kit", "act.ts"), "utf8").catch(() => "");
    return { pre, body, kit };
  }
  return null;
}

async function respond(slug: string, values: Record<string, unknown>) {
  const spec = byId(slug); if (!spec) return new Response("Unknown plate.", { status: 404 });
  const src = await source(slug); if (!src) return new Response("Source not found.", { status: 404 });
  const v = { ...Object.fromEntries(spec.settings.map((s) => [s.key, s.def])), ...clampPatch(spec, values, true) };
  const fn = /export function (\w+)/.exec(src.body)?.[1] ?? "Detail";
  const out = `/* ${spec.name} — ${fig(spec.fig)} — ${site.name}
 * ${spec.tagline} ${spec.description}
 * World: ${spec.world} · Verb: ${spec.verb} · Author: ${spec.author}
 * Needs: React 19, Tailwind v4, and three CSS variables (--paper, --ink, --accent).
 * Wrap it in an element that sets: --ln (line px), --sp (speed multiplier), --ez (easing), --acc, --rad, --soft, --cap, --trk.
 */

// ───────── detail ─────────
${src.pre}

${src.body}

// ───────── usage, with these settings ─────────
// <div className="stage" style={{ "--ln": "${v.line}px", "--sp": "${(1 / Number(v.speed)).toFixed(2)}", "--ez": "cubic-bezier(0.16,1,0.3,1)", "--acc": "${v.accent ? "var(--accent)" : "var(--ink)"}", "--rad": "${v.corners}px", "--soft": "${v.soft}%", "--cap": "${v.cap}px", "--trk": "${v.trk}em" }}>
//   <${fn} v={${JSON.stringify(v)}} moment="rest" play={0} reduced={false} set={() => {}} />
// </div>

// ───────── @/kit/act (shared hooks) ─────────
${src.kit}
`;
  return new Response(out, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) { return respond((await ctx.params).slug, {}); }
export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const body = await req.json().catch(() => ({}));
  return respond((await ctx.params).slug, body?.values ?? {});
}
