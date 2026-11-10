"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAct, useTick } from "@/kit/act";
import type { DemoProps } from "@/kit/spec";

const bw = { borderWidth: "var(--ln)", borderRadius: "var(--rad)" };
const d = (ms: number) => `calc(${ms}ms * var(--sp))`;
const list = (s: unknown, sep: RegExp = /\s+/) => String(s).split(sep).map((x) => x.trim()).filter(Boolean);

// @plate index-drawer
export function IndexDrawer(p: DemoProps) {
  const a = useAct(p, 2600);
  const tabs = list(p.v.tabs).slice(0, 5), n = tabs.length, rise = Number(p.v.rise);
  const [sel, setSel] = useState(0), [hov, setHov] = useState(-1);
  const t = useTick(560, a.sig);
  const cur = a.sig ? t % n : Math.min(sel, n - 1);
  const isCabinet = p.v.style === "Cabinet";
  return (
    <div {...a.bind} role="tablist" aria-label="Catalogue drawer" dir="ltr" className="relative h-[124px] w-[232px]"
      onKeyDown={(e) => { if (e.key === "ArrowRight") setSel((s) => (s + 1) % n); if (e.key === "ArrowLeft") setSel((s) => (s - 1 + n) % n); }}>
      {isCabinet && (
        <div className="pointer-events-none absolute -inset-2 rounded border border-ink opacity-30" style={{ borderWidth: "var(--ln)" }} />
      )}
      {tabs.map((tb, i) => {
        const up = cur === i ? rise + 6 : hov === i ? rise : 0;
        return (
          <div key={i} data-part={i === 0 ? "1" : undefined} className="tr absolute inset-x-0 h-[84px] border border-ink bg-plate" style={{ ...bw, top: 22 + i * 7, transform: `translateY(${-up}px)`, zIndex: i, transitionDelay: `${i * 24}ms` }}>
            <button role="tab" aria-selected={cur === i} tabIndex={cur === i ? 0 : -1} onClick={() => setSel(i)} onPointerEnter={() => setHov(i)} onPointerLeave={() => setHov(-1)} data-part={i === 0 ? "2" : undefined}
              className="m absolute -top-[19px] h-[19px] border border-b-0 border-ink px-2" style={{ borderWidth: "var(--ln) var(--ln) 0", left: `${(i / n) * 100}%`, width: `${100 / n}%`, background: cur === i ? "var(--ink)" : "var(--plate)", color: cur === i ? "var(--paper)" : undefined }}>
              <span className="block truncate">{tb}</span>
            </button>
            {cur === i && (
              <div data-part="3" className="m soft absolute inset-x-3 top-2 flex flex-col gap-0.5">
                <span className="flex justify-between"><span>Drawer {String(i + 1).padStart(2, "0")}</span><span>{(i + 2) * 112} cards</span></span>
                {isCabinet && <span className="font-mono text-[9px] opacity-75">DEWEY 025.43 · TRAY {String.fromCharCode(65 + i)}</span>}
              </div>
            )}
          </div>
        );
      })}
      <i className="absolute bottom-3 left-1/2 z-10 size-2 -translate-x-1/2 rounded-full border border-ink bg-paper" />
    </div>
  );
}

// @plate due-date-slip
export function DueDateSlip(p: DemoProps) {
  const a = useAct(p, 2000);
  const rows = Number(p.v.rows);
  const [stamps, setStamps] = useState<string[]>(["12 MAR", "02 APR"]);
  const add = () => setStamps((s) => {
    const dt = new Date(Date.now() + (s.length - 1) * 14 * 864e5);
    const next = `${String(dt.getDate()).padStart(2, "0")} ${dt.toLocaleString("en", { month: "short" }).toUpperCase()}`;
    return s.length >= rows ? ["12 MAR", next] : [...s, next];
  });
  useEffect(() => { if (a.sig) add(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [a.sig]);
  return (
    <button {...a.bind} onClick={add} aria-label={`${p.v.title}. Stamp the next date.`} data-part="1" className="w-[176px] border border-ink text-left" style={bw}>
      <span data-part="2" className="m flex justify-between border-b border-ink px-2 py-1.5" style={{ borderBottomWidth: "var(--ln)" }}><span>{String(p.v.title)}</span><span className="soft">No.</span></span>
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} className="flex h-7 items-center justify-between border-b border-dotted border-ink/40 px-2 last:border-b-0">
          {stamps[i] ? <span data-part={i === 0 ? "3" : undefined} key={stamps[i] + i} className="font-mono text-[15px] font-bold tracking-wider" style={{ rotate: `${((i * 7) % 5) - 2}deg`, opacity: i === stamps.length - 1 ? 1 : 0.45 + (i % 2) * 0.2, color: i === stamps.length - 1 ? "var(--acc)" : undefined, animation: p.reduced ? "none" : `stampIn ${d(240)} var(--ez) both` }}>{stamps[i]}</span> : <span className="m soft">·</span>}
          <span className="m soft">{String(i + 1).padStart(2, "0")}</span>
        </span>
      ))}
    </button>
  );
}

