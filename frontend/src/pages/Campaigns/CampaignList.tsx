import React from "react";
import { useGetMyCampaignsQuery, useDeleteCampaignMutation } from "@/redux/api/campaignApi";
import { toast } from "react-hot-toast";

const CampaignList = () => {
  const { data, isLoading, isError } = useGetMyCampaignsQuery(null);
  const [deleteCampaign] = useDeleteCampaignMutation();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      await deleteCampaign(id).unwrap();
      toast.success("Campaign deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  if (isLoading) return <p className="text-gray-300">Loading campaigns...</p>;
  if (isError) return <p className="text-red-400">Failed to load campaigns.</p>;

  // FIXED HERE
  const campaigns = data || [];

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Campaigns</h2>

      {campaigns.length === 0 ? (
        <p className="text-gray-400 text-sm">No campaigns found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-300">
            <thead>
              <tr className="bg-gray-800 text-gray-400 uppercase text-xs">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Recipients</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>

            <tbody>
              {campaigns.map((c: any) => (
                <tr key={c._id} className="border-t border-gray-700 hover:bg-gray-800/60">
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="py-2 px-4">{c.subject}</td>
                  <td className="py-2 px-4">{c.recipients?.length || 0}</td>

                  <td className="py-2 px-4">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        c.status === "sent"
                          ? "bg-green-700 text-green-100"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-2 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default CampaignList;
