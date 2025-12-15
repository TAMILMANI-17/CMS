'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { logoutUser } from '@/src/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { FEATURES } from '@/src/lib/features-config';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  const userFeatures = user.features || [];
  const hasAccess = (featureName: string) => userFeatures.includes(featureName);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-lg font-bold text-white">CMS Dashboard</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-md transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                pathname === '/dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {sidebarOpen && <span>Dashboard</span>}
            </Link>

            {/* Features Section */}
            {sidebarOpen && (
              <div className="pt-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Features
                </div>
              </div>
            )}

            {/* Feature Links */}
            {FEATURES.map((feature) => {
              const accessible = hasAccess(feature.name);
              const isActive = pathname === feature.path;

              return (
                <Link
                  key={feature.name}
                  href={accessible ? feature.path : '#'}
                  onClick={(e) => {
                    if (!accessible) {
                      e.preventDefault();
                    }
                  }}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    !accessible
                      ? 'text-gray-600 cursor-not-allowed opacity-50'
                      : isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  title={
                    !accessible
                      ? `You don't have access to ${feature.label}`
                      : feature.label
                  }
                >
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {sidebarOpen && (
                    <span className="flex items-center justify-between w-full">
                      <span>{feature.label}</span>
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
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {pathname === '/dashboard'
                  ? 'Dashboard'
                  : FEATURES.find((f) => f.path === pathname)?.label ||
                    'CMS'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.firstName} {user.lastName} ({user.role})
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}

