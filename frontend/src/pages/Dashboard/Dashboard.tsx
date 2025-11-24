import React from "react";
import {
  Mail,
  MessageSquare,
  CreditCard,
  Smartphone,
  Settings,
  Clock,
  CheckCircle,
  PlayCircle,
  Calendar,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Users,
  FolderOpen,
  TrendingUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  useGetAdminDashboardQuery,
  useGetUserDashboardQuery,
} from "@/redux/api/dashboardApi";

// ---------------- TYPES ---------------- //

interface Campaign {
  _id: string;
  userId: string;
  name: string;
  subject?: string;
  smtpId?: string;
  recipients: string[];
  message: string;
  attachments: any[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDashboardResponse {
  stats: any;
  lastEmailCampaigns: Campaign[];
  lastSmsCampaigns: Campaign[];
}

interface AdminDashboardResponse {
  stats: {
    totalUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
    totalSmsCampaigns: number;
    totalEmailCampaigns: number;
    totalSmtpConfigs: number;
    totalSmsGateways: number;
    totalNumberDirectory: number;
    totalEmailDirectory: number;
  };
}

// ---------------------------------------- //

const DashboardPage: React.FC = () => {
  const roles = useSelector((state: any) => state.auth?.user.roles || []);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  const { data: userData } = useGetUserDashboardQuery(undefined, {
    skip: isAdmin,
  }) as { data?: UserDashboardResponse };

  const { data: adminData } = useGetAdminDashboardQuery(undefined, {
    skip: !isAdmin,
  }) as { data?: AdminDashboardResponse };

  // Helper for user campaigns only
  const mapCampaigns = (campaigns?: Campaign[]) => {
    if (!campaigns) return [];
    return campaigns.map((c) => ({
      id: c._id,
      name: c.name,
      status:
        c.status === "sent"
          ? "completed"
          : (c.status as "ongoing" | "scheduled"),
      sent: c.recipients?.length || 0,
      delivered: c.recipients?.length || 0,
      progress: 100,
      date: new Date(c.createdAt).toLocaleDateString(),
    }));
  };

  // User recent campaigns
  const emailCampaigns = isAdmin
    ? []
    : mapCampaigns(userData?.stats?.lastEmailCampaigns);

  const smsCampaigns = isAdmin ? [] : mapCampaigns(userData?.stats?.lastSmsCampaigns);

  // ---------------- STATS GRID ---------------- //
  const stats = isAdmin
    ? [
        {
          title: "Total Users",
          value: adminData?.stats.totalUsers || 0,
          icon: <Users size={24} />,
          color: "bg-yellow-500/20 text-yellow-500",
          description: "All registered users",
        },
        {
          title: "Active Subscriptions",
          value: adminData?.stats.activeSubscriptions || 0,
          icon: <CreditCard size={24} />,
          color: "bg-blue-500/20 text-blue-400",
          description: "Active plan holders",
        },
        {
          title: "Total Revenue",
          value: `₹${adminData?.stats.totalRevenue || 0}`,
          icon: <DollarSign size={24} />,
          color: "bg-green-500/20 text-green-400",
          description: "Total payments received",
        },
        {
          title: "Email Campaigns",
          value: adminData?.stats.totalEmailCampaigns || 0,
          icon: <Mail size={24} />,
          color: "bg-purple-500/20 text-purple-400",
          description: "All email campaigns",
        },
        {
          title: "SMS Campaigns",
          value: adminData?.stats.totalSmsCampaigns || 0,
          icon: <MessageSquare size={24} />,
          color: "bg-indigo-500/20 text-indigo-400",
          description: "All SMS campaigns",
        },
        {
          title: "SMTP Accounts",
          value: adminData?.stats.totalSmtpConfigs || 0,
          icon: <Settings size={24} />,
          color: "bg-orange-500/20 text-orange-400",
          description: "SMTP connections",
        },
        {
          title: "Android Gateways",
          value: adminData?.stats.totalSmsGateways || 0,
          icon: <Smartphone size={24} />,
          color: "bg-red-500/20 text-red-400",
          description: "SMS devices connected",
        },
        {
          title: "Number Directory",
          value: adminData?.stats.totalNumberDirectory || 0,
          icon: <FolderOpen size={24} />,
          color: "bg-teal-500/20 text-teal-400",
          description: "Phone contacts",
        },
        {
          title: "Email Directory",
          value: adminData?.stats.totalEmailDirectory || 0,
          icon: <FolderOpen size={24} />,
          color: "bg-pink-500/20 text-pink-400",
          description: "Email contacts",
        },
      ]
    : [
        {
          title: "Emails Sent",
          value: userData?.stats?.lastEmailCampaigns?.length || 0,
          icon: <Mail size={24} />,
          color: "bg-yellow-500/20 text-yellow-500",
          description: "This month",
        },
        {
          title: "SMS Sent",
          value: userData?.stats?.lastSmsCampaigns?.length || 0,
          icon: <MessageSquare size={24} />,
          color: "bg-blue-500/20 text-blue-400",
          description: "This month",
        },
        {
          title: "SMTP Accounts",
          value: userData?.stats.smtpConfigs || 0,
          icon: <Settings size={24} />,
          color: "bg-orange-500/20 text-orange-400",
          description: "Connected",
        },
        {
          title: "Android Gateways",
          value: userData?.stats.smsGateways || 0,
          icon: <Smartphone size={24} />,
          color: "bg-indigo-500/20 text-indigo-400",
          description: "Online",
        },
        
      ];

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-500/20 text-green-500 border-green-500/30",
      ongoing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };

    const icons = {
      completed: <CheckCircle size={12} />,
      ongoing: <PlayCircle size={12} />,
      scheduled: <Clock size={12} />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-8">
    
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">LeadReachXpro</span>
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            {isAdmin ? "Admin Dashboard - Monitor platform performance & revenue" : "Send bulk emails & SMS using your personal accounts"}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
         
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <TrendingUp size={20} className="text-gray-900" />
          </div>
        </div>
      </div>


      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${item.color}`}>{item.icon}</div>
            </div>
            <h3 className="text-2xl font-bold text-white">{item.value}</h3>
            <p className="text-gray-300 mt-1">{item.title}</p>
            <p className="text-gray-500 text-xs">{item.description}</p>
          </div>
        ))}
      </div>

      {/* --- USER ONLY RECENT CAMPAIGNS --- */}
      {!isAdmin && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* EMAIL */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Recent Email Campaigns
            </h2>

            {emailCampaigns.length === 0 && (
              <p className="text-gray-500">No recent email campaigns.</p>
            )}

            {emailCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-xl mb-3"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500">
                    <Mail size={14} />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {campaign.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {campaign.date} • Sent {campaign.sent}
                    </p>
                  </div>

                  {getStatusBadge(campaign.status)}
                </div>
              </div>
            ))}
          </div>

          {/* SMS */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Recent SMS Campaigns
            </h2>

            {smsCampaigns.length === 0 && (
              <p className="text-gray-500">No recent SMS campaigns.</p>
            )}

            {smsCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-xl mb-3"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <MessageSquare size={14} />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {campaign.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {campaign.date} • Sent {campaign.sent}
                    </p>
                  </div>

                  {getStatusBadge(campaign.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
