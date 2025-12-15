'use client';

import { FeatureGuard } from '@/src/components/guards/FeatureGuard';
import DashboardLayout from '@/src/components/layout/DashboardLayout';

export default function Feature7Page() {
  return (
    <FeatureGuard features={['feature_7']}>
      <DashboardLayout>
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Feature 7</h1>
          <p className="text-gray-600 text-lg">
            This is a protected page for <strong>feature_7</strong>. Only users
            whose role includes this feature can see this content.
          </p>
        </div>
      </DashboardLayout>
    </FeatureGuard>
  );
}

