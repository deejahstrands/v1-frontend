
import { Metadata } from 'next';
import SettingsClient from './settings-client';

export const metadata: Metadata = {
  title: 'Account Settings - Manage Your Preferences',
  description: 'Configure your account settings, preferences, and manage your Deejah Strands shopping experience.',
  keywords: [
    'account settings',
    'user preferences',
    'profile settings',
    'account management',
    'user dashboard',
    'personal settings'
  ],
  openGraph: {
    title: 'Account Settings - Deejah Strands',
    description: 'Configure your account settings, preferences, and manage your shopping experience.',
    url: 'https://deejahstrands.co/settings',
    images: [
      {
        url: '/logo/logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Deejah Strands Account Settings',
      },
    ],
  },
  twitter: {
    title: 'Account Settings - Deejah Strands',
    description: 'Configure your account settings and preferences.',
  },
  alternates: {
    canonical: 'https://deejahstrands.co/settings',
  },
  robots: {
    index: false, // Settings pages typically shouldn't be indexed
    follow: false,
  },
};

export default function SettingsPage() {
  return <SettingsClient />;
} 