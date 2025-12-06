import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/home/Home";
import Cohorts from "./pages/cohort/Cohorts";
import Dashboard from "./pages/user_dash/Dashboard";
import OrganizationDashboard from "./pages/user_dash/OrganizationDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/auth/Login";
import CourseList from "./pages/admin/course/List";
import CourseCreate from "./pages/admin/course/Create";
import CourseEdit from "./pages/admin/course/Edit";
import CourseDetails from "./pages/admin/course/Details";
import CohortList from "./pages/admin/cohort/CohortList";
import CohortCreate from "./pages/admin/cohort/CohortCreate";
import CohortEdit from "./pages/admin/cohort/CohortEdit";
import CohortsDetails from "./pages/admin/cohort/CohortDetails";
import CohortDetails from "./pages/cohort_details/CohortDetails";

import Organizationregister from "./pages/auth/organization/Organizationregister";
import VerificationPending from "./pages/auth/organization/VerificationPending";
import VerifyEmail from "./pages/auth/organization/VerifyEmail";
import NotFound from "./pages/NotFound";
import useScrollAnimation from "./hooks/useScrollAnimation";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import DashboardLayout from "./layouts/DashboardLayout";
// import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Unauthorized from "./components/auth/Unauthorized";
import MemberList from "./pages/user_dash/organization/members/MemberList";
import MemberCreate from "./pages/user_dash/organization/members/MemberCreate";
import MemberEdit from "./pages/user_dash/organization/members/MemberEdit";
import MemberShow from "./pages/user_dash/organization/members/MemberShow";
import TrainingProgramList from "./pages/user_dash/organization/traniningProgram/List";
import TrainingCohortList from "./pages/user_dash/organization/traniningProgram/TrainingCohortList";
import CohortMemberList from "./pages/user_dash/organization/traniningProgram/CohortMemberList";
import MemberTrainingList from "./pages/user_dash/organization/traniningProgram/MemberTrainingList";
import AssignCourse from "./pages/user_dash/organization/traniningProgram/AssignCourse";
import OrganizationCourseList from "./pages/user_dash/organization/traniningProgram/OrganizationCourseList";
import PaymentCallback from "./pages/user_dash/organization/traniningProgram/PaymentCallback";
import Login from "./pages/auth/Login";
import RegistrationForm from "./pages/register/Register";
import PaymentCallbackForm from "./pages/register/PaymentCallback";
import Settings from "./pages/user_dash/organization/settings/Settings.jsx";
import MyCourse from "./pages/user_dash/individual/myCourse/MyCourse.jsx";
import ClassRoom from "./pages/user_dash/individual/ClassRoom/ClassRoom.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ClassRecapMaterials from "./pages/admin/RecapMaterial/List.jsx";
import RecapMaterialCreate from "./pages/admin/RecapMaterial/Create.jsx";
import RecapMaterialEdit from "./pages/admin/RecapMaterial/Edit.jsx";
import Library from "./pages/admin/Library/List.jsx";
import LibraryCreate from "./pages/admin/Library/Create.jsx";
import LibraryEdit from "./pages/admin/Library/Edit.jsx";
import AIAssistantPage from "./pages/user_dash/AIAssistantPage.jsx";
import Profile from "./pages/user_dash/Profile.jsx";
import RecapMaterialList from "./pages/user_dash/recapVideos/List.jsx";
import RecapMaterialDetails from "./pages/user_dash/recapVideos/Details.jsx";
import IndividualLibrary from "./pages/user_dash/individual/Library.jsx";
import UserManagementList from "./pages/admin/users/List.jsx";
import UserManagementEdit from "./pages/admin/users/Edit.jsx";
import UserManagementDetails from "./pages/admin/users/Details.jsx";
import OrganizationList from "./pages/admin/organization/List.jsx";
import OrganizationDetails from "./pages/admin/organization/Details.jsx";
import OrganizationEdit from "./pages/admin/organization/Edit.jsx";
import Certificate from "./pages/user_dash/Certificate.jsx";
// import OrganizationRoutes from "./pages/admin/organization/OrganizationRoutes.jsx";

