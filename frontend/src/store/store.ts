import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { tokenMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(tokenMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

