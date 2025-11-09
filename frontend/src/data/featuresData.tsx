import { Mail, Users, BarChart3, Settings, Zap, ShieldCheck } from "lucide-react";

export const features = [
  {
    icon: <Mail size={24} />,
    title: "Automated Email Campaigns",
    description:
      "Create, schedule, and send personalized bulk email campaigns using your configured SMTP accounts — all within one dashboard.",
  },
  {
    icon: <Users size={24} />,
    title: "Lead Management",
    description:
      "Track, manage, and segment leads generated from your email campaigns with powerful insights and filtering tools.",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Real-Time Analytics",
    description:
      "Monitor email performance with open rates, clicks, and engagement data in one easy-to-understand visual dashboard.",
  },
  {
    icon: <Settings size={24} />,
    title: "SMTP Configuration",
    description:
      "Connect multiple SMTP providers with ease — Gmail, Outlook, or custom servers — to send high-volume campaigns securely.",
  },
  {
    icon: <Zap size={24} />,
    title: "Smart Automation",
    description:
      "Automate follow-ups and workflows to improve lead conversion efficiency using ReachIQ’s smart scheduling engine.",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Security & Privacy",
    description:
      "Your data and email credentials are encrypted end-to-end. We ensure full compliance with GDPR and anti-spam standards.",
  },
];
