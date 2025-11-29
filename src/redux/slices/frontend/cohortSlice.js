import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

const initialState = {
  cohorts: [],
  loading: false,
  error: null,
};

// Fetch all cohorts (with pagination/filtering)
export const fetchCohorts = createAsyncThunk(
  "cohorts/fetchCohorts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/cohorts", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const cohortSlice = createSlice({
  name: "cohorts",
  initialState,
  extraReducers: (builder) => {
    builder
      // Fetch cohorts
      .addCase(fetchCohorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCohorts.fulfilled, (state, action) => {
        state.loading = false;
        state.cohorts = action.payload.data || action.payload;
        if (action.payload.meta) {
          state.pagination = {
            total: action.payload.meta.total,
            currentPage: action.payload.meta.current_page,
            perPage: action.payload.meta.per_page,
            lastPage: action.payload.meta.last_page,
          };
        }
      })
      .addCase(fetchCohorts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch courses";
      });
  },
});
export default cohortSlice.reducer;
