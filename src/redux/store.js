import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import cohortReducer from './slices/cohortSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    cohorts: cohortReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for FormData serialization
        ignoredActions: ['courses/createCourse/pending', 'courses/updateCourse/pending'],
      },
    }),
});

export default store;
