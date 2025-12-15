'use client';

import { ReactNode } from 'react';
import { useAppSelector } from '@/src/store/hooks';
import { useRouter } from 'next/navigation';

interface FeatureGuardProps {
  features: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  features,
  children,
  fallback,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  const hasFeature = features.every((feature) =>
    user.features?.includes(feature),
  );

  if (!hasFeature) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">403</h1>
          <p className="text-gray-600">
            You don't have permission to access this resource.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

