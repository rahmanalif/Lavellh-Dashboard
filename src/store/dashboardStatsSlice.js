import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as dashboardStatsApi from "../api/dashboardStatsApi";

const initialState = {
  totals: null,
  monthly: [],
  status: "idle",
  error: null,
  year: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboardStats/fetch",
  async (year, { rejectWithValue }) => {
    try {
      return await dashboardStatsApi.fetchDashboardStats(year);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard stats"
      );
    }
  }
);

const dashboardStatsSlice = createSlice({
  name: "dashboardStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.year = action.meta.arg;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        const data = action.payload || {};
        const stats = data.stats || data;
        state.status = "succeeded";
        state.totals = stats.totals || null;
        state.monthly = stats.earnings?.monthly || [];
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load dashboard stats";
      });
  },
});

export const selectDashboardTotals = (state) => state.dashboardStats.totals;
export const selectDashboardMonthly = (state) => state.dashboardStats.monthly;
export const selectDashboardStatus = (state) => state.dashboardStats.status;
export const selectDashboardError = (state) => state.dashboardStats.error;

export default dashboardStatsSlice.reducer;
