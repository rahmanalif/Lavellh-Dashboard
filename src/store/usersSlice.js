import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as usersApi from "../api/usersApi";

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
  deleteStatus: "idle",
  deleteError: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      return await usersApi.fetchUsers({ page, limit, search });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load users"
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await usersApi.fetchUserById(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await usersApi.deleteUser(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.status = "succeeded";
        state.items = data.users || [];
        state.totalPages = data.totalPages || 1;
        state.currentPage = data.currentPage || 1;
        state.total = data.total || state.items.length;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load users";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload || "Failed to load user";
      })
      .addCase(deleteUser.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter(
          (item) => (item._id || item.id) !== action.payload
        );
        if (state.selected && (state.selected._id || state.selected.id) === action.payload) {
          state.selected = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Failed to delete user";
      });
  },
});

export const selectUsers = (state) => state.users.items;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;
export const selectUsersTotalPages = (state) => state.users.totalPages;
export const selectUsersCurrentPage = (state) => state.users.currentPage;
export const selectUsersTotal = (state) => state.users.total;
export const selectSelectedUser = (state) => state.users.selected;
export const selectSelectedUserStatus = (state) => state.users.selectedStatus;
export const selectSelectedUserError = (state) => state.users.selectedError;
export const selectDeleteUserStatus = (state) => state.users.deleteStatus;
export const selectDeleteUserError = (state) => state.users.deleteError;

export default usersSlice.reducer;
