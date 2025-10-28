import Home from './pages/home/Home';
import './assets/css/style.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Cohort from './pages/cohort/Cohort';
import Dashboard from './pages/user_dash/dashboard/Dashboard';
import OrganizationDashboard from './pages/user_dash/dashboard/OrganizationDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/auth/Login';
import useScrollAnimation from './hooks/useScrollAnimation';
import TargetCursor from './components/TargetCursor';

function App() {
   const location = useLocation();
  useScrollAnimation(location);
  const { pathname } = location;
  const noHeaderFooter = pathname === "/auth" || pathname === "/dashboard" || pathname === "/organization-dashboard" || pathname === "/admin/dashboard" || pathname === "/admin/login";
 
  return (
    <div className="App">
     
      {!noHeaderFooter && (
        <TargetCursor 
          spinDuration={2}
          hideDefaultCursor={true}
        />
      )}
      {!noHeaderFooter && <Header />} 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/cohort' element={<Cohort />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/organization-dashboard' element={<OrganizationDashboard />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/login' element={<Login />} />
      </Routes>
      {!noHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