// @plate dotted-leader
export function DottedLeader(p: DemoProps) {
  const a = useAct(p, 2400);
  const items = list(p.v.items, /;/).slice(0, 5), gap = Number(p.v.gap);
  const [hov, setHov] = useState(-1);
  return (
    <ol {...a.bind} className="flex w-[240px] flex-col" aria-label="Contents">
      {items.length === 0 && <li className="m soft">No entries.</li>}
      {items.map((it, i) => (
        <li key={i}>
          <button onPointerEnter={() => setHov(i)} onPointerLeave={() => setHov(-1)} onFocus={() => setHov(i)} onBlur={() => setHov(-1)} className="flex h-8 w-full items-baseline gap-2 text-left">
            <span data-part={i === 0 ? "1" : undefined} className="max-w-[60%] truncate text-[16px] font-medium tracking-tight" style={{ color: hov === i ? "var(--acc)" : undefined }}>{it}</span>
            <span data-part={i === 0 ? "2" : undefined} className="tr h-[2px] flex-1 origin-left self-end -translate-y-[5px]" style={{ backgroundImage: hov === i ? "linear-gradient(currentColor,currentColor)" : `radial-gradient(circle, currentColor 1px, transparent 1.2px)`, backgroundSize: hov === i ? "100% 1px" : `${gap}px 2px`, backgroundRepeat: hov === i ? "no-repeat" : "repeat-x", backgroundPosition: "left center", transform: `translateY(-5px) scaleX(${a.sig || !p.play || p.reduced ? 1 : 1})`, clipPath: a.sig && !p.reduced ? undefined : "none", animation: a.sig && !p.reduced ? `rowIn ${d(640)} var(--ez) ${i * 90}ms both` : "none" }} />
            <span data-part={i === 0 ? "3" : undefined} className="font-mono text-[14px] tabular-nums">{String((i + 1) * 12 + i * i).padStart(3, "0")}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

// @plate elastic-rule
export function ElasticRule(p: DemoProps) {
  const a = useAct(p, 2600);
  const tabs = list(p.v.tabs).slice(0, 5), n = tabs.length;
  const [sel, setSel] = useState(0), [dir, setDir] = useState(1), [box, setBox] = useState({ l: 0, r: 0 });
  const refs = useRef<(HTMLButtonElement | null)[]>([]), wrap = useRef<HTMLDivElement>(null);
  const t = useTick(700, a.sig);
  const cur = a.sig ? t % n : Math.min(sel, n - 1);
  const prev = useRef(0);
  useLayoutEffect(() => {
    const el = refs.current[cur], w = wrap.current; if (!el || !w) return;
    setDir(cur >= prev.current ? 1 : -1); prev.current = cur;
    setBox({ l: el.offsetLeft, r: w.offsetWidth - el.offsetLeft - el.offsetWidth });
  }, [cur, n, p.v.tabs]);
  return (
    <div {...a.bind} ref={wrap} role="tablist" dir="ltr" className="relative flex border-b border-ink/30" style={{ borderBottomWidth: "var(--ln)" }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") setSel((s) => Math.min(n - 1, s + 1)); if (e.key === "ArrowLeft") setSel((s) => Math.max(0, s - 1)); }}>
      {tabs.map((tb, i) => (
        <button key={i} ref={(el) => { refs.current[i] = el; }} role="tab" aria-selected={cur === i} tabIndex={cur === i ? 0 : -1} onClick={() => setSel(i)} data-part={i === 0 ? "1" : undefined} className="flex h-12 items-baseline gap-2 px-4 pt-3">
          <span className="max-w-[90px] truncate text-[17px] font-medium tracking-tight" style={{ opacity: cur === i ? 1 : 0.55 }}>{tb}</span><span className="m soft">{String((i + 2) * 7).padStart(2, "0")}</span>
        </button>
      ))}
      <i data-part="2" className="absolute -bottom-px bg-ink" style={{ height: Number(p.v.bar), left: box.l, right: box.r, background: a.over ? "var(--acc)" : undefined,
        transition: p.reduced ? "none" : `left ${d(dir > 0 ? 480 : 200)} var(--ez), right ${d(dir > 0 ? 200 : 480)} var(--ez)` }} />
    </div>
  );
}

// @plate annunciator
export function Annunciator(p: DemoProps) {
  const a = useAct(p, 2400);
  const names = list(p.v.labels, /;/).slice(0, 6), seed = Number(p.v.seed);
  const [alarm, setAlarm] = useState(seed % 6), [ack, setAck] = useState(false);
  useEffect(() => { if (a.sig) { setAlarm((x) => (x + 1 + (seed % 4)) % Math.max(1, names.length)); setAck(false); } }, [a.sig, seed, names.length]);
  const acked = ack || p.moment === "done";
  return (
    <div {...a.bind} className="flex w-[232px] flex-col gap-2">
      <div data-part="1" className="grid grid-cols-3 border-l border-t border-ink" style={{ borderWidth: "var(--ln) 0 0 var(--ln)" }}>
        {names.map((nm, i) => {
          const hot = i === alarm % names.length;
          return (
            <button key={i} data-part={hot ? "2" : undefined} disabled={!hot} onClick={() => setAck(true)} aria-label={hot ? `${nm}: alarm. ${acked ? "Acknowledged" : "Press to acknowledge"}` : `${nm}: normal`}
              className={`m relative grid h-11 place-items-center border-b border-r border-ink px-1 disabled:opacity-100 ${hot && acked ? "hatch" : ""}`}
              style={{ borderWidth: "0 var(--ln) var(--ln) 0", background: hot && !acked ? "var(--acc)" : undefined, color: hot && !acked ? "var(--on-accent)" : hot ? undefined : "color-mix(in oklch, var(--ink) var(--soft), transparent)", animation: hot && !acked && !p.reduced ? "blink 1.2s steps(2) infinite" : "none" }}>
              <span className="truncate">{nm}</span>
            </button>
          );
        })}
      </div>
      <span data-part="3" className="m flex justify-between"><span className="soft">{acked ? "Acknowledged · logged" : "1 unacknowledged"}</span><span>{acked ? "ACK ✓" : "Press cell"}</span></span>
    </div>
  );
}

// @plate odometer
export function Odometer(p: DemoProps) {
  const a = useAct(p, 2400);
  const digits = Number(p.v.digits), step = Number(p.v.step);
  const [adds, setAdds] = useState(0);
  useEffect(() => { if (a.over) setAdds((x) => x + 1); }, [a.over]);
  const val = (Number(p.v.value) + adds * step) % 10 ** digits, s = String(val).padStart(digits, "0");
  return (
    <div {...a.bind} tabIndex={0} role="img" aria-label={`Counter reading ${val}`} className="flex flex-col items-start gap-2" dir="ltr">
      <div data-part="1" className="flex border border-ink" style={bw}>
        {s.split("").map((ch, i) => (
          <span key={i} data-part={i === digits - 1 ? "2" : undefined} className="relative block h-12 w-8 overflow-hidden border-r border-ink last:border-r-0" style={{ borderRightWidth: "var(--ln)", background: i === digits - 1 ? "var(--ink)" : undefined, color: i === digits - 1 ? "var(--paper)" : undefined }}>
            <span className="tr absolute inset-x-0 top-0 flex flex-col" style={{ transform: `translateY(-${Number(ch) * 48}px)`, transitionDuration: d(640), transitionDelay: `${(digits - 1 - i) * 24}ms` }}>
              {"0123456789".split("").map((n) => <span key={n} className="grid h-12 place-items-center font-mono text-[26px] font-bold">{n}</span>)}
            </span>
          </span>
        ))}
      </div>
      <span data-part="3" className="m flex w-full justify-between gap-4"><span className="soft">Trip · +{step} per pass</span><span>km</span></span>
    </div>
  );
}
