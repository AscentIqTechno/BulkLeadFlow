// CampaignList.jsx
import React from "react";
import { useGetMyCampaignsQuery, useDeleteCampaignMutation } from "@/redux/api/campaignApi";
import { toast } from "react-hot-toast";
import { Trash2, Mail, Users, Calendar, Check, X, Clock } from "lucide-react";

const CampaignList = () => {
  const { data, isLoading, isError, refetch } = useGetMyCampaignsQuery(null);
  const [deleteCampaign] = useDeleteCampaignMutation();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      await deleteCampaign(id).unwrap();
      toast.success("Campaign deleted successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete campaign");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: { color: "bg-green-500/20 border-green-500/50 text-green-400", icon: Check },
      failed: { color: "bg-red-500/20 border-red-500/50 text-red-400", icon: X },
      scheduled: { color: "bg-blue-500/20 border-blue-500/50 text-blue-400", icon: Clock },
      pending: { color: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400", icon: Clock }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${config.color}`}>
        <IconComponent size={12} />
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <X className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-red-400">Failed to load campaigns</p>
        </div>
      </div>
    );
  }

  const campaigns = data || [];

  return (
    <div className="flex flex-col min-h-[500px]">
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col flex-1">
        {/* List Header */}
        <div className="border-b border-gray-700 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Email Campaigns</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} in history
                </p>
              </div>
            </div>
            {campaigns.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400">
                    Sent: {campaigns.filter((c: any) => c.status === 'sent').length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* List Content - Scrollable */}
        <div className="p-6 flex-1 overflow-y-auto">
          {campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.map((campaign: any) => (
                <div 
                  key={campaign._id} 
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      
                      <div className="text-sm text-gray-300 space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="truncate">{campaign.subject}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-gray-400" />
                            <span>{campaign.recipients?.length || 0} recipients</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(campaign._id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                      title="Delete Campaign"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-white font-medium mb-2">No Campaigns</h3>
                <p className="text-gray-400 text-sm">
                  Create your first email campaign to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignList;