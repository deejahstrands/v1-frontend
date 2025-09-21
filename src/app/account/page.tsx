'use client';

import { useState, useEffect } from 'react';
//import { Button } from '@/components/ui/button';
import { useAuth } from '@/store/use-auth';
import { ProfileSection } from '@/components/account/profile-section';
import { MyOrdersSection } from '@/components/account/my-orders-section';
import { AddressSection } from '@/components/account/address-section';
import { ConsultationSection } from '@/components/account/consultation-section';
import { 
  User, 
  Package, 
  MapPin, 
  MessageCircle, 
  LogOut, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

type AccountSection = 'profile' | 'orders' | 'address' | 'consultation';

const sidebarItems = [
  { id: 'profile' as AccountSection, label: 'Profile', icon: User },
  { id: 'orders' as AccountSection, label: 'My Orders', icon: Package },
  { id: 'address' as AccountSection, label: 'Address', icon: MapPin },
  { id: 'consultation' as AccountSection, label: 'Consultation', icon: MessageCircle },
];

export default function AccountPage() {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<AccountSection>('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  // Handle hash navigation (e.g., /account#orders)
  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    if (hash && ['profile', 'orders', 'address', 'consultation'].includes(hash)) {
      setActiveSection(hash as AccountSection);
    }
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'orders':
        return <MyOrdersSection />;
      case 'address':
        return <AddressSection />;
      case 'consultation':
        return <ConsultationSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-semibold text-gray-900">My Account</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <div className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:transition-none
        `}>
         

          <div className="flex flex-col h-full relative z-50">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Account</h2>
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-lg text-left cursor-pointer
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-white bg-opacity-10 text-[#C9A898] border-l-4 border-[#C9A898]' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 