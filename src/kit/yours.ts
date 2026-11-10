"use client";
import { useSyncExternalStore } from "react";
import type { ComponentSpec, Values } from "./spec";

/** “Yours”: everything made on the Bench, kept in this browser only. */
export interface Yours { id: string; base: string; name: string; values: Values; n: number; at: number }
const KEY = "hl-yours"; const subs = new Set<() => void>(); let cache: Yours[] | null = null;
const EMPTY: Yours[] = [];
function read(): Yours[] { if (cache) return cache; try { cache = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { cache = []; } return cache!; }
function write(list: Yours[]) { cache = list; try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} subs.forEach((f) => f()); }
export function useYours() { return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, read, () => EMPTY); }
export function keep(item: Omit<Yours, "n" | "at"> & { n?: number }) {
  const list = read(), i = list.findIndex((x) => x.id === item.id);
  const next: Yours = { ...item, n: i >= 0 ? list[i].n : list.reduce((m, x) => Math.max(m, x.n), 0) + 1, at: Date.now() };
  write(i >= 0 ? list.map((x, j) => (j === i ? next : x)) : [...list, next]); return next;
}
export const remove = (id: string) => write(read().filter((x) => x.id !== id));
export const restyle = (skin: Values) => write(read().map((x) => ({ ...x, values: { ...x.values, ...skin } })));
export const importYours = (items: Yours[]) => write([...read().filter((x) => !items.some((y) => y.id === x.id)), ...items]);
export const getYours = (id: string) => read().find((x) => x.id === id);

export async function fetchCode(spec: ComponentSpec, values?: Values): Promise<string> {
  try {
    const { generatePlateCode } = await import("./source-provider");
    const out = generatePlateCode(spec, values);
    if (out) return out;
  } catch {}
  try {
    const r = await fetch(`/api/registry/${spec.id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ values: values ?? {} }) });
    if (r.ok) return await r.text();
  } catch {}
  return `// ${spec.name} — source unavailable offline.\n// Spec: ${JSON.stringify({ id: spec.id, values }, null, 2)}`;
}
export const bump = (slug: string, kind: "code" | "prompt") => { fetch("/api/stats", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, kind }) }).catch(() => {}); };
export const encodeShare = (base: string, name: string, values: Values) => btoa(unescape(encodeURIComponent(JSON.stringify({ b: base, n: name, v: values })))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export function decodeShare(d: string): { b: string; n: string; v: Values } | null {
  try { return JSON.parse(decodeURIComponent(escape(atob(d.replace(/-/g, "+").replace(/_/g, "/"))))); } catch { return null; }
}
