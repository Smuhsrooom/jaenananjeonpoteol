import { Activity, MapPin, Phone, RefreshCw, AlertTriangle, Clock, Waves } from "lucide-react";
import { useEarthquake, type EarthquakeEvent } from "@/context/EarthquakeContext";

const evacuationZones = [
  { region: "강원 양양·속초", status: "대피령 발령", level: "danger", shelterCount: 12, color: "bg-red-600" },
  { region: "강원 강릉·동해", status: "대피 권고",   level: "warn",   shelterCount: 18, color: "bg-orange-500" },
  { region: "강원 춘천·원주", status: "대피 준비",   level: "watch",  shelterCount: 24, color: "bg-yellow-500" },
  { region: "경기 북부",      status: "주의 관찰",   level: "watch",  shelterCount: 46, color: "bg-yellow-500" },
  { region: "서울·인천",      status: "대기 중",     level: "safe",   shelterCount: 132, color: "bg-blue-500" },
  { region: "충청·경상·전라", status: "정상",         level: "normal", shelterCount: 280, color: "bg-green-500" },
];

const sampleShelters = [
  { name: "속초실내체육관", region: "강원 속초", capacity: 800,  current: 620, type: "화산재 대피소" },
  { name: "양양군민체육관", region: "강원 양양", capacity: 500,  current: 480, type: "화산재 대피소" },
  { name: "강릉종합체육관", region: "강원 강릉", capacity: 1200, current: 340, type: "화산재 대피소" },
  { name: "춘천국민체육센터", region: "강원 춘천", capacity: 900, current: 150, type: "화산재 대피소" },
  { name: "원주시민체육관", region: "강원 원주", capacity: 700,  current: 90,  type: "화산재 대피소" },
  { name: "의정부실내체육관", region: "경기 북부", capacity: 1000, current: 60, type: "화산재 대피소" },
];

const emergencyContacts = [
  { name: "국가재난안전상황실", number: "1899-3112", desc: "24시간 재난신고" },
  { name: "소방청 통합신고",   number: "119",        desc: "화재·구조·구급" },
  { name: "경찰청",            number: "112",        desc: "범죄·긴급사태" },
  { name: "기상청 날씨콜",     number: "131",        desc: "화산재 예보 안내" },
];

function formatKoreanTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function magnitudeColor(mt: number) {
  if (mt >= 7.0) return "text-red-600";
  if (mt >= 5.5) return "text-orange-500";
  if (mt >= 4.0) return "text-yellow-600";
  return "text-blue-600";
}

function magnitudeBg(mt: number) {
  if (mt >= 7.0) return "bg-red-50 border-red-300";
  if (mt >= 5.5) return "bg-orange-50 border-orange-300";
  if (mt >= 4.0) return "bg-yellow-50 border-yellow-300";
  return "bg-blue-50 border-blue-300";
}

