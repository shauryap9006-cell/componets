"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { rng, useAct, useTick } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;

// @plate fader
export function Fader(p: DemoProps) {
  const a = useAct(p, 2400);
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  const t = useTick(60, a.over && !p.reduced);
  const lvl = a.sig ? 50 + Math.sin(t / 5) * 40 : Number(p.v.level), H = 108;
  const vu = Math.max(0, Math.min(12, Math.round((lvl / 100) * 12 + (a.over ? Math.sin(t * 1.7) * 1.2 : 0))));
  const from = (cy: number) => { const b = ref.current!.getBoundingClientRect(); p.set("level", Math.round(Math.min(100, Math.max(0, (1 - (cy - b.top) / b.height) * 100)))); };
  return (
    <div {...a.bind} dir="ltr" className="flex items-end gap-4">
      <div ref={ref} role="slider" aria-orientation="vertical" tabIndex={0} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(lvl)} aria-label={`${p.v.label} level`} className="relative w-14 touch-none select-none" style={{ height: H, cursor: "ns-resize" }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); from(e.clientY); }} onPointerMove={(e) => drag && from(e.clientY)} onPointerUp={() => setDrag(false)}
        onKeyDown={(e) => { const s = e.shiftKey ? 10 : 2; if (e.key === "ArrowUp") p.set("level", Math.min(100, lvl + s)); if (e.key === "ArrowDown") p.set("level", Math.max(0, lvl - s)); }}>
        <i data-part="1" className="absolute inset-y-0 left-1/2 bg-ink" style={{ width: "var(--ln)" }} />
        <span data-part="3" className="soft">{[0, 1, 2, 3, 4, 5, 6].map((i) => <i key={i} className="absolute left-0 bg-current" style={{ top: `${(i / 6) * 100}%`, height: "var(--ln)", width: i % 3 === 0 ? 10 : 5 }} />)}</span>
        <span data-part="2" className="absolute left-1/2 grid h-5 w-9 -translate-x-1/2 place-items-center border border-ink bg-paper" style={{ ...bw, bottom: `calc(${lvl}% - 10px)`, transition: drag || a.sig ? "none" : `bottom ${d(240)} var(--ez)`, background: drag ? "var(--ink)" : undefined }}>
          <i className="block w-5" style={{ height: "var(--ln)", background: "var(--acc)" }} />
        </span>
      </div>
      <div data-part="4" className="flex flex-col-reverse gap-[3px]" aria-hidden>{Array.from({ length: 12 }, (_, i) => <i key={i} className="block h-[6px] w-3 border border-ink" style={{ borderWidth: "var(--ln)", background: i < vu ? (i > 9 ? "var(--acc)" : "var(--ink)") : "transparent" }} />)}</div>
      <span className="m flex flex-col gap-1"><span className="soft truncate">{String(p.v.label)}</span><span>{lvl < 1 ? "−∞" : `${((lvl - 75) * 0.4).toFixed(1)}`} dB</span></span>
    </div>
  );
}

// @plate metronome
export function Metronome(p: DemoProps) {
  const a = useAct(p, 3000);
  const bpm = Number(p.v.bpm), beats = Number(p.v.beats), run = a.over || p.moment === "busy";
  const beat = useTick(60000 / bpm, run);
  return (
    <div {...a.bind} tabIndex={0} role="status" aria-label={run ? `Keeping time at ${bpm} beats per minute` : "Metronome at rest"} className="flex items-end gap-5" dir="ltr">
      <svg width="96" height="112" viewBox="-48 -100 96 112">
        <path data-part="1" className="ln" d="M-22 8 L-10 -92 H10 L22 8 Z" />
        <g className="soft">{[-70, -52, -34, -16].map((y) => <path key={y} className="ln" d={`M-4 ${y} h8`} />)}</g>
        <g data-part="2" style={{ transformOrigin: "0px 0px", animation: run && !p.reduced ? `swing ${60 / bpm}s ease-in-out infinite alternate` : "none" }}>
          <path className="ln" d="M0 0 V-96" />
          <rect data-part="3" x="-7" y={-88 + (bpm - 40) * 0.36} width="14" height="9" fill="var(--acc)" />
        </g>
        <circle r="3" fill="currentColor" />
      </svg>
      <span className="flex flex-col gap-2">
        <span data-part="4" className="flex gap-1.5">{Array.from({ length: beats }, (_, i) => <i key={i} className="block size-2.5 border border-ink" style={{ borderWidth: "var(--ln)", background: run && beat % beats === i ? (i === 0 ? "var(--acc)" : "var(--ink)") : "transparent" }} />)}</span>
        <span className="font-mono text-[22px] font-bold leading-none tabular-nums">{bpm}</span>
        <span className="m soft">{run ? "Keeping time" : "At rest"} · bpm</span>
      </span>
    </div>
  );
}

