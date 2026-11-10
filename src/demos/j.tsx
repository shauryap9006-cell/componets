"use client";
import { useEffect, useRef, useState } from "react";
import { useAct, useTick } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;

// @plate scramble-decode
export function ScrambleDecode(p: DemoProps) {
  const a = useAct(p, 2000);
  const target = String(p.v.text || "HELVETICA NEUE");
  const cycles = Number(p.v.cycles) || 8;
  const [step, setStep] = useState(cycles);
  const t = useTick(60, a.over || a.sig);

  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789§¶#%&*";
  const activeStep = a.sig ? Math.min(cycles, Math.floor(t / 2) % (cycles + 4)) : a.over ? Math.min(cycles, Math.floor(t / 2)) : cycles;

  const display = target.split("").map((ch, i) => {
    if (ch === " ") return " ";
    const lockAt = Math.floor((i / target.length) * cycles);
    if (activeStep >= lockAt) return ch;
    return glyphs[(i * 7 + (t % glyphs.length)) % glyphs.length];
  }).join("");

  return (
    <div {...a.bind} tabIndex={0} role="status" aria-label={`Decoded text: ${target}`} className="flex flex-col gap-2 font-mono select-none"
      onClick={() => setStep(0)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setStep(0)}>
      <div data-part="1" className="flex items-center gap-1 border-b border-ink pb-1" style={{ borderBottomWidth: "var(--ln)" }}>
        <span className="font-display text-[26px] font-bold tracking-wider">{display}</span>
      </div>
      <div data-part="2" className="flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: activeStep >= cycles ? "var(--acc)" : "var(--ink)" }} />
          <span className="opacity-60">{activeStep >= cycles ? "LOCKED · 100%" : "RESOLVING…"}</span>
        </div>
        <span data-part="3" className="opacity-40">{target.length} GLYPHS · CYCLE {activeStep}/{cycles}</span>
      </div>
    </div>
  );
}

// @plate rolling-numerals
export function RollingNumerals(p: DemoProps) {
  const a = useAct(p, 1800);
  const val = Number(p.v.value) || 1974;
  const [count, setCount] = useState(val);
  const t = useTick(40, a.sig && !p.reduced);
  const curVal = a.sig ? (val + Math.floor(t * 3)) % 10000 : count;
  const digits = String(curVal).padStart(4, "0").split("").map(Number);

  return (
    <div {...a.bind} dir="ltr" tabIndex={0} role="status" aria-label={`Counter ${curVal}`} className="flex flex-col gap-2 font-mono select-none"
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") setCount((c) => Math.min(9999, c + (e.shiftKey ? 100 : 1)));
        if (e.key === "ArrowDown") setCount((c) => Math.max(0, c - (e.shiftKey ? 100 : 1)));
      }}>
      <div className="flex items-center gap-2">
        <span data-part="2" className="text-[12px] font-bold opacity-60">{String(p.v.prefix || "№")}</span>
        <div data-part="1" className="flex items-center gap-1 border border-ink bg-plate p-1.5" style={bw}>
          {digits.map((dgt, i) => (
            <div key={i} className="relative h-8 w-6 overflow-hidden border border-ink bg-paper font-mono text-[18px] font-bold" style={bw}>
              <div className="flex flex-col items-center transition-transform" style={{ transform: `translateY(-${dgt * 32}px)`, transitionDuration: d(200) }}>
                {Array.from({ length: 10 }, (_, n) => (
                  <span key={n} className="grid h-8 w-6 place-items-center">{n}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div data-part="3" className="flex items-center justify-between text-[10px] opacity-60">
        <span>TUMBLE REEL</span>
        <span>{curVal} UNITS</span>
      </div>
    </div>
  );
}

// @plate outline-numerals
export function OutlineNumerals(p: DemoProps) {
  const a = useAct(p, 1600);
  const digits = String(p.v.digits || "08");
  const stroke = Number(p.v.stroke) || 1.5;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`Stencil numerals ${digits}`} className="flex flex-col items-center gap-2 font-mono select-none">
      <div data-part="3" className="relative flex items-center justify-center border border-ink p-4" style={{ ...bw, minWidth: 160 }}>
        <svg data-part="1" width="120" height="60" viewBox="0 0 120 60" className="overflow-visible">
          <text
            x="60"
            y="48"
            textAnchor="middle"
            fill="none"
            stroke="var(--ink)"
            strokeWidth={stroke}
            className="font-display text-[56px] font-black tracking-widest"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {digits}
          </text>
          {/* Stencil Bridge Overlays */}
          <g data-part="2" stroke="var(--acc)" strokeWidth={stroke}>
            <line x1="26" y1="26" x2="34" y2="26" />
            <line x1="86" y1="26" x2="94" y2="26" />
          </g>
        </svg>
      </div>
      <span className="text-[10px] tracking-widest opacity-60">ZINC PLATE STENCIL · {stroke}px HAIRLINE</span>
    </div>
  );
}

// @plate running-head
export function RunningHead(p: DemoProps) {
  const a = useAct(p, 1600);
  const [pg, setPg] = useState(Number(p.v.page) || 142);
  const activePg = a.sig ? pg + 1 : pg;

  return (
    <div {...a.bind} dir="ltr" tabIndex={0} role="region" aria-label="Folio running head" className="flex w-[260px] flex-col gap-1.5 font-mono select-none"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setPg((c) => Math.min(480, c + 1));
        if (e.key === "ArrowLeft") setPg((c) => Math.max(1, c - 1));
      }}>
      <div className="flex items-baseline justify-between text-[11px] font-bold">
        <span data-part="2">{String(activePg).padStart(3, "0")}</span>
        <span data-part="3" className="text-[9px] tracking-widest opacity-60">{String(p.v.chapter || "04 · SYSTEMATICS")}</span>
        <span>{String(activePg + 1).padStart(3, "0")}</span>
      </div>
      <div data-part="1" className="relative h-px w-full bg-ink" style={{ height: "var(--ln)" }}>
        <span className="absolute top-0 size-1 -translate-y-1/2 bg-[var(--acc)]" style={{ left: `${(activePg / 480) * 100}%` }} />
      </div>
      <div className="flex justify-between text-[9px] opacity-40">
        <span>LEFT FOLIO</span>
        <span>RIGHT FOLIO</span>
      </div>
    </div>
  );
}

