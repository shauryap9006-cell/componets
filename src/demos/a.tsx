"use client";
import { useEffect, useState } from "react";
import { useAct } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;

// @plate perforated-tear
export function PerforatedTear(p: DemoProps) {
  const a = useAct(p, 2200);
  const [torn, setTorn] = useState(false);
  const gone = torn || a.sig || p.moment === "done";
  const teeth = Number(p.v.teeth);

  if (p.v.style === "Ticket") {
    const venue = String(p.v.venue ?? "HALL B · ROW 07");
    const after = String(p.v.after ?? "Admitted");
    const label = String(p.v.label ?? "Admit one");
    return (
      <button {...a.bind} onClick={() => setTorn((t) => !t)} aria-pressed={gone} aria-label={`${label}. Tear stub to confirm.`} className="relative flex h-[88px] items-stretch text-left">
        <span data-part="1" className="flex w-48 flex-col justify-between border border-r-0 border-ink p-3" style={bw}>
          <span className="m soft truncate text-[10px]">{venue}</span>
          <span data-part="2" className="max-w-full truncate text-[18px] font-semibold tracking-tight">{gone ? after : label}</span>
          <span className="m soft text-[10px]">№ 004021 · ADMIT 1</span>
        </span>
        <span data-part="3" className="flex flex-col justify-between py-[4px]" aria-hidden>
          {Array.from({ length: Math.max(4, teeth) }, (_, i) => <i key={i} className="block size-[3px] rounded-full bg-ink" style={{ opacity: gone ? 0.25 : 1 }} />)}
        </span>
        <span data-part="4" className="tr grid w-16 origin-bottom-left place-items-center border border-l-0 border-ink" style={{ ...bw, transitionDuration: d(480), transform: gone ? "translate(32px, 20px) rotate(14deg)" : a.over ? "translateX(4px)" : "none", opacity: gone ? 0 : 1, color: a.over ? "var(--acc)" : undefined }}>
          <span className="m text-[10px]" style={{ writingMode: "vertical-rl" }}>{gone ? "TORN" : `${String(p.v.stub ?? "TEAR")} →`}</span>
        </span>
      </button>
    );
  }

  return (
    <button {...a.bind} onClick={() => setTorn((t) => !t)} aria-pressed={gone} aria-label={`${p.v.label}. Tear to confirm.`} className="relative flex h-[72px] items-stretch text-left">
      <span data-part="1" className="flex w-44 flex-col justify-center border border-r-0 border-ink px-4" style={bw}>
        <span data-part="2" className="max-w-full truncate text-[17px] font-medium tracking-tight">{gone ? "Confirmed" : String(p.v.label)}</span>
        <span className="m soft">{gone ? "Stub removed" : "No. 0417 · admit 1"}</span>
      </span>
      <span data-part="3" className="flex flex-col justify-between py-[3px]" aria-hidden>
        {Array.from({ length: teeth }, (_, i) => <i key={i} className="block size-[3px] rounded-full bg-ink" style={{ opacity: gone ? 0.25 : 1 }} />)}
      </span>
      <span data-part="4" className="tr grid w-16 origin-bottom-left place-items-center border border-l-0 border-ink" style={{ ...bw, transitionDuration: d(480),
        transform: gone ? "translate(28px,-10px) rotate(14deg)" : a.over ? "rotate(4deg)" : "none", opacity: gone ? 0 : 1, color: a.over ? "var(--acc)" : undefined }}>
        <span className="m" style={{ writingMode: "vertical-rl" }}>{String(p.v.stub)} ↑</span>
      </span>
    </button>
  );
}

