import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const razorpayApi = createApi({
  reducerPath: "razorpayApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set("x-access-token", token);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // 🔹 Get ALL Razorpay accounts
   getAllRazorpayConfigs: builder.query({
  query: () => "/razorpay/config",
}),


    // 🔹 Get Razorpay config by ID
    getRazorpayConfigById: builder.query({
      query: (id) => `/razorpay/config/${id}`,
    }),

    // 🔹 Get ACTIVE Razorpay config
    getActiveRazorpay: builder.query({
      query: () => "/razorpay/config-active", // <-- FIX
    }),

    // 🔹 Create new Razorpay Config
    createRazorpayConfig: builder.mutation({
      query: (body) => ({
        url: "/razorpay/config",
        method: "POST",
        body,
      }),
    }),

    // 🔹 Update Razorpay Config
    updateRazorpayConfig: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/razorpay/config/${id}`,
        method: "PUT",
        body,
      }),
    }),

    // 🔹 Delete Razorpay Config
    deleteRazorpayConfig: builder.mutation({
      query: (id) => ({
        url: `/razorpay/config/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllRazorpayConfigsQuery,
  useGetRazorpayConfigByIdQuery,
  useGetActiveRazorpayQuery,
  useCreateRazorpayConfigMutation,
  useUpdateRazorpayConfigMutation,
  useDeleteRazorpayConfigMutation,
} = razorpayApi;