// @plate ticker-tape
export function TickerTape(p: DemoProps) {
  const a = useAct(p, 2400);
  const msg = String(p.v.feed || "MARKET CONFIRMED 14:00");
  const t = useTick(50, !p.reduced);
  const offset = (t * (Number(p.v.speed) || 3)) % 160;

  return (
    <div {...a.bind} dir="ltr" tabIndex={0} role="status" aria-label={`Punched ticker feed: ${msg}`} className="flex flex-col gap-2 font-mono select-none">
      <div data-part="1" className="relative flex h-14 w-[240px] items-center overflow-hidden border border-ink bg-plate px-2" style={bw}>
        {/* Continuous Perforated Ribbon */}
        <div className="flex items-center gap-6 whitespace-nowrap" style={{ transform: `translateX(-${offset}px)` }}>
          {[0, 1, 2].map((k) => (
            <div key={k} className="flex items-center gap-4">
              <span data-part="3" className="text-[13px] font-bold tracking-widest">{msg}</span>
              {/* 5-hole Baudot Code Marks */}
              <div data-part="2" className="flex gap-1" aria-hidden>
                {Array.from({ length: 5 }, (_, h) => (
                  <span key={h} className="size-1 rounded-full border border-ink" style={{ background: h % 2 === 0 ? "var(--acc)" : "transparent" }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[9px] opacity-60">
        <span>5-CHANNEL BAUDOT PUNCH</span>
        <span>FEED ACTIVE</span>
      </div>
    </div>
  );
}

// @plate kerning-rope
export function KerningRope(p: DemoProps) {
  const a = useAct(p, 1800);
  const [gap, setGap] = useState(Number(p.v.gap) || 18);
  const pair = String(p.v.pair || "Ty");
  const activeGap = a.sig ? 12 : gap;

  return (
    <div {...a.bind} dir="ltr" tabIndex={0} role="slider" aria-valuenow={activeGap} aria-valuemin={-20} aria-valuemax={60} aria-label="Kerning tension slider" className="flex flex-col items-center gap-2 font-mono select-none"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setGap((g) => Math.min(60, g + 2));
        if (e.key === "ArrowLeft") setGap((g) => Math.max(-20, g - 2));
      }}>
      <div data-part="1" className="relative flex items-baseline">
        <span className="font-display text-[64px] font-black leading-none">{pair[0]}</span>
        {/* Tension Rope between Glyphs */}
        <div data-part="2" className="relative flex flex-col items-center justify-center" style={{ width: Math.max(4, activeGap + 20) }}>
          <svg width="100%" height="24" className="overflow-visible">
            <path
              d={`M 0 12 Q ${Math.max(2, (activeGap + 20) / 2)} ${12 + activeGap * 0.4} ${Math.max(4, activeGap + 20)} 12`}
              stroke="var(--acc)"
              strokeWidth="calc(var(--ln) * 2)"
              fill="none"
            />
          </svg>
        </div>
        <span className="font-display text-[64px] font-black leading-none">{pair[1] || ""}</span>
      </div>
      <div data-part="3" className="text-[10px] opacity-60">
        TENSION Δ {activeGap} px · {activeGap > 0 ? "EXPAND" : "TIGHTEN"}
      </div>
    </div>
  );
}

// @plate redline-diff
export function RedlineDiff(p: DemoProps) {
  const a = useAct(p, 1600);
  const [struck, setStruck] = useState(true);
  const before = String(p.v.before || "PRELIMINARY SPEC");
  const after = String(p.v.after || "APPROVED FINAL PROOF");
  const isStruck = a.sig ? true : struck;

  return (
    <div {...a.bind} tabIndex={0} role="button" aria-pressed={isStruck} onClick={() => setStruck((s) => !s)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setStruck((s) => !s)}
      className="flex w-[240px] flex-col gap-2 font-mono select-none focus:outline-none">
      <div data-part="1" className="relative text-[14px] font-bold opacity-40">
        <span>{before}</span>
        {isStruck && (
          <span data-part="2" className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--acc)]" />
        )}
      </div>
      <div data-part="3" className="flex items-center gap-1.5 text-[14px] font-bold text-ink">
        <span className="text-[var(--acc)]">↳</span>
        <span>{after}</span>
      </div>
      <div className="text-[9px] opacity-40">CLICK TO TOGGLE REDLINE MARK</div>
    </div>
  );
}

// @plate misregistration-text
export function MisregistrationText(p: DemoProps) {
  const a = useAct(p, 2000);
  const word = String(p.v.word || "SWISS OFFSET");
  const shift = Number(p.v.shift) || 3;
  const activeShift = a.over ? shift * 1.5 : shift;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`CMYK Shift ${word}`} className="flex flex-col items-center gap-2 font-mono select-none">
      <div className="relative flex items-center justify-center p-3 font-display text-[38px] font-black tracking-wider">
        {/* Cyan Plate */}
        <span data-part="2" className="absolute truncate" style={{ color: "cyan", transform: `translate(-${activeShift}px, -${activeShift * 0.5}px)`, mixBlendMode: "screen" }}>
          {word}
        </span>
        {/* Magenta Plate */}
        <span className="absolute truncate" style={{ color: "magenta", transform: `translate(${activeShift}px, ${activeShift * 0.5}px)`, mixBlendMode: "screen" }}>
          {word}
        </span>
        {/* Key (Black) Plate */}
        <span data-part="1" className="relative text-ink" style={{ mixBlendMode: "multiply" }}>
          {word}
        </span>
      </div>
      <div data-part="3" className="text-[10px] opacity-60">
        CMYK 4-PASS OFFSET · Δ {activeShift.toFixed(1)} px
      </div>
    </div>
  );
}

// @plate sparkwords
export function Sparkwords(p: DemoProps) {
  const a = useAct(p, 1800);
  const trend = Number(p.v.trend) || 18;
  const pts = [12, 16, 14, 22, 18, 26, 24, 30 + trend * 0.2];

  return (
    <div {...a.bind} tabIndex={0} role="group" aria-label="Typographic inline sparkline" className="flex items-center gap-2 font-mono text-[13px] select-none">
      <span data-part="1" className="font-bold">{String(p.v.label || "REVENUE")}</span>
      {/* Inline Sparkline */}
      <span data-part="2" className="inline-block h-5 w-16 border-b border-ink/30 pb-0.5">
        <svg viewBox="0 0 70 30" className="size-full overflow-visible">
          <polyline
            points={pts.map((y, i) => `${i * 10},${30 - y}`).join(" ")}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="var(--ln)"
          />
          <circle cx="70" cy={30 - pts[pts.length - 1]} r="2.5" fill="var(--acc)" />
        </svg>
      </span>
      <span data-part="3" className="font-bold" style={{ color: trend >= 0 ? "var(--acc)" : "var(--ink)" }}>
        {trend >= 0 ? `+${trend}%` : `${trend}%`}
      </span>
    </div>
  );
}

// @plate type-on-grid
export function TypeOnGrid(p: DemoProps) {
  const a = useAct(p, 1800);
  const word = String(p.v.word || "RATIONAL SYSTEM");
  const mod = Number(p.v.grid) || 20;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`Modular type grid: ${word}`} className="flex flex-col gap-2 font-mono select-none">
      <div data-part="1" className="relative flex h-24 w-[240px] items-center justify-center border border-ink bg-plate" style={bw}>
        {/* Modular Grid Lines */}
        <div className="pointer-events-none absolute inset-0 grid size-full" style={{ backgroundSize: `${mod}px ${mod}px`, backgroundImage: "linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)", opacity: 0.15 }} />
        <span data-part="2" className="relative font-display text-[20px] font-bold tracking-widest text-ink">
          {word}
        </span>
      </div>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>BASE {mod}px GRID</span>
        <span>SWISS MODULAR</span>
      </div>
    </div>
  );
}

