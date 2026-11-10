import { CATALOG, ROOMS } from "@/kit/catalog";
import { FEELS, SHARED } from "@/kit/spec";
import { site } from "@/site.config";

export const metadata = { title: `Docs — ${site.name}` };

export default function Docs() {
  const verbs = CATALOG.map((s) => s.verb);
  const uncommon = Math.round((CATALOG.filter((s) => s.uncommon).length / CATALOG.length) * 100);
  return (
    <article className="wrap pb-12 pt-10">
      <span className="cap">Docs · one page</span>
      <h1 className="disp pt-2 text-[clamp(56px,11vw,176px)]">{site.docs.title}</h1>
      <div className="g12 gap-y-12 pt-16">
        {site.docs.sections.map((s, i) => (
          <section key={s.h} className="col-span-12 border-t border-ink pt-3 md:col-span-6 lg:col-span-4">
            <span className="cap opacity-60">{String(i + 1).padStart(2, "0")}</span><h2 className="pt-6 text-[32px] font-medium leading-9">{s.h}</h2><p className="max-w-[34ch] pt-2 text-[18px] leading-7 text-ink/75">{s.p}</p>
          </section>
        ))}
        <section className="col-span-12 border-t border-ink pt-3"><h2 className="cap pb-6">Themes · paper, ink and exactly one accent</h2>
          <div className="grid grid-cols-2 gap-px border border-ink bg-ink md:grid-cols-3 lg:grid-cols-6">{site.themes.map((t) => <div key={t.key} data-theme={t.key} className="flex h-40 flex-col justify-between p-4" style={{ background: "var(--paper)", color: "var(--ink)" }}><span className="cap">{t.label}</span><span className="flex items-end justify-between"><span className="text-[40px] font-medium leading-none tracking-tight">Aa</span><i className="block size-6" style={{ background: "var(--accent)" }} /></span></div>)}</div></section>
        <section className="col-span-12 border-t border-ink pt-3 lg:col-span-7"><h2 className="cap pb-6">The Kit · shared settings and their good ranges</h2>
          <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left"><tbody>{SHARED.map((s) => <tr key={s.key} className="border-b border-ink/30 align-baseline"><td className="py-2 pr-4 text-[17px] font-medium">{s.label}</td><td className="cap pr-4">{s.group}</td><td className="cap pr-4 tabular-nums">{s.type === "range" ? `${s.safe![0]} – ${s.safe![1]} ${s.unit ?? ""}` : s.type === "choice" ? s.options!.join(" / ") : "on / off"}</td><td className="py-2 text-[15px] text-ink/70">{s.why}</td></tr>)}</tbody></table></div></section>
        <section className="col-span-12 border-t border-ink pt-3 lg:col-span-5"><h2 className="cap pb-6">Feels · bounce is never offered</h2>
          <dl>{Object.entries(FEELS).map(([k, f]) => <div key={k} className="border-b border-ink/30 py-3"><dt className="flex items-baseline justify-between gap-4"><span className="text-[22px] font-medium tracking-tight">{k}</span><span className="cap-s opacity-60">{f.ease}</span></dt><dd className="text-[16px] text-ink/70">{f.say}</dd></div>)}</dl></section>
        <section className="col-span-12 border-t border-ink pt-3 lg:col-span-7"><h2 className="cap pb-6">The census · counted from the catalog, not claimed</h2>
          <dl>{([["Plates", String(CATALOG.length)], ["Unique verbs", `${new Set(verbs).size} of ${verbs.length}`], ["Uncommon", `${uncommon}%`], ["Theatre ★ / Specimen / Instrument", `${CATALOG.filter((s) => s.kind === "theatre").length} / ${CATALOG.filter((s) => s.kind === "specimen").length} / ${CATALOG.filter((s) => s.kind === "instrument").length}`], ["Largest room", `${Math.round((Math.max(...ROOMS.map((r) => r.plates.length)) / CATALOG.length) * 100)}% of the catalog`], ["Settings per plate", `${Math.min(...CATALOG.map((s) => s.settings.length))} – ${Math.max(...CATALOG.map((s) => s.settings.length))}`], ["Author", site.author.name]] as [string, string][]).map(([k, v]) => <div key={k} className="cap flex justify-between gap-6 border-b border-ink/30 py-2"><dt className="opacity-60">{k}</dt><dd>{v}</dd></div>)}</dl></section>
        <section className="col-span-12 border-t border-ink pt-3 lg:col-span-5"><h2 className="cap pb-6">Plain words</h2>
          <dl>{Object.entries(site.bench.plain).map(([k, v]) => <div key={k} className="border-b border-ink/30 py-2"><dt className="text-[17px] font-medium">{k}</dt><dd className="text-[15px] text-ink/70">{v}</dd></div>)}</dl></section>
        <section className="col-span-12 border-t border-ink pt-3"><h2 className="cap pb-6">Verbs · one each</h2><p className="text-[clamp(22px,3vw,40px)] font-medium leading-[1.2] tracking-tight">{verbs.join(" · ")}.</p></section>
      </div>
    </article>
  );
}
