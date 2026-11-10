import type { ComponentType } from "react";
import type { DemoProps } from "@/kit/spec";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import * as D from "./d";
import * as E from "./e";
import * as F from "./f";

/** Mechanism library: one hand-built renderer per spec id. */
export const DEMOS: Record<string, ComponentType<DemoProps>> = {
  "perforated-tear": A.PerforatedTear, postmark: A.Postmark, "envelope-flap": A.EnvelopeFlap, "arrow-relay": A.ArrowRelay, "split-flap": A.SplitFlap, "ticket-punch": A.TicketPunch,
  misregister: B.Misregister, "halftone-dial": B.HalftoneDial, "ink-pull": B.InkPull, "caliper-slider": B.CaliperSlider, "dimension-input": B.DimensionInput, "section-cut": B.SectionCut, "moire-field": B.MoireField,
  develop: C.Develop, "contact-sheet": C.ContactSheet, "shutter-toggle": C.ShutterToggle, "spirit-level": C.SpiritLevel, "needle-gauge": C.NeedleGauge, "detent-knob": C.DetentKnob,
  "index-drawer": D.IndexDrawer, "due-date-slip": D.DueDateSlip, "dotted-leader": D.DottedLeader, "elastic-rule": D.ElasticRule, annunciator: D.Annunciator, odometer: D.Odometer,
  fader: E.Fader, metronome: E.Metronome, "step-sequencer": E.StepSequencer, "comb-field": E.CombField, "barcode-scan": E.BarcodeScan, "strike-out": E.StrikeOut,
  barograph: F.Barograph, "compass-bearing": F.CompassBearing, "moon-phase": F.MoonPhase, "composing-stick": F.ComposingStick, "kerning-pair": F.KerningPair, "width-axis": F.WidthAxis,
};
