import { Toaster } from "react-hot-toast";     
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
import EmailDirectoryList from "./pages/directory/EmailDirectoryList";

// SMS Pages
import SmsGatewayConfigPage from "./pages/SMS/SmsGatewayConfigPage";
import SmsSendPage from "./pages/SMS/SmsSendPage";
import SmsNumberDirectoryPage from "./pages/SMS/SmsNumberDirectoryPage";

import BillingPage from "./pages/Billing/billingPayment";
import PlanManagement from "./pages/settings/PlanManagement";
import RazorpayConfigManager from "./pages/settings/RazorpayConfigForm";
import UserProfile from "./pages/UserProfile/UserProfile";

const App = () => (
  <Provider store={store}>
    <Toaster position="top-right" />

    <TooltipProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Route */}
          <Route path="/" element={<Index />} />

          {/* Private Dashboard */}
          <Route
            path="/dashboard"
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
            <Route path="email_directory" element={<EmailDirectoryList />} />
            <Route path="payment_billing" element={<BillingPage />} />

            {/* ✅ FIXED SETTINGS ROUTES */}
            <Route path="settings/plan_management" element={<PlanManagement />} />
            <Route path="settings/razorpay_config" element={<RazorpayConfigManager />} />

            {/* SMS ROUTES */}
            <Route path="sms_config" element={<SmsGatewayConfigPage />} />
            <Route path="sms_campaigns" element={<SmsSendPage />} />
            <Route path="sms_directory" element={<SmsNumberDirectoryPage />} />
            <Route path="user_profile" element ={<UserProfile />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Provider>
);

export default App;
