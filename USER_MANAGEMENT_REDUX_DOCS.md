# User Management Redux Documentation

## Overview

This Redux slice provides comprehensive user management functionality for organizations, including CRUD operations, bulk operations, and role management.

## Files Created

1. **`src/redux/slices/userSlice.js`** - Main Redux slice
2. **`src/pages/user_dash/organization/manageUser/manageUser.jsx`** - Example React component
3. **`src/pages/user_dash/organization/manageUser/manageUser.css`** - Styling for the component

## Redux Slice Features

### API Endpoints Covered

- `GET /api/organization/{organization}/members` - List members
- `GET /api/organization/{organization}/members/{user}` - Show member
- `POST /api/organization/{organization}/members` - Create user & add as member
- `POST /api/organization/{organization}/members/bulk` - Bulk create users
- `POST /api/organization/{organization}/members/existing` - Add existing users
- `PUT /api/organization/{organization}/members/{user}` - Update member
- `DELETE /api/organization/{organization}/members/{user}` - Remove member

### Async Thunks (Actions)

#### 1. `fetchOrganizationMembers`
Fetches all members of an organization with optional pagination and filtering.

```javascript
dispatch(fetchOrganizationMembers({ 
  organizationId: 'org-123',
  params: {
    page: 1,
    per_page: 10,
    search: 'john',
    role: 'admin'
  }
}));
```

#### 2. `fetchOrganizationMember`
Fetches a single member by ID.

```javascript
dispatch(fetchOrganizationMember({ 
  organizationId: 'org-123',
  userId: 'user-456'
}));
```

#### 3. `createOrganizationMember`
Creates a new user and adds them as a member.

```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('phone', '+1234567890');
formData.append('role', 'member');
formData.append('profile_picture', fileObject);

dispatch(createOrganizationMember({ 
  organizationId: 'org-123',
  userData: formData
}));
```

#### 4. `updateOrganizationMember`
Updates an existing member's information.

```javascript
const formData = new FormData();
formData.append('name', 'Updated Name');
formData.append('email', 'updated@example.com');
formData.append('role', 'admin');

dispatch(updateOrganizationMember({ 
  organizationId: 'org-123',
  userId: 'user-456',
  userData: formData
}));
```

#### 5. `updateMemberRole`
Specifically updates a member's role and admin status.

```javascript
dispatch(updateMemberRole({ 
  organizationId: 'org-123',
  userId: 'user-456',
  role: 'admin',
  isAdmin: true
}));
```

#### 6. `removeOrganizationMember`
Removes a member from the organization.

```javascript
dispatch(removeOrganizationMember({ 
  organizationId: 'org-123',
  userId: 'user-456'
}));
```

#### 7. `bulkCreateOrganizationMembers`
Creates multiple users at once.

```javascript
dispatch(bulkCreateOrganizationMembers({ 
  organizationId: 'org-123',
  usersData: {
    users: [
      { name: 'User 1', email: 'user1@example.com', role: 'member' },
      { name: 'User 2', email: 'user2@example.com', role: 'admin' }
    ]
  }
}));
```

#### 8. `addExistingUsersToOrganization`
Adds existing users to the organization.

```javascript
dispatch(addExistingUsersToOrganization({ 
  organizationId: 'org-123',
  usersData: {
    user_ids: ['user-123', 'user-456']
  }
}));
```

### State Structure

```javascript
{
  members: [],              // Array of organization members
  selectedMember: null,     // Currently selected member for editing
  loading: false,           // General loading state
  error: null,             // Error messages
  createLoading: false,    // Loading state for create operations
  updateLoading: false,    // Loading state for update operations
  deleteLoading: false,    // Loading state for delete operations
  bulkLoading: false,      // Loading state for bulk operations
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  },
  filters: {
    search: '',
    role: '',
    status: '',
  }
}
```

### Reducers (Synchronous Actions)

#### 1. `clearError()`
Clears any error messages.

```javascript
dispatch(clearError());
```

#### 2. `clearSelectedMember()`
Clears the selected member.

```javascript
dispatch(clearSelectedMember());
```

#### 3. `setFilters(filters)`
Updates the filters.

```javascript
dispatch(setFilters({ search: 'john', role: 'admin' }));
```

#### 4. `resetFilters()`
Resets all filters to default values.

```javascript
dispatch(resetFilters());
```

#### 5. `setPagination(pagination)`
Updates pagination settings.

```javascript
dispatch(setPagination({ currentPage: 2, perPage: 20 }));
```

#### 6. `resetUserState()`
Resets the entire user state to initial values.

```javascript
dispatch(resetUserState());
```

### Selectors

```javascript
import {
  selectUsers,           // Select entire users state
  selectMembers,         // Select members array
  selectSelectedMember,  // Select currently selected member
  selectUsersLoading,    // Select loading state
  selectUsersError,      // Select error state
  selectCreateLoading,   // Select create loading state
  selectUpdateLoading,   // Select update loading state
  selectDeleteLoading,   // Select delete loading state
  selectBulkLoading,     // Select bulk loading state
  selectUsersPagination, // Select pagination state
  selectUsersFilters,    // Select filters state
} from '../redux/slices/userSlice';
```

## Usage Examples

### Basic Component Setup

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrganizationMembers,
  selectMembers,
  selectUsersLoading,
  selectUsersError
} from '../redux/slices/userSlice';

