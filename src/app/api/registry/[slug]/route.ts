import { byId } from "@/kit/catalog";
import { generatePlateCode } from "@/kit/source-provider";

export const dynamic = "force-dynamic";

function respond(slug: string, values: Record<string, unknown>) {
  const spec = byId(slug);
  if (!spec) return new Response("Unknown plate.", { status: 404 });
  const out = generatePlateCode(spec, values);
  if (!out) return new Response("Source not found.", { status: 404 });
  return new Response(out, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) {
  return respond((await ctx.params).slug, {});
}

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const body = await req.json().catch(() => ({}));
  return respond((await ctx.params).slug, body?.values ?? {});
}
