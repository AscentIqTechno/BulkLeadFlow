import React from "react";

const mockData = [
  {
    id: 1,
    host: "smtp.gmail.com",
    port: 587,
    from: "noreply@brand.com",
    secure: "TLS",
    status: "Active",
  },
  {
    id: 2,
    host: "smtp.mail.yahoo.com",
    port: 465,
    from: "marketing@brand.com",
    secure: "SSL",
    status: "Inactive",
  },
];

const SmtpList = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Configured SMTP Accounts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="bg-gray-800 text-gray-400 uppercase text-xs">
              <th className="py-3 px-4 text-left">Host</th>
              <th className="py-3 px-4 text-left">Port</th>
              <th className="py-3 px-4 text-left">From</th>
              <th className="py-3 px-4 text-left">Secure</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((smtp) => (
              <tr key={smtp.id} className="border-t border-gray-700 hover:bg-gray-800/60">
                <td className="py-2 px-4">{smtp.host}</td>
                <td className="py-2 px-4">{smtp.port}</td>
                <td className="py-2 px-4">{smtp.from}</td>
                <td className="py-2 px-4">{smtp.secure}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      smtp.status === "Active"
                        ? "bg-green-700 text-green-100"
                        : "bg-red-700 text-red-100"
                    }`}
                  >
                    {smtp.status}
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

export default SmtpList;
