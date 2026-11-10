import type { ComponentType } from "react";
import type { DemoProps } from "@/kit/spec";
import * as A from "./a";
import * as B from "./b";
import * as C from "./c";
import * as D from "./d";
import * as E from "./e";
import * as F from "./f";
import * as G from "./g";
import * as H from "./h";
import * as I from "./i";
import * as J from "./j";

/** Mechanism library: one hand-built renderer per spec id. */
export const DEMOS: Record<string, ComponentType<DemoProps>> = {
  "perforated-tear": A.PerforatedTear, postmark: A.Postmark, "envelope-flap": A.EnvelopeFlap, "arrow-relay": A.ArrowRelay, "split-flap": A.SplitFlap, "ticket-punch": A.TicketPunch,
  misregister: B.Misregister, "halftone-dial": B.HalftoneDial, "ink-pull": B.InkPull, "caliper-slider": B.CaliperSlider, "dimension-input": B.DimensionInput, "section-cut": B.SectionCut, "moire-field": B.MoireField,
  develop: C.Develop, "contact-sheet": C.ContactSheet, "shutter-toggle": C.ShutterToggle, "spirit-level": C.SpiritLevel, "needle-gauge": C.NeedleGauge, "detent-knob": C.DetentKnob,
  "index-drawer": D.IndexDrawer, "due-date-slip": D.DueDateSlip, "dotted-leader": D.DottedLeader, "elastic-rule": D.ElasticRule, annunciator: D.Annunciator, odometer: D.Odometer,
  fader: E.Fader, metronome: E.Metronome, "step-sequencer": E.StepSequencer, "comb-field": E.CombField, "barcode-scan": E.BarcodeScan, "strike-out": E.StrikeOut,
  barograph: F.Barograph, "compass-bearing": F.CompassBearing, "moon-phase": F.MoonPhase, "composing-stick": F.ComposingStick, "kerning-pair": F.KerningPair, "width-axis": F.WidthAxis,
  "rubber-stamp": G.RubberStamp, "signal-lever": G.SignalLever, "plotter-sparkline": G.PlotterSparkline, "tally-counter": G.TallyCounter,
  "queue-ticket": G.QueueTicket, "postage-meter": G.PostageMeter, "safety-interlock": G.SafetyInterlock, "signal-lamp": G.SignalLamp,
  "counting-preloader": H.CountingPreloader, "line-draw-loader": H.LineDrawLoader, "dot-wave-loader": H.DotWaveLoader, "clock-hand-loader": H.ClockHandLoader, "block-cursor-loader": H.BlockCursorLoader,
  "sundial-clock": H.SundialClock, "star-chart": H.StarChart, "analog-clock": H.AnalogClock, "seven-segment": H.SevenSegment, stopwatch: H.Stopwatch, "ticker-clock": H.TickerClock, "film-leader": H.FilmLeader,
  "patch-bay": I.PatchBay, teleprinter: I.Teleprinter, "scrubbable-number": I.ScrubbableNumber, "combination-lock": I.CombinationLock, protractor: I.Protractor, "file-dropzone": I.FileDropzone, "shortcut-recorder": I.ShortcutRecorder,
  "scramble-decode": J.ScrambleDecode, "rolling-numerals": J.RollingNumerals, "outline-numerals": J.OutlineNumerals, "running-head": J.RunningHead, "ticker-tape": J.TickerTape, "kerning-rope": J.KerningRope, "redline-diff": J.RedlineDiff, "misregistration-text": J.MisregistrationText, sparkwords: J.Sparkwords, "type-on-grid": J.TypeOnGrid,
  "dither-image": J.DitherImage, "ascii-image": J.AsciiImage, "scan-line-reveal": J.ScanLineReveal, "before-after": J.BeforeAfter, "waveform-player": J.WaveformPlayer, "perforated-frame": J.PerforatedFrame, "small-multiples": J.SmallMultiples, "risograph-image": J.RisographImage,
  letterpress: J.Letterpress, "crop-frame": J.CropFrame, "tear-card": J.TearCard, dossier: J.Dossier, "aperture-tip": J.ApertureTip, "declaration-dialog": J.DeclarationDialog,
};
