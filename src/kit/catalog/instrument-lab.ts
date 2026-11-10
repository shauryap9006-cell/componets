import { B, C, R, T, mk, type ComponentSpec, type Part } from "../spec";

const P = (n: number, name: string, role: string, ...loupe: string[]): Part => ({ n, name, role, loupe });
const PO = "Post Office", RW = "Railway", PS = "Print Shop", DO = "Drawing Office", DR = "Darkroom", IL = "Instrument Lab";
const LA = "Library & Archive", CR = "Control Room", MS = "Music Studio", CB = "Customs & Bureaucracy", OW = "Observatory & Weather", TC = "Typesetter’s Case";

export const INSTRUMENT_LAB_CATALOG: ComponentSpec[] = [
  mk(16, { id: "spirit-level", name: "Spirit Level", category: "Toggles", world: IL, verb: "level", kind: "instrument", uncommon: true, motion: "active", tags: ["switch", "align"], plateControl: "tilt",
    tagline: "TRUE IS BETWEEN TWO LINES.", description: "The vial rights itself. The bubble finds centre.", pitch: "A switch as a spirit level. Off, the vial tilts and the bubble runs to the high end; on, it levels and the bubble settles between the marks.",
    parts: [P(1, "Vial", "The glass tube", "line", "tilt", "size"), P(2, "Bubble", "It finds the middle", "accent", "speed", "feel"), P(3, "Marks", "Two centre lines", "line"), P(4, "Label", "What is aligned", "label", "cap")],
    settings: [T("label", "Words", "Align to grid"), R("tilt", "Tilt when off", 0, 8, 4, "How far off true it rests.", { unit: "°", step: 0.5, group: "Movement" })],
    details: [{ cls: "a", text: "Hover halves the tilt: the level anticipates." }, { cls: "c", text: "The caption reads in tenths of a degree." }, { cls: "b", text: "The bubble takes 800 ms; the vial 640. They never arrive together." }],
    signature: { name: "It comes level", ms: 2200 } }),
  mk(17, { id: "needle-gauge", name: "Needle Gauge", category: "Indicators", world: IL, verb: "weigh", kind: "instrument", uncommon: true, motion: "active", tags: ["meter", "gauge"], plateControl: "load",
    tagline: "WAIT FOR THE NEEDLE.", description: "A needle swings to its load and settles.", pitch: "A meter with a single needle on a 120° arc. The last fifth of the scale is ruled in accent as the limit.",
    parts: [P(1, "Arc", "The scale line", "line", "size"), P(2, "Ticks", "Graduations", "ticks", "soft"), P(3, "Needle", "Points at the load", "load", "speed", "feel", "accent"), P(4, "Reading", "The number", "unit", "cap", "trk")],
    settings: [C("style", "Style", ["Single", "Dual"], "Single", "Single needle on 120° arc; Dual needle differential comparator."), R("load", "Load", 0, 100, 38, "What the needle reads.", { group: "Content" }), T("unit", "Unit", "g"), R("ticks", "Graduations", 10, 30, 20, "Every fifth is long.", { step: 5 })],
    versions: [{ name: "Dual comparator", values: { style: "Dual" } }],
    details: [{ cls: "a", text: "The needle travels slower returning than rising." }, { cls: "c", text: "The reading is zero-padded to three digits." }, { cls: "d", text: "Zero and maximum both stay inside the arc." }],
    signature: { name: "Full scale, then settle", ms: 2400 } }),
  mk(18, { id: "detent-knob", name: "Detent Knob", category: "Selectors", world: IL, verb: "tune", kind: "instrument", uncommon: true, motion: "subtle", tags: ["rotary", "select", "band"],
    tagline: "IT STOPS WHERE IT MEANS IT.", description: "A knob turns in clicks. Each click has a name.", pitch: "A rotary selector with fixed detents. The pointer line jumps between ticks and the active band is set large beside it.",
    parts: [P(1, "Knob", "The body you turn", "line", "size", "pressDrop"), P(2, "Pointer", "The index line", "speed", "feel"), P(3, "Detents", "The stops", "detents", "accent"), P(4, "Band", "The current name", "labels", "cap")],
    settings: [C("style", "Style", ["Knob", "Dial"], "Knob", "Knob turns fixed detent stops; Dial is continuous radio frequency dial."), R("detents", "Stops", 3, 7, 5, "Fewer stops are easier to hit."), T("labels", "Names", "LW MW SW FM DAB")],
    versions: [{ name: "Continuous dial", values: { style: "Dial" } }],
    details: [{ cls: "e", text: "Arrows turn one stop; the name is read aloud." }, { cls: "a", text: "The active tick thickens to two and a half lines." }, { cls: "d", text: "Missing names fall back to the stop number." }],
    signature: { name: "A sweep through every stop", ms: 2600 } }),
  mk(48, {
    id: "dot-wave-loader",
    name: "Dot-Grid Wave",
    category: "Loaders",
    world: IL,
    verb: "wave",
    kind: "specimen",
    uncommon: false,
    motion: "active",
    tags: ["loader", "dots", "wave", "matrix"],
    tagline: "NINE DOTS PASS A WAVE.",
    description: "A sine travels through a row of dots.",
    pitch: "An undulating loader composed of nine baseline-aligned nodes. A mathematical sine wave ripples across the nodes with phase-offset vertical displacement.",
    parts: [
      P(1, "Nodes", "Row of oscillating dots", "dots", "line", "accent"),
    ],
    settings: [
      R("dots", "Dot count", 5, 15, 9, "Number of wave nodes.", { safe: [7, 11], group: "Shape" }),
    ],
    versions: [
      { name: "Compact five", values: { dots: 5 } },
      { name: "Wide wave", values: { dots: 13 } },
    ],
    details: [
      { cls: "a", text: "Phase steps 0.7 radians per dot on 8 px amplitude." },
      { cls: "d", text: "Reduced motion keeps all dots static on the baseline." },
    ],
    signature: { name: "Sine wave ripples across nodes", ms: 2000 },
  }),
  mk(55, {
    id: "stopwatch",
    name: "Stopwatch",
    category: "Time",
    world: IL,
    verb: "chronograph",
    kind: "instrument",
    uncommon: true,
    motion: "active",
    tags: ["timer", "stopwatch", "chronograph", "lap"],
    tagline: "SPLIT SECONDS UNDER TENSION.",
    description: "A mechanical dual-dial chronometer with start, stop, and split lap hands.",
    pitch: "A laboratory split-second chronograph. Central sweep hand tracks hundredths of a second, while a subdial tracks elapsed minutes.",
    parts: [
      P(1, "Case", "Knurled chronometer case and crown", "line"),
      P(2, "Dial", "Primary 60-second perimeter face"),
      P(3, "Subdial", "30-minute accumulator dial", "accent"),
    ],
    settings: [
      B("running", "Start running", false, "Whether the timer starts active."),
    ],
    versions: [
      { name: "Ready to time", values: { running: false } },
      { name: "Active lap", values: { running: true } },
    ],
    details: [
      { cls: "a", text: "Subdial tracks up to 30 elapsed minutes." },
      { cls: "e", text: "Click or Space starts and stops timing; Escape resets." },
    ],
    signature: { name: "Chronometer hand sweeps", ms: 2200 },
  })
];
