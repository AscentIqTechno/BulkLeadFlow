// howItWorks.js
import { Settings, Smartphone, Send, Mail, MessageCircle, BarChart } from "lucide-react";

export const steps = [
  {
    number: "01",
    icon: <Settings className="h-6 w-6" />,
    title: "Configure SMTP Settings",
    description: "Set up your personal email account with SMTP configuration. Use Gmail, Outlook, or any email provider that supports SMTP."
  },
  {
    number: "02",
    icon: <Smartphone className="h-6 w-6" />,
    title: "Connect Android Gateway",
    description: "Install our gateway app on your Android phone and connect it to your account. Your phone becomes your SMS sending device."
  },
  {
    number: "03",
    icon: <Mail className="h-6 w-6" />,
    title: "Create Email Campaign",
    description: "Upload your contact list, design your email template, and schedule your bulk email campaign with personalization."
  },
  {
    number: "04",
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Setup SMS Campaign",
    description: "Create SMS templates, select your connected Android device, and prepare your bulk SMS outreach with contact segmentation."
  },
  {
    number: "05",
    icon: <Send className="h-6 w-6" />,
    title: "Launch Campaigns",
    description: "Send your email and SMS campaigns simultaneously. Control sending speed and schedule for optimal delivery rates."
  }
];