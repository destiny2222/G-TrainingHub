# Simplified Authentication System

## Overview
A simple and clean authentication system for managing different user types with minimal complexity.

## Key Components

### 1. AuthContext (`src/contexts/AuthContext.jsx`)
- **Uses simple useState hooks** instead of complex useReducer
- **Clear state management** with individual state variables
- **Three login methods**: `loginIndividual`, `loginOrganization`, `loginAdmin`
- **Auto token management** - handles localStorage and API headers automatically
- **Simple error handling** - stores error messages in state

### 2. useLogin Hook (`src/hooks/useLogin.js`)
- **One simple function**: `login(credentials, accountType, redirectPath)`
- **Auto-navigation** - automatically redirects to correct dashboard
- **Uses AuthContext loading/error states** - no duplicate state management

### 3. ProtectedRoute (`src/components/auth/ProtectedRoute.jsx`)
- **Simple checks**: authentication and account type only
- **Admin bypass** - admins can access any route
- **Clean loading UI** - shows spinner while checking auth

### 4. Login Page (`src/pages/auth/Login.jsx`)
- **Route-based detection** - automatically sets login type based on URL
- **Single form** - handles both individual and organization login
- **Manual switching** - users can switch login types with radio buttons

## How to Use

### Basic Login
```jsx
const { login, isLoading, error } = useLogin();

const handleLogin = async () => {
  const result = await login(
    { email: 'user@example.com', password: 'password' },
    'individual' // or 'organization' or 'admin'
  );
  
  // User is automatically redirected on success
};
```

### Protect Routes
```jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute requiredAccountType="individual">
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Check Auth Status
```jsx
const { user, isAuthenticated, accountType, isLoading } = useAuth();

if (isLoading) return <div>Loading...</div>;
if (!isAuthenticated) return <div>Please login</div>;

return <div>Welcome {user.name}!</div>;
```

## What Was Simplified

### Removed Complex Features
- ❌ useReducer with action types
- ❌ Complex role-based permissions  
- ❌ Organization membership checks
- ❌ Update user functionality
- ❌ Separate error state in useLogin
- ❌ Manual error clearing

### Kept Essential Features
- ✅ Three user types (individual, organization, admin)
- ✅ Token management
- ✅ Auto-redirect after login
- ✅ Route protection
- ✅ Loading states
- ✅ Error handling
- ✅ Logout functionality

## Routes
- `/login` - Individual user login
- `/organization/login` - Organization user login  
- `/admin/login` - Admin login (uses existing component)

## Auto-Redirects
- Individual users → `/dashboard`
- Organization users → `/organization/dashboard`
- Admin users → `/admin/dashboard`

## File Structure
```
src/
├── contexts/
│   └── AuthContext.jsx     # Main auth state management
├── hooks/
│   └── useLogin.js         # Simple login hook
├── components/auth/
│   ├── ProtectedRoute.jsx  # Route protection
│   └── LogoutButton.jsx    # Logout component
└── pages/auth/
    └── Login.jsx           # Unified login page
```

This simplified system maintains all core functionality while being much easier to understand and maintain.