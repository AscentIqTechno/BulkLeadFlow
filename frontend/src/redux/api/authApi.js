import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
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

  endpoints: (builder) => ({
    // --------------------
    // REGISTER
    // --------------------
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),

    // --------------------
    // LOGIN
    // --------------------
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
   // --------------------
    // LOGOUT (NEW)
    // --------------------
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    // --------------------
    // FETCH ALL USERS (ADMIN PROTECTED)
    // --------------------
    fetchUsers: builder.query({
      query: () => ({
        url: "/user/all",
        method: "GET",
      }),
    }),

    // OPTIONAL: Get Single User
    fetchUserById: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useFetchUsersQuery,
  useFetchUserByIdQuery,
  useLogoutUserMutation
} = authApi;
