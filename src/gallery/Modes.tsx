"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Cue, useDirector } from "@/director/Director";
import { press, useInView } from "@/kit/act";
import { kb, useWeights } from "@/kit/Dial";
import { Stage } from "@/kit/Stage";
import { type ComponentSpec, fig } from "@/kit/spec";
import { Plate } from "./Plate";

/* ── INDEX: one typographic table; a live preview follows the cursor with inertia ── */
export function IndexMode({ list }: { list: ComponentSpec[] }) {
  const weights = useWeights();
  const [sort, setSort] = useState<{ k: string; d: 1 | -1 }>({ k: "fig", d: 1 });
  const [hov, setHov] = useState<ComponentSpec | null>(null);
  const box = useRef<HTMLDivElement>(null), target = useRef({ x: 0, y: 0 }), pos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    let raf = 0; const loop = () => { pos.current.x += (target.current.x - pos.current.x) * 0.14; pos.current.y += (target.current.y - pos.current.y) * 0.14; if (box.current) box.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`; raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, []);
  const rows = useMemo(() => {
    const val = (s: ComponentSpec) => (sort.k === "fig" ? s.fig : sort.k === "weight" ? weights.get(s.id) ?? 0 : String((s as unknown as Record<string, unknown>)[sort.k]));
    return [...list].sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * sort.d);
  }, [list, sort, weights]);
  const cols: [string, string, string][] = [["fig", "Fig.", "w-20"], ["name", "Name", ""], ["world", "World", "hidden md:table-cell"], ["verb", "Verb", "hidden sm:table-cell"], ["weight", "Weight", "text-right"], ["motion", "Motion", "hidden text-right sm:table-cell"]];
  return (
    <div onPointerMove={(e) => { target.current = { x: Math.min(e.clientX + 24, innerWidth - 340), y: Math.min(e.clientY + 24, innerHeight - 260) }; }} onPointerLeave={() => setHov(null)}>
      <table className="w-full border-collapse text-left">
        <thead><tr className="border-b border-ink">{cols.map(([k, l, c]) => <th key={k} className={`cap py-3 font-normal ${c}`} aria-sort={sort.k === k ? (sort.d > 0 ? "ascending" : "descending") : "none"}><button className="cap" onClick={() => setSort((s) => ({ k, d: s.k === k ? (-s.d as 1 | -1) : 1 }))}>{l} {sort.k === k ? (sort.d > 0 ? "↓" : "↑") : ""}</button></th>)}</tr></thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="group border-b border-ink/30 hover:bg-plate" onPointerEnter={() => setHov(s)} onFocus={() => { setHov(s); target.current = { x: innerWidth - 360, y: 120 }; }}>
              <td className="cap py-3">{String(s.fig).padStart(3, "0")}</td>
              <td className="py-2"><Cue href={`/detail/${s.id}`} className="flex items-baseline gap-3 text-[22px] font-medium tracking-tight group-hover:text-accent">{s.name}{s.uncommon && <i className="block size-2 shrink-0 bg-accent" title="Uncommon" />}{s.kind === "theatre" && <span className="cap">★</span>}</Cue></td>
              <td className="cap hidden md:table-cell">{s.world}</td><td className="cap hidden sm:table-cell">{s.verb}</td>
              <td className="cap text-right tabular-nums">{kb(weights.get(s.id))}</td><td className="cap hidden text-right sm:table-cell">{s.motion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={box} className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[240px] w-[320px] border border-ink bg-plate p-5 md:block" style={{ opacity: hov ? 1 : 0, transition: "opacity 120ms" }} aria-hidden>
        {hov && <><span className="cap absolute left-3 top-2">{fig(hov.fig)}</span><Stage key={hov.id} spec={hov} moment="over" /></>}
      </div>
    </div>
  );
}

/* ── WALL: a contact sheet that zooms until a thumbnail becomes the live plate ── */
function WallCell({ spec, scale, onPick }: { spec: ComponentSpec; scale: number; onPick: () => void }) {
  const { ref, inView } = useInView<HTMLDivElement>("100px");
  return (
    <div ref={ref} role="button" tabIndex={0} onClick={onPick} onKeyDown={press(onPick)} aria-label={`${fig(spec.fig)} ${spec.name}. Zoom in.`} className="group relative block cursor-pointer aspect-[4/3] overflow-hidden border border-ink/30 bg-plate hover:border-ink">
      {inView && <div inert className="pointer-events-none absolute left-1/2 top-1/2 h-[270px] w-[360px]" style={{ transform: `translate(-50%,-50%) scale(${scale})` }} aria-hidden><Stage spec={spec} /></div>}
      <span className="cap-s absolute inset-x-0 bottom-0 truncate bg-ink px-1.5 py-0.5 text-left text-paper opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">{String(spec.fig).padStart(3, "0")} {spec.name}</span>
    </div>
  );
}
export function WallMode({ list, onQuick }: { list: ComponentSpec[]; onQuick: (s: ComponentSpec) => void }) {
  const [cols, setCols] = useState(9);
  const wrap = useRef<HTMLDivElement>(null), [w, setW] = useState(1200), focus = useRef<string | null>(null);
  useEffect(() => { const el = wrap.current!; const ro = new ResizeObserver(() => setW(el.clientWidth)); ro.observe(el); return () => ro.disconnect(); }, []);
  useEffect(() => { const el = wrap.current!; const wheel = (e: WheelEvent) => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); setCols((c) => Math.min(12, Math.max(1, c + (e.deltaY > 0 ? 1 : -1)))); }; el.addEventListener("wheel", wheel, { passive: false }); return () => el.removeEventListener("wheel", wheel); }, []);
  useEffect(() => { if (focus.current) document.querySelector(`[data-wall="${focus.current}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" }); }, [cols]);
  const live = cols <= 3, cell = (w - (cols - 1) * (live ? 32 : 8)) / cols;
  return (
    <div>
      <div className="cap mb-4 flex flex-wrap items-center gap-4"><span>Zoom</span><button className="key" onClick={() => setCols((c) => Math.min(12, c + 1))} aria-label="Zoom out">−</button>
        <input type="range" min={1} max={12} value={13 - cols} onChange={(e) => setCols(13 - Number(e.target.value))} aria-label="Zoom" className="w-40 accent-[var(--ink)]" />
        <button className="key" onClick={() => setCols((c) => Math.max(1, c - 1))} aria-label="Zoom in">+</button><span className="tabular-nums opacity-60">{cols} across · {live ? "live plates" : "contact sheet"} · ctrl + scroll or click a frame</span></div>
      <div ref={wrap} className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: live ? "48px 32px" : 8 }}>
        {list.map((s) => <div key={s.id} data-wall={s.id} onPointerEnter={() => (focus.current = s.id)}>{live ? <Plate spec={s} onQuick={onQuick} /> : <WallCell spec={s} scale={Math.min(1, cell / 380)} onPick={() => { focus.current = s.id; setCols((c) => (c > 6 ? 6 : 3)); }} />}</div>)}
      </div>
    </div>
  );
}

