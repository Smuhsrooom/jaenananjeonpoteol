import { Router as WouterRouter, Route, Switch } from "wouter";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import DefinitionPage from "@/pages/DefinitionPage";
import SystemPage from "@/pages/SystemPage";
import AlertsPage from "@/pages/AlertsPage";
import GuidelinesPage from "@/pages/GuidelinesPage";
import ImpactPage from "@/pages/ImpactPage";
import SimulationPage from "@/pages/SimulationPage";
import LivePage from "@/pages/LivePage";
import ContactsPage from "@/pages/ContactsPage";
import SiteLayout from "@/components/SiteLayout";
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
        <Route path="/simulation" component={SimulationPage} />
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

  return (
    <I18nProvider>
      <EarthquakeProvider>
        <VolcanoProvider>
          <AlertLevelProvider>
            <WouterRouter base={base}>
              <Router />
            </WouterRouter>
          </AlertLevelProvider>
        </VolcanoProvider>
      </EarthquakeProvider>
    </I18nProvider>
  );
}

export default App;
