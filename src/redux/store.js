import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import cohortReducer from './slices/cohortSlice';
import organizationReducer from './slices/organisationSlice';
import orgReducer from './slices/admin_organisation/organisationSlice';
import organizationUserReducer from './slices/organisationUserSlice';
import analyticsReducer from './slices/admin_organisation/analyticsSlice';
import trainingProgramReducer from './slices/admin_organisation/trainingProgramSlice';
import classRoomReducer from './slices/classRoomSlice';
import userEnrolledCohortReducer from './slices/userEnrolledCohortSlice';
import  recapMaterialReducer from './slices/super_admin/RecapMaterial';
import libraryReducer from './slices/super_admin/LibrarySlice';
import assignmentReducer from './slices/assignmentSlice';
import classRecapMaterialReducer from './slices/classRecapMaterialSlice';
import adminAnalyticsReducer from './slices/super_admin/analyticsSlice';
import userManagementReducer from './slices/super_admin/userManagementSlice';
import orgAdminReducer from './slices/super_admin/organisationSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    cohorts: cohortReducer,
    organization: organizationReducer,
    organizationUser: organizationUserReducer,
    analytics: analyticsReducer,
    trainingProgram: trainingProgramReducer,
    org: orgReducer,
    classRooms: classRoomReducer,
    userEnrolledCohorts: userEnrolledCohortReducer,
    recapMaterials: recapMaterialReducer,
    library: libraryReducer,
    userAssignments: assignmentReducer,
    classRecapMaterials: classRecapMaterialReducer,
    adminAnalytics: adminAnalyticsReducer,
    userManagement: userManagementReducer,
    orgAdmin: orgAdminReducer,
  },
});

export default store;
