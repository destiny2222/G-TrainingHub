import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

const initialState = {
  cohorts: [],
  cohortDetails: null,
  loading: false,
  error: null,
};

// Fetch all courses (with pagination/filtering)
export const fetchCohorts = createAsyncThunk(
  "cohorts/fetchCohorts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/courses", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourseDetails: (state) => {
      state.courseDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch courses
      .addCase(fetchCohorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCohorts.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data || action.payload;
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
export default courseSlice.reducer;
