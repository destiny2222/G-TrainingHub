import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Initial state
const initialState = {
  assignments: [],
  loading: false,
  error: null,
};

// Fetch user assignments
export const fetchAssignments = createAsyncThunk(
  "userAssignments/fetchAssignments", // Match slice name
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/assignments");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const assignmentsSlice = createSlice({
  name: "userAssignments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAssignments: (state) => {
      state.assignments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assignments";
      });
  },
});

export const { clearError, resetAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
