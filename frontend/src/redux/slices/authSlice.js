import { createSlice } from "@reduxjs/toolkit";

// Get the saved data from localStorage
const savedData = JSON.parse(localStorage.getItem("reachiq_user"));

const initialState = {
  user: savedData?.user || null,  // Access the user from saved object
  token: savedData?.token || null, // Access the token from saved object
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;

      // Save to localStorage as an object containing both user and token
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