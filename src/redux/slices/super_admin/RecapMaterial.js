import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";


const initialState = {
  recapMaterials: [],
  loading: false,
  error: null,
};

// Fetch all recap materials
export const fetchRecapMaterials = createAsyncThunk(
  "recapMaterials/fetchRecapMaterials",
    async (_ , { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/class-recap-materials");
        return response.data.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);

// Create new recap material
export const createRecapMaterial = createAsyncThunk(
  "recapMaterials/createRecapMaterial",
    async (recapMaterialData, { rejectWithValue }) => {
    try {
      const response = await api.post("admin/class-recap-materials/create", recapMaterialData);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);


// Update existing recap material
export const updateRecapMaterial = createAsyncThunk(
  "recapMaterials/updateRecapMaterial", 
    async ({ slug, recapMaterialData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/class-recap-materials/${slug}/update`, recapMaterialData);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);

// Delete recap material
export const deleteRecapMaterial = createAsyncThunk(
  "recapMaterials/deleteRecapMaterial",
    async (slug, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/class-recap-materials/${slug}/delete`);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);


const recapMaterialSlice = createSlice({
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
      .addCase(createRecapMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecapMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.recapMaterials.push(action.payload);
      })    
        .addCase(createRecapMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRecapMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
        .addCase(updateRecapMaterial.fulfilled, (state, action) => {    
        state.loading = false;
        const index = state.recapMaterials.findIndex(
          (material) => material.slug === action.payload.slug
        );
        if (index !== -1) {
          state.recapMaterials[index] = action.payload;
        }
      })
      .addCase(updateRecapMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(deleteRecapMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecapMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.recapMaterials = state.recapMaterials.filter(
          (material) => material.slug !== action.meta.arg
        );
      })    
        .addCase(deleteRecapMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export default recapMaterialSlice.reducer;