// featuresData.js
import { Mail, Smartphone, Settings, BarChart3, Shield, Users } from "lucide-react";

export const features = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Bulk Email Campaigns",
    description: "Send mass emails using your personal SMTP configuration. Maintain sender reputation and ensure high inbox placement."
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Android SMS Gateway",
    description: "Use your Android phone as an SMS gateway to send bulk messages. No third-party services required."
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "Easy Configuration",
    description: "Simple setup for SMTP and mobile gateway. Connect your personal accounts in minutes."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Complete Control",
    description: "Use your own email and mobile numbers. No monthly fees or platform limitations."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Lead Management",
    description: "Organize contacts, segment audiences, and manage leads efficiently with built-in CRM features."
  }
];