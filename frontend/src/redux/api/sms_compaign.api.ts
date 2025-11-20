import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const smsCampaignApi = createApi({
  reducerPath: "smsCampaignApi",
   baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) headers.set("x-access-token", token);
      return headers;
    },
  }),

  tagTypes: ["SmsCampaign"],

  endpoints: (builder) => ({
    sendBulkSms: builder.mutation({
      query: (body) => ({
        url: "/sms_campaign",  // ✅ matches Express
        method: "POST",
        body,
      }),
      invalidatesTags: ["SmsCampaign"],
    }),



    getSmsCampaigns: builder.query({
      query: () => "/sms_campaign",
      providesTags: ["SmsCampaign"],
    }),

    getSmsCampaignById: builder.query({
      query: (id) => `/sms_campaign/${id}`,
      providesTags: ["SmsCampaign"],
    }),

    updateSmsCampaign: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/sms_campaign/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SmsCampaign"],
    }),

    deleteSmsCampaign: builder.mutation({
      query: (id) => ({
        url: `/sms_campaign/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SmsCampaign"],
    }),
  }),
});

export const {
  useSendBulkSmsMutation,
  useGetSmsCampaignsQuery,
  useGetSmsCampaignByIdQuery,
  useUpdateSmsCampaignMutation,
  useDeleteSmsCampaignMutation,
} = smsCampaignApi;
