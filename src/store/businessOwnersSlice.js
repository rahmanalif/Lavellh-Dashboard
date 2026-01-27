import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as businessOwnersApi from "../api/businessOwnersApi";

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
};

export const fetchBusinessOwners = createAsyncThunk(
  "businessOwners/fetchAll",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      return await businessOwnersApi.fetchBusinessOwners({
        page,
        limit,
        search,
      });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load business owners"
      );
    }
  }
);

export const fetchBusinessOwnerById = createAsyncThunk(
  "businessOwners/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await businessOwnersApi.fetchBusinessOwnerById(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load business owner"
      );
    }
  }
);

export const toggleBusinessOwnerStatus = createAsyncThunk(
  "businessOwners/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      return await businessOwnersApi.toggleBusinessOwnerStatus(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle business owner status"
      );
    }
  }
);

const businessOwnersSlice = createSlice({
  name: "businessOwners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessOwners.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBusinessOwners.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.status = "succeeded";
        state.items = data.businessOwners || data.owners || data.items || [];
        state.totalPages = data.totalPages || 1;
        state.currentPage = Number(data.currentPage) || 1;
        state.total = data.total || state.items.length;
      })
      .addCase(fetchBusinessOwners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load business owners";
      })
      .addCase(fetchBusinessOwnerById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchBusinessOwnerById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchBusinessOwnerById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload || "Failed to load business owner";
      })
      .addCase(toggleBusinessOwnerStatus.pending, (state) => {
        state.toggleStatus = "loading";
        state.toggleError = null;
      })
      .addCase(toggleBusinessOwnerStatus.fulfilled, (state, action) => {
        state.toggleStatus = "succeeded";
        const updated = action.payload;
        if (updated?._id || updated?.id) {
          const id = updated._id || updated.id;
          state.items = state.items.map((item) => {
            if ((item._id || item.id) !== id) return item;
            const next = { ...item, ...updated };
            if (!updated.userId && item.userId) {
              next.userId = item.userId;
            }
            if (!updated.businessAddress && item.businessAddress) {
              next.businessAddress = item.businessAddress;
            }
            if (!updated.businessCategory && item.businessCategory) {
              next.businessCategory = item.businessCategory;
            }
            if (!updated.idCard && item.idCard) {
              next.idCard = item.idCard;
            }
            return next;
          });
        }
        if (state.selected) {
          state.selected = {
            ...state.selected,
            ...updated,
            userId:
              updated?.userId && Object.keys(updated.userId).length
                ? updated.userId
                : state.selected.userId,
            businessAddress:
              updated?.businessAddress || state.selected.businessAddress,
            businessCategory:
              updated?.businessCategory || state.selected.businessCategory,
            idCard: updated?.idCard || state.selected.idCard,
          };
        } else {
          state.selected = updated || state.selected;
        }
      })
      .addCase(toggleBusinessOwnerStatus.rejected, (state, action) => {
        state.toggleStatus = "failed";
        state.toggleError =
          action.payload || "Failed to toggle business owner status";
      });
  },
});

export const selectBusinessOwners = (state) => state.businessOwners.items;
export const selectBusinessOwnersStatus = (state) => state.businessOwners.status;
export const selectBusinessOwnersError = (state) => state.businessOwners.error;
export const selectBusinessOwnersTotalPages = (state) =>
  state.businessOwners.totalPages;
export const selectBusinessOwnersCurrentPage = (state) =>
  state.businessOwners.currentPage;
export const selectBusinessOwnersTotal = (state) => state.businessOwners.total;
export const selectSelectedBusinessOwner = (state) =>
  state.businessOwners.selected;
export const selectSelectedBusinessOwnerStatus = (state) =>
  state.businessOwners.selectedStatus;
export const selectSelectedBusinessOwnerError = (state) =>
  state.businessOwners.selectedError;
export const selectToggleBusinessOwnerStatus = (state) =>
  state.businessOwners.toggleStatus;
export const selectToggleBusinessOwnerError = (state) =>
  state.businessOwners.toggleError;

export default businessOwnersSlice.reducer;
