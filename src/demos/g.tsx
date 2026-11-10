"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { rng, useAct } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;

// @plate rubber-stamp
export function RubberStamp(p: DemoProps) {
  const a = useAct(p, 2000);
  const hold = Number(p.v.hold ?? 700);
  const [charge, setCharge] = useState(0);
  const [stamped, setStamped] = useState(false);
  const raf = useRef(0);
  const t0 = useRef(0);

  const begin = () => {
    if (stamped) return;
    t0.current = performance.now();
    const step = () => {
      const elapsed = performance.now() - t0.current;
      const k = Math.min(1, elapsed / (hold * (p.reduced ? 0.2 : 1)));
      setCharge(k);
      if (k < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        setStamped(true);
      }
    };
    raf.current = requestAnimationFrame(step);
  };

  const end = () => {
    cancelAnimationFrame(raf.current);
    if (!stamped) setCharge(0);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const shown = stamped || a.sig || p.moment === "done";
  const c = p.moment === "pressed" ? 0.5 : p.moment === "busy" ? 0.8 : charge;
  const word = p.moment === "problem" ? "VOID" : String(p.v.word ?? "Approved");
  const mis = Number(p.v.mis ?? 1.5);
  const ang = Number(p.v.angle ?? -6);

  return (
    <button
      {...a.bind}
      type="button"
      aria-pressed={shown}
      aria-label={shown ? `${word}. Press to reset.` : `Hold to stamp ${word}`}
      onPointerDown={begin}
      onPointerUp={end}
      onPointerLeave={end}
      onClick={() => {
        if (shown) {
          setStamped(false);
          setCharge(0);
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          if (shown) {
            setStamped(false);
            setCharge(0);
          } else {
            begin();
          }
        }
      }}
      onKeyUp={end}
      className="relative flex h-[132px] w-[240px] flex-col justify-between border border-ink bg-paper p-3.5 text-left"
      style={{
        ...bw,
        opacity: p.moment === "off" ? 0.35 : 1,
      }}
    >
      <div>
        <span data-part="1" className="m block text-[11px] font-medium tracking-wider">
          {String(p.v.form ?? "FORM 27-B")}
        </span>
        <span className="m soft block text-[9px] tracking-widest">SIGNED ______ DATE __/__</span>
      </div>

      <div className="flex items-center gap-2.5">
        <span
          data-part="2"
          aria-hidden
          className="relative size-5 rounded-full border border-ink"
          style={{
            background: `conic-gradient(var(--acc) ${c * 360}deg, transparent 0)`,
          }}
        />
        <span className="m text-[10px] tracking-wider text-ink/75">
          {shown ? "STAMPED" : c > 0 ? `INKING ${Math.round(c * 100)}%` : "HOLD"}
        </span>
      </div>

      <span
        data-part="3"
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-3 grid select-none place-items-center"
        style={{
          transform: `rotate(${ang}deg) scale(${shown ? 1 : 1.25})`,
          opacity: shown ? 1 : 0,
          transition: p.reduced
            ? "opacity 100ms"
            : `transform ${d(180)} var(--ez), opacity ${d(120)} var(--ez)`,
        }}
      >
        <span
          className="border-2 border-ink px-2.5 py-1 text-[17px] font-extrabold uppercase tracking-widest text-ink opacity-35"
          style={{ gridArea: "1/1", mixBlendMode: "multiply" }}
        >
          {word}
        </span>
        <span
          className="border-2 px-2.5 py-1 text-[17px] font-extrabold uppercase tracking-widest"
          style={{
            gridArea: "1/1",
            borderColor: "var(--acc)",
            color: "var(--acc)",
            transform: `translate(${mis}px, ${-mis}px)`,
            mixBlendMode: "multiply",
            opacity: 0.9,
          }}
        >
          {word}
        </span>
      </span>
    </button>
  );
}

// @plate signal-lever
export function SignalLever(p: DemoProps) {
  const a = useAct(p, 1800);
  const [on, setOn] = useState(Boolean(p.v.on));
  const isOn = a.sig || p.moment === "done" ? true : p.moment === "problem" ? false : on;
  const angle = p.moment === "busy" ? Number(p.v.angle ?? 45) / 2 : isOn ? -Number(p.v.angle ?? 45) : 0;
  const arm = Number(p.v.arm ?? 64);
  const lever = Number(p.v.lever ?? 12);

  const flip = () => {
    if (p.moment === "off") return;
    setOn((prev) => !prev);
  };

  return (
    <button
      {...a.bind}
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={p.moment === "off"}
      onClick={flip}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") setOn(true);
        if (e.key === "ArrowDown") setOn(false);
      }}
      className="flex items-end gap-5 bg-transparent p-2 text-left"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <svg
        data-part="1"
        width={arm + 28}
        height="112"
        viewBox={`0 0 ${arm + 28} 112`}
        aria-hidden
        className="overflow-visible"
      >
        <line x1={14} y1={12} x2={14} y2={110} stroke="currentColor" strokeWidth="var(--ln)" />
        <circle cx={14} cy={26} r={4} fill={p.moment === "problem" ? "var(--acc)" : "none"} stroke="currentColor" strokeWidth="var(--ln)" />
        <g
          data-part="2"
          style={{
            transformOrigin: "14px 26px",
            transform: `rotate(${angle + (a.over && !isOn ? -3 : 0)}deg)`,
            transition: p.reduced ? "none" : `transform ${d(isOn ? 480 : 320)} var(--ez)`,
          }}
        >
          <rect
            x={18}
            y={21}
            width={arm}
            height={10}
            fill={isOn ? "currentColor" : "var(--paper)"}
            stroke="currentColor"
            strokeWidth="var(--ln)"
          />
          <line
            x1={arm + 6}
            y1={21}
            x2={arm + 6}
            y2={31}
            stroke={isOn ? "var(--paper)" : "var(--acc)"}
            strokeWidth={4}
          />
        </g>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={6}
            x2={22}
            y1={72 + i * 10}
            y2={72 + i * 10}
            stroke="currentColor"
            strokeOpacity={0.4}
            strokeWidth="var(--ln)"
          />
        ))}
      </svg>

      <span data-part="3" className="flex flex-col items-start gap-1">
        <span className="m soft text-[11px]">LEVER {String(lever).padStart(2, "0")}</span>
        <strong className="text-[22px] font-semibold tracking-tight" style={{ color: p.moment === "problem" ? "var(--acc)" : undefined }}>
          {p.moment === "busy" ? "Throwing…" : isOn ? String(p.v.onLabel ?? "Clear") : String(p.v.offLabel ?? "Stop")}
        </strong>
        <span className="m text-[10px] tracking-wider text-ink/70">
          {isOn ? "▲ RAISED" : "■ LEVEL"}
        </span>
      </span>
    </button>
  );
}

