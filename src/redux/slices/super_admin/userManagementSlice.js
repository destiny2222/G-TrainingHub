import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api  from '../../../utils/api';


const initialState = {
  userManagement: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user management data
export const fetchUserManagement = createAsyncThunk(
  'userManagement/fetchUserManagement',
    async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users');
        return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user management data');
    }
});

// Async thunk to fetch user management data by ID
export const fetchUserManagementById = createAsyncThunk(
    'userManagement/fetchUserManagementById',
    async (userID, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/users/${userID}/edit`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user management data by ID');
        }
    }
);



// Async thunk update user management data
export const updateUserManagement = createAsyncThunk(
    'userManagement/updateUserManagement',
    async ({ userID, userData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/users/${userID}/update`, userData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user management data');
        }
    }
);

// Async thunk to delete user management data
export const deleteUserManagement = createAsyncThunk(
    'userManagement/deleteUserManagement',
    async (userID,  { rejectWithValue }) => {
        try {
            const response = await api.delete(`/admin/users/${userID}/delete`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user management data');
        }
    }
);

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
    reducers: {},
    extraReducers: (builder) => {
    builder
        .addCase(fetchUserManagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.userManagement = action.payload;
      })
      .addCase(fetchUserManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(updateUserManagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.userManagement = action.payload;
      })
      .addCase(updateUserManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(deleteUserManagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.userManagement = action.payload;
      })
      .addCase(deleteUserManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserManagementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserManagementById.fulfilled, (state, action) => {
        state.loading = false;
        state.userManagement = action.payload;
      })
      .addCase(fetchUserManagementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export default userManagementSlice.reducer;