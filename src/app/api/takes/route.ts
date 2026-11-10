import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { byId, nearest } from "@/kit/catalog";
import { FEELS, clampPatch, type ComponentSpec, type Values } from "@/kit/spec";
import { site } from "@/site.config";

export const dynamic = "force-dynamic";
const hits = new Map<string, number[]>();
const limited = (ip: string) => { const now = Date.now(), list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000); list.push(now); hits.set(ip, list); return list.length > 12; };

const RULES = `You are the co-pilot of ${site.name}, a Swiss-minimal library of interface details.
You never write code. You answer with ONE JSON object: {"name": string (2-4 plain words), "why": string (one plain sentence, 14 words or fewer), "patch": object}.
"patch" maps setting keys to new values. Only use keys from the SETTINGS list, inside each safe range. Change 1 to 5 settings.
Design rules: paper, ink and one accent; radius zero; one-pixel hairlines; no bounce; quiet, precise movement; captions in small uppercase mono.
Plain words only: say "Speed", "Feel", "Corners", "See-through", "Moment", "Part". Never say easing, opacity, props, state or variant.
Feels: ${Object.entries(FEELS).map(([k, v]) => `${k} (${v.say})`).join("; ")}.
Craft rubric: readable ink (See-through 55 or more), thumb-sized (Size 0.85 or more), at least three kinds of detail, a calm alternative.
Return only the JSON object. No prose, no code fences.`;
const TEMPER = { Faithful: "Do exactly what was asked, nothing more.", Adventurous: "Do what was asked, then push one further setting in the same spirit.", Minimal: "Do what was asked with the fewest, smallest changes." };

function describe(spec: ComponentSpec, values: Values) {
  return `DETAIL: ${spec.name} — ${spec.pitch}\nPARTS: ${spec.parts.map((p) => `${p.n} ${p.name} [${p.loupe.join(",")}]`).join("; ")}\nSETTINGS:\n${spec.settings.map((s) => `- ${s.key} (${s.label}; ${s.type}${s.type === "range" ? ` safe ${s.safe?.[0]}..${s.safe?.[1]} step ${s.step ?? 1}` : s.type === "choice" ? ` one of ${s.options!.join("|")}` : ""}) now ${JSON.stringify(values[s.key] ?? s.def)}`).join("\n")}`;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const body = await req.json().catch(() => null);
  const spec: ComponentSpec | undefined = body ? byId(String(body.specId)) : undefined;
  if (!spec) return NextResponse.json({ error: "Unknown detail." }, { status: 400 });
  const say = String(body.say ?? "").slice(0, 400), part = String(body.part ?? "").slice(0, 60);
  const values: Values = { ...Object.fromEntries(spec.settings.map((s) => [s.key, s.def])), ...clampPatch(spec, body.values ?? {}, true) };
  const apiKey = (req.headers.get("x-user-key") || process.env.ANTHROPIC_API_KEY || "").trim();
  if (!apiKey || !say) return NextResponse.json({ takes: [], offline: true });
  if (limited(ip)) return NextResponse.json({ takes: [], offline: true, error: "Too many requests. Wait a minute." }, { status: 429 });

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
  const examples = nearest(say, 6).map((s) => `${s.name}: verb ${s.verb}; ${s.tagline}`).join("\n");
  const one = async (temper: keyof typeof TEMPER) => {
    let feedback = "";
    for (let attempt = 0; attempt < 3; attempt++) { // generate → validate → repair (max 2 retries)
      try {
        const res = await client.messages.create({
          model, max_tokens: 300,
          system: [{ type: "text", text: RULES, cache_control: { type: "ephemeral" } }, { type: "text", text: `NEAREST LIBRARY DETAILS\n${examples}` }],
          messages: [{ role: "user", content: `${describe(spec, values)}\n\nSCOPE: ${part || "the whole detail"}\nTEMPERAMENT: ${temper}. ${TEMPER[temper]}\nREQUEST: ${say}${feedback}` }],
        });
        const text = res.content.map((c) => (c.type === "text" ? c.text : "")).join("");
        const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
        const patch = clampPatch(spec, json.patch ?? {});
        const changed = Object.fromEntries(Object.entries(patch).filter(([k, v]) => values[k] !== v));
        if (!Object.keys(changed).length) { feedback = "\n\nYour last answer changed nothing valid. Use only listed keys and safe ranges."; continue; }
        return { name: String(json.name ?? temper).slice(0, 40), why: String(json.why ?? "").slice(0, 160), patch: changed, temper };
      } catch (e) { feedback = `\n\nYour last answer could not be read (${String((e as Error).message).slice(0, 80)}). Return one JSON object only.`; }
    }
    return null;
  };
  const takes = (await Promise.all((Object.keys(TEMPER) as (keyof typeof TEMPER)[]).map(one))).filter(Boolean);
  return NextResponse.json({ takes, offline: takes.length === 0 });
}
