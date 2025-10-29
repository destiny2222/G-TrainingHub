import './assets/css/style.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/home/Home';
import Cohort from './pages/cohort/Cohort';
import Dashboard from './pages/user_dash/dashboard/Dashboard';
import OrganizationDashboard from './pages/user_dash/dashboard/OrganizationDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/admin/auth/Login';
import NotFound from './pages/NotFound';
import useScrollAnimation from './hooks/useScrollAnimation';
import AdminAuthGuard from './components/admin/AdminAuthGuard';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  const location = useLocation();
  useScrollAnimation(location);
 
  return (
    <div className="App">
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
        </Route>

        {/* Auth routes (login, register, etc.) */}
        <Route element={<AuthLayout />}>
          <Route path="/admin/login" element={<Login />} />
        </Route>

        {/* 404 Page - standalone without layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
