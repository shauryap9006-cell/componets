import { site } from "@/site.config";
import type { ComponentSpec } from "../spec";
import { POST_OFFICE_CATALOG } from "./post-office";
import { RAILWAY_CATALOG } from "./railway";
import { PRINT_SHOP_CATALOG } from "./print-shop";
import { DRAWING_OFFICE_CATALOG } from "./drawing-office";
import { DARKROOM_CATALOG } from "./darkroom";
import { INSTRUMENT_LAB_CATALOG } from "./instrument-lab";
import { LIBRARY_ARCHIVE_CATALOG } from "./library-archive";
import { CONTROL_ROOM_CATALOG } from "./control-room";
import { MUSIC_STUDIO_CATALOG } from "./music-studio";
import { CUSTOMS_BUREAUCRACY_CATALOG } from "./customs-bureaucracy";
import { OBSERVATORY_WEATHER_CATALOG } from "./observatory-weather";
import { TYPESETTERS_CASE_CATALOG } from "./typesetters-case";

export const CATALOG: ComponentSpec[] = [
  ...POST_OFFICE_CATALOG,
  ...RAILWAY_CATALOG,
  ...PRINT_SHOP_CATALOG,
  ...DRAWING_OFFICE_CATALOG,
  ...DARKROOM_CATALOG,
  ...INSTRUMENT_LAB_CATALOG,
  ...LIBRARY_ARCHIVE_CATALOG,
  ...CONTROL_ROOM_CATALOG,
  ...MUSIC_STUDIO_CATALOG,
  ...CUSTOMS_BUREAUCRACY_CATALOG,
  ...OBSERVATORY_WEATHER_CATALOG,
  ...TYPESETTERS_CASE_CATALOG,
];

export const byId = (id: string) => CATALOG.find((s) => s.id === id);
export const neighbours = (id: string) => {
  const i = CATALOG.findIndex((s) => s.id === id), n = CATALOG.length;
  return { prev: CATALOG[(i - 1 + n) % n], next: CATALOG[(i + 1) % n] };
};
export const TAGS = Array.from(new Set(CATALOG.flatMap((s) => s.tags))).sort();
export const ROOMS = site.rooms.map((r, i) => ({
  ...r,
  n: i + 1,
  plates: CATALOG.filter((s) => s.world === r.world),
}));

const ALIAS: Record<string, string> = {
  Railway: "train station platform departure rail travel",
  "Post Office": "mail letter post parcel send",
  "Print Shop": "print press ink riso poster",
  "Drawing Office": "blueprint technical drawing ruler engineer",
  Darkroom: "photo photograph camera film",
  "Instrument Lab": "instrument science precise laboratory",
  "Library & Archive": "book library archive catalogue cafe menu",
  "Control Room": "control panel dashboard mileage machine",
  "Music Studio": "music audio sound tempo beat",
  "Customs & Bureaucracy": "passport customs paperwork official typewriter",
  "Observatory & Weather": "weather sky astronomy forecast",
  "Typesetter’s Case": "font letters typography typewriter brand",
  Buttons: "button cta action",
  Toggles: "toggle switch checkbox flip",
  Inputs: "input field form entry",
  Sliders: "slider range drag",
  Selectors: "select choose picker option",
  Navigation: "tabs menu nav",
  Indicators: "indicator gauge meter reading",
  Loaders: "loading loader progress wait spinner",
  Counters: "counter count number total",
  Cards: "card panel open",
  Disclosure: "accordion expand collapse",
  Feedback: "alert notification success status",
  Data: "chart table spreadsheet graph list",
  Time: "date time calendar clock",
  Type: "heading title headline",
  Print: "heading poster headline",
  Media: "image picture photo",
};

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, " ");
const near = (a: string, b: string) => {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, miss = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++miss > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  return true;
};
const fuzzy = (hay: string, w: string) => {
  const t = hay.split(" ").filter(Boolean);
  if (t.some((x) => x.startsWith(w))) return 1;
  return w.length >= 6 && t.some((x) => x.length >= 6 && near(x, w)) ? 0.5 : 0;
};

export function search(q: string, list: ComponentSpec[] = CATALOG): ComponentSpec[] {
  const words = norm(q).split(/\s+/).filter((w) => w.length > 1 && !["a", "an", "the", "that", "like", "with", "you", "feels", "for", "and"].includes(w));
  if (!words.length) return list;
  return list.map((s) => {
    const f: [string, number][] = [
      [norm(s.name), 6],
      [norm(s.verb), 5],
      [norm(s.tags.join(" ")), 4],
      [norm(s.world + " " + s.category), 4],
      [norm((ALIAS[s.world] ?? "") + " " + (ALIAS[s.category] ?? "")), 3],
      [norm(s.tagline + " " + s.description), 2],
      [norm(s.pitch), 1],
    ];
    const score = words.reduce((t, w) => t + f.reduce((m, [h, k]) => Math.max(m, fuzzy(h, w.replace(/s$/, "")) * k), 0), 0);
    return { s, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).map((x) => x.s);
}

export function nearest(q: string, n = 3): ComponentSpec[] {
  const hit = search(q).slice(0, n);
  let h = 0;
  for (const c of q) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  for (let i = 0; hit.length < n && i < CATALOG.length; i++) {
    const s = CATALOG[(h + i * 7) % CATALOG.length];
    if (!hit.includes(s)) hit.push(s);
  }
  return hit;
}

export { POST_OFFICE_CATALOG } from "./post-office";
export { RAILWAY_CATALOG } from "./railway";
export { PRINT_SHOP_CATALOG } from "./print-shop";
export { DRAWING_OFFICE_CATALOG } from "./drawing-office";
export { DARKROOM_CATALOG } from "./darkroom";
export { INSTRUMENT_LAB_CATALOG } from "./instrument-lab";
export { LIBRARY_ARCHIVE_CATALOG } from "./library-archive";
export { CONTROL_ROOM_CATALOG } from "./control-room";
export { MUSIC_STUDIO_CATALOG } from "./music-studio";
export { CUSTOMS_BUREAUCRACY_CATALOG } from "./customs-bureaucracy";
export { OBSERVATORY_WEATHER_CATALOG } from "./observatory-weather";
export { TYPESETTERS_CASE_CATALOG } from "./typesetters-case";