// @plate dither-image
export function DitherImage(p: DemoProps) {
  const a = useAct(p, 2200);
  const cells = Number(p.v.cells) || 32;
  const W = 200;
  const size = W / cells;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="Bayer dithered screen" className="flex flex-col gap-2 font-mono select-none">
      <div data-part="1" className="border border-ink p-1" style={{ ...bw, width: W + 10 }}>
        <svg data-part="2" width={W} height={W * 0.6} viewBox={`0 0 ${W} ${W * 0.6}`} className="bg-plate">
          {Array.from({ length: Math.round(cells * 0.6) }, (_, r) =>
            Array.from({ length: cells }, (_, c) => {
              const lum = (c / cells + r / (cells * 0.6)) / 2;
              const isFilled = lum > ((c % 4) * 4 + (r % 4)) / 16;
              return isFilled ? (
                <rect key={`${r}-${c}`} x={c * size} y={r * size} width={size} height={size} fill="var(--ink)" />
              ) : null;
            })
          )}
        </svg>
      </div>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>BAYER 4×4 PATTERN</span>
        <span>{cells}×{Math.round(cells * 0.6)} PIXELS</span>
      </div>
    </div>
  );
}

// @plate ascii-image
export function AsciiImage(p: DemoProps) {
  const a = useAct(p, 2000);
  const cols = Number(p.v.cols) || 22;
  const ramp = String(p.v.chars || " .:-=+*#%@");

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="ASCII raster matrix" className="flex flex-col gap-2 font-mono select-none">
      <div data-part="1" className="flex flex-col border border-ink bg-plate p-2 font-mono text-[9px] leading-none" style={{ ...bw, width: 220 }}>
        <div data-part="2" className="flex flex-col gap-0.5">
          {Array.from({ length: 8 }, (_, r) => (
            <span key={r} className="whitespace-pre tracking-widest text-ink">
              {Array.from({ length: cols }, (_, c) => {
                const idx = Math.floor(Math.abs(Math.sin((c + r * 2) * 0.4)) * ramp.length) % ramp.length;
                return ramp[idx];
              }).join("")}
            </span>
          ))}
        </div>
      </div>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>CRT PHOSPHOR MATRIX</span>
        <span>{cols} COLS</span>
      </div>
    </div>
  );
}

