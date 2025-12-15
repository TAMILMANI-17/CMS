import { Middleware } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Middleware to persist access token to cookies
export const tokenMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Update cookie when access token changes in state
  const state = store.getState();
  if (state.auth.accessToken) {
    Cookies.set('accessToken', state.auth.accessToken);
  } else if (action.type === 'auth/clearAuth' || action.type === 'auth/logoutUser/fulfilled') {
    Cookies.remove('accessToken');
  }
  
  return result;
};

