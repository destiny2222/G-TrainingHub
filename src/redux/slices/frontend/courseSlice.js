import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

const initialState = {
  courses: [],
  courseDetails: null,
  loading: false,
  error: null,
};

// Fetch all courses (with pagination/filtering)
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/courses", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Fetch course details by ID
export const fetchCourseDetails = createAsyncThunk(
  "courses/fetchCourseDetails",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
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
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
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
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch courses";
      })
      // Fetch course details
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.courseDetails = action.payload.data || action.payload;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch course details";
      });
  },
});
export const { clearCourseDetails } = courseSlice.actions;
export default courseSlice.reducer;
