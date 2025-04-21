
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import LossAlerts from "./pages/LossAlerts";
import Audits from "./pages/Audits";
import Investigation from "./pages/Investigation";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/loss-alerts" element={<LossAlerts />} />
          <Route path="/audits" element={<Audits />} />
          <Route path="/investigation" element={<Investigation />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
