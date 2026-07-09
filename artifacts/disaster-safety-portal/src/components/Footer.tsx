import { Shield, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { ROUTES } from "@/lib/routes";

const EXT_LINKS = [
  { name: "국민재난안전포털", href: "https://www.safekorea.go.kr/" },
  { name: "기상청 날씨누리", href: "https://www.weather.go.kr/" },
  { name: "기상청 API허브", href: "https://apihub.kma.go.kr/" },
  { name: "공공데이터포털", href: "https://www.data.go.kr/" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-md">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="rounded-xl bg-[#0B2B66] p-2">
                <Shield size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0B2B66]">국가 재난안전센터</p>
                <p className="text-[10px] text-slate-500">백두산 대비 · 시민 안내 포털</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              재난 시 믿을 정보와 행동을 안내합니다. 관측 데이터는 기상청 API허브, 안내
              콘텐츠는 「재난 및 안전관리 기본법」·국민재난안전포털 기준을 따릅니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                사이트 메뉴
              </h4>
              <ul className="space-y-2">
                {ROUTES.map((r) => (
                  <li key={r.path}>
                    <Link
                      href={r.path}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="text-xs text-slate-600 hover:text-[#0B2B66]"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                관련 링크
              </h4>
              <ul className="space-y-2">
                {EXT_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0B2B66]"
                    >
                      {l.name}
                      <ExternalLink size={11} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-500">
          표시 시각 Asia/Seoul · 실시간 관측은 백두산 분화를 의미하지 않습니다 · 공식 경보·대피는
          기상청·행정안전부 발표를 따르세요.
        </div>
      </div>
    </footer>
  );
}
