"use client";
import { useEffect, useState } from "react";
import { press, useCopy } from "@/kit/act";
import { Dial, RollLabel } from "@/kit/Dial";
import { Stage } from "@/kit/Stage";
import { type ComponentSpec, type DetailClass, type Moment, type Val, type Values, CLASS_WORDS, MOMENTS, MOMENT_WORDS, craft, defaults, fig, promptFor, setting, show } from "@/kit/spec";
import { type Yours, bump, encodeShare, fetchCode, restyle } from "@/kit/yours";
import { site } from "@/site.config";

export interface Take { name: string; why: string; patch: Values; spec?: ComponentSpec }
export const SKIN = ["line", "corners", "accent", "soft", "cap", "trk"], MOVE = ["speed", "feel"];
/** House styles: what a plate lends when you Borrow its Look or Movement. */
export const WORLD_STYLE: Record<string, Values> = {
  "Post Office": { line: 1.5, soft: 70, feel: "Heavy", speed: 0.9, cap: 11, trk: 0.08, accent: true, corners: 0 },
  Railway: { line: 1, soft: 65, feel: "Mechanical", speed: 1.3, cap: 11, trk: 0.1, accent: true, corners: 0 },
  "Print Shop": { line: 2, soft: 85, feel: "Heavy", speed: 0.8, cap: 12, trk: 0.06, accent: true, corners: 0 },
  "Drawing Office": { line: 1, soft: 60, feel: "Precise", speed: 1, cap: 10, trk: 0.1, accent: true, corners: 0 },
  Darkroom: { line: 1, soft: 55, feel: "Smooth", speed: 0.6, cap: 10, trk: 0.12, accent: false, corners: 0 },
  "Instrument Lab": { line: 1, soft: 70, feel: "Precise", speed: 1.1, cap: 11, trk: 0.08, accent: true, corners: 0 },
  "Library & Archive": { line: 1, soft: 60, feel: "Light", speed: 1.2, cap: 11, trk: 0.06, accent: false, corners: 0 },
  "Control Room": { line: 2, soft: 80, feel: "Mechanical", speed: 1.5, cap: 12, trk: 0.1, accent: true, corners: 0 },
  "Music Studio": { line: 1.5, soft: 75, feel: "Smooth", speed: 1.4, cap: 11, trk: 0.08, accent: true, corners: 2 },
  "Customs & Bureaucracy": { line: 1.5, soft: 75, feel: "Heavy", speed: 0.7, cap: 12, trk: 0.04, accent: false, corners: 0 },
  "Observatory & Weather": { line: 1, soft: 60, feel: "Smooth", speed: 0.5, cap: 10, trk: 0.12, accent: true, corners: 0 },
  "Typesetter’s Case": { line: 1, soft: 65, feel: "Precise", speed: 1, cap: 12, trk: 0.1, accent: true, corners: 0 },
};
export const pickKeys = (v: Values, keys: string[]) => Object.fromEntries(keys.filter((k) => v[k] !== undefined).map((k) => [k, v[k]]));

export function CraftRing({ spec, values }: { spec: ComponentSpec; values: Values }) {
  const c = craft(spec, values), keys = Object.keys(c) as DetailClass[];
  return (
    <svg width="28" height="28" viewBox="-14 -14 28 28" aria-hidden>
      {keys.map((k, i) => { const a0 = (i / 5) * Math.PI * 2 - Math.PI / 2 + 0.12, a1 = ((i + 1) / 5) * Math.PI * 2 - Math.PI / 2 - 0.12, r = 11; return <path key={k} d={`M${Math.cos(a0) * r} ${Math.sin(a0) * r} A${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r}`} fill="none" stroke={c[k] ? "var(--accent)" : "currentColor"} strokeWidth={c[k] ? 3 : 1} strokeDasharray={c[k] ? undefined : "1 2"} />; })}
      <text y="4" textAnchor="middle" fontSize="10" fontFamily="var(--f-mono)" fill="currentColor">{keys.filter((k) => c[k]).length}</text>
    </svg>
  );
}
export function CraftList({ spec, values, onPropose }: { spec: ComponentSpec; values: Values; onPropose: (c: DetailClass) => void }) {
  const c = craft(spec, values);
  return <ul className="flex flex-col">{(Object.keys(c) as DetailClass[]).map((k) => <li key={k} className="cap flex h-12 items-center justify-between gap-6 border-b border-ink/30"><span className="flex items-center gap-2"><i className="block size-2" style={{ background: c[k] ? "var(--accent)" : "transparent", outline: "1px solid var(--ink)" }} />{CLASS_WORDS[k]}</span>{c[k] ? <span className="opacity-60">Present</span> : <button className="chip" onClick={() => onPropose(k)}>Propose →</button>}</li>)}</ul>;
}