// @plate scan-line-reveal
export function ScanLineReveal(p: DemoProps) {
  const a = useAct(p, 2500);
  const lines = Number(p.v.lines) || 28;
  const t = useTick(40, !p.reduced);
  const beamY = ((t * 2) % 100);

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="Cathode ray scanline" className="flex flex-col gap-2 font-mono select-none">
      <div data-part="1" className="relative flex h-24 w-[220px] items-center justify-center overflow-hidden border border-ink bg-plate" style={bw}>
        {/* Scanline Rules */}
        <div data-part="3" className="pointer-events-none absolute inset-0 flex flex-col justify-between opacity-30" aria-hidden>
          {Array.from({ length: lines }, (_, i) => (
            <span key={i} className="h-px w-full bg-ink" />
          ))}
        </div>
        {/* Electron Beam */}
        <div data-part="2" className="pointer-events-none absolute inset-x-0 h-1 bg-[var(--acc)] opacity-80" style={{ top: `${beamY}%`, boxShadow: "0 0 8px var(--acc)" }} />
        <span className="font-display text-[22px] font-bold tracking-widest">RASTER CATHODE</span>
      </div>
      <span className="text-[10px] opacity-60">BEAM FREQUENCY 60 Hz · INTERLACED</span>
    </div>
  );
}

