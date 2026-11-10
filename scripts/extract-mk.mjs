import fs from "node:fs";

function extractMkBlocks(filename) {
  const code = fs.readFileSync(filename, "utf8");
  const blocks = [];
  let pos = 0;
  while (true) {
    const idx = code.indexOf("mk(", pos);
    if (idx === -1) break;
    let depth = 0;
    let end = idx;
    let inString = false;
    let quoteChar = "";
    let escape = false;

    for (let i = idx; i < code.length; i++) {
      const ch = code[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (inString) {
        if (ch === quoteChar) inString = false;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = true;
        quoteChar = ch;
        continue;
      }
      if (ch === "(") depth++;
      else if (ch === ")") {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }

    const block = code.slice(idx, end);
    const idMatch = /id:\s*"([^"]+)"/.exec(block);
    if (idMatch) {
      blocks.push({ id: idMatch[1], block });
    }
    pos = end;
  }
  return blocks;
}

const all = [
  ...extractMkBlocks("src/kit/catalog1.ts"),
  ...extractMkBlocks("src/kit/catalog2.ts"),
  ...extractMkBlocks("src/kit/catalog3.ts"),
];

console.log("Total extracted mk blocks:", all.length);
console.log("First:", all[0].id);
console.log("Last:", all[all.length - 1].id);
