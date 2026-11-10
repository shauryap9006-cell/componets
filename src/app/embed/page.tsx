"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { byId } from "@/kit/catalog";
import { Stage } from "@/kit/Stage";
import { clampPatch } from "@/kit/spec";
import { decodeShare } from "@/kit/yours";
import { site } from "@/site.config";

/** Shared links and embeds render from the declarative spec only. No code travels in the link. */
function Embed() {
  const sp = useSearchParams();
  const [play, setPlay] = useState(0);
  const data = decodeShare(sp.get("d") ?? ""), spec = data ? byId(data.b) : byId(sp.get("id") ?? "");
  if (!spec) return <p className="cap grid min-h-dvh place-items-center">This link holds no detail.</p>;
  const values = data ? clampPatch(spec, data.v, true) : {}, page = sp.get("page") === "1";
  return (
    <div className={page ? "mx-auto flex min-h-dvh max-w-[880px] flex-col justify-center gap-5 p-6" : "h-dvh p-4"} onDoubleClick={() => setPlay((p) => p + 1)}>
      <div className={page ? "relative aspect-[4/3] border border-ink bg-plate p-8" : "size-full"}><Stage spec={spec} values={values} play={play} k={page ? 1.4 : 1} yours={!!data} /></div>
      {page && (
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-ink/30 pt-4">
          <div><span className="cap">Made on the Bench · from {spec.name}</span><h1 className="text-[32px] font-medium leading-9">{String(data?.n ?? spec.name).slice(0, 60)}</h1><p className="text-[18px] text-ink/75">{spec.description}</p></div>
          <Link href={`/workshop?from=${spec.id}`} className="btn btn-p">{site.actions.mine}</Link>
        </div>
      )}
    </div>
  );
}
export default function EmbedPage() { return <Suspense fallback={null}><Embed /></Suspense>; }
