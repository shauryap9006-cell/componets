import { B, C, R, T, mk, type ComponentSpec, type Part } from "../spec";

const P = (n: number, name: string, role: string, ...loupe: string[]): Part => ({ n, name, role, loupe });
const PO = "Post Office", RW = "Railway", PS = "Print Shop", DO = "Drawing Office", DR = "Darkroom", IL = "Instrument Lab";
const LA = "Library & Archive", CR = "Control Room", MS = "Music Studio", CB = "Customs & Bureaucracy", OW = "Observatory & Weather", TC = "Typesetter’s Case";

export const TYPESETTERS_CASE_CATALOG: ComponentSpec[] = [
  mk(34, { id: "composing-stick", name: "Composing Stick", category: "Type", world: TC, verb: "compose", kind: "theatre", uncommon: true, motion: "cinematic", tags: ["heading", "letters", "letterpress"],
    tagline: "WORDS ARE ASSEMBLED, NOT TYPED.", description: "Sorts drop into the stick, nick side out.", pitch: "A heading set by hand. Each letter is a sort that drops into a composing stick in order; spaces are blank sorts.",
    parts: [P(1, "Stick", "The L-shaped tray", "line", "gap", "size"), P(2, "Sort", "One piece of type", "word", "corners", "speed", "feel"), P(3, "Nick", "The groove that shows which way up", "accent"), P(4, "Count", "Sorts, spaces, measure", "cap", "trk", "soft")],
    settings: [T("word", "Word", "Hairline"), R("gap", "Spacing", 0, 6, 2, "Thin spaces between sorts.", { unit: "px", group: "Space" })],
    details: [{ cls: "a", text: "Each sort carries its nick in accent, all on one side." }, { cls: "c", text: "The caption counts sorts, spaces and the measure in ems." }, { cls: "d", text: "Spaces are drawn as blank sorts; ten characters at most." }],
    signature: { name: "The word is set", ms: 2600 } }),
  mk(35, { id: "kerning-pair", name: "Kerning Pair", category: "Type", world: TC, verb: "kern", kind: "instrument", uncommon: true, motion: "subtle", tags: ["typography", "spacing", "slider"], plateControl: "kern",
    tagline: "SPACE IS SET BY HAND.", description: "Two letters, one gap, measured in thousandths.", pitch: "A spacing control on the letters themselves. Drag the pair to kern; side-bearing guides appear and the value reads in thousandths of an em.",
    parts: [P(1, "Left letter", "Stays still", "pair", "size"), P(2, "Right letter", "Moves with the gap", "kern", "speed", "feel", "accent"), P(3, "Reading", "Thousandths of an em", "cap", "trk", "soft")],
    settings: [T("pair", "Pair", "AV"), R("kern", "Kerning", -120, 80, 0, "Negative tucks the letters together.", { step: 2, group: "Space" })],
    details: [{ cls: "e", text: "Arrows kern by two; Shift by ten." }, { cls: "c", text: "A true minus sign, and three padded digits." }, { cls: "a", text: "Side-bearing guides appear only while attended." }],
    signature: { name: "Too tight, too loose, right", ms: 2600 } }),
  mk(36, { id: "width-axis", name: "Width Axis", category: "Type", world: TC, verb: "stretch", kind: "specimen", uncommon: true, motion: "active", tags: ["variable font", "heading"], plateControl: "width",
    tagline: "ONE DRAWING, MANY WIDTHS.", description: "The word widens as the pointer travels.", pitch: "A variable-font specimen. Pointer position sets the width axis; a ruled track shows where on the axis the word sits.",
    parts: [P(1, "Word", "The specimen", "word", "weight", "size"), P(2, "Axis", "The ruled track", "width", "accent", "line"), P(3, "Reading", "Axis values", "cap", "trk", "soft")],
    settings: [C("style", "Style", ["Axis", "Specimen"], "Axis", "Axis is continuous single-word tracker; Specimen is full multi-weight type specimen card."), T("word", "Word", "Hamburg"), R("width", "Width", 62, 125, 100, "The width axis at rest.", { group: "Type" }), R("weight", "Weight", 100, 900, 650, "How heavy the strokes are.", { step: 50, group: "Type" })],
    versions: [{ name: "Specimen card", values: { style: "Specimen" } }],
    details: [{ cls: "c", text: "Axis tags are set as the font names them: wdth, wght." }, { cls: "e", text: "Arrows move the axis three units." }, { cls: "d", text: "The word never wraps; the line height is fixed." }],
    signature: { name: "Condensed to extended", ms: 2800 } }),
  mk(65, {
    id: "scramble-decode",
    name: "Scramble Decoder",
    category: "Type",
    world: TC,
    verb: "decode",
    kind: "instrument",
    uncommon: true,
    motion: "active",
    tags: ["typography", "cipher", "matrix", "decode", "text"],
    tagline: "CIPHER RESOLVES INTO TEXT.",
    description: "A typographic deciphering display resolving random glyphs into clean letterforms.",
    pitch: "An authentic telegraphic descrambler. Hover or activation triggers rapid glyph cycling across each letter cell until the underlying text locks in.",
    parts: [
      P(1, "Display", "Active glyph container", "text"),
      P(2, "Progress", "Lock status and resolution bar", "accent"),
      P(3, "Readout", "Total characters and cycle frequency"),
    ],
    settings: [
      T("text", "Target text", "HELVETICA NEUE"),
      R("cycles", "Scramble steps", 4, 16, 8, "How many glyph cycles before locking.", { safe: [6, 12], group: "Behavior" }),
    ],
    versions: [
      { name: "Universal Grotesk", values: { text: "AKZIDENZ GROTESK" } },
      { name: "Basel Monospace", values: { text: "SWISS STYLE 1957" } },
    ],
    details: [
      { cls: "a", text: "Staggered descrambling from left to right." },
      { cls: "e", text: "Clicking or pressing Space re-initiates full cipher sweep." },
    ],
    signature: { name: "Letters resolve from chaos", ms: 2000 },
  }),
  mk(70, {
    id: "kerning-rope",
    name: "Elastic Kerning",
    category: "Type",
    world: TC,
    verb: "tension",
    kind: "instrument",
    uncommon: true,
    motion: "active",
    tags: ["kerning", "rope", "elastic", "typography", "spacing"],
    tagline: "TENSION GOVERNS THE APERTURE.",
    description: "An elastic tension guide measuring spacing between letterform outlines.",
    pitch: "A tactile kerning tool with a catenary tension cord linking glyph side-bearings. Dragging adjusts micro-spacing with continuous spring tension.",
    parts: [
      P(1, "Glyphs", "Left and right letters", "pair"),
      P(2, "Rope", "Elastic tension cord", "accent"),
      P(3, "Gauge", "Milli-em kerning delta readout"),
    ],
    settings: [
      T("pair", "Glyphs", "Ty"),
      R("gap", "Tension gap", -20, 60, 18, "Kerning distance.", { unit: "px", safe: [-10, 40], group: "Shape" }),
    ],
    versions: [
      { name: "Cap T and lower o", values: { pair: "To", gap: 12 } },
      { name: "Cap A and Cap V", values: { pair: "AV", gap: 6 } },
    ],
    details: [
      { cls: "a", text: "Catenary cord sags proportionally as kerning gap widens." },
      { cls: "e", text: "Arrow keys step kerning gap by 1 px." },
    ],
    signature: { name: "Rope stretches and springs back", ms: 1800 },
  })
];
