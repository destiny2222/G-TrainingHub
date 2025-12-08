import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

const initialState = {
  enrollments: [],
  loading: false,
  error: null,
};

// Fetch all enrollments
export const fetchEnrollments = createAsyncThunk(
  "enrollments/fetchEnrollments",
    async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/enrollments");
        return response.data.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);

// Approve certificate for an enrollment
export const approveCertificate = createAsyncThunk(
  "enrollments/approveCertificate",
    async (enrollmentId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/enrollments/${enrollmentId}/approve-certificate`);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);

// unAssign certificate for an enrollment
export const unAssignCertificate = createAsyncThunk(
  "enrollments/unAssignCertificate",
    async (enrollmentId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/enrollments/${enrollmentId}/reject-certificate`);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);

const enrollmentSlice = createSlice({
  name: "enrollments",
  initialState,
    reducers: {},
    extraReducers: (builder) => {
    builder
      .addCase(fetchEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(approveCertificate.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(approveCertificate.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.enrollments.findIndex(enrollment => enrollment.id === action.payload.id);
            if (index !== -1) {
                state.enrollments[index] = action.payload;
            }
        })
        .addCase(approveCertificate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default enrollmentSlice.reducer;