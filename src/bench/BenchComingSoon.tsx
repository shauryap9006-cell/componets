"use client";

import { useState } from "react";
import { Cue, useDirector } from "@/director/Director";
import { site } from "@/site.config";

const Crop = () => (
  <>
    {[
      "-left-3 -top-3 border-b border-r",
      "-right-3 -top-3 border-b border-l",
      "-left-3 -bottom-3 border-t border-r",
      "-right-3 -bottom-3 border-t border-l",
    ].map((c) => (
      <i key={c} aria-hidden className={`absolute size-3 border-ink/50 ${c}`} />
    ))}
  </>
);

const UPCOMING_FEATURES = [
  {
    num: "01",
    tag: "CO-PILOT LATHE",
    title: "Natural Language Synthesis",
    subtitle: "AI Component Foundry",
    desc: "Describe any kinetic detail in plain words — “a button with the inertia of a railway switch” or “a dial that clicks like an optical micrometer”. The embedded Anthropic Claude engine parses your intent, extracts spatial constraints, and outputs verified parameter patches across all 107 baseline plates.",
    spec: "ANTHROPIC API · ZERO-PROSE JSON PATCHES · SAFE-RANGE ENFORCEMENT",
  },
  {
    num: "02",
    tag: "MICROMETER",
    title: "Sub-Pixel Parameter Tuning",
    subtitle: "Tactile Physical Calibration",
    desc: "Dissect any component on the inspection table. Interactively dial hairline line-weights (0.5px to 2.5px), mechanical spring tensions, ballistic gauge dampening, and optical type tracking. Test edge moments: rest, hover, keyboard focus, and signature journeys.",
    spec: "REALTIME CSS TOKENS (--LN, --SP, --EZ) · INSTANT FOLEY FEEDBACK",
  },
  {
    num: "03",
    tag: "MULTI-TARGET FAB",
    title: "Zero-Lockin Code Export",
    subtitle: "Universal Build Pipelines",
    desc: "Fabricate self-contained code for any environment with zero external runtime dependencies. Export pure React 19 + Tailwind CSS v4 source, drop-in HTML/CSS embeds for Framer, Webflow, and Shopify Liquid, or structured prompt manifests for autonomous AI agents.",
    spec: "STANDALONE REACT 19 · AGENT SPEC SHEETS · ZERO NPM PACKAGES",
  },
  {
    num: "04",
    tag: "LOCAL SANDBOX",
    title: "Zero-Account Workspace",
    subtitle: "Browser-Kept Persistence",
    desc: "No accounts, no tracking cookies, and no database vendor lock-in. Everything you forge on the Bench persists directly in your local browser state with cryptographically compact permalinks so you can share exact instrument setups with your team.",
    spec: "INDEXEDDB LOCAL STORAGE · CRYPTO HASH SHARING · CLIENT-ONLY",
  },
];

const PREVIEW_PROMPTS = [
  "A split-flap board that shuffles like a Bern train station",
  "A vernier slider that measures with 0.1mm optical tick marks",
  "An envelope card that breaks its wax seal on click",
  "A dual gauge with ballistic needle overshoot and damping",
  "A rotary dial that clicks with authentic mechanical detents",
  "A loading pendulum that settles with natural gravity decay",
];

