import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/home/Home';
import Cohort from './pages/cohort/Cohort';
import Dashboard from './pages/user_dash/dashboard/Dashboard';
import OrganizationDashboard from './pages/user_dash/dashboard/OrganizationDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/auth/Login';
import CourseList from './pages/admin/course/List';
import CourseCreate from './pages/admin/course/Create';
import CourseEdit from './pages/admin/course/Edit';
import CourseDetails from './pages/admin/course/Details';
import CohortList from './pages/admin/cohort/CohortList';
import CohortCreate from './pages/admin/cohort/CohortCreate';
import CohortEdit from './pages/admin/cohort/CohortEdit';
import CohortDetails from './pages/admin/cohort/CohortDetails';
import Organizationregister from './pages/auth/organization/Organizationregister';
import VerificationPending from './pages/auth/organization/VerificationPending';
import VerifyEmail from './pages/auth/organization/VerifyEmail';
import NotFound from './pages/NotFound';
import useScrollAnimation from './hooks/useScrollAnimation';
import AdminAuthGuard from './components/admin/AdminAuthGuard';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from "./pages/auth/Login";

function App() {
  const location = useLocation();
  useScrollAnimation(location);
 
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Main public routes with header and footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cohort" element={<Cohort />} />
        </Route>

        {/* User Dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
        </Route>

        {/* Admin routes with auth guard */}
        <Route path="/admin" element={
          <AdminAuthGuard>
            <AdminLayout />
            
          </AdminAuthGuard>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/create" element={<CourseCreate />} />
          <Route path="courses/edit/:slug" element={<CourseEdit />} />
          <Route path="courses/:slug" element={<CourseDetails />} />
          <Route path="courses/:courseSlug/cohorts/create" element={<CohortCreate />} />
          <Route path="cohorts" element={<CohortList />} />
          <Route path="cohorts/create" element={<CohortCreate />} />
          <Route path="cohorts/edit/:slug" element={<CohortEdit />} />
          <Route path="cohorts/:slug" element={<CohortDetails />} />
        </Route>

        {/* Auth routes (login, register, etc.) */}
        <Route element={<AuthLayout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/organization/register" element={<Organizationregister />} />
          <Route path="/verification" element={<VerificationPending />} />
          <Route path="/verify-organization" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* 404 Page - standalone without layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
