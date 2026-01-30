'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210/api';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, token, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: profileData.name })
      });

      const data = await response.json();

      if (data.success) {
        showToast('Profile updated successfully', 'success');
        refreshUser();
        setIsEditingProfile(false);
      } else {
        showToast(data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      showToast('Error updating profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast('All password fields are required', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast('Password changed successfully', 'success');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showToast(data.message || 'Failed to change password', 'error');
      }
    } catch (error) {
      showToast('Error changing password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Profile & Settings</h1>
            <p className="text-white/60 mt-1">Manage your account information</p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Profile Overview Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-6xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">{user?.name}</h2>
              <p className="text-white/70 text-lg mb-4">{user?.email}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="text-green-400 text-xs mb-1">Wallet Balance</div>
                  <div className="text-green-300 text-xl font-bold">
                    {formatCurrency(user?.wallet?.balance || 0)}
                  </div>
                </div>
                <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <div className="text-blue-400 text-xs mb-1">Account Type</div>
                  <div className="text-blue-300 text-lg font-semibold capitalize">
                    {user?.role || 'User'}
                  </div>
                </div>
                <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                  <div className="text-purple-400 text-xs mb-1">Member Since</div>
                  <div className="text-purple-300 text-lg font-semibold">
                    {formatDate(user?.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Profile Information</h3>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="profileName" className="block text-white/70 text-sm mb-2">Full Name</label>
                <input
                  id="profileName"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="profileEmail" className="block text-white/70 text-sm mb-2">Email Address</label>
                <input
                  id="profileEmail"
                  type="email"
                  value={profileData.email}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
                  disabled
                />
                <p className="text-white/40 text-xs mt-1">Email cannot be changed</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-medium transition-colors"
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setProfileData({
                      name: user?.name || '',
                      email: user?.email || ''
                    });
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70">Full Name</span>
                <span className="text-white font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/70">Email Address</span>
                <span className="text-white font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-white/70">Verification Status</span>
                <span className={user?.isVerified ? 'text-green-400' : 'text-orange-400'}>
                  {user?.isVerified ? '✓ Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
          <h3 className="text-2xl font-bold text-white mb-6">Change Password</h3>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-white/70 text-sm mb-2">Current Password</label>
              <input
                id="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-white/70 text-sm mb-2">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white/70 text-sm mb-2">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Re-enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg font-medium transition-colors"
            >
              {passwordLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Account Actions */}
        <div className="bg-red-500/10 backdrop-blur-lg rounded-xl border border-red-500/30 p-6">
          <h3 className="text-2xl font-bold text-red-400 mb-4">Danger Zone</h3>
          <p className="text-white/70 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg font-medium transition-colors"
            onClick={() => showToast('Account deletion is not yet implemented', 'info')}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