// @plate plotter-sparkline
export function PlotterSparkline(p: DemoProps) {
  const a = useAct(p, 2400);
  const seed = Math.round(Number(p.v.seed ?? 7));
  const n = Math.round(Number(p.v.points ?? 24));
  const rough = Number(p.v.rough ?? 0.5);
  const W = 240;
  const H = 90;

  const data = useMemo(() => {
    const r = rng(seed);
    const arr: number[] = [];
    let cur = 0.5;
    for (let i = 0; i < n; i++) {
      cur = Math.min(0.95, Math.max(0.05, cur + (r() - 0.5) * rough));
      arr.push(cur);
    }
    return arr;
  }, [seed, n, rough]);

  const pts = useMemo(() => {
    return data.map((y, i) => [(i / Math.max(1, n - 1)) * W, H - y * H] as const);
  }, [data, n]);

  const pathD = useMemo(() => {
    return pts.map((pt, i) => `${i ? "L" : "M"}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(" ");
  }, [pts]);

  const pathRef = useRef<SVGPathElement>(null);
  const [progress, setProgress] = useState(1);
  const [totalLength, setTotalLength] = useState(1);
  const [pen, setPen] = useState<[number, number]>([W, 0]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const raf = useRef(0);

  const plot = () => {
    cancelAnimationFrame(raf.current);
    const el = pathRef.current;
    if (!el) return;
    const L = el.getTotalLength() || 1;
    setTotalLength(L);
    if (p.reduced) {
      setProgress(1);
      const q = el.getPointAtLength(L);
      setPen([q.x, q.y]);
      return;
    }
    const dur = Number(p.v.duration ?? 1800);
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / dur);
      setProgress(k);
      const q = el.getPointAtLength(k * L);
      setPen([q.x, q.y]);
      if (k < 1) {
        raf.current = requestAnimationFrame(step);
      }
    };
    step();
  };

  useEffect(() => {
    plot();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathD, p.play]);

  const sel = hoverIndex;

  return (
    <div
      {...a.bind}
      tabIndex={0}
      role="img"
      aria-label={`Plot of ${n} points, latest ${Math.round((data[n - 1] ?? 0.5) * 100)}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setHoverIndex((h) => Math.max(0, (h ?? n - 1) - 1));
        if (e.key === "ArrowRight") setHoverIndex((h) => Math.min(n - 1, (h ?? 0) + 1));
        if (e.key === "Escape") setHoverIndex(null);
      }}
      className="flex flex-col gap-1.5 outline-none"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <div data-part="1" className="m flex w-[240px] items-center justify-between text-[11px]">
        <span className="font-medium">{String(p.v.label ?? "Barograph")}</span>
        <span className="soft text-[10px]">
          {p.moment === "problem"
            ? "PEN LIFTED"
            : sel != null
            ? `#${String(sel + 1).padStart(2, "0")} · ${Math.round(data[sel] * 100)}`
            : `SEED ${seed}`}
        </span>
      </div>

      <svg
        data-part="2"
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="overflow-visible"
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          setHoverIndex(Math.round(ratio * (n - 1)));
        }}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {Boolean(p.v.grid ?? true) &&
          Array.from({ length: 5 }, (_, i) => (
            <line
              key={i}
              x1={0}
              x2={W}
              y1={(i * H) / 4}
              y2={(i * H) / 4}
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth="var(--ln)"
            />
          ))}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="var(--ln)"
          strokeDasharray={totalLength}
          strokeDashoffset={
            p.moment === "busy" ? totalLength * 0.5 : totalLength * (1 - progress)
          }
        />
        {progress < 1 && p.moment !== "off" && (
          <g data-part="3" transform={`translate(${pen[0]}, ${pen[1]})`}>
            <line x1={-6} x2={6} stroke="var(--acc)" strokeWidth="1.5" />
            <line y1={-6} y2={6} stroke="var(--acc)" strokeWidth="1.5" />
          </g>
        )}
        {(p.moment === "done" || a.sig) && pts[n - 1] && (
          <circle cx={pts[n - 1][0]} cy={pts[n - 1][1]} r={3.5} fill="var(--acc)" />
        )}
        {sel != null && pts[sel] && (
          <g>
            <line
              x1={pts[sel][0]}
              x2={pts[sel][0]}
              y1={0}
              y2={H}
              stroke="var(--acc)"
              strokeDasharray="2 3"
              strokeWidth="var(--ln)"
            />
            <rect
              x={pts[sel][0] - 3}
              y={pts[sel][1] - 3}
              width={6}
              height={6}
              fill="var(--paper)"
              stroke="var(--acc)"
              strokeWidth="var(--ln)"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

// @plate tally-counter
export function TallyCounter(p: DemoProps) {
  const a = useAct(p, 1600);
  const max = Math.round(Number(p.v.max ?? 30));
  const [count, setCount] = useState(Math.round(Number(p.v.count ?? 7)));

  const add = (diff: number) => {
    if (p.moment === "off") return;
    setCount((prev) => Math.max(0, Math.min(max, prev + diff)));
  };

  const groups = Math.ceil(count / 5);

  return (
    <button
      {...a.bind}
      type="button"
      disabled={p.moment === "off"}
      aria-label={`${String(p.v.label ?? "Visitors")}: ${count}. Click to add, right click or backspace to remove.`}
      onClick={() => add(1)}
      onContextMenu={(e) => {
        e.preventDefault();
        add(-1);
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace" || e.key === "-") add(-1);
        if (e.key === "+" || e.key === "=") add(1);
      }}
      className="flex min-h-[116px] w-[240px] flex-col justify-between border border-ink bg-paper p-3 text-left"
      style={{
        ...bw,
        opacity: p.moment === "off" ? 0.35 : 1,
      }}
    >
      <div data-part="1" className="m flex w-full justify-between text-[11px]">
        <span className="font-medium">{String(p.v.label ?? "Visitors")}</span>
        <span className="soft text-[10px]" style={{ color: p.moment === "problem" ? "var(--acc)" : undefined }}>
          {p.moment === "problem" ? "MISCOUNT" : `TOTAL ${String(count).padStart(2, "0")}`}
        </span>
      </div>

      <div data-part="2" className="mt-2 flex flex-wrap gap-x-3.5 gap-y-2" aria-hidden>
        {Array.from({ length: groups }, (_, g) => {
          const k = Math.min(5, count - g * 5);
          return (
            <svg key={g} width={34} height={28} viewBox="0 0 34 28" className="overflow-visible">
              {Array.from({ length: Math.min(4, k) }, (_, i) => (
                <line
                  key={i}
                  x1={4 + i * 7}
                  x2={4 + i * 7 + (i % 2)}
                  y1={2}
                  y2={26}
                  stroke={
                    p.moment === "problem" && g === groups - 1 && i === k - 1
                      ? "var(--acc)"
                      : "currentColor"
                  }
                  strokeWidth="var(--ln)"
                  strokeLinecap="square"
                />
              ))}
              {k === 5 && (
                <line
                  x1={0}
                  y1={22}
                  x2={30}
                  y2={6}
                  stroke={a.over ? "var(--acc)" : "currentColor"}
                  strokeWidth="var(--ln)"
                />
              )}
            </svg>
          );
        })}
        {count === 0 && <span className="m soft text-[11px]">NO MARKS YET</span>}
      </div>

      <span className="m soft mt-2 block text-[9px] tracking-wider">
        {a.over ? "+1 CLICK · −1 RIGHT-CLICK" : `LIMIT ${max}`}
      </span>
    </button>
  );
}
