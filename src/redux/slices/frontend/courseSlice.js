import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';

const initialState = {
  courses: [],
  courseDetails: null,
  loading: false,
  error: null,
};


// Fetch all courses (with pagination/filtering)
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/courses', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
    reducers: {},
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
                state.error = action.payload || 'Failed to fetch courses';
              });
    },
});
export const {  } = courseSlice.actions;
export default courseSlice.reducer;