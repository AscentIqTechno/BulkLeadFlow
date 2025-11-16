import React from "react";
import CampaignForm from "./CampaignForm";
import CampaignList from "./CampaignList";
import {
  useGetMySmtpsQuery
} from "../../redux/api/smtpApi";

const CampaignsPage = () => {
    const { data, isLoading, refetch } = useGetMySmtpsQuery();
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-blue-500"></h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignForm data={data}/>
        <CampaignList />
      </div>
    </div>
  );
};    

export default CampaignsPage;
