import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { plateStats } from "@/db/schema";
import { byId } from "@/kit/catalog";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  try {
    const [row] = await db.select().from(plateStats).where(eq(plateStats.slug, slug));
    return NextResponse.json({ code: row?.codeCopies ?? 0, prompt: row?.promptCopies ?? 0 });
  } catch { return NextResponse.json({ code: 0, prompt: 0 }); }
}

export async function POST(req: Request) {
  const { slug, kind } = await req.json().catch(() => ({}));
  if (!byId(String(slug)) || (kind !== "code" && kind !== "prompt")) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    await db.insert(plateStats).values({ slug, codeCopies: kind === "code" ? 1 : 0, promptCopies: kind === "prompt" ? 1 : 0 })
      .onConflictDoUpdate({ target: plateStats.slug, set: kind === "code" ? { codeCopies: sql`${plateStats.codeCopies} + 1`, updatedAt: new Date() } : { promptCopies: sql`${plateStats.promptCopies} + 1`, updatedAt: new Date() } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ ok: false }, { status: 500 }); }
}
