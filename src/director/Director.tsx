"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { CATALOG } from "@/kit/catalog";
import { site, type ThemeKey } from "@/site.config";

export type Cut = "curtain" | "lift" | "film" | "pickup" | "print" | "roll" | "wipe";
type Foley = "tick" | "clack" | "thunk" | "stamp" | "ding" | "paper";
/** Typed scene graph: the first matching pair chooses the cut. Any unlisted pair gets a Line Wipe. */
const SCENES: { from: RegExp; to: RegExp; cut: Cut; cue: Foley }[] = [
  { from: /^\/$/, to: /^\/gallery/, cut: "curtain", cue: "clack" },
  { from: /^\/gallery/, to: /^\/detail/, cut: "lift", cue: "tick" },
  { from: /^\/detail/, to: /^\/detail/, cut: "film", cue: "clack" },
  { from: /^\/workshop/, to: /^\/workshop/, cut: "print", cue: "paper" },
  { from: /./, to: /^\/workshop/, cut: "pickup", cue: "thunk" },
  { from: /./, to: /^\/docs/, cut: "roll", cue: "paper" },
];
const pick = (from: string, to: string) => SCENES.find((s) => s.from.test(from) && s.to.test(to)) ?? { cut: "wipe" as Cut, cue: "tick" as Foley };

interface Ctx { go: (href: string, cut?: Cut) => void; theme: ThemeKey; setTheme: (t: ThemeKey, at?: { x: number; y: number }) => void; sound: boolean; foley: (f: Foley) => void; calm: boolean }
const DirectorCtx = createContext<Ctx>({ go: () => {}, theme: "paper", setTheme: () => {}, sound: false, foley: () => {}, calm: false });
export const useDirector = () => useContext(DirectorCtx);

let ac: AudioContext | null = null;
function synth(f: Foley) {
  ac ??= new AudioContext(); const t = ac.currentTime, g = ac.createGain(); g.connect(ac.destination);
  const tone = (hz: number, dur: number, type: OscillatorType, vol = 0.12) => { const o = ac!.createOscillator(); o.type = type; o.frequency.setValueAtTime(hz, t); o.connect(g); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.start(t); o.stop(t + dur); };
  const noise = (dur: number, hz: number, vol = 0.1) => { const b = ac!.createBuffer(1, ac!.sampleRate * dur, ac!.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); const s = ac!.createBufferSource(), fl = ac!.createBiquadFilter(), ng = ac!.createGain(); fl.type = "bandpass"; fl.frequency.value = hz; ng.gain.value = vol; s.buffer = b; s.connect(fl).connect(ng).connect(ac!.destination); s.start(t); };
  if (f === "tick") tone(1800, 0.03, "square", 0.05); if (f === "clack") noise(0.06, 2400, 0.16); if (f === "thunk") tone(90, 0.12, "sine", 0.2);
  if (f === "stamp") { tone(70, 0.1, "sine", 0.2); noise(0.05, 900, 0.12); } if (f === "ding") tone(1320, 0.5, "sine", 0.1); if (f === "paper") noise(0.18, 5200, 0.08);
}

export function Cue({ href, cut, className, children, ...rest }: { href: string; cut?: Cut; className?: string; children: ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { go } = useDirector();
  return <Link href={href} className={className} {...rest} onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; e.preventDefault(); go(href, cut); }}>{children}</Link>;
}

