"use client";
import { useEffect, useRef, useState } from "react";
import { useAct, useTick } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;

// @plate misregister
export function Misregister(p: DemoProps) {
  const a = useAct(p, 2000);
  const r = (Number(p.v.angle) * Math.PI) / 180, k = a.over ? Number(p.v.drift) : 1;
  const x = Math.cos(r) * k, y = Math.sin(r) * k;
  const word = String(p.v.word) || "—";
  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={word} className="relative flex flex-col items-start gap-1">
      <span className="m soft">Plate 1 · ink &nbsp; Plate 2 · accent</span>
      <span className="relative block max-w-[260px] truncate font-display text-[54px] font-extrabold leading-[0.95]" style={{ fontStretch: "75%", letterSpacing: "-0.03em" }}>
        <span data-part="2" aria-hidden className="tr absolute inset-0 truncate" style={{ color: "var(--acc)", transform: `translate(${x}px, ${y}px)`, transitionDuration: d(480) }}>{word}</span>
        <span data-part="1" className="relative" style={{ mixBlendMode: "multiply" }}>{word}</span>
      </span>
      <span data-part="3" className="m flex w-full justify-between"><span className="soft">Off register</span><span>Δ {x.toFixed(1)} / {y.toFixed(1)} px</span></span>
    </div>
  );
}

// @plate halftone-dial
export function HalftoneDial(p: DemoProps) {
  const a = useAct(p, 2400);
  const cols = Number(p.v.cells), rows = Math.round(cols * 0.6), W = 220, cell = W / cols;
  const [lx, setLx] = useState(0.3);
  const t = useTick(40, a.sig && !p.reduced);
  const light = a.sig ? (t % 60) / 60 : lx;
  const dots = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const u = (i + 0.5) / cols, v = (j + 0.5) / rows;
    const f = Math.max(0, 1 - Math.hypot(u - light, (v - 0.5) * 0.6) * 1.9);
    dots.push(<circle key={`${i}-${j}`} cx={(i + 0.5) * cell} cy={(j + 0.5) * cell} r={Math.max(0.4, f * cell * 0.62)} fill={f > 0.86 ? "var(--acc)" : "currentColor"} />);
  }
  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="Halftone screen following a light" className="flex flex-col gap-2"
      onPointerMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); setLx((e.clientX - b.left) / b.width); }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") setLx((l) => Math.min(1, l + 0.05)); if (e.key === "ArrowLeft") setLx((l) => Math.max(0, l - 0.05)); }}>
      <svg data-part="1" width={W} height={rows * cell} viewBox={`0 0 ${W} ${rows * cell}`}>{dots}</svg>
      <span data-part="2" className="m flex justify-between"><span className="soft">{cols} lines · round dot</span><span>Light {Math.round(light * 100)}%</span></span>
    </div>
  );
}

// @plate ink-pull
export function InkPull(p: DemoProps) {
  const a = useAct(p, 2400);
  const [run, setRun] = useState<number | null>(null);
  useEffect(() => {
    if (!a.over || p.reduced) { setRun(null); return; }
    let x = 0; setRun(0);
    const t = setInterval(() => { x = Math.min(100, x + 2); setRun(x); if (x >= 100) clearInterval(t); }, 28);
    return () => clearInterval(t);
  }, [a.over, p.reduced]);
  const pct = p.moment === "done" ? 100 : run ?? Number(p.v.at);
  return (
    <div {...a.bind} tabIndex={0} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={String(p.v.label)} className="flex w-[200px] flex-col gap-2">
      <div data-part="1" className="relative h-[92px] border border-ink" style={bw}>
        <div data-part="3" className="absolute inset-x-0 top-0 bg-ink" style={{ height: `${pct}%`, opacity: 0.9 }} />
        <div className="hatch absolute inset-x-0 bottom-0" style={{ top: `${pct}%` }} />
        <div data-part="2" className="absolute -inset-x-2 h-[5px]" style={{ top: `calc(${pct}% - 2px)`, background: "var(--acc)" }} />
      </div>
      <span className="m flex justify-between"><span className="soft truncate">{pct >= 100 ? "Proof pulled" : String(p.v.label)}</span><span data-part="4">{String(Math.round(pct)).padStart(3, "0")}%</span></span>
    </div>
  );
}