/* ── PROJECTOR: one plate at a time, title card first; Screening autoplays ── */
export function Projector({ list, start, onExit, onIndex }: { list: ComponentSpec[]; start: number; onExit: () => void; onIndex: (fig: number) => void }) {
  const { foley, calm } = useDirector();
  const [i, setI] = useState(Math.max(0, list.findIndex((s) => s.fig === start)));
  const [card, setCard] = useState(true), [screening, setScreening] = useState(false), [play, setPlay] = useState(0), [dir, setDir] = useState(1);
  const spec = list[Math.min(i, list.length - 1)], touch = useRef(0);
  const step = (d: number) => { setDir(d); setI((x) => (x + d + list.length) % list.length); foley("clack"); };
  useEffect(() => { if (!spec) return; onIndex(spec.fig); setCard(true); const t = setTimeout(() => { setCard(false); setPlay((p) => p + 1); }, calm ? 300 : 1100); return () => clearTimeout(t); }, [i]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!screening || !spec) return; const t = setTimeout(() => step(1), 1100 + spec.signature.ms + 1800); return () => clearTimeout(t); }, [screening, i]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onExit(); else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1); else if (e.key === "r") setPlay((p) => p + 1); else if (e.key === "s") setScreening((s) => !s); else if (card) setCard(false); };
    window.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }); 
  if (!spec) return null;
  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-paper" role="dialog" aria-modal="true" aria-label="Projector" onTouchStart={(e) => (touch.current = e.touches[0].clientX)} onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - touch.current; if (Math.abs(d) > 60) step(d < 0 ? 1 : -1); }}>
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-ink/30 px-6"><span className="cap">{fig(spec.fig)} · {String(i + 1).padStart(3, "0")} / {String(list.length).padStart(3, "0")}</span>
        <span className="cap flex items-center gap-4"><button aria-pressed={screening} onClick={() => setScreening((s) => !s)} className="chip">{screening ? "■ Stop" : "▶ Screening"}</button><button onClick={() => step(-1)} aria-label="Previous">←</button><button onClick={() => step(1)} aria-label="Next">→</button><button onClick={onExit} className="flex items-center gap-2"><span className="key">Esc</span>Leave</button></span></div>
      <div key={spec.id} className="relative min-h-0 flex-1" style={{ animation: calm ? "fadeIn 120ms both" : `${dir > 0 ? "projIn" : "projInR"} 480ms var(--quart) both` }} onClick={() => card && setCard(false)}>
        <style>{`@keyframes projIn{from{translate:100% 0}to{translate:0 0}}@keyframes projInR{from{translate:-100% 0}to{translate:0 0}}`}</style>
        {card ? (
          <div className="wrap flex h-full flex-col justify-end pb-12"><span className="disp text-[min(34vw,52vh)] tabular-nums">{String(spec.fig).padStart(3, "0")}</span><h2 className="text-[clamp(28px,5vw,72px)] font-medium leading-none">{spec.name}</h2><p className="cap pt-4">{spec.tagline}</p></div>
        ) : (
          <div className="flex h-full flex-col p-6 sm:p-12"><div className="min-h-0 flex-1" onDoubleClick={() => setPlay((p) => p + 1)}><Stage spec={spec} play={play} k={typeof window !== "undefined" && window.innerWidth < 640 ? 1.1 : 2} /></div>
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-ink/30 pt-4"><div><h2 className="text-[28px] font-medium leading-8">{spec.name}</h2><p className="text-[18px] text-ink/75">{spec.description}</p></div><span className="cap flex items-center gap-4"><button onClick={() => setPlay((p) => p + 1)}>↻ {spec.signature.name}</button><Cue href={`/detail/${spec.id}`}>Open ↗</Cue></span></div></div>
        )}
      </div>
    </div>
  );
}
