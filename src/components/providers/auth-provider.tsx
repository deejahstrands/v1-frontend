'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/use-auth';
import { useCart } from '@/store/use-cart';
import { useWishlist } from '@/store/use-wishlist';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, isAuthenticated } = useAuth();
  const fetchCart = useCart((s) => s.fetchCart);
  const fetchWishlist = useWishlist((s) => s.fetchWishlist);

  useEffect(() => {
    // Initialize authentication on app start
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Only sync cart/wishlist when authenticated (token required)
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  return <>{children}</>;
}
