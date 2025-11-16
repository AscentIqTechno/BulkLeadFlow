import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const campaignApi = createApi({
  reducerPath: "campaignApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/complain",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set("x-access-token", token);
      }
      return headers;
    },
  }),
  tagTypes: ["Campaign"],
  endpoints: (builder) => ({
    createCampaign: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Campaign"],
    }),

  getMyCampaigns: builder.query({
  query: () => "/",
  providesTags: ["Campaign"],
}),

    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaign"],
    }),
  }),
});

export const {
  useCreateCampaignMutation,
  useGetMyCampaignsQuery,
  useDeleteCampaignMutation,
} = campaignApi;
