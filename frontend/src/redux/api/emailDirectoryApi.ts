
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
    // GET /my
    getMyEmailList: builder.query<any[], void>({
      query: () => "/my",
      providesTags: ["EmailDirectory"],
    }),

    // GET /all
    getAllEmailList: builder.query<any[], void>({
      query: () => "/all",
      providesTags: ["EmailDirectory"],
    }),

    // POST /add
    addEmail: builder.mutation({
      query: (data: { name: string; email: string }) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EmailDirectory"],
    }),

    // PUT /:id
    updateEmail: builder.mutation({
      query: ({ id, ...data }: { id: string; name: string; email: string }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["EmailDirectory"],
    }),

    // DELETE /:id
    deleteEmail: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmailDirectory"],
    }),

    // POST /bulk
    bulkImportEmail: builder.mutation({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/bulk",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["EmailDirectory"],
    }),
  }),
});

export const {
  useGetMyEmailListQuery,
  useGetAllEmailListQuery,
  useAddEmailMutation,
  useUpdateEmailMutation,
  useDeleteEmailMutation,
  useBulkImportEmailMutation,
} = emailDirectoryApi;
