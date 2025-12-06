import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api  from '../../../utils/api';


const initialState = {
    organization:null,
    loading: false,
    error: null,
}

// Async thunk to fetch organization data
export const fetchOrganization = createAsyncThunk(
  'organization/fetchOrganization',
    async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/organizations');
        return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch organization data');
    }
});

// Async thunk to fetch organization data by ID
export const fetchOrganizationById = createAsyncThunk(
    'organization/fetchOrganizationById',
    async (organizationID, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/organizations/${organizationID}/edit`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch organization data by ID');
        }
    }
);

// Async thunk to show organization data by slug
export const fetchOrganizationBySlug = createAsyncThunk(
    'organization/fetchOrganizationBySlug',
    async (organizationSlug, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/organizations/${organizationSlug}/show`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch organization data by slug');
        }
    }
);

// Async thunk to update organization data
export const updateOrganization = createAsyncThunk(
    'organization/updateOrganization',
    async ({ organizationID, organizationData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/organizations/${organizationID}/update`, organizationData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update organization data');
        }
    }
);

// Async thunk to delete organization data
export const deleteOrganization = createAsyncThunk(
    'organization/deleteOrganization',
    async (organizationID,  { rejectWithValue }) => {
        try {
            const response = await api.delete(`/admin/organizations/${organizationID}/delete`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete organization data');
        }
    }
);

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.organization = action.payload;
            })
            .addCase(fetchOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch organization data';
            })  
            .addCase(fetchOrganizationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganizationById.fulfilled, (state, action) => {
                state.loading = false;
                state.organization = action.payload;
            })
            .addCase(fetchOrganizationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch organization data by ID';
            })
            .addCase(updateOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.organization = action.payload;
            })
            .addCase(updateOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update organization data';
            })
            .addCase(deleteOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.organization = state.organization.filter(org => org.id !== action.payload.id);
            })
            .addCase(deleteOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete organization data';
            })
            .addCase(fetchOrganizationBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganizationBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.organization = action.payload;
            })
            .addCase(fetchOrganizationBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch organization data by slug';
            });
            
    },
});

export default organizationSlice.reducer;