/** The Loupe: at most five dials for the selected part. Everything else is behind More. */
export function Loupe({ spec, part, values, onPeek, onCommit, onAll, onClose }: { spec: ComponentSpec; part: number; values: Values; onPeek: (p: Values | null) => void; onCommit: (k: string, v: Val) => void; onAll: () => void; onClose: () => void }) {
  const [more, setMore] = useState(false);
  const p = spec.parts.find((x) => x.n === part)!;
  const extra = spec.settings.filter((s) => s.priority <= 2 && !p.loupe.includes(s.key)).map((s) => s.key);
  const keys = more ? [...p.loupe, ...extra].slice(0, 12) : p.loupe.slice(0, 5);
  useEffect(() => setMore(false), [part]);
  return (
    <div className="up-in flex max-h-full w-full flex-col border border-ink bg-paper sm:w-[300px]" role="group" aria-label={`Tools for ${p.name}`}>
      <div className="cap flex h-10 shrink-0 items-center justify-between border-b border-ink/30 px-3"><span>{p.n} · {p.name}</span><button onClick={onClose} aria-label="Close tools" className="grid size-8 place-items-center">×</button></div>
      <div className="flex flex-col gap-4 overflow-y-auto p-3">
        <p className="text-[14px] leading-5 text-ink/70">{p.role}.</p>
        {keys.map((k) => { const st = setting(spec, k); return st ? <Dial key={k} st={st} value={values[k] ?? st.def} onChange={(v) => onCommit(k, v)} onPeek={(v) => onPeek(v === undefined ? null : { [k]: v })} /> : null; })}
      </div>
      <div className="cap flex h-10 shrink-0 items-center justify-between border-t border-ink/30 px-3"><button onClick={() => setMore((m) => !m)}>{more ? "Less ↑" : "More ↓"}</button><button onClick={onAll}>All settings…</button></div>
    </div>
  );
}

