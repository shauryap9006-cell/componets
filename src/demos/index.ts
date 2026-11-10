import type { ComponentType, LazyExoticComponent } from "react";
import React, { lazy } from "react";
import type { DemoProps } from "@/kit/spec";

export type DemoLoader = () => Promise<ComponentType<DemoProps>>;

/** Mechanism library: on-demand lazy loaders per spec id. */
export const DEMO_LOADERS: Record<string, DemoLoader> = {
  // Batch A
  "perforated-tear": () => import("./a").then((m) => m.PerforatedTear),
  postmark: () => import("./a").then((m) => m.Postmark),
  "envelope-flap": () => import("./a").then((m) => m.EnvelopeFlap),
  "arrow-relay": () => import("./a").then((m) => m.ArrowRelay),
  "split-flap": () => import("./a").then((m) => m.SplitFlap),
  "ticket-punch": () => import("./a").then((m) => m.TicketPunch),

  // Batch B
  misregister: () => import("./b").then((m) => m.Misregister),
  "halftone-dial": () => import("./b").then((m) => m.HalftoneDial),
  "ink-pull": () => import("./b").then((m) => m.InkPull),
  "caliper-slider": () => import("./b").then((m) => m.CaliperSlider),
  "dimension-input": () => import("./b").then((m) => m.DimensionInput),
  "section-cut": () => import("./b").then((m) => m.SectionCut),
  "moire-field": () => import("./b").then((m) => m.MoireField),

  // Batch C
  develop: () => import("./c").then((m) => m.Develop),
  "contact-sheet": () => import("./c").then((m) => m.ContactSheet),
  "shutter-toggle": () => import("./c").then((m) => m.ShutterToggle),
  "spirit-level": () => import("./c").then((m) => m.SpiritLevel),
  "needle-gauge": () => import("./c").then((m) => m.NeedleGauge),
  "detent-knob": () => import("./c").then((m) => m.DetentKnob),

  // Batch D
  "index-drawer": () => import("./d").then((m) => m.IndexDrawer),
  "due-date-slip": () => import("./d").then((m) => m.DueDateSlip),
  "dotted-leader": () => import("./d").then((m) => m.DottedLeader),
  "elastic-rule": () => import("./d").then((m) => m.ElasticRule),
  annunciator: () => import("./d").then((m) => m.Annunciator),
  odometer: () => import("./d").then((m) => m.Odometer),

  // Batch E
  fader: () => import("./e").then((m) => m.Fader),
  metronome: () => import("./e").then((m) => m.Metronome),
  "step-sequencer": () => import("./e").then((m) => m.StepSequencer),
  "comb-field": () => import("./e").then((m) => m.CombField),
  "barcode-scan": () => import("./e").then((m) => m.BarcodeScan),
  "strike-out": () => import("./e").then((m) => m.StrikeOut),

  // Batch F
  barograph: () => import("./f").then((m) => m.Barograph),
  "compass-bearing": () => import("./f").then((m) => m.CompassBearing),
  "moon-phase": () => import("./f").then((m) => m.MoonPhase),
  "composing-stick": () => import("./f").then((m) => m.ComposingStick),
  "kerning-pair": () => import("./f").then((m) => m.KerningPair),
  "width-axis": () => import("./f").then((m) => m.WidthAxis),

  // Batch G
  "rubber-stamp": () => import("./g").then((m) => m.RubberStamp),
  "signal-lever": () => import("./g").then((m) => m.SignalLever),
  "plotter-sparkline": () => import("./g").then((m) => m.PlotterSparkline),
  "tally-counter": () => import("./g").then((m) => m.TallyCounter),
  "queue-ticket": () => import("./g").then((m) => m.QueueTicket),
  "postage-meter": () => import("./g").then((m) => m.PostageMeter),
  "safety-interlock": () => import("./g").then((m) => m.SafetyInterlock),
  "signal-lamp": () => import("./g").then((m) => m.SignalLamp),

  // Batch H
  "counting-preloader": () => import("./h").then((m) => m.CountingPreloader),
  "line-draw-loader": () => import("./h").then((m) => m.LineDrawLoader),
  "dot-wave-loader": () => import("./h").then((m) => m.DotWaveLoader),
  "clock-hand-loader": () => import("./h").then((m) => m.ClockHandLoader),
  "block-cursor-loader": () => import("./h").then((m) => m.BlockCursorLoader),
  "sundial-clock": () => import("./h").then((m) => m.SundialClock),
  "star-chart": () => import("./h").then((m) => m.StarChart),
  "analog-clock": () => import("./h").then((m) => m.AnalogClock),
  "seven-segment": () => import("./h").then((m) => m.SevenSegment),
  stopwatch: () => import("./h").then((m) => m.Stopwatch),
  "ticker-clock": () => import("./h").then((m) => m.TickerClock),
  "film-leader": () => import("./h").then((m) => m.FilmLeader),

  // Batch I
  "patch-bay": () => import("./i").then((m) => m.PatchBay),
  teleprinter: () => import("./i").then((m) => m.Teleprinter),
  "scrubbable-number": () => import("./i").then((m) => m.ScrubbableNumber),
  "combination-lock": () => import("./i").then((m) => m.CombinationLock),
  protractor: () => import("./i").then((m) => m.Protractor),
  "file-dropzone": () => import("./i").then((m) => m.FileDropzone),
  "shortcut-recorder": () => import("./i").then((m) => m.ShortcutRecorder),

  // Batch J
  "scramble-decode": () => import("./j").then((m) => m.ScrambleDecode),
  "rolling-numerals": () => import("./j").then((m) => m.RollingNumerals),
  "outline-numerals": () => import("./j").then((m) => m.OutlineNumerals),
  "running-head": () => import("./j").then((m) => m.RunningHead),
  "ticker-tape": () => import("./j").then((m) => m.TickerTape),
  "kerning-rope": () => import("./j").then((m) => m.KerningRope),
  "redline-diff": () => import("./j").then((m) => m.RedlineDiff),
  "misregistration-text": () => import("./j").then((m) => m.MisregistrationText),
  sparkwords: () => import("./j").then((m) => m.Sparkwords),
  "type-on-grid": () => import("./j").then((m) => m.TypeOnGrid),
  "dither-image": () => import("./j").then((m) => m.DitherImage),
  "ascii-image": () => import("./j").then((m) => m.AsciiImage),
  "scan-line-reveal": () => import("./j").then((m) => m.ScanLineReveal),
  "before-after": () => import("./j").then((m) => m.BeforeAfter),
  "waveform-player": () => import("./j").then((m) => m.WaveformPlayer),
  "perforated-frame": () => import("./j").then((m) => m.PerforatedFrame),
  "small-multiples": () => import("./j").then((m) => m.SmallMultiples),
  "risograph-image": () => import("./j").then((m) => m.RisographImage),
  letterpress: () => import("./j").then((m) => m.Letterpress),
  "crop-frame": () => import("./j").then((m) => m.CropFrame),
  "tear-card": () => import("./j").then((m) => m.TearCard),
  dossier: () => import("./j").then((m) => m.Dossier),
  "aperture-tip": () => import("./j").then((m) => m.ApertureTip),
  "declaration-dialog": () => import("./j").then((m) => m.DeclarationDialog),

  // Batch K
  "heatmap-calendar": () => import("./k").then((m) => m.HeatmapCalendar),
  "typographic-bars": () => import("./k").then((m) => m.TypographicBars),
  "line-chart-scrub": () => import("./k").then((m) => m.LineChartScrub),
  "radial-tick-gauge": () => import("./k").then((m) => m.RadialTickGauge),
  "dumbbell-chart": () => import("./k").then((m) => m.DumbbellChart),
  "hairline-treemap": () => import("./k").then((m) => m.HairlineTreemap),
  "ribbon-flow": () => import("./k").then((m) => m.RibbonFlow),
  "leaderboard-flip": () => import("./k").then((m) => m.LeaderboardFlip),
  "live-ticker-table": () => import("./k").then((m) => m.LiveTickerTable),
  "hatching-chart": () => import("./k").then((m) => m.HatchingChart),
  "isometric-stack": () => import("./k").then((m) => m.IsometricStack),
  "bullet-graph": () => import("./k").then((m) => m.BulletGraph),
  slopegraph: () => import("./k").then((m) => m.Slopegraph),
  "bauhaus-generator": () => import("./k").then((m) => m.BauhausGenerator),
  "flow-field": () => import("./k").then((m) => m.FlowField),
  seismograph: () => import("./k").then((m) => m.Seismograph),
  "vu-meter": () => import("./k").then((m) => m.VuMeter),
  "punch-card": () => import("./k").then((m) => m.PunchCard),
  "countdown-toast": () => import("./k").then((m) => m.CountdownToast),
};

const lazyCache = new Map<string, LazyExoticComponent<ComponentType<DemoProps>>>();

export function getLazyDemo(id: string): LazyExoticComponent<ComponentType<DemoProps>> | null {
  const loader = DEMO_LOADERS[id];
  if (!loader) return null;
  let comp = lazyCache.get(id);
  if (!comp) {
    comp = lazy(async () => {
      const Comp = await loader();
      return { default: Comp };
    });
    lazyCache.set(id, comp);
  }
  return comp;
}

export function preloadDemo(id: string): void {
  const loader = DEMO_LOADERS[id];
  if (loader) {
    loader().catch(() => {});
  }
}

export const DEMOS: Record<string, LazyExoticComponent<ComponentType<DemoProps>>> = new Proxy(
  {} as Record<string, LazyExoticComponent<ComponentType<DemoProps>>>,
  {
    get: (_, prop: string) => getLazyDemo(prop) ?? undefined,
    has: (_, prop: string) => prop in DEMO_LOADERS,
    ownKeys: () => Object.keys(DEMO_LOADERS),
    getOwnPropertyDescriptor: (_, prop: string) =>
      prop in DEMO_LOADERS
        ? { enumerable: true, configurable: true, value: getLazyDemo(prop) }
        : undefined,
  }
);
