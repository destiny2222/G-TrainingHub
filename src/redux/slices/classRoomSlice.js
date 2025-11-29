import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';


// Initial state
const initialState = {
    classRooms: [],
    classRoomDetails: null,
    loading: false,
    error: null,
};

// Fetch all class rooms
export const fetchClassRooms = createAsyncThunk(
    'classRooms/fetchClassRooms',
    async (cohortSlug,  { rejectWithValue }) => {
        try {
            const response = await api.get(`/user/cohorts/${cohortSlug}/zoom/join-info`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const classRoomSlice = createSlice({
    name: 'classRooms',
    initialState,   
    reducers: {
        clearClassRoomDetails: (state) => {
            state.classRoomDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.classRooms = action.payload;
            })
            .addCase(fetchClassRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch class rooms';
            });
    },
});

export const { clearClassRoomDetails } = classRoomSlice.actions;
export default classRoomSlice.reducer;