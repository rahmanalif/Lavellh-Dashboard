import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../api/client";

const initialState = {
  admin: null,
  accessToken: localStorage.getItem("adminAccessToken"),
  refreshToken: localStorage.getItem("adminRefreshToken"),
  expiresIn: null,
  tokenType: null,
  status: "idle",
  error: null,
};

export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await client.post("/admin/login", { email, password });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setTokens(state, action) {
      const { accessToken, refreshToken, expiresIn, tokenType } =
        action.payload || {};
      if (accessToken) {
        state.accessToken = accessToken;
        localStorage.setItem("adminAccessToken", accessToken);
      }
      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem("adminRefreshToken", refreshToken);
      }
      if (expiresIn !== undefined) {
        state.expiresIn = expiresIn;
      }
      if (tokenType) {
        state.tokenType = tokenType;
      }
    },
    adminLogout(state) {
      state.admin = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresIn = null;
      state.tokenType = null;
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload.admin;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresIn = action.payload.expiresIn;
        state.tokenType = action.payload.tokenType;

        localStorage.setItem("adminAccessToken", action.payload.accessToken);
        localStorage.setItem("adminRefreshToken", action.payload.refreshToken);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });
  },
});

export const { adminLogout, setTokens } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
