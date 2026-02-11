import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';

const Profile = () => {
  const { user, logout, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required to change password';
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateProfile();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await updateProfile({
      name: formData.name,
      email: formData.email
    });
    setLoading(false);

    if (result.success) {
      showToast('Profile updated successfully');
    } else {
      showToast(result.message || 'Failed to update profile', 'error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const newErrors = validatePassword();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      showToast('Password changed successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your tasks will be permanently deleted.')) {
      return;
    }

    if (!window.confirm('Please confirm again - this will permanently delete your account and all associated data.')) {
      return;
    }

    setLoading(true);
    const result = await deleteAccount();
    setLoading(false);

    if (result.success) {
      showToast('Account deleted successfully');
      logout();
      navigate('/login');
    } else {
      showToast(result.message || 'Failed to delete account', 'error');
    }
  };

  const getMemberSince = () => {
    if (user?.createdAt) {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">Member since {getMemberSince()}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex gap-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('danger')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'danger'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Danger Zone
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`input ${errors.name ? 'border-red-500' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className={`input ${errors.currentPassword ? 'border-red-500' : ''}`}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />
                {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className={`input ${errors.newPassword ? 'border-red-500' : ''}`}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" loading={loading}>
                  Change Password
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-800 mb-2">Delete Account</h3>
                <p className="text-red-600 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                  All your tasks will be permanently deleted.
                </p>
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                  loading={loading}
                >
                  Delete My Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: '' })}
      />
    </div>
  );
};

export default Profile;

