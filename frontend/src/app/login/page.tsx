'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/src/components/auth/AuthForm';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { loginUser, clearError } from '@/src/store/slices/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async (data: any) => {
    const result = await dispatch(
      loginUser({
        usernameOrEmail: data.usernameOrEmail,
        password: data.password,
      }),
    );
    if (loginUser.fulfilled.match(result)) {
      router.push('/dashboard');
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </a>
          </p>
        </div>
        <AuthForm
          mode="login"
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}

