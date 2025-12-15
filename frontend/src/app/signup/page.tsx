'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/src/components/auth/AuthForm';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { signupUser, clearError } from '@/src/store/slices/authSlice';

export default function SignupPage() {
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

  const handleSignup = async (data: any) => {
    const result = await dispatch(signupUser(data));
    if (signupUser.fulfilled.match(result)) {
      router.push('/dashboard');
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </a>
          </p>
        </div>
        <AuthForm
          mode="signup"
          onSubmit={handleSignup}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}