// @plate step-sequencer
export function StepSequencer(p: DemoProps) {
  const a = useAct(p, 3200);
  const n = Number(p.v.steps), seed = Number(p.v.seed);
  const init = useMemo(() => { const r = rng(seed); return Array.from({ length: 2 * 12 }, () => r() > 0.62); }, [seed]);
  const [flip, setFlip] = useState<Record<number, boolean>>({});
  const head = useTick(140, a.over && !p.reduced) % n;
  const on = (i: number) => init[i] !== !!flip[i];
  return (
    <div {...a.bind} className="flex flex-col gap-2" dir="ltr">
      {[0, 1].map((row) => (
        <div key={row} data-part={row === 0 ? "1" : undefined} className="flex items-center gap-[5px]">
          <span className="m soft w-7">{row ? "SN" : "BD"}</span>
          {Array.from({ length: n }, (_, c) => { const i = row * 12 + c, hit = a.over && head === c; return (
            <button key={c} data-part={i === 0 ? "2" : undefined} aria-pressed={on(i)} aria-label={`${row ? "Snare" : "Bass"} step ${c + 1}`} onClick={() => setFlip((f) => ({ ...f, [i]: !f[i] }))}
              className="block size-5 border border-ink" style={{ ...bw, background: on(i) ? (hit ? "var(--acc)" : "var(--ink)") : "transparent", borderColor: hit ? "var(--acc)" : undefined, marginRight: c % 4 === 3 ? 4 : 0 }} />
          ); })}
        </div>
      ))}
      <div className="flex items-center gap-[5px] ps-[33px]" data-part="3">{Array.from({ length: n }, (_, c) => <i key={c} className="block h-[3px] w-5" style={{ background: a.over && head === c ? "var(--acc)" : "transparent", marginRight: c % 4 === 3 ? 4 : 0 }} />)}</div>
      <span className="m flex justify-between"><span className="soft">Pattern {String(seed).padStart(3, "0")}</span><span>Step {String((a.over ? head : 0) + 1).padStart(2, "0")}/{n}</span></span>
    </div>
  );
}

// @plate comb-field
export function CombField(p: DemoProps) {
  const a = useAct(p, 2600);
  const n = Number(p.v.boxes);
  const [txt, setTxt] = useState(""), [foc, setFoc] = useState(false);
  const t = useTick(180, a.sig);
  const val = (a.sig && !txt ? "CH4821XQ07".slice(0, Math.min(n, t + 1)) : txt).slice(0, n), full = val.length >= n;
  return (
    <label {...a.bind} className="relative flex flex-col gap-2">
      <span data-part="3" className="m flex justify-between gap-6"><span className="truncate">{String(p.v.label)}</span><span className="soft">Block capitals</span></span>
      <input value={txt} maxLength={n} onChange={(e) => setTxt(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)} className="absolute inset-0 z-10 cursor-text opacity-0" aria-label={String(p.v.label)} autoComplete="off" />
      <span data-part="1" className="flex" dir="ltr">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} data-part={i === 0 ? "2" : undefined} className="relative -ml-px grid h-10 w-7 place-items-center border-b border-l border-r border-ink first:ml-0" style={{ borderWidth: "0 var(--ln) var(--ln)", borderColor: foc && i === Math.min(val.length, n - 1) ? "var(--acc)" : undefined, zIndex: foc && i === Math.min(val.length, n - 1) ? 1 : 0 }}>
            <span key={val[i] ?? ""} className="font-mono text-[20px] font-bold" style={{ animation: val[i] && !p.reduced ? `stampIn ${d(160)} var(--ez) both` : "none" }}>{val[i] ?? ""}</span>
            {foc && i === val.length && <i className="absolute bottom-1.5 h-[2px] w-3" style={{ background: "var(--acc)", animation: "blink 1s steps(2) infinite" }} />}
          </span>
        ))}
      </span>
      <span className="m flex justify-between"><span className="soft">{full ? "Complete" : `${n - val.length} boxes left`}</span><span style={{ color: full ? "var(--acc)" : undefined }}>{full ? "✓" : `${val.length}/${n}`}</span></span>
    </label>
  );
}

