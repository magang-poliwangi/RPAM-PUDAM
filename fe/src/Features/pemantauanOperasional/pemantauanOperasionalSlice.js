import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./pemantauanOperasionalApi.js";

const initialState = {
  items: [],
  selected: null,

  status: "idle",
  error: null,

  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },

  query: {
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },

  dropdown: {
    items: [],
    status: "idle",
  },
};

const buildParams = (state) => ({
  page: state.pemantauanOperasional.pagination.page,
  pageSize: state.pemantauanOperasional.pagination.pageSize,
  search: state.pemantauanOperasional.query.search || undefined,
  sortBy: state.pemantauanOperasional.query.sortBy,
  sortOrder: state.pemantauanOperasional.query.sortOrder,
});

export const fetchList = createAsyncThunk(
  "pemantauanOperasional/fetchList",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await api.getAll(buildParams(getState()));

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal memuat data."
      );
    }
  }
);

export const fetchDropdown = createAsyncThunk(
  "pemantauanOperasional/fetchDropdown",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getDropdownKajiUlangRisiko();

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal memuat dropdown."
      );
    }
  }
);

export const createItem = createAsyncThunk(
  "pemantauanOperasional/createItem",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.create(payload);

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal menambah data."
      );
    }
  }
);

export const updateItem = createAsyncThunk(
  "pemantauanOperasional/updateItem",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await api.update(id, payload);

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal mengubah data."
      );
    }
  }
);

export const deleteItem = createAsyncThunk(
  "pemantauanOperasional/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      await api.remove(id);

      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Gagal menghapus data."
      );
    }
  }
);

const pemantauanOperasionalSlice = createSlice({
  name: "pemantauanOperasional",

  initialState,

  reducers: {
    setSearch(state, action) {
      state.query.search = action.payload;

      state.pagination.page = 1;

      state.items = [];
    },

    setSort(state, action) {
      const key = action.payload;

      if (state.query.sortBy === key) {
        state.query.sortOrder =
          state.query.sortOrder === "asc" ? "desc" : "asc";
      } else {
        state.query.sortBy = key;
        state.query.sortOrder = "desc";
      }

      state.pagination.page = 1;

      state.items = [];
    },

    selectItem(state, action) {
      state.selected = action.payload;
    },

    clearSelected(state) {
      state.selected = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchList.pending, (state) => {
        state.status = "loading";

        state.error = null;
      })

      .addCase(fetchList.fulfilled, (state, action) => {
        state.status = "succeeded";

        const newItems = action.payload?.items ?? [];

        if (state.pagination.page === 1) {
          state.items = newItems;
        } else {
          state.items = [...state.items, ...newItems];
        }

        state.pagination.total =
          action.payload?.pagination?.total ?? 0;

        state.pagination.page += 1;
      })

      .addCase(fetchList.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload;
      })

      .addCase(fetchDropdown.pending, (state) => {
        state.dropdown.status = "loading";
      })

      .addCase(fetchDropdown.fulfilled, (state, action) => {
        state.dropdown.status = "succeeded";

        state.dropdown.items = action.payload ?? [];
      })

      .addCase(fetchDropdown.rejected, (state) => {
        state.dropdown.status = "failed";
      })

      .addCase(createItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);

        state.pagination.total += 1;
      })

      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })

      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        );

        state.pagination.total = Math.max(
          0,
          state.pagination.total - 1
        );
      });
  },
});

export const {
  setSearch,
  setSort,
  selectItem,
  clearSelected,
} = pemantauanOperasionalSlice.actions;

export default pemantauanOperasionalSlice.reducer;

export const selectPemantauanItems = (state) =>
  state.pemantauanOperasional.items;

export const selectPemantauanStatus = (state) =>
  state.pemantauanOperasional.status;

export const selectPemantauanError = (state) =>
  state.pemantauanOperasional.error;

export const selectPemantauanQuery = (state) =>
  state.pemantauanOperasional.query;

export const selectPemantauanDropdown = (state) =>
  state.pemantauanOperasional.dropdown.items;

export const selectPemantauanHasMore = (state) =>
  state.pemantauanOperasional.items.length <
  state.pemantauanOperasional.pagination.total;