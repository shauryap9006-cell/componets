import { site } from "@/site.config";

export type Moment = "rest" | "over" | "pressed" | "keyboard" | "busy" | "done" | "problem" | "off";
export const MOMENTS: Moment[] = ["rest", "over", "pressed", "keyboard", "busy", "done", "problem", "off"];
export const MOMENT_WORDS: Record<Moment, string> = { rest: "Rest", over: "Over", pressed: "Pressed", keyboard: "Keyboard", busy: "Busy", done: "Done", problem: "Problem", off: "Off" };
export type Val = number | string | boolean;
export type Values = Record<string, Val>;
export type Group = "Shape" | "Line" | "Fill" | "Type" | "Space" | "Movement" | "Content" | "Behavior" | "Works for everyone";
export type DetailClass = "a" | "b" | "c" | "d" | "e";
export const CLASS_WORDS: Record<DetailClass, string> = { a: "Micro-interaction", b: "Moment", c: "Type detail", d: "Edge case", e: "Keyboard" };

export interface Setting {
  key: string; group: Group; type: "range" | "choice" | "toggle" | "text";
  min?: number; max?: number; step?: number; safe?: [number, number]; unit?: string; options?: string[];
  def: Val; label: string; why: string; priority: 1 | 2 | 3;
}
export interface Part { n: number; name: string; role: string; loupe: string[] }
export interface Version { name: string; values: Values }
export interface Detail { cls: DetailClass; text: string }
export interface ComponentSpec {
  id: string; fig: number; name: string; category: string; world: string; verb: string;
  kind: "instrument" | "theatre" | "specimen"; uncommon: boolean; motion: "still" | "subtle" | "active" | "cinematic";
  tags: string[]; tagline: string; description: string; pitch: string;
  parts: Part[]; settings: Setting[]; versions: Version[]; details: Detail[];
  signature: { name: string; ms: number }; plateControl?: string; author: string;
}
export interface DemoProps { v: Values; moment: Moment; play: number; reduced: boolean; set: (k: string, v: Val) => void }

export const FEELS: Record<string, { ease: string; mul: number; say: string }> = {
  Mechanical: { ease: "steps(5, end)", mul: 0.9, say: "Clicks between positions." },
  Precise: { ease: "cubic-bezier(0.16, 1, 0.3, 1)", mul: 1, say: "Arrives fast, settles exactly." },
  Smooth: { ease: "cubic-bezier(0.76, 0, 0.24, 1)", mul: 1.15, say: "Eases in and out evenly." },
  Heavy: { ease: "cubic-bezier(0.7, 0, 0.2, 1)", mul: 1.6, say: "Slow to start, firm to stop." },
  Light: { ease: "cubic-bezier(0.2, 0.8, 0.2, 1)", mul: 0.7, say: "Quick and weightless." },
};

