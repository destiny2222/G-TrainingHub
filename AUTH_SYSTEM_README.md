# Authentication System Documentation

This authentication system provides comprehensive user management for three types of users: individual users, organization users, and administrators.

## Overview

The authentication system consists of:
- **AuthContext**: Main context provider for authentication state
- **ProtectedRoute**: Component for protecting routes based on authentication and permissions
- **Login Components**: Separate login forms for different user types
- **Authentication Hooks**: Custom hooks for easier authentication management

## Backend Endpoints

Based on your Laravel backend, the system integrates with these endpoints:

### Individual Users
- `POST /api/user/login` - Login for individual users
- `POST /api/user/logout` - Logout individual users
- `GET /api/user/profile` - Get individual user profile

### Organization Users
- `POST /api/organization/login` - Login for organization users
- `POST /api/organization/logout` - Logout organization users
- `GET /api/organization/profile` - Get organization user profile

### Admin Users
- `POST /api/admin/login` - Login for admin users
- `POST /api/admin/logout` - Logout admin users

## Setup

### 1. Wrap your App with AuthProvider

```jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app routes and components */}
    </AuthProvider>
  );
}
```

### 2. Use ProtectedRoute for protecting routes

```jsx
import ProtectedRoute from './components/auth/ProtectedRoute';

// Protect route for individual users only
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute requiredAccountType="individual">
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// Protect route for organization users only
<Route 
  path="/organization/dashboard" 
  element={
    <ProtectedRoute requiredAccountType="organization">
      <OrganizationDashboard />
    </ProtectedRoute>
  } 
/>

// Protect route for admin users only
<Route 
  path="/admin/*" 
  element={
    <ProtectedRoute requiredAccountType="admin">
      <AdminLayout />
    </ProtectedRoute>
  } 
/>

// Protect route with specific role requirement
<Route 
  path="/admin/users" 
  element={
    <ProtectedRoute requiredRole="admin">
      <UserManagement />
    </ProtectedRoute>
  } 
/>
```

## Using the Authentication Context

### Basic Usage

```jsx
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { 
    user, 
    organizations, 
    isAuthenticated, 
    accountType, 
    logout 
  } = useAuth();

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Account Type: {accountType}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using the Login Hook

```jsx
import { useLogin } from '../hooks/useLogin';

function LoginForm() {
  const { login, isLoading, error } = useLogin();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(credentials, 'individual');
    
    if (result.success) {
      // Login successful, user will be redirected automatically
    } else {
      // Handle error (error state is automatically managed)
      console.error('Login failed:', result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Authentication Methods

### Login Methods

```jsx
const { loginIndividual, loginOrganization, loginAdmin } = useAuth();

// Individual user login
const result = await loginIndividual({ email, password });

// Organization user login
const result = await loginOrganization({ email, password });

// Admin login
const result = await loginAdmin({ email, password });
```

### Permission Checking

```jsx
const { hasRole, isAdmin, belongsToOrganization } = useAuth();

// Check if user has specific role
if (hasRole('manager')) {
  // Show manager features
}

// Check if user is admin
if (isAdmin()) {
  // Show admin features
}

// Check if user belongs to specific organization
if (belongsToOrganization('org-uuid')) {
  // Show organization-specific content
}
```

## Available Components

### ProtectedRoute Props

```jsx
<ProtectedRoute
  requiredAccountType="individual" // 'individual', 'organization', or 'admin'
  requiredRole="manager"           // Specific role requirement
  organizationId="org-uuid"        // Organization membership requirement
  redirectTo="/custom-login"       // Custom redirect path (default: '/login')
>
  <ProtectedComponent />
</ProtectedRoute>
```

### Login Components

- `IndividualLogin` - Login form for individual users
- `OrganizationLogin` - Login form for organization users
- Admin login should use your existing `AdminLogin` component

### Other Components

- `LogoutButton` - Reusable logout button
- `Unauthorized` - Page shown when user lacks permissions

## Authentication State

The AuthContext provides the following state:

```jsx
{
  user: null | Object,           // Current user data
  organizations: Array,          // User's organizations (for org users)
  token: null | String,          // Authentication token
  isAuthenticated: Boolean,      // Authentication status
  isLoading: Boolean,           // Loading state
  error: null | String,         // Error message
  accountType: null | String,   // 'individual', 'organization', or 'admin'
}
```

## Error Handling

The system automatically handles:
- Token expiration (401 errors)
- Redirects to appropriate login pages
- Error messages for failed authentication attempts
- Loading states during authentication checks

## Local Storage

The system stores:
- `authToken` - Authentication token
- `accountType` - Type of user account for proper routing

## Backend Response Format

The system expects responses in this format:

### Login Response
```json
{
  "message": "Login successful.",
  "user": {
    "id": "user-uuid",
    "name": "User Name",
    "email": "user@example.com",
    "is_admin": false,
    "roles": []
  },
  "organizations": [], // For organization users
  "access_token": "token-string"
}
```

### Profile Response
```json
{
  "user": {
    "id": "user-uuid",
    "name": "User Name",
    "email": "user@example.com"
  },
  "organizations": [] // For organization users
}
```

This authentication system provides a robust foundation for managing different types of users with proper role-based access control.