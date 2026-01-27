import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as categoriesApi from "../api/categoriesApi";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  selected: null,
  selectedStatus: "idle",
  selectedError: null,
  createStatus: "idle",
  createError: null,
  uploadStatus: "idle",
  uploadError: null,
  updateStatus: "idle",
  updateError: null,
  toggleStatus: "idle",
  toggleError: null,
  deleteStatus: "idle",
  deleteError: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await categoriesApi.fetchCategories();
      return Array.isArray(data)
        ? data
        : data?.items || data?.categories || data?.data?.categories || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load categories"
      );
    }
  }
);

export const uploadCategoryIcon = createAsyncThunk(
  "categories/uploadIcon",
  async (file, { rejectWithValue }) => {
    try {
      return await categoriesApi.uploadCategoryIcon(file);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Icon upload failed"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await categoriesApi.createCategory(payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Create category failed"
      );
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await categoriesApi.fetchCategoryById(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load category"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await categoriesApi.updateCategory(id, payload);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update category failed"
      );
    }
  }
);

export const toggleCategoryStatus = createAsyncThunk(
  "categories/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      return await categoriesApi.toggleCategoryStatus(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Toggle status failed"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await categoriesApi.deleteCategory(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete category failed"
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCreateState(state) {
      state.createStatus = "idle";
      state.createError = null;
    },
    clearSelectedState(state) {
      state.selected = null;
      state.selectedStatus = "idle";
      state.selectedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load categories";
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload || "Failed to load category";
      })
      .addCase(uploadCategoryIcon.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadError = null;
      })
      .addCase(uploadCategoryIcon.fulfilled, (state) => {
        state.uploadStatus = "succeeded";
      })
      .addCase(uploadCategoryIcon.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.payload || "Icon upload failed";
      })
      .addCase(createCategory.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        if (action.payload) {
          state.items = [action.payload, ...state.items];
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Create category failed";
      })
      .addCase(updateCategory.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const updated = action.payload;
        if (updated?._id || updated?.id) {
          const id = updated._id || updated.id;
          state.items = state.items.map((item) =>
            (item._id || item.id) === id ? { ...item, ...updated } : item
          );
        }
        state.selected = updated || state.selected;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Update category failed";
      })
      .addCase(toggleCategoryStatus.pending, (state) => {
        state.toggleStatus = "loading";
        state.toggleError = null;
      })
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        state.toggleStatus = "succeeded";
        const updated = action.payload;
        if (updated?._id || updated?.id) {
          const id = updated._id || updated.id;
          state.items = state.items.map((item) =>
            (item._id || item.id) === id ? { ...item, ...updated } : item
          );
        }
        state.selected = updated || state.selected;
      })
      .addCase(toggleCategoryStatus.rejected, (state, action) => {
        state.toggleStatus = "failed";
        state.toggleError = action.payload || "Toggle status failed";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter(
          (item) => (item._id || item.id) !== action.payload
        );
        if (state.selected && (state.selected._id || state.selected.id) === action.payload) {
          state.selected = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Delete category failed";
      });
  },
});

export const { clearCreateState, clearSelectedState } =
  categoriesSlice.actions;

export const selectCategories = (state) => state.categories.items;
export const selectCategoriesStatus = (state) => state.categories.status;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCreateStatus = (state) => state.categories.createStatus;
export const selectCreateError = (state) => state.categories.createError;
export const selectUploadStatus = (state) => state.categories.uploadStatus;
export const selectUploadError = (state) => state.categories.uploadError;
export const selectSelectedCategory = (state) => state.categories.selected;
export const selectSelectedStatus = (state) => state.categories.selectedStatus;
export const selectSelectedError = (state) => state.categories.selectedError;
export const selectUpdateStatus = (state) => state.categories.updateStatus;
export const selectUpdateError = (state) => state.categories.updateError;
export const selectToggleStatus = (state) => state.categories.toggleStatus;
export const selectToggleError = (state) => state.categories.toggleError;
export const selectDeleteStatus = (state) => state.categories.deleteStatus;
export const selectDeleteError = (state) => state.categories.deleteError;

export default categoriesSlice.reducer;
