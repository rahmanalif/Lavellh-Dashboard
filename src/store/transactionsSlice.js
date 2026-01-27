import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as transactionsApi from "../api/transactionsApi";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
  filters: {
    type: "all",
    status: null,
    search: null,
    from: null,
    to: null,
  },
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (
    { page = 1, limit = 20, type = "all", status, search, from, to },
    { rejectWithValue }
  ) => {
    try {
      return await transactionsApi.fetchTransactions({
        page,
        limit,
        type,
        status,
        search,
        from,
        to,
      });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load transactions"
      );
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        const data = action.payload || {};
        state.status = "succeeded";
        state.items = data.transactions || [];
        state.total = data.total || state.items.length;
        state.currentPage = Number(data.currentPage) || 1;
        state.totalPages = data.totalPages || 1;
        state.filters = data.filters || state.filters;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load transactions";
      });
  },
});

export const selectTransactions = (state) => state.transactions.items;
export const selectTransactionsStatus = (state) => state.transactions.status;
export const selectTransactionsError = (state) => state.transactions.error;
export const selectTransactionsTotalPages = (state) =>
  state.transactions.totalPages;
export const selectTransactionsCurrentPage = (state) =>
  state.transactions.currentPage;
export const selectTransactionsFilters = (state) =>
  state.transactions.filters;

export default transactionsSlice.reducer;
