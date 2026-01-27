import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as employeesApi from "../api/employeesApi";

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
};

export const fetchEmployeesByOwner = createAsyncThunk(
  "employees/fetchByOwner",
  async ({ ownerId, page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      return await employeesApi.fetchEmployeesByOwner({
        ownerId,
        page,
        limit,
        search,
      });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load employees"
      );
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await employeesApi.fetchEmployeeById(id);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load employee"
      );
    }
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeesByOwner.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEmployeesByOwner.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.status = "succeeded";
        state.items = data.employees || data.items || [];
        state.totalPages = data.totalPages || 1;
        state.currentPage = Number(data.currentPage) || 1;
        state.total = data.total || state.items.length;
      })
      .addCase(fetchEmployeesByOwner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load employees";
      })
      .addCase(fetchEmployeeById.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.selectedError = action.payload || "Failed to load employee";
      });
  },
});

export const selectEmployees = (state) => state.employees.items;
export const selectEmployeesStatus = (state) => state.employees.status;
export const selectEmployeesError = (state) => state.employees.error;
export const selectEmployeesTotalPages = (state) => state.employees.totalPages;
export const selectEmployeesCurrentPage = (state) => state.employees.currentPage;
export const selectEmployeesTotal = (state) => state.employees.total;
export const selectSelectedEmployee = (state) => state.employees.selected;
export const selectSelectedEmployeeStatus = (state) =>
  state.employees.selectedStatus;
export const selectSelectedEmployeeError = (state) =>
  state.employees.selectedError;

export default employeesSlice.reducer;
