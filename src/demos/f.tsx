"use client";
import { useMemo, useRef, useState } from "react";
import { rng, useAct, useTick } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;

// @plate barograph
export function Barograph(p: DemoProps) {
  const a = useAct(p, 3000);
  const seed = Number(p.v.seed), days = Number(p.v.days), W = 224, H = 84;
  const { path, last } = useMemo(() => {
    const r = rng(seed); let y = 0.5; const pts: number[] = [];
    for (let i = 0; i <= 48; i++) { y = Math.min(0.92, Math.max(0.08, y + (r() - 0.5) * 0.16)); pts.push(y); }
    return { path: pts.map((v, i) => `${i ? "L" : "M"}${((i / 48) * W).toFixed(1)} ${(v * H).toFixed(1)}`).join(" "), last: pts[48] };
  }, [seed]);
  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`Pressure trace over ${days} days, now ${Math.round(1030 - last * 50)} hectopascals`} className="flex flex-col gap-2" dir="ltr">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <g data-part="1" className="soft">
          <rect width={W} height={H} className="ln" />
          {Array.from({ length: days - 1 }, (_, i) => <path key={i} className="ln" d={`M${((i + 1) / days) * W} 0 V${H}`} strokeDasharray="2 3" />)}
          {[0.25, 0.5, 0.75].map((y) => <path key={y} className="ln" d={`M0 ${y * H} H${W}`} strokeDasharray="1 5" />)}
        </g>
        <path data-part="2" key={a.over ? "run" : "rest"} className="ln" d={path} pathLength={1} strokeDasharray={1} style={{ stroke: "var(--acc)", strokeWidth: "calc(var(--ln) * 1.5)", ["--len" as string]: 1, animation: a.over && !p.reduced ? `drawIn ${d(2200)} linear both` : "none" }} />
        <g data-part="3"><path className="ln" d={`M${W} ${last * H} h14 v-${last * H + 6}`} /><circle cx={W} cy={last * H} r="2.5" fill="currentColor" /></g>
      </svg>
      <span data-part="4" className="m flex justify-between"><span className="soft">Seed {String(seed).padStart(3, "0")} · {days} days</span><span>{Math.round(1030 - last * 50)} hPa {last < 0.5 ? "↑" : "↓"}</span></span>
    </div>
  );
}

// @plate compass-bearing
const WIND = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export function CompassBearing(p: DemoProps) {
  const a = useAct(p, 2600);
  const ref = useRef<SVGSVGElement>(null);
  const [live, setLive] = useState<number | null>(null);
  const t = useTick(40, a.sig && !p.reduced);
  const deg = a.sig ? (Number(p.v.bearing) + t * 6) % 360 : live ?? Number(p.v.bearing), n = Number(p.v.ticks);
  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`Bearing ${Math.round(deg)} degrees`} className="flex items-center gap-5" dir="ltr"
      onPointerMove={(e) => { const b = ref.current!.getBoundingClientRect(); setLive((Math.atan2(e.clientX - b.left - b.width / 2, -(e.clientY - b.top - b.height / 2)) * 180) / Math.PI + (360 % 360)); }}
      onPointerLeave={() => { a.bind.onPointerLeave(); setLive(null); }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") p.set("bearing", (Number(p.v.bearing) + 5) % 360); if (e.key === "ArrowLeft") p.set("bearing", (Number(p.v.bearing) + 355) % 360); }}>
      <svg ref={ref} width="112" height="112" viewBox="-56 -56 112 112">
        <circle data-part="1" r="46" className="ln" />
        <g data-part="2" className="soft">{Array.from({ length: n }, (_, i) => { const r = (i / n) * Math.PI * 2, l = i % (n / 4) === 0 ? 10 : 5; return <path key={i} className="ln" d={`M${Math.sin(r) * 46} ${-Math.cos(r) * 46} L${Math.sin(r) * (46 - l)} ${-Math.cos(r) * (46 - l)}`} />; })}</g>
        <text y="-49" textAnchor="middle" className="m" fill="currentColor">N</text>
        <g data-part="3" style={{ transform: `rotate(${deg}deg)`, transition: live !== null || a.sig ? "transform 120ms linear" : `transform ${d(640)} var(--ez)` }}>
          <path d="M0 -38 L5 0 H-5 Z" fill="var(--acc)" /><path className="ln" d="M-5 0 L0 38 L5 0" />
        </g>
        <circle r="2" fill="var(--paper)" stroke="currentColor" />
      </svg>
      <span className="flex flex-col"><span data-part="4" className="font-mono text-[26px] font-bold leading-none tabular-nums">{String(Math.round((deg + 360) % 360)).padStart(3, "0")}°</span><span className="m soft">{WIND[Math.round((((deg % 360) + 360) % 360) / 45) % 8]} · follows the pointer</span></span>
    </div>
  );
}

