'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { checkAuth } from '@/src/store/slices/authSlice';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>
  );
}

