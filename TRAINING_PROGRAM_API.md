# Training Program API Documentation

Base URL: `http://localhost:8000/api/organization`

## Authentication
All endpoints require a Bearer Token in the Authorization header.
`Authorization: Bearer <token>`

---

## 1. Initialize Cohort Payment
Initializes a Paystack payment transaction for registering an organization to a cohort. This endpoint must be called before an organization can enroll members into a cohort.

- **URL:** `/trainings/cohorts/payment/initialize`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <token>`

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cohort_id` | UUID | Yes | The ID of the cohort to register for. |

**Example Request:**
```json
{
    "cohort_id": "9d5f1111-2222-3333-4444-555566667777"
}
```

### Success Response (200 OK)
```json
{
    "status": "success",
    "message": "Payment initialized successfully",
    "data": {
        "authorization_url": "https://checkout.paystack.com/xxxxxxxxxx",
        "access_code": "xxxxxxxxxx",
        "reference": "ORG_COHORT_ABCDEF1234_1234567890"
    }
}
```

### Error Response (400 Bad Request)
```json
{
    "message": "Organization is already registered for this cohort."
}
```

### Error Response (404 Not Found)
```json
{
    "message": "Organization not found"
}
```

**Note:** After successful initialization, redirect the user to the `authorization_url` to complete the payment. Paystack will redirect back to the callback URL after payment.

---

## 2. Verify Cohort Payment
Verifies a Paystack payment and completes the organization's registration for a cohort. This endpoint is typically called after Paystack redirects back from payment or via webhook.

- **URL:** `/trainings/cohorts/payment/verify/{reference}`
- **Method:** `GET`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <token>`

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `reference` | String | The payment reference returned from the initialize endpoint. |

### Success Response (201 Created)
```json
{
    "status": "success",
    "message": "Organization registered for cohort successfully!",
    "data": {
        "id": 1,
        "organization_id": "9d5f0000-0000-0000-0000-000000000000",
        "cohort_id": "9d5f1111-2222-3333-4444-555566667777",
        "paid_by_user_id": "9d5f2222-3333-4444-5555-666677778888",
        "payment_reference": "ORG_COHORT_ABCDEF1234_1234567890",
        "amount_paid": "50000",
        "status": "paid",
        "registered_at": "2025-11-18T10:30:00.000000Z",
        "created_at": "2025-11-18T10:30:00.000000Z",
        "updated_at": "2025-11-18T10:30:00.000000Z"
    }
}
```

### Error Response (400 Bad Request)
```json
{
    "status": "error",
    "message": "Payment was not successful"
}
```

**Note:** Once payment is verified, the organization can start assigning members to the cohort.

---

## 3. Assign Course to Member (Including Cohort Enrollment)
Assigns a course (and optionally a cohort) to an organization member. Use this endpoint to enroll members to courses or specific cohorts. If a cohort_id is provided, the organization must have already paid for that cohort.

- **URL:** `/trainings/assign`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <token>`

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_user_id` | UUID | Yes | The ID of the member to assign the course to. |
| `course_id` | UUID | Yes | The ID of the course to assign. |
| `cohort_id` | UUID | No | The ID of the cohort (optional). |

**Example Request:**
```json
{
    "organization_user_id": "9d5f1234-5678-90ab-cdef-1234567890ab",
    "course_id": "9d5f9876-5432-10fe-dcba-0987654321fe",
    "cohort_id": "9d5f1111-2222-3333-4444-555566667777"
}
```

### Success Response (201 Created)
```json
{
    "message": "Course assigned successfully!",
    "data": {
        "id": 15,
        "organization_user_id": "9d5f1234-5678-90ab-cdef-1234567890ab",
        "course_id": "9d5f9876-5432-10fe-dcba-0987654321fe",
        "cohort_id": "9d5f1111-2222-3333-4444-555566667777",
        "organization_id": "9d5f0000-0000-0000-0000-000000000000",
        "status": "active",
        "enrolled_at": "2025-11-18T10:30:00.000000Z",
        "progress": "0.00",
        "created_at": "2025-11-18T10:30:00.000000Z",
        "updated_at": "2025-11-18T10:30:00.000000Z"
    }
}
```

### Error Response (400 Bad Request)
```json
{
    "message": "Member is already enrolled in this course."
}
```

---

## 4. Unassign Course from Member
Removes (drops) a member from a course.

- **URL:** `/trainings/unassign`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <token>`

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_user_id` | UUID | Yes | The ID of the member. |
| `course_id` | UUID | Yes | The ID of the course to unassign. |

**Example Request:**
```json
{
    "organization_user_id": "9d5f1234-5678-90ab-cdef-1234567890ab",
    "course_id": "9d5f9876-5432-10fe-dcba-0987654321fe"
}
```

### Success Response (200 OK)
```json
{
    "message": "Course unassigned successfully!"
}
```

### Error Response (400 Bad Request)
```json
{
    "message": "Member is not enrolled in this course."
}
```

---

## 5. Get Member Trainings
Retrieves a list of all courses assigned to a specific member along with their progress.

- **URL:** `/trainings/member/{organizationUserId}`
- **Method:** `GET`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <token>`

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `organizationUserId` | UUID | The ID of the member to fetch trainings for. |

