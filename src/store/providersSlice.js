import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as providersApi from "../api/providersApi";

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
  approveStatus: "idle",
  approveError: null,
  rejectStatus: "idle",
  rejectError: null,
};

export const fetchProviders = createAsyncThunk(
  "providers/fetchAll",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      return await providersApi.fetchProviders({ page, limit, search });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load providers"
      );
    }
  }
);

export const fetchProviderById = createAsyncThunk(
  "providers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await providersApi.fetchProviderById(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load provider"
      );
    }
  }
);

export const approveProvider = createAsyncThunk(
  "providers/approve",
  async (id, { rejectWithValue }) => {
    try {
      return await providersApi.approveProvider(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to approve provider"
      );
    }
  }
);

export const rejectProvider = createAsyncThunk(
  "providers/reject",
  async (id, { rejectWithValue }) => {
    try {
      return await providersApi.rejectProvider(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reject provider"
      );
    }
  }
);

const providersSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.status = "succeeded";
        state.items = data.providers || [];
        state.totalPages = data.totalPages || 1;
        state.currentPage = Number(data.currentPage) || 1;
        state.total = data.total || state.items.length;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load providers";
      })
      .addCase(fetchProviderById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchProviderById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchProviderById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload || "Failed to load provider";
      })
      .addCase(approveProvider.pending, (state) => {
        state.approveStatus = "loading";
        state.approveError = null;
      })
      .addCase(approveProvider.fulfilled, (state, action) => {
        state.approveStatus = "succeeded";
        const updated = action.payload;
        if (updated?._id || updated?.id) {
          const id = updated._id || updated.id;
          state.items = state.items.map((item) => {
            if ((item._id || item.id) !== id) return item;
            const next = { ...item, ...updated };
            if (!updated.userId && item.userId) {
              next.userId = item.userId;
            }
            return next;
          });
        }
        if (state.selected && !updated.userId && state.selected.userId) {
          state.selected = { ...state.selected, ...updated };
        } else {
          state.selected = updated || state.selected;
        }
      })
      .addCase(approveProvider.rejected, (state, action) => {
        state.approveStatus = "failed";
        state.approveError = action.payload || "Failed to approve provider";
      })
      .addCase(rejectProvider.pending, (state) => {
        state.rejectStatus = "loading";
        state.rejectError = null;
      })
      .addCase(rejectProvider.fulfilled, (state, action) => {
        state.rejectStatus = "succeeded";
        const updated = action.payload;
        if (updated?._id || updated?.id) {
          const id = updated._id || updated.id;
          state.items = state.items.map((item) => {
            if ((item._id || item.id) !== id) return item;
            const next = { ...item, ...updated };
            if (!updated.userId && item.userId) {
              next.userId = item.userId;
            }
            return next;
          });
        }
        if (state.selected && !updated.userId && state.selected.userId) {
          state.selected = { ...state.selected, ...updated };
        } else {
          state.selected = updated || state.selected;
        }
      })
      .addCase(rejectProvider.rejected, (state, action) => {
        state.rejectStatus = "failed";
        state.rejectError = action.payload || "Failed to reject provider";
      });
  },
});

export const selectProviders = (state) => state.providers.items;
export const selectProvidersStatus = (state) => state.providers.status;
export const selectProvidersError = (state) => state.providers.error;
export const selectProvidersTotalPages = (state) => state.providers.totalPages;
export const selectProvidersCurrentPage = (state) => state.providers.currentPage;
export const selectProvidersTotal = (state) => state.providers.total;
export const selectSelectedProvider = (state) => state.providers.selected;
export const selectSelectedProviderStatus = (state) =>
  state.providers.selectedStatus;
export const selectSelectedProviderError = (state) =>
  state.providers.selectedError;
export const selectApproveProviderStatus = (state) =>
  state.providers.approveStatus;
export const selectApproveProviderError = (state) =>
  state.providers.approveError;
export const selectRejectProviderStatus = (state) =>
  state.providers.rejectStatus;
export const selectRejectProviderError = (state) =>
  state.providers.rejectError;

export default providersSlice.reducer;
