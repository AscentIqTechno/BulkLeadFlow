import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const smtpApi = createApi({
  reducerPath: "smtpApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) headers.set("x-access-token", token);
      return headers;
    },
  }),

  tagTypes: ["SMTP"],

  endpoints: (builder) => ({
    addSmtp: builder.mutation({
      query: (data) => ({
        url: "/smtp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SMTP"],
    }),

    // renamed to match your expectation
    getMySmtps: builder.query({
      query: () => "/smtp",
      providesTags: ["SMTP"],
    }),

    updateSmtp: builder.mutation({
      query: ({ id, data }) => ({
        url: `/smtp/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SMTP"],
    }),

    deleteSmtp: builder.mutation({
      query: (id) => ({
        url: `/smtp/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SMTP"],
    }),
  }),
});

export const {
  useAddSmtpMutation,
  useGetMySmtpsQuery,   // <-- your missing name (fixed)
  useUpdateSmtpMutation,
  useDeleteSmtpMutation,
} = smtpApi;