export function Director({ children }: { children: ReactNode }) {
  const router = useRouter(), path = usePathname();
  const [theme, setThemeState] = useState<ThemeKey>("paper");
  const [sound, setSound] = useState(false), [calm, setCalm] = useState(false);
  const [cut, setCut] = useState<{ kind: Cut; phase: "in" | "out" } | null>(null);
  const [leader, setLeader] = useState<"wait" | "count" | "open" | "done">("wait");
  const [num, setNum] = useState(3);
  const [ov, setOv] = useState({ g: false, b: false, i: false });
  const [live, setLive] = useState({ time: "--:--:--", x: 0, y: 0, pct: 0 });
  const soundRef = useRef(false); soundRef.current = sound;
  const foley = useCallback((f: Foley) => { if (soundRef.current) try { synth(f); } catch {} }, []);
  const embed = path.startsWith("/embed");

  // boot: theme, low-power detection, leader
  useEffect(() => {
    const t = (localStorage.getItem("hl-theme") as ThemeKey) || "paper"; setThemeState(t); document.documentElement.dataset.theme = t;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const low = window.matchMedia("(prefers-reduced-motion: reduce)").matches || !!nav.connection?.saveData || (nav.hardwareConcurrency ?? 8) <= 2;
    setCalm(low);
    if (embed || low) { setLeader("done"); return; }
    if (sessionStorage.getItem("hl-leader")) { setLeader("open"); setTimeout(() => setLeader("done"), 560); return; }
    sessionStorage.setItem("hl-leader", "1"); setLeader("count");
    let loaded = false, n = 3; const t0 = performance.now();
    document.fonts?.ready.then(() => (loaded = true));
    let opened = false; const open = () => { if (opened) return; opened = true; window.removeEventListener("keydown", skip); window.removeEventListener("pointerdown", skip); setLeader("open"); setTimeout(() => setLeader("done"), 760); };
    function skip() { clearTimeout(timer); open(); }
    const step = () => { n -= 1; setNum(n); if (n <= 0 || performance.now() - t0 > 1400) open(); else timer = window.setTimeout(step, loaded ? 300 : 460); };
    var timer = window.setTimeout(step, 420);
    window.addEventListener("keydown", skip, { once: true }); window.addEventListener("pointerdown", skip, { once: true });
    return () => { clearTimeout(timer); window.removeEventListener("keydown", skip); window.removeEventListener("pointerdown", skip); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // live data in the chrome + overlay keys
  useEffect(() => {
    const clock = setInterval(() => setLive((l) => ({ ...l, time: new Date().toLocaleTimeString("en-GB") })), 1000);
    let raf = 0; const pos = { x: 0, y: 0 };
    const flush = () => { raf = 0; const h = document.documentElement; setLive((l) => ({ ...l, x: pos.x, y: pos.y, pct: Math.round((h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100) })); };
    const mv = (e: PointerEvent) => { pos.x = Math.round(e.clientX); pos.y = Math.round(e.clientY); raf ||= requestAnimationFrame(flush); };
    const sc = () => { raf ||= requestAnimationFrame(flush); };
    const key = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement; if (el.closest("input,textarea,select,[contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "g" || e.key === "G") setOv((o) => ({ ...o, g: !o.g })); if (e.key === "i" || e.key === "I") setOv((o) => ({ ...o, i: !o.i }));
      if ((e.key === "b" || e.key === "B") && !location.pathname.startsWith("/workshop")) setOv((o) => ({ ...o, b: !o.b }));
    };
    window.addEventListener("pointermove", mv, { passive: true }); window.addEventListener("scroll", sc, { passive: true }); window.addEventListener("keydown", key);
    return () => { clearInterval(clock); window.removeEventListener("pointermove", mv); window.removeEventListener("scroll", sc); window.removeEventListener("keydown", key); };
  }, []);
  useEffect(() => { document.documentElement.dataset.inspect = ov.i ? "1" : "0"; }, [ov.i]);

  // route transitions
  const pending = useRef<number[]>([]);
  const clear = () => { pending.current.forEach(clearTimeout); pending.current = []; };
  const go = useCallback((href: string, force?: Cut) => {
    const target = href.split("?")[0];
    const sc = pick(location.pathname, target); const kind = force ?? sc.cut;
    foley(sc.cue); clear();
    if (calm) { router.push(href); return; }
    setCut({ kind, phase: "in" });
    pending.current.push(window.setTimeout(() => router.push(href), kind === "lift" ? 200 : 340), window.setTimeout(() => setCut(null), 1600));
    if (target === location.pathname) pending.current.push(window.setTimeout(() => setCut((c) => (c ? { ...c, phase: "out" } : c)), 380), window.setTimeout(() => setCut(null), 800));
  }, [router, calm, foley]);
  useEffect(() => {
    setCut((c) => (c ? { ...c, phase: "out" } : c));
    const t = window.setTimeout(() => setCut(null), 440); window.scrollTo({ top: 0 });
    return () => clearTimeout(t);
  }, [path]);

  const setTheme = useCallback((t: ThemeKey, at?: { x: number; y: number }) => {
    const apply = () => { flushSync(() => setThemeState(t)); document.documentElement.dataset.theme = t; localStorage.setItem("hl-theme", t); };
    const d = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!d.startViewTransition || calm || !at) return apply();
    const r = Math.hypot(Math.max(at.x, innerWidth - at.x), Math.max(at.y, innerHeight - at.y));
    d.startViewTransition(apply).ready.then(() => document.documentElement.animate({ clipPath: [`circle(0px at ${at.x}px ${at.y}px)`, `circle(${r}px at ${at.x}px ${at.y}px)`] }, { duration: 480, easing: "cubic-bezier(0.76,0,0.24,1)", pseudoElement: "::view-transition-new(root)" })).catch(() => {});
    foley("paper");
  }, [calm, foley]);

  const ctx = useMemo(() => ({ go, theme, setTheme, sound, foley, calm }), [go, theme, setTheme, sound, foley, calm]);
  const cols = (cls: string, anim: (i: number) => React.CSSProperties) => <div className="g12 wrap pointer-events-none fixed inset-0 z-[100] !max-w-none !gap-0 !p-0">{Array.from({ length: 12 }, (_, i) => <i key={i} className={`block h-full ${cls}`} style={anim(i)} />)}</div>;
  if (embed) return <DirectorCtx.Provider value={ctx}>{children}</DirectorCtx.Provider>;
  const k = cut?.kind, out = cut?.phase === "out";

  return (
    <DirectorCtx.Provider value={ctx}>
      <a href="#main" className="cap sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[200] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">Skip to content</a>
      <header className="hl sticky top-0 z-50 border-b bg-paper">
        <div className="wrap flex h-12 items-center gap-4 sm:gap-6">
          <Cue href="/" className="shrink-0 text-[17px] font-semibold tracking-tight">{site.name}</Cue>
          <nav className="noscroll flex min-w-0 flex-1 items-center gap-3 overflow-x-auto sm:gap-5" aria-label="Main">
            {site.nav.slice(1).map((n) => <Cue key={n.href} href={n.href} className="cap shrink-0 py-2" aria-current={path.startsWith(n.href) ? "page" : undefined} style={{ color: path.startsWith(n.href) ? "var(--accent)" : undefined }}>{n.label}</Cue>)}
          </nav>
          <span className="cap-s hidden items-center gap-4 opacity-60 lg:flex" aria-hidden><span>{live.time}</span><span>X{String(live.x).padStart(4, "0")} Y{String(live.y).padStart(4, "0")}</span><span>{String(live.pct).padStart(3, "0")}%</span><span>{CATALOG.length} FIG.</span></span>
          <button className="grid size-8 shrink-0 place-items-center border border-ink sm:hidden" aria-label={`Theme: ${theme}. Switch to the next.`} onClick={(e) => { const i = site.themes.findIndex((t) => t.key === theme), b = e.currentTarget.getBoundingClientRect(); setTheme(site.themes[(i + 1) % site.themes.length].key as ThemeKey, { x: b.left + b.width / 2, y: b.top + b.height / 2 }); }}><i className="block size-2.5 bg-accent" /></button>
          <div className="hidden shrink-0 items-center gap-1 sm:flex" role="radiogroup" aria-label="Theme">
            {site.themes.map((t) => <button key={t.key} role="radio" aria-checked={theme === t.key} aria-label={t.label} title={t.label} data-theme={t.key} onClick={(e) => { const b = e.currentTarget.getBoundingClientRect(); setTheme(t.key as ThemeKey, { x: b.left + b.width / 2, y: b.top + b.height / 2 }); }}
              className="grid size-6 place-items-center border" style={{ background: "var(--paper)", borderColor: theme === t.key ? "var(--ink)" : "color-mix(in oklch, var(--ink) 35%, transparent)" }}><i className="block size-2" style={{ background: "var(--accent)" }} /></button>)}
          </div>
          <button className="cap hidden shrink-0 sm:block" aria-pressed={sound} onClick={() => { setSound((s) => !s); if (!sound) setTimeout(() => synth("ding"), 0); }}>Sound {sound ? "on" : "off"}</button>
        </div>
      </header>
      <main id="main" key={path} className={leader === "done" && !calm ? "rise" : ""} style={k === "lift" && !out ? { scale: "0.98", opacity: 0.2, transition: "scale 200ms var(--quart), opacity 200ms" } : undefined}>{children}</main>
      {!path.startsWith("/workshop") && <footer className="hl mt-24 border-t">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-6"><span className="cap-s opacity-60">{site.footer}</span>
          <span className="cap-s flex items-center gap-3"><span className="key">G</span>grid<span className="key">B</span>baseline<span className="key">I</span>inspect<span className="opacity-60">· {site.author.name}</span></span></div>
      </footer>}

      {ov.g && <div className="ov-grid" aria-hidden><div className="wrap g12">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div></div>}
      {ov.b && <div className="ov-base" aria-hidden />}

      {cut && (k === "curtain" || k === "pickup") && cols(k === "curtain" ? "bg-ink" : "bg-plate border-x hl", (i) => ({ transformOrigin: out ? "bottom" : "top", animation: `${out ? "colOut" : "colIn"} 280ms var(--expo) ${i * 24}ms both` }))}
      {cut && (k === "wipe" || k === "roll" || k === "print") && <div className="pointer-events-none fixed inset-0 z-[100] bg-ink" style={k === "wipe" ? { transformOrigin: out ? "right" : "left", animation: `${out ? "rowOut" : "rowIn"} 320ms var(--quart) both` } : { transformOrigin: out ? "top" : "bottom", animation: `${out ? "colOut" : "colIn"} 320ms ${k === "print" ? "steps(12,end)" : "var(--quart)"} both` }} />}
      {cut && k === "film" && (
        <div className="pointer-events-none fixed inset-0 z-[100] flex bg-ink" style={{ animation: out ? "filmOut 240ms var(--quart) both" : "filmIn 240ms var(--quart) both" }}>
          <style>{`@keyframes filmIn{from{translate:100% 0}to{translate:0 0}}@keyframes filmOut{from{translate:0 0}to{translate:-100% 0}}`}</style>
          {[0, 1].map((s) => <div key={s} className={`flex h-full w-8 flex-col justify-around ${s ? "ml-auto" : ""}`}>{Array.from({ length: 14 }, (_, i) => <i key={i} className="mx-auto block h-5 w-4 bg-paper" />)}</div>)}
        </div>
      )}

      {leader !== "done" && (
        <div className={`fixed inset-0 z-[150] ${leader === "open" ? "pointer-events-none" : ""}`} role="status" aria-label="Loading">
          {leader === "open" ? cols("bg-ink", (i) => ({ transformOrigin: "top", animation: `colOut 480ms var(--expo) ${i * 24}ms both` })) : <div className="absolute inset-0 bg-ink" />}
          {leader === "count" && (
            <div className="absolute inset-0 grid place-items-center text-paper">
              <svg viewBox="-100 -100 200 200" className="absolute size-[min(70vw,70vh)]" aria-hidden>
                <circle r="90" fill="none" stroke="currentColor" strokeWidth="0.5" /><path d="M-100 0 H100 M0 -100 V100" stroke="currentColor" strokeWidth="0.5" />
                <path key={num} d="M0 0 L0 -90" stroke="var(--accent)" strokeWidth="1.5" style={{ transformOrigin: "0 0", animation: "spin 440ms linear both" }} />
              </svg>
              <span key={num} className="disp relative text-[min(46vw,46vh)] tabular-nums" style={{ animation: "fadeIn 80ms both" }}>{Math.max(1, num)}</span>
              <span className="cap absolute bottom-8 left-8 opacity-70">{site.name} · {String(Math.round(((3 - num) / 3) * 100)).padStart(3, "0")}%</span>
              <span className="cap absolute bottom-8 right-8 opacity-70">Any key skips</span>
            </div>
          )}
        </div>
      )}
      <noscript><style>{`[role="status"][aria-label="Loading"]{display:none}`}</style></noscript>
    </DirectorCtx.Provider>
  );
}
