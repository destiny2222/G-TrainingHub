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


// GET /organization/members - List all organization members (uses authenticated user's organization)
export const getOrganizationMembers = createAsyncThunk(
  'organizationUser/getOrganizationMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/organization/members');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch organization members'
      );
    }
  }
);

// GET /organization/members/{organizationUser} - Show specific member details (uses authenticated user's organization)
export const getOrganizationMember = createAsyncThunk(
  'organizationUser/"getOrganizationMember"',
  async (organizationUser, { rejectWithValue }) => {
    try {
      const response = await api.get(`/organization/members/${organizationUser}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch member details'
      );
    }
  }
);

// POST /organization/members - Create new member (uses authenticated user's organization)
export const createOrganizationMember = createAsyncThunk(
  'organizationUser/createOrganizationMember',
  async (memberData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/organization/members/create`, memberData);
      return response.data;
    } catch (error) {
      // Handle different error response structures
      let errorMessage = 'Failed to create member';
      if (error.response?.status === 422) {
        // Validation errors - extract field-specific errors
        const validationErrors = error.response?.data?.errors;
        if (validationErrors && typeof validationErrors === 'object') {
          // Convert validation errors to a readable format
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          errorMessage = `Validation error: ${errorMessages}`;
        } else {
          errorMessage = error.response?.data?.message || 'Validation failed';
        }
      } else {
        errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      'Failed to create member';
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// POST /organization/{organization}/members/bulk - Bulk create members
export const bulkCreateOrganizationMembers = createAsyncThunk(
  'organizationUser/bulkCreateOrganizationMembers',
  async ({ membersData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/organization/members/bulk`, membersData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to bulk create members'
      );
    }
  }
);


// GET /organization/members/{organizationUser}/edit - Get organization member for edit
export const editOrganizationMember = createAsyncThunk(
  'organizationUser/editOrganizationMember',
  async ({ organizationUserId, memberData }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/organization/members/${organizationUserId}/edit`, memberData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch member for edit'
      );
    }
  }
);

// PUT /organization/members/{organizationUser} - Update member (uses authenticated user's organization)
export const updateOrganizationMember = createAsyncThunk(
  'organizationUser/updateOrganizationMember', async ({ organizationUserId, memberData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/organization/members/${organizationUserId}/update`, memberData);
      return response.data;
    } catch (error) {
      // Extract the actual error message from the response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update member';
      return rejectWithValue(errorMessage);
    }
  }
);

// DELETE /organization/members/{organizationUser} - Remove member (uses authenticated user's organization)
export const deleteOrganizationMember = createAsyncThunk(
  'organizationUser/deleteOrganizationMember',
  async (organizationUserId, { rejectWithValue }) => {
    try {
      await api.delete(`/organization/members/${organizationUserId}/delete`);
      return organizationUserId;
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
        const payload = action.payload?.data?.members || action.payload?.data || action.payload;
        state.members = Array.isArray(payload) ? payload : [];
        state.error = null;
      })
      .addCase(getOrganizationMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Ensure members is still an array even on error
        if (!Array.isArray(state.members)) {
          state.members = [];
        }
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
        // Ensure members is an array before pushing
        if (!Array.isArray(state.members)) {
          state.members = [];
        }
        // Handle different response structures
        const newMember = action.payload?.data || action.payload;
        state.members.push(newMember);
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
          // Ensure members is an array before spreading
          if (!Array.isArray(state.members)) {
            state.members = [];
          }
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

      // Get organization member for edit
      .addCase(editOrganizationMember.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editOrganizationMember.fulfilled, (state, action) => {
        state.loading = false;
        state.member = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(editOrganizationMember.rejected, (state, action) => {
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
        // Ensure members is an array before using findIndex
        if (!Array.isArray(state.members)) {
          state.members = [];
        }
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
        // Ensure members is an array before filtering
        if (!Array.isArray(state.members)) {
          state.members = [];
        }
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