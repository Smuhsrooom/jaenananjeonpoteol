import { useEffect } from "react";
import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
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
      <SiteHeader activeKey={activeKey} />
      <main key={pathname} className="page-enter flex-1">
        {children}
      </main>
      <Footer />
      <SeriousEvacModal />
    </div>
  );
}
