import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";


const initialState = {
  library: [],
  loading: false,
  error: null,
};

// Fetch all library items
export const fetchLibraryItems = createAsyncThunk(
  "library/fetchLibraryItems",
    async (_ , { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/libraries");
        return response.data.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);

// Create new library item
export const createLibraryItem = createAsyncThunk(
  "library/createLibraryItem",
    async (libraryData, { rejectWithValue }) => {
    try {
      const response = await api.post("admin/libraries/create", libraryData);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);

// Update existing library item
export const updateLibraryItem = createAsyncThunk(
  "library/updateLibraryItem",
    async ({ slug, libraryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/libraries/${slug}/update`, libraryData);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);

// Delete library item
export const deleteLibraryItem = createAsyncThunk(
  "library/deleteLibraryItem",
    async (slug, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/libraries/${slug}/delete`);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
        }
    },
);

const librarySlice = createSlice({
  name: "library",
  initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchLibraryItems.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchLibraryItems.fulfilled, (state, action) => {
            state.loading = false;
            state.library = action.payload;
        })
        .addCase(fetchLibraryItems.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(createLibraryItem.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createLibraryItem.fulfilled, (state, action) => {
            state.loading = false;
            state.library.push(action.payload);
        })
        .addCase(createLibraryItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateLibraryItem.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateLibraryItem.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.library.findIndex(item => item.slug === action.payload.slug);
            if (index !== -1) {
                state.library[index] = action.payload;
            }
        })
        .addCase(updateLibraryItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(deleteLibraryItem.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteLibraryItem.fulfilled, (state, action) => {
            state.loading = false;
            state.library = state.library.filter(item => item.slug !== action.meta.arg);
        })
        .addCase(deleteLibraryItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
export default librarySlice.reducer;