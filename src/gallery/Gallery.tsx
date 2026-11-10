"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Cue } from "@/director/Director";
import { CATALOG, ROOMS, TAGS, byId, search } from "@/kit/catalog";
import { useWeights } from "@/kit/Dial";
import { Stage } from "@/kit/Stage";
import type { ComponentSpec } from "@/kit/spec";
import { remove, useYours } from "@/kit/yours";
import { site } from "@/site.config";
import { IndexMode, Projector, WallMode } from "./Modes";
import { Plate, QuickView } from "./Plate";

const MODES = ["grid", "index", "wall", "projector", "rooms"] as const; type Mode = (typeof MODES)[number];
const pad = (n: number) => String(n).padStart(3, "0");
const Roll = ({ text }: { text: string }) => <span className="inline-flex overflow-hidden">{text.split("").map((c, i) => <span key={`${i}${c}`} className="roll" style={{ animationDelay: `${i * 24}ms` }}>{c}</span>)}</span>;
const sel = "cap h-16 w-full cursor-pointer border border-ink/30 bg-transparent pl-4 pr-9 hover:border-ink";

export function Gallery() {
  const sp = useSearchParams();
  const [cat, setCat] = useState(sp.get("cat") ?? "All"), [q, setQ] = useState(sp.get("q") ?? ""), [unc, setUnc] = useState(sp.get("unc") === "1");
  const [wt, setWt] = useState(Number(sp.get("w") ?? 0)), [mo, setMo] = useState(sp.get("m") ?? ""), [tag, setTag] = useState(sp.get("tag") ?? "");
  const [mode, setMode] = useState<Mode>((MODES as readonly string[]).includes(sp.get("mode") ?? "") ? (sp.get("mode") as Mode) : "grid");
  const [figNo, setFigNo] = useState(Number(sp.get("fig") ?? 1));
  const [quick, setQuick] = useState<ComponentSpec | null>(null);
  const weights = useWeights(), yours = useYours();
  const searchRef = useRef<HTMLInputElement>(null), tabs = useRef<HTMLDivElement>(null), [bar, setBar] = useState({ l: 0, w: 0 });

  useEffect(() => { // filters sync to the URL
    const p = new URLSearchParams(); if (cat !== "All") p.set("cat", cat); if (q) p.set("q", q); if (unc) p.set("unc", "1"); if (wt) p.set("w", String(wt)); if (mo) p.set("m", mo); if (tag) p.set("tag", tag); if (mode !== "grid") p.set("mode", mode); if (mode === "projector") p.set("fig", pad(figNo));
    const s = p.toString(); window.history.replaceState(null, "", s ? `?${s}` : location.pathname);
  }, [cat, q, unc, wt, mo, tag, mode, figNo]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input,textarea,select") || e.metaKey || e.ctrlKey) return;
      if (e.key === "/") { e.preventDefault(); searchRef.current?.focus(); }
      const n = Number(e.key); if (n >= 1 && n <= 5 && !quick && mode !== "projector") setMode(MODES[n - 1]);
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [quick, mode]);
  useLayoutEffect(() => { const el = tabs.current?.querySelector<HTMLElement>('[aria-selected="true"]'); if (el) setBar({ l: el.offsetLeft, w: el.offsetWidth }); }, [cat, yours.length]);

  const base = useMemo(() => {
    const band = (b?: number) => (!b ? 0 : b < 2048 ? 1 : b < 5120 ? 2 : b < 15360 ? 3 : 4);
    return search(q).filter((s) => (!unc || s.uncommon) && (!mo || s.motion === mo) && (!tag || s.tags.includes(tag)) && (!wt || band(weights.get(s.id)) === wt));
  }, [q, unc, mo, tag, wt, weights]);
  const list = useMemo(() => (cat === "All" || cat === "Yours" ? base : base.filter((s) => s.category === cat)), [base, cat]);
  const count = cat === "Yours" ? yours.length : list.length;
  const reset = () => { setQ(""); setUnc(false); setWt(0); setMo(""); setTag(""); setCat("All"); };
  const stepQuick = useCallback((d: number) => setQuick((cur) => { if (!cur) return cur; const i = list.indexOf(cur); return list[(i + d + list.length) % list.length] ?? cur; }), [list]);
  const closeQuick = useCallback(() => setQuick(null), []);
  const toggleQuick = (s: ComponentSpec) => setQuick((c) => (c?.id === s.id ? null : s));
  const tabList: [string, number][] = [["All", base.length], ...site.categories.map((c) => [c, base.filter((s) => s.category === c).length] as [string, number]), ["Yours", yours.length]];
  const empty = <p className="cap border border-ink/30 px-6 py-16 text-center">{site.gallery.empty} <button className="underline" onClick={reset}>{site.gallery.reset}</button></p>;

  return (
    <div className="wrap pb-12">
      <div className="relative">
        <div ref={tabs} role="tablist" aria-label="Categories" className="noscroll relative flex overflow-x-auto border-b border-ink/30"
          onKeyDown={(e) => { const i = tabList.findIndex(([c]) => c === cat); if (e.key === "ArrowRight") setCat(tabList[Math.min(tabList.length - 1, i + 1)][0]); if (e.key === "ArrowLeft") setCat(tabList[Math.max(0, i - 1)][0]); }}>
          {tabList.map(([c, n]) => <button key={c} role="tab" aria-selected={cat === c} tabIndex={cat === c ? 0 : -1} onClick={(e) => { setCat(c); e.currentTarget.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); }} className="flex h-14 shrink-0 items-baseline gap-2 px-4 pt-4 first:pl-0" style={{ opacity: cat === c ? 1 : n ? 0.7 : 0.35 }}><span className="text-[17px] font-medium tracking-tight">{c}</span><span className="cap-s tabular-nums">{String(n).padStart(2, "0")}</span></button>)}
          <i className="absolute bottom-0 h-[3px] bg-ink" style={{ left: bar.l, width: bar.w, transition: "left 480ms var(--expo), width 480ms var(--expo)" }} />
        </div>
        <i className="hatch pointer-events-none absolute inset-y-0 right-0 w-6 bg-paper xl:hidden" aria-hidden />
      </div>

      <div className="grid grid-cols-2 gap-x-[var(--gutter)] gap-y-3 py-6 lg:flex lg:items-stretch" data-tok="filter bar · 64px">
        <label className="relative col-span-2 flex h-16 items-center border border-ink/30 focus-within:border-ink lg:flex-1">
          <svg width="18" height="18" viewBox="0 0 18 18" className="ml-4 shrink-0" aria-hidden><circle cx="7.5" cy="7.5" r="5.5" fill="none" stroke="currentColor" /><path d="M12 12 L17 17" stroke="currentColor" /></svg>
          <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Escape" && (setQ(""), e.currentTarget.blur())} placeholder={site.gallery.search} aria-label="Search details" className="h-full min-w-0 flex-1 bg-transparent px-3 text-[18px] outline-none placeholder:text-ink/45" />
          <span className="key mr-4">/</span>
        </label>
        <label className="cap flex h-16 cursor-pointer items-center gap-3 lg:px-2"><input type="checkbox" checked={unc} onChange={(e) => setUnc(e.target.checked)} className="peer sr-only" /><span className="grid size-5 place-items-center border border-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">{unc && <i className="block size-2.5 bg-accent" />}</span>{site.gallery.uncommon}</label>
        {([["Weight", String(wt), site.gallery.weights.map((l, i) => [String(i), l]), (v: string) => setWt(Number(v))], ["Motion", mo, site.gallery.motions.map((l, i) => [i ? l.toLowerCase() : "", l]), setMo], ["Tag", tag, [["", "Any tag"], ...TAGS.map((t) => [t, t])], setTag]] as [string, string, string[][], (v: string) => void][]).map(([name, v, opts, set]) => (
          <span key={name} className="relative lg:w-40"><select aria-label={name} value={v} onChange={(e) => set(e.target.value)} className={sel}>{opts.map(([val, l]) => <option key={val} value={val}>{l}</option>)}</select><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px]">▾</span></span>
        ))}
        <button onClick={reset} className="cap h-16 text-left hover:text-accent lg:px-2">{site.gallery.reset}</button>
      </div>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/30 pt-3">
        <span className="cap tabular-nums" aria-live="polite" aria-label={`${count} of ${CATALOG.length} details`}><Roll text={pad(count)} /> / {pad(CATALOG.length)} {site.gallery.unit}</span>
        <div role="radiogroup" aria-label="Viewing mode" className="flex flex-wrap gap-y-1">{MODES.map((m, i) => <button key={m} role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className="chip -ml-px first:ml-0"><span className="opacity-60">{i + 1}</span>{site.gallery.modes[i]}</button>)}</div>
      </div>

      {cat === "Yours" ? (
        yours.length ? <div className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{yours.map((y) => { const s = byId(y.base); return s ? <div key={y.id} className="relative"><Plate spec={s} item={y} /><button className="cap absolute right-0 top-[-22px] hover:text-accent" onClick={() => remove(y.id)}>Remove ×</button></div> : null; })}</div>
          : <p className="cap border border-ink/30 px-6 py-16 text-center">Nothing made yet. <Cue href="/workshop" className="underline">{site.home.cta2}</Cue></p>
      ) : !list.length ? empty : mode === "index" ? <IndexMode list={list} /> : mode === "wall" ? <WallMode list={list} onQuick={toggleQuick} /> : mode === "rooms" ? (
        <div className="flex flex-col gap-24">
          {ROOMS.map((r) => { const plates = r.plates.filter((s) => list.includes(s)); if (!plates.length) return null; const poster = plates.find((s) => s.kind === "theatre") ?? plates[0]; return (
            <section key={r.world} aria-label={r.title}>
              <div className="g12 items-end border-t border-ink pt-4">
                <div className="col-span-12 lg:col-span-5"><span className="cap">Room {String(r.n).padStart(2, "0")} · {pad(plates.length)} plates</span><h2 className="disp pt-3 text-[clamp(48px,8vw,128px)]">{r.title}</h2><p className="max-w-[36ch] border-l border-ink py-1 pl-4 pt-6 text-[18px] leading-7 text-ink/75" style={{ marginTop: 24 }}>{r.label}</p></div>
                <div className="relative col-span-12 mt-8 h-[320px] border border-ink/30 bg-plate p-8 lg:col-span-7 lg:mt-0"><span className="cap absolute left-4 top-3">Poster · {poster.name}</span><Stage spec={poster} k={1.5} /></div>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{plates.map((s) => <Plate key={s.id} spec={s} onQuick={toggleQuick} quick={quick?.id === s.id} />)}</div>
            </section>
          ); })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3" data-tok="grid · 3 col · 32/48px">{list.map((s) => <Plate key={s.id} spec={s} onQuick={toggleQuick} quick={quick?.id === s.id} />)}</div>
      )}
      {mode === "projector" && list.length > 0 && <Projector list={list} start={figNo} onExit={() => setMode("grid")} onIndex={setFigNo} />}
      {quick && <QuickView spec={quick} onClose={closeQuick} onStep={stepQuick} />}
    </div>
  );
}
