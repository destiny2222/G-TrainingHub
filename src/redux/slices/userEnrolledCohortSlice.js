import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';


// Initial state
const initialState = {
    enrollment: [],
    loading: false,
    error: null,
};

// Fetch user enrolled cohorts
export const fetchUserEnrolledCohorts = createAsyncThunk(
    'userEnrolledCohorts/fetchUserEnrolledCohorts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/enrollments/cohorts');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const userEnrolledCohortSlice = createSlice({
    name: 'userEnrolledCohorts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserEnrolledCohorts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserEnrolledCohorts.fulfilled, (state, action) => {
                state.loading = false;
                state.enrollment = action.payload;
            })
            .addCase(fetchUserEnrolledCohorts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch enrolled cohorts';
            });
    },
});

export default userEnrolledCohortSlice.reducer;