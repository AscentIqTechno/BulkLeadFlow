import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const emailDirectoryApi = createApi({
  reducerPath: "emailDirectoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/email_directory",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) headers.set("x-access-token", token);
      return headers;
    },
  }),
  tagTypes: ["EmailDirectory"],
  endpoints: (builder) => ({
    getMyEmailList: builder.query<any[], void>({
      query: () => "/my", // GET /my
      providesTags: ["EmailDirectory"],
    }),
    getAllEmailList: builder.query<any[], void>({
      query: () => "/all", // GET /all (admin only)
      providesTags: ["EmailDirectory"],
    }),
    deleteEmail: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmailDirectory"], // refresh list after deletion
    }),
  }),
});

export const { 
  useGetMyEmailListQuery, 
  useGetAllEmailListQuery, 
  useDeleteEmailMutation 
} = emailDirectoryApi;
