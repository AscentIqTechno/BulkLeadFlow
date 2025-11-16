import { createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("reachiq_user"));

const initialState = {
  user: saved || null,
  token: saved?.token || saved?.accessToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;

      // Save to localStorage
      localStorage.setItem(
        "reachiq_user",
        JSON.stringify({
          user,
          token,
        })
      );
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("reachiq_user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
