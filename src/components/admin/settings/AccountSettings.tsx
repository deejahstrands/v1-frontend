"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Mail, Phone, User } from 'lucide-react';

export default function AccountSettings() {
  const [openAccordion, setOpenAccordion] = useState<'personal' | 'password' | null>('personal');
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Olanipekun',
    lastName: 'Olumide',
    email: 'user@gmail.com',
    phone: '08074238764'
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleAccordionToggle = (accordion: 'personal' | 'password') => {
    setOpenAccordion(openAccordion === accordion ? null : accordion);
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = () => {
    // Handle save personal info
    console.log('Saving personal info:', personalInfo);
  };

  const handleSavePassword = () => {
    // Handle save password
    console.log('Saving password:', passwordInfo);
  };

  return (
    <div className="space-y-6">
      {/* Personal Info Accordion */}
      <div className="bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => handleAccordionToggle('personal')}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-900">Personal info</h3>
            <p className="text-sm text-gray-500">View your personal details here.</p>
          </div>
          {openAccordion === 'personal' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {openAccordion === 'personal' && (
          <div className="px-6 pb-6 border-t border-gray-200">
            <div className="pt-6 space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={personalInfo.firstName}
                  onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                  placeholder="First Name"
                  icon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Name"
                  value={personalInfo.lastName}
                  onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                  placeholder="Last Name"
                  icon={<User className="w-4 h-4" />}
                />
              </div>

              {/* Email Field */}
              <div>
                <Input
                  label="Email address"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  placeholder="Enter email address"
                  icon={<Mail className="w-4 h-4" />}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email Address cannot be changed</p>
              </div>

              {/* Phone Field */}
              <Input
                label="Phone Number"
                value={personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder="Enter phone number"
                icon={<Phone className="w-4 h-4" />}
              />
            </div>
            
            {/* Personal Info Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                variant="black" 
                className="w-full sm:w-auto"
                onClick={handleSavePersonalInfo}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Accordion */}
      <div className="bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => handleAccordionToggle('password')}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            <p className="text-sm text-gray-500">Update your password and security preferences</p>
          </div>
          {openAccordion === 'password' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {openAccordion === 'password' && (
          <div className="px-6 pb-6 border-t border-gray-200">
            <div className="pt-6 space-y-6">
              {/* Current Password */}
              <PasswordInput
                label="Current Password"
                value={passwordInfo.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                placeholder="Enter Password"
              />

              {/* New Password */}
              <PasswordInput
                label="New Password"
                value={passwordInfo.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                placeholder="Enter New Password"
                helperText="Minimum of 8 characters"
              />

              {/* Confirm New Password */}
              <PasswordInput
                label="Confirm New Password"
                value={passwordInfo.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                placeholder="Confirm New Password"
              />
            </div>
            
            {/* Password Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                variant="black" 
                className="w-full sm:w-auto"
                onClick={handleSavePassword}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

