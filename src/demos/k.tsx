"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { rng, useAct, useTick } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;

// @plate heatmap-calendar
export function HeatmapCalendar(p: DemoProps) {
  const a = useAct(p, 2200);
  const weeks = Math.max(8, Math.min(20, Number(p.v.weeks) || 14));
  const intensity = Number(p.v.intensity) || 3;
  const [hovered, setHovered] = useState<{ w: number; d: number } | null>(null);

  return (
    <div {...a.bind} tabIndex={0} role="grid" aria-label="Activity heatmap calendar" className="flex flex-col gap-2 font-mono select-none">
      <div data-part="1" className="flex gap-1 border border-ink bg-plate p-2" style={bw}>
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: 7 }, (_, day) => {
              const val = ((w * 3 + day * 5 + intensity) % 5);
              const isHov = hovered?.w === w && hovered?.d === day;
              return (
                <button
                  key={day}
                  type="button"
                  onPointerEnter={() => setHovered({ w, d: day })}
                  onPointerLeave={() => setHovered(null)}
                  aria-label={`Week ${w + 1}, Day ${day + 1}: ${val} entries`}
                  data-part={isHov ? "2" : undefined}
                  className="size-3 border border-ink/40 transition-colors focus:outline-none"
                  style={{
                    borderWidth: "var(--ln)",
                    background: val === 0 ? "transparent" : val === 4 ? "var(--acc)" : "var(--ink)",
                    opacity: val === 0 ? 0.2 : val * 0.25,
                    transform: isHov ? "scale(1.2)" : "none",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>{hovered ? `WEEK ${hovered.w + 1} · DAY ${hovered.d + 1}` : "HOVER CELL"}</span>
        <span>{weeks} WEEKS DENSITY</span>
      </div>
    </div>
  );
}

// @plate typographic-bars
export function TypographicBars(p: DemoProps) {
  const a = useAct(p, 1800);
  const labels = String(p.v.labels || "ZURICH, BASEL, GENEVA, BERN").split(",").map((s) => s.trim()).filter(Boolean);
  const val = Number(p.v.val) || 72;
  const [active, setActive] = useState(0);

  return (
    <div {...a.bind} tabIndex={0} role="list" aria-label="Typographic bar chart" className="flex w-[240px] flex-col gap-2 font-mono select-none"
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") setActive((a) => (a + 1) % labels.length);
        if (e.key === "ArrowUp") setActive((a) => (a - 1 + labels.length) % labels.length);
      }}>
      <div data-part="1" className="flex flex-col border-l border-ink py-1 pl-2" style={{ borderLeftWidth: "calc(var(--ln) * 2)" }}>
        {labels.map((lbl, i) => {
          const rowVal = Math.max(15, Math.min(100, val - i * 14));
          const isSel = i === active;
          return (
            <div
              key={lbl}
              role="listitem"
              onClick={() => setActive(i)}
              data-part={isSel ? "2" : undefined}
              className="flex items-center justify-between py-1 text-[11px] font-bold"
              style={{
                width: `${rowVal}%`,
                borderBottom: "var(--ln) solid var(--ink)",
                color: isSel ? "var(--acc)" : "inherit",
              }}
            >
              <span className="truncate">{lbl}</span>
              <span data-part="3" className="text-[9px] opacity-60">{rowVal}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] opacity-40">
        <span>BASELINE ZERO</span>
        <span>TYPOGRAPHIC LENGTH</span>
      </div>
    </div>
  );
}

// @plate line-chart-scrub
export function LineChartScrub(p: DemoProps) {
  const a = useAct(p, 2200);
  const ref = useRef<HTMLDivElement>(null);
  const ptsCount = Number(p.v.points) || 24;
  const [pos, setPos] = useState(Number(p.v.pos) || 48);
  const [drag, setDrag] = useState(false);
  const t = useTick(40, a.sig && !p.reduced);
  const curPos = a.sig ? 50 + Math.sin(t / 8) * 40 : pos;

  const W = 220;
  const H = 70;
  const pts = useMemo(() => {
    const list: [number, number][] = [];
    for (let i = 0; i < ptsCount; i++) {
      const x = (i / (ptsCount - 1)) * W;
      const y = H - (15 + Math.sin(i * 0.45) * 20 + Math.cos(i * 0.8) * 12);
      list.push([x, y]);
    }
    return list;
  }, [ptsCount]);

  const scrubX = (curPos / 100) * W;
  const closestIdx = Math.max(0, Math.min(ptsCount - 1, Math.round((curPos / 100) * (ptsCount - 1))));
  const currentY = pts[closestIdx] ? pts[closestIdx][1] : H / 2;

  const handlePointer = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    setPos(pct);
  };

  return (
    <div
      {...a.bind}
      ref={ref}
      dir="ltr"
      tabIndex={0}
      role="slider"
      aria-valuenow={Math.round(curPos)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Line chart data scrubber"
      className="flex w-[220px] flex-col gap-2 font-mono select-none"
      style={{ cursor: "ew-resize" }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag(true);
        handlePointer(e.clientX);
      }}
      onPointerMove={(e) => drag && handlePointer(e.clientX)}
      onPointerUp={() => setDrag(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 2));
        if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 2));
      }}
    >
      <div data-part="1" className="relative border border-ink bg-plate p-1" style={{ ...bw, height: H + 12 }}>
        <svg width={W} height={H} className="overflow-visible">
          {/* Trendline */}
          <polyline
            data-part="2"
            points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="var(--ln)"
          />
          {/* Scrubber Line */}
          <g data-part="3">
            <line x1={scrubX} y1={0} x2={scrubX} y2={H} stroke="var(--acc)" strokeWidth="var(--ln)" />
            <circle cx={scrubX} cy={currentY} r="3" fill="var(--acc)" />
          </g>
        </svg>
      </div>
      <div className="flex justify-between text-[10px] opacity-60">
        <span>X {Math.round(curPos)}%</span>
        <span>Y {(H - currentY).toFixed(1)} hPa</span>
      </div>
    </div>
  );
}

