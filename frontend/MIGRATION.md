# Migration to Next.js 16 and Redux

## Changes Made

### Next.js 16 Upgrade
- Updated `next` from `14.0.4` to `^16.0.0`
- Updated `react` and `react-dom` to `^19.0.0` (required for Next.js 16)
- Updated `@types/react` and `@types/react-dom` to `^19`
- Updated `eslint-config-next` to `^16.0.0`

### Redux Implementation
- **Store Configuration** (`src/store/store.ts`)
  - Configured Redux store with auth reducer
  - Added custom middleware for token persistence
  - Exported typed `RootState` and `AppDispatch`

- **Auth Slice** (`src/store/slices/authSlice.ts`)
  - Created auth slice with async thunks:
    - `loginUser` - Handle user login
    - `signupUser` - Handle user signup
    - `logoutUser` - Handle user logout
    - `checkAuth` - Verify authentication status
  - State management for:
    - User profile
    - Access token
    - Authentication status
    - Loading states
    - Error handling

- **Typed Hooks** (`src/store/hooks.ts`)
  - `useAppDispatch()` - Typed dispatch hook
  - `useAppSelector()` - Typed selector hook

- **Redux Provider** (`src/providers/ReduxProvider.tsx`)
  - Wraps the application with Redux Provider
  - Integrated in root layout

- **Middleware** (`src/store/middleware.ts`)
  - Custom middleware for automatic token persistence
  - Syncs Redux state with cookies

## Component Updates

All components have been updated to use Redux:
- `src/app/login/page.tsx` - Uses `useAppDispatch` and `useAppSelector`
- `src/app/signup/page.tsx` - Uses Redux thunks
- `src/app/dashboard/page.tsx` - Uses Redux state
- `src/app/page.tsx` - Uses Redux for auth check
- `src/components/guards/FeatureGuard.tsx` - Uses Redux selector
- `src/components/guards/RoleGuard.tsx` - Uses Redux selector

## Installation

After updating package.json, run:
```bash
cd frontend
npm install
```

## Breaking Changes

### Next.js 16
- Requires React 19
- Some deprecated APIs may have been removed
- Check Next.js 16 migration guide for details

### Redux (from Zustand)
- All `useAuthStore()` calls replaced with `useAppSelector()` and `useAppDispatch()`
- State access pattern changed from direct property access to selector functions
- Async actions now use Redux thunks instead of Zustand actions

## Usage Examples

### Using Redux in Components

```typescript
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { loginUser } from '@/src/store/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    const result = await dispatch(loginUser({ usernameOrEmail: 'user', password: 'pass' }));
    if (loginUser.fulfilled.match(result)) {
      // Login successful
    }
  };

  return <div>...</div>;
}
```

## Benefits

1. **Standard Redux Patterns**: Uses industry-standard Redux Toolkit
2. **Type Safety**: Full TypeScript support with typed hooks
3. **DevTools**: Redux DevTools support for debugging
4. **Middleware**: Easy to add custom middleware for cross-cutting concerns
5. **Scalability**: Better structure for large applications
6. **Next.js 16**: Latest features and performance improvements

