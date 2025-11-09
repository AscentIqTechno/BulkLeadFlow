import React from "react";
import { Mail, Users, Database, Settings } from "lucide-react";

const DashboardPage = () => {
  const stats = [
    {
      title: "Total Emails Sent",
      value: "24,560",
      icon: <Mail size={20} />,
      color: "bg-blue-600/20 text-blue-400",
    },
    {
      title: "Active Campaigns",
      value: "12",
      icon: <Users size={20} />,
      color: "bg-green-600/20 text-green-400",
    },
    {
      title: "Leads Generated",
      value: "3,482",
      icon: <Database size={20} />,
      color: "bg-yellow-600/20 text-yellow-400",
    },
    {
      title: "Active SMTPs",
      value: "4",
      icon: <Settings size={20} />,
      color: "bg-purple-600/20 text-purple-400",
    },
  ];

  const campaigns = [
    {
      id: 1,
      name: "Summer Offers",
      sent: "5,000",
      status: "Completed",
      date: "2025-11-09",
    },
    {
      id: 2,
      name: "Product Launch",
      sent: "2,300",
      status: "Scheduled",
      date: "2025-11-08",
    },
    {
      id: 3,
      name: "Lead Follow-up",
      sent: "1,800",
      status: "Ongoing",
      date: "2025-11-06",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-blue-500">
          Welcome to ReachIQ Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Track your email performance, campaigns, and leads in one place.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-800/70 transition"
          >
            <div className={`p-3 rounded-full ${item.color}`}>{item.icon}</div>
            <div>
              <p className="text-gray-400 text-sm">{item.title}</p>
              <h2 className="text-xl font-semibold text-white">
                {item.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Campaigns */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Recent Campaigns
          </h2>
          <button className="text-blue-400 text-sm hover:underline">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-300">
            <thead>
              <tr className="bg-gray-800 text-gray-400 uppercase text-xs">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Emails Sent</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-gray-700 hover:bg-gray-800/60"
                >
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="py-2 px-4">{c.sent}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        c.status === "Completed"
                          ? "bg-green-700 text-green-100"
                          : c.status === "Scheduled"
                          ? "bg-yellow-600 text-yellow-100"
                          : "bg-blue-700 text-blue-100"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Placeholder */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-gray-400 text-sm text-center">
        📊 Analytics charts coming soon — open rate, click rate & delivery stats.
      </div>
    </div>
  );
};

export default DashboardPage;
