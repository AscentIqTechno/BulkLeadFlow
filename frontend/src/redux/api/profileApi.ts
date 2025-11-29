import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types
export interface User {
  subscription: any;
  _id: string;
  username: string;
  email: string;
  phone: string;
  profileImage?: {
    public_id: string;
    url: string;
  };
  roles: Array<{
    _id: string;
    name: string;
  }>;
  billingAddress?: {
    company: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
  };
  currentPlan?: any;
  profileCompleted: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  plan: {
    _id: string;
    name: string;
    price: number;
    features: string[];
  };
  subscriptionStatus: string;
  planLimits: {
    emailsPerMonth: number;
    smsPerMonth: number;
    smtpConfigs: number;
    androidGateways: number;
  };
  planUsage: {
    emailsSent: number;
    smsSent: number;
    smtpConfigsUsed: number;
    androidGatewaysUsed: number;
    lastResetDate: string;
  };
  startDate: string;
  endDate: string;
  status: string;
  autoRenew: boolean;
}

export interface ProfileResponse {
  user: User;
  subscription: Subscription;
  usage: any;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  phone?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface BillingAddressRequest {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
}

export interface UploadImageResponse {
  message: string;
  profileImage: {
    public_id: string;
    url: string;
  };
}

export const profileApi = createApi({
  reducerPath: "profileApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    prepareHeaders: (headers, { getState }) => {
      // Type-safe token access - adjust according to your store structure
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set("x-access-token", token);
      }
      return headers;
    },
  }),

  tagTypes: ["Profile", "Subscription"],

  endpoints: (builder) => ({
    // GET USER PROFILE
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/profile/profile",
      providesTags: ["Profile"],
    }),

    // UPDATE PROFILE
    updateProfile: builder.mutation<{ message: string; user: User }, UpdateProfileRequest>({
      query: (body) => ({
        url: "/profile/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // UPLOAD PROFILE IMAGE
    uploadProfileImage: builder.mutation<UploadImageResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);
        
        return {
          url: "/profile/profile/upload-image",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    // CHANGE PASSWORD
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (body) => ({
        url: "/profile/profile/change-password",
        method: "PUT",
        body,
      }),
    }),

    // GET SUBSCRIPTION DETAILS
    getSubscription: builder.query<{ subscription: Subscription }, void>({
      query: () => "/profile/profile/subscription",
      providesTags: ["Subscription"],
    }),

    // UPDATE BILLING ADDRESS
    updateBillingAddress: builder.mutation<{ message: string; billingAddress: any }, BillingAddressRequest>({
      query: (body) => ({
        url: "/profile/profile/billing-address",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // GET ALL USERS (Admin only)
    getAllUsers: builder.query<User[], void>({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),

    // GET USER BY ID (Admin only)
    getUserById: builder.query<User, string>({
      query: (id) => `/profile/${id}`,
      providesTags: ["Profile"],
    }),

    // UPDATE USER (Admin only)
    updateUser: builder.mutation<{ message: string; user: User }, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/profile/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // DELETE USER (Admin only)
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/profile/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useChangePasswordMutation,
  useGetSubscriptionQuery,
  useUpdateBillingAddressMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = profileApi;