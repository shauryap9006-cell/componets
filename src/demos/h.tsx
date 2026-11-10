"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { rng, useAct } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;

// @plate counting-preloader
export function CountingPreloader(p: DemoProps) {
  const a = useAct(p, 3200);
  const [val, setVal] = useState(0);
  const dur = Number(p.v.duration ?? 3200);

  useEffect(() => {
    if (p.reduced || a.sig || p.moment === "done") return;
    const t0 = performance.now();
    let id: number;
    const step = () => {
      const elapsed = performance.now() - t0;
      const pct = Math.min(100, Math.floor((elapsed / dur) * 100));
      setVal(pct);
      if (pct < 100) {
        id = requestAnimationFrame(step);
      }
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [p.play, dur, p.reduced, a.sig, p.moment]);

  const displayVal = p.reduced || a.sig || p.moment === "done" ? 100 : val;

  return (
    <div
      {...a.bind}
      role="progressbar"
      aria-valuenow={displayVal}
      aria-valuemin={0}
      aria-valuemax={100}
      className="flex w-[210px] flex-col gap-2.5 text-left"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <div data-part="1" className="font-mono text-5xl font-bold leading-none tracking-tight">
        {displayVal}
        <span className="text-xl text-ink/50">%</span>
      </div>

      <div data-part="2" className="relative h-1 w-full bg-ink/20">
        <span
          className="absolute left-0 top-0 h-full bg-ink"
          style={{
            width: `${displayVal}%`,
            background: displayVal === 100 ? "var(--acc)" : "var(--ink)",
          }}
        />
      </div>

      <span data-part="3" className="m soft text-[10px] tracking-wider">
        {String(p.v.caption ?? "SETTING TYPE…")}
      </span>
    </div>
  );
}

// @plate line-draw-loader
export function LineDrawLoader(p: DemoProps) {
  const a = useAct(p, 2400);
  const dur = Number(p.v.duration ?? 2400);

  return (
    <div
      {...a.bind}
      role="status"
      aria-label="Loading, drawing rectangle"
      className="grid place-items-center"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <svg
        data-part="1"
        width="128"
        height="88"
        viewBox="0 0 128 88"
        className="overflow-visible"
      >
        <rect
          data-part="2"
          x="20"
          y="12"
          width="88"
          height="64"
          fill="none"
          stroke="currentColor"
          strokeWidth="var(--ln)"
          pathLength={100}
          strokeDasharray="100"
          style={{
            animation:
              p.reduced || p.moment === "off"
                ? undefined
                : `hlDash ${dur}ms var(--ez) infinite`,
            strokeDashoffset: p.reduced ? 0 : undefined,
          }}
        />
      </svg>
      <style>{`
        @keyframes hlDash {
          0% { stroke-dashoffset: 100; stroke: currentColor; }
          50% { stroke-dashoffset: 0; stroke: var(--acc); }
          100% { stroke-dashoffset: -100; stroke: currentColor; }
        }
      `}</style>
    </div>
  );
}

// @plate dot-wave-loader
export function DotWaveLoader(p: DemoProps) {
  const a = useAct(p, 2000);
  const count = Math.max(5, Math.min(15, Math.round(Number(p.v.dots ?? 9))));
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (p.reduced || p.moment === "off") return;
    let id: number;
    const step = () => {
      setFrame((f) => f + 1);
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [p.reduced, p.moment]);

  return (
    <div
      {...a.bind}
      role="status"
      aria-label="Loading wave"
      className="flex items-center gap-2"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      {Array.from({ length: count }, (_, i) => {
        const yOffset = p.reduced ? 0 : Math.sin(frame * 0.08 + i * 0.7) * 7;
        return (
          <span
            key={i}
            className="size-2 rounded-full border border-ink"
            style={{
              transform: `translateY(${yOffset}px)`,
              background: i === 4 ? "var(--acc)" : "currentColor",
            }}
          />
        );
      })}
    </div>
  );
}

// @plate clock-hand-loader
export function ClockHandLoader(p: DemoProps) {
  const a = useAct(p, 1600);
  const steps = Math.max(4, Math.min(24, Math.round(Number(p.v.steps ?? 12))));

  return (
    <div
      {...a.bind}
      role="status"
      aria-label="Clock ticking"
      className="relative size-16 rounded-full border border-ink"
      style={{
        ...bw,
        opacity: p.moment === "off" ? 0.35 : 1,
      }}
    >
      <span
        className="absolute left-1/2 top-1/2 h-6 w-0.5 -translate-x-1/2 origin-top"
        style={{
          background: "var(--acc)",
          transform: "translateX(-50%) rotate(180deg)",
          transformOrigin: "top",
          animation:
            p.reduced || p.moment === "off"
              ? undefined
              : `clockStep 1.2s steps(${steps}) infinite`,
        }}
      />
      <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
      <style>{`
        @keyframes clockStep {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// @plate block-cursor-loader
export function BlockCursorLoader(p: DemoProps) {
  const a = useAct(p, 1600);
  const text = String(p.v.word ?? "LOADING");

  return (
    <div
      {...a.bind}
      role="status"
      className="flex items-center gap-1 font-mono text-xl tracking-wider"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <span>{text}</span>
      <span
        aria-hidden
        className="inline-block h-5 w-3"
        style={{
          background: "var(--acc)",
          animation:
            p.reduced || p.moment === "off" ? undefined : "cursorBlink 800ms steps(1) infinite",
        }}
      />
      <style>{`
        @keyframes cursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// @plate sundial-clock
export function SundialClock(p: DemoProps) {
  const a = useAct(p, 2200);
  const [now, setNow] = useState(new Date());
  const [h24, setH24] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const off = Number(p.v.offset ?? 0);
  const dObj = new Date(now.getTime() + off * 3600000);
  const hours = dObj.getHours() + dObj.getMinutes() / 60 + dObj.getSeconds() / 3600;
  const isDay = hours >= 6 && hours <= 18;
  const ang = isDay ? -90 + ((hours - 6) / 12) * 180 : 90;

  const pad = (n: number) => String(n).padStart(2, "0");
  const roman = Boolean(p.v.roman);
  const R = ["VI", "VII", "VIII", "IX", "X", "XI", "XII", "I", "II", "III", "IV", "V", "VI"];
  const txt = `${pad(h24 ? dObj.getHours() : dObj.getHours() % 12 || 12)}:${pad(dObj.getMinutes())}${
    p.v.seconds ? ":" + pad(dObj.getSeconds()) : ""
  }${h24 ? "" : dObj.getHours() < 12 ? " AM" : " PM"}`;

  return (
    <button
      {...a.bind}
      type="button"
      onClick={() => setH24((x) => !x)}
      aria-label={`Solar time ${txt}. Press to toggle 12/24 hour.`}
      className="flex flex-col items-center bg-transparent text-left"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <svg width={220} height={120} viewBox="0 0 220 120" aria-hidden className="overflow-visible">
        <path
          d="M10 110 A100 100 0 0 1 210 110 Z"
          fill={isDay ? "var(--paper)" : "var(--plate)"}
          stroke="currentColor"
          strokeWidth="var(--ln)"
        />
        {Array.from({ length: 13 }, (_, i) => {
          const rad = Math.PI + (i / 12) * Math.PI;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          return (
            <g key={i}>
              <line
                x1={110 + cos * 92}
                y1={110 + sin * 92}
                x2={110 + cos * (i % 3 ? 86 : 80)}
                y2={110 + sin * (i % 3 ? 86 : 80)}
                stroke="currentColor"
                strokeWidth="var(--ln)"
              />
              {i % 3 === 0 && (
                <text
                  x={110 + cos * 68}
                  y={113 + sin * 68}
                  fontSize={9}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fill="currentColor"
                >
                  {roman ? R[i] : 6 + i}
                </text>
              )}
            </g>
          );
        })}
        <g
          style={{
            transformOrigin: "110px 110px",
            transform: `rotate(${ang}deg)`,
            transition: p.reduced ? "none" : `transform ${d(800)} var(--ez)`,
          }}
        >
          <polygon points="110,110 106,36 114,36" fill="var(--acc)" opacity={isDay ? 0.9 : 0.25} />
        </g>
        <line x1={10} y1={110} x2={210} y2={110} stroke="currentColor" strokeWidth="var(--ln)" />
        <circle cx={110} cy={110} r={4} fill="var(--acc)" />
      </svg>
      <span className="font-mono mt-2 text-[20px] font-bold leading-none">{txt}</span>
      <span className="m soft mt-1 text-[10px]">
        {isDay ? `SOLAR SHADOW ${Math.round(ang + 90)}° · UTC${off >= 0 ? "+" : ""}${off}` : "NIGHT ARC"}
      </span>
    </button>
  );
}

// @plate star-chart
export function StarChart(p: DemoProps) {
  const a = useAct(p, 2000);
  const count = Math.max(3, Math.min(7, Math.round(Number(p.v.count ?? 5))));
  const seed = Math.round(Number(p.v.seed ?? 9));
  const [val, setVal] = useState(3);
  const [hovered, setHovered] = useState<number | null>(null);

  const pts = useMemo(() => {
    const r = rng(seed);
    const arr: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      arr.push([20 + (i / (count - 1)) * 200 + (r() - 0.5) * 16, 20 + r() * 65]);
    }
    return arr;
  }, [count, seed]);

  const activeCount = hovered ?? (a.sig ? count : val);

  return (
    <div
      {...a.bind}
      className="flex flex-col gap-2 text-left"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <svg
        width={240}
        height={100}
        viewBox="0 0 240 100"
        role="radiogroup"
        aria-label={`${String(p.v.name ?? "Constellation")}, ${val} of ${count} stars`}
        onPointerLeave={() => setHovered(null)}
      >
        {pts.slice(1).map((pt, i) => (
          <line
            key={i}
            x1={pts[i][0]}
            y1={pts[i][1]}
            x2={pt[0]}
            y2={pt[1]}
            stroke={i + 1 < activeCount ? "var(--acc)" : "currentColor"}
            strokeOpacity={i + 1 < activeCount ? 1 : 0.2}
            strokeDasharray={i + 1 < activeCount ? "none" : "2 4"}
            strokeWidth="var(--ln)"
          />
        ))}
        {pts.map(([x, y], i) => (
          <g
            key={i}
            role="radio"
            aria-checked={val === i + 1}
            tabIndex={0}
            className="cursor-pointer outline-none"
            onPointerEnter={() => setHovered(i + 1)}
            onClick={() => setVal(i + 1)}
          >
            <circle cx={x} cy={y} r={12} fill="transparent" />
            <polygon
              points={`${x},${y - 6} ${x + 1.5},${y - 1.5} ${x + 6},${y} ${x + 1.5},${y + 1.5} ${x},${y + 6} ${x - 1.5},${y + 1.5} ${x - 6},${y} ${x - 1.5},${y - 1.5}`}
              fill={i < activeCount ? "var(--acc)" : "var(--paper)"}
              stroke="currentColor"
              strokeWidth="var(--ln)"
            />
          </g>
        ))}
      </svg>
      <div className="m flex justify-between text-[11px]">
        <span className="font-medium">{String(p.v.name ?? "Ursa Minor")}</span>
        <span className="soft text-[10px]">{`${activeCount} OF ${count} STARS`}</span>
      </div>
    </div>
  );
}

// @plate analog-clock
export function AnalogClock(p: DemoProps) {
  const a = useAct(p, 2000);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const s = time.getSeconds();
  const m = time.getMinutes() + s / 60;
  const h = (time.getHours() % 12) + m / 60;

  const hand = (deg: number, len: number, w: number, color: string) => (
    <line
      x1="60"
      y1="60"
      x2={60 + Math.sin((deg * Math.PI) / 180) * len}
      y2={60 - Math.cos((deg * Math.PI) / 180) * len}
      stroke={color}
      strokeWidth={w}
    />
  );

  return (
    <div
      {...a.bind}
      role="img"
      aria-label="Swiss Station Clock"
      className="grid place-items-center"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <svg width="132" height="132" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="var(--ln)" />
        {Array.from({ length: 60 }, (_, i) => (
          <line
            key={i}
            x1={60 + Math.sin((i * 6 * Math.PI) / 180) * (i % 5 === 0 ? 49 : 53)}
            y1={60 - Math.cos((i * 6 * Math.PI) / 180) * (i % 5 === 0 ? 49 : 53)}
            x2={60 + Math.sin((i * 6 * Math.PI) / 180) * 56}
            y2={60 - Math.cos((i * 6 * Math.PI) / 180) * 56}
            stroke="currentColor"
            strokeWidth={i % 5 === 0 ? 1.5 : 0.5}
          />
        ))}
        {hand(h * 30, 30, 2.5, "currentColor")}
        {hand(m * 6, 44, 1.8, "currentColor")}
        {hand(s * 6, 48, 1, "var(--acc)")}
        <circle cx="60" cy="60" r="2.5" fill="var(--acc)" />
      </svg>
    </div>
  );
}

// @plate seven-segment
export function SevenSegment(p: DemoProps) {
  const a = useAct(p, 1400);
  const numVal = Math.max(0, Math.min(999, Math.round(Number(p.v.value ?? 48))));
  const strVal = String(numVal).padStart(3, "0");

  const SEG_MAP: Record<string, number[]> = {
    "0": [1, 1, 1, 0, 1, 1, 1],
    "1": [0, 0, 1, 0, 0, 1, 0],
    "2": [1, 0, 1, 1, 1, 0, 1],
    "3": [1, 0, 1, 1, 0, 1, 1],
    "4": [0, 1, 1, 1, 0, 1, 0],
    "5": [1, 1, 0, 1, 0, 1, 1],
    "6": [1, 1, 0, 1, 1, 1, 1],
    "7": [1, 0, 1, 0, 0, 1, 0],
    "8": [1, 1, 1, 1, 1, 1, 1],
    "9": [1, 1, 1, 1, 0, 1, 1],
  };

  const renderDigit = (digit: string, idx: number) => {
    const mask = SEG_MAP[digit] ?? [0, 0, 0, 0, 0, 0, 0];
    return (
      <svg key={idx} width="24" height="40" viewBox="0 0 24 40" className="overflow-visible">
        <rect x="3" y="1" width="18" height="3" rx="1" fill="currentColor" opacity={mask[0] ? 1 : 0.1} />
        <rect x="1" y="4" width="3" height="15" rx="1" fill="currentColor" opacity={mask[1] ? 1 : 0.1} />
        <rect x="20" y="4" width="3" height="15" rx="1" fill="currentColor" opacity={mask[2] ? 1 : 0.1} />
        <rect x="3" y="18.5" width="18" height="3" rx="1" fill="currentColor" opacity={mask[3] ? 1 : 0.1} />
        <rect x="1" y="21" width="3" height="15" rx="1" fill="currentColor" opacity={mask[4] ? 1 : 0.1} />
        <rect x="20" y="21" width="3" height="15" rx="1" fill="currentColor" opacity={mask[5] ? 1 : 0.1} />
        <rect x="3" y="36" width="18" height="3" rx="1" fill="currentColor" opacity={mask[6] ? 1 : 0.1} />
      </svg>
    );
  };

  return (
    <div
      {...a.bind}
      className="flex flex-col items-center gap-2.5 border border-ink bg-paper p-4 text-left"
      style={{
        ...bw,
        opacity: p.moment === "off" ? 0.35 : 1,
      }}
    >
      <div data-part="2" className="flex items-center gap-2">
        {strVal.split("").map(renderDigit)}
      </div>
      <span className="m soft text-[9px] tracking-widest">READING {strVal} · UNITS</span>
    </div>
  );
}

// @plate stopwatch
export function Stopwatch(p: DemoProps) {
  const a = useAct(p, 2200);
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(Boolean(p.v.running));

  useEffect(() => {
    if (!running || p.reduced || p.moment === "off") return;
    let last = performance.now();
    let id: number;
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      setMs((prev) => prev + dt);
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [running, p.reduced, p.moment]);

  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 60000) % 30;
  const cs = Math.floor((ms % 1000) / 10);

  const dial = (deg: number, r: number, cx: number, cy: number) => (
    <line
      x1={cx}
      y1={cy}
      x2={cx + Math.sin((deg * Math.PI) / 180) * r}
      y2={cy - Math.cos((deg * Math.PI) / 180) * r}
      stroke="var(--acc)"
      strokeWidth="1.2"
    />
  );

  return (
    <button
      {...a.bind}
      type="button"
      onClick={() => setRunning((r) => !r)}
      className="flex flex-col items-center gap-2 bg-transparent text-left"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120" role="timer">
          <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="var(--ln)" />
          {Array.from({ length: 60 }, (_, i) => (
            <line
              key={i}
              x1={60 + Math.sin((i * 6 * Math.PI) / 180) * (i % 5 === 0 ? 48 : 52)}
              y1={60 - Math.cos((i * 6 * Math.PI) / 180) * (i % 5 === 0 ? 48 : 52)}
              x2={60 + Math.sin((i * 6 * Math.PI) / 180) * 55}
              y2={60 - Math.cos((i * 6 * Math.PI) / 180) * 55}
              stroke="currentColor"
              strokeWidth={i % 5 === 0 ? 1.2 : 0.5}
            />
          ))}
          <circle cx="60" cy="36" r="12" fill="none" stroke="currentColor" strokeOpacity={0.4} strokeWidth="1" />
          {dial(min * 12, 10, 60, 36)}
          {dial(sec * 6 + (cs * 6) / 100, 46, 60, 60)}
          <circle cx="60" cy="60" r="2.5" fill="var(--acc)" />
        </svg>
      </div>
      <span className="font-mono text-[16px] font-bold">
        {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}.{String(cs).padStart(2, "0")}
      </span>
      <span className="m soft text-[9px]">{running ? "CHRONO ACTIVE" : "CLICK TO START/STOP"}</span>
    </button>
  );
}

// @plate ticker-clock
export function TickerClock(p: DemoProps) {
  const a = useAct(p, 1800);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <div
      {...a.bind}
      className="flex w-[230px] flex-col gap-1.5 border border-ink bg-paper p-3 text-left"
      style={{
        ...bw,
        opacity: p.moment === "off" ? 0.35 : 1,
      }}
    >
      <div className="m flex justify-between text-[10px]">
        <span className="font-semibold">{String(p.v.zone ?? "ZURICH HBF")}</span>
        <span className="soft">TIME TAPE</span>
      </div>
      <div className="relative flex h-10 items-center justify-center overflow-hidden border border-ink bg-plate">
        <span className="font-mono text-[22px] font-bold tracking-widest">{timeStr}</span>
        <span
          className="absolute inset-y-0 left-1/2 -translate-x-1/2"
          style={{ width: "var(--ln)", background: "var(--acc)" }}
        />
      </div>
      <span className="m soft text-[9px] tracking-wider">CONTINUOUS SYNCHRONOUS FEED</span>
    </div>
  );
}

// @plate film-leader
export function FilmLeader(p: DemoProps) {
  const a = useAct(p, 3000);
  const startNum = Math.max(3, Math.min(8, Math.round(Number(p.v.start ?? 8))));
  const [count, setCount] = useState(startNum);

  useEffect(() => {
    if (p.reduced || p.moment === "off") return;
    const t = setInterval(() => {
      setCount((c) => (c <= 1 ? startNum : c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [startNum, p.reduced, p.moment]);

  const displayCount = p.reduced || p.moment === "off" ? 0 : count;

  return (
    <div
      {...a.bind}
      role="status"
      aria-label={`Film countdown ${displayCount}`}
      className="relative grid size-28 place-items-center border border-ink bg-paper"
      style={{
        ...bw,
        opacity: p.moment === "off" ? 0.35 : 1,
      }}
    >
      <svg width="112" height="112" viewBox="0 0 112 112" className="absolute inset-0">
        <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="var(--ln)" />
        <circle cx="56" cy="56" r="38" fill="none" stroke="currentColor" strokeWidth="var(--ln)" strokeDasharray="3 3" />
        <line x1="56" y1="0" x2="56" y2="112" stroke="currentColor" strokeWidth="var(--ln)" strokeOpacity={0.3} />
        <line x1="0" y1="56" x2="112" y2="56" stroke="currentColor" strokeWidth="var(--ln)" strokeOpacity={0.3} />
        <line
          x1="56"
          y1="56"
          x2="56"
          y2="10"
          stroke="var(--acc)"
          strokeWidth="2"
          style={{
            transformOrigin: "56px 56px",
            animation: p.reduced ? undefined : "leaderSweep 1s linear infinite",
          }}
        />
      </svg>
      <span className="font-mono text-4xl font-extrabold">{displayCount}</span>
      <style>{`
        @keyframes leaderSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
