import { notFound } from "next/navigation";
import { CATALOG, byId } from "@/kit/catalog";
import { site } from "@/site.config";
import { DetailView } from "./DetailView";

export function generateStaticParams() { return CATALOG.map((s) => ({ slug: s.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = byId((await params).slug);
  return { title: s ? `${s.name} — ${site.name}` : site.name, description: s?.description };
}
export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!byId(slug)) notFound();
  return <DetailView slug={slug} />;
}
