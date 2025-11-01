# Redux Integration Documentation

## Overview
This project uses **Redux Toolkit** for state management, handling all course and cohort data operations with the Laravel backend API.

## Installation
The following packages have been installed:
```bash
npm install @reduxjs/toolkit react-redux axios
```

## Project Structure

```
src/
├── redux/
│   ├── store.js                    # Redux store configuration
│   └── slices/
│       ├── courseSlice.js          # Course state management
│       └── cohortSlice.js          # Cohort state management
├── utils/
│   └── api.js                      # Axios configuration with interceptors
└── pages/
    └── admin/
        ├── course/
        │   ├── List.jsx            # Course list (uses Redux)
        │   ├── Create.jsx          # Create course (uses Redux)
        │   └── Edit.jsx            # Edit course (uses Redux)
        └── cohort/
            ├── CohortList.jsx      # Cohort list (uses Redux)
            ├── CohortCreate.jsx    # Create cohort (uses Redux)
            └── CohortEdit.jsx      # Edit cohort (uses Redux)
```

## API Configuration

### Base URL
All API requests are made to: `/api/admin`

### Authentication
The API utility includes JWT token authentication:
- Token stored in `localStorage` as `adminToken`
- Automatically attached to all requests via interceptor
- 401 responses automatically redirect to login

### Error Handling
Global error handling for:
- 401 Unauthorized → Redirect to login
- 403 Forbidden
- 404 Not Found
- 422 Validation Errors
- 500 Server Errors

## Redux Slices

### Course Slice (`courseSlice.js`)

#### State Structure
```javascript
{
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    total: 0,
    currentPage: 1,
    perPage: 10,
    lastPage: 1
  }
}
```

#### Async Actions
| Action | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| `fetchCourses` | `/api/admin/courses` | GET | Fetch all courses with pagination |
| `fetchCourseById` | `/api/admin/courses/{id}/edit` | GET | Fetch single course for editing |
| `createCourse` | `/api/admin/courses/create` | POST | Create new course (FormData) |
| `updateCourse` | `/api/admin/courses/{id}/update` | PUT | Update existing course |
| `deleteCourse` | `/api/admin/courses/{id}/delete` | DELETE | Delete course |

#### Reducers
- `clearCurrentCourse` - Reset current course
- `clearError` - Clear error state
- `clearSuccess` - Clear success flag

#### Usage Example
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, deleteCourse } from '../../../redux/slices/courseSlice';

function CourseList() {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);
  
  const handleDelete = async (id) => {
    await dispatch(deleteCourse(id)).unwrap();
  };
}
```

### Cohort Slice (`cohortSlice.js`)

#### State Structure
```javascript
{
  cohorts: [],
  currentCohort: null,
  enrolledUsers: [],
  loading: false,
  error: null,
  success: false,
  pagination: {
    total: 0,
    currentPage: 1,
    perPage: 10,
    lastPage: 1
  }
}
```

#### Async Actions
| Action | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| `fetchCohorts` | `/api/admin/cohorts` | GET | Fetch all cohorts |
| `fetchCohortById` | `/api/admin/cohorts/{id}` | GET | Fetch single cohort |
| `createCohort` | `/api/admin/cohorts/create` | POST | Create new cohort |
| `updateCohort` | `/api/admin/cohorts/{id}/update` | PUT | Update existing cohort |
| `deleteCohort` | `/api/admin/cohorts/{id}/delete` | DELETE | Delete cohort |
| `fetchCohortUsers` | `/api/admin/cohorts/{id}/users` | GET | Get enrolled users |

#### Reducers
- `clearCurrentCohort` - Reset current cohort
- `clearEnrolledUsers` - Clear enrolled users
- `clearError` - Clear error state
- `clearSuccess` - Clear success flag

## Component Integration

### List Components
Both `CourseList` and `CohortList` components:
- Fetch data on mount using `useEffect`
- Display loading spinner while fetching
- Show error message with retry button on failure
- Use Redux state for filtering and search

### Create Components
Both `CourseCreate` and `CohortCreate` components:
- Submit data using dispatch with `.unwrap()` for error handling
- Show loading state on submit buttons
- Navigate on success
- Display validation errors from backend

### Edit Components
Both `CourseEdit` and `CohortEdit` components:
- Fetch data on mount using course/cohort ID
- Pre-populate form with fetched data
- Submit updates using dispatch
- Handle loading states for fetch and submit

## FormData Handling

For course image uploads, FormData is used:

```javascript
const formData = new FormData();
formData.append('title', 'Course Title');
formData.append('description', 'Description');
formData.append('curriculum', JSON.stringify(curriculum));
formData.append('prerequisites', JSON.stringify(prerequisites));
formData.append('image', imageFile);

await dispatch(createCourse(formData)).unwrap();
```

For PUT requests with FormData, the `_method` field is appended:
```javascript
formData.append('_method', 'PUT');
```

## Error Handling Pattern

```javascript
try {
  await dispatch(createCourse(formData)).unwrap();
  alert('Course created successfully!');
  navigate('/admin/courses');
} catch (error) {
  alert('Failed to create course: ' + (error.message || JSON.stringify(error)));
}
```

## Backend Expected Response Format

### Success Response
```json
{
  "data": {
    "id": 1,
    "title": "Course Title",
    "description": "Description",
    ...
  },
  "message": "Success message"
}
```

### Error Response (422 Validation)
```json
{
  "message": "Validation failed",
  "errors": {
    "title": ["Title is required"],
    "category": ["Category is required"]
  }
}
```

### Pagination Response
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "current_page": 1,
    "per_page": 10,
    "last_page": 10
  }
}
```

## Authentication Setup

Before making API calls, ensure the admin token is stored:

```javascript
// On successful login
localStorage.setItem('adminToken', token);

// On logout
localStorage.removeItem('adminToken');
```

## Testing Endpoints

To test the API integration:

1. **Start Laravel Backend**
   ```bash
   php artisan serve
   ```

2. **Configure Proxy** (if needed)
   In `package.json`:
   ```json
   "proxy": "http://localhost:8000"
   ```

3. **Start React App**
   ```bash
   npm start
   ```

## Troubleshooting

### CORS Issues
Ensure Laravel backend has CORS enabled:
```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

### 401 Unauthorized
- Check if token is properly stored in localStorage
- Verify token is valid and not expired
- Check Authorization header format: `Bearer {token}`

### FormData Not Sending
- Ensure `Content-Type` is set to `multipart/form-data`
- For PUT requests, use `formData.append('_method', 'PUT')` and POST endpoint

### State Not Updating
- Use Redux DevTools to inspect actions
- Ensure reducers are properly handling actions
- Check if `.unwrap()` is called on async thunks

## Redux DevTools

Install Redux DevTools browser extension for debugging:
- Chrome: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- Firefox: [Redux DevTools](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

## Next Steps

1. **Implement Pagination**: Add pagination controls in list components
2. **Add Search Filters**: Implement backend search with query params
3. **Optimize Re-renders**: Use memoization with `useMemo` and `useCallback`
4. **Add Caching**: Implement RTK Query for automatic caching
5. **Error Boundaries**: Add React error boundaries for better error handling
6. **Loading Skeletons**: Replace spinners with skeleton loaders
7. **Notifications**: Integrate toast notifications instead of alerts
