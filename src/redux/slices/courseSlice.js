import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks for API calls

// Fetch all courses (with pagination/filtering)
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/courses', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single course for editing or viewing
export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/courses/${slug}/edit`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create new course
export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/courses/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update existing course
export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ slug, formData }, { rejectWithValue }) => {
    try {
        // Use POST with _method=PUT for FormData with Laravel
        const response = await api.post(`/admin/courses/${slug}/update`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete course
export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/courses/${slug}/delete`);
      return { slug, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    total: 0,
    currentPage: 1,
    perPage: 10,
    lastPage: 1,
  },
};

// Course slice
const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
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
        state.error = action.payload || 'Failed to fetch courses';
      })

      // Fetch course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.data || action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch course';
      })

      // Create course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.courses.unshift(action.payload.data || action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create course';
        state.success = false;
      })

      // Update course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Backend returns { message: ..., course: ... }
        const updatedCourse = action.payload.course || action.payload.data || action.payload;
        const index = state.courses.findIndex(
          (course) => course.id === updatedCourse.id
        );
        if (index !== -1) {
          state.courses[index] = updatedCourse;
        }
        state.currentCourse = updatedCourse;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update course';
        state.success = false;
      })

      // Delete course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(
          (course) => (course.slug || course.id) !== action.payload.slug
        );
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete course';
      });
  },
});

export const { clearCurrentCourse, clearError, clearSuccess } = courseSlice.actions;
export default courseSlice.reducer;
