"use client";
import { useEffect, useMemo, useState } from "react";
import { rng, useAct, useTick } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((x) => (x + 0.5) / 16);

// @plate develop
export function Develop(p: DemoProps) {
  const a = useAct(p, 3200);
  const cols = Number(p.v.grain), rows = Math.round(cols * 0.62), seed = Number(p.v.seed), c = 200 / cols;
  const [t, setT] = useState(0.12);
  useEffect(() => {
    if (!a.over) { setT(0.12); return; }
    if (p.reduced) { setT(1); return; }
    let x = 0.12; const i = setInterval(() => { x = Math.min(1, x + 0.022); setT(x); if (x >= 1) clearInterval(i); }, 40);
    return () => clearInterval(i);
  }, [a.over, p.reduced]);
  const img = useMemo(() => {
    const r = rng(seed), sx = 0.25 + r() * 0.5, sy = 0.2 + r() * 0.2, h1 = 0.55 + r() * 0.15, ph = r() * 6;
    return (u: number, v: number) => {
      const sun = Math.hypot(u - sx, (v - sy) * 0.62) < 0.11 ? 0.05 : 0;
      const hill = v > h1 + Math.sin(u * 5 + ph) * 0.07 ? 0.92 : v > h1 - 0.12 + Math.sin(u * 3 + ph * 2) * 0.05 ? 0.6 : 0;
      return sun ? 1 : Math.max(hill, 0.18 + v * 0.25);
    };
  }, [seed]);
  const cells = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (img((i + 0.5) / cols, (j + 0.5) / rows) * t > BAYER[(j % 4) * 4 + (i % 4)]) cells.push(<rect key={`${i}.${j}`} x={i * c} y={j * c} width={c + 0.3} height={c + 0.3} />);
  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`Photograph developing, ${Math.round(t * 100)} percent`} className="flex flex-col gap-2">
      <div data-part="1" className="border border-ink p-1.5" style={bw}><svg data-part="2" width="200" height={rows * c} viewBox={`0 0 200 ${rows * c}`} fill="currentColor" shapeRendering="crispEdges">{cells}</svg></div>
      <span data-part="3" className="m flex justify-between gap-3"><span className="soft">Seed {String(seed).padStart(3, "0")} · {t >= 1 ? "Fixed" : "In tray"}</span><span>00:{String(Math.round(t * 90)).padStart(2, "0")}</span></span>
    </div>
  );
}

// @plate contact-sheet
export function ContactSheet(p: DemoProps) {
  const a = useAct(p, 2400);
  const n = Number(p.v.frames), start = parseInt(String(p.v.start)) || 1;
  const [sel, setSel] = useState(1);
  const t = useTick(520, a.sig);
  const cur = a.sig ? t % n : Math.min(sel, n - 1);
  return (
    <div {...a.bind} role="radiogroup" aria-label="Choose a frame" className="flex flex-col gap-2" dir="ltr"
      onKeyDown={(e) => { if (e.key === "ArrowRight") setSel((s) => Math.min(n - 1, s + 1)); if (e.key === "ArrowLeft") setSel((s) => Math.max(0, s - 1)); }}>
      <div data-part="1" className="flex gap-0 border-y border-ink py-2" style={{ borderWidth: "var(--ln) 0" }}>
        {Array.from({ length: n }, (_, i) => (
          <button key={i} role="radio" aria-checked={cur === i} tabIndex={cur === i ? 0 : -1} onClick={() => setSel(i)} data-part={i === 0 ? "2" : undefined} className="relative mx-1 block h-[52px] w-[42px] border border-ink" style={bw} aria-label={`Frame ${start + i}A`}>
            <i className="absolute inset-x-0 bottom-0 bg-ink" style={{ height: `${22 + ((i * 37 + start * 11) % 50)}%`, opacity: 0.18 + ((i * 3) % 4) * 0.16 }} />
            <span className="m soft absolute -bottom-[18px] left-0" style={{ fontSize: 9 }}>{start + i}A</span>
            {cur === i && (
              <svg data-part="3" viewBox="0 0 60 70" className="pointer-events-none absolute -inset-2" style={{ color: "var(--acc)" }}>
                <path key={i} className="ln" strokeWidth={2} d="M30 4 C52 2 58 20 56 38 C54 60 40 68 26 66 C8 64 2 44 4 28 C6 10 22 2 38 6" pathLength={1} strokeDasharray={1} style={{ ["--len" as string]: 1, animation: p.reduced ? "none" : `drawIn ${d(480)} var(--ez) both`, strokeWidth: "calc(var(--ln) * 2)" }} />
              </svg>
            )}
          </button>
        ))}
      </div>
      <span className="m mt-3 flex justify-between gap-3"><span className="soft">Roll 04</span><span>Print {start + cur}A</span></span>
    </div>
  );
}

