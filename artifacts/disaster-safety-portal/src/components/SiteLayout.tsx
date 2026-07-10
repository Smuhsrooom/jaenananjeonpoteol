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
      <header className="sticky top-0 z-50">
        <AlertBanner />
        <Navbar activeKey={activeKey} />
      </header>
      {/* key=pathname → 라우트 변경마다 페이지 전환 애니 */}
      <main key={pathname} className="page-enter flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
