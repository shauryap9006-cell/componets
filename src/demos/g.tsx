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

// @plate queue-ticket
export function QueueTicket(p: DemoProps) {
  const a = useAct(p, 2200);
  const pre = String(p.v.prefix ?? "A");
  const [numVal, setNumVal] = useState(Math.round(Number(p.v.start ?? 41)));
  const [dispensed, setDispensed] = useState(false);
  const lag = Math.round(Number(p.v.lag ?? 3));
  const serving = Math.max(1, numVal - lag);

  const pull = () => {
    if (p.moment === "off" || p.moment === "problem") return;
    setDispensed(false);
    setTimeout(() => {
      setNumVal((x) => x + 1);
      setDispensed(true);
    }, 140);
  };

  const isDone = a.sig || p.moment === "done";
  const peek = p.moment === "pressed" ? 28 : a.over && !dispensed ? 10 : dispensed || isDone ? 54 : 0;

  return (
    <div
      {...a.bind}
      className="flex items-start gap-5 text-left"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <div className="relative w-[136px]">
        <button
          type="button"
          disabled={p.moment === "off"}
          aria-label={`Take a number. Next is ${pre}${numVal + 1}`}
          onClick={pull}
          data-part="1"
          className="relative z-10 flex h-16 w-[136px] flex-col justify-between border border-ink bg-paper p-2.5 text-left"
          style={bw}
        >
          <span className="m text-[11px] font-medium">{String(p.v.label ?? "Take a number")}</span>
          <span
            aria-hidden
            className="block h-1 border-y border-ink"
            style={{ borderWidth: "var(--ln)" }}
          />
        </button>

        <div
          data-part="2"
          aria-live="polite"
          className="tr absolute inset-x-3.5 top-[56px] flex h-[60px] items-center justify-center border border-ink bg-plate"
          style={{
            ...bw,
            transitionDuration: d(480),
            transform: `translateY(${peek - 54}px)`,
          }}
        >
          <span className="font-mono text-[24px] font-bold">
            {p.moment === "problem" ? "—" : `${pre}${String(numVal).padStart(2, "0")}`}
          </span>
        </div>
      </div>

      <div
        data-part="3"
        className="flex flex-col border-l border-ink/30 pl-4 text-left"
      >
        <span className="m soft text-[10px] tracking-wider">NOW SERVING</span>
        <strong
          className="font-mono text-[30px] font-bold leading-none tracking-tight"
          style={{ color: isDone ? "var(--acc)" : undefined }}
        >
          {p.moment === "busy" ? "· ·" : `${pre}${String(isDone ? numVal : serving).padStart(2, "0")}`}
        </strong>
        <span
          className="m mt-1 text-[10px] tracking-wider"
          style={{ color: p.moment === "problem" ? "var(--acc)" : undefined }}
        >
          {p.moment === "problem"
            ? "OUT OF PAPER"
            : isDone
            ? "PLEASE COME UP"
            : `${Math.max(0, numVal - serving)} AHEAD`}
        </span>
      </div>
    </div>
  );
}

