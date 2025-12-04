import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  assignments: [],
  assignmentDetails: null,
  loading: false,
  error: null,
};


// Fetch all assignments
export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/user/assignments");
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    },
);

// Fetch single assignment
export const fetchAssignment = createAsyncThunk(
  "assignments/fetchAssignment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/assignments/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
    reducers: {},
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
        state.error = action.payload;
      })
        .addCase(fetchAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentDetails = action.payload;
      })
      .addCase(fetchAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});
export default assignmentSlice.reducer;