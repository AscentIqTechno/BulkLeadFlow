import { createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("reachiq_user"));

const initialState = {
  user: saved || null,
  token: saved?.accessToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
        console.log(action,"acc")
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
