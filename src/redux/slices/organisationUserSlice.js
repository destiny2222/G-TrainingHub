import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Initial state
const initialState = {
  members: [],
  member: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks for API calls

// GET /api/organization/{organization}/members - List all organization members
export const getOrganizationMembers = createAsyncThunk(
  'organizationUser/getOrganizationMembers',
  async (organization, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/organization/${organization}/members`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch organization members'
      );
    }
  }
);

// GET /api/organization/{organization}/members/{organizationUser} - Show specific member details
export const getOrganizationMember = createAsyncThunk(
  'organizationUser/getOrganizationMember',
  async ({ organization, organizationUser }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/organization/${organization}/members/${organizationUser}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch member details'
      );
    }
  }
);

// POST /api/organization/{organization}/members - Create new member
export const createOrganizationMember = createAsyncThunk(
  'organizationUser/createOrganizationMember',
  async ({ organization, memberData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/organization/${organization}/members`, memberData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create member'
      );
    }
  }
);

// POST /api/organization/{organization}/members/bulk - Bulk create members
export const bulkCreateOrganizationMembers = createAsyncThunk(
  'organizationUser/bulkCreateOrganizationMembers',
  async ({ organization, membersData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/organization/${organization}/members/bulk`, membersData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to bulk create members'
      );
    }
  }
);

// POST /api/organization/{organization}/members/existing - Add existing users as members
export const addExistingUsersAsMembers = createAsyncThunk(
  'organizationUser/addExistingUsersAsMembers',
  async ({ organization, userData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/organization/${organization}/members/existing`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add existing users as members'
      );
    }
  }
);

// PUT /api/organization/{organization}/members/{organizationUser} - Update member
export const updateOrganizationMember = createAsyncThunk(
  'organizationUser/updateOrganizationMember',
  async ({ organization, organizationUser, memberData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/organization/${organization}/members/${organizationUser}`, memberData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update member'
      );
    }
  }
);

// DELETE /api/organization/{organization}/members/{organizationUser} - Remove member
export const deleteOrganizationMember = createAsyncThunk(
  'organizationUser/deleteOrganizationMember',
  async ({ organization, organizationUser }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/organization/${organization}/members/${organizationUser}`);
      return organizationUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete member'
      );
    }
  }
);

// Organization User slice
const organizationUserSlice = createSlice({
  name: 'organizationUser',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get organization members
      .addCase(getOrganizationMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizationMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(getOrganizationMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get organization member
      .addCase(getOrganizationMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrganizationMember.fulfilled, (state, action) => {
        state.loading = false;
        state.member = action.payload;
        state.error = null;
      })
      .addCase(getOrganizationMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create organization member
      .addCase(createOrganizationMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrganizationMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.push(action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(createOrganizationMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Bulk create organization members
      .addCase(bulkCreateOrganizationMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(bulkCreateOrganizationMembers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && Array.isArray(action.payload.data)) {
          state.members = [...state.members, ...action.payload.data];
        }
        state.success = true;
        state.error = null;
      })
      .addCase(bulkCreateOrganizationMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Add existing users as members
      .addCase(addExistingUsersAsMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addExistingUsersAsMembers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && Array.isArray(action.payload.data)) {
          state.members = [...state.members, ...action.payload.data];
        }
        state.success = true;
        state.error = null;
      })
      .addCase(addExistingUsersAsMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update organization member
      .addCase(updateOrganizationMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOrganizationMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.members.findIndex(member => member.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
        if (state.member && state.member.id === action.payload.id) {
          state.member = action.payload;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateOrganizationMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Delete organization member
      .addCase(deleteOrganizationMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteOrganizationMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members = state.members.filter(member => member.id !== action.payload);
        if (state.member && state.member.id === action.payload) {
          state.member = null;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(deleteOrganizationMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

// Export actions
export const {
  clearError,
  clearSuccess,
  resetState,
} = organizationUserSlice.actions;

// Export reducer
export default organizationUserSlice.reducer;