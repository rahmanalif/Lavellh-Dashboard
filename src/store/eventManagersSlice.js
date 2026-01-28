import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as eventManagersApi from "../api/eventManagersApi";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
  selected: null,
  selectedStatus: "idle",
  selectedError: null,
  toggleStatus: "idle",
  toggleError: null,
  deleteStatus: "idle",
  deleteError: null,
  lastToggle: null,
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

export const fetchEventManagerById = createAsyncThunk(
  "eventManagers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await eventManagersApi.fetchEventManagerById(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load event manager"
      );
    }
  }
);

export const toggleEventManagerStatus = createAsyncThunk(
  "eventManagers/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      return await eventManagersApi.toggleEventManagerStatus(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle event manager status"
      );
    }
  }
);

export const deleteEventManager = createAsyncThunk(
  "eventManagers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await eventManagersApi.deleteEventManager(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete event manager"
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
      })
      .addCase(fetchEventManagerById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchEventManagerById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchEventManagerById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload || "Failed to load event manager";
      })
      .addCase(toggleEventManagerStatus.pending, (state, action) => {
        state.toggleStatus = "loading";
        state.toggleError = null;
        const id = action.meta.arg;
        const current = state.items.find(
          (item) => (item._id || item.id) === id
        );
        if (current?.userId && typeof current.userId.isActive === "boolean") {
          state.lastToggle = { id, previous: current.userId.isActive };
          state.items = state.items.map((item) => {
            if ((item._id || item.id) !== id) return item;
            return {
              ...item,
              userId: { ...item.userId, isActive: !item.userId.isActive },
            };
          });
        }
        if (
          state.selected &&
          (state.selected._id || state.selected.id) === id
        ) {
          const userId = state.selected.userId;
          if (userId && typeof userId.isActive === "boolean") {
            state.selected = {
              ...state.selected,
              userId: { ...userId, isActive: !userId.isActive },
            };
          }
        }
      })
      .addCase(toggleEventManagerStatus.fulfilled, (state, action) => {
        state.toggleStatus = "succeeded";
        const updated = action.payload;
        if (updated?._id || updated?.id) {
          const id = updated._id || updated.id;
          state.items = state.items.map((item) => {
            if ((item._id || item.id) !== id) return item;
            return { ...item, ...updated };
          });
        }
        if (state.selected && updated) {
          state.selected = { ...state.selected, ...updated };
        }
        state.lastToggle = null;
      })
      .addCase(toggleEventManagerStatus.rejected, (state, action) => {
        state.toggleStatus = "failed";
        state.toggleError =
          action.payload || "Failed to toggle event manager status";
        const last = state.lastToggle;
        if (last) {
          state.items = state.items.map((item) => {
            if ((item._id || item.id) !== last.id) return item;
            if (!item.userId) return item;
            return {
              ...item,
              userId: { ...item.userId, isActive: last.previous },
            };
          });
          if (
            state.selected &&
            (state.selected._id || state.selected.id) === last.id
          ) {
            const userId = state.selected.userId;
            if (userId) {
              state.selected = {
                ...state.selected,
                userId: { ...userId, isActive: last.previous },
              };
            }
          }
        }
        state.lastToggle = null;
      })
      .addCase(deleteEventManager.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteEventManager.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        const id = action.payload;
        if (id) {
          state.items = state.items.filter(
            (item) => (item._id || item.id) !== id
          );
        }
      })
      .addCase(deleteEventManager.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Failed to delete event manager";
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
export const selectSelectedEventManager = (state) =>
  state.eventManagers.selected;
export const selectSelectedEventManagerStatus = (state) =>
  state.eventManagers.selectedStatus;
export const selectSelectedEventManagerError = (state) =>
  state.eventManagers.selectedError;
export const selectToggleEventManagerStatus = (state) =>
  state.eventManagers.toggleStatus;
export const selectToggleEventManagerError = (state) =>
  state.eventManagers.toggleError;
export const selectDeleteEventManagerStatus = (state) =>
  state.eventManagers.deleteStatus;
export const selectDeleteEventManagerError = (state) =>
  state.eventManagers.deleteError;

export default eventManagersSlice.reducer;