function App() {
  const location = useLocation();
  useScrollAnimation(location);

  return (
    <>
      <div className="App">
        <AuthProvider>
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
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/cohorts" element={<Cohorts />} />
                <Route
                  path="/cohorts/:slug/details"
                  element={<CohortDetails />}
                />
              </Route>
              <Route path="cohort/register" element={<RegistrationForm />} />
              <Route
                path="/payment/callback"
                element={<PaymentCallbackForm />}
              />

              {/* Protected User Dashboard routes */}
              <Route element={<DashboardLayout />}>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredAccountType="individual">
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/my-courses"
                  element={
                    <ProtectedRoute requiredAccountType="individual">
                      <MyCourse />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/library"
                  element={
                    <ProtectedRoute requiredAccountType="individual">
                      <IndividualLibrary />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/classroom/:cohortSlug"
                  element={
                    <ProtectedRoute requiredAccountType="individual">
                      <ClassRoom />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/organization/dashboard"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <OrganizationDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/members"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <MemberList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/members/create"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <MemberCreate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/members/:id"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <MemberShow />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/members/:memberId/edit"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <MemberEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="organization/trainings/cohort/verify-payment/:reference"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <PaymentCallback />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/training-programs"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <TrainingProgramList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/trainings/courses"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <OrganizationCourseList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/trainings/cohorts"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <TrainingCohortList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/trainings/cohorts/:cohortId/members"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <CohortMemberList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/trainings/member/:memberId"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <MemberTrainingList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/trainings/assign"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <AssignCourse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/trainings/assign/:memberId"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <AssignCourse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization/settings"
                  element={
                    <ProtectedRoute requiredAccountType="organization">
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/ai-assistant"
                  element={
                    <ProtectedRoute>
                      <AIAssistantPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requiredAccountType="individual">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recap-videos"
                  element={
                    <ProtectedRoute requiredAccountType="individual">
                      <RecapMaterialList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recap-videos/:cohortSlug"
                  element={
                    <ProtectedRoute requiredAccountType="individual">
                      <RecapMaterialDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-assistant"
                  element={
                    <ProtectedRoute>
                      <AIAssistantPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requiredAccountType="individual">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/certificates"
                  element={
                    <ProtectedRoute requiredAccountType="individual">
                      <Certificate />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Auth routes (login, register, etc.) */}
              <Route element={<AuthLayout />}>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/organization/register"
                  element={<Organizationregister />}
                />
                <Route path="/verification" element={<VerificationPending />} />
                <Route path="/verify-organization" element={<VerifyEmail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/organization/login" element={<Login />} />
                <Route path="/forget-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              {/* Protected Admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    requiredAccountType="admin"
                    redirectTo="/admin/login"
                  >
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="courses" element={<CourseList />} />
                <Route path="courses/create" element={<CourseCreate />} />
                <Route path="courses/edit/:slug" element={<CourseEdit />} />
                <Route path="courses/:slug" element={<CourseDetails />} />
                <Route
                  path="courses/:courseSlug/cohorts/create"
                  element={<CohortCreate />}
                />
                {/* cohort route */}
                <Route path="cohorts" element={<CohortList />} />
                <Route path="cohorts/create" element={<CohortCreate />} />
                <Route path="cohorts/edit/:slug" element={<CohortEdit />} />
                <Route path="cohorts/:slug" element={<CohortsDetails />} />
                {/* Recap materials route */}
                <Route path="class-recap-materials" element={<ClassRecapMaterials />} />
                <Route path="recap-material/create" element={<RecapMaterialCreate />} />
                <Route path="recap-material/edit/:slug" element={<RecapMaterialEdit />} />
                {/* Library route */}
                <Route path="library" element={<Library />} />
                <Route path="library/create" element={<LibraryCreate />} />
                <Route path="library/edit/:slug" element={<LibraryEdit />} />
                {/* User management route */}
                <Route path="users" element={<UserManagementList />} />
                <Route path="users/:Id/edit" element={<UserManagementEdit />} />
                <Route path="users/:Id/show" element={<UserManagementDetails />} />
                {/* Organization route */}
                <Route path="organizations" element={<OrganizationList />} />
                <Route path="organizations/:slug" element={<OrganizationDetails />} />
                <Route path="organizations/:slug/edit" element={<OrganizationEdit />} />
                
              </Route>

              {/* Unauthorized page */}
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* 404 Page - standalone without layout */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
