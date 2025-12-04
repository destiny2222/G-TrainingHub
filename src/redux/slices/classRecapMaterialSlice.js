import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";


const initialState = {
  recapMaterials: [],
  loading: false,
  error: null,
};

// Fetch all recap materials
export const fetchRecapMaterials = createAsyncThunk(
  "recapMaterials/fetchRecapMaterials",
    async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/class-recap-materials");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch recap material by cohort slug
export const fetchRecapMaterialByCohortSlug = createAsyncThunk(
  "recapMaterials/fetchRecapMaterialByCohortSlug",
    async (cohortSlug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/cohorts/${cohortSlug}/class-recap-materials`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const classRecapMaterialSlice = createSlice({
  name: "recapMaterials",
  initialState,
    reducers: {},
    extraReducers: (builder) => {
    builder
      .addCase(fetchRecapMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecapMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.recapMaterials = action.payload;
      })
      .addCase(fetchRecapMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecapMaterialByCohortSlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecapMaterialByCohortSlug.fulfilled, (state, action) => {
        state.loading = false;
        state.recapMaterials = action.payload;
      })
      .addCase(fetchRecapMaterialByCohortSlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export default classRecapMaterialSlice.reducer;