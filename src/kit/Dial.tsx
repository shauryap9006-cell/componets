"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DEMOS } from "@/demos";
import { type Setting, type Val, FEELS, show } from "./spec";

/** One tactile control for one Setting. Every option peeks: hover or focus previews, press commits. */
export function Dial({ st, value, onChange, onPeek, wild = false }: { st: Setting; value: Val; onChange: (v: Val) => void; onPeek?: (v: Val | undefined) => void; wild?: boolean }) {
  const [ghost, setGhost] = useState<number | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const id = `dial-${st.key}`;
  const head = (
    <span className="cap flex items-baseline justify-between gap-3"><label htmlFor={id} className="truncate" title={st.why}>{st.label}</label><span className="tabular-nums opacity-70">{show(st, draft ?? value)}</span></span>
  );
  if (st.type === "range") {
    const [lo, hi] = wild ? [st.min!, st.max!] : st.safe ?? [st.min!, st.max!];
    const pct = (n: number) => ((n - lo) / Math.max(0.0001, hi - lo)) * 100;
    const cur = Math.min(hi, Math.max(lo, Number(draft ?? value)));
    return (
      <div className="flex flex-col gap-1.5">{head}
        <div className="relative h-6">
          <i className="absolute inset-x-0 top-1/2 h-px bg-ink/40" />
          <span className="absolute inset-x-0 top-[calc(50%-4px)] flex justify-between" aria-hidden>{Array.from({ length: 11 }, (_, i) => <i key={i} className="block h-2 w-px bg-ink/40" />)}</span>
          {ghost !== null && <i className="absolute top-0 h-6 w-px bg-ink/30" style={{ left: `${pct(ghost)}%` }} aria-hidden />}
          <i className="pointer-events-none absolute top-0 h-6 w-[3px] -translate-x-1/2 bg-accent" style={{ left: `${pct(cur)}%` }} />
          <input id={id} type="range" min={lo} max={hi} step={st.step ?? 1} value={cur} aria-describedby={`${id}-why`} className="absolute inset-0 w-full cursor-ew-resize opacity-0"
            onPointerDown={() => setGhost(Number(value))}
            onChange={(e) => { const n = Number(e.target.value); if (ghost !== null) { setDraft(String(n)); onPeek?.(n); } else onChange(n); }}
            onPointerUp={() => { if (draft !== null) onChange(Number(draft)); setDraft(null); setGhost(null); onPeek?.(undefined); }} />
        </div>
        <span id={`${id}-why`} className="sr-only">{st.why}</span>
      </div>
    );
  }
  if (st.type === "choice") return (
    <div className="flex flex-col gap-1.5">{head}
      <div role="radiogroup" aria-label={st.label} className="flex flex-wrap gap-1" onPointerLeave={() => onPeek?.(undefined)}>
        {st.options!.map((o) => <button key={o} role="radio" aria-checked={value === o} title={FEELS[o]?.say} className="chip !h-8 !px-2.5" onPointerEnter={() => onPeek?.(o)} onFocus={() => onPeek?.(o)} onBlur={() => onPeek?.(undefined)} onClick={() => onChange(o)}>{o}</button>)}
      </div>
    </div>
  );
  if (st.type === "toggle") return (
    <button id={id} role="switch" aria-checked={!!value} title={st.why} onPointerEnter={() => onPeek?.(!value)} onPointerLeave={() => onPeek?.(undefined)} onFocus={() => onPeek?.(!value)} onBlur={() => onPeek?.(undefined)} onClick={() => onChange(!value)} className="cap flex h-8 items-center justify-between gap-3 text-left">
      <span className="truncate">{st.label}</span>
      <span className="relative block h-4 w-8 border border-ink"><i className="absolute top-0 block h-full w-1/2 transition-[left] duration-150" style={{ left: value ? "50%" : 0, background: value ? "var(--accent)" : "var(--ink)" }} /></span>
    </button>
  );
  return (
    <div className="flex flex-col gap-1.5">{head}
      <input id={id} value={draft ?? String(value)} maxLength={60} title={st.why} onChange={(e) => { setDraft(e.target.value); onPeek?.(e.target.value); }} onBlur={() => { if (draft !== null) onChange(draft); setDraft(null); onPeek?.(undefined); }} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); e.stopPropagation(); }}
        className="h-9 w-full border-b border-ink bg-transparent text-[15px] outline-none focus:border-accent" />
    </div>
  );
}

/* Measured weights: each mechanism's shipped source, gzipped in the browser. */
const weights = new Map<string, number>(); const subs = new Set<() => void>(); let started = false, snap = 0;
async function measure() {
  if (started || typeof CompressionStream === "undefined") return; started = true;
  for (const [id, fn] of Object.entries(DEMOS)) {
    try { const buf = await new Response(new Blob([String(fn)]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer(); weights.set(id, buf.byteLength); } catch { weights.set(id, Math.round(String(fn).length * 0.42)); }
  }
  snap++; subs.forEach((f) => f());
}
export function useWeights() {
  useEffect(() => { measure(); }, []);
  useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => snap, () => 0);
  return weights;
}
export const kb = (b?: number) => (b ? `${(b / 1024).toFixed(1)} KB` : "— KB");

/** A label that rolls to “Copied ✓” for 1.2 s and rolls back. No toasts. */
export function RollLabel({ on, a, b }: { on: boolean; a: string; b: string }) {
  const first = useRef(true); useEffect(() => { first.current = false; }, []);
  return <span className="inline-block overflow-hidden align-bottom" aria-live="polite"><span key={String(on)} className={first.current ? "" : "roll"}>{on ? b : a}</span></span>;
}
