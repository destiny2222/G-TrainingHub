import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import cohortReducer from './slices/cohortSlice';
import organizationReducer from './slices/organisationSlice';
import organizationUserReducer from './slices/organisationUserSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    cohorts: cohortReducer,
    organization: organizationReducer,
    organizationUser: organizationUserReducer,
  },
});

export default store;
