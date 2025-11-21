import React from "react";
import { 
  Mail, 
  MessageSquare, 
  CreditCard,
  BarChart3, 
  TrendingUp, 
  Smartphone,
  Settings,
  Clock,
  CheckCircle,
  PlayCircle,
  Calendar,
  ArrowUp,
  ArrowDown,
  Zap,
  Shield,
  DollarSign,
  Users,
  Database,
  Cpu
} from "lucide-react";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const roles = useSelector((state: any) => state.auth?.user.roles || []);
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  // Stats we can actually track
  const stats = [
    {
      title: "Emails Sent",
      value: "24,560",
      change: "+12.5%",
      trend: "up",
      icon: <Mail size={24} />,
      color: "bg-yellow-500/20 text-yellow-500",
      description: "This month"
    },
    {
      title: "SMS Sent",
      value: "8,742",
      change: "+8.3%",
      trend: "up",
      icon: <MessageSquare size={24} />,
      color: "bg-blue-500/20 text-blue-400",
      description: "This month"
    },
    {
      title: "Active Campaigns",
      value: "12",
      change: "+2",
      trend: "up",
      icon: <PlayCircle size={24} />,
      color: "bg-green-500/20 text-green-400",
      description: "Running now"
    },
    {
      title: "Success Rate",
      value: "96.8%",
      change: "+1.2%",
      trend: "up",
      icon: <BarChart3 size={24} />,
      color: "bg-purple-500/20 text-purple-400",
      description: "Delivery success"
    },
    {
      title: "SMTP Accounts",
      value: "4",
      change: "Active",
      trend: "stable",
      icon: <Settings size={24} />,
      color: "bg-orange-500/20 text-orange-400",
      description: "Configured"
    },
    {
      title: "Android Gateways",
      value: "2",
      change: "Connected",
      trend: "stable",
      icon: <Smartphone size={24} />,
      color: "bg-indigo-500/20 text-indigo-400",
      description: "Online"
    }
  ];

  // Email campaigns - only what we can track
  const emailCampaigns = [
    {
      id: 1,
      name: "Summer Promotion",
      type: "email",
      sent: "5,000",
      delivered: "4,850",
      status: "completed",
      date: "2025-11-20",
      progress: 100
    },
    {
      id: 2,
      name: "Lead Follow-up",
      type: "email",
      sent: "1,800",
      delivered: "1,720",
      status: "ongoing",
      date: "2025-11-19",
      progress: 65
    },
    {
      id: 3,
      name: "Weekly Newsletter",
      type: "email",
      sent: "3,200",
      delivered: "3,150",
      status: "completed",
      date: "2025-11-18",
      progress: 100
    }
  ];

  // SMS campaigns - only what we can track
  const smsCampaigns = [
    {
      id: 1,
      name: "Product Launch SMS",
      type: "sms",
      sent: "2,300",
      delivered: "2,250",
      status: "scheduled",
      date: "2025-11-21",
      progress: 0
    },
    {
      id: 2,
      name: "Holiday SMS Blast",
      type: "sms",
      sent: "1,500",
      delivered: "1,480",
      status: "ongoing",
      date: "2025-11-20",
      progress: 45
    },
    {
      id: 3,
      name: "Appointment Reminders",
      type: "sms",
      sent: "800",
      delivered: "780",
      status: "completed",
      date: "2025-11-17",
      progress: 100
    }
  ];

  const quickActions = [
    {
      title: "Create Email Campaign",
      description: "Start a new bulk email campaign",
      icon: <Mail size={20} />,
      color: "bg-yellow-500",
      link: "/dashboard/campaigns"
    },
    {
      title: "Create SMS Campaign",
      description: "Send bulk SMS messages",
      icon: <MessageSquare size={20} />,
      color: "bg-blue-500",
      link: "/dashboard/sms_campaigns"
    },
    {
      title: "Add SMTP Account",
      description: "Connect personal email account",
      icon: <Settings size={20} />,
      color: "bg-green-500",
      link: "/dashboard/smtp"
    },
    {
      title: "Setup SMS Gateway",
      description: "Configure Android phone for SMS",
      icon: <Smartphone size={20} />,
      color: "bg-purple-500",
      link: "/dashboard/sms_config"
    }
  ];

  // Admin earnings data
  const earningsData = [
    {
      period: "Today",
      amount: "$245.50",
      change: "+12.5%",
      trend: "up",
      icon: <TrendingUp size={20} />,
      color: "bg-green-500/20 text-green-500"
    },
    {
      period: "This Week",
      amount: "$1,845.75",
      change: "+8.3%",
      trend: "up",
      icon: <BarChart3 size={20} />,
      color: "bg-blue-500/20 text-blue-500"
    },
    {
      period: "This Month",
      amount: "$7,892.30",
      change: "+15.2%",
      trend: "up",
      icon: <DollarSign size={20} />,
      color: "bg-yellow-500/20 text-yellow-500"
    },
    {
      period: "This Year",
      amount: "$89,456.80",
      change: "+22.7%",
      trend: "up",
      icon: <Zap size={20} />,
      color: "bg-purple-500/20 text-purple-500"
    }
  ];

  // Delivery metrics we can actually track
  const deliveryMetrics = [
    {
      title: "Email Delivery Rate",
      value: "98.2%",
      change: "+2.1%",
      trend: "up",
      icon: <Mail size={16} />,
      color: "text-yellow-500"
    },
    {
      title: "SMS Delivery Rate",
      value: "96.8%",
      change: "+1.5%",
      trend: "up",
      icon: <MessageSquare size={16} />,
      color: "text-blue-500"
    },
    {
      title: "Failed Deliveries",
      value: "1.8%",
      change: "-0.3%",
      trend: "down",
      icon: <Database size={16} />,
      color: "text-red-500"
    },
    {
      title: "Average Send Speed",
      value: "125/min",
      change: "+15%",
      trend: "up",
      icon: <Cpu size={16} />,
      color: "text-green-500"
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-500/20 text-green-500 border-green-500/30",
      ongoing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    };
    
    const icons = {
      completed: <CheckCircle size={12} />,
      ongoing: <PlayCircle size={12} />,
      scheduled: <Clock size={12} />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
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
          <div className="text-right">
            <p className="text-gray-400 text-sm">Last campaign</p>
            <p className="text-white font-medium">2 hours ago</p>
          </div>
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <TrendingUp size={20} className="text-gray-900" />
          </div>
        </div>
      </div>

      {/* Admin Earnings Grid - Only for admin */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {earningsData.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${item.color}`}>
                  {item.icon}
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  item.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {item.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {item.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{item.amount}</h3>
              <p className="text-gray-300 font-medium text-sm">Total {item.period}</p>
              <p className="text-gray-500 text-xs mt-1">Platform Revenue</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${item.color}`}>
                {item.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                item.trend === 'up' ? 'text-green-400' : 
                item.trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {item.trend === 'up' ? <ArrowUp size={16} /> : 
                 item.trend === 'down' ? <ArrowDown size={16} /> : null}
                {item.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{item.value}</h3>
            <p className="text-gray-300 font-medium text-sm">{item.title}</p>
            <p className="text-gray-500 text-xs mt-1">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions & Delivery Metrics */}
        <div className="xl:col-span-1 space-y-8">
          {/* Quick Actions */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className="w-full p-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl text-left transition-all duration-300 hover:border-gray-500 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{action.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Metrics - Only what we can track */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Delivery Metrics</h2>
            <div className="space-y-4">
              {deliveryMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${metric.color} bg-opacity-20`}>
                      {metric.icon}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{metric.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{metric.value}</p>
                    <p className={`text-xs ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Quick Stats */}
          {isAdmin && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-300 mb-6">Platform Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Users</span>
                  <span className="text-gray-300  font-bold">1,248</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Active Campaigns</span>
                  <span className="text-gray-300  font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Emails Sent</span>
                  <span className="text-gray-300 font-bold">24,560</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total SMS Sent</span>
                  <span className="text-gray-300  font-bold">8,742</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content - Campaigns */}
        <div className="xl:col-span-2 space-y-8">
          {/* Email Campaigns */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Mail size={20} className="text-yellow-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Recent Email Campaigns</h2>
              </div>
              <button className="text-yellow-500 text-sm font-medium hover:text-yellow-400 transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {emailCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-xl hover:border-yellow-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500">
                      <Mail size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-semibold text-sm">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Sent: {campaign.sent}</span>
                        <span>Delivered: {campaign.delivered}</span>
                        <span>Success: {Math.round((parseInt(campaign.delivered) / parseInt(campaign.sent)) * 100)}%</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {campaign.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-24">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{campaign.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          campaign.status === 'completed' ? 'bg-green-500' :
                          campaign.status === 'ongoing' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Campaigns */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MessageSquare size={20} className="text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Recent SMS Campaigns</h2>
              </div>
              <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {smsCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-xl hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <MessageSquare size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-semibold text-sm">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Sent: {campaign.sent}</span>
                        <span>Delivered: {campaign.delivered}</span>
                        <span>Success: {Math.round((parseInt(campaign.delivered) / parseInt(campaign.sent)) * 100)}%</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {campaign.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-24">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{campaign.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          campaign.status === 'completed' ? 'bg-green-500' :
                          campaign.status === 'ongoing' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Status */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Account Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">SMTP Accounts Active</span>
                  <span className="text-green-500 font-bold">4/5</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">SMS Gateways Online</span>
                  <span className="text-green-500 font-bold">2/3</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">Monthly Email Limit</span>
                  <span className="text-yellow-500 font-bold">24,560/50,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300">Monthly SMS Limit</span>
                  <span className="text-blue-400 font-bold">8,742/10,000</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Shield size={20} className="text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-white">System Status</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white text-sm">Email Service</span>
                  </div>
                  <span className="text-green-500 text-sm font-medium">Operational</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white text-sm">SMS Gateway</span>
                  </div>
                  <span className="text-green-500 text-sm font-medium">Operational</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white text-sm">Database</span>
                  </div>
                  <span className="text-green-500 text-sm font-medium">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;