import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../../utils/api";


const initialState = {
  activities: [],
  activityDetails: null,
  loading: false,
  error: null,
};

// fetch the activities
export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
    async (limit = 3, { rejectWithValue }) => {
    try {
      const response = await api.get(`/activities/recent?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
    },
);

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
    reducers: {},
    extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export default activitiesSlice.reducer;