// @plate moon-phase
const PHASES = ["New", "Waxing crescent", "First quarter", "Waxing gibbous", "Full", "Waning gibbous", "Last quarter", "Waning crescent"];
export function MoonPhase(p: DemoProps) {
  const a = useAct(p, 3000);
  const t = useTick(90, a.over && !p.reduced);
  const day = a.over && !p.reduced ? (Number(p.v.day) + t) % 30 : Number(p.v.day), f = day / 29.53, R = 40;
  const wax = f <= 0.5, g = wax ? f : 1 - f, rx = Math.abs(R * Math.cos(2 * Math.PI * g));
  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`Moon, day ${day}: ${PHASES[Math.round(f * 8) % 8]}`} className="flex items-center gap-5" dir="ltr">
      <svg width="96" height="96" viewBox="-48 -48 96 96">
        <defs><pattern id="mh" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0 V5" className="ln" style={{ opacity: 0.45 }} /></pattern></defs>
        <circle data-part="1" r={R} fill="url(#mh)" className="ln" style={{ fill: "url(#mh)" }} />
        <path data-part="2" d={`M0 ${-R} A${R} ${R} 0 0 1 0 ${R} A${rx} ${R} 0 0 ${g < 0.25 ? 0 : 1} 0 ${-R} Z`} fill="currentColor" transform={wax ? undefined : "scale(-1 1)"} />
        <g data-part="3" className="soft">{Array.from({ length: 30 }, (_, i) => { const r = (i / 30) * Math.PI * 2; return <path key={i} className="ln" d={`M${Math.sin(r) * 44} ${-Math.cos(r) * 44} L${Math.sin(r) * 47} ${-Math.cos(r) * 47}`} style={{ stroke: i === day ? "var(--acc)" : undefined, strokeWidth: i === day ? "calc(var(--ln) * 3)" : undefined }} />; })}</g>
      </svg>
      <span className="flex flex-col"><span className="m soft">Day</span><span data-part="4" className="font-mono text-[26px] font-bold leading-none tabular-nums">{String(day).padStart(2, "0")}</span><span className="m" style={{ color: "var(--acc)" }}>{PHASES[Math.round(f * 8) % 8]}</span></span>
    </div>
  );
}

// @plate composing-stick
export function ComposingStick(p: DemoProps) {
  const a = useAct(p, 2600);
  const word = String(p.v.word).slice(0, 10) || " ", gap = Number(p.v.gap);
  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`Type set in a composing stick: ${word}`} className="flex flex-col gap-2" dir="ltr">
      <div data-part="1" className="relative flex items-end border-b border-l border-ink pb-1 pl-1 pr-6 pt-3" style={{ borderWidth: "0 0 calc(var(--ln) * 2) calc(var(--ln) * 2)", gap, minWidth: 180 }}>
        {word.split("").map((ch, i) => (
          <span key={`${a.over}-${i}`} data-part={i === 0 ? "2" : undefined} className="relative grid h-12 min-w-[18px] place-items-center border border-ink bg-plate px-[3px]" style={{ ...bw, animation: a.over && !p.reduced ? `rise ${d(360)} var(--ez) ${i * 70}ms both` : "none", borderColor: ch === " " ? "color-mix(in oklch, var(--ink) 30%, transparent)" : undefined }}>
            <span className="font-display text-[28px] font-bold leading-none" style={{ fontStretch: "80%" }}>{ch === " " ? "" : ch}</span>
            <i data-part={i === 0 ? "3" : undefined} className="absolute bottom-[5px] left-0 w-[3px]" style={{ height: 3, background: "var(--acc)" }} />
          </span>
        ))}
        <i className="absolute -right-px bottom-0 top-1 bg-ink" style={{ width: "calc(var(--ln) * 2)" }} />
      </div>
      <span data-part="4" className="m flex justify-between"><span className="soft">{word.replace(/\s/g, "").length} sorts · {word.split(" ").length - 1} spaces</span><span>Measure {word.length * 2} ems</span></span>
    </div>
  );
}

