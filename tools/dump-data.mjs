// data.js の中身を JSON で書き出す（tools/og.py から使う）
import { readFileSync } from "node:fs";
import vm from "node:vm";

export function loadData(root) {
  const src = readFileSync(new URL("../data.js", root ?? import.meta.url), "utf8");
  const names = ["PROFILE", "CATEGORIES", "PROJECTS", "TIMELINE", "SKILLS", "ROOTS", "HOMETOWN",
    "INTERESTS", "STRENGTHS", "EXPERIENCE", "WORK_STORY", "PERSONALITY", "CAREER", "STUDY", "FAVORITES"];
  const ctx = {};
  vm.runInNewContext(`${src}\n;globalThis.__out = { ${names.join(", ")} };`, ctx);
  return ctx.__out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(JSON.stringify(loadData()));
}