// @plate before-after
export function BeforeAfter(p: DemoProps) {
  const a = useAct(p, 2200);
  const ref = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(Number(p.v.split) || 50);
  const [drag, setDrag] = useState(false);
  const activeSplit = a.sig ? 30 : split;

  const handlePointer = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = Math.max(10, Math.min(90, Math.round(((clientX - rect.left) / rect.width) * 100)));
    setSplit(pct);
  };

  return (
    <div {...a.bind} ref={ref} dir="ltr" tabIndex={0} role="slider" aria-valuenow={activeSplit} aria-valuemin={10} aria-valuemax={90} aria-label="Proof comparison curtain"
      className="flex w-[220px] flex-col gap-2 font-mono select-none" style={{ cursor: "ew-resize" }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag(true);
        handlePointer(e.clientX);
      }}
      onPointerMove={(e) => drag && handlePointer(e.clientX)}
      onPointerUp={() => setDrag(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setSplit((s) => Math.min(90, s + 5));
        if (e.key === "ArrowLeft") setSplit((s) => Math.max(10, s - 5));
      }}>
      <div data-part="1" className="relative h-24 w-full overflow-hidden border border-ink" style={bw}>
        {/* Left Side: Raw */}
        <div className="absolute inset-0 flex items-center justify-start bg-plate px-3">
          <span className="text-[12px] font-bold opacity-60">{String(p.v.left || "NEGATIVE")}</span>
        </div>
        {/* Right Side: Processed with clip */}
        <div className="absolute inset-0 flex items-center justify-end bg-paper px-3" style={{ clipPath: `inset(0 0 0 ${activeSplit}%)` }}>
          <span className="text-[12px] font-bold text-ink">{String(p.v.right || "SILVER PRINT")}</span>
        </div>
        {/* Split Curtain Hairline */}
        <div data-part="2" className="absolute inset-y-0 w-0.5 bg-[var(--acc)]" style={{ left: `${activeSplit}%` }} />
      </div>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>RAW {activeSplit}%</span>
        <span>FIXED {100 - activeSplit}%</span>
      </div>
    </div>
  );
}

// @plate waveform-player
export function WaveformPlayer(p: DemoProps) {
  const a = useAct(p, 2400);
  const [pos, setPos] = useState(Number(p.v.position) || 32);
  const [playing, setPlaying] = useState(false);
  const t = useTick(60, playing && !p.reduced);
  const activePos = playing ? (pos + Math.floor(t * 0.5)) % 100 : a.sig ? 65 : pos;

  return (
    <div {...a.bind} dir="ltr" tabIndex={0} role="region" aria-label="Magnetic tape waveform player" className="flex w-[230px] flex-col gap-2 font-mono select-none"
      onClick={() => setPlaying((p) => !p)} onKeyDown={(e) => e.key === " " && setPlaying((p) => !p)}>
      <div className="flex items-center justify-between text-[10px] font-bold">
        <span>{String(p.v.track || "REEL 04 · TAKE 02")}</span>
        <span style={{ color: playing ? "var(--acc)" : "inherit" }}>{playing ? "▶ PLAY" : "⏸ PAUSE"}</span>
      </div>
      <div data-part="1" className="relative flex h-14 items-center justify-between border border-ink bg-plate px-2" style={bw}>
        {Array.from({ length: 28 }, (_, i) => {
          const h = 8 + Math.abs(Math.sin(i * 0.6)) * 26;
          return <span key={i} className="w-1 bg-ink opacity-70" style={{ height: h }} />;
        })}
        {/* Tape Playhead */}
        <div data-part="2" className="pointer-events-none absolute inset-y-0 w-0.5 bg-[var(--acc)]" style={{ left: `${activePos}%` }} />
      </div>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>00:{(activePos * 0.4).toFixed(1)}s</span>
        <span>OXIDE TRACK A440</span>
      </div>
    </div>
  );
}

