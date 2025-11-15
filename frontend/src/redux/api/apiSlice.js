import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/",
    prepareHeaders: (headers, { getState }) => {
      const user = getState()?.auth?.user;
      const token = user?.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["User", "Post", "Story"],
  endpoints: () => ({}),
});
