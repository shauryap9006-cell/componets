import { Suspense } from "react";
import { Bench } from "@/bench/Bench";
import { site } from "@/site.config";

export const metadata = { title: `The Bench — ${site.name}` };

export default function WorkshopPage() {
  return <Suspense fallback={<p className="wrap cap py-24">Clearing the bench…</p>}><Bench /></Suspense>;
}
