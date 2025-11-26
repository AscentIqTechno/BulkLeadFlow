import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useChangePasswordMutation,
  useUpdateBillingAddressMutation,
  UpdateProfileRequest,
  ChangePasswordRequest,
  BillingAddressRequest,
} from '@/redux/api/profileApi';

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'billing' | 'password'>('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // API hooks
  const { 
    data: profileData, 
    isLoading: profileLoading, 
    error: profileError,
    refetch: refetchProfile 
  } = useGetProfileQuery();
  
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateProfileMutation();
  const [uploadProfileImage, { isLoading: uploadingImage }] = useUploadProfileImageMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();
  const [updateBillingAddress, { isLoading: updatingBilling }] = useUpdateBillingAddressMutation();

  // Form states
  const [personalForm, setPersonalForm] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [billingForm, setBillingForm] = useState({
    street: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: '',
    phone: ''
  });

  // Populate forms when profile data loads
  useEffect(() => {
    if (profileData?.user) {
      const user = profileData.user;
      setPersonalForm({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
      });

      if (user.billingAddress) {
        setBillingForm({
          street: user.billingAddress.street || '',
          city: user.billingAddress.city || '',
          state: user.billingAddress.state || '',
          country: user.billingAddress.country || 'India',
          zipCode: user.billingAddress.zipCode || '',
          phone: user.billingAddress.phone || ''
        });
      }
    }
  }, [profileData]);

  // Handlers
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: UpdateProfileRequest = {
        username: personalForm.username,
        email: personalForm.email,
        phone: personalForm.phone,
      };
      
      await updateProfile(updateData).unwrap();
      toast.success('Profile updated successfully!', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
        iconTheme: {
          primary: '#fbbf24',
          secondary: '#1f2937',
        },
      });
      refetchProfile();
    } catch (error: any) {
      toast.error('Error updating profile: ' + (error.data?.message || 'Something went wrong'), {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match!', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
      });
      return;
    }

    try {
      const passwordData: ChangePasswordRequest = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      };
      
      await changePassword(passwordData).unwrap();
      toast.success('Password changed successfully!', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
        iconTheme: {
          primary: '#fbbf24',
          secondary: '#1f2937',
        },
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error('Error changing password: ' + (error.data?.message || 'Something went wrong'), {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
      });
    }
  };

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const billingData: BillingAddressRequest = {
        street: billingForm.street,
        city: billingForm.city,
        state: billingForm.state,
        country: billingForm.country,
        zipCode: billingForm.zipCode,
        phone: billingForm.phone
      };
      
      await updateBillingAddress(billingData).unwrap();
      toast.success('Billing address updated successfully!', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
        iconTheme: {
          primary: '#fbbf24',
          secondary: '#1f2937',
        },
      });
      refetchProfile();
    } catch (error: any) {
      toast.error('Error updating billing address: ' + (error.data?.message || 'Something went wrong'), {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
      });
      return;
    }

    try {
      await uploadProfileImage(file).unwrap();
      toast.success('Profile image uploaded successfully!', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
        iconTheme: {
          primary: '#fbbf24',
          secondary: '#1f2937',
        },
      });
      refetchProfile();
    } catch (error: any) {
      toast.error('Error uploading image: ' + (error.data?.message || 'Something went wrong'), {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        },
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubscribeRedirect = () => {
    navigate('/dashboard/payment_billing');
  };

  // Loading states
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl">Error loading profile</div>
          <button 
            onClick={() => refetchProfile()}
            className="mt-4 bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-600 font-medium transition duration-150"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const user = profileData?.user;

  return (
    <div className="min-h-screen bg-white-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          },
          success: {
            iconTheme: {
              primary: '#fbbf24',
              secondary: '#1f2937',
            },
          },
        }}
      />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
                <div className="flex flex-col items-center pb-6 border-b border-gray-700">
                  <div className="relative">
                    <div 
                      className="h-24 w-24 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 text-2xl font-bold mb-4 cursor-pointer hover:bg-yellow-600 transition duration-150"
                      onClick={triggerFileInput}
                    >
                      {user?.profileImage?.url ? (
                        <img 
                          src={user.profileImage.url} 
                          alt="Profile" 
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        user?.username?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-70 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-yellow-500 text-gray-900 p-1 rounded-full cursor-pointer hover:bg-yellow-600 transition duration-150">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white mt-2">{user?.username}</h2>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  <div className="mt-3 px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500 border-opacity-30">
                    {user?.currentPlan ? user.currentPlan.name : 'Free Plan'}
                  </div>
                </div>
                
                <div className="mt-6 space-y-1">
                  <button 
                    onClick={() => setActiveTab('personal')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition duration-150 ${
                      activeTab === 'personal' 
                        ? 'bg-yellow-500 bg-opacity-10 text-yellow-400 border-l-4 border-yellow-500' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Details
                  </button>
                  <button 
                    onClick={() => setActiveTab('billing')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition duration-150 ${
                      activeTab === 'billing' 
                        ? 'bg-yellow-500 bg-opacity-10 text-yellow-400 border-l-4 border-yellow-500' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Billing
                  </button>
                  <button 
                    onClick={() => setActiveTab('password')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center transition duration-150 ${
                      activeTab === 'password' 
                        ? 'bg-yellow-500 bg-opacity-10 text-yellow-400 border-l-4 border-yellow-500' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4">
              {/* Personal Details Tab */}
              {activeTab === 'personal' && (
                <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-700">
                  <div className="px-6 py-5 border-b border-gray-700">
                    <h3 className="text-lg font-medium text-white">Personal Details</h3>
                    <p className="mt-1 text-sm text-gray-400">Update your personal information and contact details.</p>
                  </div>
                  
                  <form onSubmit={handlePersonalSubmit} className="px-6 py-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={personalForm.username}
                          onChange={handlePersonalChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={personalForm.email}
                          onChange={handlePersonalChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={personalForm.phone}
                        onChange={handlePersonalChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={updatingProfile}
                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 transition duration-150"
                      >
                        {updatingProfile ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-white">Current Plan</h3>
                      <button 
                        onClick={handleSubscribeRedirect}
                        className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-600 transition duration-150"
                      >
                        Subscribe to Plan
                      </button>
                    </div>
                    
                    {!user?.currentPlan ? (
                      <div className="text-center py-8 bg-gray-700 rounded-lg border border-gray-600">
                        <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-400 mb-2">No active subscription found</p>
                        <p className="text-sm text-gray-500">Subscribe to a plan to unlock premium features</p>
                      </div>
                    ) : (
                      <div className="bg-yellow-500 bg-opacity-10 p-4 rounded-lg border border-yellow-500 border-opacity-30">
                        <h4 className="font-medium text-yellow-400">{user.currentPlan.name}</h4>
                        <p className="text-yellow-300 text-sm mt-1">Active Plan</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Billing Address Form */}
                  <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">Billing Address</h3>
                    <form onSubmit={handleBillingSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-1">Street Address</label>
                          <input
                            type="text"
                            name="street"
                            id="street"
                            value={billingForm.street}
                            onChange={handleBillingChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                            placeholder="123 Main St"
                          />
                        </div>
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            id="city"
                            value={billingForm.city}
                            onChange={handleBillingChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                            placeholder="New York"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            id="state"
                            value={billingForm.state}
                            onChange={handleBillingChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                            placeholder="NY"
                          />
                        </div>
                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-1">ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            id="zipCode"
                            value={billingForm.zipCode}
                            onChange={handleBillingChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                            placeholder="10001"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                          <select
                            name="country"
                            id="country"
                            value={billingForm.country}
                            onChange={handleBillingChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                          >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="billingPhone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            id="billingPhone"
                            value={billingForm.phone}
                            onChange={handleBillingChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={updatingBilling}
                          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 transition duration-150"
                        >
                          {updatingBilling ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </>
                          ) : (
                            'Update Address'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              
              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-700">
                  <div className="px-6 py-5 border-b border-gray-700">
                    <h3 className="text-lg font-medium text-white">Change Password</h3>
                    <p className="mt-1 text-sm text-gray-400">Update your password to keep your account secure.</p>
                  </div>
                  
                  <form onSubmit={handlePasswordSubmit} className="px-6 py-6 space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                          required
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-150"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-yellow-500 bg-opacity-10 p-4 rounded-md border border-yellow-500 border-opacity-30">
                      <h4 className="text-sm font-medium text-yellow-400 mb-2">Password Requirements</h4>
                      <ul className="text-sm text-yellow-300 list-disc list-inside space-y-1">
                        <li>At least 6 characters long</li>
                        <li>Contains at least one uppercase letter</li>
                        <li>Contains at least one number</li>
                        <li>Contains at least one special character</li>
                      </ul>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 transition duration-150"
                      >
                        {changingPassword ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;