"use client";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { DEMOS } from "@/demos";
import { usePrefersReduced } from "./act";
import { type ComponentSpec, type Moment, type Val, type Values, FEELS, defaults, fig } from "./spec";

const noop = () => {};
/** The one renderer. Library plates and Bench objects both pass through here. */
export function Stage({ spec, values, moment = "rest", play = 0, onSet = noop, k = 1, bench = false, yours = false }: {
  spec: ComponentSpec; values?: Values; moment?: Moment; play?: number; onSet?: (k: string, v: Val) => void; k?: number; bench?: boolean; yours?: boolean;
}) {
  const v = useMemo(() => ({ ...defaults(spec), ...(values ?? {}) }), [spec, values]);
  const sys = usePrefersReduced();
  const reduced = sys || !!v.calm;
  const feel = FEELS[String(v.feel)] ?? FEELS.Precise;
  const Demo = DEMOS[spec.id];
  const outer = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);
  const base = Number(v.size) * k;
  // Never overflow the plate: if the object is wider or taller than its stage, it scales down to fit.
  useEffect(() => {
    const o = outer.current, i = inner.current; if (!o || !i) return;
    const measure = () => {
      const w = i.offsetWidth * base, h = i.offsetHeight * base; if (!w || !h || !o.clientWidth) return;
      setFit(Math.min(1, (o.clientWidth - 8) / w, o.clientHeight > 40 ? (o.clientHeight - 8) / h : 1));
    };
    const ro = new ResizeObserver(measure); ro.observe(o); ro.observe(i); measure();
    return () => ro.disconnect();
  }, [base, spec.id]);
  const style = {
    "--ln": `${v.line}px`, "--sp": String(feel.mul / Math.max(0.1, Number(v.speed))), "--ez": feel.ease,
    "--acc": v.accent ? "var(--accent)" : "var(--ink)", "--rad": `${v.corners}px`, "--soft": `${v.soft}%`, "--cap": `${v.cap}px`, "--trk": `${v.trk}em`,
  } as CSSProperties;
  return (
    <div ref={outer} className={`stage ${bench ? "bench-stage" : ""}`} data-moment={moment} data-reduced={reduced ? 1 : undefined} data-press={v.pressDrop ? 1 : undefined} style={style}>
      <div ref={inner} className="stage-in" dir={v.rtl ? "rtl" : "ltr"} style={{ scale: String(Number((base * fit).toFixed(3))), transition: "scale 240ms var(--expo), opacity 240ms" }}>
        {Demo ? <Demo v={v} moment={moment} play={play} reduced={reduced} set={onSet} /> : null}
      </div>
      {moment === "busy" && (
        <>
          <span className="m soft absolute right-0 top-0">Busy…</span>
          <span className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden" aria-hidden>
            <i className="block h-full w-1/5" style={{ background: "var(--acc)", animation: "sweep 1.2s linear infinite" }} />
          </span>
        </>
      )}
      {moment === "done" && <span className="m absolute right-0 top-0 border px-1.5 py-0.5" style={{ animation: "stampIn 240ms var(--expo) both", rotate: "-2deg", borderWidth: "var(--ln)" }}>Done ✓</span>}
      {moment === "problem" && (
        <>
          <span className="hatch-acc pointer-events-none absolute inset-x-0 bottom-0 h-2" aria-hidden />
          <span className="m absolute right-0 top-0 bg-accent px-1.5 py-0.5 text-onaccent">Problem · try again</span>
        </>
      )}
      {v.readout && <span className="m soft absolute bottom-0 left-0">{fig(spec.fig, yours ? "Y-" : "")} · {spec.verb}</span>}
      {v.hint && <span className="m soft absolute bottom-0 right-0 flex items-center gap-1.5"><span className="key">R</span>replay</span>}
    </div>
  );
}