// @plate caliper-slider
export function CaliperSlider(p: DemoProps) {
  const a = useAct(p, 2200);
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  const t = useTick(30, a.sig && !p.reduced);
  const val = a.sig ? 50 + Math.sin(t / 8) * 35 : Number(p.v.value);
  const W = 220, x = (val / 100) * W, n = Number(p.v.ticks);
  const from = (cx: number) => { const b = ref.current!.getBoundingClientRect(); p.set("value", Math.round(Math.min(100, Math.max(0, ((cx - b.left) / b.width) * 100)))); };
  return (
    <div {...a.bind} ref={ref} dir="ltr" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(val)} aria-label={`Measure in ${p.v.unit}`}
      className="relative h-[96px] touch-none select-none" style={{ width: W, cursor: "ew-resize" }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); from(e.clientX); }}
      onPointerMove={(e) => drag && from(e.clientX)} onPointerUp={() => setDrag(false)}
      onKeyDown={(e) => { const s = e.shiftKey ? 10 : 1; if (e.key === "ArrowRight" || e.key === "ArrowUp") p.set("value", Math.min(100, val + s)); if (e.key === "ArrowLeft" || e.key === "ArrowDown") p.set("value", Math.max(0, val - s)); }}>
      <svg width={W} height="96" viewBox={`0 0 ${W} 96`}>
        <g data-part="4" className="soft">
          <path className="ln" d={`M0 14 H${x} M0 9 v10 M${x} 9 v10`} style={{ transition: drag ? "none" : `d ${d(240)} var(--ez)` }} />
          <text x={x / 2} y="9" textAnchor="middle" className="m" fill="var(--ink)">{val.toFixed(1)} {String(p.v.unit).slice(0, 4)}</text>
        </g>
        <path data-part="1" className="ln" d={`M0 26 V62 H${W} M0 26 h8 v24`} />
        <g data-part="2" style={{ transform: `translateX(${x}px)`, transition: drag || a.sig ? "none" : `transform ${d(240)} var(--ez)`, color: a.over || drag ? "var(--acc)" : undefined }}>
          <path className="ln" d="M0 26 V70 h14 v-8 M0 26 h-8 v24" /><rect x="3" y="64" width="8" height="3" fill="currentColor" />
        </g>
        <g data-part="3" className="soft">{Array.from({ length: n + 1 }, (_, i) => <path key={i} className="ln" d={`M${(i / n) * W} 62 v${i % 5 === 0 ? 10 : 5}`} />)}</g>
        <text x="0" y="90" className="m soft" fill="currentColor">0</text><text x={W} y="90" textAnchor="end" className="m soft" fill="currentColor">100</text>
      </svg>
    </div>
  );
}

// @plate dimension-input
export function DimensionInput(p: DemoProps) {
  const a = useAct(p, 2400);
  const [txt, setTxt] = useState("");
  const demo = "Bracket, left".slice(0, a.sig ? 13 : 0);
  const val = a.sig && !txt ? demo : txt, max = Number(p.v.max), n = val.length, over = n > max;
  return (
    <label {...a.bind} className="flex w-[240px] flex-col gap-1 font-mono text-[16px]">
      <span data-part="3" className="tr relative h-4" style={{ width: `min(${Math.max(n, 1)}ch, 100%)`, color: over ? "var(--acc)" : undefined, marginInlineStart: 12, transitionDuration: d(240) }} aria-hidden>
        <i className="absolute inset-x-0 top-2 bg-current" style={{ height: "var(--ln)" }} />
        <i className="absolute left-0 top-0 h-4 bg-current" style={{ width: "var(--ln)" }} /><i className="absolute right-0 top-0 h-4 bg-current" style={{ width: "var(--ln)" }} />
      </span>
      <input data-part="1" value={val} onChange={(e) => setTxt(e.target.value)} placeholder={String(p.v.placeholder)} aria-invalid={over} aria-describedby="dim-count"
        className="h-12 w-full border border-ink bg-transparent px-3 outline-none placeholder:text-ink/40 focus:border-[var(--acc)]" style={bw} />
      <span id="dim-count" data-part="2" className="m flex justify-between"><span className="soft">{over ? `Over by ${n - max}` : n === 0 ? "Empty" : "Within tolerance"}</span><span style={{ color: over ? "var(--acc)" : undefined }}>{String(n).padStart(2, "0")} / {max} ch</span></span>
    </label>
  );
}

