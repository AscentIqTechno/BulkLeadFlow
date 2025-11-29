import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) headers.set("x-access-token", token);
      return headers;
    },
  }),

  tagTypes: ["User"],

  endpoints: (builder) => ({

    // SIGNUP
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    verifySignupOtp: builder.mutation({
      query: ({ email, otp, username, password, phone }) => ({
        url: "/auth/verify-signup-otp",
        method: "POST",
        body: { email, otp, username, password, phone },
      }),
    }),

    resendSignupOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/resend-signup-otp",
        method: "POST",
        body: { email },
      }),
    }),

    // LOGIN
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // PASSWORD RESET
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ email, newPassword, confirmPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { email, newPassword, confirmPassword },
      }),
    }),

    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: { email },
      }),
    }),

    // USER MANAGEMENT
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword, confirmPassword }) => ({
        url: "/auth/change-password",
        method: "POST",
        body: { currentPassword, newPassword, confirmPassword },
      }),
    }),

    // 🟢 GET ALL USERS (ADMIN)
    fetchUsers: builder.query({
      query: () => "/user/all",
      providesTags: ["User"],
    }),

    // 🟡 UPDATE USER
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // 🔴 DELETE USER
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // ⭐ NEW → CREATE ADMIN USER
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/user/create-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

export const {
  useRegisterUserMutation,
  useVerifySignupOtpMutation,
  useResendSignupOtpMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
  useFetchUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateAdminMutation,   // 👈 NEW EXPORT
} = authApi;
