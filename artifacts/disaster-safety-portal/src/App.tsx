import { useState } from "react";
import { Router as WouterRouter, Route, Switch } from "wouter";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import DefinitionPage from "@/pages/DefinitionPage";
import SystemPage from "@/pages/SystemPage";
import AlertsPage from "@/pages/AlertsPage";
import GuidelinesPage from "@/pages/GuidelinesPage";
import ImpactPage from "@/pages/ImpactPage";
import LivePage from "@/pages/LivePage";
import ContactsPage from "@/pages/ContactsPage";
import SiteLayout from "@/components/SiteLayout";
import IntroSplash, { shouldPlayIntro } from "@/components/IntroSplash";
import { EarthquakeProvider } from "@/context/EarthquakeContext";
import { VolcanoProvider } from "@/context/VolcanoContext";
import { AlertLevelProvider } from "@/context/AlertLevelContext";
import { I18nProvider } from "@/i18n/I18nContext";

function Router() {
  return (
    <SiteLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/definition" component={DefinitionPage} />
        <Route path="/system" component={SystemPage} />
        <Route path="/alerts" component={AlertsPage} />
        <Route path="/guidelines" component={GuidelinesPage} />
        <Route path="/impact" component={ImpactPage} />
        <Route path="/live" component={LivePage} />
        <Route path="/contacts" component={ContactsPage} />
        <Route component={NotFound} />
      </Switch>
    </SiteLayout>
  );
}

function App() {
  const base =
    import.meta.env.BASE_URL === "/"
      ? ""
      : import.meta.env.BASE_URL.replace(/\/$/, "");

  const [introDone, setIntroDone] = useState(() => !shouldPlayIntro());

  return (
    <I18nProvider>
      <EarthquakeProvider>
        <VolcanoProvider>
          <AlertLevelProvider>
            <IntroSplash onFinished={() => setIntroDone(true)} />
            <div className={introDone ? "app-reveal" : "app-reveal app-reveal--pending"}>
              <WouterRouter base={base}>
                <Router />
              </WouterRouter>
            </div>
          </AlertLevelProvider>
        </VolcanoProvider>
      </EarthquakeProvider>
    </I18nProvider>
  );
}

export default App;
