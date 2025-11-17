import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const smsApi = createApi({
  reducerPath: "smsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("x-access-token", token);
      }
      return headers;
    },
  }),

  tagTypes: ["SmsConfig"],

  endpoints: (builder) => ({
    // GET SMS Gateway Configs
    getSmsConfig: builder.query({
      query: () => "/sms_gateway_config",
      providesTags: ["SmsConfig"],
    }),

    // ADD SMS Gateway Config
    addSmsConfig: builder.mutation({
      query: (body) => ({
        url: "/sms_gateway_config",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SmsConfig"],
    }),

    // UPDATE SMS Gateway Config
    updateSmsConfig: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/sms_gateway_config/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SmsConfig"],
    }),

    // DELETE SMS Gateway Config
    deleteSmsConfig: builder.mutation({
      query: (id) => ({
        url: `/sms_gateway_config/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SmsConfig"],
    }),
  }),
});

export const {
  useGetSmsConfigQuery,
  useAddSmsConfigMutation,
  useUpdateSmsConfigMutation,
  useDeleteSmsConfigMutation,
} = smsApi;
