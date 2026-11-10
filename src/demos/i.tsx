"use client";
import { useEffect, useRef, useState } from "react";
import { useAct, useTick } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;

// @plate patch-bay
export function PatchBay(p: DemoProps) {
  const a = useAct(p, 2200);
  const n = Math.max(2, Math.min(6, Number(p.v.jacks) || 4));
  const sag = Number(p.v.sag) || 28;
  const [activeFrom, setActiveFrom] = useState<number | null>(null);
  const [routes, setRoutes] = useState<Record<number, number>>({ 0: 1, 1: 0 });
  const t = useTick(700, a.sig);

  const sigFrom = a.sig ? t % n : null;
  const sigTo = a.sig ? (t * 2 + 1) % n : null;

  const connect = (from: number, to: number) => {
    setRoutes((prev) => {
      const next = { ...prev };
      if (next[from] === to) {
        delete next[from];
      } else {
        next[from] = to;
      }
      return next;
    });
    setActiveFrom(null);
  };

  const currentRoutes = a.sig && sigFrom !== null && sigTo !== null ? { ...routes, [sigFrom]: sigTo } : routes;
  const W = 220;
  const jackSpacing = W / (n + 1);

  return (
    <div {...a.bind} dir="ltr" className="flex flex-col gap-3 font-mono text-[12px] select-none">
      <div data-part="1" className="relative flex flex-col justify-between border border-ink p-3" style={{ ...bw, width: W, height: 110 }}>
        {/* Top Jacks: Sources */}
        <div className="flex justify-between">
          {Array.from({ length: n }, (_, i) => {
            const isArmed = activeFrom === i;
            const isRouted = currentRoutes[i] !== undefined;
            return (
              <button
                key={`src-${i}`}
                type="button"
                onClick={() => setActiveFrom(isArmed ? null : i)}
                aria-label={`Source jack ${i + 1}${isRouted ? ` connected to out ${currentRoutes[i] + 1}` : ""}`}
                className="group flex flex-col items-center gap-1 focus:outline-none"
              >
                <span className="text-[9px] opacity-60">IN {i + 1}</span>
                <span
                  className="grid size-5 place-items-center rounded-full border border-ink transition-colors"
                  style={{
                    borderWidth: "var(--ln)",
                    background: isArmed ? "var(--acc)" : isRouted ? "var(--ink)" : "var(--plate)",
                    color: isArmed ? "var(--paper)" : isRouted ? "var(--paper)" : "var(--ink)",
                  }}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                </span>
              </button>
            );
          })}
        </div>

        {/* SVG Cable Overlay */}
        <svg data-part="2" className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden>
          {Object.entries(currentRoutes).map(([fromStr, toNum]) => {
            const f = Number(fromStr);
            const to = toNum;
            if (f >= n || to >= n) return null;
            const x1 = (f + 1) * jackSpacing;
            const y1 = 30;
            const x2 = (to + 1) * jackSpacing;
            const y2 = 80;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 + sag;
            return (
              <g key={`cable-${f}-${to}`}>
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  stroke="var(--acc)"
                  strokeWidth="calc(var(--ln) * 2.5)"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx={x1} cy={y1} r="2.5" fill="var(--acc)" />
                <circle cx={x2} cy={y2} r="2.5" fill="var(--acc)" />
              </g>
            );
          })}
        </svg>

        {/* Bottom Jacks: Outputs */}
        <div className="flex justify-between">
          {Array.from({ length: n }, (_, i) => {
            const isTargeted = Object.values(currentRoutes).includes(i);
            return (
              <button
                key={`dst-${i}`}
                type="button"
                onClick={() => {
                  if (activeFrom !== null) connect(activeFrom, i);
                }}
                aria-label={`Destination jack ${i + 1}`}
                className="group flex flex-col items-center gap-1 focus:outline-none"
              >
                <span
                  className="grid size-5 place-items-center rounded-full border border-ink transition-colors"
                  style={{
                    borderWidth: "var(--ln)",
                    background: isTargeted ? "var(--ink)" : "var(--plate)",
                    color: isTargeted ? "var(--paper)" : "var(--ink)",
                  }}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                </span>
                <span className="text-[9px] opacity-60">OUT {i + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div data-part="3" className="flex justify-between text-[11px] opacity-80">
        <span className="soft">
          {activeFrom !== null ? `PATCH IN ${activeFrom + 1} → SELECT OUT` : "STANDBY · ZERO LOSS"}
        </span>
        <span>{Object.keys(currentRoutes).length} PATCHED</span>
      </div>
    </div>
  );
}

// @plate teleprinter
export function Teleprinter(p: DemoProps) {
  const a = useAct(p, 2000);
  const [val, setVal] = useState("");
  const limit = Math.max(8, Number(p.v.max) || 24);
  const demoText = "STOP TELEGRAM PROCEED WITH MERGE STOP".slice(0, a.sig ? 24 : 0);
  const text = a.sig && !val ? demoText : val;
  const isOver = text.length > limit;

  return (
    <div {...a.bind} dir="ltr" className="flex w-[240px] flex-col gap-2 font-mono text-[13px]">
      <div data-part="1" className="flex items-center justify-between border-b border-ink pb-1" style={{ borderBottomWidth: "var(--ln)" }}>
        <span className="text-[10px] font-bold tracking-widest">{String(p.v.legend || "DISPATCH")}</span>
        <span className="text-[9px] opacity-60">BAUD 110 · 8-N-1</span>
      </div>

      <div data-part="2" className="relative flex min-h-[44px] items-center border-b border-ink bg-transparent py-1.5" style={{ borderBottomWidth: "calc(var(--ln) * 1.5)" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setVal(e.target.value.toUpperCase())}
          placeholder={String(p.v.placeholder || "ENTER DISPATCH…")}
          aria-label="Teletype input"
          aria-invalid={isOver}
          className="w-full bg-transparent tracking-wider uppercase outline-none placeholder:text-ink/30"
        />
        <span
          className="pointer-events-none inline-block size-3 bg-[var(--acc)] opacity-80"
          style={{ animation: p.reduced ? "none" : `pulse ${d(900)} steps(2, start) infinite` }}
          aria-hidden
        />
      </div>

      <div data-part="3" className="flex items-center justify-between text-[10px]">
        <span className="opacity-60">{isOver ? `LIMIT EXCEEDED +${text.length - limit}` : "FEED READY"}</span>
        <span style={{ color: isOver ? "var(--acc)" : undefined }}>
          {String(text.length).padStart(2, "0")} / {limit} CHARS
        </span>
      </div>
    </div>
  );
}

// @plate scrubbable-number
export function ScrubbableNumber(p: DemoProps) {
  const a = useAct(p, 2200);
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  const min = Number(p.v.min) || 0;
  const max = Number(p.v.max) || 192;
  const t = useTick(40, a.sig && !p.reduced);
  const initial = Number(p.v.value) || 24;
  const val = a.sig ? Math.round(min + ((Math.sin(t / 8) + 1) / 2) * (max - min)) : initial;

  const handleDrag = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const nextVal = Math.round(min + ratio * (max - min));
    p.set("value", nextVal);
  };

  const W = 200;
  const pct = Math.max(0, Math.min(1, (val - min) / (max - min)));

  return (
    <div
      {...a.bind}
      ref={ref}
      dir="ltr"
      role="slider"
      tabIndex={0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={val}
      aria-label={`${p.v.label || "Value"} scrubber`}
      className="flex w-[200px] flex-col gap-2 font-mono select-none"
      style={{ cursor: "ew-resize" }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag(true);
        handleDrag(e.clientX);
      }}
      onPointerMove={(e) => drag && handleDrag(e.clientX)}
      onPointerUp={() => setDrag(false)}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") p.set("value", Math.min(max, val + step));
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") p.set("value", Math.max(min, val - step));
      }}
    >
      <div data-part="3" className="flex items-baseline justify-between text-[11px]">
        <span className="opacity-60">{String(p.v.label || "KERNING")}</span>
        <span className="text-[9px] opacity-40">DRAG TO SCRUB</span>
      </div>

      <div data-part="1" className="flex items-baseline gap-1">
        <span className="font-mono text-[34px] font-bold leading-none tracking-tight">
          {val}
        </span>
        <span className="text-[12px] opacity-60">{String(p.v.unit || "px")}</span>
      </div>

      <div data-part="2" className="relative h-6 w-full border-t border-b border-ink py-1" style={{ borderWidth: "var(--ln) 0" }}>
        <svg width={W} height="16" className="size-full overflow-visible">
          {Array.from({ length: 21 }, (_, i) => {
            const x = (i / 20) * W;
            const isMajor = i % 5 === 0;
            return (
              <line
                key={i}
                x1={x}
                y1={isMajor ? 0 : 4}
                x2={x}
                y2={isMajor ? 14 : 10}
                stroke="currentColor"
                strokeWidth="var(--ln)"
                opacity={isMajor ? 0.7 : 0.3}
              />
            );
          })}
          {/* Accent Cursor */}
          <line
            x1={pct * W}
            y1={-2}
            x2={pct * W}
            y2={16}
            stroke="var(--acc)"
            strokeWidth="calc(var(--ln) * 2)"
          />
        </svg>
      </div>
    </div>
  );
}

// @plate combination-lock
export function CombinationLock(p: DemoProps) {
  const a = useAct(p, 2000);
  const targetCombo = String(p.v.combo || "042").slice(0, 3).padEnd(3, "0");
  const [digits, setDigits] = useState<[number, number, number]>([0, 0, 0]);
  const activeDigits: [number, number, number] = a.sig
    ? [Number(targetCombo[0]), Number(targetCombo[1]), Number(targetCombo[2])]
    : digits;
  const isUnlocked = activeDigits.map(String).join("") === targetCombo;

  const stepDigit = (idx: number, delta: number) => {
    setDigits((prev) => {
      const next = [...prev] as [number, number, number];
      next[idx] = (next[idx] + delta + 10) % 10;
      return next;
    });
  };

  return (
    <div {...a.bind} dir="ltr" className="flex flex-col items-center gap-3 font-mono select-none">
      {/* Shackle */}
      <svg width="60" height="34" viewBox="0 0 60 34" className="overflow-visible" aria-hidden>
        <path
          d="M 16 30 V 16 A 14 14 0 0 1 44 16 V 30"
          stroke="var(--ink)"
          strokeWidth="calc(var(--ln) * 3)"
          fill="none"
          style={{
            transform: isUnlocked ? "translateY(-6px)" : "none",
            transition: `transform ${d(300)} var(--ez)`,
          }}
        />
      </svg>

      {/* Lock Casing */}
      <div data-part="1" className="flex flex-col items-center border border-ink bg-plate p-3" style={{ ...bw, width: 170 }}>
        {/* Three Tumbler Drums */}
        <div data-part="2" className="flex items-center gap-2">
          {activeDigits.map((digit, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => stepDigit(i, -1)}
                aria-label={`Tumbler ${i + 1} up`}
                className="text-[10px] opacity-40 hover:opacity-100"
              >
                ▲
              </button>
              <div
                className="grid size-11 place-items-center border border-ink bg-paper font-mono text-[20px] font-bold"
                style={{ ...bw, borderColor: isUnlocked ? "var(--acc)" : "var(--ink)" }}
              >
                {digit}
              </div>
              <button
                type="button"
                onClick={() => stepDigit(i, 1)}
                aria-label={`Tumbler ${i + 1} down`}
                className="text-[10px] opacity-40 hover:opacity-100"
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        {/* Lock State readout */}
        <div data-part="3" className="mt-3 text-[10px] tracking-widest" style={{ color: isUnlocked ? "var(--acc)" : "inherit" }}>
          {isUnlocked ? "● UNLOCKED" : "○ SECURED"}
        </div>
      </div>
    </div>
  );
}

// @plate protractor
export function Protractor(p: DemoProps) {
  const a = useAct(p, 2000);
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  const t = useTick(40, a.sig && !p.reduced);
  const initial = Number(p.v.angle) || 62;
  const ang = a.sig ? 90 + Math.sin(t / 8) * 60 : initial;

  const updateAngle = (clientX: number, clientY: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.bottom;
    const rad = Math.atan2(cy - clientY, clientX - cx);
    let deg = Math.round((rad * 180) / Math.PI);
    deg = Math.max(0, Math.min(180, deg));
    p.set("angle", deg);
  };

  const R = 80;
  const rad = (ang * Math.PI) / 180;
  const armX = Math.cos(rad) * (R + 10);
  const armY = -Math.sin(rad) * (R + 10);

  return (
    <div
      {...a.bind}
      ref={ref}
      dir="ltr"
      role="slider"
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={180}
      aria-valuenow={Math.round(ang)}
      aria-label="Drafting protractor angle"
      className="flex flex-col items-center gap-2 font-mono select-none"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag(true);
        updateAngle(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => drag && updateAngle(e.clientX, e.clientY)}
      onPointerUp={() => setDrag(false)}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 15 : 1;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") p.set("angle", Math.min(180, Math.round(ang + step)));
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") p.set("angle", Math.max(0, Math.round(ang - step)));
      }}
    >
      <svg width="200" height="110" viewBox="-100 -95 200 110" className="overflow-visible">
        {/* Baseline */}
        <line x1="-90" y1="0" x2="90" y2="0" stroke="var(--ink)" strokeWidth="var(--ln)" />

        {/* 180° Arc Scale */}
        <g data-part="1">
          <path d="M -80 0 A 80 80 0 0 1 80 0" stroke="var(--ink)" strokeWidth="var(--ln)" fill="none" />
          {Array.from({ length: 37 }, (_, i) => {
            const theta = (i * 5 * Math.PI) / 180;
            const isMajor = i % 2 === 0;
            const isDec = i % 6 === 0;
            const inner = isDec ? 66 : isMajor ? 72 : 75;
            const x1 = Math.cos(theta) * 80;
            const y1 = -Math.sin(theta) * 80;
            const x2 = Math.cos(theta) * inner;
            const y2 = -Math.sin(theta) * inner;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="var(--ln)" opacity={isMajor ? 0.9 : 0.4} />;
          })}
        </g>

        {/* Cursor Indicator Arm */}
        <g data-part="2">
          <line
            x1="0"
            y1="0"
            x2={armX}
            y2={armY}
            stroke="var(--acc)"
            strokeWidth="calc(var(--ln) * 2)"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="4" fill="var(--acc)" />
        </g>
      </svg>

      <div data-part="3" className="flex items-baseline gap-1">
        <span className="text-[28px] font-bold leading-none">{Math.round(ang)}</span>
        <span className="text-[12px] opacity-60">DEG °</span>
      </div>
    </div>
  );
}

// @plate file-dropzone
export function FileDropzone(p: DemoProps) {
  const a = useAct(p, 2000);
  const [isOver, setIsOver] = useState(false);
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);

  const triggerUpload = () => {
    setFile((prev) =>
      prev ? null : { name: "NEG_EXP_042.DNG", size: "38.4 MB" }
    );
  };

  const activeFile = a.sig
    ? { name: "ARCHIVE_PLATE.TIFF", size: "48.1 MB" }
    : file;

  return (
    <div
      {...a.bind}
      role="button"
      tabIndex={0}
      onClick={triggerUpload}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && triggerUpload()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const f = e.dataTransfer.files[0];
        if (f) {
          setFile({ name: f.name.toUpperCase(), size: `${(f.size / 1024 / 1024).toFixed(1)} MB` });
        }
      }}
      aria-label="Upload negative plate file"
      className="relative flex w-[230px] flex-col items-center justify-center gap-2 border p-4 text-center font-mono select-none focus:outline-none"
      style={{
        ...bw,
        borderStyle: "dashed",
        borderColor: isOver ? "var(--acc)" : "var(--ink)",
        background: isOver ? "var(--plate)" : "transparent",
      }}
    >
      {/* Light Table Crop Corners */}
      <span className="pointer-events-none absolute -top-1 -left-1 size-2 border-t-2 border-l-2 border-ink" />
      <span className="pointer-events-none absolute -top-1 -right-1 size-2 border-t-2 border-r-2 border-ink" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 size-2 border-b-2 border-l-2 border-ink" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 size-2 border-b-2 border-r-2 border-ink" />

      <div data-part="1" className="text-[12px] font-bold tracking-tight">
        {String(p.v.label || "DROP FILM NEGATIVE")}
      </div>

      <div data-part="2" className="text-[10px] opacity-60">
        {String(p.v.hint || "RAW, TIFF, DNG UP TO 50 MB")}
      </div>

      {activeFile && (
        <div data-part="3" className="mt-2 flex w-full flex-col border border-ink bg-paper p-2 text-left text-[11px]" style={bw}>
          <span className="truncate font-bold text-[var(--acc)]">{activeFile.name}</span>
          <span className="text-[9px] opacity-60">{activeFile.size} · READY TO DEVELOP</span>
        </div>
      )}
    </div>
  );
}

