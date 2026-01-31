import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as settingsApi from "../api/settingsApi";
import * as adminSettingsApi from "../api/adminSettingsApi";
import * as roleSettingsApi from "../api/roleSettingsApi";

const initialState = {
  publicByKey: {},
  publicStatusByKey: {},
  publicErrorByKey: {},
  roleByKey: {},
  roleStatusByKey: {},
  roleErrorByKey: {},
  adminList: [],
  adminListStatus: "idle",
  adminListError: null,
  adminByKey: {},
  adminStatusByKey: {},
  adminErrorByKey: {},
  upsertStatusByKey: {},
  upsertErrorByKey: {},
};

export const fetchPublicSetting = createAsyncThunk(
  "settings/fetchPublic",
  async (key, { rejectWithValue }) => {
    try {
      const setting = await settingsApi.fetchPublicSetting(key);
      return { key, setting };
    } catch (err) {
      return rejectWithValue({
        key,
        message: err.response?.data?.message || "Failed to load settings",
      });
    }
  }
);

export const fetchAdminSettings = createAsyncThunk(
  "settings/fetchAdminList",
  async (_, { rejectWithValue }) => {
    try {
      return await adminSettingsApi.fetchAdminSettings();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load admin settings"
      );
    }
  }
);

export const fetchAdminSetting = createAsyncThunk(
  "settings/fetchAdminSetting",
  async (key, { rejectWithValue }) => {
    try {
      const setting = await adminSettingsApi.fetchAdminSetting(key);
      return { key, setting };
    } catch (err) {
      return rejectWithValue({
        key,
        message: err.response?.data?.message || "Failed to load setting",
      });
    }
  }
);

export const fetchRoleSetting = createAsyncThunk(
  "settings/fetchRoleSetting",
  async ({ role, key }, { rejectWithValue }) => {
    try {
      const setting = await roleSettingsApi.fetchRoleSetting({ role, key });
      return { role, key, setting };
    } catch (err) {
      return rejectWithValue({
        role,
        key,
        message: err.response?.data?.message || "Failed to load setting",
      });
    }
  }
);

export const upsertAdminSetting = createAsyncThunk(
  "settings/upsertAdminSetting",
  async ({ key, title, content }, { rejectWithValue }) => {
    try {
      const setting = await adminSettingsApi.upsertAdminSetting({
        key,
        title,
        content,
      });
      return { key, setting };
    } catch (err) {
      return rejectWithValue({
        key,
        message: err.response?.data?.message || "Failed to save setting",
      });
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicSetting.pending, (state, action) => {
        const key = action.meta.arg;
        state.publicStatusByKey[key] = "loading";
        state.publicErrorByKey[key] = null;
      })
      .addCase(fetchPublicSetting.fulfilled, (state, action) => {
        const { key, setting } = action.payload;
        state.publicStatusByKey[key] = "succeeded";
        state.publicByKey[key] = setting;
      })
      .addCase(fetchPublicSetting.rejected, (state, action) => {
        const { key, message } = action.payload || {};
        if (key) {
          state.publicStatusByKey[key] = "failed";
          state.publicErrorByKey[key] = message || "Failed to load settings";
        }
      })
      .addCase(fetchAdminSettings.pending, (state) => {
        state.adminListStatus = "loading";
        state.adminListError = null;
      })
      .addCase(fetchAdminSettings.fulfilled, (state, action) => {
        state.adminListStatus = "succeeded";
        state.adminList = action.payload || [];
      })
      .addCase(fetchAdminSettings.rejected, (state, action) => {
        state.adminListStatus = "failed";
        state.adminListError = action.payload || "Failed to load admin settings";
      })
      .addCase(fetchAdminSetting.pending, (state, action) => {
        const key = action.meta.arg;
        state.adminStatusByKey[key] = "loading";
        state.adminErrorByKey[key] = null;
      })
      .addCase(fetchAdminSetting.fulfilled, (state, action) => {
        const { key, setting } = action.payload;
        state.adminStatusByKey[key] = "succeeded";
        state.adminByKey[key] = setting;
      })
      .addCase(fetchAdminSetting.rejected, (state, action) => {
        const { key, message } = action.payload || {};
        if (key) {
          state.adminStatusByKey[key] = "failed";
          state.adminErrorByKey[key] = message || "Failed to load setting";
        }
      })
      .addCase(fetchRoleSetting.pending, (state, action) => {
        const { role, key } = action.meta.arg || {};
        if (!role || !key) return;
        const roleKey = `${role}:${key}`;
        state.roleStatusByKey[roleKey] = "loading";
        state.roleErrorByKey[roleKey] = null;
      })
      .addCase(fetchRoleSetting.fulfilled, (state, action) => {
        const { role, key, setting } = action.payload || {};
        if (!role || !key) return;
        const roleKey = `${role}:${key}`;
        state.roleStatusByKey[roleKey] = "succeeded";
        state.roleByKey[roleKey] = setting;
      })
      .addCase(fetchRoleSetting.rejected, (state, action) => {
        const { role, key, message } = action.payload || {};
        if (!role || !key) return;
        const roleKey = `${role}:${key}`;
        state.roleStatusByKey[roleKey] = "failed";
        state.roleErrorByKey[roleKey] = message || "Failed to load setting";
      })
      .addCase(upsertAdminSetting.pending, (state, action) => {
        const key = action.meta.arg.key;
        state.upsertStatusByKey[key] = "loading";
        state.upsertErrorByKey[key] = null;
      })
      .addCase(upsertAdminSetting.fulfilled, (state, action) => {
        const { key, setting } = action.payload;
        state.upsertStatusByKey[key] = "succeeded";
        state.adminByKey[key] = setting;
        state.publicByKey[key] = setting;
        ["user", "provider"].forEach((role) => {
          const roleKey = `${role}:${key}`;
          state.roleByKey[roleKey] = setting;
          state.roleStatusByKey[roleKey] = "succeeded";
        });
      })
      .addCase(upsertAdminSetting.rejected, (state, action) => {
        const { key, message } = action.payload || {};
        if (key) {
          state.upsertStatusByKey[key] = "failed";
          state.upsertErrorByKey[key] = message || "Failed to save setting";
        }
      });
  },
});

export const selectPublicSetting = (key) => (state) =>
  state.settings.publicByKey[key];
export const selectPublicSettingStatus = (key) => (state) =>
  state.settings.publicStatusByKey[key] || "idle";
export const selectPublicSettingError = (key) => (state) =>
  state.settings.publicErrorByKey[key];

export const selectAdminSetting = (key) => (state) =>
  state.settings.adminByKey[key];
export const selectAdminSettingStatus = (key) => (state) =>
  state.settings.adminStatusByKey[key] || "idle";
export const selectAdminSettingError = (key) => (state) =>
  state.settings.adminErrorByKey[key];
export const selectUpsertSettingStatus = (key) => (state) =>
  state.settings.upsertStatusByKey[key] || "idle";
export const selectUpsertSettingError = (key) => (state) =>
  state.settings.upsertErrorByKey[key];

export const selectRoleSetting = (role, key) => (state) =>
  state.settings.roleByKey[`${role}:${key}`];
export const selectRoleSettingStatus = (role, key) => (state) =>
  state.settings.roleStatusByKey[`${role}:${key}`] || "idle";
export const selectRoleSettingError = (role, key) => (state) =>
  state.settings.roleErrorByKey[`${role}:${key}`];

export default settingsSlice.reducer;
