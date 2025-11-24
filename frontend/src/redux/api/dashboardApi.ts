import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ----------------------
// Type Definitions
// ----------------------

export interface PlanLimits {
  emailsPerMonth: number;
  smsPerMonth: number;
  smtpConfigs: number;
  androidGateways: number;
}

export interface PlanUsage {
  emailsSent: number;
  smsSent: number;
  smtpConfigsUsed: number;
  androidGatewaysUsed: number;
  lastResetDate: string;
}

export interface SubscriptionInfo {
  plan: string | null;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  limits: PlanLimits;
  usage: PlanUsage;
}

export interface UserDashboardStats {
  smsCampaigns: number;
  emailCampaigns: number;
  smtpConfigs: number;
  smsGateways: number;
  totalNumbers: number;
  totalEmails: number;
  totalPayments: number;
}

export interface UserDashboardResponse {
  success: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    phone?: string | number;
    roles: string[];
    profileCompleted: boolean;
    subscription: SubscriptionInfo;
  };
  stats: UserDashboardStats;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalSmsCampaigns: number;
  totalEmailCampaigns: number;
  totalSmtpConfigs: number;
  totalSmsGateways: number;
}

// Campaign summary for recent campaigns
export interface CampaignSummary {
  id: string;
  name: string;
  status: "completed" | "ongoing" | "scheduled";
  sent: number;
  delivered: number;
  progress: number; // 0-100
  date: string;
}

export interface AdminDashboardResponse {
  success: boolean;
  stats: AdminDashboardStats;
  recentEmailCampaigns: CampaignSummary[];
  recentSmsCampaigns: CampaignSummary[];
}

// ----------------------
// RTK Query API
// ----------------------

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/dashboard",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token; // grab token from auth slice
      if (token) {
        headers.set("x-access-token", token); // add JWT token header
      }
      return headers;
    },
  }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboardResponse, void>({
      query: () => "/admin",
      providesTags: ["Dashboard"],
    }),
    getUserDashboard: builder.query<UserDashboardResponse, void>({
      query: () => "/user",
      providesTags: ["Dashboard"],
    }),
  }),
});

// ----------------------
// Export hooks
// ----------------------

export const { useGetAdminDashboardQuery, useGetUserDashboardQuery } = dashboardApi;
