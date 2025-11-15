import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Home } from "lucide-react";
import SmtpPage from "./pages/SMTP/SmtpPage";
import CampaignsPage from "./pages/Campaigns/CampaignsPage";
import UsersPage from "./pages/Users/UsersPage";
import LeadsPage from "./pages/Leads/LeadsPage";
import DashboardLayout from "./Layouts/DashboardLayout";

import PrivateRoute from "./components/PrivateRoute";  // <-- added

const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/ReachIQ" element={<Index />} />

          {/* Private Dashboard Routes */}
          <Route
            path="/ReachIQ/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="overview" element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="smtp" element={<SmtpPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="leads" element={<LeadsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Provider>
);

export default App;
