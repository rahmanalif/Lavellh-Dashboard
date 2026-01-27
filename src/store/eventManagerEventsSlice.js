import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as eventsApi from "../api/eventManagerEventsApi";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
};

export const fetchEventsByManager = createAsyncThunk(
  "eventManagerEvents/fetchByManager",
  async (
    { managerId, page = 1, limit = 20, search = "", status },
    { rejectWithValue }
  ) => {
    try {
      return await eventsApi.fetchEventsByManager({
        managerId,
        page,
        limit,
        search,
        status,
      });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load events"
      );
    }
  }
);

const eventManagerEventsSlice = createSlice({
  name: "eventManagerEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsByManager.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEventsByManager.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.status = "succeeded";
        state.items = data.events || data.items || [];
        state.totalPages = data.totalPages || 1;
        state.currentPage = Number(data.currentPage) || 1;
        state.total = data.total || state.items.length;
      })
      .addCase(fetchEventsByManager.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load events";
      });
  },
});

export const selectManagerEvents = (state) => state.eventManagerEvents.items;
export const selectManagerEventsStatus = (state) =>
  state.eventManagerEvents.status;
export const selectManagerEventsError = (state) =>
  state.eventManagerEvents.error;
export const selectManagerEventsTotalPages = (state) =>
  state.eventManagerEvents.totalPages;
export const selectManagerEventsCurrentPage = (state) =>
  state.eventManagerEvents.currentPage;

export default eventManagerEventsSlice.reducer;
