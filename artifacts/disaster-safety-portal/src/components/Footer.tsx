import { Shield, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { ROUTES } from "@/lib/routes";
import { useT } from "@/i18n/I18nContext";

export default function Footer() {
  const t = useT();

  const EXT_LINKS = [
    { name: t("footer.link1"), href: "https://www.safekorea.go.kr/" },
    { name: t("footer.link2"), href: "https://www.weather.go.kr/" },
    { name: t("footer.link3"), href: "https://apihub.kma.go.kr/" },
    { name: t("footer.link4"), href: "https://www.data.go.kr/" },
  ];

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
                <p className="text-sm font-bold text-[#0B2B66]">{t("brand.name")}</p>
                <p className="text-sm text-slate-500">{t("brand.taglineFull")}</p>
              </div>
            </div>
            <p className="text-base leading-relaxed text-slate-700">{t("footer.blurb")}</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                {t("common.siteMenu")}
              </h4>
              <ul className="space-y-2">
                {ROUTES.map((r) => (
                  <li key={r.path}>
                    <Link
                      href={r.path}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="text-sm text-slate-600 hover:text-[#0B2B66]"
                    >
                      {t(r.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                {t("common.relatedLinks")}
              </h4>
              <ul className="space-y-2">
                {EXT_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#0B2B66]"
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
        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
          {t("footer.legal")}
        </div>
      </div>
    </footer>
  );
}
