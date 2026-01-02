import React, { useState } from 'react';
import { User, Mail, Lock, Save, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // In a real app, this would make an API call
      updateUser({ ...user, name: formData.name });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would make an API call
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would make an API call
      toast.success('Account deleted successfully');
      logout();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-primary-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              icon={<User className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              value={formData.email}
              disabled
              className="bg-gray-50"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleSaveProfile}
                loading={loading}
                icon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, email: user.email });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
          {!isChangingPassword && user.password && (
            <Button
              variant="outline"
              onClick={() => setIsChangingPassword(true)}
              icon={<Lock className="w-4 h-4" />}
            >
              Change Password
            </Button>
          )}
        </div>

        {isChangingPassword ? (
          <div className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="Enter your current password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
            <Input
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
            />
            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
            />
            <div className="flex gap-3">
              <Button
                onClick={handleChangePassword}
                loading={loading}
                icon={<Save className="w-4 h-4" />}
              >
                Update Password
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            {user.password ? (
              <p>Your account is secured with a password. You can change it anytime.</p>
            ) : (
              <p>Your account uses Google OAuth for authentication. No password is set.</p>
            )}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Danger Zone</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
              <p className="text-sm text-red-600 mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="error"
              onClick={handleDeleteAccount}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/tasks'}
            icon={<CheckSquare className="w-4 h-4" />}
          >
            View Tasks
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;