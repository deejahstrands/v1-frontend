'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/use-auth';
import { useCart } from '@/store/use-cart';
import { useWishlist } from '@/store/use-wishlist';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const { initializeAuth, isAuthenticated } = useAuth();
  const fetchCart = useCart((s) => s.fetchCart);
  const fetchWishlist = useWishlist((s) => s.fetchWishlist);

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    // Initialize authentication on app start
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Only sync cart/wishlist when authenticated and NOT on admin pages
    if (isAuthenticated && !isAdminPage) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, isAdminPage, fetchCart, fetchWishlist]);

  return <>{children}</>;
}