// SKIN + MOVEMENT layers every detail shares. These are the Kit's Good Ranges.
export const SHARED: Setting[] = [
  { key: "line", group: "Line", type: "range", min: 0.5, max: 4, step: 0.5, safe: [1, 2], unit: "px", def: 1, label: "Line weight", why: "Hairlines read as precision. Thick rules read as emphasis.", priority: 1 },
  { key: "size", group: "Shape", type: "range", min: 0.6, max: 1.6, step: 0.05, safe: [0.85, 1.3], unit: "×", def: 1, label: "Size", why: "Big enough for a thumb, small enough to stay quiet.", priority: 1 },
  { key: "speed", group: "Movement", type: "range", min: 0.25, max: 3, step: 0.05, safe: [0.5, 1.8], unit: "×", def: 1, label: "Speed", why: "Faster feels sharp. Slower feels deliberate.", priority: 1 },
  { key: "feel", group: "Movement", type: "choice", options: Object.keys(FEELS), def: "Precise", label: "Feel", why: "How a movement starts and stops.", priority: 1 },
  { key: "accent", group: "Fill", type: "toggle", def: true, label: "Use the accent", why: "One accent, used once, points at what matters.", priority: 2 },
  { key: "corners", group: "Shape", type: "range", min: 0, max: 12, step: 1, safe: [0, 2], unit: "px", def: 0, label: "Corners", why: "Square corners keep the drawing-office tone.", priority: 2 },
  { key: "soft", group: "Fill", type: "range", min: 25, max: 100, step: 5, safe: [55, 90], unit: "%", def: 65, label: "See-through", why: "How faint the quieter ink is. Too faint is unreadable.", priority: 2 },
  { key: "cap", group: "Type", type: "range", min: 8, max: 15, step: 1, safe: [10, 13], unit: "px", def: 11, label: "Caption size", why: "Captions whisper, but must still be read.", priority: 3 },
  { key: "trk", group: "Type", type: "range", min: 0, max: 0.2, step: 0.01, safe: [0.04, 0.12], unit: "em", def: 0.08, label: "Caption spacing", why: "Uppercase captions need air between letters.", priority: 3 },
  { key: "readout", group: "Type", type: "toggle", def: false, label: "Show a reading", why: "A small caption that reports the detail’s verb and figure.", priority: 2 },
  { key: "hint", group: "Works for everyone", type: "toggle", def: false, label: "Shortcut hint", why: "A visible keycap tells keyboard users what to press.", priority: 2 },
  { key: "pressDrop", group: "Behavior", type: "toggle", def: false, label: "Pressed look", why: "The whole detail drops one pixel while pressed.", priority: 3 },
  { key: "rtl", group: "Works for everyone", type: "toggle", def: false, label: "Right-to-left", why: "Mirrors direction for right-to-left languages.", priority: 3 },
  { key: "calm", group: "Works for everyone", type: "toggle", def: false, label: "Less movement", why: "The calm alternative: states change with a short fade.", priority: 2 },
];
const BASE_VERSIONS: Version[] = [
  { name: "Standard", values: {} },
  { name: "Quiet", values: { line: 1, soft: 55, accent: false, speed: 0.8 } },
  { name: "Bold", values: { line: 2, soft: 90, size: 1.15 } },
  { name: "Mechanical", values: { feel: "Mechanical", speed: 1.2 } },
  { name: "Heavy press", values: { feel: "Heavy", line: 2, pressDrop: true } },
  { name: "Featherweight", values: { feel: "Light", line: 1, size: 0.9, speed: 1.4 } },
];
const ADDON: Record<string, DetailClass> = { readout: "c", hint: "e", pressDrop: "a", rtl: "d" };

type Draft = Omit<ComponentSpec, "settings" | "versions" | "author" | "fig"> & { settings?: Setting[]; versions?: Version[] };
export function mk(fig: number, d: Draft): ComponentSpec {
  return { ...d, fig, author: site.author.name, settings: [...(d.settings ?? []), ...SHARED], versions: [...(d.versions ?? []), ...BASE_VERSIONS] };
}
export const R = (key: string, label: string, min: number, max: number, def: number, why: string, o: Partial<Setting> = {}): Setting =>
  ({ key, label, min, max, def, why, type: "range", group: "Shape", step: 1, safe: [min, max], priority: 1, ...o });
export const T = (key: string, label: string, def: string, why = "The words it carries."): Setting => ({ key, label, def, why, type: "text", group: "Content", priority: 1 });
export const C = (key: string, label: string, options: string[], def: string, why: string, group: Group = "Shape"): Setting => ({ key, label, options, def, why, type: "choice", group, priority: 1 });
export const B = (key: string, label: string, def: boolean, why: string, group: Group = "Behavior"): Setting => ({ key, label, def, why, type: "toggle", group, priority: 2 });

export const fig = (n: number, prefix = "") => `FIG. ${prefix}${String(n).padStart(3, "0")}`;
export const defaults = (s: ComponentSpec): Values => Object.fromEntries(s.settings.map((x) => [x.key, x.def]));
export const setting = (s: ComponentSpec, key: string) => s.settings.find((x) => x.key === key);

