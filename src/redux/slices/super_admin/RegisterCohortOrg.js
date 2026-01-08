import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

const initialState = {
  subscriptions: [],
  loading: false,
  actionLoading: false,
  error: null,
};

// ✅ Fetch all registered org cohort payments
export const fetchRegisterOrg = createAsyncThunk(
  "registerOrg/fetchRegisterOrg",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/register/cohort/org");
      return response.data?.data ?? [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Approve payment (payment_status = 1)
export const approvePayment = createAsyncThunk(
  "registerOrg/approvePayment",
  async ({ organization_id, cohort_id }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/register/cohort/approve/org", {
        organization_id,
        cohort_id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Reject payment (payment_status = 0)
export const rejectPayment = createAsyncThunk(
  "registerOrg/rejectPayment",
  async ({ organization_id, cohort_id }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/register/cohort/reject/org", {
        organization_id,
        cohort_id,
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const registerOrgSlice = createSlice({
  name: "registerOrg",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisterOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchRegisterOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // approve
      .addCase(approvePayment.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(approvePayment.fulfilled, (state, action) => {
        state.actionLoading = false;

        // If backend returns updated item -> update list without refetch
        const updated = action.payload?.data;
        if (updated?.id) {
          const idx = state.subscriptions.findIndex((x) => x.id === updated.id);
          if (idx !== -1) state.subscriptions[idx] = updated;
        }
      })
      .addCase(approvePayment.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // reject
      .addCase(rejectPayment.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(rejectPayment.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updated = action.payload?.data;
        if (updated?.id) {
          const idx = state.subscriptions.findIndex((x) => x.id === updated.id);
          if (idx !== -1) state.subscriptions[idx] = updated;
        }
      })
      .addCase(rejectPayment.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export default registerOrgSlice.reducer;
