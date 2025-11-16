import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { authApi } from "./api/authApi";
import { smtpApi } from "./api/smtpApi";
import { campaignApi } from "./api/campaignApi";
import { emailDirectoryApi } from "./api/emailDirectoryApi"; // ✅ Import new API
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [smtpApi.reducerPath]: smtpApi.reducer,
    [campaignApi.reducerPath]: campaignApi.reducer,
    [emailDirectoryApi.reducerPath]: emailDirectoryApi.reducer, // ✅ Add reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(authApi.middleware)
      .concat(smtpApi.middleware)
      .concat(campaignApi.middleware)
      .concat(emailDirectoryApi.middleware), // ✅ Add middleware
});
