import { B, C, R, T, mk, type ComponentSpec, type Part } from "../spec";

const P = (n: number, name: string, role: string, ...loupe: string[]): Part => ({ n, name, role, loupe });
const PO = "Post Office", RW = "Railway", PS = "Print Shop", DO = "Drawing Office", DR = "Darkroom", IL = "Instrument Lab";
const LA = "Library & Archive", CR = "Control Room", MS = "Music Studio", CB = "Customs & Bureaucracy", OW = "Observatory & Weather", TC = "Typesetter’s Case";

export const MUSIC_STUDIO_CATALOG: ComponentSpec[] = [
  mk(25, { id: "fader", name: "Channel Fader", category: "Sliders", world: MS, verb: "ride", kind: "instrument", uncommon: false, motion: "active", tags: ["slider", "vertical", "level"], plateControl: "level",
    tagline: "LEVELS ARE RIDDEN, NOT SET.", description: "A cap rides a rail. The meter answers beside it.", pitch: "A vertical slider as a mixing-desk fader, with a twelve-segment meter. The top two segments take the accent.",
    parts: [P(1, "Rail", "The slot", "line", "size"), P(2, "Cap", "The part you ride", "level", "corners", "accent", "speed"), P(3, "Scale", "Seven ticks", "soft"), P(4, "Meter", "Twelve segments", "line", "label")],
    settings: [C("style", "Style", ["Single", "Bank"], "Single", "Single fader; Bank mixes four channel faders together."), R("level", "Level", 0, 100, 62, "Where the cap sits.", { group: "Content" }), T("label", "Channel name", "Channel 1")],
    versions: [{ name: "Console bank", values: { style: "Bank" } }],
    details: [{ cls: "c", text: "The reading is in decibels; zero reads −∞." }, { cls: "e", text: "Up and Down move two steps; Shift moves ten." }, { cls: "a", text: "The meter flickers a segment while the pointer is near." }],
    signature: { name: "A slow ride up and down", ms: 2400 } }),
  mk(26, { id: "metronome", name: "Metronome", category: "Loaders", world: MS, verb: "swing", kind: "theatre", uncommon: true, motion: "active", tags: ["loading", "tempo", "pendulum"], plateControl: "bpm",
    tagline: "WAITING HAS A TEMPO.", description: "A pendulum keeps time while the work is done.", pitch: "A busy indicator as a metronome. The weight’s height on the arm follows the tempo, and squares count the bar.",
    parts: [P(1, "Case", "The pyramid", "line", "size"), P(2, "Arm", "The pendulum", "bpm", "speed"), P(3, "Weight", "Slides to set tempo", "accent", "bpm"), P(4, "Beats", "Squares for the bar", "beats", "line")],
    settings: [R("bpm", "Tempo", 40, 200, 96, "Beats per minute.", { unit: "bpm", safe: [60, 160], group: "Movement" }), R("beats", "Beats in a bar", 2, 6, 4, "Squares that count.")],
    details: [{ cls: "b", text: "At rest the arm is upright and says At rest." }, { cls: "a", text: "The weight really moves down the arm as tempo rises." }, { cls: "c", text: "The first beat of the bar takes the accent." }, { cls: "d", text: "Without motion the beat squares alone keep time." }],
    signature: { name: "Two bars of time", ms: 3000 } }),
  mk(27, { id: "step-sequencer", name: "Step Sequencer", category: "Data", world: MS, verb: "step", kind: "instrument", uncommon: true, motion: "active", tags: ["grid", "pattern", "toggle"], plateControl: "seed",
    tagline: "TIME, DIVIDED INTO SQUARES.", description: "A playhead crosses a pattern you can rewrite.", pitch: "A two-row pattern grid. Cells toggle; a playhead column sweeps while attended and struck cells flash in accent.",
    parts: [P(1, "Row", "One voice", "steps", "line"), P(2, "Cell", "One step", "corners", "accent"), P(3, "Playhead", "The moving mark", "speed", "seed")],
    settings: [R("steps", "Steps", 4, 12, 8, "Columns in the pattern.", { step: 4 }), R("seed", "Pattern", 1, 99, 7, "Each seed is a different beat.", { group: "Content" })],
    details: [{ cls: "c", text: "Steps are grouped in fours by a wider gap." }, { cls: "e", text: "Every cell is a named toggle, reachable by Tab." }, { cls: "a", text: "Only cells that are on flash when struck." }],
    signature: { name: "One bar plays", ms: 3200 } }),
  mk(58, {
    id: "patch-bay",
    name: "Patch Bay",
    category: "Selectors",
    world: MS,
    verb: "patch",
    kind: "instrument",
    uncommon: true,
    motion: "active",
    tags: ["audio", "patch", "cable", "routing", "selector"],
    tagline: "ROUTING IS PHYSICAL.",
    description: "An audio patch bay where dragging patch cords connects signal sources to outputs.",
    pitch: "A studio jackfield switchboard. Dragging tactile patch cables between input jacks and output receptacles forms live signal routing paths with realistic cable sag.",
    parts: [
      P(1, "Jacks", "Row of source and destination sockets", "jacks"),
      P(2, "Cables", "Hanging patch cords with sag", "sag", "accent"),
      P(3, "Matrix", "Routing label readout"),
    ],
    settings: [
      R("jacks", "Jack count", 2, 6, 4, "Number of socket pairs.", { safe: [3, 5], group: "Shape" }),
      R("sag", "Cable sag", 10, 50, 28, "Catenary curve depth.", { unit: "px", safe: [20, 36], group: "Shape" }),
    ],
    versions: [
      { name: "Three-way split", values: { jacks: 3, sag: 20 } },
      { name: "Deep rack", values: { jacks: 5, sag: 36 } },
    ],
    details: [
      { cls: "a", text: "Dragging draws a live quadratic Bezier cable with catenary droop." },
      { cls: "e", text: "Clicking a source jack and destination jack connects them via keyboard." },
    ],
    signature: { name: "Cables route between jacks", ms: 2200 },
  }),
  mk(79, {
    id: "waveform-player",
    name: "Tape Head Scrubber",
    category: "Media",
    world: MS,
    verb: "play",
    kind: "instrument",
    uncommon: true,
    motion: "active",
    tags: ["audio", "waveform", "player", "tape", "scrubber"],
    tagline: "SOUND RECORDED ON THE OXIDE TRACK.",
    description: "An analog magnetic tape waveform player with playhead scrubber and dB level meter.",
    pitch: "An authentic reel-to-reel magnetic tape head. Visual audio waveform bars with a scrubbing vertical playhead, timecode readout, and play/pause toggle.",
    parts: [
      P(1, "Waveform", "32-bar audio waveform profile", "line"),
      P(2, "Playhead", "Magnetic tape pickup head", "accent"),
      P(3, "Timecode", "Minute, second, and frame counter"),
    ],
    settings: [
      R("position", "Tape position", 0, 100, 32, "Playhead progress.", { unit: "%", safe: [0, 100], group: "Content" }),
      T("track", "Tape track", "REEL 04 · TAKE 02"),
    ],
    versions: [
      { name: "Master tape", values: { track: "MASTER ARCHIVE · A440", position: 58 } },
      { name: "Radio broadcast", values: { track: "STATION ID · 1968", position: 15 } },
    ],
    details: [
      { cls: "a", text: "Clicking or dragging on waveform relocates tape playhead." },
      { cls: "e", text: "Spacebar toggles continuous tape playback." },
    ],
    signature: { name: "Tape head scrubs audio wave", ms: 2400 },
  }),
  mk(105, {
    id: "vu-meter",
    name: "Analog VU Meter",
    category: "Indicators",
    world: MS,
    verb: "ballistic",
    kind: "instrument",
    uncommon: true,
    motion: "active",
    tags: ["vu-meter", "audio", "analog", "ballistic", "meter"],
    tagline: "300 MILLISECONDS TO REACH ZERO VU.",
    description: "An authentic ANSI ballistic audio VU meter with damped needle swing and redline zone.",
    pitch: "An analog broadcast volume unit meter. Curved scale running from -20 to +3 VU, authentic 300ms ballistic needle response, and warm illuminated dial background.",
    parts: [
      P(1, "Scale", "Curved VU graduation arc", "line"),
      P(2, "Needle", "Ballistic indicator needle", "accent"),
      P(3, "Peak", "Redline overload indicator lamp"),
    ],
    settings: [
      R("db", "Signal level", -20, 3, -2, "Volume units.", { unit: "VU", safe: [-10, 2], group: "Content" }),
      R("damping", "Needle inertia", 1, 5, 3, "Ballistic response speed.", { safe: [2, 4], group: "Movement" }),
    ],
    versions: [
      { name: "Standard 0 VU", values: { db: 0, damping: 3 } },
      { name: "Overload peak", values: { db: 2, damping: 2 } },
    ],
    details: [
      { cls: "a", text: "Needle overshoots slightly as genuine ballistic meters do." },
      { cls: "e", text: "Arrow keys step signal level by 1 VU." },
    ],
    signature: { name: "Needle swings to 0 VU", ms: 2200 },
  })
];
