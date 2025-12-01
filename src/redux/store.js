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
  },
});

export default store;