// @plate postage-meter
function DrumDigit({ digit, speed }: { digit: number; speed: string }) {
  return (
    <span className="inline-block h-[1em] overflow-hidden leading-none">
      <span
        className="flex flex-col transition-transform duration-300"
        style={{
          transform: `translateY(${-digit}em)`,
          transitionTimingFunction: "var(--ez)",
          transitionDuration: speed,
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="h-[1em] text-center">
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

export function PostageMeter(p: DemoProps) {
  const a = useAct(p, 1800);
  const step = Number(p.v.step ?? 0.05);
  const max = Number(p.v.max ?? 9.99);
  const digits = Math.max(3, Math.min(6, Math.round(Number(p.v.digits ?? 4))));
  const [val, setVal] = useState(Number(p.v.value ?? 0.85));

  const change = (delta: number) => {
    if (p.moment === "off") return;
    setVal((v) => Math.max(0, Math.min(max * 1.5, Math.round((v + delta) * 100) / 100)));
  };

  const isOver = val > max || p.moment === "problem";
  const isDone = a.sig || p.moment === "done";
  const numInt = Math.round(val * 100);
  const ds = String(numInt % 10 ** digits)
    .padStart(digits, "0")
    .split("")
    .map(Number);

  return (
    <div
      {...a.bind}
      role="spinbutton"
      tabIndex={0}
      aria-valuenow={val}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={String(p.v.label ?? "Postage")}
      onKeyDown={(e) => {
        const mul = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowUp" || e.key === "ArrowRight") {
          e.preventDefault();
          change(step * mul);
        }
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
          e.preventDefault();
          change(-step * mul);
        }
        if (e.key === "Home") {
          e.preventDefault();
          setVal(0);
        }
      }}
      className="inline-flex items-stretch text-left"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <button
        type="button"
        data-part="1"
        disabled={p.moment === "off"}
        onClick={() => change(-step)}
        className="flex w-10 items-center justify-center border border-r-0 border-ink bg-paper text-[18px]"
        style={bw}
      >
        −
      </button>

      <div
        data-part="2"
        className="flex min-w-[150px] flex-col justify-between border border-ink bg-paper p-2.5"
        style={{
          ...bw,
          borderColor: isOver ? "var(--acc)" : undefined,
        }}
      >
        <div className="m flex justify-between text-[10px]">
          <span className="font-medium">{String(p.v.label ?? "Postage")}</span>
          <span style={{ color: isOver ? "var(--acc)" : undefined }}>
            {isOver ? "OVER" : isDone ? "PAID ✓" : `±${step.toFixed(2)}`}
          </span>
        </div>

        <div className="font-mono mt-1 flex items-baseline gap-0.5 text-[30px] font-bold leading-none">
          <span className="mr-1 text-[16px] font-normal">{String(p.v.currency ?? "£")}</span>
          {ds.map((dVal, i) => (
            <span key={i} className="contents">
              {i === digits - 2 && <span>.</span>}
              <DrumDigit digit={dVal} speed={d(320)} />
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        data-part="3"
        disabled={p.moment === "off"}
        onClick={() => change(step)}
        className="flex w-10 items-center justify-center border border-l-0 border-ink bg-paper text-[18px]"
        style={bw}
      >
        +
      </button>
    </div>
  );
}

// @plate safety-interlock
export function SafetyInterlock(p: DemoProps) {
  const a = useAct(p, 2000);
  const [armed, setArmed] = useState(Boolean(p.v.armed));
  const [on, setOn] = useState(false);

  const isLive = on || a.sig || p.moment === "done";
  const isArmed = armed || isLive;

  return (
    <div
      {...a.bind}
      data-part="1"
      className="inline-flex items-center gap-5 border border-ink bg-paper p-3 text-left"
      style={{
        ...bw,
        opacity: p.moment === "off" ? 0.35 : 1,
      }}
    >
      <button
        type="button"
        data-part="2"
        disabled={p.moment === "off"}
        aria-pressed={isArmed}
        onClick={() => {
          setArmed((prev) => !prev);
          if (isArmed) setOn(false);
        }}
        className="flex flex-col items-center gap-1.5"
      >
        <span
          className="tr block origin-bottom border border-b-0 border-ink bg-plate"
          style={{
            width: 38,
            height: 24,
            borderWidth: "var(--ln)",
            transform: isArmed ? "rotateX(70deg)" : "none",
            transitionDuration: d(320),
          }}
        />
        <span className="m text-[9px] tracking-wider text-ink/70">
          {isArmed ? "GUARD UP" : "GUARD"}
        </span>
      </button>

      <button
        type="button"
        data-part="3"
        role="switch"
        aria-checked={isLive}
        disabled={p.moment === "off" || !isArmed}
        onClick={() => setOn((prev) => !prev)}
        className="flex flex-col items-center gap-1.5 disabled:opacity-40"
      >
        <span
          className="relative block border border-ink bg-paper"
          style={{ width: 40, height: 24, borderWidth: "var(--ln)" }}
        >
          <span
            className="tr absolute bottom-0 top-0"
            style={{
              left: isLive ? 20 : 0,
              width: 18,
              background: isLive ? "var(--acc)" : "var(--ink)",
              transitionDuration: d(240),
            }}
          />
        </span>
        <span className="m text-[9px] font-semibold tracking-wider">
          {isLive ? String(p.v.onWord ?? "LIVE") : String(p.v.offWord ?? "SAFE")}
        </span>
      </button>
    </div>
  );
}

// @plate signal-lamp
export function SignalLamp(p: DemoProps) {
  const a = useAct(p, 1600);
  const rawStatus = String(p.v.status ?? "CLEAR").toUpperCase();
  const [aspect, setAspect] = useState(rawStatus);

  const active = p.moment === "problem" ? "STOP" : p.moment === "busy" ? "CAUTION" : a.sig || p.moment === "done" ? "CLEAR" : aspect;
  const ang = active === "STOP" ? 0 : active === "CAUTION" ? -45 : -90;

  const cycle = () => {
    if (p.moment === "off") return;
    setAspect((cur) => (cur === "CLEAR" ? "CAUTION" : cur === "CAUTION" ? "STOP" : "CLEAR"));
  };

  return (
    <button
      {...a.bind}
      type="button"
      role="status"
      disabled={p.moment === "off"}
      onClick={cycle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") cycle();
      }}
      className="inline-flex items-center gap-4 bg-transparent p-2 text-left"
      style={{ opacity: p.moment === "off" ? 0.35 : 1 }}
    >
      <div data-part="1" className="relative h-12 w-6">
        <span
          className="absolute bottom-0 left-1/2 top-0 -translate-x-1/2 bg-ink"
          style={{ width: "var(--ln)" }}
        />
        <span
          data-part="2"
          className="tr absolute left-1/2 top-2 origin-left"
          style={{
            width: 22,
            height: "calc(var(--ln) * 3)",
            background: active === "STOP" ? "var(--acc)" : "var(--ink)",
            transform: `rotate(${ang}deg)`,
            transitionDuration: d(320),
          }}
        />
        <span
          className="tr absolute left-1/2 top-2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink"
          style={{
            background: active === "STOP" ? "var(--acc)" : "var(--paper)",
          }}
        />
      </div>

      <div data-part="3" className="flex flex-col">
        <span className="m soft text-[9px] tracking-wider">{String(p.v.label ?? "Line status")}</span>
        <strong
          className="text-[17px] font-bold tracking-tight"
          style={{ color: active === "STOP" ? "var(--acc)" : undefined }}
        >
          {active}
        </strong>
      </div>
    </button>
  );
}
