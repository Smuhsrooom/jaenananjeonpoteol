import fs from "fs";

const res = await fetch("https://apihub.kma.go.kr/apiList.do?seqApi=7");
const h = await res.text();
fs.writeFileSync("artifacts/disaster-safety-portal/scripts/hub7.html", h, "utf8");

const urls = [...h.matchAll(/https:\/\/apihub\.kma\.go\.kr\/api\/[^"'\\s<>]+/g)].map((m) => m[0]);
console.log("urls", urls.length);
[...new Set(urls)].forEach((u) => console.log(u));

const titles = [...h.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map((m) =>
  m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
);
console.log("---titles---");
titles.forEach((t) => console.log(t));

// any volcano-ish tokens near api paths
const volHits = [...h.matchAll(/.{0,40}(화산|volc|vol_|분연|분화).{0,80}/gi)].slice(0, 30);
console.log("---vol hits---");
volHits.forEach((m) => console.log(m[0].replace(/\s+/g, " ")));
