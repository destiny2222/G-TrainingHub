import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

const initialState = {
    scheduleSessions: [],
    loading: false,
    error: null,
};

// Fetch all schedule sessions
export const fetchScheduleSessions = createAsyncThunk(
    "scheduleSession/fetchScheduleSessions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/schedule-sessions");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);
const scheduleSessionSlice = createSlice({
    name: "scheduleSession",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchScheduleSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchScheduleSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.scheduleSessions = action.payload;
            })
            .addCase(fetchScheduleSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export default scheduleSessionSlice.reducer;