const UserList = ({ organizationId }) => {
  const dispatch = useDispatch();
  const members = useSelector(selectMembers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    dispatch(fetchOrganizationMembers({ organizationId }));
  }, [dispatch, organizationId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {members.map(member => (
        <div key={member.id}>
          <h3>{member.name}</h3>
          <p>{member.email}</p>
          <p>Role: {member.role}</p>
        </div>
      ))}
    </div>
  );
};
```

### Creating a New Member

```javascript
const handleCreateMember = async () => {
  const formData = new FormData();
  formData.append('name', 'New User');
  formData.append('email', 'newuser@example.com');
  formData.append('phone', '+1234567890');
  formData.append('role', 'member');
  
  try {
    await dispatch(createOrganizationMember({
      organizationId: 'org-123',
      userData: formData
    })).unwrap();
    
    // Success - member created
    console.log('Member created successfully');
    
    // Optionally refresh the members list
    dispatch(fetchOrganizationMembers({ organizationId: 'org-123' }));
  } catch (error) {
    // Handle error
    console.error('Failed to create member:', error);
  }
};
```

### Updating Member Role

```javascript
const handleRoleChange = async (userId, newRole) => {
  try {
    await dispatch(updateMemberRole({
      organizationId: 'org-123',
      userId,
      role: newRole,
      isAdmin: newRole === 'admin'
    })).unwrap();
    
    console.log('Role updated successfully');
  } catch (error) {
    console.error('Failed to update role:', error);
  }
};
```

### Filtering and Pagination

```javascript
const UserManagement = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectUsersFilters);
  const pagination = useSelector(selectUsersPagination);

  const handleSearch = (searchTerm) => {
    dispatch(setFilters({ search: searchTerm }));
    dispatch(setPagination({ currentPage: 1 })); // Reset to first page
  };

  const handlePageChange = (page) => {
    dispatch(setPagination({ currentPage: page }));
  };

  // The fetchOrganizationMembers action will automatically use the current filters and pagination
  useEffect(() => {
    dispatch(fetchOrganizationMembers({
      organizationId: 'org-123',
      params: {
        page: pagination.currentPage,
        per_page: pagination.perPage,
        ...filters
      }
    }));
  }, [dispatch, pagination.currentPage, pagination.perPage, filters]);

  return (
    <div>
      <input 
        type="text"
        placeholder="Search members..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      {/* Member list and pagination components */}
    </div>
  );
};
```

## Error Handling

The Redux slice includes comprehensive error handling:

```javascript
const MyComponent = () => {
  const error = useSelector(selectUsersError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      // Display error to user
      console.error('User management error:', error);
      
      // Optionally clear error after showing it
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [error, dispatch]);

  return (
    <div>
      {error && (
        <div className="error-banner">
          {typeof error === 'string' ? error : 'An error occurred'}
          <button onClick={() => dispatch(clearError())}>×</button>
        </div>
      )}
      {/* Rest of component */}
    </div>
  );
};
```

## Integration Notes

1. **Organization ID**: Make sure to pass the correct organization ID for all operations. This is typically obtained from the current user's context or route parameters.

2. **File Uploads**: When updating profile pictures, use FormData and ensure the API endpoint can handle multipart/form-data.

3. **Permissions**: Consider implementing permission checks before allowing certain operations (e.g., only admins can delete members).

4. **Real-time Updates**: For real-time updates, consider integrating with WebSocket or Server-Sent Events to automatically refresh the member list when changes occur.

5. **Optimistic Updates**: For better UX, consider implementing optimistic updates for non-critical operations like role changes.

## Testing

When testing components that use this Redux slice, mock the Redux store and actions:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/slices/userSlice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      users: userReducer,
    },
    preloadedState: {
      users: {
        members: [],
        loading: false,
        error: null,
        ...initialState,
      },
    },
  });
};
```

This Redux slice provides a robust foundation for managing organization members with full CRUD capabilities, bulk operations, and comprehensive state management.




i want the map to recapMaterials.slice(0, 3).map((material) , to start from the card instead
<div className="card custom-card mb-3">
              <div className="card-body">
                {recapMaterials.length === 0 && !isLoading ? (
                  // Show this when there is no recap and not loading
                  <p className="text-muted small mb-0">
                    No recap materials available.
                  </p>
                ) : (
                  // Otherwise, show the latest recap (or skeleton while loading)
                  recapMaterials.slice(0, 3).map((material) => (
                    <div key={material.id}>
                      <div className="d-flex align-items-center">
                        {isLoading ? (
                          <Skeleton width={80} height={50} />
                        ) : (
                          <video
                            className="rounded me-3"
                            style={{
                              width: "80px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            muted
                            loop
                            playsInline
                            controls
                          >
                            <source src={material.thumbnail_path} />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        <div>
                          <h4 className="h6 fw-medium mb-0">
                            {isLoading ? (
                              <Skeleton width={100} />
                            ) : (
                              // Use your actual title field here
                              material.title || "Intro to Machine Learning"
                            )}
                          </h4>
                          <p className="text-muted small mb-0">
                            {isLoading ? (
                              <Skeleton width={80} />
                            ) : (
                              // Use your actual date field here
                              formatDateDMY(material.created_at) || "20 Oct 2024"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>