// @plate postmark
export function Postmark(p: DemoProps) {
  const a = useAct(p, 2200);
  const [sent, setSent] = useState(false);
  const on = sent || a.sig || p.moment === "done" || p.moment === "pressed";
  return (
    <button {...a.bind} onClick={() => setSent((s) => !s)} aria-pressed={on} className="flex items-center gap-5 text-left">
      <span className="relative block">
        <span data-part="1" className="grid size-[68px] place-items-center border border-dashed border-ink" style={{ borderWidth: "var(--ln)" }}>
          <span className="font-display text-[30px] font-extrabold leading-none" style={{ fontStretch: "75%" }}>12</span>
          <span className="m soft absolute bottom-[3px]" style={{ fontSize: 8 }}>Helvetia</span>
        </span>
        {on && (
          <svg data-part="2" key={String(on)} width="120" height="64" viewBox="0 0 120 64" className="pointer-events-none absolute -left-7 -top-3" style={{ color: "var(--acc)", rotate: `${p.v.angle}deg`, animation: p.reduced ? "fadeIn 120ms both" : `stampIn ${d(240)} var(--ez) both` }}>
            <circle cx="32" cy="32" r="26" className="ln" /><circle cx="32" cy="32" r="19" className="ln" />
            <text x="32" y="30" textAnchor="middle" className="m" fill="currentColor" style={{ fontSize: 7 }}>{String(p.v.city).slice(0, 10)}</text>
            <text x="32" y="40" textAnchor="middle" className="m" fill="currentColor" style={{ fontSize: 7 }}>04.VII</text>
            {[18, 26, 34, 42].map((y) => <path key={y} className="ln" d={`M62 ${y} q7 -5 14 0 t14 0 t14 0 t14 0`} />)}
          </svg>
        )}
      </span>
      <span>
        <span data-part="3" className="block text-[19px] font-medium tracking-tight">{on ? "Sent" : String(p.v.label)}</span>
        <span className="m soft block">{on ? "Cancelled · cannot be reused" : "Press to cancel the stamp"}</span>
      </span>
    </button>
  );
}

// @plate envelope-flap
export function EnvelopeFlap(p: DemoProps) {
  const a = useAct(p, 2600);
  const open = a.over;
  return (
    <div {...a.bind} tabIndex={0} role="group" aria-label={`${p.v.title}: ${p.v.note}`} className="relative h-[120px] w-[200px]" style={{ perspective: 600 }}>
      <div data-part="3" className="tr absolute inset-x-3 top-[42px] flex h-[72px] flex-col gap-1 border border-ink bg-plate p-2.5" style={{ ...bw, transitionDuration: d(480), transitionDelay: open ? d(160) : "0ms", transform: open ? `translateY(-${Math.round(Number(p.v.lift) * 0.9)}px)` : "none" }}>
        <span className="m" style={{ color: "var(--acc)" }}>{String(p.v.title)}</span>
        <span className="line-clamp-2 text-[13px] leading-tight">{String(p.v.note)}</span>
      </div>
      <div data-part="1" className="absolute inset-x-0 bottom-0 h-[84px] border border-ink bg-paper" style={bw}>
        <svg viewBox="0 0 200 84" preserveAspectRatio="none" className="absolute inset-0 size-full soft"><path className="ln" d="M0 84 L78 40 M200 84 L122 40" /></svg>
        <span className="m soft absolute bottom-2 left-3">{open ? "Opened" : "Sealed"} · 1 enclosure</span>
      </div>
      <div data-part="2" className="tr absolute inset-x-0 top-[36px] h-[48px] origin-top" style={{ transitionDuration: d(480), transform: open ? "rotateX(180deg)" : "none" }}>
        <svg viewBox="0 0 200 48" preserveAspectRatio="none" className="size-full"><path d="M0 0 L100 46 L200 0 Z" fill="var(--paper)" className="ln" stroke="currentColor" /></svg>
      </div>
    </div>
  );
}

// @plate arrow-relay
export function ArrowRelay(p: DemoProps) {
  const a = useAct(p, 1800);
  const g = String(p.v.glyph);
  const [x, y] = g === "→" ? [1, 0] : g === "↓" ? [0, 1] : [1, -1];
  const mv = (k: number) => `translate(${x * k * 110}%, ${y * k * 110}%)`;
  const busy = p.moment === "busy";
  return (
    <button {...a.bind} data-part="1" className="tr flex h-14 max-w-[260px] items-center gap-6 border border-ink pl-5 pr-4" style={{ ...bw, transitionDuration: "80ms", transform: a.down ? "translateY(1px)" : "none", background: a.down ? "var(--ink)" : "transparent", color: a.down ? "var(--paper)" : undefined }}>
      <span data-part="2" className="tr truncate text-[17px] font-medium tracking-tight" style={{ transform: a.over ? `translateX(${p.v.shift}px)` : "none" }}>{String(p.v.label)}</span>
      <span data-part="3" className="flip-rtl relative grid size-6 shrink-0 place-items-center overflow-hidden text-[20px] leading-none" aria-hidden>
        {busy ? <i className="block size-1 bg-current" style={{ animation: "sweep 0.9s linear infinite" }} /> : (
          <>
            <span data-part="4" className="tr absolute" style={{ transform: a.over ? mv(1) : "none", opacity: p.reduced && a.over ? 0 : 1 }}>{g}</span>
            <span data-part="5" className="tr absolute" style={{ transform: a.over ? "none" : mv(-1), transitionDelay: a.over ? "60ms" : "0ms", color: "var(--acc)" }}>{g}</span>
          </>
        )}
      </span>
    </button>
  );
}