// @plate shutter-toggle
export function ShutterToggle(p: DemoProps) {
  const a = useAct(p, 2000);
  const [on, setOn] = useState(false);
  const open = on !== a.sig || p.moment === "done", n = Number(p.v.blades), r = open ? 17 : 3, R = 26;
  const pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2 + (open ? 0.5 : 0); return [Math.cos(t), Math.sin(t)]; });
  return (
    <button {...a.bind} role="switch" aria-checked={open} onClick={() => setOn((o) => !o)} className="flex items-center gap-5 text-left">
      <svg data-part="1" width="64" height="64" viewBox="-32 -32 64 64" style={{ transform: a.down ? "scale(0.96)" : "none" }}>
        <circle r={R} className="ln" /><circle r={R + 4} className="ln soft" strokeDasharray="1 5" />
        <g data-part="2">{pts.map(([x, y], i) => { const [nx, ny] = pts[(i + 1) % n]; const t = (i / n) * Math.PI * 2 + 2.1 + (open ? 0.5 : 0);
          return <path key={i} className="ln" d={`M${x * r} ${y * r} L${nx * r} ${ny * r} M${x * r} ${y * r} L${Math.cos(t) * R} ${Math.sin(t) * R}`} style={{ transition: `d ${d(480)} var(--ez)` }} />; })}</g>
        <circle r={Math.max(0, r - 5)} fill="var(--acc)" style={{ transition: `r ${d(480)} var(--ez)` }} />
      </svg>
      <span>
        <span data-part="3" className="block text-[18px] font-medium tracking-tight">{String(p.v.label)}</span>
        <span className="m block" style={{ color: open ? "var(--acc)" : undefined }}>{open ? "ƒ/2.8 · open" : "ƒ/22 · closed"}</span>
      </span>
    </button>
  );
}

// @plate spirit-level
export function SpiritLevel(p: DemoProps) {
  const a = useAct(p, 2200);
  const [on, setOn] = useState(false);
  const level = on !== a.sig || p.moment === "done", tilt = Number(p.v.tilt);
  return (
    <button {...a.bind} role="switch" aria-checked={level} onClick={() => setOn((o) => !o)} className="flex flex-col items-start gap-3 text-left">
      <span data-part="1" className="tr relative block h-9 w-[168px] border border-ink" style={{ borderWidth: "var(--ln)", borderRadius: 999, transform: level ? "none" : `rotate(${a.over ? tilt / 2 : tilt}deg)`, transitionDuration: d(640) }}>
        <i data-part="3" className="absolute inset-y-0 left-[calc(50%-17px)] bg-ink" style={{ width: "var(--ln)" }} /><i className="absolute inset-y-0 left-[calc(50%+17px)] bg-ink" style={{ width: "var(--ln)" }} />
        <i data-part="2" className="tr absolute top-[5px] block size-[24px] rounded-full border" style={{ borderWidth: "var(--ln)", borderColor: level ? "var(--acc)" : "var(--ink)", background: level ? "var(--acc)" : "transparent", left: level ? "calc(50% - 12px)" : "calc(100% - 34px)", transitionDuration: d(800) }} />
      </span>
      <span className="flex w-[168px] items-baseline justify-between">
        <span data-part="4" className="truncate text-[16px] font-medium tracking-tight">{String(p.v.label)}</span>
        <span className="m" style={{ color: level ? "var(--acc)" : undefined }}>{level ? "0.0° level" : `${tilt.toFixed(1)}° off`}</span>
      </span>
    </button>
  );
}

