import { B, C, R, T, mk, type ComponentSpec, type Part } from "../spec";

const P = (n: number, name: string, role: string, ...loupe: string[]): Part => ({ n, name, role, loupe });
const PO = "Post Office", RW = "Railway", PS = "Print Shop", DO = "Drawing Office", DR = "Darkroom", IL = "Instrument Lab";
const LA = "Library & Archive", CR = "Control Room", MS = "Music Studio", CB = "Customs & Bureaucracy", OW = "Observatory & Weather", TC = "Typesetter’s Case";

export const POST_OFFICE_CATALOG: ComponentSpec[] = [
  mk(1, { id: "perforated-tear", name: "Perforated Tear", category: "Buttons", world: PO, verb: "tear", kind: "instrument", uncommon: true, motion: "active", tags: ["confirm", "ticket", "destructive"],
    tagline: "CONFIRMATION SHOULD COST A GESTURE.", description: "A stub lifts, then leaves. The ticket remembers.", pitch: "A confirm button built as a ticket with a perforated stub. Hover lifts the stub on its hinge corner; pressing tears it away and the body restates itself as confirmed.",
    parts: [P(1, "Ticket", "The body that stays", "label", "line", "corners", "size"), P(2, "Label", "What is being confirmed", "label", "cap", "trk"), P(3, "Perforation", "A column of holes", "teeth", "soft"), P(4, "Stub", "The piece you tear", "stub", "speed", "feel", "accent")],
    settings: [C("style", "Style", ["Stub", "Ticket"], "Stub", "Stub is a corner-lift confirm button; Ticket is an admission pass."), T("label", "Words", "Confirm order"), T("stub", "Stub words", "Tear"), R("teeth", "Holes", 6, 16, 10, "More holes read as a finer perforation."), T("venue", "Venue / line", "HALL B · ROW 07"), T("after", "Words when done", "Admitted")],
    versions: [{ name: "Admission ticket", values: { style: "Ticket", label: "Admit one", after: "Admitted" } }],
    details: [{ cls: "a", text: "The stub lifts 4° on its own corner before it tears." }, { cls: "b", text: "Done restates the label and counts the stub as removed." }, { cls: "c", text: "A serial number sits under the label in mono." }, { cls: "d", text: "Long labels truncate inside the body; the stub never moves." }],
    signature: { name: "The stub tears and drifts away", ms: 2200 } }),
  mk(2, { id: "postmark", name: "Postmark", category: "Feedback", world: PO, verb: "cancel", kind: "theatre", uncommon: true, motion: "active", tags: ["send", "stamp", "success"],
    tagline: "SENT MEANS IT CANNOT RETURN.", description: "A stamp waits. A postmark lands, slightly crooked.", pitch: "A send action whose success state is a postmark cancelling a stamp: double ring, date, four wavy lines, landed at a human angle.",
    parts: [P(1, "Stamp", "The thing to be cancelled", "line", "size", "corners"), P(2, "Postmark", "Ring, date and wavy lines", "angle", "city", "accent", "speed", "feel"), P(3, "Label", "The action, then the result", "label", "cap")],
    settings: [T("label", "Words", "Send letter"), T("city", "Place", "ZÜRICH 1"), R("angle", "Crookedness", -20, 20, -8, "A postmark is never perfectly straight.", { unit: "°", safe: [-12, 12] })],
    details: [{ cls: "b", text: "Success is drawn, not announced: the mark lands and the label becomes Sent." }, { cls: "c", text: "The date inside the ring is set in seven-point mono." }, { cls: "a", text: "The mark arrives large and settles, like a hand coming down." }],
    signature: { name: "The postmark lands", ms: 2200 } }),
  mk(3, { id: "envelope-flap", name: "Envelope Flap", category: "Cards", world: PO, verb: "unfold", kind: "theatre", uncommon: true, motion: "cinematic", tags: ["card", "reveal", "invitation"],
    tagline: "OPEN IT TO KNOW IT.", description: "The flap folds back. The letter rises to meet you.", pitch: "A card drawn as an envelope. The flap rotates on its top fold, then the enclosure slides up by a measured amount.",
    parts: [P(1, "Envelope", "The pocket", "line", "corners", "size"), P(2, "Flap", "Folds back on its edge", "speed", "feel"), P(3, "Letter", "The enclosure that rises", "title", "note", "lift", "accent")],
    settings: [C("style", "Style", ["Flap", "Pocket"], "Flap", "Flap is top fold; Pocket has wax seal and transit mark."), T("title", "Heading", "Invitation"), T("note", "Letter words", "You are expected at eight."), T("to", "Addressee", "To: the reader"), B("seal", "Wax seal", true, "Red wax seal mark."), R("lift", "How far it rises", 20, 60, 42, "Enough to read, not enough to leave.", { unit: "%", group: "Movement" })],
    versions: [{ name: "Official dispatch", values: { style: "Pocket", seal: true } }],
    details: [{ cls: "a", text: "The letter waits 160 ms for the flap to clear before rising." }, { cls: "c", text: "The pocket reports Sealed or Opened and the enclosure count." }, { cls: "e", text: "Focus opens it; no pointer is needed." }, { cls: "d", text: "The letter clamps to two lines." }],
    signature: { name: "Flap back, letter up", ms: 2600 } }),
  mk(43, {
    id: "postage-meter",
    name: "Postage Meter",
    category: "Inputs",
    world: PO,
    verb: "frank",
    kind: "instrument",
    uncommon: true,
    motion: "subtle",
    tags: ["meter", "stepper", "number", "franking", "currency"],
    tagline: "THE PRICE ROLLS INTO PLACE.",
    description: "A number input with odometer drums and a meter's patience.",
    pitch: "A precision stepper styled as a postal franking machine. Digits roll vertically like mechanical odometer drums to dial in exact postage values.",
    parts: [
      P(1, "Minus", "Decrement step button", "step", "line"),
      P(2, "Drums", "Mechanical rolling digit wheels", "value", "digits", "currency", "speed", "feel"),
      P(3, "Plus", "Increment step button", "step", "max", "accent"),
    ],
    settings: [
      R("value", "Start value", 0, 99, 0.85, "Initial numeric value.", { step: 0.05, safe: [0, 99], group: "Behavior" }),
      R("step", "Step size", 0.01, 1, 0.05, "Amount added or subtracted per step.", { step: 0.01, safe: [0.01, 1], group: "Behavior" }),
      R("digits", "Drum count", 3, 6, 4, "Number of visible digit drums.", { safe: [3, 6], group: "Shape" }),
      R("max", "Maximum limit", 1, 999, 9.99, "Maximum permitted value before warning.", { safe: [1, 999], group: "Behavior" }),
      T("currency", "Currency symbol", "£"),
      T("label", "Label", "Postage"),
    ],
    versions: [
      { name: "Dollars", values: { currency: "$", step: 0.25 } },
      { name: "Integer units", values: { currency: "№", step: 1, value: 3 } },
      { name: "Heavy dial", values: { feel: "Heavy", speed: 0.8 } },
    ],
    details: [
      { cls: "a", text: "Digits roll vertically with mechanical drum animation." },
      { cls: "b", text: "Exceeding the limit flashes an OVER warning in accent color." },
      { cls: "e", text: "Up and Down arrows step value; Shift multiplies step by 10." },
    ],
    signature: { name: "Drums roll to target value", ms: 1800 },
  }),
  mk(85, {
    id: "tear-card",
    name: "Contact Tear Card",
    category: "Buttons",
    world: PO,
    verb: "tear",
    kind: "instrument",
    uncommon: true,
    motion: "active",
    tags: ["tear", "tabs", "contact", "bulletin", "perforated"],
    tagline: "PULL A SLIP FROM THE PERFORATED FRINGE.",
    description: "A community bulletin board card with individually tearable perforated contact slips.",
    pitch: "A physical tear-off contact card. Vertical perforated slips along the bottom edge can be individually clicked or torn away with authentic paper tear sounds and jagged stubs.",
    parts: [
      P(1, "Notice", "Primary placard bulletin", "line", "corners"),
      P(2, "Tabs", "Fringe of perforated contact tabs", "accent"),
      P(3, "Perforation", "Dashed tear line"),
    ],
    settings: [
      R("tabs", "Tab count", 3, 6, 5, "Number of contact fringe tabs.", { safe: [4, 6], group: "Shape" }),
      T("label", "Notice caption", "TYPESETTING WORKSHOP"),
    ],
    versions: [
      { name: "Studio lease", values: { label: "DARKROOM TO LET", tabs: 4 } },
      { name: "Public notice", values: { label: "EXHIBITION NOTICE", tabs: 6 } },
    ],
    details: [
      { cls: "a", text: "Clicking a tab tears it free from the perforated baseline." },
      { cls: "e", text: "Arrow keys navigate tabs; Enter tears focused tab." },
    ],
    signature: { name: "Tab tears along perforation", ms: 1800 },
  })
];