// @plate section-cut
export function SectionCut(p: DemoProps) {
  const a = useAct(p, 2400);
  const [open, setOpen] = useState(false);
  const on = open || a.sig || p.moment === "done", h = Number(p.v.depth);
  return (
    <div className="w-[240px]">
      <button {...a.bind} data-part="1" aria-expanded={on} onClick={() => setOpen((o) => !o)} className="flex h-12 w-full items-center justify-between border border-ink px-3 text-left" style={bw}>
        <span data-part="2" className="truncate text-[16px] font-medium tracking-tight">{String(p.v.title)}</span>
        <span className="m flex items-center gap-2" style={{ color: on ? "var(--acc)" : undefined }}>A<i className="tr block h-px bg-current" style={{ width: on ? 20 : 8 }} />A</span>
      </button>
      <div data-part="3" className="tr hatch border-x border-ink" style={{ height: on ? 8 : a.over ? 4 : 0, borderWidth: "0 var(--ln)", transitionDuration: d(240) }} />
      <div data-part="4" className="tr overflow-hidden border-x border-b border-ink" style={{ height: on ? h : 0, opacity: on ? 1 : 0, borderWidth: on ? "0 var(--ln) var(--ln)" : "0 var(--ln) 0", transitionDuration: d(480) }}>
        <p className="p-3 text-[13px] leading-snug">{String(p.v.body)}</p>
      </div>
      <span className="m soft mt-1 block">{on ? `Section A–A · ${h} px deep` : "Uncut"}</span>
    </div>
  );
}

// @plate moire-field
export function MoireField(p: DemoProps) {
  const a = useAct(p, 2400);
  const initial = Number(p.v.initialAngle ?? 3);
  const [angle, setAngle] = useState(initial);
  const [prevInitial, setPrevInitial] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  const id = `moire-${p.moment}`;

  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setAngle(initial);
  }

  const move = (x: number, y: number) => {
    if (!ref.current) return;
    ref.current.style.setProperty("--moire-angle", `${x}deg`);
    ref.current.style.setProperty("--moire-scale", String(1 + y * 0.03));
  };

  useEffect(() => {
    if (a.sig) {
      let step = 0;
      const interval = setInterval(() => {
        step = (step + 0.15) % 6;
        move(step, 0.5);
        setAngle(Number(step.toFixed(1)));
      }, 50);
      return () => {
        clearInterval(interval);
        move(initial, 0);
        setAngle(initial);
      };
    }
  }, [a.sig, initial]);

  return (
    <div className="hl-component moire-component w-full max-w-[360px]">
      <div
        ref={ref}
        className="moire-pattern"
        style={{ "--moire-angle": `${angle}deg` } as React.CSSProperties}
        onPointerMove={(e) => {
          if (
            e.pointerType === "touch" ||
            p.reduced ||
            (typeof window !== "undefined" && (
              window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
              document.documentElement.dataset.reducedMotion === "true"
            ))
          )
            return;
          const rect = e.currentTarget.getBoundingClientRect();
          move(
            ((e.clientX - rect.left) / rect.width) * 6,
            (e.clientY - rect.top) / rect.height
          );
        }}
        onPointerLeave={() => move(angle, 0)}
        role="img"
        aria-label="Two overlapping parallel-line fields creating a moire interference pattern"
      >
        <div data-part="1" className="moire-layer first" />
        <div data-part="2" className="moire-layer second" />
        <span data-part="3" className="moire-cross" aria-hidden="true">
          +
        </span>
      </div>
      <div data-part="4" className="moire-control">
        <label htmlFor={id} className="hl-mono">
          INTERFERENCE
        </label>
        <input
          id={id}
          type="range"
          min="0"
          max="6"
          step="0.1"
          value={angle}
          aria-label="Angle of interference in degrees"
          onChange={(e) => {
            const next = Number(e.target.value);
            setAngle(next);
            move(next, 0);
            p.set("initialAngle", next);
          }}
        />
        <output className="hl-mono">{angle.toFixed(1)}°</output>
      </div>
    </div>
  );
}