// @plate perforated-frame
export function PerforatedFrame(p: DemoProps) {
  const a = useAct(p, 1800);
  const [frame, setFrame] = useState(Number(p.v.frame) || 17);
  const activeFrame = a.sig ? 18 : frame;

  return (
    <div {...a.bind} dir="ltr" tabIndex={0} role="img" aria-label={`35mm negative frame ${activeFrame}`} className="flex flex-col gap-1.5 font-mono select-none"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setFrame((f) => Math.min(36, f + 1));
        if (e.key === "ArrowLeft") setFrame((f) => Math.max(1, f - 1));
      }}>
      <div data-part="1" className="flex w-[240px] flex-col border border-ink bg-plate p-1" style={bw}>
        {/* Top Sprocket Holes */}
        <div data-part="2" className="flex justify-between px-2 py-0.5" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="size-1.5 border border-ink bg-paper" />
          ))}
        </div>
        {/* Exposure Window */}
        <div className="flex h-16 items-center justify-center border border-ink bg-paper p-2 text-center">
          <span className="font-display text-[16px] font-bold">FRAME {activeFrame}A</span>
        </div>
        {/* Bottom Sprockets & Rebate */}
        <div className="flex items-center justify-between px-2 py-0.5 text-[8px] font-bold opacity-75">
          <span data-part="3">{String(p.v.film || "KODAK TX 400")}</span>
          <div className="flex gap-2" aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className="size-1.5 border border-ink bg-paper" />
            ))}
          </div>
          <span>{activeFrame}A</span>
        </div>
      </div>
    </div>
  );
}

// @plate small-multiples
export function SmallMultiples(p: DemoProps) {
  const a = useAct(p, 2200);
  const cols = Number(p.v.cols) || 3;

  return (
    <div {...a.bind} tabIndex={0} role="region" aria-label="Small multiples comparative charts" className="flex flex-col gap-2 font-mono select-none">
      <div className="text-[10px] font-bold tracking-wider opacity-60">{String(p.v.metric || "THERMAL GRADIENT")}</div>
      <div data-part="1" className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {["A", "B", "C", "D", "E", "F"].slice(0, cols * 2).map((label, idx) => (
          <div key={label} className="flex flex-col border border-ink bg-plate p-1.5" style={bw}>
            <span className="text-[9px] font-bold opacity-60">STA {label}</span>
            <svg data-part="2" viewBox="0 0 50 20" className="mt-1 h-5 w-full overflow-visible">
              <polyline
                points={`0,${15 - idx * 2} 15,${8 + idx} 30,${16 - idx} 50,${4 + idx * 2}`}
                fill="none"
                stroke="var(--ink)"
                strokeWidth="var(--ln)"
              />
            </svg>
          </div>
        ))}
      </div>
      <div data-part="3" className="text-[9px] opacity-40">COMMON BASELINE SCALE · TUFTE MATRIX</div>
    </div>
  );
}

// @plate risograph-image
export function RisographImage(p: DemoProps) {
  const a = useAct(p, 2400);
  const overlap = Number(p.v.overlap) || 4;
  const activeDrift = a.over ? overlap * 1.5 : overlap;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="Two-drum Risograph spot print" className="flex flex-col items-center gap-2 font-mono select-none">
      <div data-part="1" className="relative flex h-24 w-[200px] items-center justify-center border border-ink bg-paper p-3" style={bw}>
        {/* Drum 1: Teal */}
        <div data-part="2" className="absolute size-14 rounded-full" style={{ background: "#00a396", opacity: 0.75, transform: `translate(-${activeDrift}px, 0)` }} />
        {/* Drum 2: Fluo Pink */}
        <div data-part="3" className="absolute size-14 rounded-full" style={{ background: "#ff3e83", opacity: 0.75, transform: `translate(${activeDrift}px, 0)`, mixBlendMode: "multiply" }} />
      </div>
      <div className="flex justify-between text-[10px] opacity-75">
        <span>DRUM 1: {String(p.v.inkA || "TEAL")}</span>
        <span>DRUM 2: {String(p.v.inkB || "PINK")}</span>
      </div>
    </div>
  );
}