// @plate needle-gauge
export function NeedleGauge(p: DemoProps) {
  const a = useAct(p, 2400);
  const [peak, setPeak] = useState(false);
  useEffect(() => { if (!a.sig) return; setPeak(true); const t = setTimeout(() => setPeak(false), 700); return () => clearTimeout(t); }, [a.sig]);
  const load = peak ? 100 : Number(p.v.load), n = Number(p.v.ticks), ang = -60 + (load / 100) * 120;
  return (
    <div {...a.bind} tabIndex={0} role="meter" aria-valuenow={load} aria-valuemin={0} aria-valuemax={100} aria-label={`Load in ${p.v.unit}`} className="flex flex-col items-center gap-1" dir="ltr">
      <svg width="200" height="112" viewBox="-100 -100 200 112">
        <path data-part="1" className="ln" d="M-77.9 -45 A90 90 0 0 1 77.9 -45" />
        <g data-part="2" className="soft">{Array.from({ length: n + 1 }, (_, i) => { const t = ((-60 + (i / n) * 120 - 90) * Math.PI) / 180, l = i % 5 === 0 ? 12 : 6; return <path key={i} className="ln" d={`M${Math.cos(t) * 90} ${Math.sin(t) * 90} L${Math.cos(t) * (90 - l)} ${Math.sin(t) * (90 - l)}`} />; })}</g>
        <path className="ln" stroke="var(--acc)" style={{ stroke: "var(--acc)", strokeWidth: "calc(var(--ln) * 3)" }} d="M59 -68 A90 90 0 0 1 77.9 -45" />
        <g data-part="3" style={{ transform: `rotate(${ang}deg)`, transition: `transform ${d(peak ? 480 : 900)} var(--ez)`, color: a.over ? "var(--acc)" : undefined }}><path className="ln" d="M0 6 V-84" /><circle r="4" fill="currentColor" /></g>
        <text x="-86" y="-22" className="m soft" fill="currentColor">0</text><text x="86" y="-22" textAnchor="end" className="m soft" fill="currentColor">MAX</text>
      </svg>
      <span data-part="4" className="m">{String(Math.round(load * 4.2)).padStart(3, "0")} {String(p.v.unit).slice(0, 4)} <span className="soft">· settles before reading</span></span>
    </div>
  );
}

// @plate detent-knob
export function DetentKnob(p: DemoProps) {
  const a = useAct(p, 2600);
  const n = Number(p.v.detents), names = String(p.v.labels).split(/\s+/).filter(Boolean);
  const [pos, setPos] = useState(1);
  const t = useTick(420, a.sig);
  const cur = a.sig ? t % n : Math.min(pos, n - 1), span = 240, ang = -span / 2 + (cur / Math.max(1, n - 1)) * span;
  const step = (k: number) => setPos((s) => Math.min(n - 1, Math.max(0, Math.min(s, n - 1) + k)));
  return (
    <div {...a.bind} role="slider" tabIndex={0} aria-valuemin={1} aria-valuemax={n} aria-valuenow={cur + 1} aria-valuetext={names[cur] ?? String(cur + 1)} aria-label="Band selector" dir="ltr"
      className="flex cursor-pointer select-none items-center gap-5" onClick={() => setPos((s) => (Math.min(s, n - 1) + 1) % n)}
      onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowUp") step(1); if (e.key === "ArrowLeft" || e.key === "ArrowDown") step(-1); }}>
      <svg width="104" height="104" viewBox="-52 -52 104 104">
        <g data-part="3">{Array.from({ length: n }, (_, i) => { const r = ((-span / 2 + (i / Math.max(1, n - 1)) * span - 90) * Math.PI) / 180; return <path key={i} className="ln" d={`M${Math.cos(r) * 42} ${Math.sin(r) * 42} L${Math.cos(r) * 50} ${Math.sin(r) * 50}`} style={{ stroke: i === cur ? "var(--acc)" : undefined, strokeWidth: i === cur ? "calc(var(--ln) * 2.5)" : undefined }} />; })}</g>
        <circle data-part="1" r="34" className="ln" fill={a.down ? "var(--ink)" : "none"} />
        <g data-part="2" style={{ transform: `rotate(${ang}deg)`, transition: `transform ${d(240)} var(--ez)` }}><path className="ln" d="M0 -34 V-16" style={{ strokeWidth: "calc(var(--ln) * 2)", stroke: a.down ? "var(--paper)" : undefined }} /></g>
      </svg>
      <span className="flex flex-col"><span data-part="4" className="font-display text-[30px] font-bold leading-none">{(names[cur] ?? String(cur + 1)).slice(0, 4)}</span><span className="m soft">Detent {cur + 1} of {n}</span></span>
    </div>
  );
}