/** Validate a patch against the schema; clamp to Good Ranges unless Wild. Unknown keys are dropped. */
export function clampPatch(s: ComponentSpec, patch: Record<string, unknown>, wild = false): Values {
  const out: Values = {};
  for (const [k, raw] of Object.entries(patch ?? {})) {
    const st = setting(s, k); if (!st) continue;
    if (st.type === "range") {
      const n = Number(raw); if (!Number.isFinite(n)) continue;
      const [lo, hi] = wild ? [st.min!, st.max!] : st.safe ?? [st.min!, st.max!];
      const step = st.step ?? 1; out[k] = Number((Math.round(Math.min(hi, Math.max(lo, n)) / step) * step).toFixed(3));
    } else if (st.type === "choice") { if (typeof raw === "string" && st.options!.includes(raw)) out[k] = raw; }
    else if (st.type === "toggle") out[k] = raw === true || raw === "true";
    else out[k] = String(raw ?? "").slice(0, 60);
  }
  return out;
}
export function show(st: Setting, v: Val): string {
  if (st.type === "toggle") return v ? "ON" : "OFF";
  if (st.type === "range") return `${Number(v).toFixed(st.step && st.step < 1 ? (st.step < 0.1 ? 2 : 1) : 0)}${st.unit ? " " + st.unit : ""}`.toUpperCase();
  return String(v).toUpperCase();
}
export const describeChange = (s: ComponentSpec, k: string, a: Val, b: Val) => { const st = setting(s, k)!; return `${st.label.toUpperCase()}: ${show(st, a)} → ${show(st, b)}`; };

/** Instant verbs: deterministic macros over dials. No AI, no network. */
export function instant(s: ComponentSpec, v: Values, verb: string): { name: string; why: string; patch: Values } | null {
  const n = (k: string) => Number(v[k]); const order = ["Mechanical", "Precise", "Smooth"]; const w = verb.toLowerCase();
  const P = (name: string, why: string, patch: Record<string, unknown>) => ({ name, why, patch: clampPatch(s, patch) });
  if (/quiet|calm|subtle|simpler/.test(w)) return P("Quieter", "Fainter ink, thinner rules, no accent.", { soft: n("soft") - 10, line: n("line") - 0.5, accent: false });
  if (/loud|strong|punch/.test(w)) return P("Louder", "Fuller ink and the accent switched on.", { soft: n("soft") + 15, line: n("line") + 0.5, accent: true });
  if (/slow/.test(w)) return P("Slower", "Each movement takes longer.", { speed: n("speed") - 0.3 });
  if (/fast|quick|snappy/.test(w)) return P("Faster", "Each movement takes less time.", { speed: n("speed") + 0.3 });
  if (/thin|light|hairline/.test(w)) return P("Thinner", "Rules drop half a pixel.", { line: n("line") - 0.5 });
  if (/bold|thick|heav/.test(w)) return P("Bolder", "Rules gain half a pixel.", { line: n("line") + 0.5 });
  if (/tight|small|compact/.test(w)) return P("Tighter", "Smaller, with closer captions.", { size: n("size") - 0.1, trk: n("trk") - 0.02 });
  if (/air|big|large|roomy/.test(w)) return P("Airier", "Larger, with more air in captions.", { size: n("size") + 0.1, trk: n("trk") + 0.02 });
  if (/mechanic|click/.test(w)) return P("More mechanical", "Movement steps instead of gliding.", { feel: order[Math.max(0, order.indexOf(String(v.feel)) - 1)] ?? "Mechanical" });
  if (/smooth|gentle|soft/.test(w)) return P("Smoother", "Movement eases in and out.", { feel: order[Math.min(2, Math.max(0, order.indexOf(String(v.feel))) + 1)] });
  if (/everyone|access|keyboard/.test(w)) return P("Works for everyone", "A shortcut hint, readable ink, and a calm alternative.", { hint: true, soft: Math.max(70, n("soft")), size: Math.max(1, n("size")) });
  if (/shortcut|hint/.test(w)) return P("Shortcut hint", "Shows the key that replays it.", { hint: true });
  if (/read|caption|number/.test(w)) return P("Show a reading", "Adds a small caption that reports.", { readout: true });
  if (/press/.test(w)) return P("Pressed look", "Drops one pixel while pressed.", { pressDrop: true });
  return null;
}

