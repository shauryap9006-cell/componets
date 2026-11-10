import { Suspense } from "react";
import { Gallery } from "@/gallery/Gallery";
import { site } from "@/site.config";

export const metadata = { title: `Gallery — ${site.name}` };

export default function GalleryPage() {
  return (
    <>
      <div className="wrap pb-6 pt-10"><span className="cap">The exhibition</span><h1 className="disp pt-2 text-[clamp(56px,11vw,176px)]">Plates.</h1></div>
      <Suspense fallback={<p className="wrap cap py-24">Hanging the plates…</p>}><Gallery /></Suspense>
    </>
  );
}
