import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import FeedbackPage from "@/pages/FeedbackPage";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import OverviewPage from "@/pages/dashboard/OverviewPage";
import AdvisoriesPage from "@/pages/dashboard/AdvisoriesPage";
import FieldsPage from "@/pages/dashboard/FieldsPage";
import NotificationsPage from "@/pages/dashboard/NotificationsPage";
import SatelliteDataPage from "@/pages/dashboard/SatelliteDataPage";
import WeatherPage from "@/pages/dashboard/WeatherPage";
import DashboardFeedbackPage from "@/pages/dashboard/DashboardFeedbackPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";

const queryClient = new QueryClient();

function DashboardRoutes() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/dashboard" component={OverviewPage} />
        <Route path="/dashboard/advisories" component={AdvisoriesPage} />
        <Route path="/dashboard/fields" component={FieldsPage} />
        <Route path="/dashboard/notifications" component={NotificationsPage} />
        <Route path="/dashboard/satellite-data" component={SatelliteDataPage} />
        <Route path="/dashboard/weather" component={WeatherPage} />
        <Route path="/dashboard/feedback" component={DashboardFeedbackPage} />
        <Route path="/dashboard/settings" component={SettingsPage} />
      </Switch>
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/feedback" component={FeedbackPage} />
      <Route path="/dashboard" component={DashboardRoutes} />
      <Route path="/dashboard/:rest*" component={DashboardRoutes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