/** Craft ring: which of the five detail classes the object deliberately has. */
export function craft(s: ComponentSpec, v: Values): Record<DetailClass, boolean> {
  const r: Record<DetailClass, boolean> = { a: false, b: false, c: false, d: false, e: false };
  s.details.forEach((d) => (r[d.cls] = true));
  Object.entries(ADDON).forEach(([k, c]) => { if (v[k]) r[c] = true; });
  return r;
}
export const ADDON_FOR: Record<DetailClass, { key: string; name: string; why: string }[]> = {
  a: [{ key: "pressDrop", name: "Pressed look", why: "It drops one pixel while pressed, so a press feels answered." }],
  b: [{ key: "calm", name: "Calm alternative", why: "Moments still change, with a short fade instead of travel." }],
  c: [{ key: "readout", name: "A reading", why: "A mono caption reports the figure and its verb." }],
  d: [{ key: "rtl", name: "Right-to-left", why: "Direction mirrors for right-to-left readers." }],
  e: [{ key: "hint", name: "Shortcut hint", why: "A keycap shows that R replays it." }],
};
export interface Issue { level: "amber" | "red"; say: string; fix: Values }
/** Health: at most three plain sentences, each with a fix. */
export function health(s: ComponentSpec, v: Values): Issue[] {
  const out: Issue[] = []; const n = (k: string) => Number(v[k]);
  if (n("soft") < 55) out.push({ level: "red", say: "Some ink is too faint to read.", fix: { soft: 60 } });
  if (n("size") < 0.85) out.push({ level: "amber", say: "It is small for a thumb.", fix: { size: 1 } });
  if (n("cap") < 10) out.push({ level: "red", say: "Captions are too small to read.", fix: { cap: 11 } });
  if (n("corners") > 2) out.push({ level: "amber", say: "Round corners break the Swiss rules.", fix: { corners: 0 } });
  if (n("line") > 2 || n("line") < 1) out.push({ level: "amber", say: "The line weight is outside the tested range.", fix: { line: n("line") > 2 ? 2 : 1 } });
  if (n("speed") > 1.8 || n("speed") < 0.5) out.push({ level: "amber", say: "The movement speed is outside the tested range.", fix: { speed: n("speed") > 1.8 ? 1.8 : 0.5 } });
  if (Object.values(craft(s, v)).filter(Boolean).length < 3) out.push({ level: "amber", say: "It has fewer than three kinds of detail.", fix: { readout: true, hint: true } });
  return out.slice(0, 3);
}

export function promptFor(s: ComponentSpec, v: Values, name = s.name): string {
  const changed = s.settings.filter((x) => v[x.key] !== undefined).map((x) => `- ${x.label}: ${show(x, v[x.key])} (${x.why})`).join("\n");
  return `Build “${name}”, ${s.kind === "instrument" ? "an" : "a"} ${s.kind} interface detail in React 19 + TypeScript + Tailwind v4.

CONCEPT. ${s.pitch}
WORLD. ${s.world}. VERB. ${s.verb}. One physical verb; the whole detail serves it.
TAGLINE. ${s.tagline}  DESCRIPTION. ${s.description}

ANATOMY
${s.parts.map((p) => `${p.n}. ${p.name} — ${p.role}`).join("\n")}

SETTINGS
${changed}

MOMENTS. Design all eight: rest, over, pressed, keyboard, busy, done, problem, off. Off is 40% ink and inert. Busy is a sweeping dot ticker. Done and Problem are mono stamps.
MOVEMENT. Feel “${v.feel}” (${FEELS[String(v.feel)]?.say ?? ""}) at ${v.speed}× speed. No bounce or overshoot. Signature moment: ${s.signature.name}, ${s.signature.ms} ms, replayed with R. Reduced motion: a 120 ms fade that still communicates state.

THE DETAILS
${s.details.map((d) => `(${d.cls}) ${CLASS_WORDS[d.cls]}: ${d.text}`).join("\n")}

RULES. Paper, ink and exactly one accent as CSS variables (--paper, --ink, --accent). Radius 0 unless geometry is the subject. 1px hairlines are the structure. Mono uppercase captions at ${v.cap}px, tracking +${v.trk}em, tabular figures. Translate the metaphor with lines, hatching and type; never textures, gradients or shadows. Keyboard reachable, focus-visible is a 2px accent outline, square. Survive long text, no data, RTL and touch.
Author: ${s.author}.`;
}
export const slugFig = (s: ComponentSpec) => String(s.fig).padStart(3, "0");
