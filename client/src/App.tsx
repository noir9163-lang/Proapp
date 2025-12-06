import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GamificationProvider } from "@/lib/gamification";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/Dashboard";
import Planner from "@/pages/Planner";
import Notes from "@/pages/Notes";
import Focus from "@/pages/Focus";
import Social from "@/pages/Social";
import Shop from "@/pages/Shop";
import Alarm from "@/pages/Alarm";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/planner" component={Planner} />
        <Route path="/notes" component={Notes} />
        <Route path="/focus" component={Focus} />
        <Route path="/social" component={Social} />
        <Route path="/shop" component={Shop} />
        <Route path="/alarm" component={Alarm} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GamificationProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </GamificationProvider>
    </QueryClientProvider>
  );
}

export default App;
