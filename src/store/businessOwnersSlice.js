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
  deleteStatus: "idle",
  deleteError: null,
  lastToggle: null,
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

export const deleteBusinessOwner = createAsyncThunk(
  "businessOwners/delete",
  async (id, { rejectWithValue }) => {
    try {
      await businessOwnersApi.deleteBusinessOwner(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete business owner"
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
      .addCase(toggleBusinessOwnerStatus.pending, (state, action) => {
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
        state.lastToggle = null;
      })
      .addCase(toggleBusinessOwnerStatus.rejected, (state, action) => {
        state.toggleStatus = "failed";
        state.toggleError =
          action.payload || "Failed to toggle business owner status";
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
      .addCase(deleteBusinessOwner.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteBusinessOwner.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        const id = action.payload;
        if (id) {
          state.items = state.items.filter(
            (item) => (item._id || item.id) !== id
          );
        }
      })
      .addCase(deleteBusinessOwner.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          action.payload || "Failed to delete business owner";
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
export const selectDeleteBusinessOwnerStatus = (state) =>
  state.businessOwners.deleteStatus;
export const selectDeleteBusinessOwnerError = (state) =>
  state.businessOwners.deleteError;

export default businessOwnersSlice.reducer;
