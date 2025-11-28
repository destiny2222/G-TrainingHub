import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

// Async Thunks

// 1. Initialize Cohort Payment
export const initializeCohortPayment = createAsyncThunk(
  "trainingProgram/initializeCohortPayment",
  async (cohortId, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/organization/trainings/cohort/initialize-payment",
        { cohort_id: cohortId },
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to initialize payment",
      );
    }
  },
);

// 2. Verify Cohort Payment
export const verifyCohortPayment = createAsyncThunk(
  "trainingProgram/verifyCohortPayment",
  async (reference, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/organization/trainings/cohort/payment/verify/${reference}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Payment verification failed",
      );
    }
  },
);

// 3. Assign Course to Member
export const assignCourseToMember = createAsyncThunk(
  "trainingProgram/assignCourseToMember",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/organization/trainings/assign", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign course",
      );
    }
  },
);

// 4. Unassign Course from Member
export const unassignCourseFromMember = createAsyncThunk(
  "trainingProgram/unassignCourseFromMember",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/organization/trainings/unassign", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unassign course",
      );
    }
  },
);

// 5. Get Member Trainings
export const getMemberTrainings = createAsyncThunk(
  "trainingProgram/getMemberTrainings",
  async (organizationUserId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/organization/trainings/member/${organizationUserId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch member trainings",
      );
    }
  },
);

// 6. Get Organization Cohorts
export const getOrganizationCohorts = createAsyncThunk(
  "trainingProgram/getOrganizationCohorts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/organization/trainings/cohorts");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch organization cohorts",
      );
    }
  },
);

// 7. Get Cohort Members
export const getCohortMembers = createAsyncThunk(
  "trainingProgram/getCohortMembers",
  async (cohortId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/organization/trainings/cohorts/${cohortId}/members`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cohort members",
      );
    }
  },
);

const initialState = {
  memberTrainings: [],
  organizationCohorts: [],
  cohortMembers: [],
  currentCohort: null,
  loading: false,
  error: null,
  success: false,
  message: "",
  paymentLoading: false,
  paymentError: null,
  paymentData: null,
};

const trainingProgramSlice = createSlice({
  name: "trainingProgram",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
      state.paymentLoading = false;
      state.paymentError = null;
      state.paymentData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Payment
      .addCase(initializeCohortPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(initializeCohortPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentData = action.payload.data;
      })
      .addCase(initializeCohortPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })

      // Verify Payment
      .addCase(verifyCohortPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
        state.success = false;
      })
      .addCase(verifyCohortPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(verifyCohortPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })

      // Assign Course
      .addCase(assignCourseToMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(assignCourseToMember.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(assignCourseToMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Unassign Course
      .addCase(unassignCourseFromMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(unassignCourseFromMember.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(unassignCourseFromMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Member Trainings
      .addCase(getMemberTrainings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMemberTrainings.fulfilled, (state, action) => {
        state.loading = false;
        state.memberTrainings = action.payload.data;
      })
      .addCase(getMemberTrainings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Organization Cohorts
      .addCase(getOrganizationCohorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizationCohorts.fulfilled, (state, action) => {
        state.loading = false;
        state.organizationCohorts = action.payload.data;
      })
      .addCase(getOrganizationCohorts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Cohort Members
      .addCase(getCohortMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCohortMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.cohortMembers = action.payload.data;
        if (action.payload.data && action.payload.data.length > 0) {
          const firstMember = action.payload.data[0];
          state.currentCohort = {
            id: firstMember.cohort_id,
            name: firstMember.cohort_name,
            course_title: firstMember.course_title,
            start_date: firstMember.start_date,
            end_date: firstMember.end_date,
          };
        }
      })
      .addCase(getCohortMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = trainingProgramSlice.actions;
export default trainingProgramSlice.reducer;
