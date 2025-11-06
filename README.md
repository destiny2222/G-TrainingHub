# G-TrainingHub

A comprehensive training management platform built with React that enables organizations to manage their training programs, courses, and cohorts effectively.

## 🚀 Features

### Organization Management
- **Organization Registration**: Complete organization onboarding with two verification methods
  - Email verification
  - Admin user creation with email verification
- **Organization Dashboard**: Centralized view of training activities and statistics
- **Multi-user Support**: Role-based access for organization administrators

### Course Management
- Create, edit, and manage training courses
- Course details with comprehensive information
- Course listing with search and filtering capabilities
- Redux-powered state management for efficient data handling

### Cohort Management
- Create and manage training cohorts
- Assign courses to cohorts
- Track cohort progress and participants
- Detailed cohort information and analytics

### Authentication & Authorization
- Dual login system (User and Organization)
- JWT-based authentication
- Role-based access control
- Email verification for organization accounts
- Secure password management

### User Interface
- Modern, responsive design using Bootstrap 5
- Animated components with Framer Motion and GSAP
- Interactive charts and data visualization (Chart.js)
- Loading states with React Loading Skeleton
- Toast notifications for user feedback
- Smooth navigation with React Router

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server (Laravel-based)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/destiny2222/G-TrainingHub.git
cd G-TrainingHub
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory:
```env
REACT_APP_BASE_URL=http://127.0.0.1:8000
```

## 🎯 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
- Hot reloading enabled
- Lint errors displayed in console

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.
- Optimized React production build
- Minified files with hashed filenames
- Ready for deployment

### `npm run eject`
**Note: This is a one-way operation!**

Ejects from Create React App to expose all configuration files.

## 📁 Project Structure

```
src/
├── assets/              # Images, fonts, and static resources
├── components/          # Reusable React components
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── pages/              # Page components
│   ├── admin/          # Admin-related pages
│   │   ├── auth/       # Admin authentication
│   │   ├── cohort/     # Cohort management pages
│   │   └── course/     # Course management pages
│   ├── auth/           # Authentication pages
│   │   └── organization/ # Organization registration & verification
│   ├── cohort/         # Public cohort pages
│   ├── home/           # Home page
│   └── user_dash/      # User dashboard pages
├── redux/              # Redux store and slices
│   ├── store.js        # Redux store configuration
│   └── slices/         # Redux state slices
├── utils/              # Utility functions and API configuration
├── App.js              # Main application component
└── index.js            # Application entry point
```

## 🔌 API Integration

The application integrates with a Laravel backend API. Key endpoints include:

### Organization Endpoints
- `POST /api/organization/register` - Organization registration
- `POST /api/organization/verify-email` - Email verification
- `POST /api/organization/resend-verification` - Resend verification email

### Admin Endpoints
- `GET /api/admin/courses` - List courses
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/{id}` - Update course
- `DELETE /api/admin/courses/{id}` - Delete course
- Similar endpoints for cohorts

## 🔐 Authentication Flow

### Organization Registration
1. Organization fills registration form with admin details
2. Chooses verification method (email or admin user)
3. Receives verification email
4. Clicks verification link
5. Account activated with JWT token
6. Redirects to login

### User Login
- Dual login system for users and organizations
- JWT token stored in localStorage
- Automatic token attachment to API requests
- 401 responses trigger re-authentication

## 🛠️ Technologies Used

### Core
- **React 19.2.0** - UI framework
- **React Router 7.9.4** - Navigation and routing
- **Redux Toolkit 2.9.2** - State management
- **Axios 1.13.1** - HTTP client

### UI/UX
- **Bootstrap 5.3.8** - CSS framework
- **Framer Motion 12.23.24** - Animations
- **GSAP 3.13.0** - Advanced animations
- **React Icons 5.5.0** - Icon library
- **React Toastify 11.0.5** - Toast notifications
- **React Loading Skeleton 3.5.0** - Loading states

### Data Visualization
- **Chart.js 4.5.1** - Charting library
- **React Chart.js 2 5.3.1** - React wrapper for Chart.js

### Additional Libraries
- **React Slick 0.31.0** - Carousel component
- **Swiper 12.0.3** - Modern slider
- **Three.js 0.180.0** - 3D graphics
- **UUID 13.0.0** - Unique identifier generation

## 📚 Additional Documentation

- [Organization Registration API](./ORGANIZATION_REGISTRATION_API.md) - Detailed organization registration flow
- [Redux Documentation](./REDUX_DOCUMENTATION.md) - Redux implementation guide
- [CORS Fix Guide](./CORS_FIX_GUIDE.md) - Troubleshooting CORS issues

## 🔒 Security Features

- JWT-based authentication
- SHA256 token hashing for email verification
- Secure password handling
- CORS configuration
- Protected routes
- Input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- destiny2222

## 🐛 Known Issues

For known issues and troubleshooting, please refer to the specific documentation files or open an issue on GitHub.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.
