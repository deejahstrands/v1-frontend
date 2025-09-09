"use client";

import { useState } from 'react';
import { AccountSettings, DeliverySettings } from '@/components/admin/settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'delivery'>('account');

  return (
    <div className="w-full mx-auto max-w-4xl">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('account')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                activeTab === 'account'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Account
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                activeTab === 'delivery'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Delivery Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'account' && <AccountSettings />}
      {activeTab === 'delivery' && <DeliverySettings />}
    </div>
  );
}
