"use client";
import { type ReactNode, useState } from "react";
import { Cue } from "@/director/Director";
import { Plate } from "@/gallery/Plate";
import { useInView } from "@/kit/act";
import { CATALOG, ROOMS, byId } from "@/kit/catalog";
import { Stage } from "@/kit/Stage";
import { fig } from "@/kit/spec";
import { site } from "@/site.config";

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, seen } = useInView<HTMLDivElement>("-40px");
  return <div ref={ref} className={`${className} ${seen ? "rise" : "opacity-0"}`} style={{ animationDelay: `${delay}ms` }}>{children}</div>;
}
const Crop = () => <>{["-left-3 -top-3 border-b border-r", "-right-3 -top-3 border-b border-l", "-left-3 -bottom-3 border-t border-r", "-right-3 -bottom-3 border-t border-l"].map((c) => <i key={c} aria-hidden className={`absolute size-3 border-ink/50 ${c}`} />)}</>;
const FEATURED = ["split-flap", "caliper-slider", "develop", "spirit-level", "barograph", "strike-out"];

export default function Home() {
  const [play, setPlay] = useState(0);
  const poster = byId("split-flap")!, theatre = CATALOG.filter((s) => s.kind === "theatre").length;
  return (
    <>
      <section className="wrap pt-6" aria-label="Introduction">
        <div className="cap flex flex-wrap justify-between gap-x-8 gap-y-1 border-b border-ink/30 pb-3"><span>Index · Vol. 01</span><span>{String(CATALOG.length).padStart(3, "0")} plates · {ROOMS.length} rooms · {site.themes.length} themes</span><span className="hidden sm:inline">{theatre} theatre pieces ★</span><span>By {site.author.name}</span></div>
        <h1 className="disp -ml-[0.04em] pt-6 text-[clamp(64px,19.4vw,340px)]" data-tok="display · archivo · -0.03em">{site.short}<span className="text-accent">/</span>UI</h1>
        <div className="g12 gap-y-10 pt-8">
          <div className="col-span-12 flex flex-col justify-between gap-8 lg:col-span-5">
            <div><p className="cap">{site.strap}</p><p className="max-w-[30ch] pt-4 text-[clamp(22px,2.4vw,32px)] font-medium leading-[1.15] tracking-tight">{site.lede}</p></div>
            <div className="flex flex-wrap gap-3"><Cue href="/gallery" className="btn btn-p">{site.home.cta}</Cue><Cue href="/workshop" className="btn">{site.home.cta2}</Cue></div>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <div className="relative flex aspect-[16/10] flex-col border border-ink bg-plate p-6" onDoubleClick={() => setPlay((p) => p + 1)}>
              <Crop /><div className="cap flex justify-between"><span>{fig(poster.fig)} · poster</span><button onClick={() => setPlay((p) => p + 1)} aria-label="Replay">↻</button></div>
              <div className="min-h-0 flex-1"><Stage spec={poster} values={{ words: "HAIRLINE DETAILS GALLERY", cells: 8 }} play={play} k={1.5} /></div>
              <div className="cap flex justify-between"><span className="flex items-center gap-2"><i className="block size-2 bg-accent" />Uncommon ★</span><span>{poster.tagline}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap pt-24" aria-label="Rules">
        <ol className="border-t border-ink">{site.home.rules.map((r, i) => <Reveal key={r} delay={i * 24}><li className="g12 items-baseline border-b border-ink/30 py-4"><span className="cap col-span-2 lg:col-span-1">{String(i + 1).padStart(2, "0")}</span><span className="col-span-10 text-[clamp(24px,4vw,56px)] font-medium leading-none tracking-tight lg:col-span-11">{r}</span></li></Reveal>)}</ol>
      </section>

      <section className="wrap g12 gap-y-10 pt-24" aria-label="Three promises">
        <h2 className="cap col-span-12 border-t border-ink pt-3">Three promises</h2>
        {site.home.promises.map((p, i) => <Reveal key={p.n} className="col-span-12 md:col-span-4" delay={i * 72}><span className="disp block text-[96px] text-accent">{p.n}</span><h3 className="pt-4 text-[28px] font-medium leading-8">{p.t}</h3><p className="max-w-[28ch] pt-2 text-[18px] leading-7 text-ink/75">{p.d}</p></Reveal>)}
      </section>

      <section className="wrap pt-24" aria-label="From the exhibition">
        <div className="flex items-end justify-between border-t border-ink pb-10 pt-3"><h2 className="cap">From the exhibition</h2><Cue href="/gallery" className="cap hover:text-accent">All {CATALOG.length} plates →</Cue></div>
        <div className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{FEATURED.map((id) => <Plate key={id} spec={byId(id)!} />)}</div>
      </section>

      <section className="wrap pt-24" aria-label="Rooms">
        <div className="g12 border-t border-ink pt-3"><h2 className="cap col-span-12 pb-8 lg:col-span-3">Twelve rooms</h2>
          <ul className="col-span-12 lg:col-span-9">{ROOMS.map((r) => <li key={r.world}><Cue href="/gallery?mode=rooms" className="group flex items-baseline gap-4 border-b border-ink/30 py-3 hover:border-ink"><span className="cap w-20 shrink-0">Room {String(r.n).padStart(2, "0")}</span><span className="text-[clamp(22px,3vw,40px)] font-medium leading-none tracking-tight transition-transform duration-200 group-hover:translate-x-2 group-hover:text-accent">{r.title}</span><span className="hidden flex-1 truncate text-[16px] text-ink/60 md:block">{r.label}</span><span className="cap ml-auto shrink-0 tabular-nums">{String(r.plates.length).padStart(2, "0")} →</span></Cue></li>)}</ul></div>
      </section>

      <section className="wrap pt-24" aria-label="The Bench">
        <div className="relative border border-ink p-6 sm:p-10"><Crop /><span className="cap">The Bench · make one yourself</span>
          <Cue href="/workshop" className="block pt-6 text-[clamp(36px,8vw,128px)] font-medium leading-[0.92] tracking-tight text-ink/35 hover:text-ink">{site.bench.ask}</Cue>
          <div className="flex flex-wrap gap-2 pt-8">{site.bench.examples.slice(0, 4).map((x) => <Cue key={x} href="/workshop" className="chip !normal-case">{x}</Cue>)}</div></div>
      </section>
    </>
  );
}
