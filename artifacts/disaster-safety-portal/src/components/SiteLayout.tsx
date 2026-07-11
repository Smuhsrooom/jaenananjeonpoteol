import { useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CrisisThemeBar from "@/components/CrisisThemeBar";
import SeriousEvacModal from "@/components/SeriousEvacModal";
import { matchRouteKey } from "@/lib/routes";
import { useAlertLevel } from "@/context/AlertLevelContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [pathname] = useLocation();
  const activeKey = matchRouteKey(pathname);
  const { level } = useAlertLevel();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      className="crisis-shell flex min-h-screen flex-col font-sans text-[#1A1F2E] antialiased transition-colors duration-300"
      style={{ backgroundColor: level.softColor }}
      data-alert-level={level.id}
    >
      <header className="sticky top-0 z-50">
        <Navbar activeKey={activeKey} />
        {/* 경보·관측 통합 단일 바 (중복 제거) */}
        <CrisisThemeBar />
      </header>
      <main key={pathname} className="page-enter flex-1">
        {children}
      </main>
      <Footer />
      <SeriousEvacModal />
    </div>
  );
}
