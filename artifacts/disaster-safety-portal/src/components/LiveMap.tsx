import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEarthquake } from "@/context/EarthquakeContext";
import { useVolcano } from "@/context/VolcanoContext";
import { Link } from "wouter";
import { MapPin, RefreshCw } from "lucide-react";
import SourceStamp from "@/components/SourceStamp";
import { useI18n } from "@/i18n/I18nContext";

/** 한반도 중심 (남한 중부) — 지도 기본 시점 */
const KOREA_CENTER: L.LatLngExpression = [36.5, 127.8];
const KOREA_ZOOM = 7;

function eqIcon(mag: number) {
  const size = mag >= 5.5 ? 16 : mag >= 4 ? 13 : 10;
  const color = mag >= 5.5 ? "#C62828" : mag >= 4 ? "#EF6C00" : "#1565C0";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function volIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;border-radius:3px;transform:rotate(45deg);
      background:#E65100;border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export default function LiveMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const koreaViewSet = useRef(false);
  const { data: eqData, loading: eqLoading, lastRefresh: eqRefresh } = useEarthquake();
  const { data: volData, loading: volLoading, lastRefresh: volRefresh } = useVolcano();
  const [ready, setReady] = useState(false);
  const { t } = useI18n();

  const points = useMemo(() => {
    const eq = eqData
      .filter((e) => Number.isFinite(e.lat) && Number.isFinite(e.lon))
      .map((e) => ({
        kind: "eq" as const,
        lat: e.lat,
        lon: e.lon,
        title: `M${e.magnitude.toFixed(1)} · ${e.location}`,
        mag: e.magnitude,
      }));
    const vol = volData
      .filter((v) => v.lat != null && v.lon != null && Number.isFinite(v.lat) && Number.isFinite(v.lon))
      .slice(0, 40) // 과도한 마커 방지
      .map((v) => ({
        kind: "vol" as const,
        lat: v.lat as number,
        lon: v.lon as number,
        title: `${v.volcanoName ?? "화산"} · ${v.location ?? ""}`,
        mag: 0,
      }));
    return { eq, vol };
  }, [eqData, volData]);

  // 지도 초기화 (1회)
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;

    const map = L.map(mapEl.current, {
      center: KOREA_CENTER,
      zoom: KOREA_ZOOM,
      zoomControl: true,
      attributionControl: true,
      // 한반도·인근 동북아 위주로 보이게 (원하면 사용자가 더 넓게 이동 가능)
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

    // 리사이즈 대응
    const t = window.setTimeout(() => map.invalidateSize(), 100);

    return () => {
      window.clearTimeout(t);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      koreaViewSet.current = false;
    };
  }, []);

  // 마커 갱신
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer || !ready) return;

    layer.clearLayers();

    for (const p of points.eq) {
      const m = L.marker([p.lat, p.lon], { icon: eqIcon(p.mag) });
      m.bindPopup(
        `<div style="font:12px/1.4 sans-serif"><strong style="color:#1565C0">지진</strong><br/>${escapeHtml(p.title)}</div>`,
      );
      m.addTo(layer);
    }

    for (const p of points.vol) {
      const m = L.marker([p.lat, p.lon], { icon: volIcon() });
      m.bindPopup(
        `<div style="font:12px/1.4 sans-serif"><strong style="color:#E65100">화산</strong><br/>${escapeHtml(p.title)}</div>`,
      );
      m.addTo(layer);
    }

    // 첫 마커 로드 시에만 한반도로 맞춤 (이후 사용자가 이동한 시점 유지)
    if (!koreaViewSet.current) {
      map.setView(KOREA_CENTER, KOREA_ZOOM, { animate: false });
      koreaViewSet.current = true;
    }
    map.invalidateSize();
  }, [points, ready]);

  const loading = eqLoading || volLoading;
  const total = points.eq.length + points.vol.length;

  return (
    <section className="border-b border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              {t("map.eyebrow")}
            </p>
            <h2 className="text-lg font-black text-[#0B2B66] md:text-xl">{t("map.title")}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {t("map.desc")}
              {loading ? ` · ${t("common.loading")}` : ` · ${t("map.shown", { n: total })}`}
              {` ${t("map.markerNote")}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SourceStamp source={t("hero.statKma") + " API"} updatedAt={eqRefresh ?? volRefresh} />
            <Link
              href="/live"
              className="rounded-lg bg-[#0B2B66] px-3 py-2 text-sm font-semibold text-white hover:bg-[#081f4a]"
            >
              {t("common.listDetail")}
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-[#FAFBFC] px-4 py-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#1565C0] ring-2 ring-white" />
              {t("map.legendEq")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rotate-45 bg-[#E65100] ring-2 ring-white" />
              {t("map.legendVol")}
            </span>
            {loading && (
              <span className="ml-auto inline-flex items-center gap-1 text-slate-400">
                <RefreshCw size={12} className="animate-spin" />
                {t("map.refreshing")}
              </span>
            )}
            {!loading && (
              <span className="ml-auto inline-flex items-center gap-1 text-slate-400">
                <MapPin size={12} />
                {t("map.counts", { eq: points.eq.length, vol: points.vol.length })}
              </span>
            )}
          </div>
          <div ref={mapEl} className="h-[360px] w-full sm:h-[420px] z-0" />
        </div>
      </div>
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
