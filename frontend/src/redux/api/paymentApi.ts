// redux/api/paymentApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from your auth state
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set('x-access-token', token);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ["Plan", "Subscription", "Payment"],
  endpoints: (builder) => ({
    // Get all plans
    getPlans: builder.query({
      query: () => "/payment/plans",
      providesTags: ["Plan"],
    }),
    // Create Razorpay order
    createRazorpayOrder: builder.mutation({
      query: (orderData) => ({
        url: "/payment/create-order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Payment"],
    }),
    // Verify payment
    verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payment/verify-payment",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Subscription", "Payment"],
    }),
    // Get user subscription
    getSubscription: builder.query({
      query: () => "/payment/subscription",
      providesTags: ["Subscription"],
    }),
    // Cancel subscription
    cancelSubscription: builder.mutation({
      query: () => ({
        url: "/payment/cancel-subscription",
        method: "POST",
      }),
      invalidatesTags: ["Subscription"],
    }),
    // Get payment history
    getPaymentHistory: builder.query({
      query: () => "/payment/history",
      providesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useGetSubscriptionQuery,
  useCancelSubscriptionMutation,
  useGetPaymentHistoryQuery,
} = paymentApi;