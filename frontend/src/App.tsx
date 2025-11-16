import { Toaster } from "react-hot-toast";     // ✅ using ONLY react-hot-toast
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

import PrivateRoute from "./components/PrivateRoute";

const App = () => (
  <Provider store={store}>
    {/* Global Toaster (react-hot-toast) */}
    <Toaster position="top-right" />   {/* ✔ Works everywhere */}

    <TooltipProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Route */}
          <Route path="/ReachIQ" element={<Index />} />

          {/* Private Dashboard */}
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
