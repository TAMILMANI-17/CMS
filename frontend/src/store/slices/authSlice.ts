import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, SignupData, LoginData } from '@/src/types/auth.types';
import { authApi } from '@/src/lib/auth-api';
import Cookies from 'js-cookie';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: Cookies.get('accessToken') || null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data);
      Cookies.set('accessToken', response.accessToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed',
      );
    }
  },
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(data);
      Cookies.set('accessToken', response.accessToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Signup failed',
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      Cookies.remove('accessToken');
    } catch (error: any) {
      Cookies.remove('accessToken');
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed',
      );
    }
  },
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        return rejectWithValue('No token found');
      }
      const user = await authApi.getProfile();
      return { user, accessToken: token };
    } catch (error: any) {
      Cookies.remove('accessToken');
      return rejectWithValue(
        error.response?.data?.message || 'Authentication failed',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      Cookies.set('accessToken', action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      Cookies.remove('accessToken');
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, setAccessToken, clearError, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;

