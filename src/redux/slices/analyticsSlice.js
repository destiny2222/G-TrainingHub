import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";


const initialState = {
    analyticsData: null,
    loading: false,
    error: null,
};

// Fetch analytics data
export const fetchAnalyticsData = createAsyncThunk(
    "analytics/fetchAnalyticsData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/user/analytics");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);

const analyticsSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalyticsData.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
                state.loading = false;
                state.analyticsData = action.payload;
            })
            .addCase(fetchAnalyticsData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export default analyticsSlice.reducer;