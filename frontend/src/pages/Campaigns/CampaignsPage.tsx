import React from "react";
import CampaignForm from "./CampaignForm";
import CampaignList from "./CampaignList";
import {
  useGetMySmtpsQuery
} from "../../redux/api/smtpApi";
import { useSelector } from "react-redux";
import { useGetAllEmailListQuery, useGetMyEmailListQuery } from "@/redux/api/emailDirectoryApi";

const CampaignsPage = () => {
    const roles = useSelector((state: any) => state.auth?.user.roles || []);
    const isAdmin = Array.isArray(roles) && roles.includes("admin");
  
    // Queries
    const { data:emailDirectory } = isAdmin
      ? useGetAllEmailListQuery(null)
      : useGetMyEmailListQuery(null);
    const { data, isLoading, refetch } = useGetMySmtpsQuery();
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-blue-500"></h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignForm data={data} emailDirectory={emailDirectory}/>
        <CampaignList />
      </div>
    </div>
  );
};    

export default CampaignsPage;