// @plate radial-tick-gauge
export function RadialTickGauge(p: DemoProps) {
  const a = useAct(p, 2000);
  const val = Number(p.v.val) || 68;
  const arc = Number(p.v.arc) || 240;
  const t = useTick(40, a.sig && !p.reduced);
  const curVal = a.sig ? 50 + Math.sin(t / 8) * 35 : val;

  const R = 70;
  const startAng = -arc / 2 - 90;
  const needleAng = startAng + (curVal / 100) * arc;

  return (
    <div {...a.bind} dir="ltr" tabIndex={0} role="meter" aria-valuenow={Math.round(curVal)} aria-valuemin={0} aria-valuemax={100} aria-label="Radial tachometer gauge" className="flex flex-col items-center gap-1 font-mono select-none">
      <svg width="180" height="120" viewBox="-90 -90 180 120" className="overflow-visible">
        {/* Arc Graduations */}
        <g data-part="1">
          {Array.from({ length: 25 }, (_, i) => {
            const deg = startAng + (i / 24) * arc;
            const rad = (deg * Math.PI) / 180;
            const isMajor = i % 4 === 0;
            const inner = isMajor ? R - 12 : R - 6;
            const x1 = Math.cos(rad) * R;
            const y1 = Math.sin(rad) * R;
            const x2 = Math.cos(rad) * inner;
            const y2 = Math.sin(rad) * inner;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="var(--ln)" opacity={isMajor ? 0.9 : 0.4} />;
          })}
        </g>
        {/* Redline Arc */}
        <path d={`M ${Math.cos(((startAng + arc * 0.8) * Math.PI) / 180) * R} ${Math.sin(((startAng + arc * 0.8) * Math.PI) / 180) * R} A ${R} ${R} 0 0 1 ${Math.cos(((startAng + arc) * Math.PI) / 180) * R} ${Math.sin(((startAng + arc) * Math.PI) / 180) * R}`} stroke="var(--acc)" strokeWidth="calc(var(--ln) * 2)" fill="none" />
        {/* Needle */}
        <g data-part="2" style={{ transform: `rotate(${needleAng + 90}deg)`, transition: `transform ${d(250)} var(--ez)` }}>
          <line x1="0" y1="4" x2="0" y2={-R + 4} stroke="var(--ink)" strokeWidth="calc(var(--ln) * 1.5)" />
          <circle cx="0" cy="0" r="3.5" fill="var(--acc)" />
        </g>
      </svg>
      <div data-part="3" className="flex items-baseline gap-1">
        <span className="text-[26px] font-bold leading-none">{Math.round(curVal)}</span>
        <span className="text-[11px] opacity-60">RPM ×100</span>
      </div>
    </div>
  );
}

