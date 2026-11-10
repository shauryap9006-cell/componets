"use client";
import { useEffect, useState } from "react";
import { MomentStrip } from "@/bench/parts";
import { Cue, useDirector } from "@/director/Director";
import { CopyRow } from "@/gallery/Plate";
import { byId, neighbours } from "@/kit/catalog";
import { Dial, kb, useWeights } from "@/kit/Dial";
import { Stage } from "@/kit/Stage";
import { type Moment, type Values, CLASS_WORDS, FEELS, fig, show } from "@/kit/spec";
import { fetchCode } from "@/kit/yours";
import { site } from "@/site.config";

const H = ({ n, children }: { n: string; children: string }) => <h2 className="cap flex gap-4 border-t border-ink pb-6 pt-3"><span className="opacity-60">{n}</span>{children}</h2>;

export function DetailView({ slug }: { slug: string }) {
  const spec = byId(slug)!, { prev, next } = neighbours(slug), { go } = useDirector(), weights = useWeights();
  const [vals, setVals] = useState<Values>({}), [peek, setPeek] = useState<Values>({}), [moment, setMoment] = useState<Moment>("rest"), [play, setPlay] = useState(0), [code, setCode] = useState("");
  useEffect(() => { fetchCode(spec).then(setCode); }, [spec]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.target as HTMLElement).closest("input,textarea,[role=slider],[role=radiogroup],[role=tablist]")) return; if (e.key === "ArrowRight") go(`/detail/${next.id}`); if (e.key === "ArrowLeft") go(`/detail/${prev.id}`); if (e.key === "r" || e.key === "R") setPlay((p) => p + 1); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [go, next.id, prev.id]);
  const own = spec.settings.filter((s) => s.priority === 1).slice(0, 8), feel = FEELS[String(vals.feel ?? "Precise")];
  const meta: [string, string][] = [["World", spec.world], ["Verb", spec.verb], ["Kind", spec.kind + (spec.kind === "theatre" ? " ★" : "")], ["Category", spec.category], ["Motion", spec.motion], ["Weight", kb(weights.get(spec.id))], ["Uncommon", spec.uncommon ? "Yes" : "No"], ["Author", spec.author]];
  return (
    <article className="wrap pb-12 pt-8">
      <div className="cap flex items-center justify-between"><Cue href="/gallery" cut="wipe">← Gallery</Cue><span className="flex items-center gap-4"><Cue href={`/detail/${prev.id}`} aria-label={`Previous: ${prev.name}`}>← {String(prev.fig).padStart(3, "0")}</Cue><Cue href={`/detail/${next.id}`} aria-label={`Next: ${next.name}`}>{String(next.fig).padStart(3, "0")} →</Cue></span></div>
      <header className="g12 items-end gap-y-6 pb-10 pt-6">
        <div className="col-span-12 lg:col-span-5"><span className="disp block text-[clamp(96px,17vw,280px)] tabular-nums" style={{ animation: "rise 480ms var(--expo) 60ms both" }}>{String(spec.fig).padStart(3, "0")}</span></div>
        <div className="col-span-12 lg:col-span-7"><span className="cap flex items-center gap-2">{spec.uncommon && <i className="block size-2 bg-accent" />}{fig(spec.fig)} · {spec.world}</span><h1 className="pt-2 text-[clamp(40px,6vw,88px)] font-medium leading-[0.95]">{spec.name}</h1><p className="cap pt-4">{spec.tagline}</p><p className="max-w-[40ch] pt-2 text-[22px] leading-8 text-ink/75">{spec.description}</p></div>
      </header>

      <div className="g12 gap-y-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="relative h-[min(60vh,520px)] min-h-[340px] border border-ink bg-plate p-10" onDoubleClick={() => setPlay((p) => p + 1)} data-tok="stage · plate · 1px">
            <i className="absolute -left-2 top-0 h-full w-px bg-ink/40" aria-hidden /><i className="absolute -top-2 left-0 h-px w-full bg-ink/40" aria-hidden />
            <Stage spec={spec} values={{ ...vals, ...peek }} moment={moment} play={play} k={1.5} onSet={(k, v) => setVals((o) => ({ ...o, [k]: v }))} />
            <button onClick={() => setPlay((p) => p + 1)} className="cap absolute bottom-3 right-4 hover:text-accent">↻ {spec.signature.name} · {spec.signature.ms} ms <span className="key ml-1">R</span></button>
          </div>
          <div className="border-x border-b border-ink/30"><MomentStrip spec={spec} values={vals} moment={moment} onMoment={setMoment} /></div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5"><CopyRow spec={spec} values={vals} /><Cue href={`/workshop?from=${spec.id}`} className="btn btn-p">{site.actions.mine}</Cue></div>
        </div>
        <aside className="col-span-12 flex flex-col gap-5 lg:col-span-4" aria-label="Settings">{own.map((s) => <Dial key={s.key} st={s} value={vals[s.key] ?? s.def} onChange={(v) => setVals((o) => ({ ...o, [s.key]: v }))} onPeek={(v) => setPeek(v === undefined ? {} : { [s.key]: v })} />)}
          <div className="border-t border-ink/30 pt-4"><span className="cap">Versions</span><div className="flex flex-wrap gap-1 pt-2" onPointerLeave={() => setPeek({})}>{spec.versions.map((v) => <button key={v.name} className="chip" onPointerEnter={() => setPeek(v.values)} onFocus={() => setPeek(v.values)} onClick={() => setVals(v.values)}>{v.name}</button>)}</div></div>
        </aside>
      </div>

      <div className="g12 gap-y-12 pt-20">
        <section className="col-span-12 lg:col-span-6"><H n="01">Concept</H><p className="max-w-[46ch] text-[24px] leading-9 tracking-tight">{spec.pitch}</p></section>
        <section className="col-span-12 lg:col-span-6"><H n="02">Sheet</H><dl>{meta.map(([k, v]) => <div key={k} className="cap flex justify-between gap-6 border-b border-ink/30 py-2"><dt className="opacity-60">{k}</dt><dd>{v}</dd></div>)}</dl></section>
        <section className="col-span-12 lg:col-span-6"><H n="03">Anatomy</H><ol>{spec.parts.map((p) => <li key={p.n} className="flex items-baseline gap-4 border-b border-ink/30 py-3"><span className="cap grid size-6 shrink-0 place-items-center rounded-full border border-ink">{p.n}</span><span className="text-[20px] font-medium tracking-tight">{p.name}</span><span className="ml-auto text-right text-[16px] text-ink/70">{p.role}</span></li>)}</ol></section>
        <section className="col-span-12 lg:col-span-6"><H n="04">The details</H><ul>{spec.details.map((d, i) => <li key={i} className="flex gap-4 border-b border-ink/30 py-3"><span className="cap w-36 shrink-0">({d.cls}) {CLASS_WORDS[d.cls]}</span><span className="text-[18px] leading-6">{d.text}</span></li>)}</ul></section>
        <section className="col-span-12"><H n="05">Settings</H><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="cap border-b border-ink">{["Setting", "Group", "Good range", "Default", "Why it matters"].map((h) => <th key={h} className="py-2 pr-4 font-normal opacity-60">{h}</th>)}</tr></thead>
          <tbody>{spec.settings.map((s) => <tr key={s.key} className="border-b border-ink/30 align-baseline"><td className="py-2 pr-4 text-[17px] font-medium">{s.label}</td><td className="cap pr-4">{s.group}</td><td className="cap pr-4 tabular-nums">{s.type === "range" ? `${s.safe![0]} – ${s.safe![1]}${s.unit ? " " + s.unit : ""}` : s.type === "choice" ? s.options!.join(" / ") : s.type}</td><td className="cap pr-4">{show(s, s.def)}</td><td className="py-2 text-[15px] text-ink/70">{s.why}</td></tr>)}</tbody></table></div></section>
        <section className="col-span-12 lg:col-span-6"><H n="06">Movement</H><dl>{([["Signature", `${spec.signature.name} · ${spec.signature.ms} ms`], ["Feel", `${vals.feel ?? "Precise"} — ${feel?.say}`], ["Curve", feel?.ease ?? ""], ["Replay", "↻, double-click or R"], ["Less movement", "States change with a 120 ms fade"]] as [string, string][]).map(([k, v]) => <div key={k} className="cap flex justify-between gap-6 border-b border-ink/30 py-2"><dt className="opacity-60">{k}</dt><dd className="text-right">{v}</dd></div>)}</dl></section>
        <section className="col-span-12 lg:col-span-6"><H n="07">Works for everyone</H><ul className="text-[18px] leading-7 text-ink/80"><li className="border-b border-ink/30 py-2">Reachable and operable by keyboard; focus is a 2 px accent outline.</li><li className="border-b border-ink/30 py-2">Named for screen readers; state is given in words, not colour alone.</li><li className="border-b border-ink/30 py-2">Honours reduced motion; right-to-left is a setting.</li></ul></section>
        <section className="col-span-12"><H n="08">Source</H><pre className="max-h-[420px] overflow-auto border border-ink/30 bg-plate p-5 font-mono text-[12.5px] leading-5" tabIndex={0}>{code || "Loading the source…"}</pre></section>
      </div>
      <nav className="mt-16 grid gap-px border border-ink bg-ink sm:grid-cols-2" aria-label="More plates">{[prev, next].map((s, i) => <Cue key={s.id} href={`/detail/${s.id}`} className="flex items-end justify-between gap-4 bg-paper p-6 hover:bg-plate"><span><span className="cap">{i ? "Next →" : "← Previous"} · {fig(s.fig)}</span><span className="block pt-1 text-[32px] font-medium leading-9 tracking-tight">{s.name}</span></span><span className="cap hidden sm:block">{s.verb}</span></Cue>)}</nav>
    </article>
  );
}
