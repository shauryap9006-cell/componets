"use client";
import { useEffect, useMemo, useState } from "react";
import { Cue, useDirector } from "@/director/Director";
import { useCopy, useInView } from "@/kit/act";
import { Dial, RollLabel, kb, useWeights } from "@/kit/Dial";
import { Stage } from "@/kit/Stage";
import { type ComponentSpec, type Moment, type Values, MOMENTS, MOMENT_WORDS, defaults, fig, promptFor, setting, show } from "@/kit/spec";
import { type Yours, bump, fetchCode } from "@/kit/yours";
import { site } from "@/site.config";

export function CopyRow({ spec, values, name }: { spec: ComponentSpec; values?: Values; name?: string }) {
  const code = useCopy(), prompt = useCopy();
  return (
    <span className="flex items-center gap-5">
      <button data-copy="code" className="cap hover:text-accent" onClick={async () => { code.copy(await fetchCode(spec, values)); bump(spec.id, "code"); }}><RollLabel on={code.done} a={site.actions.code} b={site.actions.copied} /></button>
      <button data-copy="prompt" className="cap hover:text-accent" onClick={() => { prompt.copy(promptFor(spec, { ...defaults(spec), ...values }, name)); bump(spec.id, "prompt"); }}><RollLabel on={prompt.done} a={site.actions.prompt} b={site.actions.copied} /></button>
    </span>
  );
}

