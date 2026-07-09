const url = "https://www.weather.go.kr/w/earthquake-volcano/search/korea.do";
const html = await (await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })).text();
const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].slice(0, 8);
for (const m of rows) {
  const tds = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((x) =>
    x[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
  if (tds.length >= 6) console.log(JSON.stringify(tds));
}
console.log("--- lat/lon sample ---");
const latMatch = html.match(/(\d+\.\d+)\s*N/g);
const lonMatch = html.match(/(\d+\.\d+)\s*E/g);
console.log(latMatch?.slice(0, 5), lonMatch?.slice(0, 5));