// @plate barcode-scan
export function BarcodeScan(p: DemoProps) {
  const a = useAct(p, 2600);
  const seed = Number(p.v.seed), n = Number(p.v.bars);
  const { bars, code } = useMemo(() => { const r = rng(seed); return { bars: Array.from({ length: n }, () => 1 + Math.floor(r() * 3)), code: Array.from({ length: 12 }, () => Math.floor(r() * 10)).join("") }; }, [seed, n]);
  const [pos, setPos] = useState(0);
  useEffect(() => {
    if (!a.over) { setPos(0); return; }
    if (p.reduced) { setPos(100); return; }
    let x = 0; const i = setInterval(() => { x = Math.min(100, x + 2.5); setPos(x); if (x >= 100) clearInterval(i); }, 30);
    return () => clearInterval(i);
  }, [a.over, p.reduced]);
  const total = bars.reduce((s, b) => s + b + 1.5, 0), read = Math.floor((pos / 100) * 12), ok = pos >= 100 || p.moment === "done";
  let x = 0;
  return (
    <div {...a.bind} tabIndex={0} role="status" aria-label={ok ? `Read ${code}` : "Barcode waiting to be scanned"} className="flex w-[216px] flex-col gap-2" dir="ltr">
      <div className="relative">
        <svg data-part="1" width="216" height="64" viewBox={`0 0 ${total} 64`} preserveAspectRatio="none" fill="currentColor">{bars.map((b, i) => { const r = <rect key={i} x={x} y="0" width={b} height={i % 11 === 0 ? 64 : 58} />; x += b + 1.5; return r; })}</svg>
        {a.over && !ok && <i data-part="2" className="absolute -inset-y-2" style={{ left: `${pos}%`, width: 2, background: "var(--acc)" }} />}
      </div>
      <span data-part="3" className="flex justify-between font-mono text-[14px] tabular-nums tracking-[0.18em]">{(ok ? code : code.slice(0, read).padEnd(12, "·")).replace(/(.{4})/g, "$1 ")}</span>
      <span className="m flex justify-between"><span className="soft">{ok ? "Read · checksum holds" : a.over ? "Scanning" : "Hold to scan"}</span><span style={{ color: ok ? "var(--acc)" : undefined }}>{ok ? "✓" : `${Math.round(pos)}%`}</span></span>
    </div>
  );
}

// @plate strike-out
export function StrikeOut(p: DemoProps) {
  const a = useAct(p, 2600);
  const opts = String(p.v.options).split(";").map((s) => s.trim()).filter(Boolean).slice(0, 4), n = opts.length;
  const [sel, setSel] = useState(-1);
  const t = useTick(640, a.sig);
  const cur = a.sig ? t % n : sel;
  return (
    <div {...a.bind} role="radiogroup" aria-label={String(p.v.label)} className="flex max-w-[250px] flex-col gap-2"
      onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowDown") setSel((s) => (s + 1) % n); if (e.key === "ArrowLeft" || e.key === "ArrowUp") setSel((s) => (s - 1 + n) % n); }}>
      <span data-part="3" className="m flex justify-between gap-4"><span className="truncate">{String(p.v.label)}</span><span className="soft">*Delete as applicable</span></span>
      <span data-part="1" className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-ink pb-2" style={{ borderBottomWidth: "var(--ln)" }}>
        {opts.map((o, i) => (
          <span key={i} className="flex items-baseline gap-2">
            <button role="radio" aria-checked={cur === i} tabIndex={cur === i || (cur < 0 && i === 0) ? 0 : -1} onClick={() => setSel(i)} className="relative text-[22px] font-medium tracking-tight" style={{ opacity: cur >= 0 && cur !== i ? 0.55 : 1 }}>
              {o}
              <i data-part={i === 0 ? "2" : undefined} className="tr absolute -inset-x-1 top-[55%] origin-left" style={{ height: "calc(var(--ln) * 1.5)", background: "var(--acc)", transform: `scaleX(${cur >= 0 && cur !== i ? 1 : 0}) rotate(-2deg)`, transitionDelay: `${i * 48}ms` }} />
            </button>
            {i < n - 1 && <span className="soft">/</span>}
          </span>
        ))}
      </span>
      <span className="m soft">{cur >= 0 ? `Declared: ${opts[cur]}` : "Nothing struck yet"}</span>
    </div>
  );
}
