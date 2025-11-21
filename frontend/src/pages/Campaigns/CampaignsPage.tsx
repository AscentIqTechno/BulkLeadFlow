// CampaignsPage.jsx
import React, { useState } from "react";
import CampaignForm from "./CampaignForm";
import CampaignList from "./CampaignList";
import {
  useGetMySmtpsQuery
} from "../../redux/api/smtpApi";
import { useSelector } from "react-redux";
import { useGetAllEmailListQuery, useGetMyEmailListQuery } from "@/redux/api/emailDirectoryApi";
import { Mail, HelpCircle, Send } from "lucide-react";

const CampaignsPage = () => {
    const roles = useSelector((state: any) => state.auth?.user.roles || []);
    const isAdmin = Array.isArray(roles) && roles.includes("admin");
    const [showGuide, setShowGuide] = useState(false);
  
    // Queries
    const { data: emailDirectory, isLoading: loadingEmails } = isAdmin
      ? useGetAllEmailListQuery(null)
      : useGetMyEmailListQuery(null);
    const { data: smtpData, isLoading: loadingSmtp, refetch } = useGetMySmtpsQuery(null);

    if (loadingSmtp || loadingEmails) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading campaigns data...</p>
          </div>
        </div>
      );
    }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm">
            Create and manage your email marketing campaigns
          </p>
        </div>
        
        {/* Guide Toggle Button */}
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          <HelpCircle size={18} />
          {showGuide ? "Hide Guide" : "Show Email Guide"}
        </button>
      </div>

      {/* Email Campaign Guide Panel */}
      {showGuide && (
        <div className="bg-blue-900/40 border border-blue-600/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Email Campaign Guide</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Practices */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Best Practices:</h4>
              <ol className="text-gray-200 text-sm space-y-3 list-decimal list-inside">
                <li className="pb-2">
                  <span className="font-medium text-white">Craft Compelling Subject Lines</span>
                  <p className="text-blue-100 ml-6 mt-1">Keep subject lines under 60 characters for mobile devices</p>
                </li>
                <li className="pb-2">
                  <span className="font-medium text-white">Personalize Your Messages</span>
                  <p className="text-blue-100 ml-6 mt-1">Use recipient names and relevant content for better engagement</p>
                </li>
                <li className="pb-2">
                  <span className="font-medium text-white">Test Before Sending</span>
                  <p className="text-blue-100 ml-6 mt-1">Always send test emails to verify formatting and links</p>
                </li>
                <li className="pb-2">
                  <span className="font-medium text-white">Monitor Sending Limits</span>
                  <p className="text-blue-100 ml-6 mt-1">Stay within your SMTP provider's daily sending limits</p>
                </li>
              </ol>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-800/30 rounded-lg p-4 border border-blue-600/30">
              <h4 className="text-white font-medium mb-3">Quick Tips:</h4>
              <dl className="text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Timing:</dt>
                  <dd className="text-white">Best sending times: Tuesday-Thursday, 9AM-12PM</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Content:</dt>
                  <dd className="text-white">Keep important content above the fold</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Mobile:</dt>
                  <dd className="text-white">60% of emails are opened on mobile devices</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="text-blue-200 w-20 flex-shrink-0">Testing:</dt>
                  <dd className="text-white">Test across different email clients and devices</dd>
                </div>
              </dl>

              <div className="mt-4 p-3 bg-blue-900/40 rounded border border-blue-500/30">
                <p className="text-blue-100 text-xs">
                  <strong>💡 Pro Tip:</strong> Use A/B testing for subject lines to improve open rates
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[600px]">
        <CampaignForm data={smtpData} emailDirectory={emailDirectory} />
        <CampaignList />
      </div>
    </div>
  );
};    

export default CampaignsPage;