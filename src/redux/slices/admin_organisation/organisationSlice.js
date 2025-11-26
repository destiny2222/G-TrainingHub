import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api  from '../../../utils/api';

const initialState = {
    organization:  null,
    error: null,
    loading: false,
    status: 'idle',
}

// Async thunk to fetch organization details
export const fetchOrg = createAsyncThunk(
    'organiZation/fetchOrg',
    async (__, { rejectWithValue }) => {
        try {
            const response = await api.get('/organization/details');
            // console.log("Fetched Organization Data:", response.data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
        }
    }
) 

// Async thunk to update organization details
export const updateOrg = createAsyncThunk(
    'organization/updateOrg',
    async ({ orgSlug, updatedData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/organization/${orgSlug}/update`, updatedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update organization');
        }
    }
);



// Async thunk to delete organization
export const deleteOrg = createAsyncThunk(
    'organization/deleteOrg',
    async (orgSlug, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/organization/${orgSlug}/delete`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete organization');
        }
    }
);

const organisationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrg.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchOrg.fulfilled, (state, action) => {
                state.loading = false;
                state.organization = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchOrg.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = 'failed';
            });
            builder
            .addCase(updateOrg.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(updateOrg.fulfilled, (state, action) => {
                state.loading = false;
                // state.organization = action.payload;
                state.status = 'succeeded';
            })
            .addCase(updateOrg.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = 'failed';
            });
            builder
            .addCase(deleteOrg.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(deleteOrg.fulfilled, (state, action) => {
                state.loading = false;
                state.organization = null; 
                state.status = 'succeeded';
            })
            .addCase(deleteOrg.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.status = 'failed';
            });
    }
});

export default organisationSlice.reducer;