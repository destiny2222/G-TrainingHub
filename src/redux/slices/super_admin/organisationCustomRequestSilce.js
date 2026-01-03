import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";


const initialState = {
    organizationCustomRequests: [],
    loading: false,
    error: null,
};

// Fetch all organization custom requests
export const fetchOrganizationCustomRequests = createAsyncThunk(
    "organizationCustomRequest/fetchOrganizationCustomRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/custom-training-requests");
            console.log("API Response:", response.data.data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);

const organizationCustomRequestSlice = createSlice({
    name: "organizationCustomRequest",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrganizationCustomRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganizationCustomRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.organizationCustomRequests = action.payload;
            })
            .addCase(fetchOrganizationCustomRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export default organizationCustomRequestSlice.reducer;