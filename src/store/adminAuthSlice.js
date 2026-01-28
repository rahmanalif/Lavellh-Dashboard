import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../api/client";
import adminClient from "../api/adminClient";

const initialState = {
  admin: null,
  accessToken: localStorage.getItem("adminAccessToken"),
  refreshToken: localStorage.getItem("adminRefreshToken"),
  expiresIn: null,
  tokenType: null,
  status: "idle",
  error: null,
  profileStatus: "idle",
  profileError: null,
  refreshStatus: "idle",
  refreshError: null,
};

const extractAuthPayload = (payload) => {
  if (!payload) return {};
  const data = payload?.data ?? payload;
  return {
    admin: data?.admin || data?.user || data?.profile || null,
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
    expiresIn: data?.expiresIn,
    tokenType: data?.tokenType,
  };
};

export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await client.post("/admin/login", { email, password });
      return extractAuthPayload(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const refreshAdminToken = createAsyncThunk(
  "adminAuth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const stateRefreshToken =
        getState()?.adminAuth?.refreshToken ||
        localStorage.getItem("adminRefreshToken");
      if (!stateRefreshToken) {
        return rejectWithValue("Missing refresh token");
      }
      const res = await client.post("/admin/refresh-token", {
        refreshToken: stateRefreshToken,
      });
      return extractAuthPayload(res.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to refresh token"
      );
    }
  }
);

export const loadAdminProfile = createAsyncThunk(
  "adminAuth/loadProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminClient.get("/admin/me");
      const data = res?.data?.data ?? res?.data;
      return data?.admin || data?.user || data?.profile || data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load admin profile"
      );
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
    setAdmin(state, action) {
      state.admin = action.payload || null;
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

        if (action.payload.accessToken) {
          localStorage.setItem("adminAccessToken", action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem("adminRefreshToken", action.payload.refreshToken);
        }
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });
    builder
      .addCase(refreshAdminToken.pending, (state) => {
        state.refreshStatus = "loading";
        state.refreshError = null;
      })
      .addCase(refreshAdminToken.fulfilled, (state, action) => {
        state.refreshStatus = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken || state.refreshToken;
        state.expiresIn = action.payload.expiresIn;
        state.tokenType = action.payload.tokenType;
        if (action.payload.accessToken) {
          localStorage.setItem("adminAccessToken", action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem("adminRefreshToken", action.payload.refreshToken);
        }
      })
      .addCase(refreshAdminToken.rejected, (state, action) => {
        state.refreshStatus = "failed";
        state.refreshError = action.payload || "Failed to refresh token";
      });
    builder
      .addCase(loadAdminProfile.pending, (state) => {
        state.profileStatus = "loading";
        state.profileError = null;
      })
      .addCase(loadAdminProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.admin = action.payload || state.admin;
      })
      .addCase(loadAdminProfile.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.profileError = action.payload || "Failed to load admin profile";
      });
  },
});

export const { adminLogout, setTokens, setAdmin } = adminAuthSlice.actions;
export const selectAdmin = (state) => state.adminAuth.admin;
export const selectAdminRole = (state) =>
  state.adminAuth.admin?.role || state.adminAuth.admin?.userType || null;
export const selectAdminPermissions = (state) =>
  state.adminAuth.admin?.permissions || {};
export const selectAuthStatus = (state) => state.adminAuth.status;
export const selectAuthError = (state) => state.adminAuth.error;
export const selectProfileStatus = (state) => state.adminAuth.profileStatus;
export const selectProfileError = (state) => state.adminAuth.profileError;

export default adminAuthSlice.reducer;