// @plate split-flap
const ABC = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export function SplitFlap(p: DemoProps) {
  const a = useAct(p, 2600);
  const n = Number(p.v.cells);
  const words = String(p.v.words).toUpperCase().replace(/[^A-Z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  const [wi, setWi] = useState(0);
  const target = (words[wi % Math.max(1, words.length)] ?? "").padEnd(n).slice(0, n);
  const [cur, setCur] = useState(target);
  useEffect(() => { if (a.over) setWi((i) => i + 1); }, [a.over]);
  useEffect(() => {
    if (p.reduced) { setCur(target); return; }
    const t = setInterval(() => setCur((c) => {
      const s = c.padEnd(n).slice(0, n);
      if (s === target) { clearInterval(t); return s; }
      return s.split("").map((ch, i) => (ch === target[i] ? ch : ABC[(ABC.indexOf(ch) + 1) % ABC.length])).join("");
    }), 42);
    return () => clearInterval(t);
  }, [target, n, p.reduced]);
  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`Departure board: ${target.trim()}`} className="flex flex-col items-start gap-2">
      <span className="m soft flex w-full justify-between"><span>Gleis 7</span><span>{String(wi % Math.max(1, words.length) + 1).padStart(2, "0")}/{String(words.length).padStart(2, "0")}</span></span>
      <div data-part="1" className="flex gap-[3px]" dir="ltr">
        {cur.padEnd(n).slice(0, n).split("").map((ch, i) => (
          <span key={i} data-part={i === 0 ? "2" : undefined} className="relative grid h-11 w-8 place-items-center overflow-hidden border border-ink bg-plate" style={bw}>
            <span key={ch} className="roll font-display text-[24px] font-bold leading-none" style={{ animationDuration: "40ms" }}>{ch}</span>
            <i data-part={i === 0 ? "3" : undefined} className="absolute inset-x-0 top-1/2 bg-paper" style={{ height: "var(--ln)" }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// @plate ticket-punch
export function TicketPunch(p: DemoProps) {
  const a = useAct(p, 2000);
  const [on, setOn] = useState(false);
  const hit = on || a.sig || p.moment === "done";
  const sq = p.v.shape === "Square";
  return (
    <button {...a.bind} role="checkbox" aria-checked={hit} onClick={() => setOn((o) => !o)} data-part="1" className="relative flex h-16 w-[236px] items-center justify-between border border-ink pl-4 pr-3 text-left" style={bw}>
      <span className="min-w-0">
        <span data-part="2" className="block truncate text-[16px] font-medium tracking-tight">{String(p.v.label)}</span>
        <span className="m soft block">{hit ? "Punched · valid 90 min" : "Not yet valid"}</span>
      </span>
      <span data-part="3" className="tr relative grid size-9 shrink-0 place-items-center border border-dashed border-ink" style={{ borderWidth: "var(--ln)", borderRadius: sq ? 0 : 999, transform: a.down ? "scale(0.92)" : "none", borderStyle: hit ? "solid" : "dashed", background: hit ? "var(--ink)" : "transparent" }}>
        {!hit && <span className="m" style={{ opacity: a.over ? 1 : 0.4 }}>×</span>}
      </span>
      <i data-part="4" aria-hidden className="tr pointer-events-none absolute right-[18px] size-6" style={{ top: 20, borderRadius: sq ? 0 : 999, background: "var(--acc)", transitionDuration: d(640), opacity: hit && !p.reduced ? 0 : 0, transform: hit ? "translateY(46px) rotate(60deg)" : "none", animation: hit && !p.reduced ? `fadeIn ${d(640)} reverse both` : "none" }} />
    </button>
  );
}