export function TakesShelf({ spec, values, takes, onPeek, onPick, onMore, onClose }: { spec: ComponentSpec; values: Values; takes: Take[]; onPeek: (p: Values | null) => void; onPick: (t: Take) => void; onMore?: () => void; onClose: () => void }) {
  const [why, setWhy] = useState(-1);
  return (
    <div className="up-in border-t border-ink bg-paper" role="group" aria-label="Takes">
      <div className="cap flex h-9 items-center justify-between px-4"><span>Takes · hover to preview, press to keep</span><span className="flex gap-4">{onMore && <button onClick={onMore}>More</button>}<button onClick={onClose}>Dismiss ×</button></span></div>
      <div className="noscroll flex snap-x gap-3 overflow-x-auto px-4 pb-3" onPointerLeave={() => onPeek(null)}>
        {takes.map((t, i) => (
          <div key={i} className="print-in relative w-[200px] shrink-0 snap-start border border-ink/40 hover:border-ink" style={{ animationDelay: `${i * 90}ms` }}>
            <div role="button" tabIndex={0} className="block w-full cursor-pointer text-left" onPointerEnter={() => onPeek(t.patch)} onFocus={() => onPeek(t.patch)} onBlur={() => onPeek(null)} onClick={() => onPick(t)} onKeyDown={press(() => onPick(t))} aria-label={`Take: ${t.name}. ${t.why}`}>
              <span inert className="pointer-events-none relative block h-[110px] overflow-hidden bg-plate"><span className="absolute left-1/2 top-1/2 block h-[220px] w-[320px] -translate-x-1/2 -translate-y-1/2 scale-[0.55]"><Stage spec={t.spec ?? spec} values={t.spec ? t.patch : { ...values, ...t.patch }} /></span></span>
              <span className="cap block truncate border-t border-ink/30 px-2 py-2 pr-12">{t.name}</span>
            </div>
            <button className="cap-s absolute bottom-2 right-2 underline" aria-expanded={why === i} onClick={() => setWhy(why === i ? -1 : i)}>Why?</button>
            {why === i && <p className="border-t border-ink/30 px-2 py-2 text-[13px] leading-4">{t.why}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MomentStrip({ spec, values, moment, onMoment }: { spec: ComponentSpec; values: Values; moment: Moment; onMoment: (m: Moment) => void }) {
  return (
    <div role="radiogroup" aria-label="Moments" className="noscroll flex gap-2 overflow-x-auto px-4 py-2" onKeyDown={(e) => { const i = MOMENTS.indexOf(moment); if (e.key === "ArrowRight") onMoment(MOMENTS[(i + 1) % 8]); if (e.key === "ArrowLeft") onMoment(MOMENTS[(i + 7) % 8]); }}>
      {MOMENTS.map((m) => (
        <div key={m} role="radio" aria-label={MOMENT_WORDS[m]} aria-checked={moment === m} tabIndex={moment === m ? 0 : -1} onClick={() => onMoment(m)} onKeyDown={press(() => onMoment(m))} className="shrink-0 cursor-pointer border bg-plate text-left" style={{ borderColor: moment === m ? "var(--ink)" : "color-mix(in oklch, var(--ink) 30%, transparent)" }}>
          <span inert className="pointer-events-none relative block h-12 w-[84px] overflow-hidden"><span className="absolute left-1/2 top-1/2 block h-[200px] w-[300px] -translate-x-1/2 -translate-y-1/2 scale-[0.26]"><Stage spec={spec} values={values} moment={m} /></span></span>
          <span className="cap-s block border-t border-ink/30 px-1.5 py-0.5" style={{ background: moment === m ? "var(--ink)" : undefined, color: moment === m ? "var(--paper)" : undefined }}>{MOMENT_WORDS[m]}</span>
        </div>
      ))}
    </div>
  );
}

/** Stress: the Range Test as a contact sheet. */
export function StressSheet({ spec, values }: { spec: ComponentSpec; values: Values }) {
  const ends = (i: 0 | 1) => Object.fromEntries(spec.settings.filter((s) => s.type === "range" && s.group !== "Content").map((s) => [s.key, s.safe![i]]));
  const words = (w: string) => Object.fromEntries(spec.settings.filter((s) => s.type === "text").map((s) => [s.key, w]));
  const cells: [string, Values, Moment][] = [["Smallest settings", ends(0), "rest"], ["Largest settings", ends(1), "rest"], ["Long words", words("An unreasonably long label that goes on"), "rest"], ["No words", words(""), "rest"], ["Right-to-left", { rtl: true }, "over"], ["Less movement", { calm: true }, "over"], ["Problem moment", {}, "problem"], ["Switched off", {}, "off"]];
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{cells.map(([l, v, m]) => <figure key={l} className="border border-ink/30 bg-plate"><div className="relative h-[150px] overflow-hidden"><div className="absolute left-1/2 top-1/2 h-[240px] w-[340px] -translate-x-1/2 -translate-y-1/2 scale-[0.6]"><Stage spec={spec} values={{ ...values, ...v }} moment={m} /></div></div><figcaption className="cap-s border-t border-ink/30 px-2 py-1.5">{l}</figcaption></figure>)}</div>;
}

/** Take it: one sheet, four doors. Code is a destination, shown read-only. */
export function TakeSheet({ spec, item, values, fixed }: { spec: ComponentSpec; item: Yours; values: Values; fixed: number }) {
  const [tile, setTile] = useState("site"), [code, setCode] = useState("Loading…"), [origin, setOrigin] = useState("");
  const c1 = useCopy(), c2 = useCopy(), c3 = useCopy(), c4 = useCopy();
  const d = encodeShare(spec.id, item.name, item.values), def = defaults(spec);
  const changed = spec.settings.filter((s) => item.values[s.key] !== undefined && item.values[s.key] !== def[s.key]);
  useEffect(() => { setOrigin(location.origin); fetchCode(spec, values).then(setCode); }, [spec, values]);
  const embed = `<iframe src="${origin}/embed?d=${d}" title="${item.name}" width="420" height="320" style="border:0" loading="lazy"></iframe>`;
  const tagline = `${spec.verb.toUpperCase()}, MADE ${String(values.feel).toUpperCase()}.`;
  const style = pickKeys(values, [...SKIN, ...MOVE]);
  const plain = `Corners: ${Number(values.corners) ? "soft" : "square"}. Line: ${values.line} px. Accent: ${values.accent ? "on" : "off"}. Movement: ${String(values.feel).toLowerCase()}, ${values.speed}× speed.`;
  const Box = ({ text, c, label = "Copy" }: { text: string; c: ReturnType<typeof useCopy>; label?: string }) => <div className="relative"><pre className="max-h-56 overflow-auto border border-ink/30 bg-plate p-3 pr-20 font-mono text-[12px] leading-5 whitespace-pre-wrap break-all">{text}</pre><button className="chip absolute right-2 top-2 bg-paper" onClick={() => c.copy(text)}><RollLabel on={c.done} a={label} b="Copied ✓" /></button></div>;
  return (
    <div className="g12 gap-y-8">
      <div className="print-in col-span-12 lg:col-span-5">
        <div className="relative flex aspect-[4/3] flex-col border border-ink bg-plate p-6"><span className="cap">{fig(item.n, "Y-")}</span><div className="min-h-0 flex-1"><Stage spec={spec} values={values} yours /></div><span className="cap flex justify-between"><span>{tagline}</span><span>{site.author.name} × you</span></span></div>
        <h2 className="pt-4 text-[28px] font-medium leading-8">{item.name}</h2><p className="text-[18px] text-ink/75">{spec.description}</p>
        {fixed > 0 && <p className="cap pt-3 text-accent">Fixed {fixed} {fixed === 1 ? "thing" : "things"} · Undo on the bench</p>}
        <dl className="mt-4 border-t border-ink/30">{(changed.length ? changed : spec.settings.slice(0, 3)).slice(0, 8).map((s) => <div key={s.key} className="cap flex justify-between border-b border-ink/30 py-1.5"><dt className="opacity-60">{s.label}</dt><dd>{show(s, values[s.key])}</dd></div>)}</dl>
      </div>
      <div className="col-span-12 lg:col-span-7">
        <div role="tablist" className="grid grid-cols-2 gap-px border border-ink bg-ink sm:grid-cols-4">{site.bench.tiles.map((t) => <button key={t.key} role="tab" aria-selected={tile === t.key} onClick={() => setTile(t.key)} className="flex min-h-24 flex-col justify-between p-3 text-left" style={{ background: tile === t.key ? "var(--ink)" : "var(--paper)", color: tile === t.key ? "var(--paper)" : undefined }}><span className="text-[19px] font-medium leading-6 tracking-tight">{t.title}</span><span className="cap-s opacity-70">{t.note}</span></button>)}</div>
        <div className="flex flex-col gap-4 pt-5">
          {tile === "site" && <><Box text={embed} c={c1} /><ul className="grid gap-x-6 sm:grid-cols-2">{site.bench.builders.map((b) => <li key={b} className="cap border-b border-ink/30 py-2">{b}</li>)}</ul></>}
          {tile === "app" && <><Box text={code} c={c2} label="Copy code" /><Box text={`curl -X POST ${origin}/api/registry/${spec.id} -H "content-type: application/json" -d '${JSON.stringify({ values: item.values })}' -o ${item.name.replace(/\W+/g, "") || "Detail"}.tsx`} c={c3} /></>}
          {tile === "agent" && <><Box text={promptFor(spec, values, item.name)} c={c2} label="Copy prompt" /><button className="btn self-start" onClick={() => { bump(spec.id, "prompt"); window.print(); }}>Print the spec sheet</button></>}
          {tile === "share" && <><Box text={`${origin}/embed?d=${d}&page=1`} c={c4} label="Copy link" /><p className="text-[15px] text-ink/70">The link carries the settings, not code. It opens live on any device.</p>
            <div className="border-t border-ink/30 pt-4"><span className="cap">My style</span><p className="pt-1 text-[15px] text-ink/70">{plain}</p><div className="flex flex-wrap gap-2 pt-3"><button className="chip" onClick={() => { localStorage.setItem("hl-style", JSON.stringify(style)); c3.copy(plain); }}><RollLabel on={c3.done} a="Save as my style" b="Saved ✓" /></button><button className="chip" onClick={() => restyle(style)}>Re-skin everything of mine</button><button className="chip" onClick={() => c1.copy(JSON.stringify({ base: spec.id, name: item.name, values: item.values }, null, 2))}><RollLabel on={c1.done} a="Export JSON" b="Copied ✓" /></button></div></div></>}
        </div>
      </div>
    </div>
  );
}
