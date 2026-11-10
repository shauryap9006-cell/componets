"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { DemoProps } from "./spec";

/** Shared interaction state for every mechanism: pointer, keyboard, forced moment, signature replay. */
export function useAct(p: DemoProps, ms = 2000) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [sig, setSig] = useState(false);
  useEffect(() => {
    if (!p.play) return;
    setSig(true); const t = setTimeout(() => setSig(false), ms);
    return () => clearTimeout(t);
  }, [p.play, ms]);
  const forced = p.moment === "over" || p.moment === "keyboard" || p.moment === "pressed" || p.moment === "done";
  const off = p.moment === "off";
  const bind = {
    onPointerEnter: () => setHover(true), onPointerLeave: () => { setHover(false); setPress(false); },
    onPointerDown: () => setPress(true), onPointerUp: () => setPress(false),
    onFocus: () => setHover(true), onBlur: () => setHover(false),
  };
  return { over: !off && (hover || sig || forced), down: press || p.moment === "pressed", sig, off, bind };
}

export const press = (fn: () => void) => (e: { key: string; preventDefault: () => void }) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } };

/** Seeded, reproducible randomness (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const mq = (q: string) => (cb: () => void) => { const m = window.matchMedia(q); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); };
export function usePrefersReduced() {
  return useSyncExternalStore(mq("(prefers-reduced-motion: reduce)"), () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
}

export function useInView<T extends Element>(margin = "200px") {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { setInView(e.isIntersecting); if (e.isIntersecting) setSeen(true); }, { rootMargin: margin });
    io.observe(el); return () => io.disconnect();
  }, [margin]);
  return { ref, seen, inView };
}

/** A counter that advances every `ms` while `on`. Pauses when the tab is hidden. */
export function useTick(ms: number, on: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => { if (!document.hidden) setN((x) => x + 1); }, Math.max(30, ms));
    return () => clearInterval(t);
  }, [ms, on]);
  return n;
}

export function useCopy() {
  const [done, setDone] = useState(false);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
    }
    setDone(true); setTimeout(() => setDone(false), 1200);
  };
  return { done, copy };
}
