# Organization Registration API Integration

## Overview
The organization registration system has been integrated with the backend API endpoints.

## ⚠️ IMPORTANT BACKEND CHANGES

### Key Changes from Backend:
1. **Admin fields are NOW REQUIRED for BOTH signup methods** (email_verification AND admin_user)
2. **Verification email is sent to `admin_email`** (not `official_email`)
3. **Verification URL changed** from `/verify-email` to `/verify-organization`
4. **Token is stored as hashed (SHA256)** in the organization table
5. **Training mode value** must be `on-site` (not `onsite`)
6. **Backend returns access_token** upon successful verification

## API Endpoints Used

### 1. Registration
**POST** `/api/organization/register`

**Request Body (FormData):**
```javascript
{
  signup_method: "email_verification" | "admin_user",
  name: string,
  rc_number: string,
  sector: string,
  employee_count: string,
  training_focus_area: string,
  contact_person_name: string,
  official_email: string,
  company_logo: File,
  address: string,
  training_mode: "online" | "on-site" | "hybrid", // NOTE: "on-site" not "onsite"
  
  // ⚠️ NOW REQUIRED FOR BOTH METHODS
  admin_name: string,
  admin_email: string,
  admin_phone: string,
  admin_password: string,
  admin_password_confirmation: string
}
```

**Response:**
- Success: Registration confirmation
- For BOTH methods: Sends verification email to `admin_email`
- Organization and admin user are created immediately
- Email verification required before full access

---

### 2. Email Verification
**POST** `/api/organization/verify-email`

**Request Body:**
```json
{
  "token": "verification_token_from_email",
  "email": "admin@organization.com"
}
```

**Response:**
```json
{
  "message": "Email verified successfully. Your organization account is now active.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@company.com",
    "phone": "+1234567890",
    "email_verified": true
  },
  "organization": { ... },
  "access_token": "token_here",
  "token_type": "Bearer"
}
```

**Usage:** Called automatically when user clicks verification link in email
**Frontend URL:** `/verify-organization?token=xxx&email=xxx`
**Backend URL:** Frontend URL configured via `FRONTEND_URL` in backend .env

---

### 3. Resend Verification
**POST** `/api/organization/resend-verification`

**Request Body:**
```json
{
  "email": "admin@organization.com"
}
```

**Usage:** Allows users to request a new verification email

---

## User Flows

### Flow 1: Email Verification Method
1. User fills organization form + admin details (all required)
2. Selects "Verify with Company Email" method
3. Submits form → POST `/api/organization/register`
4. Redirected to `/verification-pending` page
5. User receives verification email at **admin_email**
6. User clicks link → `/verify-organization?token=xxx&email=admin@company.com`
7. Auto-verifies → POST `/api/organization/verify-email`
8. Receives access token
9. Redirects to login page

### Flow 2: Admin User Method
1. User fills organization form + admin details (all required)
2. Selects "Create Admin User" method
3. Submits form → POST `/api/organization/register`
4. Organization and admin account created
5. User receives verification email at **admin_email**
6. User clicks link → `/verify-organization?token=xxx&email=admin@company.com`
7. Auto-verifies → POST `/api/organization/verify-email`
8. Receives access token
9. Redirects to login page

**Note:** Both methods now have the same flow - verification is required for both.

---

## Pages Created

### 1. `/organization/register`
- Main registration form
- Two-panel layout (signup method + organization details)
- Admin fields always visible (required for both methods)

### 2. `/verification-pending`
- Shown after registration
- Displays admin email
- "Resend Verification" button

### 3. `/verify-organization`
- Processes verification token from email
- Shows loading → success/error states
- Stores access token in localStorage
- Auto-redirects to login on success

---

## Routes Added to App.js

```javascript
<Route path="/organization/register" element={<Organizationregister />} />
<Route path="/verification-pending" element={<VerificationPending />} />
<Route path="/verify-organization" element={<VerifyEmail />} />
```

---

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:8000
```

### Backend (.env)
```
FRONTEND_URL=http://localhost:3000
```

---

## Important Changes Made

1. ✅ Admin fields now always required and validated
2. ✅ Admin fields always sent in form submission
3. ✅ Verification email references `admin_email` instead of `official_email`
4. ✅ Training mode value changed from `onsite` to `on-site`
5. ✅ Verification route changed from `/verify-email` to `/verify-organization`
6. ✅ Access token stored in localStorage upon successful verification
7. ✅ Toast notifications for all user feedback

---

## Error Handling

All API calls include comprehensive error handling:
- Network errors
- Validation errors (422)
- Server errors (500)
- Token verification errors
- Displays user-friendly toast messages
- Form field-specific error display

---

## Backend Details

### Organization Table Fields
- `email_verification_token` - Stores hashed token (SHA256)
- `email_verified_at` - Timestamp of verification
- Company logo uploaded to Cloudinary

### User Table Fields
- `email_verified_at` - Timestamp of verification
- User is linked to organization via pivot table with `owner` role

### Verification Flow
1. Token generated as random 64-character string
2. Hashed with SHA256 and stored in organization table
3. Plain token sent in email verification URL
4. During verification, submitted token is hashed and compared
5. Both user and organization marked as verified
6. Token cleared from database after successful verification

