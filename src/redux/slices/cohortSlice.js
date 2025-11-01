import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks for API calls

// Fetch all cohorts
export const fetchCohorts = createAsyncThunk(
  'cohorts/fetchCohorts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/admin/cohorts', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single cohort
export const fetchCohortById = createAsyncThunk(
  'cohorts/fetchCohortById',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/admin/cohorts/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create new cohort
export const createCohort = createAsyncThunk(
  'cohorts/createCohort',
  async (cohortData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/admin/cohorts/create', cohortData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update existing cohort
export const updateCohort = createAsyncThunk(
  'cohorts/updateCohort',
  async ({ slug, cohortData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/cohorts/${slug}/update`, cohortData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete cohort
export const deleteCohort = createAsyncThunk(
  'cohorts/deleteCohort',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/admin/cohorts/${slug}/delete`);
      return { slug, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get enrolled users for a cohort
export const fetchCohortUsers = createAsyncThunk(
  'cohorts/fetchCohortUsers',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/admin/cohorts/${id}/users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  cohorts: [],
  currentCohort: null,
  enrolledUsers: [],
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

// Cohort slice
const cohortSlice = createSlice({
  name: 'cohorts',
  initialState,
  reducers: {
    clearCurrentCohort: (state) => {
      state.currentCohort = null;
    },
    clearEnrolledUsers: (state) => {
      state.enrolledUsers = [];
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
        state.error = action.payload || 'Failed to fetch cohorts';
      })

      // Fetch cohort by ID
      .addCase(fetchCohortById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCohortById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCohort = action.payload.data || action.payload;
      })
      .addCase(fetchCohortById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cohort';
      })

      // Create cohort
      .addCase(createCohort.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCohort.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cohorts.unshift(action.payload.data || action.payload);
      })
      .addCase(createCohort.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create cohort';
        state.success = false;
      })

      // Update cohort
      .addCase(updateCohort.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCohort.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedCohort = action.payload.data || action.payload;
        const index = state.cohorts.findIndex(
          (cohort) => cohort.id === updatedCohort.id
        );
        if (index !== -1) {
          state.cohorts[index] = updatedCohort;
        }
        state.currentCohort = updatedCohort;
      })
      .addCase(updateCohort.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update cohort';
        state.success = false;
      })

      // Delete cohort
      .addCase(deleteCohort.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCohort.fulfilled, (state, action) => {
        state.loading = false;
        state.cohorts = state.cohorts.filter(
          (cohort) => (cohort.slug || cohort.id) !== action.payload.slug
        );
      })
      .addCase(deleteCohort.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete cohort';
      })

      // Fetch cohort users
      .addCase(fetchCohortUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCohortUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledUsers = action.payload.data || action.payload;
      })
      .addCase(fetchCohortUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch enrolled users';
      });
  },
});

export const { clearCurrentCohort, clearEnrolledUsers, clearError, clearSuccess } = cohortSlice.actions;
export default cohortSlice.reducer;