// @plate kerning-pair
export function KerningPair(p: DemoProps) {
  const a = useAct(p, 2600);
  const pair = (String(p.v.pair) + "AV").slice(0, 2);
  const [drag, setDrag] = useState<{ x: number; k: number } | null>(null);
  const t = useTick(40, a.sig && !p.reduced);
  const k = a.sig ? Math.round(Math.sin(t / 7) * 70) - 30 : Number(p.v.kern);
  const setK = (v: number) => p.set("kern", Math.round(Math.min(80, Math.max(-120, v))));
  return (
    <div {...a.bind} role="slider" tabIndex={0} aria-valuemin={-120} aria-valuemax={80} aria-valuenow={k} aria-label={`Kerning between ${pair[0]} and ${pair[1]}`} dir="ltr" className="flex touch-none select-none flex-col items-center gap-1" style={{ cursor: "ew-resize" }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag({ x: e.clientX, k }); }} onPointerMove={(e) => drag && setK(drag.k + (e.clientX - drag.x) * 2)} onPointerUp={() => setDrag(null)}
      onKeyDown={(e) => { const s = e.shiftKey ? 10 : 2; if (e.key === "ArrowRight") setK(k + s); if (e.key === "ArrowLeft") setK(k - s); }}>
      <span className="relative flex items-end font-display text-[84px] font-bold leading-[0.8]" style={{ fontStretch: "90%" }}>
        <span data-part="1" className="relative">{pair[0]}{(a.over || drag) && <i className="absolute -bottom-2 -top-2 right-0" style={{ width: "var(--ln)", background: "var(--acc)" }} />}</span>
        <span data-part="2" className="relative" style={{ marginLeft: `${k / 1000}em`, transition: drag || a.sig ? "none" : `margin ${d(240)} var(--ez)` }}>{pair[1]}{(a.over || drag) && <i className="absolute -bottom-2 -top-2 left-0" style={{ width: "var(--ln)", background: "var(--acc)" }} />}</span>
      </span>
      <span data-part="3" className="m mt-2 flex w-[180px] justify-between"><span className="soft">Drag or ← →</span><span style={{ color: k !== 0 ? "var(--acc)" : undefined }}>{k > 0 ? "+" : k < 0 ? "−" : ""}{String(Math.abs(k)).padStart(3, "0")} / 1000 em</span></span>
    </div>
  );
}

// @plate width-axis
export function WidthAxis(p: DemoProps) {
  const a = useAct(p, 2800);
  const [u, setU] = useState<number | null>(null);
  const t = useTick(40, a.sig && !p.reduced);
  const f = a.sig ? 0.5 + Math.sin(t / 9) * 0.5 : u ?? (Number(p.v.width) - 62) / 63, wd = Math.round(62 + f * 63), wg = Number(p.v.weight);
  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`${p.v.word} at width ${wd}`} className="flex w-[250px] flex-col gap-2" dir="ltr"
      onPointerMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); setU(Math.min(1, Math.max(0, (e.clientX - b.left) / b.width))); }}
      onPointerLeave={() => { a.bind.onPointerLeave(); setU(null); }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") p.set("width", Math.min(125, Number(p.v.width) + 3)); if (e.key === "ArrowLeft") p.set("width", Math.max(62, Number(p.v.width) - 3)); }}>
      <span data-part="1" className="block h-[52px] overflow-hidden whitespace-nowrap font-display text-[50px] leading-none" style={{ fontVariationSettings: `"wdth" ${wd}, "wght" ${wg}`, fontStretch: `${wd}%`, fontWeight: wg, letterSpacing: "-0.02em" }}>{String(p.v.word) || "—"}</span>
      <span data-part="2" className="relative block h-3 border-x border-ink" style={{ borderWidth: "0 var(--ln)" }}>
        <i className="absolute inset-x-0 top-1/2 bg-ink" style={{ height: "var(--ln)" }} />
        <i className="absolute -top-0.5 h-4" style={{ left: `${f * 100}%`, width: 3, background: "var(--acc)", transition: u !== null || a.sig ? "none" : `left ${d(240)} var(--ez)` }} />
      </span>
      <span data-part="3" className="m flex justify-between"><span>wdth {String(wd).padStart(3, "0")}</span><span className="soft">wght {wg}</span></span>
    </div>
  );
}
