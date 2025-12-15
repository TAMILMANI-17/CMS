'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { checkAuth } from '@/src/store/slices/authSlice';
import { FEATURES } from '@/src/lib/features-config';
import DashboardLayout from '@/src/components/layout/DashboardLayout';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userFeatures = user.features || [];
  const hasAccess = (featureName: string) => userFeatures.includes(featureName);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* User Profile Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">User Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <strong className="text-gray-900">Name:</strong> {user.firstName}{' '}
                {user.lastName}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong className="text-gray-900">Username:</strong> {user.username}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong className="text-gray-900">Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong className="text-gray-900">Role:</strong>{' '}
                <span className="capitalize">{user.role}</span>
              </p>
            </div>
            <div>
              {user.phoneNumber && (
                <p className="text-sm text-gray-600 mb-1">
                  <strong className="text-gray-900">Phone:</strong>{' '}
                  {user.phoneNumber}
                </p>
              )}
              {user.location && (
                <div className="text-sm text-gray-600">
                  <strong className="text-gray-900">Location:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {user.location.country && (
                      <li>Country: {user.location.country}</li>
                    )}
                    {user.location.state && <li>State: {user.location.state}</li>}
                    {user.location.city && <li>City: {user.location.city}</li>}
                    {user.location.pincode && (
                      <li>Pincode: {user.location.pincode}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Features Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Available Features
          </h2>
          {userFeatures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {FEATURES.map((feature) => {
                const accessible = hasAccess(feature.name);
                return (
                  <Link
                    key={feature.name}
                    href={accessible ? feature.path : '#'}
                    onClick={(e) => {
                      if (!accessible) {
                        e.preventDefault();
                      }
                    }}
                    className={`group flex flex-col justify-between rounded-lg p-4 border-2 transition-all ${
                      accessible
                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 cursor-pointer'
                        : 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                    title={
                      !accessible
                        ? `You don't have access to ${feature.label}`
                        : feature.label
                    }
                  >
                    <div>
                      <div
                        className={`text-sm font-semibold mb-1 flex items-center ${
                          accessible ? 'text-blue-900' : 'text-gray-500'
                        }`}
                      >
                        {feature.label}
                        {!accessible && (
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        )}
                      </div>
                      <p
                        className={`text-xs ${
                          accessible ? 'text-blue-700' : 'text-gray-400'
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                    {accessible && (
                      <span className="mt-3 inline-flex items-center text-xs font-medium text-blue-700 group-hover:text-blue-900">
                        Open feature
                        <span className="ml-1 text-xs">↗</span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No features available</p>
              <p className="text-sm text-gray-400">
                Please contact your administrator to assign features to your role.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

