import React from "react";

const campaigns = [
  {
    id: 1,
    name: "Summer Offers",
    subject: "Hot Deals for You ☀️",
    date: "2025-11-09",
    status: "Sent",
  },
  {
    id: 2,
    name: "New Product Launch",
    subject: "Introducing Our Next Big Thing 🚀",
    date: "2025-11-08",
    status: "Scheduled",
  },
  {
    id: 3,
    name: "Feedback Mail",
    subject: "We value your feedback ❤️",
    date: "2025-11-06",
    status: "Draft",
  },
];

const CampaignList = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Campaigns</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="bg-gray-800 text-gray-400 uppercase text-xs">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Subject</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr
                key={c.id}
                className="border-t border-gray-700 hover:bg-gray-800/60"
              >
                <td className="py-2 px-4">{c.name}</td>
                <td className="py-2 px-4">{c.subject}</td>
                <td className="py-2 px-4">{c.date}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      c.status === "Sent"
                        ? "bg-green-700 text-green-100"
                        : c.status === "Scheduled"
                        ? "bg-yellow-600 text-yellow-100"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignList;