export function BenchComingSoon() {
  const { foley } = useDirector();
  const [selectedPrompt, setSelectedPrompt] = useState(PREVIEW_PROMPTS[0]);
  const [caliperVal, setCaliperVal] = useState(42);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="wrap py-10 sm:py-16">
      {/* ─── Breadcrumb & Station Meta Bar ─── */}
      <div className="cap flex flex-wrap items-center justify-between gap-4 border-b border-ink/30 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            <i className="inline-block size-2 animate-pulse bg-accent" />
            STATION 02 · THE BENCH
          </span>
          <span className="opacity-40">/</span>
          <span className="text-accent font-semibold">[ COMING SOON ]</span>
        </div>
        <div className="flex items-center gap-6 opacity-60">
          <span>TARGET: Q2 2026</span>
          <span className="hidden sm:inline">107 FIG. SPECIMENS</span>
          <span>DEV STATUS: ACTIVE CALIBRATION</span>
        </div>
      </div>

      {/* ─── Hero Section ─── */}
      <section className="relative mt-10 border border-ink bg-paper p-8 sm:p-14">
        <Crop />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="cap bg-ink px-2.5 py-1 text-paper">SPECIFICATION & SYNTHESIS LABORATORY</span>
          <span className="cap-s border border-ink/40 px-2 py-0.5 opacity-70">REV. 2026.11 · VOL. 01</span>
        </div>

        <h1 className="disp mt-6 text-[clamp(44px,9vw,132px)] leading-[0.88] tracking-tight">
          THE BENCH<span className="text-accent">.</span>
        </h1>

        <div className="mt-6 max-w-[54ch]">
          <p className="text-[clamp(20px,2.6vw,32px)] font-medium leading-[1.18] tracking-tight text-ink">
            An open-air instrument workshop where interface details are not merely configured, but machined.
          </p>
          <p className="mt-4 text-[16px] sm:text-[18px] leading-relaxed text-ink/75">
            The Bench is currently being forged as a full-fledged visual and generative IDE. Soon you will be able to
            lift any of the 107 museum plates onto the table, modify its mechanical behavior through conversational AI,
            calibrate its hairline geometry down to the sub-pixel, and export zero-dependency production code in seconds.
          </p>
        </div>

        {/* ─── Status Badge Banner ─── */}
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-ink/30 pt-6">
          <div className="flex items-center gap-3 bg-plate border border-ink/40 px-4 py-2.5">
            <span className="cap text-accent">STATUS:</span>
            <span className="cap text-ink font-medium">Core Plate Engine Complete · AI Lathe in Assembly</span>
          </div>
          <Cue href="/gallery" className="btn btn-p !h-11">
            Browse 107 Ready Plates →
          </Cue>
          <Cue href="/docs" className="btn !h-11">
            Read System Docs
          </Cue>
        </div>
      </section>

      {/* ─── Interactive Mechanical Preview Box ─── */}
      <section className="mt-16 border border-ink bg-plate p-6 sm:p-10" aria-label="Interactive preview">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/20 pb-4">
          <div>
            <span className="cap text-accent font-semibold">PREVIEW THE EXPERIENCE</span>
            <h2 className="text-[26px] font-medium leading-none tracking-tight pt-1">
              Precision Hairline Calibrator
            </h2>
          </div>
          <span className="cap-s opacity-60">TESTING BENCH VIRTUAL TACTILITY</span>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-8 lg:grid-cols-12">
          {/* Calibrator Stage */}
          <div className="relative flex flex-col justify-between border border-ink bg-paper p-6 lg:col-span-7">
            <div className="cap flex items-center justify-between text-ink/70">
              <span>FIG. 000 · OPTICAL VERNIER SLIDER</span>
              <span className="tabular-nums font-mono">{(caliperVal / 10).toFixed(1)} mm</span>
            </div>

            {/* Live Visual Ruler */}
            <div className="my-10 relative h-20 w-full overflow-hidden border-y border-ink bg-plate flex items-center px-4">
              <div
                className="absolute inset-y-0 w-px bg-accent z-10 transition-transform duration-75"
                style={{ left: `${caliperVal}%` }}
              >
                <span className="cap-s absolute -top-5 -translate-x-1/2 bg-accent px-1 text-[10px] text-paper">
                  {caliperVal}
                </span>
                <i className="absolute -bottom-1 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-accent" />
              </div>
              <div className="w-full flex justify-between opacity-30 select-none">
                {Array.from({ length: 41 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-px bg-ink ${i % 5 === 0 ? "h-8" : i % 2 === 0 ? "h-5" : "h-3"}`}
                  />
                ))}
              </div>
            </div>

            {/* Slider control */}
            <div className="flex flex-col gap-2">
              <div className="cap flex justify-between text-ink/60">
                <span>0.0 MM (REST)</span>
                <span>VERNIER TRAVEL</span>
                <span>10.0 MM (MAX TRAVEL)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={caliperVal}
                aria-label="Caliper reading"
                onChange={(e) => {
                  setCaliperVal(Number(e.target.value));
                  if (Number(e.target.value) % 5 === 0) foley("tick");
                }}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          {/* Prompt Lathe Simulator */}
          <div className="flex flex-col justify-between border border-ink bg-paper p-6 lg:col-span-5">
            <div>
              <span className="cap text-accent">UPCOMING AI PROMPT ENGINE</span>
              <h3 className="pt-2 text-[19px] font-medium leading-snug">
                Click a recipe to simulate what The Bench will fabricate:
              </h3>
              <div className="mt-4 flex flex-col gap-2">
                {PREVIEW_PROMPTS.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPrompt(p);
                      foley("clack");
                    }}
                    className={`cap-s text-left border p-2.5 transition-colors ${
                      selectedPrompt === p
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/30 bg-paper hover:border-ink hover:bg-plate text-ink"
                    }`}
                  >
                    “{p}”
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-ink/20 pt-3">
              <span className="cap-s opacity-60">SYNTHESIS OUTPUT PREVIEW:</span>
              <p className="cap mt-1 text-[11px] text-accent font-mono truncate">
                MATCH FOUND: FIG. 001 · PATCH: &#123; speed: 1.25, line: 1.0, feel: &quot;railway&quot; &#125;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 Pillars: What It's Gonna Be ─── */}
      <section className="mt-16" aria-label="Upcoming capabilities">
        <div className="border-b border-ink pb-3">
          <span className="cap text-accent">BLUEPRINTS & SPECIFICATION</span>
          <h2 className="text-[clamp(28px,4vw,44px)] font-medium leading-tight tracking-tight pt-1">
            What The Bench is going to be
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px border border-ink bg-ink sm:grid-cols-2">
          {UPCOMING_FEATURES.map((feat) => (
            <div key={feat.num} className="flex flex-col justify-between bg-paper p-6 sm:p-8">
              <div>
                <div className="flex items-baseline justify-between border-b border-ink/20 pb-3">
                  <span className="disp text-[28px] text-accent">{feat.num}</span>
                  <span className="cap text-ink/60">{feat.tag}</span>
                </div>
                <h3 className="mt-4 text-[22px] font-medium leading-tight tracking-tight text-ink">
                  {feat.title}
                </h3>
                <h4 className="cap-s mt-1 text-accent font-semibold">{feat.subtitle}</h4>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{feat.desc}</p>
              </div>

              <div className="mt-6 border-t border-ink/20 pt-3">
                <span className="cap-s text-[10px] text-ink/60">{feat.spec}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Planned Workflow Roadmap ─── */}
      <section className="mt-16 border border-ink bg-paper p-6 sm:p-10" aria-label="Development phases">
        <span className="cap text-accent">DEVELOPMENT PHASES & ROADMAP</span>
        <h2 className="mt-2 text-[28px] font-medium leading-tight tracking-tight">
          Three stages of lathe fabrication
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="border border-ink/30 p-5 bg-plate">
            <div className="flex items-center justify-between">
              <span className="cap text-accent">PHASE 01 · COMPLETE</span>
              <span className="text-xs font-mono font-bold">100%</span>
            </div>
            <h3 className="mt-2 text-[18px] font-medium">107 Museum Plates</h3>
            <p className="mt-2 text-[14px] text-ink/70 leading-normal">
              Unified design contract across 107 plates, 17 unified variants, 0 npm dependencies, and verified
              type-safe catalog.
            </p>
          </div>

          <div className="border border-ink p-5 bg-paper relative">
            <div className="flex items-center justify-between">
              <span className="cap text-accent font-bold">PHASE 02 · CURRENT</span>
              <span className="text-xs font-mono font-bold text-accent">IN PROGRESS</span>
            </div>
            <h3 className="mt-2 text-[18px] font-medium">Real-Time Inspection & Tuning</h3>
            <p className="mt-2 text-[14px] text-ink/70 leading-normal">
              Building visual calibration knobs, live tactile stage previews, and browser-local state storage without
              accounts.
            </p>
          </div>

          <div className="border border-ink/30 p-5 bg-plate">
            <div className="flex items-center justify-between">
              <span className="cap opacity-60">PHASE 03 · NEXT</span>
              <span className="text-xs font-mono opacity-60">QUEUED</span>
            </div>
            <h3 className="mt-2 text-[18px] font-medium">Claude Generative Foundry</h3>
            <p className="mt-2 text-[14px] text-ink/70 leading-normal">
              Full live prompt integration via Anthropic Claude 3.5 API for dynamic component mutation and multi-target
              export.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer Action Callout ─── */}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-ink pt-8">
        <div>
          <span className="cap text-ink/60">MEANWHILE IN THE EXHIBITION</span>
          <p className="text-[20px] font-medium text-ink">
            Every component can still be explored, customized, and copied directly from the gallery.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Cue href="/gallery" className="btn btn-p">
            Explore All 107 Plates →
          </Cue>
          <Cue href="/" className="btn">
            Back to Index
          </Cue>
        </div>
      </div>
    </div>
  );
}
