import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const dir = path.join(process.cwd(), "src");
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];
const actSource = fs.readFileSync(path.join(dir, "kit", "act.ts"), "utf8");

const plates = {};
const weights = {};

for (const f of FILES) {
  const fileContent = fs.readFileSync(path.join(dir, "demos", `${f}.tsx`), "utf8");
  const firstPlateIdx = fileContent.indexOf("// @plate ");
  if (firstPlateIdx < 0) continue;
  const pre = fileContent.slice(0, firstPlateIdx).trim();

  const regex = /\/\/ @plate ([^\r\n]+)/g;
  let match;
  const matches = [];
  while ((match = regex.exec(fileContent)) !== null) {
    matches.push({ id: match[1].trim(), index: match.index });
  }

  for (let i = 0; i < matches.length; i++) {
    const { id, index } = matches[i];
    const nextIndex = i + 1 < matches.length ? matches[i + 1].index : undefined;
    const body = fileContent.slice(index, nextIndex).trim();
    const fnMatch = /export function (\w+)/.exec(body);
    const fn = fnMatch ? fnMatch[1] : "Detail";

    plates[id] = { fn, pre, body };
    const gz = zlib.gzipSync(Buffer.from(body, "utf8"));
    weights[id] = gz.length;
  }
}

console.log("Total extracted plates:", Object.keys(plates).length);
console.log("Sample plate 'perforated-tear':", plates["perforated-tear"].fn, "length:", plates["perforated-tear"].body.length, "gzip:", weights["perforated-tear"]);
