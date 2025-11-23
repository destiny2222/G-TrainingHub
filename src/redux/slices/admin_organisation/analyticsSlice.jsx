import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api  from '../../../utils/api';


const initialState = {
  analyticsData: null,
  loading: false,
  error: null,
};

// Async thunk to fetch organisation analytics
export const fetchOrganisationAnalytics = createAsyncThunk(
  'analytics/fetchOrganisationAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/organization/analytics');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganisationAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganisationAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsData = action.payload;
      })
      .addCase(fetchOrganisationAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default analyticsSlice.reducer;