export function Plate({ spec, item, onQuick, quick = false, live = true }: { spec: ComponentSpec; item?: Yours; onQuick?: (s: ComponentSpec) => void; quick?: boolean; live?: boolean }) {
  const { ref, inView } = useInView<HTMLElement>("300px");
  const { go, foley } = useDirector();
  const weights = useWeights();
  const [over, setOver] = useState<Values>({});
  const [play, setPlay] = useState(0);
  const [plus, setPlus] = useState({ x: 0, y: 0 });
  const values = useMemo(() => ({ ...(item?.values ?? {}), ...over }), [item, over]);
  const pc = spec.plateControl ? setting(spec, spec.plateControl) : undefined;
  const pv = pc ? (values[pc.key] ?? pc.def) : undefined;
  const href = item ? `/workshop?yours=${item.id}` : `/detail/${spec.id}`;
  const replay = () => { setPlay((p) => p + 1); foley(spec.kind === "theatre" ? "stamp" : "tick"); };
  const onKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    const all = Array.from(document.querySelectorAll<HTMLElement>("[data-plate]")), i = all.indexOf(e.currentTarget), cols = innerWidth >= 1024 ? 3 : innerWidth >= 640 ? 2 : 1;
    const mv = (d: number) => { e.preventDefault(); all[Math.min(all.length - 1, Math.max(0, i + d))]?.focus(); };
    if (e.key === "ArrowRight") mv(1); else if (e.key === "ArrowLeft") mv(-1); else if (e.key === "ArrowDown") mv(cols); else if (e.key === "ArrowUp") mv(-cols);
    else if (e.key === "Enter") go(href);
    else if (e.key === " " || e.key === "+") { e.preventDefault(); onQuick?.(spec); }
    else if (e.key === "r" || e.key === "R") replay();
    else if (e.key === "c" || e.key === "C") e.currentTarget.querySelector<HTMLButtonElement>('[data-copy="code"]')?.click();
    else if (e.key === "p" || e.key === "P") e.currentTarget.querySelector<HTMLButtonElement>('[data-copy="prompt"]')?.click();
  };
  return (
    <article ref={ref} data-plate={spec.id} tabIndex={0} onKeyDown={onKey} aria-label={`${fig(spec.fig)} ${item?.name ?? spec.name}. ${spec.description}`} className="group flex min-w-0 flex-col" style={{ contentVisibility: "auto", containIntrinsicHeight: "auto 560px" }}>
      <div data-tok="plate · 24px · hairline" className="relative flex aspect-[4/3] flex-col border border-ink/30 bg-plate p-6 transition-colors duration-150 group-hover:border-ink"
        onPointerMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); setPlus({ x: ((e.clientX - b.left) / b.width - 0.5) * 8, y: ((e.clientY - b.top) / b.height - 0.5) * 8 }); }} onPointerLeave={() => setPlus({ x: 0, y: 0 })}>
        <div className="flex items-center justify-between">
          <span className="cap">{item ? fig(item.n, "Y-") : fig(spec.fig)}</span>
          {onQuick && <button aria-label={quick ? "Close quick view" : "Open quick view"} aria-expanded={quick} onClick={() => onQuick(spec)} className="-m-2 grid size-9 place-items-center font-mono text-[20px] leading-none transition-transform duration-200" style={{ transform: `translate(${plus.x}px, ${plus.y}px) rotate(${quick ? 45 : 0}deg)` }}>+</button>}
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden" onDoubleClick={replay}>
          {inView && live ? <Stage spec={spec} values={values} play={play} yours={!!item} onSet={(k, v) => setOver((o) => ({ ...o, [k]: v }))} /> : (
            <div className="grid size-full place-items-center" aria-hidden><span className="hatch grid size-24 place-items-center border border-ink/30"><span className="disp bg-plate px-2 text-[34px]">{String(spec.fig).padStart(3, "0")}</span></span></div>
          )}
        </div>
        {pc && (
          <label className="cap flex h-8 items-center gap-4 border-t border-ink/30">
            <span className="shrink-0">{pc.label}</span>
            <span className="relative h-6 flex-1"><i className="absolute inset-x-0 top-1/2 h-px bg-ink/50" /><i className="pointer-events-none absolute top-[7px] block size-[10px] -translate-x-1/2 rounded-full border border-ink bg-plate" style={{ left: `${((Number(pv) - pc.safe![0]) / (pc.safe![1] - pc.safe![0])) * 100}%` }} />
              <input type="range" min={pc.safe![0]} max={pc.safe![1]} step={pc.step ?? 1} value={Number(pv)} onChange={(e) => setOver((o) => ({ ...o, [pc.key]: Number(e.target.value) }))} aria-label={pc.label} className="absolute inset-0 w-full cursor-ew-resize opacity-0" /></span>
            <span className="w-16 shrink-0 text-right tabular-nums">{show(pc, pv!)}</span>
          </label>
        )}
        <div className="flex items-center justify-between gap-4 pt-2">
          {spec.uncommon ? <span className="cap flex items-center gap-2"><i className="block size-2 bg-accent" />Uncommon{spec.kind === "theatre" && " ★"}</span> : <span className="cap truncate">{spec.tagline}</span>}
          <span className="cap flex shrink-0 items-center gap-3"><button aria-label="Replay the signature moment" title={spec.signature.name} onClick={replay} className="text-[15px] leading-none hover:text-accent">↻</button><span className="tabular-nums">{kb(weights.get(spec.id))}</span></span>
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-4 pt-5">
        <h3 className="truncate text-[28px] font-medium leading-8">{item?.name ?? spec.name}</h3>
        <Cue href={href} aria-label={`Open ${item?.name ?? spec.name}`} className="text-[24px] leading-none transition-transform duration-200 hover:-translate-y-0.5 hover:translate-x-0.5 hover:text-accent">↗</Cue>
      </div>
      <p className="min-h-14 pt-1 text-[18px] leading-7 text-ink/75">{spec.description}</p>
      <div className="mt-3 flex h-12 items-center justify-between gap-4 border-y border-ink/30"><span className="cap truncate">{item ? "Yours" : spec.category}</span><CopyRow spec={spec} values={values} name={item?.name} /></div>
    </article>
  );
}

