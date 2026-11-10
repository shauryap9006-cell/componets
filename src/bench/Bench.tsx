"use client";
import { useSearchParams } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useDirector } from "@/director/Director";
import { CATALOG, ROOMS, byId, nearest, search } from "@/kit/catalog";
import { press } from "@/kit/act";
import { Dial } from "@/kit/Dial";
import { Stage } from "@/kit/Stage";
import { type ComponentSpec, type DetailClass, type Moment, type Val, type Values, ADDON_FOR, clampPatch, defaults, describeChange, fig, health, instant } from "@/kit/spec";
import { type Yours, getYours, keep } from "@/kit/yours";
import { site, type ThemeKey } from "@/site.config";
import { CraftList, CraftRing, Loupe, MOVE, MomentStrip, SKIN, StressSheet, type Take, TakeSheet, TakesShelf, WORLD_STYLE, pickKeys } from "./parts";

interface Frame { values: Values; note: string }
type SheetKey = null | "take" | "all" | "borrow" | "craft" | "health";
const typing = (e: KeyboardEvent) => !!(e.target as HTMLElement).closest("input,textarea,select,[contenteditable]");

async function lookFromImage(file: Blob): Promise<{ theme: ThemeKey; patch: Values; say: string }> {
  const bmp = await createImageBitmap(file), c = document.createElement("canvas"); c.width = c.height = 24;
  const x = c.getContext("2d")!; x.drawImage(bmp, 0, 0, 24, 24); const d = x.getImageData(0, 0, 24, 24).data;
  let r = 0, g = 0, b = 0, lo = 255, hi = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; const l = (d[i] + d[i + 1] + d[i + 2]) / 3; lo = Math.min(lo, l); hi = Math.max(hi, l); }
  const n = d.length / 4; r /= n; g /= n; b /= n; const L = (r + g + b) / 765, sat = (Math.max(r, g, b) - Math.min(r, g, b)) / 255, strong = (hi - lo) / 255 > 0.7;
  const theme: ThemeKey = L < 0.3 ? (b > r * 1.2 ? "blueprint" : "ink") : sat < 0.05 ? (L > 0.85 ? "bauhaus" : "concrete") : L > 0.8 ? "paper" : "newsprint";
  return { theme, patch: { line: strong ? 2 : 1, soft: strong ? 85 : 60, accent: sat > 0.08, feel: strong ? "Heavy" : "Smooth" }, say: `Read as ${theme}: ${strong ? "strong" : "soft"} contrast, ${sat > 0.08 ? "one colour" : "no colour"}.` };
}
const Sheet = ({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) => (
  <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={title}><button className="absolute inset-0 bg-ink/20" aria-label="Close" onClick={onClose} />
    <div className="sheet-in absolute inset-y-0 right-0 flex w-full max-w-[1100px] flex-col overflow-y-auto border-l border-ink bg-paper"><div className="cap sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between border-b border-ink/30 bg-paper px-6"><span>{title}</span><button onClick={onClose} className="flex items-center gap-2"><span className="key">Esc</span>Close</button></div><div className="p-6">{children}</div></div></div>
);
const Mini = ({ spec, values }: { spec: ComponentSpec; values?: Values }) => <span inert className="pointer-events-none relative block h-[120px] overflow-hidden bg-plate"><span className="absolute left-1/2 top-1/2 block h-[220px] w-[320px] -translate-x-1/2 -translate-y-1/2 scale-[0.6]"><Stage spec={spec} values={values} /></span></span>;

export function Bench() {
  const sp = useSearchParams(), { foley, setTheme } = useDirector();
  const [spec, setSpec] = useState<ComponentSpec | null>(null), [id, setId] = useState(""), [name, setName] = useState("");
  const [hist, setHist] = useState<Frame[]>([]), [hi, setHi] = useState(0), [peek, setPeek] = useState<Values | null>(null);
  const [sel, setSel] = useState<number | null>(null), [moment, setMoment] = useState<Moment>("rest"), [takes, setTakes] = useState<Take[] | null>(null);
  const [sheet, setSheet] = useState<SheetKey>(null), [compare, setCompare] = useState(false), [play, setPlay] = useState(0), [say, setSay] = useState(""), [chips, setChips] = useState(false);
  const [busy, setBusy] = useState(false), [fixed, setFixed] = useState(0), [note, setNote] = useState(""), [pins, setPins] = useState<{ n: number; x: number; y: number }[]>([]), [filter, setFilter] = useState("");
  const [door, setDoor] = useState<{ q: string; picks: ComponentSpec[]; ask?: boolean; card?: string; look?: Values; msg?: string } | null>(null), [reel, setReel] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null), item = useRef<Yours | null>(null);

  const start = useCallback((s: ComponentSpec, init: Values = {}, y?: Yours) => {
    setSpec(s); setId(y?.id ?? `y${Date.now().toString(36)}`); setName(y?.name ?? `My ${s.name}`); setHist([{ values: { ...defaults(s), ...init }, note: "Start" }]); setHi(0);
    setSel(null); setTakes(null); setMoment("rest"); setNote(""); setSheet(null); foley("thunk");
  }, [foley]);
  useEffect(() => { const y = sp.get("yours") && getYours(sp.get("yours")!), f = sp.get("from") && byId(sp.get("from")!); if (y && byId(y.base)) start(byId(y.base)!, y.values, y); else if (f) start(f); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const values = useMemo(() => hist[hi]?.values ?? {}, [hist, hi]);
  const shown = compare ? hist[0]?.values : peek ? { ...values, ...peek } : values;
  const commit = useCallback((patch: Values, label?: string) => {
    if (!spec) return; const clean = clampPatch(spec, patch, true), keys = Object.keys(clean).filter((k) => clean[k] !== values[k]); if (!keys.length) { setPeek(null); return; }
    const text = label ?? (keys.length === 1 ? describeChange(spec, keys[0], values[keys[0]], clean[keys[0]]) : `${keys.length} SETTINGS CHANGED`);
    setHist((h) => [...h.slice(0, hi + 1), { values: { ...values, ...clean }, note: text }]); setHi(hi + 1); setPeek(null); setNote(text); foley("tick");
  }, [spec, values, hi, foley]);
  const undo = () => { setHi((i) => Math.max(0, i - 1)); setNote(""); }, redo = () => setHi((i) => Math.min(hist.length - 1, i + 1));
  useEffect(() => { if (spec && (hist.length > 1 || item.current?.id === id)) item.current = keep({ id, base: spec.id, name: name || `My ${spec.name}`, values }); }, [spec, id, name, values, hist.length]);

  // pins sit on the object's numbered parts
  useLayoutEffect(() => {
    if (!spec) return; const measure = () => { const root = stageRef.current; if (!root) return; const rb = root.getBoundingClientRect(); const seen = new Set<string>();
      setPins(Array.from(root.querySelectorAll<HTMLElement>("[data-part]")).filter((el) => !seen.has(el.dataset.part!) && seen.add(el.dataset.part!)).map((el) => { const b = el.getBoundingClientRect(); return { n: Number(el.dataset.part), x: b.left - rb.left, y: b.top - rb.top }; }).sort((a, b) => a.n - b.n)); };
    const r = requestAnimationFrame(measure), t = setTimeout(measure, 520); window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(r); clearTimeout(t); window.removeEventListener("resize", measure); };
  }, [spec, shown, moment, sel]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (typing(e)) return;
      if (!spec) { if (e.key === "d" || e.key === "D") deal(); return; }
      if (e.key === "\\") setCompare(true); else if (e.key === "Escape") { if (sheet) setSheet(null); else if (takes) { setTakes(null); setPeek(null); } else setSel(null); }
      else if (e.key === "b" || e.key === "B") setSheet("borrow"); else if (e.key === "r" || e.key === "R") setPlay((p) => p + 1); else if (e.key === "j" || e.key === "J") journey();
      else if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
    };
    const up = (e: KeyboardEvent) => e.key === "\\" && setCompare(false);
    window.addEventListener("keydown", down); window.addEventListener("keyup", up); return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  });
  const journey = () => (["rest", "over", "pressed", "busy", "done", "rest"] as Moment[]).forEach((m, i) => setTimeout(() => setMoment(m), i * 900));
  const deal = () => { const s = CATALOG[Math.floor(Math.random() * CATALOG.length)], card = site.bench.deck[Math.floor(Math.random() * site.bench.deck.length)]; setDoor({ q: "", picks: [s], card }); foley("paper"); };
  const ask = (q: string) => { const t = q.trim(); if (!t) return; const hits = search(t); setDoor({ q: t, picks: nearest(t, 3), ask: hits.length === 0 && t.split(/\s+/).length < 3 }); foley("paper"); };
  const picture = async (f?: Blob | null) => { if (!f) return; try { const look = await lookFromImage(f); setTheme(look.theme); if (spec) { setTakes([{ name: "From the picture", why: look.say, patch: look.patch }, { name: "Picture · quieter", why: "The same look with fainter ink.", patch: { ...look.patch, soft: 55, line: 1 } }, { name: "Picture · movement only", why: "Only the feel is borrowed.", patch: { feel: look.patch.feel } }]); setSheet(null); } else setDoor({ q: "", picks: nearest(look.say, 3), look: look.patch, msg: look.say }); } catch { setDoor({ q: "", picks: nearest("picture", 3), msg: "That picture could not be read. Here are three starts." }); } };

  const scope = spec && sel ? spec.parts.find((p) => p.n === sel) : undefined;
  const submit = async (text: string) => {
    if (!spec || !text.trim()) return; setSay(""); setChips(false);
    if (/journey/i.test(text)) return journey(); if (/style/i.test(text)) { try { const st = JSON.parse(localStorage.getItem("hl-style") || "null"); if (st) return setTakes([{ name: "My style", why: "Your saved style set, applied here.", patch: st }]); } catch {} }
    const a = instant(spec, values, text);
    if (a && /6|ideas/i.test(text) === false) { const b = instant(spec, { ...values, ...a.patch }, text), first = Object.keys(a.patch)[0];
      return setTakes([a, ...(b ? [{ name: `${a.name} · more`, why: "The same change, taken further.", patch: { ...a.patch, ...b.patch } }] : []), ...(Object.keys(a.patch).length > 1 ? [{ name: `${a.name} · least`, why: "Only the first setting moves.", patch: { [first]: a.patch[first] } }] : [])]); }
    setBusy(true); let got: Take[] = [];
    try { const r = await fetch("/api/takes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ specId: spec.id, values, say: text, part: scope ? `${scope.n} · ${scope.name}` : "" }) }); got = (await r.json()).takes ?? []; } catch {}
    if (!got.length) { const want = /6|ideas/i.test(text) ? 6 : 3, seen = new Set<string>(); got = nearest(text, CATALOG.length).filter((s) => !seen.has(s.world) && !!seen.add(s.world)).slice(0, want).map((s) => ({ name: `Like ${ROOMS.find((r) => r.world === s.world)?.title ?? s.world}`, why: `Nearest in the library: ${s.name}. Borrows the look and movement of its room.`, patch: pickKeys(WORLD_STYLE[s.world], [...SKIN, ...MOVE]) })); }
    if (scope) got = got.map((t) => { const p = pickKeys(t.patch, scope.loupe); return Object.keys(p).length ? { ...t, patch: p } : t; });
    setBusy(false); setTakes(got);
  };
  const propose = (c: DetailClass) => { setSheet(null); setTakes(ADDON_FOR[c].map((a) => ({ name: a.name, why: a.why, patch: { [a.key]: true } }))); };
  const take = () => { if (!spec) return; const fixes = health(spec, values), patch = Object.assign({}, ...fixes.map((f) => f.fix)) as Values; setFixed(fixes.length); if (fixes.length) commit(patch, `FIXED ${fixes.length} ${fixes.length === 1 ? "THING" : "THINGS"}`); item.current = keep({ id, base: spec.id, name: name || `My ${spec.name}`, values: { ...values, ...patch } }); setSheet("take"); foley("stamp"); };

  /* ───────── THE DOORWAY ───────── */
  if (!spec) return (
    <div className="wrap pb-16 pt-12" onPaste={(e) => picture(Array.from(e.clipboardData.files)[0])} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); picture(e.dataTransfer.files[0]); }}>
      <span className="cap">The Bench · no account · kept in this browser</span>
      <form onSubmit={(e) => { e.preventDefault(); ask(say); }} className="mt-4 flex items-end gap-4 border-b border-ink pb-3"><input autoFocus value={say} onChange={(e) => setSay(e.target.value)} placeholder={site.bench.ask} aria-label={site.bench.ask} className="min-w-0 flex-1 bg-transparent text-[clamp(28px,5.5vw,84px)] font-medium leading-none tracking-tight outline-none placeholder:text-ink/35" /><button className="btn btn-p shrink-0">Make →</button></form>
      <div className="flex flex-wrap gap-2 pt-4">{site.bench.examples.map((x) => <button key={x} className="chip !normal-case" onClick={() => { setSay(x); ask(x); }}>{x}</button>)}</div>
      {door && (
        <section className="mt-10" aria-live="polite">
          {door.card && <div className="print-in mb-6 inline-flex max-w-full flex-col gap-3 border border-ink p-5"><span className="cap">Constraint · drawn with <span className="key">D</span></span><span className="text-[32px] font-medium leading-9 tracking-tight">{door.card}</span></div>}
          {door.msg && <p className="cap mb-4">{door.msg}</p>}
          {door.ask && <div className="mb-6"><p className="pb-3 text-[22px] font-medium tracking-tight">What kind of thing is it?</p><div className="flex flex-wrap gap-2">{["a button", "a switch", "a slider", "a counter", "a loading moment", "a card", "a heading"].map((k) => <button key={k} className="chip" onClick={() => ask(`${door.q} ${k}`)}>{k}</button>)}</div></div>}
          <span className="cap">{door.card ? "Your start" : `Takes${door.q ? ` for “${door.q}”` : ""} · press one to lift it onto the bench`}</span>
          <div className="mt-3 grid gap-[var(--gutter)] sm:grid-cols-3">{door.picks.map((s, i) => <div key={s.id} role="button" tabIndex={0} onClick={() => start(s, door.look)} onKeyDown={press(() => start(s, door.look))} className="print-in cursor-pointer border border-ink/40 text-left hover:border-ink" style={{ animationDelay: `${i * 120}ms` }}><Mini spec={s} values={door.look} /><span className="flex items-baseline justify-between gap-3 border-t border-ink/30 px-3 py-2"><span className="truncate text-[19px] font-medium tracking-tight">{s.name}</span><span className="cap-s">{fig(s.fig)}</span></span><span className="block px-3 pb-3 text-[15px] text-ink/70">{s.description}</span></div>)}</div>
        </section>
      )}
      <div className="mt-12 grid gap-px border border-ink bg-ink sm:grid-cols-3">
        {site.bench.doors.map((d, i) => <label key={d.key} className="flex min-h-32 cursor-pointer flex-col justify-between bg-paper p-5 hover:bg-plate focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-accent"><span className="cap">Door {String(i + 1).padStart(2, "0")}</span><span><span className="block text-[28px] font-medium leading-8 tracking-tight">{d.title}</span><span className="text-[16px] text-ink/70">{d.note}</span></span>
          {d.key === "picture" ? <input type="file" accept="image/*" className="sr-only" onChange={(e) => picture(e.target.files?.[0])} /> : <button className="sr-only" onClick={() => (d.key === "pick" ? setReel((r) => !r) : deal())}>{d.title}</button>}</label>)}
      </div>
      {reel && <div className="up-in noscroll mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="All plates">{CATALOG.map((s) => <div key={s.id} role="button" tabIndex={0} onClick={() => start(s)} onKeyDown={press(() => start(s))} className="w-[200px] shrink-0 cursor-pointer border border-ink/40 text-left hover:border-ink"><Mini spec={s} /><span className="cap block truncate border-t border-ink/30 px-2 py-2">{String(s.fig).padStart(3, "0")} {s.name}</span></div>)}</div>}
      <div className="mt-12 border-t border-ink/30 pt-4"><span className="cap">Recipes</span><div className="flex flex-wrap gap-2 pt-3">{site.bench.recipes.map((r) => <button key={r} className="chip !normal-case" onClick={() => { setSay(r); ask(r); }}>{r}</button>)}</div></div>
    </div>
  );

  /* ───────── THE BENCH ───────── */
  const issues = health(spec, values), dot = issues.some((i) => i.level === "red") ? "var(--accent)" : issues.length ? "color-mix(in oklch, var(--ink) 50%, transparent)" : "var(--ink)";
  const groups = Array.from(new Set(spec.settings.map((s) => s.group)));
  return (
    <div className="flex h-[calc(100dvh-49px)] min-h-[560px] flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-ink/30 px-4 sm:gap-5">
        <input value={name} onChange={(e) => setName(e.target.value.slice(0, 40))} aria-label="Name" className="h-10 min-w-0 flex-1 border-b border-ink/40 bg-transparent text-[20px] font-medium tracking-tight outline-none focus:border-accent sm:max-w-[280px]" />
        <button onClick={() => setSheet("craft")} aria-label="Craft: kinds of detail" title="Craft ring" className="grid size-10 shrink-0 place-items-center"><CraftRing spec={spec} values={values} /></button>
        <button onClick={() => setSheet("health")} aria-label={issues.length ? `Check: ${issues.length} things to look at` : "Check: all good"} className="grid size-10 shrink-0 place-items-center"><i className="block size-3 rounded-full" style={{ background: dot, outline: "1px solid var(--ink)", outlineOffset: 2 }} /></button>
        <button onClick={undo} disabled={hi === 0} aria-label="Undo" className="hidden text-[20px] sm:block">↶</button><button onClick={redo} disabled={hi >= hist.length - 1} aria-label="Redo" className="hidden text-[20px] sm:block">↷</button>
        <label className="relative hidden h-10 min-w-0 flex-1 items-center gap-[5px] overflow-hidden md:flex" title={hist[hi]?.note}>{hist.map((f, i) => <i key={i} className="block w-px shrink-0" style={{ height: i === hi ? 24 : 12, background: i === hi ? "var(--accent)" : "var(--ink)", opacity: i > hi ? 0.3 : 1, width: i === hi ? 3 : 1 }} />)}<span className="cap-s ml-2 truncate opacity-60">Reel · {String(hi + 1).padStart(2, "0")}/{String(hist.length).padStart(2, "0")}</span>
          <input type="range" min={0} max={Math.max(0, hist.length - 1)} value={hi} onChange={(e) => setHi(Number(e.target.value))} aria-label="The Reel: travel through changes" aria-valuetext={hist[hi]?.note} className="absolute inset-0 w-full cursor-ew-resize opacity-0" /></label>
        <button onClick={take} className="btn btn-p ml-auto shrink-0 !h-10">{site.bench.take}</button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden" style={{ backgroundImage: "linear-gradient(to right, color-mix(in oklch, var(--ink) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--ink) 7%, transparent) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
        <div ref={stageRef} className="absolute inset-0 p-10" onClick={(e) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-part]"); if (el) setSel(Number(el.dataset.part)); }} onDoubleClick={() => setPlay((p) => p + 1)}>
          <Stage spec={spec} values={shown} moment={moment} play={play} bench yours k={1.4} onSet={(k, v) => commit({ [k]: v })} />
          {pins.map((p) => { const part = spec.parts.find((x) => x.n === p.n); return part ? <button key={p.n} onClick={(e) => { e.stopPropagation(); setSel(sel === p.n ? null : p.n); }} aria-label={`Part ${p.n}: ${part.name}`} aria-pressed={sel === p.n} title={`${p.n} · ${part.name}`} className="cap-s absolute grid size-5 -translate-x-full -translate-y-full place-items-center rounded-full border border-ink" style={{ left: p.x, top: p.y, background: sel === p.n ? "var(--accent)" : "var(--paper)", color: sel === p.n ? "var(--on-accent)" : undefined, borderColor: sel === p.n ? "var(--accent)" : undefined }}>{p.n}</button> : null; })}
        </div>
        {compare && <span className="cap absolute left-4 top-3 bg-ink px-2 py-1 text-paper">Before</span>}
        {scope && <div className="fixed inset-x-0 bottom-0 z-40 max-h-[45dvh] sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-4 sm:max-h-[calc(100%-64px)] flex"><Loupe spec={spec} part={scope.n} values={values} onPeek={setPeek} onCommit={(k, v: Val) => commit({ [k]: v })} onAll={() => setSheet("all")} onClose={() => setSel(null)} /></div>}
        <div className="absolute inset-x-4 bottom-2 flex flex-wrap items-end justify-between gap-2">
          <span className="cap min-h-4" aria-live="polite">{note && <>{note} · <button className="underline" onClick={undo}>Undo</button></>}{!note && !sel && <span className="opacity-60">Press a numbered part to change it.</span>}</span>
          <span className="flex gap-1"><button className="chip bg-paper" onClick={() => setSheet("borrow")}>Borrow <span className="key !h-4 !min-w-4 !text-[9px]">B</span></button><button className="chip bg-paper" aria-pressed={!!values.calm} onPointerEnter={() => setPeek({ calm: !values.calm })} onPointerLeave={() => setPeek(null)} onClick={() => commit({ calm: !values.calm })}>Less movement</button><button className="chip bg-paper" onPointerDown={() => setCompare(true)} onPointerUp={() => setCompare(false)} onPointerLeave={() => setCompare(false)} onKeyDown={(e) => e.key === "Enter" && setCompare(true)} onKeyUp={() => setCompare(false)}>Compare <span className="key !h-4 !min-w-4 !text-[9px]">\</span></button></span>
        </div>
      </div>

      {takes && <TakesShelf spec={spec} values={values} takes={takes} onPeek={setPeek} onPick={(t) => { commit(t.patch, t.name.toUpperCase()); setTakes(null); }} onClose={() => { setTakes(null); setPeek(null); }} onMore={takes.length < 6 ? () => setTakes((t) => [...(t ?? []), ...(t ?? []).map((x) => { const again = clampPatch(spec, Object.fromEntries(Object.entries(x.patch).map(([k, v]) => [k, typeof v === "number" ? v + (v - Number(values[k])) : v]))); return { ...x, name: `${x.name} · further`, patch: again }; })].slice(0, 6)) : undefined} />}
      <div className="shrink-0 border-t border-ink/30"><MomentStrip spec={spec} values={values} moment={moment} onMoment={setMoment} /></div>
      {chips && <div className="up-in noscroll flex shrink-0 gap-2 overflow-x-auto border-t border-ink/30 px-4 py-2" onPointerLeave={() => setPeek(null)}>{[...site.bench.verbs, "Add a shortcut hint", "Add a pressed look", "Show a reading", "Play the journey", ...site.bench.extras].map((v) => { const t = instant(spec, values, v); return <button key={v} className="chip" onPointerDown={(e) => e.preventDefault()} onPointerEnter={() => t && setPeek(t.patch)} onFocus={() => t && setPeek(t.patch)} onClick={() => submit(v)}>{v}</button>; })}</div>}
      <form onSubmit={(e) => { e.preventDefault(); submit(say); }} className="flex h-16 shrink-0 items-center gap-3 border-t border-ink px-4">
        {scope && <span className="chip shrink-0 !border-accent">Applies to: {scope.n} · {scope.name}<button type="button" aria-label="Apply to the whole detail" onClick={() => setSel(null)}>✕</button></span>}
        <input value={say} onChange={(e) => setSay(e.target.value)} onFocus={() => setChips(true)} onBlur={() => setTimeout(() => setChips(false), 150)} placeholder={busy ? "Thinking…" : site.bench.say} aria-label="Say what to change" className="h-full min-w-0 flex-1 bg-transparent text-[18px] outline-none placeholder:text-ink/45" />
        <span className="key hidden sm:grid">↵</span>
      </form>

      {sheet === "take" && item.current && <Sheet title={`Take · ${fig(item.current.n, "Y-")}`} onClose={() => setSheet(null)}><TakeSheet spec={spec} item={item.current} values={values} fixed={fixed} /></Sheet>}
      {sheet === "craft" && <Sheet title="Craft · five kinds of detail" onClose={() => setSheet(null)}><CraftList spec={spec} values={values} onPropose={propose} /><ul className="mt-6 flex flex-col gap-2">{spec.details.map((d, i) => <li key={i} className="text-[16px] text-ink/75">({d.cls}) {d.text}</li>)}</ul></Sheet>}
      {sheet === "health" && <Sheet title="Check" onClose={() => setSheet(null)}>{issues.length === 0 && <p className="pb-6 text-[22px] font-medium tracking-tight">Nothing to fix. It reads, it reaches, it rests.</p>}<ul className="mb-8 flex flex-col">{issues.map((x) => <li key={x.say} className="flex items-center justify-between gap-4 border-b border-ink/30 py-3 text-[18px]"><span>{x.say}</span><button className="chip" onPointerEnter={() => setPeek(x.fix)} onPointerLeave={() => setPeek(null)} onClick={() => commit(x.fix)}>Fix it</button></li>)}</ul><span className="cap mb-3 block">Stress · the same detail under hard conditions</span><StressSheet spec={spec} values={values} /></Sheet>}
      {sheet === "all" && <Sheet title="All settings" onClose={() => setSheet(null)}><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Find a setting…" aria-label="Find a setting" className="mb-6 h-12 w-full border-b border-ink bg-transparent text-[18px] outline-none" />{groups.map((g) => { const ss = spec.settings.filter((s) => s.group === g && s.label.toLowerCase().includes(filter.toLowerCase())); return ss.length ? <section key={g} className="mb-8"><h3 className="cap border-b border-ink/30 pb-2">{g}</h3><div className="grid gap-x-8 gap-y-5 pt-4 sm:grid-cols-2 lg:grid-cols-3">{ss.map((s) => <Dial key={s.key} st={s} value={values[s.key] ?? s.def} onChange={(v) => commit({ [s.key]: v })} />)}</div></section> : null; })}</Sheet>}
      {sheet === "borrow" && <Sheet title="Borrow · take one layer from another plate" onClose={() => setSheet(null)}>
        <label className="chip mb-5 cursor-pointer">Borrow from a picture<input type="file" accept="image/*" className="sr-only" onChange={(e) => picture(e.target.files?.[0])} /></label>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{CATALOG.filter((s) => s.id !== spec.id).map((s) => { const st = WORLD_STYLE[s.world], words = Object.fromEntries(s.settings.filter((x) => x.type === "text" && spec.settings.some((y) => y.key === x.key && y.type === "text")).map((x) => [x.key, x.def]));
          return <div key={s.id} className="border border-ink/40"><Mini spec={spec} values={{ ...values, ...pickKeys(st, [...SKIN, ...MOVE]) }} /><span className="cap block truncate border-t border-ink/30 px-2 py-1.5">From {s.name} · {s.world}</span><span className="flex gap-px border-t border-ink/30">{([["Look", pickKeys(st, SKIN)], ["Movement", pickKeys(st, MOVE)], ...(Object.keys(words).length ? [["Words", words]] : [])] as [string, Values][]).map(([l, p]) => <button key={l} className="cap h-10 flex-1 hover:bg-ink hover:text-paper" onClick={() => { commit(p, `BORROWED ${l.toUpperCase()} FROM ${s.name.toUpperCase()}`); setSheet(null); }}>{l}</button>)}</span></div>; })}</div></Sheet>}
    </div>
  );
}
