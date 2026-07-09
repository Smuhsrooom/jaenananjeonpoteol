import fs from "node:fs";
import { spawnSync } from "node:child_process";

const dir = "api/earthquake";
const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
console.log("api/earthquake =>", files.join(", ") || "(empty)");

if (files.includes("recent.ts")) {
  console.error("ERROR: api/earthquake/recent.ts must not exist (use .js only)");
  process.exit(1);
}

const r = spawnSync(
  "pnpm",
  ["--filter", "@workspace/disaster-safety-portal", "run", "build"],
  { stdio: "inherit", shell: true },
);
process.exit(r.status ?? 1);
