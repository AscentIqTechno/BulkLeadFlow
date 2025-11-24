import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const planApi = createApi({
  reducerPath: "planApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
  }),

  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => "/plans",
    }),
  }),
});

export const { useGetPlansQuery } = planApi;
