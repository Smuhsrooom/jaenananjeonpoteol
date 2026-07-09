import { useEffect } from "react";
import { useLocation } from "wouter";
import AlertBanner from "@/components/AlertBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { matchRouteKey } from "@/lib/routes";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [pathname] = useLocation();
  const activeKey = matchRouteKey(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC] font-sans text-[#1A1F2E] antialiased">
      {/* 배너+nav 한 덩어리 sticky — 배너 닫히면 nav가 맨 위에 붙음 */}
      <header className="sticky top-0 z-50">
        <AlertBanner />
        <Navbar activeKey={activeKey} />
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
