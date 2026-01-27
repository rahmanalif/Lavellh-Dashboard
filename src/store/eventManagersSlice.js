import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as eventManagersApi from "../api/eventManagersApi";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
};

export const fetchEventManagers = createAsyncThunk(
  "eventManagers/fetchAll",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      return await eventManagersApi.fetchEventManagers({ page, limit, search });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load event managers"
      );
    }
  }
);

const eventManagersSlice = createSlice({
  name: "eventManagers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventManagers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEventManagers.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.status = "succeeded";
        state.items = data.eventManagers || data.managers || data.items || [];
        state.totalPages = data.totalPages || 1;
        state.currentPage = Number(data.currentPage) || 1;
        state.total = data.total || state.items.length;
      })
      .addCase(fetchEventManagers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load event managers";
      });
  },
});

export const selectEventManagers = (state) => state.eventManagers.items;
export const selectEventManagersStatus = (state) => state.eventManagers.status;
export const selectEventManagersError = (state) => state.eventManagers.error;
export const selectEventManagersTotalPages = (state) =>
  state.eventManagers.totalPages;
export const selectEventManagersCurrentPage = (state) =>
  state.eventManagers.currentPage;
export const selectEventManagersTotal = (state) => state.eventManagers.total;

export default eventManagersSlice.reducer;
