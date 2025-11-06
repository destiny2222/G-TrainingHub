import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import cohortReducer from './slices/cohortSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    cohorts: cohortReducer,
  },
});

export default store;