// @plate shortcut-recorder
export function ShortcutRecorder(p: DemoProps) {
  const a = useAct(p, 2000);
  const [recording, setRecording] = useState(false);
  const [keys, setKeys] = useState<string[]>(["⇧", "⌘", "P"]);

  useEffect(() => {
    if (!recording) return;
    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      const pressed: string[] = [];
      if (e.shiftKey) pressed.push("⇧");
      if (e.ctrlKey) pressed.push("⌃");
      if (e.altKey) pressed.push("⌥");
      if (e.metaKey) pressed.push("⌘");
      if (!["Shift", "Control", "Alt", "Meta"].includes(e.key)) {
        pressed.push(e.key.toUpperCase());
        setKeys(pressed);
        setRecording(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [recording]);

  const activeKeys = a.sig ? ["⌥", "⌘", "S"] : keys;

  return (
    <div {...a.bind} dir="ltr" className="flex flex-col items-center gap-2 font-mono select-none">
      <div className="text-[10px] font-bold tracking-wider opacity-60">
        {String(p.v.label || "COMMAND PALETTE")}
      </div>

      <button
        type="button"
        onClick={() => setRecording((r) => !r)}
        data-part="1"
        aria-label="Record keyboard shortcut"
        className="flex items-center gap-1.5 border border-ink bg-plate p-2 focus:outline-none"
        style={{
          ...bw,
          borderColor: recording ? "var(--acc)" : "var(--ink)",
        }}
      >
        {activeKeys.map((k, i) => (
          <span
            key={i}
            className="grid size-8 place-items-center border border-ink bg-paper text-[13px] font-bold shadow-[0_2px_0_var(--ink)]"
            style={bw}
          >
            {k}
          </span>
        ))}
      </button>

      <div data-part="2" className="text-[10px] tracking-widest" style={{ color: recording ? "var(--acc)" : "inherit" }}>
        {recording ? "● RECORDING KEYSTROKE…" : "PRESS TO REBIND"}
      </div>
    </div>
  );
}
