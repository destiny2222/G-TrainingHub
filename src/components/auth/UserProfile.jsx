import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LogoutButton from '../../components/auth/LogoutButton';

const UserProfile = () => {
  const { 
    user, 
    organizations, 
    accountType, 
    isAuthenticated, 
    isLoading,
    hasRole,
    isAdmin 
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-blue-100">{user.email}</p>
              <p className="text-sm bg-white bg-opacity-20 inline-block px-2 py-1 rounded mt-2">
                {accountType.charAt(0).toUpperCase() + accountType.slice(1)} User
              </p>
            </div>
            {user.profile_picture && (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-white"
              />
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                User Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-medium">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-600">Email Verified</label>
                  <p className="font-medium">
                    {user.email_verified ? (
                      <span className="text-green-600">✓ Verified</span>
                    ) : (
                      <span className="text-red-600">✗ Not Verified</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Permissions & Roles */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Permissions & Roles
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Account Type</label>
                  <p className="font-medium capitalize">{accountType}</p>
                </div>
                
                {isAdmin() && (
                  <div>
                    <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      Administrator
                    </span>
                  </div>
                )}

                {user.roles && Object.keys(user.roles).length > 0 && (
                  <div>
                    <label className="text-sm text-gray-600">Roles</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(user.roles).map(([org, role]) => (
                        <span
                          key={org}
                          className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                        >
                          {role} in {org}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Organizations (for organization users) */}
          {accountType === 'organization' && organizations && organizations.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Organizations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-800">{org.name}</h3>
                    {org.sector && (
                      <p className="text-sm text-gray-600">{org.sector}</p>
                    )}
                    {org.employee_count && (
                      <p className="text-sm text-gray-500">
                        {org.employee_count} employees
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Actions</h3>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
              <LogoutButton className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;