import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as adminUsersApi from "../api/adminUsersApi";

const normalizeAdmins = (admins = []) => {
  const entities = {};
  const ids = [];
  admins.forEach((admin) => {
    const id = admin?._id || admin?.id;
    if (!id) return;
    entities[id] = admin;
    ids.push(id);
  });
  return { entities, ids };
};

const initialState = {
  ids: [],
  entities: {},
  status: "idle",
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
  selected: null,
  selectedStatus: "idle",
  selectedError: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
  toggleStatus: "idle",
  toggleError: null,
  lastToggle: null,
};

export const fetchAdmins = createAsyncThunk(
  "adminUsers/fetchAll",
  async ({ page = 1, limit = 20, search = "" } = {}, { rejectWithValue }) => {
    try {
      return await adminUsersApi.fetchAdmins({ page, limit, search });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load admins"
      );
    }
  }
);

export const fetchAdminById = createAsyncThunk(
  "adminUsers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await adminUsersApi.fetchAdminById(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load admin"
      );
    }
  }
);

export const createAdmin = createAsyncThunk(
  "adminUsers/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await adminUsersApi.createAdmin(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create admin"
      );
    }
  }
);

export const updateAdmin = createAsyncThunk(
  "adminUsers/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await adminUsersApi.updateAdmin(id, payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update admin"
      );
    }
  }
);

export const toggleAdminStatus = createAsyncThunk(
  "adminUsers/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      return await adminUsersApi.toggleAdminStatus(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle admin status"
      );
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  "adminUsers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await adminUsersApi.deleteAdmin(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete admin"
      );
    }
  }
);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearAdminUsersErrors(state) {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.toggleError = null;
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        const data = action.payload || {};
        const list = data.admins || data.items || data.results || [];
        const normalized = normalizeAdmins(list);
        state.status = "succeeded";
        state.entities = normalized.entities;
        state.ids = normalized.ids;
        state.totalPages = data.totalPages || 1;
        state.currentPage = Number(data.currentPage) || 1;
        state.total = data.total || normalized.ids.length;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load admins";
      })
      .addCase(fetchAdminById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        const admin = action.payload;
        state.selected = admin || null;
        const id = admin?._id || admin?.id;
        if (id) {
          state.entities[id] = admin;
          if (!state.ids.includes(id)) {
            state.ids.unshift(id);
          }
        }
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload || "Failed to load admin";
      })
      .addCase(createAdmin.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        const admin = action.payload;
        const id = admin?._id || admin?.id;
        if (id) {
          state.entities[id] = admin;
          if (!state.ids.includes(id)) {
            state.ids.unshift(id);
          }
        }
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create admin";
      })
      .addCase(updateAdmin.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const admin = action.payload;
        const id = admin?._id || admin?.id;
        if (id) {
          state.entities[id] = { ...state.entities[id], ...admin };
        }
        if (state.selected && id && (state.selected._id || state.selected.id)) {
          const selectedId = state.selected._id || state.selected.id;
          if (selectedId === id) {
            state.selected = { ...state.selected, ...admin };
          }
        }
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Failed to update admin";
      })
      .addCase(toggleAdminStatus.pending, (state, action) => {
        state.toggleStatus = "loading";
        state.toggleError = null;
        const id = action.meta.arg;
        const current = state.entities[id];
        if (current && typeof current.isActive === "boolean") {
          state.lastToggle = { id, previous: current.isActive };
          state.entities[id] = { ...current, isActive: !current.isActive };
        }
      })
      .addCase(toggleAdminStatus.fulfilled, (state, action) => {
        state.toggleStatus = "succeeded";
        const admin = action.payload;
        const id = admin?._id || admin?.id;
        if (id) {
          state.entities[id] = { ...state.entities[id], ...admin };
        }
        state.lastToggle = null;
      })
      .addCase(toggleAdminStatus.rejected, (state, action) => {
        state.toggleStatus = "failed";
        state.toggleError = action.payload || "Failed to toggle admin status";
        const last = state.lastToggle;
        if (last && state.entities[last.id]) {
          state.entities[last.id] = {
            ...state.entities[last.id],
            isActive: last.previous,
          };
        }
        state.lastToggle = null;
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        const id = action.payload;
        if (id && state.entities[id]) {
          delete state.entities[id];
          state.ids = state.ids.filter((itemId) => itemId !== id);
        }
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Failed to delete admin";
      });
  },
});

export const { clearAdminUsersErrors } = adminUsersSlice.actions;

export const selectAdminUsers = (state) =>
  state.adminUsers.ids.map((id) => state.adminUsers.entities[id]);
export const selectAdminUsersStatus = (state) => state.adminUsers.status;
export const selectAdminUsersError = (state) => state.adminUsers.error;
export const selectAdminUsersTotalPages = (state) =>
  state.adminUsers.totalPages;
export const selectAdminUsersCurrentPage = (state) =>
  state.adminUsers.currentPage;
export const selectAdminUsersTotal = (state) => state.adminUsers.total;
export const selectSelectedAdmin = (state) => state.adminUsers.selected;
export const selectSelectedAdminStatus = (state) =>
  state.adminUsers.selectedStatus;
export const selectSelectedAdminError = (state) =>
  state.adminUsers.selectedError;
export const selectCreateAdminStatus = (state) =>
  state.adminUsers.createStatus;
export const selectCreateAdminError = (state) =>
  state.adminUsers.createError;
export const selectUpdateAdminStatus = (state) =>
  state.adminUsers.updateStatus;
export const selectUpdateAdminError = (state) =>
  state.adminUsers.updateError;
export const selectDeleteAdminStatus = (state) =>
  state.adminUsers.deleteStatus;
export const selectDeleteAdminError = (state) =>
  state.adminUsers.deleteError;
export const selectToggleAdminStatus = (state) =>
  state.adminUsers.toggleStatus;
export const selectToggleAdminError = (state) =>
  state.adminUsers.toggleError;

export default adminUsersSlice.reducer;
