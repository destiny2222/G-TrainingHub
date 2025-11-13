import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Initial state
const initialState = {
  organization: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks for API calls

// Get authenticated organization details by slug
export const getOrganization = createAsyncThunk(
  'organization/getOrganization',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/organization/${slug}`);
      console.log('Fetched organization details:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch organization details'
      );
    }
  }
);

// Update organization by slug
export const updateOrganization = createAsyncThunk(
  'organization/updateOrganization',
  async ({ slug, organizationData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/organization/${slug}`, organizationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update organization'
      );
    }
  }
);

// Organization slice
const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    clearSuccess: (state) => {
      state.success = false;
    },
    
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get authenticated organization
      .addCase(getOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organization = action.payload;
        state.error = null;
      })
      .addCase(getOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.organization = null;
      })
      
      // Update organization
      .addCase(updateOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organization = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

// Export actions
export const {
  clearError,
  clearSuccess,
  resetState,
} = organizationSlice.actions;

// Export reducer
export default organizationSlice.reducer;