export default function EvacuationDashboard() {
  const { data, loading, error, lastRefresh, source, refetch } = useEarthquake();
  const latest: EarthquakeEvent | null = data[0] ?? null;
  const recentList = data.slice(0, 5);
  const sourceLabel =
    source === "kma-apihub"
      ? "기상청 API허브"
      : source === "kma-eqk-info"
        ? "공공데이터포털 OpenAPI"
        : source === "kma-weather-web"
          ? "기상청 날씨누리"
          : "API";

  return (
    <section id="evacuation" className="py-16 bg-[#f5f7fa]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-lg bg-[#0F3D91] p-2">
                <Activity size={18} className="text-white" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Section 05</span>
            </div>
            <h2 className="text-2xl font-black text-[#0F3D91] md:text-3xl">
              실시간 지진·화산 현황 & 대피 안내
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              기상청 공공데이터포털(EqkInfoService) 연동 · 1분마다 자동 갱신
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Clock size={12} />
                <span>마지막 갱신: {lastRefresh.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
              </div>
            )}
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#0F3D91] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0b2f6e] disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              새로고침
            </button>
          </div>
        </div>

        {/* Top: KMA earthquake card + evacuation zones */}
        <div className="grid lg:grid-cols-2 gap-5 mb-6">

          {/* KMA Real-time card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
              <Waves size={15} className="text-[#0F3D91]" />
              <p className="text-sm font-bold text-[#222222]">기상청 최근 지진 정보 (실시간)</p>
              {!loading && !error && latest && (
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-green-600">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
                  LIVE · {sourceLabel}
                </span>
              )}
            </div>

            <div className="p-5">
              {loading && (
                <div className="flex items-center gap-3 text-slate-400 py-8 justify-center">
                  <RefreshCw size={16} className="animate-spin" />
                  <span className="text-sm">기상청 API 조회 중...</span>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 text-sm font-semibold">API 연결 오류</p>
                    <p className="text-red-500 text-xs mt-0.5">{error}</p>
                    <p className="text-red-400 text-[10px] mt-2">
                      루트 `.env`에 `DATA_GO_KR_SERVICE_KEY`를 설정한 뒤 프론트 서버를 재시작하세요.
                    </p>
                  </div>
                </div>
              )}
              {!loading && !error && latest && (
                <div>
                  <div className={`rounded-xl border p-4 mb-4 ${magnitudeBg(latest.magnitude)}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded mb-1 inline-block">
                          {latest.typeLabel}
                        </span>
                        <p className="text-[#1a252f] font-bold text-sm leading-snug">{latest.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-black text-3xl leading-none ${magnitudeColor(latest.magnitude)}`}>
                          M{latest.magnitude.toFixed(1)}
                        </p>
                        <p className="text-slate-500 text-[10px] mt-0.5">규모</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">발생 시각</p>
                        <p className="text-slate-700 font-medium">{formatKoreanTime(latest.occurredAt)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">발표 시각</p>
                        <p className="text-slate-700 font-medium">{formatKoreanTime(latest.announcedAt)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">위도 / 경도</p>
                        <p className="text-slate-700 font-medium">{latest.lat}°N, {latest.lon}°E</p>
                      </div>
                      {latest.intensity && (
                        <div>
                          <p className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">국내 진도</p>
                          <p className="text-slate-700 font-medium">{latest.intensity}</p>
                        </div>
                      )}
                      {latest.depthKm != null && (
                        <div>
                          <p className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">깊이</p>
                          <p className="text-slate-700 font-medium">{latest.depthKm} km</p>
                        </div>
                      )}
                    </div>
                    {latest.remark && (
                      <div className="mt-3 bg-white/80 rounded-lg px-3 py-2 text-xs text-slate-600 italic border border-slate-100">
                        {latest.remark}
                      </div>
                    )}
                  </div>

                  {recentList.length > 1 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">최근 발표 목록</p>
                      {recentList.slice(1).map((eq) => (
                        <div
                          key={`${eq.seq}-${eq.occurredAt}`}
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-800">{eq.location}</p>
                            <p className="text-[10px] text-slate-400">{formatKoreanTime(eq.occurredAt)} · {eq.typeLabel}</p>
                          </div>
                          <p className={`shrink-0 text-sm font-black ${magnitudeColor(eq.magnitude)}`}>
                            M{eq.magnitude.toFixed(1)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!loading && !error && !latest && (
                <p className="text-slate-400 text-sm py-8 text-center">최근 3일 지진 정보 없음</p>
              )}
            </div>
          </div>

          {/* Evacuation zones */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
              <MapPin size={15} className="text-[#D32F2F]" />
              <p className="text-sm font-bold text-[#222222]">화산재 대피 현황 (지역별)</p>
            </div>
            <div className="divide-y divide-slate-200">
              {evacuationZones.map((z) => (
                <div key={z.region} className="flex items-center gap-3 px-5 py-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${z.color} ${z.level === "danger" ? "animate-pulse" : ""}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#222222]">{z.region}</p>
                    <p className={`text-[10px] font-bold ${
                      z.level === "danger" ? "text-red-600" :
                      z.level === "warn"   ? "text-orange-500" :
                      z.level === "watch"  ? "text-yellow-600" :
                      z.level === "safe"   ? "text-blue-600" : "text-green-600"
                    }`}>{z.status}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-[#222222]">{z.shelterCount}개</p>
                    <p className="text-slate-400 text-[10px]">대피소 운영 중</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shelters + Contacts */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Shelter list (lg:col-span-2) */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
              <MapPin size={15} className="text-[#0F3D91]" />
              <p className="text-sm font-bold text-[#222222]">주요 대피소 현황</p>
              <span className="ml-auto text-[10px] text-slate-400">시나리오 예시 데이터</span>
            </div>
            <div className="divide-y divide-slate-200">
              {sampleShelters.map((s) => {
                const pct = Math.round((s.current / s.capacity) * 100);
                const barColor = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-orange-500" : "bg-green-500";
                const textColor = pct >= 90 ? "text-red-600" : pct >= 70 ? "text-orange-500" : "text-green-600";
                return (
                  <div key={s.name} className="px-5 py-3 flex items-center gap-4 bg-white">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-xs font-bold">{s.name}</p>
                      <p className="text-slate-400 text-[10px]">{s.region} · {s.type}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-slate-500">{s.current}/{s.capacity}명</span>
                          <span className={`font-bold ${textColor}`}>{pct}%</span>
                        </div>
                        <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/50">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-2 border-t border-slate-200 bg-slate-50">
              <p className="text-slate-400 text-[10px] text-center">
                ※ 대피소 목록은 시나리오 예시이며, 지진 정보만 기상청 공공 API를 사용합니다
              </p>
            </div>
          </div>

          {/* Emergency contacts */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
              <Phone size={15} className="text-[#0F3D91]" />
              <p className="text-sm font-bold text-[#222222]">비상 연락처</p>
            </div>
            <div className="divide-y divide-slate-200">
              {emergencyContacts.map((c) => (
                <div key={c.number} className="px-5 py-4 bg-white">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mb-0.5">{c.name}</p>
                  <a href={`tel:${c.number}`} className="block text-2xl font-black leading-tight text-[#0F3D91] transition-colors hover:text-[#0b2f6e]">
                    {c.number}
                  </a>
                  <p className="text-slate-500 text-[10px] mt-0.5">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
