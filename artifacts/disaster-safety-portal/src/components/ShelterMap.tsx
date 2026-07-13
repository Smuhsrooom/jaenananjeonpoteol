import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, RefreshCw } from "lucide-react";
import { useT } from "@/i18n/I18nContext";

const CENTER: L.LatLngExpression = [36.5, 127.8];
const ZOOM = 7;

const SHELTER_POINTS = [
  { nameKey: "contacts.s1n", descKey: "contacts.s1d", lat: 37.5665, lon: 126.978, kind: "center" as const },
  { nameKey: "contacts.s2n", descKey: "contacts.s2d", lat: 36.3504, lon: 127.3845, kind: "school" as const },
  { nameKey: "contacts.s3n", descKey: "contacts.s3d", lat: 35.1796, lon: 129.0756, kind: "sports" as const },
  { nameKey: "contacts.s4n", descKey: "contacts.s4d", lat: 33.4996, lon: 126.5312, kind: "temp" as const },
];

function shelterIcon(kind: "center" | "school" | "sports" | "temp") {
  const color =
    kind === "center"
      ? "#1565C0"
      : kind === "school"
        ? "#2E7D32"
        : kind === "sports"
          ? "#EF6C00"
          : "#C62828";

  return L.divIcon({
    className: "",
    html: `<div style="
      width:16px;height:16px;border-radius:9999px;
      background:${color};border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function ShelterMap() {
  const t = useT();
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [ready, setReady] = useState(false);

  const points = useMemo(
    () =>
      SHELTER_POINTS.map((p) => ({
        ...p,
        title: `${t(p.nameKey)} · ${t(p.descKey)}`,
      })),
    [t],
  );

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;

    const map = L.map(mapEl.current, {
      center: CENTER,
      zoom: ZOOM,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 18,
      subdomains: "abcd",
    }).addTo(map);

    const layer = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerRef.current = layer;
    setReady(true);

    const timer = window.setTimeout(() => map.invalidateSize(), 100);

    return () => {
      window.clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer || !ready) return;

    layer.clearLayers();

    for (const point of points) {
      const marker = L.marker([point.lat, point.lon], { icon: shelterIcon(point.kind) });
      marker.bindPopup(
        `<div style="font:12px/1.4 sans-serif"><strong style="color:#0B2B66">${escapeHtml(t("contacts.shelterTitle"))}</strong><br/>${escapeHtml(point.title)}</div>`,
      );
      marker.addTo(layer);
    }

    map.setView(CENTER, ZOOM, { animate: false });
    map.invalidateSize();
  }, [points, ready, t]);

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            {t("contacts.shelterMapEyebrow")}
          </p>
          <h3 className="text-lg font-black text-[#0B2B66]">{t("contacts.shelterMapTitle")}</h3>
          <p className="mt-1 text-sm text-slate-600">{t("contacts.shelterMapDescription")}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm text-slate-400">
          <RefreshCw size={12} />
          {t("contacts.shelterMapLegend")}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-[#FAFBFC] px-4 py-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#1565C0] ring-2 ring-white" />
            {t("contacts.shelterMapLegend1")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2E7D32] ring-2 ring-white" />
            {t("contacts.shelterMapLegend2")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#EF6C00] ring-2 ring-white" />
            {t("contacts.shelterMapLegend3")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#C62828] ring-2 ring-white" />
            {t("contacts.shelterMapLegend4")}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-slate-400">
            <MapPin size={12} />
            {t("contacts.shelterMapCount", { n: points.length })}
          </span>
        </div>
        <div ref={mapEl} className="h-[320px] w-full sm:h-[380px] z-0" />
      </div>

      <p className="mt-3 text-sm text-slate-500">{t("contacts.shelterMapNote")}</p>
    </section>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
