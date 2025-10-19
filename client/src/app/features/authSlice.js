import { createSlice } from "@reduxjs/toolkit";

// ✅ Initialize state from localStorage (for persistence)
const initialState = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;

      // ✅ Save user + token to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loading = false;

      // ✅ Remove saved data on logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
