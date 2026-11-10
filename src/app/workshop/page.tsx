import { Suspense } from "react";
import { BenchComingSoon } from "@/bench/BenchComingSoon";
import { site } from "@/site.config";

export const metadata = { title: `The Bench (Coming Soon) — ${site.name}` };

export default function WorkshopPage() {
  return (
    <Suspense fallback={<p className="wrap cap py-24">Clearing the bench…</p>}>
      <BenchComingSoon />
    </Suspense>
  );
}
