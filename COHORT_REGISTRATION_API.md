# Cohort Registration API Documentation

## Overview
This API allows guests (users without accounts) to register for cohorts. After successful payment via Paystack, the system automatically creates a user account and enrollment, then sends login credentials via email.

## Flow
1. User submits registration details (name, email, phone) for a cohort
2. System validates and prepares for payment
3. User is redirected to Paystack for payment
4. After successful payment, Paystack webhook triggers:
   - Creates user account (if doesn't exist)
   - Creates enrollment
   - Sends email with login credentials and receipt

---

## API Endpoints

### 1. Get All Cohorts
**GET** `/api/cohorts`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Cohort Name",
      "course_id": "uuid",
      "price": 50000,
      "start_date": "2025-01-15",
      "end_date": "2025-06-15",
      "duration": "6 months",
      "status": "active",
      "slug": "cohort-name"
    }
  ]
}
```

---

### 2. Get Cohorts by Course
**GET** `/api/cohorts/course/{course_id}`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Cohort Name",
      "course_id": "uuid",
      "price": 50000,
      "start_date": "2025-01-15",
      "end_date": "2025-06-15",
      "duration": "6 months",
      "status": "active",
      "slug": "cohort-name"
    }
  ]
}
```

---

### 3. Get Single Cohort
**GET** `/api/cohorts/{id}`

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Cohort Name",
    "course": {
      "id": "uuid",
      "title": "Course Title",
      "description": "Course description"
    },
    "price": 50000,
    "start_date": "2025-01-15",
    "end_date": "2025-06-15",
    "duration": "6 months",
    "status": "active"
  }
}
```

---

### 4. Register for Cohort (Guest)
**POST** `/api/cohorts/{id}/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+2348012345678"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Please proceed to payment",
  "data": {
    "cohort": {...},
    "registration_details": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+2348012345678"
    },
    "next_step": "Initialize payment using /api/payment/initialize endpoint"
  }
}
```

**Error Responses:**
- 422: User already enrolled
- 422: Cohort not active

---

### 5. Initialize Payment
**POST** `/api/payment/initialize`

**Request Body:**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "phone": "+2348012345678",
  "cohort_id": "uuid"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Payment initialized successfully",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "...",
    "reference": "COHORT_XXX_123456"
  }
}
```

**Usage:**
Redirect user to `authorization_url` to complete payment.

---

### 6. Payment Webhook (Internal)
**POST** `/api/payment/webhook`

This endpoint is called by Paystack after successful payment. It:
- Verifies payment signature
- Creates user account (generates random password)
- Creates enrollment
- Sends email with login credentials

**Headers Required:**
- `x-paystack-signature`: Paystack signature for verification

---

### 7. Verify Payment (Optional)
**GET** `/api/payment/verify/{reference}`

**Response:**
```json
{
  "status": "success",
  "data": {
    "reference": "COHORT_XXX_123456",
    "amount": 5000000,
    "status": "success",
    "metadata": {...}
  }
}
```

---

## Configuration

### Environment Variables
Add to your `.env` file:

```env
FRONTEND_URL=http://localhost:3000
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx
```

### Paystack Setup
1. Get API keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)
2. Set webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Enable `charge.success` event

---

## Email Template

The system sends a beautifully formatted email containing:
- Registration confirmation
- Cohort details (name, course, dates, duration)
- Payment receipt (amount, reference, date)
- Login credentials (for new users)
- Login button/link

**For new users:**
- Email with generated password
- Prompt to change password after first login

**For existing users:**
- Confirmation that they can login with existing credentials

---

## Security Features

1. **Payment Verification:** Webhook signature validation
2. **Duplicate Prevention:** Checks for existing enrollments
3. **Secure Passwords:** Auto-generated 12-character passwords
4. **Hashed Storage:** Passwords stored using bcrypt
5. **Transaction Safety:** Database transactions for atomic operations

---

## Testing

### Test Flow:
1. Create a cohort with price
2. Register with test email
3. Use Paystack test cards:
   - Success: `4084 0840 8408 4081` (CVV: 408, Expiry: 12/25)
   - Decline: `4084 0840 8408 4084`
4. Check email for login credentials
5. Login and verify enrollment

---

## Error Handling

The system handles:
- Invalid cohort IDs
- Duplicate registrations
- Failed payments
- Email delivery failures (logged)
- Database transaction rollbacks

All errors are logged to `storage/logs/laravel.log`

---

## Frontend Integration Example

```javascript
// Step 1: Register for cohort
const registerResponse = await fetch('/api/cohorts/{id}/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+2348012345678'
  })
});

// Step 2: Initialize payment
const paymentResponse = await fetch('/api/payment/initialize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    name: 'John Doe',
    phone: '+2348012345678',
    cohort_id: 'uuid'
  })
});

const { data } = await paymentResponse.json();

// Step 3: Redirect to Paystack
window.location.href = data.authorization_url;

// Step 4: Handle callback (optional verification)
// On return to callback_url
const urlParams = new URLSearchParams(window.location.search);
const reference = urlParams.get('reference');

if (reference) {
  const verifyResponse = await fetch(`/api/payment/verify/${reference}`);
  const result = await verifyResponse.json();
  
  if (result.status === 'success') {
    // Show success message
    // Prompt user to check email for login details
  }
}
```

---

## Notes

- Payment amounts are in kobo (multiply Naira by 100)
- Webhook must be accessible publicly for Paystack callbacks
- Queue system recommended for email sending in production
- Consider implementing password reset functionality
- Add rate limiting to prevent abuse
