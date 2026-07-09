import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Shield } from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface NavbarProps {
  activeKey: string;
}

export default function Navbar({ activeKey }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  const go = (path: string) => {
    setLocation(path);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5"
        >
          <div className="rounded-lg bg-[#0B2B66] p-1.5">
            <Shield size={16} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-black leading-none text-[#0B2B66]">국가 재난안전센터</p>
            <p className="mt-0.5 text-[10px] text-slate-500">백두산 대비 · 시민 안내</p>
          </div>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {ROUTES.map((item) => {
            const active = activeKey === item.key;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className={`inline-flex items-center rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    active
                      ? "bg-slate-100 text-[#0B2B66]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#0B2B66]"
                  }`}
                >
                  {"live" in item && item.live && (
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="p-2 text-slate-600 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="메뉴"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 px-2 py-2 lg:hidden">
          {ROUTES.map((item) => {
            const active = activeKey === item.key;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => go(item.path)}
                className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${
                  active ? "bg-slate-100 text-[#0B2B66]" : "text-slate-600"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
