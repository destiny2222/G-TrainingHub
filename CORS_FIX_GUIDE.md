# CORS Configuration Guide for Laravel Backend

## Understanding the CORS Error

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:8000/api/admin/cohorts' from origin 'http://localhost:3000' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' 
when the request's credentials mode is 'include'.
```

**What This Means:**
- Your React app (localhost:3000) is trying to access Laravel API (localhost:8000)
- When using `withCredentials: true` in axios, you CANNOT use wildcard `*` in CORS
- The backend must specify the EXACT origin

---

## Quick Fix (Already Applied)

**In `src/utils/api.js`:**
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // COMMENTED OUT - this was causing the issue
});
```

This works for development but you won't be able to send cookies/sessions.

---

## Proper Fix: Configure Laravel CORS (Recommended)

### Step 1: Install Laravel CORS Package (If Not Already Installed)

Laravel 8+ includes CORS support by default. Check if this file exists:
```
config/cors.php
```

If not, install the package:
```bash
composer require fruitcake/laravel-cors
```

### Step 2: Update `config/cors.php`

```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',  // React development server
        'http://127.0.0.1:3000',  // Alternative localhost
        // Add production URLs here later
    ],

    // DO NOT USE '*' when credentials are enabled
    // 'allowed_origins' => ['*'], // ❌ WRONG when using credentials

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,  // ✅ SET TO TRUE for cookies/sessions
];
```

### Step 3: Update `app/Http/Kernel.php`

Ensure CORS middleware is registered BEFORE other middleware:

```php
protected $middleware = [
    // ...
    \Fruitcake\Cors\HandleCors::class, // ✅ Add this line
    // ... other middleware
];
```

Or for Laravel 11+, check `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->api(prepend: [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ]);
})
```

### Step 4: Clear Laravel Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Step 5: Restart Laravel Server

```bash
php artisan serve
```

### Step 6: Re-enable `withCredentials` in React

Once Laravel CORS is configured, update `src/utils/api.js`:

```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ NOW IT WILL WORK
});
```

---

## Alternative: Use Laravel Sanctum for API Authentication

If you're using Laravel Sanctum for SPA authentication:

### 1. Install Sanctum (if not installed)
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 2. Configure `config/sanctum.php`
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort()
))),
```

### 3. Add to `.env`
```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### 4. Protect Routes with Sanctum

In `routes/api.php`:
```php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('admin')->group(function () {
        Route::get('/courses', [CourseController::class, 'index']);
        Route::post('/courses/create', [CourseController::class, 'store']);
        // ... other routes
    });
});
```

### 5. Get CSRF Cookie First

In your React login flow:
```javascript
// Before login, get CSRF cookie
await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
  withCredentials: true
});

// Then login
await axios.post('http://localhost:8000/api/login', credentials, {
  withCredentials: true
});
```

---

## Testing CORS Configuration

### Test with cURL:
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     http://localhost:8000/api/admin/cohorts
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Production Configuration

For production, update `config/cors.php`:

```php
'allowed_origins' => [
    env('FRONTEND_URL', 'https://yourdomain.com'),
],
```

And in `.env`:
```env
FRONTEND_URL=https://yourdomain.com
```

---

## Common Issues & Solutions

### Issue 1: Still Getting CORS Error After Configuration
**Solution:**
```bash
# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Restart server
php artisan serve
```

### Issue 2: 401 Unauthorized After Login
**Solution:** Ensure domain matches in session config:
```php
// config/session.php
'domain' => env('SESSION_DOMAIN', 'localhost'),
```

### Issue 3: Credentials Not Being Sent
**Solution:** Ensure both are set:
- Laravel: `supports_credentials => true`
- React: `withCredentials: true`

### Issue 4: Different Ports Causing Issues
**Solution:** Add both ports to allowed origins:
```php
'allowed_origins' => [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
],
```

---

## Environment Variables

Create `.env.local` in React app:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

For production:
```env
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

---

## Summary

✅ **Quick Fix (Current):** `withCredentials` commented out - works but no cookies
✅ **Proper Fix:** Configure Laravel CORS with specific origins + `supports_credentials: true`
✅ **Best Practice:** Use Laravel Sanctum for SPA authentication

The app will work now with the quick fix, but implement the proper CORS configuration in Laravel for production!
