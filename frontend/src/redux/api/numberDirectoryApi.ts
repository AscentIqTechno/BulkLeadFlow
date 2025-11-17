import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const numberDirectoryApi = createApi({
  reducerPath: "numberDirectoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/number_directory",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) headers.set("x-access-token", token);
      return headers;
    },
  }),
  tagTypes: ["NumberDirectory"],
  endpoints: (builder) => ({
    // GET /my
    getMyNumbers: builder.query<any[], void>({
      query: () => "/my",
      providesTags: ["NumberDirectory"],
    }),

    // GET /all
    getAllNumbers: builder.query<any[], void>({
      query: () => "/all",
      providesTags: ["NumberDirectory"],
    }),

    // POST /
    addNumber: builder.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NumberDirectory"],
    }),

    // PUT /:id
    updateNumber: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["NumberDirectory"],
    }),

    // DELETE /:id
    deleteNumber: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NumberDirectory"],
    }),

    // POST /bulk
    bulkImportNumbers: builder.mutation({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/bulk",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["NumberDirectory"],
    }),
  }),
});

export const {
  useGetMyNumbersQuery,
  useGetAllNumbersQuery,
  useAddNumberMutation,
  useUpdateNumberMutation,
  useDeleteNumberMutation,
  useBulkImportNumbersMutation,
} = numberDirectoryApi;
