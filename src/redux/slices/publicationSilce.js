// https://gritinai.com/api/publications
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    publications: [],
    loading: false,
    error: null,
};


// Fetch publications
export const fetchPublications = createAsyncThunk(
    'publications/fetchPublications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://gritinai.com/api/publications');
            console.log(response.data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const publicationSlice = createSlice({
    name: 'publications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublications.fulfilled, (state, action) => {
                state.loading = false;
                state.publications = action.payload;
            })
            .addCase(fetchPublications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch publications';
            });
    },
});
export default publicationSlice.reducer;