export function QuickView({ spec, onClose, onStep }: { spec: ComponentSpec; onClose: () => void; onStep: (d: number) => void }) {
  const weights = useWeights();
  const [vals, setVals] = useState<Values>({}), [peek, setPeek] = useState<Values>({}), [moment, setMoment] = useState<Moment>("rest"), [play, setPlay] = useState(0);
  const [stats, setStats] = useState<{ code: number; prompt: number } | null>(null);
  useEffect(() => { setVals({}); setMoment("rest"); setStats(null); fetch(`/api/stats?slug=${spec.id}`).then((r) => r.json()).then(setStats).catch(() => {}); }, [spec.id]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.target as HTMLElement).closest("input,[role=slider],[role=radiogroup],[role=tablist]")) return; if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") onStep(1); if (e.key === "ArrowLeft") onStep(-1); if (e.key === "r") setPlay((p) => p + 1); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [onClose, onStep]);
  const own = spec.settings.filter((s) => s.priority === 1).slice(0, 7);
  const rows: [string, string][] = [["Weight", kb(weights.get(spec.id))], ["Depends on", "React 19 · no packages"], ["Motion", spec.motion], ["World", spec.world], ["Verb", spec.verb], ["Works for everyone", "Keyboard · reduced motion · named"], ["Copied", stats ? `${stats.code} code · ${stats.prompt} prompt` : "—"], ["Author", spec.author]];
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`${spec.name} quick view`}>
      <button className="absolute inset-0 bg-ink/20" aria-label="Close" onClick={onClose} />
      <div className="sheet-in absolute inset-y-0 right-0 flex w-full max-w-[760px] flex-col overflow-y-auto border-l border-ink bg-paper">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-ink/30 px-6"><span className="cap">{fig(spec.fig)} · Quick view</span><span className="cap flex items-center gap-3"><button onClick={() => onStep(-1)} aria-label="Previous plate">←</button><button onClick={() => onStep(1)} aria-label="Next plate">→</button><span className="key">Esc</span><button onClick={onClose} aria-label="Close" className="font-mono text-[20px]" style={{ rotate: "45deg" }}>+</button></span></div>
        <div className="relative h-[340px] shrink-0 border-b border-ink/30 bg-plate p-8" onDoubleClick={() => setPlay((p) => p + 1)}><Stage spec={spec} values={{ ...vals, ...peek }} moment={moment} play={play} k={1.35} onSet={(k, v) => setVals((o) => ({ ...o, [k]: v }))} /></div>
        <div role="radiogroup" aria-label="Force a moment" className="noscroll flex shrink-0 gap-1 overflow-x-auto border-b border-ink/30 px-6 py-3">{MOMENTS.map((m) => <button key={m} role="radio" aria-checked={moment === m} className="chip" onClick={() => setMoment(m)}>{MOMENT_WORDS[m]}</button>)}<button className="chip ml-auto" onClick={() => setPlay((p) => p + 1)}>↻ Replay</button></div>
        <div className="grid shrink-0 gap-x-8 gap-y-4 border-b border-ink/30 px-6 py-5 sm:grid-cols-2">{own.map((s) => <Dial key={s.key} st={s} value={vals[s.key] ?? s.def} onChange={(v) => setVals((o) => ({ ...o, [s.key]: v }))} onPeek={(v) => setPeek(v === undefined ? {} : { [s.key]: v })} />)}</div>
        <div className="px-6 py-5"><h2 className="text-[32px] font-medium leading-9">{spec.name}</h2><p className="pt-1 text-[18px] text-ink/75">{spec.pitch}</p>
          <dl className="mt-5 border-t border-ink/30">{rows.map(([k, v]) => <div key={k} className="cap flex justify-between gap-6 border-b border-ink/30 py-2"><dt className="opacity-60">{k}</dt><dd className="text-right">{v}</dd></div>)}</dl>
        </div>
        <div className="sticky bottom-0 mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-ink bg-paper px-6 py-4"><CopyRow spec={spec} values={vals} /><Cue href={`/workshop?from=${spec.id}`} className="btn btn-p">{site.actions.mine}</Cue></div>
      </div>
    </div>
  );
}
