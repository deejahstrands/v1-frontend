/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/store/use-auth';
import cloudinaryService from '@/services/cloudinary';
import { toast } from 'react-toastify';
import { 
  User, 
  Mail, 
  Phone, 
  Edit3, 
  Upload, 
  Camera,
  Check,
  X
} from 'lucide-react';

export function ProfileSection() {
  const { user, isLoading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatar: ''
  });
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
      setAvatarPreview(user.avatar || '');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, GIF, or SVG)');
      return;
    }

    // Validate file size (max 10MB - Cloudinary limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      
      // Create preview immediately for better UX
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary with user avatars folder
      const result = await cloudinaryService.uploadImage(file, 'user-avatars');
      const avatarUrl = result.secure_url;
      
      // Update form data with Cloudinary URL
      setFormData(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
      
      // Update preview with Cloudinary URL
      setAvatarPreview(avatarUrl);
      
      toast.success('Avatar uploaded successfully');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(error.message || 'Failed to upload avatar');
      
      // Reset preview on error
      setAvatarPreview(user?.avatar || '');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        avatar: formData.avatar
      };

      await updateProfile(updateData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#C9A898] font-medium">Profile</span>
        </nav>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Details</h1>
          {!isEditing && (
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          {/* Current Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isUploadingAvatar 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#C9A898] text-white hover:bg-[#b88b6d] cursor-pointer'
                }`}
              >
                {isUploadingAvatar ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Camera size={16} />
                )}
              </button>
            )}
          </div>

          {/* Upload Area */}
          {isEditing && (
            <div className="flex-1">
              <div
                onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isUploadingAvatar 
                    ? 'border-[#C9A898] bg-[#C9A898] bg-opacity-10 cursor-not-allowed' 
                    : 'border-gray-300 hover:border-[#C9A898] hover:bg-[#C9A898] hover:bg-opacity-5 cursor-pointer'
                }`}
              >
                {isUploadingAvatar ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C9A898] mx-auto mb-2"></div>
                    <p className="text-sm text-[#C9A898] mb-1">Uploading avatar...</p>
                    <p className="text-xs text-gray-500">Please wait</p>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 10MB)</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploadingAvatar}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A898] focus:border-transparent"
                  placeholder="Enter first name"
                />
              ) : (
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-900">{user?.firstName || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A898] focus:border-transparent"
                  placeholder="Enter last name"
                />
              ) : (
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-900">{user?.lastName || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-900">{user?.email}</span>
              </div>
              <span className="text-xs text-gray-500">Read only</span>
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A898] focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-900">{user?.phone || 'Not provided'}</span>
                </div>
                <Edit3 size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isUpdating}
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating || isUploadingAvatar}
              className="bg-[#C9A898] hover:bg-[#b88b6d]"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : isUploadingAvatar ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