// @plate dumbbell-chart
export function DumbbellChart(p: DemoProps) {
  const a = useAct(p, 1800);
  const rows = String(p.v.items || "ALPHA, BETA, GAMMA").split(",").map((s) => s.trim()).filter(Boolean);
  const gap = Number(p.v.gap) || 32;

  return (
    <div {...a.bind} tabIndex={0} role="list" aria-label="Dumbbell range comparison" className="flex w-[230px] flex-col gap-3 font-mono select-none">
      {rows.map((row, i) => {
        const start = 20 + i * 8;
        const end = Math.min(90, start + gap + (i % 2 === 0 ? 8 : -6));
        return (
          <div key={row} role="listitem" className="flex flex-col gap-1 text-[11px]">
            <span className="font-bold opacity-60">{row}</span>
            <div data-part="1" className="relative h-4 w-full border-b border-ink/40">
              {/* Dumbbell Connector Bar */}
              <div
                data-part="2"
                className="absolute top-1/2 h-1 -translate-y-1/2 bg-[var(--acc)] opacity-60"
                style={{ left: `${start}%`, width: `${end - start}%` }}
              />
              {/* Left Point */}
              <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-paper" style={{ left: `${start}%`, borderWidth: "var(--ln)" }} />
              {/* Right Point */}
              <span className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-ink" style={{ left: `${end}%`, borderWidth: "var(--ln)" }} />
            </div>
            <div data-part="3" className="flex justify-between text-[9px] opacity-60">
              <span>{start}%</span>
              <span>Δ {end - start}%</span>
              <span>{end}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// @plate hairline-treemap
export function HairlineTreemap(p: DemoProps) {
  const a = useAct(p, 2000);
  const [active, setActive] = useState(0);

  const cells = [
    { name: "CORE", share: 44, col: "span 2", row: "span 2" },
    { name: "AUX A", share: 22, col: "span 1", row: "span 1" },
    { name: "AUX B", share: 18, col: "span 1", row: "span 1" },
    { name: "SPARE", share: 16, col: "span 3", row: "span 1" },
  ];

  return (
    <div {...a.bind} tabIndex={0} role="region" aria-label="Hairline proportional treemap" className="flex w-[230px] flex-col gap-2 font-mono select-none">
      <div data-part="1" className="grid h-28 grid-cols-3 grid-rows-3 border border-ink bg-plate" style={bw}>
        {cells.map((c, i) => {
          const isSel = i === active;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => setActive(i)}
              data-part={isSel ? "2" : undefined}
              className="relative flex flex-col justify-between border border-ink p-1.5 text-left transition-colors focus:outline-none"
              style={{
                gridColumn: c.col,
                gridRow: c.row,
                borderWidth: "var(--ln)",
                background: isSel ? "var(--paper)" : "transparent",
              }}
            >
              <span className="text-[10px] font-bold">{c.name}</span>
              <span data-part="3" className="text-[9px]" style={{ color: isSel ? "var(--acc)" : "inherit", opacity: isSel ? 1 : 0.6 }}>{c.share}%</span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] opacity-40">
        <span>PROPORTIONAL PARTITION</span>
        <span>TOTAL 100%</span>
      </div>
    </div>
  );
}

// @plate ribbon-flow
export function RibbonFlow(p: DemoProps) {
  const a = useAct(p, 2400);
  const tension = Number(p.v.tension) || 50;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="Alluvial ribbon flow" className="flex w-[230px] flex-col gap-2 font-mono select-none">
      <svg data-part="1" width="230" height="90" viewBox="0 0 230 90" className="border border-ink bg-plate" style={bw}>
        {/* Left Input Node */}
        <rect x="10" y="15" width="8" height="60" fill="var(--ink)" />
        {/* Right Output Nodes */}
        <rect x="212" y="15" width="8" height="24" fill="var(--ink)" />
        <rect x="212" y="51" width="8" height="24" fill="var(--ink)" />
        {/* Connecting Alluvial Ribbons */}
        <path
          data-part="2"
          d={`M 18 15 C ${18 + tension} 15, ${212 - tension} 15, 212 15 L 212 39 C ${212 - tension} 39, ${18 + tension} 45, 18 45 Z`}
          fill="var(--acc)"
          opacity="0.75"
        />
        <path
          d={`M 18 45 C ${18 + tension} 45, ${212 - tension} 51, 212 51 L 212 75 C ${212 - tension} 75, ${18 + tension} 75, 18 75 Z`}
          fill="var(--ink)"
          opacity="0.35"
        />
      </svg>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>INPUT 100%</span>
        <span>FLOW ALLOCATION</span>
      </div>
    </div>
  );
}

// @plate leaderboard-flip
export function LeaderboardFlip(p: DemoProps) {
  const a = useAct(p, 2200);
  const [active, setActive] = useState(0);
  const raw = String(p.v.leaders || "EXP 01, EXP 02, EXP 03").split(",").map((s) => s.trim()).filter(Boolean);

  const rows = [...raw];
  if (active > 0 && active < rows.length) {
    const temp = rows[0];
    rows[0] = rows[active];
    rows[active] = temp;
  }

  return (
    <div {...a.bind} tabIndex={0} role="list" aria-label="Ranked flap leaderboard" className="flex w-[220px] flex-col gap-1.5 font-mono select-none">
      <div data-part="1" className="flex flex-col gap-1 border border-ink bg-plate p-1.5" style={bw}>
        {rows.map((lead, idx) => (
          <button
            key={lead}
            type="button"
            onClick={() => setActive(idx)}
            data-part={idx === 0 ? "2" : undefined}
            className="flex items-center justify-between border border-ink bg-paper px-2 py-1.5 text-[11px] font-bold focus:outline-none"
            style={{
              ...bw,
              borderColor: idx === 0 ? "var(--acc)" : "var(--ink)",
              color: idx === 0 ? "var(--acc)" : "inherit",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="size-4 border border-ink text-center text-[9px] leading-4" style={bw}>0{idx + 1}</span>
              <span>{lead}</span>
            </div>
            <span data-part="3" className="text-[9px] opacity-60">FLAP RANK</span>
          </button>
        ))}
      </div>
      <div className="text-[9px] opacity-40">CLICK ROW TO PROMOTE RANK</div>
    </div>
  );
}

// @plate live-ticker-table
export function LiveTickerTable(p: DemoProps) {
  const a = useAct(p, 2000);
  const base = Number(p.v.rate) || 108;
  const t = useTick(60, !p.reduced);
  const delta = Math.sin(t * 0.3) * 0.8;

  return (
    <div {...a.bind} tabIndex={0} role="table" aria-label="Exchange rate ticker matrix" className="flex w-[230px] flex-col gap-1.5 font-mono select-none">
      <div data-part="1" className="border border-ink bg-plate p-1.5" style={bw}>
        <div className="flex items-center justify-between border-b border-ink/40 pb-1 text-[9px] opacity-60">
          <span>MARKET</span>
          <span>BID</span>
          <span>ASK</span>
        </div>
        {[
          { name: "CHF/EUR", b: (base * 0.94 + delta).toFixed(2), a: (base * 0.95 + delta).toFixed(2) },
          { name: "CHF/USD", b: (base * 1.12 - delta * 0.5).toFixed(2), a: (base * 1.13 - delta * 0.5).toFixed(2) },
        ].map((row, i) => (
          <div key={row.name} data-part={i === 0 ? "2" : undefined} className="flex items-center justify-between py-1 text-[11px] font-bold">
            <span>{row.name}</span>
            <span>{row.b}</span>
            <span style={{ color: delta >= 0 ? "var(--acc)" : "inherit" }}>{row.a}</span>
          </div>
        ))}
      </div>
      <div data-part="3" className="flex justify-between text-[9px] opacity-60">
        <span>BOURSE WIRE 100 Hz</span>
        <span>{delta >= 0 ? "▲ GAIN" : "▼ SLIP"}</span>
      </div>
    </div>
  );
}

// @plate hatching-chart
export function HatchingChart(p: DemoProps) {
  const a = useAct(p, 1800);
  const bars = Number(p.v.bars) || 4;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="Monochrome hatching bar chart" className="flex flex-col gap-2 font-mono select-none">
      <div data-part="1" className="flex h-24 w-[220px] items-end justify-between border-b border-l border-ink p-2" style={{ borderWidth: "0 0 var(--ln) var(--ln)" }}>
        {Array.from({ length: bars }, (_, i) => {
          const h = 25 + i * 16;
          return (
            <div
              key={i}
              data-part={i === 0 ? "2" : undefined}
              className="hatch border border-ink"
              style={{
                width: 32,
                height: h,
                borderWidth: "var(--ln)",
                transform: `rotate(${i % 2 === 0 ? 0 : 2}deg)`,
              }}
            />
          );
        })}
      </div>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>ANGLE SWATCHES</span>
        <span>{bars} HATCHED COLUMNS</span>
      </div>
    </div>
  );
}

// @plate isometric-stack
export function IsometricStack(p: DemoProps) {
  const a = useAct(p, 2200);
  const layers = Number(p.v.layers) || 3;
  const lift = a.over ? Number(p.v.lift) * 1.5 : Number(p.v.lift) || 24;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="Isometric data stack" className="flex flex-col items-center gap-2 font-mono select-none">
      <div data-part="1" className="relative flex h-28 w-[180px] items-center justify-center">
        {Array.from({ length: layers }, (_, i) => {
          const yOffset = (i - (layers - 1) / 2) * lift;
          return (
            <div
              key={i}
              data-part={i === 0 ? "2" : undefined}
              className="absolute border border-ink bg-paper/85 transition-transform"
              style={{
                ...bw,
                width: 110,
                height: 55,
                transform: `translateY(${yOffset}px) rotateX(60deg) rotateZ(-45deg)`,
                borderColor: i === layers - 1 ? "var(--acc)" : "var(--ink)",
              }}
            />
          );
        })}
      </div>
      <div data-part="3" className="text-[10px] opacity-60">30° AXONOMETRIC ELEVATION</div>
    </div>
  );
}

// @plate bullet-graph
export function BulletGraph(p: DemoProps) {
  const a = useAct(p, 1800);
  const actual = Number(p.v.actual) || 78;
  const target = Number(p.v.target) || 85;

  return (
    <div {...a.bind} tabIndex={0} role="meter" aria-valuenow={actual} aria-valuemin={0} aria-valuemax={100} aria-label="Few bullet graph" className="flex w-[230px] flex-col gap-1.5 font-mono select-none">
      <div className="flex justify-between text-[10px] font-bold">
        <span>CORE EFFICIENCY</span>
        <span>{actual}% / TARGET {target}%</span>
      </div>
      {/* Qualitative Background Ranges */}
      <div data-part="1" className="relative flex h-6 w-full items-center border border-ink bg-plate" style={bw}>
        {/* Range 1: 0..60 */}
        <div className="h-full w-[60%] bg-ink/10" />
        {/* Range 2: 60..85 */}
        <div className="h-full w-[25%] bg-ink/20" />
        {/* Range 3: 85..100 */}
        <div className="h-full w-[15%] bg-ink/30" />
        {/* Actual Performance Bar */}
        <div data-part="2" className="absolute left-0 h-2 bg-ink" style={{ width: `${actual}%` }} />
        {/* Comparative Target Marker */}
        <div data-part="3" className="absolute h-full w-1 -translate-x-1/2 bg-[var(--acc)]" style={{ left: `${target}%` }} />
      </div>
      <div className="flex justify-between text-[9px] opacity-40">
        <span>POOR (60)</span>
        <span>SATISFACTORY (85)</span>
        <span>GOOD</span>
      </div>
    </div>
  );
}

// @plate slopegraph
export function Slopegraph(p: DemoProps) {
  const a = useAct(p, 2000);
  const [active, setActive] = useState(0);

  const traces = [
    { name: "TRAJECTORY A", y1: 20, y2: 65 },
    { name: "TRAJECTORY B", y1: 55, y2: 30 },
    { name: "TRAJECTORY C", y1: 40, y2: 50 },
  ];

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="Tufte slopegraph comparison" className="flex w-[230px] flex-col gap-2 font-mono select-none">
      <div className="flex justify-between text-[10px] font-bold opacity-60">
        <span>EPOCH 1960</span>
        <span>EPOCH 1974</span>
      </div>
      <svg data-part="1" width="230" height="90" viewBox="0 0 230 90" className="border-x border-ink" style={{ borderWidth: "0 var(--ln)" }}>
        {traces.map((tr, i) => {
          const isSel = i === active;
          return (
            <g key={tr.name} data-part={isSel ? "2" : undefined} onClick={() => setActive(i)}>
              <line
                x1="20"
                y1={90 - tr.y1}
                x2="210"
                y2={90 - tr.y2}
                stroke={isSel ? "var(--acc)" : "var(--ink)"}
                strokeWidth={isSel ? "calc(var(--ln) * 2)" : "var(--ln)"}
                opacity={isSel ? 1 : 0.4}
              />
              <circle cx="20" cy={90 - tr.y1} r="2.5" fill={isSel ? "var(--acc)" : "var(--ink)"} />
              <circle cx="210" cy={90 - tr.y2} r="2.5" fill={isSel ? "var(--acc)" : "var(--ink)"} />
            </g>
          );
        })}
      </svg>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>{traces[active].name}</span>
        <span>Δ {traces[active].y2 - traces[active].y1 > 0 ? "+" : ""}{traces[active].y2 - traces[active].y1}</span>
      </div>
    </div>
  );
}

// @plate bauhaus-generator
export function BauhausGenerator(p: DemoProps) {
  const a = useAct(p, 2200);
  const [seed, setSeed] = useState(Number(p.v.seed) || 42);

  const comp = useMemo(() => {
    const r = rng(seed);
    return {
      circleX: 40 + r() * 100,
      circleY: 30 + r() * 50,
      circleR: 20 + r() * 18,
      rectX: 30 + r() * 110,
      rectY: 20 + r() * 40,
      rectW: 30 + r() * 40,
      rectH: 30 + r() * 40,
      lineAng: Math.floor(r() * 4) * 45,
    };
  }, [seed]);

  return (
    <div {...a.bind} tabIndex={0} role="button" aria-label="Generate Bauhaus composition" onClick={() => setSeed((s) => s + 1)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSeed((s) => s + 1)}
      className="flex flex-col items-center gap-2 font-mono select-none focus:outline-none">
      <svg data-part="1" width="200" height="110" viewBox="0 0 200 110" className="border border-ink bg-paper" style={bw}>
        {/* Geometric Forms */}
        <g data-part="2">
          {/* Square */}
          <rect x={comp.rectX} y={comp.rectY} width={comp.rectW} height={comp.rectH} fill="none" stroke="var(--ink)" strokeWidth="calc(var(--ln) * 2)" />
          {/* Circle */}
          <circle cx={comp.circleX} cy={comp.circleY} r={comp.circleR} fill="var(--acc)" opacity="0.8" />
          {/* Diagonal Hairline */}
          <line x1="20" y1="20" x2="180" y2="90" stroke="var(--ink)" strokeWidth="var(--ln)" strokeDasharray="3 3" />
        </g>
      </svg>
      <div data-part="3" className="flex w-[200px] justify-between text-[10px] opacity-60">
        <span>WEIMAR FORM SEED {seed}</span>
        <span>CLICK TO CYCLE</span>
      </div>
    </div>
  );
}

// @plate flow-field
export function FlowField(p: DemoProps) {
  const a = useAct(p, 2400);
  const count = Number(p.v.particles) || 24;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="Vector aerodynamic flow field" className="flex flex-col gap-2 font-mono select-none">
      <svg data-part="1" width="220" height="90" viewBox="0 0 220 90" className="border border-ink bg-plate" style={bw}>
        <g data-part="2">
          {Array.from({ length: count }, (_, i) => {
            const y = (i / (count - 1)) * 80 + 5;
            const wave = Math.sin(i * 0.5) * 14;
            return (
              <path
                key={i}
                d={`M 10 ${y} Q 110 ${y + wave} 210 ${y}`}
                fill="none"
                stroke={i % 4 === 0 ? "var(--acc)" : "var(--ink)"}
                strokeWidth="var(--ln)"
                opacity={i % 4 === 0 ? 0.9 : 0.35}
              />
            );
          })}
        </g>
      </svg>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>LAMINAR STREAMLINES</span>
        <span>{count} TRACES</span>
      </div>
    </div>
  );
}

// @plate seismograph
export function Seismograph(p: DemoProps) {
  const a = useAct(p, 2400);
  const mag = Number(p.v.amplitude) || 4;
  const t = useTick(40, !p.reduced);

  const pts = Array.from({ length: 30 }, (_, i) => {
    const x = i * 7;
    const shake = Math.sin((i + t * 0.4) * 1.8) * mag * 2.5;
    return `${x},${45 + shake}`;
  }).join(" ");

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label="Seismograph drum record" className="flex flex-col gap-2 font-mono select-none">
      <div data-part="1" className="relative flex h-24 w-[220px] items-center border border-ink bg-plate" style={bw}>
        <svg width="220" height="90" viewBox="0 0 220 90" className="size-full overflow-hidden">
          {/* Continuous Tremor Plot */}
          <polyline data-part="2" points={pts} fill="none" stroke="var(--ink)" strokeWidth="var(--ln)" />
          {/* Vibrating Stylus Needle */}
          <line x1="205" y1="10" x2="205" y2="80" stroke="var(--acc)" strokeWidth="calc(var(--ln) * 1.5)" />
        </svg>
      </div>
      <div data-part="3" className="flex justify-between text-[10px] opacity-60">
        <span>RICHTER MAGNITUDE {mag}.0</span>
        <span>RECORDING DRUM</span>
      </div>
    </div>
  );
}

// @plate vu-meter
export function VuMeter(p: DemoProps) {
  const a = useAct(p, 2200);
  const db = Number(p.v.db) || -2;
  const t = useTick(50, a.over && !p.reduced);
  const curDb = a.over ? Math.min(3, Math.max(-20, db + Math.sin(t / 4) * 4)) : db;

  // -20 VU to +3 VU mapped to -45° to +45°
  const ang = -45 + ((curDb + 20) / 23) * 90;
  const isPeak = curDb >= 0;

  return (
    <div {...a.bind} dir="ltr" tabIndex={0} role="meter" aria-valuenow={Math.round(curDb)} aria-valuemin={-20} aria-valuemax={3} aria-label="Analog ballistic VU meter" className="flex flex-col items-center gap-1 font-mono select-none">
      <svg data-part="1" width="180" height="100" viewBox="-90 -80 180 100" className="border border-ink bg-paper" style={bw}>
        {/* Scale Arc */}
        <path d="M -60 -20 A 75 75 0 0 1 60 -20" stroke="var(--ink)" strokeWidth="var(--ln)" fill="none" />
        {/* Redline Zone (0 to +3) */}
        <path d="M 30 -42 A 75 75 0 0 1 60 -20" stroke="var(--acc)" strokeWidth="calc(var(--ln) * 2.5)" fill="none" />
        {/* Needle */}
        <g data-part="2" style={{ transform: `rotate(${ang}deg)`, transition: `transform ${d(250)} var(--ez)` }}>
          <line x1="0" y1="4" x2="0" y2="-66" stroke="var(--ink)" strokeWidth="calc(var(--ln) * 1.5)" />
          <circle cx="0" cy="0" r="3" fill="var(--ink)" />
        </g>
      </svg>
      <div className="flex w-[180px] items-baseline justify-between text-[10px]">
        <span className="opacity-60">{curDb.toFixed(1)} VU</span>
        <span data-part="3" className="font-bold" style={{ color: isPeak ? "var(--acc)" : "inherit" }}>
          {isPeak ? "● OVERLOAD PEAK" : "○ HEADROOM"}
        </span>
      </div>
    </div>
  );
}

// @plate punch-card
export function PunchCard(p: DemoProps) {
  const a = useAct(p, 1800);
  const code = String(p.v.code || "HAIRLINE 1974");
  const cols = Number(p.v.cols) || 24;

  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`IBM punched card: ${code}`} className="flex flex-col gap-1.5 font-mono select-none">
      <div data-part="1" className="relative flex w-[230px] flex-col border border-ink bg-paper p-2" style={{ ...bw, clipPath: "polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)" }}>
        {/* Top Interpreting Imprint */}
        <div data-part="3" className="mb-1 text-[10px] font-bold tracking-widest">{code}</div>
        {/* Hollerith Punch Matrix */}
        <div data-part="2" className="flex flex-col gap-0.5 opacity-80" aria-hidden>
          {Array.from({ length: 8 }, (_, r) => (
            <div key={r} className="flex justify-between">
              {Array.from({ length: Math.min(24, cols) }, (_, c) => {
                const isPunched = ((c * 3 + r * 7) % 11) === 0;
                return (
                  <span
                    key={c}
                    className="size-1"
                    style={{
                      background: isPunched ? "var(--acc)" : "var(--ink)",
                      opacity: isPunched ? 1 : 0.2,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <span className="text-[9px] opacity-60">IBM 80-COLUMN CARD · HOLLERITH SPEC</span>
    </div>
  );
}

// @plate countdown-toast
export function CountdownToast(p: DemoProps) {
  const a = useAct(p, 2500);
  const [dismissed, setDismissed] = useState(false);
  const duration = Number(p.v.duration) || 5;
  const isDismissed = dismissed || p.moment === "done";

  if (isDismissed) {
    return (
      <button
        type="button"
        onClick={() => setDismissed(false)}
        className="border border-ink bg-plate px-3 py-1.5 font-mono text-[11px] font-bold focus:outline-none"
        style={bw}
      >
        RE-TRIGGER TOAST
      </button>
    );
  }

  return (
    <div {...a.bind} tabIndex={0} role="alert" aria-live="polite" className="relative flex w-[230px] items-center justify-between border border-ink bg-paper p-3 font-mono select-none" style={bw}>
      {/* Perimeter Countdown Hairline */}
      <svg data-part="2" className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="var(--acc)"
          strokeWidth="calc(var(--ln) * 2)"
          strokeDasharray="600"
          strokeDashoffset="0"
          style={{
            animation: p.reduced ? "none" : `unroll ${duration}s linear forwards`,
          }}
        />
      </svg>
      <div data-part="1" className="flex flex-col">
        <span className="text-[10px] font-bold tracking-tight">{String(p.v.message || "DISPATCH LOGGED")}</span>
        <span className="text-[9px] opacity-60">{duration}s AUTO-DISMISS</span>
      </div>
      <button
        type="button"
        data-part="3"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notification"
        className="size-5 border border-ink text-center text-[10px] font-bold leading-4 focus:outline-none"
        style={bw}
      >
        ✕
      </button>
    </div>
  );
}
