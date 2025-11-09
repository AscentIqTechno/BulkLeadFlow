import { Settings, Mail, BarChart3 } from "lucide-react";

export const steps = [
  {
    number: "01",
    icon: <Settings size={24} />,
    title: "Configure SMTP Settings",
    description:
      "Easily connect your email provider (Gmail, Outlook, or custom SMTP). Securely store credentials to send campaigns from your own domain.",
  },
  {
    number: "02",
    icon: <Mail size={24} />,
    title: "Create & Send Campaigns",
    description:
      "Design personalized email campaigns, import leads, and send messages individually through your SMTP for maximum deliverability.",
  },
  {
    number: "03",
    icon: <BarChart3 size={24} />,
    title: "Track Leads & Performance",
    description:
      "Monitor delivery rates, opens, and engagement analytics in real-time. Use insights to refine campaigns and generate more qualified leads.",
  },
];
