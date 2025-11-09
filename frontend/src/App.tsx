import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Home, } from "lucide-react";
import SmtpPage from "./pages/SMTP/SmtpPage";
import CampaignsPage from "./pages/Campaigns/CampaignsPage";
import UsersPage from "./pages/Users/UsersPage";
import LeadsPage from "./pages/Leads/LeadsPage";
import DashboardLayout from "./Layouts/DashboardLayout";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/ReachIQ" element={<Index />} />

          {/* Dashboard Layout with Nested Routes */}
          <Route path="/ReachIQ/dashboard" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="overview" element={<Dashboard/>} />
            <Route path="users" element={<UsersPage />} />
            <Route path="smtp" element={<SmtpPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="leads" element={<LeadsPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