### Success Response (200 OK)
```json
{
    "status": "success",
    "message": "Member trainings retrieved successfully",
    "data": [
        {
            "id": 1,
            "organization_user_name": "John Doe",
            "organization_user_email": "john@example.com",
            "course_id": "9d5f9876-5432-10fe-dcba-0987654321fe",
            "course_title": "Introduction to AI",
            "course_image": "https://example.com/image.jpg",
            "status": "active",
            "progress": "45.50",
            "enrolled_at": "2025-10-15T09:00:00.000000Z",
            "completed_at": null,
            "certificate_path": null
        }
    ]
}
```

---

## 6. Get Organization Cohorts
Retrieves all cohorts that the organization has paid for and registered. Shows statistics about enrolled members in each cohort.

- **URL:** `/trainings/cohorts`
- **Method:** `GET`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <token>`

### Success Response (200 OK)
```json
{
    "status": "success",
    "message": "Organization cohorts retrieved successfully",
    "data": [
        {
            "id": "9d5f1111-2222-3333-4444-555566667777",
            "name": "AI Bootcamp - January 2025",
            "slug": "ai-bootcamp-january-2025",
            "course_id": "9d5f9876-5432-10fe-dcba-0987654321fe",
            "course_title": "Introduction to AI",
            "course_image": "https://example.com/image.jpg",
            "start_date": "2025-01-15T00:00:00.000000Z",
            "end_date": "2025-03-15T00:00:00.000000Z",
            "duration": "8 weeks",
            "price": "50000",
            "status": "active",
            "enrolled_members_count": 15,
            "active_members_count": 12,
            "completed_members_count": 3
        }
    ]
}
```

---

## 7. Get Cohort Members
Retrieves all members enrolled in a specific cohort with their progress details. The organization must be registered (paid) for the cohort to access this endpoint.

- **URL:** `/trainings/cohorts/{cohortId}/members`
- **Method:** `GET`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <token>`

### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `cohortId` | UUID | The ID of the cohort. |

### Success Response (200 OK)
```json
{
    "status": "success",
    "message": "Cohort members retrieved successfully",
    "data": [
        {
            "id": 1,
            "cohort_id": "9d5f1111-2222-3333-4444-555566667777",
            "cohort_name": "AI Bootcamp - January 2025",
            "course_id": "9d5f9876-5432-10fe-dcba-0987654321fe",
            "course_title": "Introduction to AI",
            "course_image": "https://example.com/image.jpg",
            "start_date": "2025-01-15T00:00:00.000000Z",
            "end_date": "2025-03-15T00:00:00.000000Z",
            "duration": "8 weeks",
            "organization_user_id": "9d5f1234-5678-90ab-cdef-1234567890ab",
            "organization_user_name": "John Doe",
            "organization_user_email": "john@example.com",
            "organization_user_profile_picture": "https://example.com/profile.jpg",
            "status": "active",
            "progress": "45.50",
            "enrolled_at": "2025-11-01T09:00:00.000000Z",
            "completed_at": null,
            "certificate_path": null
        }
    ]
}
```

### Error Response (403 Forbidden)
```json
{
    "status": "error",
    "message": "Organization is not registered for this cohort"
}
```

### Error Response (404 Not Found)
```json
{
    "status": "error",
    "message": "Organization not found"
}
```

**Note:** This endpoint only returns members who are explicitly enrolled in the specified cohort (cohort_id is not null in their enrollment record).
