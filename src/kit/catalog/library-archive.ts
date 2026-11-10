import { B, C, R, T, mk, type ComponentSpec, type Part } from "../spec";

const P = (n: number, name: string, role: string, ...loupe: string[]): Part => ({ n, name, role, loupe });
const PO = "Post Office", RW = "Railway", PS = "Print Shop", DO = "Drawing Office", DR = "Darkroom", IL = "Instrument Lab";
const LA = "Library & Archive", CR = "Control Room", MS = "Music Studio", CB = "Customs & Bureaucracy", OW = "Observatory & Weather", TC = "Typesetter’s Case";

export const LIBRARY_ARCHIVE_CATALOG: ComponentSpec[] = [
  mk(19, { id: "index-drawer", name: "Index Drawer", category: "Navigation", world: LA, verb: "file", kind: "instrument", uncommon: true, motion: "subtle", tags: ["tabs", "cards", "catalogue"],
    tagline: "ORDER IS A KIND OF KINDNESS.", description: "Cards stand in a drawer. One is pulled forward.", pitch: "Tabs as guide cards in a catalogue drawer. Hover raises a card; choosing it pulls it clear and names its range.",
    parts: [P(1, "Card", "One guide card", "line", "corners", "rise", "size"), P(2, "Tab", "The lettered ear", "tabs", "cap", "trk"), P(3, "Count", "Cards behind this guide", "soft", "cap")],
    settings: [C("style", "Style", ["Drawer", "Cabinet"], "Drawer", "Drawer pulls forward; Cabinet is oak card catalogue."), T("tabs", "Ranges", "A–F G–M N–S T–Z"), R("rise", "Lift", 4, 14, 8, "How far a card stands up.", { unit: "px", group: "Movement" })],
    versions: [{ name: "Oak library card", values: { style: "Cabinet" } }],
    details: [{ cls: "a", text: "Cards rise one after another, 24 ms apart." }, { cls: "e", text: "Arrows wrap around the drawer; one tab stop." }, { cls: "c", text: "The pulled card counts the cards filed behind it." }],
    signature: { name: "Each card is pulled in turn", ms: 2600 } }),
  mk(20, { id: "due-date-slip", name: "Due Date Slip", category: "Time", world: LA, verb: "date", kind: "specimen", uncommon: true, motion: "subtle", tags: ["date", "stamp", "history"],
    tagline: "RETURN BY THE DATE BELOW.", description: "Each loan leaves a date, a little crooked.", pitch: "A date history as a library slip. Pressing stamps the next due date, fourteen days on, slightly rotated, in fresh ink.",
    parts: [P(1, "Slip", "The ruled card", "line", "corners", "rows", "size"), P(2, "Heading", "Names the column", "title", "cap", "trk"), P(3, "Stamp", "One date", "accent", "speed", "feel")],
    settings: [T("title", "Heading", "Date due"), R("rows", "Rows", 3, 5, 4, "How many loans fit the slip.")],
    details: [{ cls: "a", text: "Only the newest stamp takes the accent; older ink fades." }, { cls: "d", text: "A full slip starts a new one instead of overflowing." }, { cls: "c", text: "Rows are numbered in mono at the right edge." }],
    signature: { name: "A date is stamped", ms: 2000 } }),
  mk(21, { id: "dotted-leader", name: "Dotted Leader", category: "Data", world: LA, verb: "lead", kind: "specimen", uncommon: false, motion: "subtle", tags: ["list", "contents", "leaders"],
    tagline: "THE EYE NEEDS A RAIL.", description: "Dots carry the eye from title to page.", pitch: "A contents list with dotted leaders. The leaders draw one after another; the row in hand turns its dots into a solid rule.",
    parts: [P(1, "Entry", "The title", "items", "accent"), P(2, "Leader", "Dots across the gap", "gap", "speed", "feel", "soft"), P(3, "Folio", "The page number", "cap")],
    settings: [T("items", "Entries (use ;)", "The grid;Type;Colour;Motion"), R("gap", "Dot spacing", 3, 8, 5, "Closer dots read as a line.", { unit: "px", group: "Space" })],
    details: [{ cls: "a", text: "The hovered leader becomes a solid hairline." }, { cls: "c", text: "Folios are tabular and zero-padded." }, { cls: "d", text: "No entries shows a plain sentence, not an empty box." }],
    signature: { name: "Leaders draw, one after another", ms: 2400 } }),
  mk(61, {
    id: "combination-lock",
    name: "Combination Lock",
    category: "Inputs",
    world: LA,
    verb: "dial",
    kind: "instrument",
    uncommon: true,
    motion: "subtle",
    tags: ["lock", "combination", "vault", "archive", "dial"],
    tagline: "ALIGN THE NUMBERS TO UNLOCK.",
    description: "A three-tumbler combination lock with mechanical detents and spring latch.",
    pitch: "A physical archive vault lock. Three independent rotating number wheels click through digits 0–9; finding the correct combination releases the spring shackle.",
    parts: [
      P(1, "Case", "Brushed metal housing and shackle", "line"),
      P(2, "Tumblers", "Three rotating numeric drums", "speed", "feel"),
      P(3, "Status", "Lock and unlock state readout", "accent"),
    ],
    settings: [
      T("combo", "Secret code", "042"),
    ],
    versions: [
      { name: "Vault code", values: { combo: "714" } },
      { name: "Default 042", values: { combo: "042" } },
    ],
    details: [
      { cls: "a", text: "Clicking above or below wheels steps tumblers with audio-style click." },
      { cls: "b", text: "Correct combination unlocks shackle and reveals accent status." },
      { cls: "e", text: "Number keys and arrow keys rotate the active tumbler." },
    ],
    signature: { name: "Tumblers align and latch pops", ms: 2000 },
  }),
  mk(68, {
    id: "running-head",
    name: "Running Head",
    category: "Type",
    world: LA,
    verb: "folio",
    kind: "instrument",
    uncommon: false,
    motion: "subtle",
    tags: ["editorial", "folio", "running head", "header", "book"],
    tagline: "THE TOP RULE LOCATES THE READER.",
    description: "An editorial running head with dual page folios, section caption, and coordinate rule.",
    pitch: "An authentic Swiss editorial folio bar. Precision tracking, thin boundary rules, and interactive page stepping with dual-facing folios.",
    parts: [
      P(1, "Rule", "Horizontal hairline rule", "line"),
      P(2, "Folio", "Left and right page numbers", "accent"),
      P(3, "Chapter", "Section title and coordinate"),
    ],
    settings: [
      T("chapter", "Chapter", "04 · SYSTEMATICS"),
      R("page", "Folio page", 1, 480, 142, "Current document folio.", { safe: [1, 480], group: "Content" }),
    ],
    versions: [
      { name: "Typography manual", values: { chapter: "02 · THE GRID", page: 48 } },
      { name: "Archive register", values: { chapter: "09 · SPECIMENS", page: 312 } },
    ],
    details: [
      { cls: "a", text: "Folio numbers update smoothly on arrow step." },
      { cls: "e", text: "Left/Right arrow keys flip page folios." },
    ],
    signature: { name: "Rule slides on page turn", ms: 1600 },
  }),
  mk(89, {
    id: "heatmap-calendar",
    name: "Calendar Matrix",
    category: "Data",
    world: LA,
    verb: "map",
    kind: "instrument",
    uncommon: false,
    motion: "subtle",
    tags: ["heatmap", "calendar", "matrix", "activity", "data"],
    tagline: "WEEKS ACCUMULATE IN SHADES.",
    description: "A 7x14 weekly density matrix mapping activity levels to tonal ink cells.",
    pitch: "An archive activity matrix. Seven rows of daily cells spanning 14 calendar weeks with hover tooltip inspection and intensity key.",
    parts: [
      P(1, "Matrix", "7x14 week grid of tonal squares", "line"),
      P(2, "Cell", "Active hovered day square", "accent"),
      P(3, "Readout", "Date and entry count tooltip"),
    ],
    settings: [
      R("weeks", "Weeks", 8, 20, 14, "Number of columns.", { safe: [10, 16], group: "Shape" }),
      R("intensity", "Peak activity", 1, 5, 3, "Activity density level.", { safe: [2, 4], group: "Content" }),
    ],
    versions: [
      { name: "Quarterly review", values: { weeks: 12, intensity: 4 } },
      { name: "Semester archive", values: { weeks: 18, intensity: 2 } },
    ],
    details: [
      { cls: "a", text: "Hovering cell displays date and record count." },
      { cls: "e", text: "Arrow keys navigate through calendar days." },
    ],
    signature: { name: "Cells fill across calendar", ms: 2200 },
  })
];