// @plate letterpress
export function Letterpress(p: DemoProps) {
  const a = useAct(p, 1800);
  const text = String(p.v.text || "IMPRIMATUR");
  const depth = Number(p.v.depth) || 3;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`Letterpress deboss ${text}`} className="flex flex-col items-center gap-2 font-mono select-none">
      <div data-part="1" className="flex items-center justify-center border border-ink bg-paper p-6" style={{ ...bw, minWidth: 200 }}>
        <span
          data-part="2"
          className="font-display text-[32px] font-black tracking-widest text-ink"
          style={{
            textShadow: `0 1px 0 rgba(255,255,255,0.8), 0 -${depth}px 0 rgba(0,0,0,0.35)`,
          }}
        >
          {text}
        </span>
      </div>
      <div data-part="3" className="text-[10px] opacity-60">DEBOSS RELIEF {depth}px · COTTON SUBSTRATE</div>
    </div>
  );
}

// @plate crop-frame
export function CropFrame(p: DemoProps) {
  const a = useAct(p, 2000);
  const ratio = String(p.v.ratio || "3:2");
  const inset = Number(p.v.inset) || 20;

  return (
    <div {...a.bind} tabIndex={0} role="region" aria-label={`Easel crop frame ${ratio}`} className="flex flex-col items-center gap-2 font-mono select-none">
      <div data-part="1" className="relative flex h-28 w-[220px] items-center justify-center border border-ink bg-plate" style={bw}>
        {/* Adjustable Crop Frame */}
        <div data-part="2" className="relative border border-[var(--acc)] bg-paper/50" style={{ inset, borderWidth: "calc(var(--ln) * 1.5)" }}>
          {/* Rule of Thirds Guide */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-25" aria-hidden>
            <span className="border-r border-ink" />
            <span className="border-r border-ink" />
            <span />
          </div>
        </div>
      </div>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>ASPECT {ratio}</span>
        <span>EASEL MASKING</span>
      </div>
    </div>
  );
}

// @plate tear-card
export function TearCard(p: DemoProps) {
  const a = useAct(p, 1800);
  const [torn, setTorn] = useState<number[]>([]);
  const n = Number(p.v.tabs) || 5;

  const tearTab = (idx: number) => {
    setTorn((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  return (
    <div {...a.bind} dir="ltr" tabIndex={0} role="group" aria-label="Tear card bulletin" className="flex w-[220px] flex-col border border-ink bg-plate" style={bw}>
      <div data-part="1" className="p-3 text-center">
        <span className="font-display text-[14px] font-bold">{String(p.v.label || "TYPESETTING WORKSHOP")}</span>
        <span className="mt-1 block text-[9px] opacity-60">TAKE ONE SLIP BELOW</span>
      </div>
      {/* Dashed Perforation Rule */}
      <div data-part="3" className="border-t border-dashed border-ink" />
      {/* Fringe of Tear Tabs */}
      <div data-part="2" className="flex justify-between divide-x divide-ink">
        {Array.from({ length: n }, (_, i) => {
          const isTorn = torn.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => tearTab(i)}
              aria-label={`Tear tab ${i + 1}`}
              className="flex h-12 flex-1 items-center justify-center text-[10px] font-bold focus:outline-none"
              style={{
                opacity: isTorn ? 0.2 : 1,
                background: isTorn ? "transparent" : "var(--paper)",
              }}
            >
              <span className="rotate-90">TEL</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// @plate dossier
export function Dossier(p: DemoProps) {
  const a = useAct(p, 2200);
  const [sealed, setSealed] = useState(p.v.sealed !== false);
  const isSealed = a.sig ? false : sealed;

  return (
    <div {...a.bind} tabIndex={0} role="button" aria-expanded={!isSealed} onClick={() => setSealed((s) => !s)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSealed((s) => !s)}
      className="flex w-[220px] flex-col border border-ink bg-paper p-3 font-mono select-none focus:outline-none" style={bw}>
      <div data-part="3" className="flex items-center justify-between border-b border-ink pb-1 text-[10px] font-bold">
        <span>{String(p.v.ref || "CONFIDENTIAL · DEPT 4")}</span>
        <span style={{ color: isSealed ? "inherit" : "var(--acc)" }}>{isSealed ? "● SEALED" : "○ OPEN"}</span>
      </div>
      {/* String Tie Rivet Eyelets */}
      <div className="relative my-4 flex items-center justify-center gap-12">
        <span data-part="1" className="grid size-5 place-items-center rounded-full border border-ink bg-plate">
          <span className="size-1.5 rounded-full bg-ink" />
        </span>
        {/* Figure-8 Thread */}
        <svg data-part="2" className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden>
          {isSealed ? (
            <path d="M 80 10 Q 110 -2 140 10 Q 110 22 80 10" stroke="var(--acc)" strokeWidth="calc(var(--ln) * 2)" fill="none" />
          ) : (
            <line x1="80" y1="10" x2="60" y2="28" stroke="var(--acc)" strokeWidth="calc(var(--ln) * 2)" strokeLinecap="round" />
          )}
        </svg>
        <span className="grid size-5 place-items-center rounded-full border border-ink bg-plate">
          <span className="size-1.5 rounded-full bg-ink" />
        </span>
      </div>
      <div className="text-[9px] opacity-40">FIGURE-EIGHT THREAD CLASP</div>
    </div>
  );
}

// @plate aperture-tip
export function ApertureTip(p: DemoProps) {
  const a = useAct(p, 1800);
  const blades = Number(p.v.blades) || 6;
  const isOpen = a.over || a.sig;

  return (
    <div {...a.bind} tabIndex={0} role="tooltip" aria-label={String(p.v.text)} className="flex flex-col items-center gap-2 font-mono select-none">
      <div data-part="1" className="relative grid size-16 place-items-center rounded-full border border-ink bg-plate" style={bw}>
        {/* Rotating Diaphragm Blades */}
        <svg data-part="2" viewBox="-24 -24 48 48" className="pointer-events-none absolute inset-0 size-full">
          {Array.from({ length: blades }, (_, i) => {
            const rot = (i / blades) * 360 + (isOpen ? 45 : 0);
            return (
              <line
                key={i}
                x1="0"
                y1="0"
                x2="20"
                y2="0"
                stroke="var(--ink)"
                strokeWidth="var(--ln)"
                transform={`rotate(${rot})`}
                style={{ transition: `transform ${d(400)} var(--ez)` }}
              />
            );
          })}
        </svg>
        <span className="size-2 rounded-full bg-[var(--acc)]" />
      </div>
      {/* Framed Tooltip Annotation */}
      <div data-part="3" className="border border-ink bg-paper px-2 py-1 text-[10px] font-bold" style={{ ...bw, opacity: isOpen ? 1 : 0.4 }}>
        {String(p.v.text || "FOCAL LENGTH 50mm")}
      </div>
    </div>
  );
}

// @plate declaration-dialog
export function DeclarationDialog(p: DemoProps) {
  const a = useAct(p, 2200);
  const [cleared, setCleared] = useState(false);
  const isCleared = a.sig ? true : cleared;

  return (
    <div {...a.bind} tabIndex={0} role="dialog" aria-modal="true" aria-label="Customs declaration modal" className="flex w-[240px] flex-col border border-ink bg-paper p-3 font-mono select-none" style={bw}>
      <div data-part="1" className="border-b border-ink pb-1.5 text-center">
        <span className="font-display text-[12px] font-bold tracking-wider">{String(p.v.title || "CUSTOMS CLEARANCE PASS")}</span>
      </div>
      <div data-part="2" className="my-3 flex flex-col gap-1 text-[11px]">
        <span className="text-[9px] opacity-60">DECLARED ITEM:</span>
        <span className="font-bold">{String(p.v.item || "OPTICAL APPARATUS · 1 EA")}</span>
      </div>
      <button
        type="button"
        onClick={() => setCleared((c) => !c)}
        data-part="3"
        className="flex items-center justify-center border border-ink py-1.5 text-[10px] font-bold tracking-widest focus:outline-none"
        style={{
          ...bw,
          borderColor: isCleared ? "var(--acc)" : "var(--ink)",
          color: isCleared ? "var(--acc)" : "inherit",
        }}
      >
        {isCleared ? "✓ AUTHORIZED" : "STAMP TO CLEAR"}
      </button>
    </div>
  );
}
