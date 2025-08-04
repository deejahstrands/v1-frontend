"use client";

import Link from "next/link";
import { User, Search, Heart, ShoppingBag, Store } from "lucide-react";
import { useCart } from '@/store/use-cart';
import { useWishlist } from '@/store/use-wishlist';
import { useLoginModal } from '@/hooks/use-login-modal';

interface MobileFooterProps {
  isLoggedIn?: boolean;
  onSearchClick: () => void;
}

export function MobileFooter({ isLoggedIn = false, onSearchClick }: MobileFooterProps) {
  const cartCount = useCart(state => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useWishlist(state => state.items.length);
  const { openModal } = useLoginModal();

  const handleCartClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      openModal("View Cart", () => {
        // After login, user can access cart
        window.location.href = '/cart';
      });
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      openModal("View Wishlist", () => {
        // After login, user can access wishlist
        window.location.href = '/account/wishlist';
      });
    }
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-gray-100 bg-white px-4 py-3 z-40">
      <div className="flex items-center justify-around">
        <Link
          href={isLoggedIn ? "/account" : "/auth/login"}
          className="flex flex-col items-center text-gray-600 hover:text-gray-900"
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">{isLoggedIn ? "Account" : "Login"}</span>
        </Link>
        
        <Link
          href="/shop"
          className="flex flex-col items-center text-gray-600 hover:text-gray-900"
        >
          <Store className="w-6 h-6" />
          <span className="text-xs mt-1">Shop</span>
        </Link>
        
        <button
          onClick={onSearchClick}
          className="flex flex-col items-center text-gray-600 hover:text-gray-900"
        >
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Search</span>
        </button>
        {isLoggedIn ? (
          <Link
            href="/account/wishlist"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900 relative"
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">{wishlistCount}</span>
            )}
            <span className="text-xs mt-1">Wishlist</span>
          </Link>
        ) : (
          <button
            onClick={handleWishlistClick}
            className="flex flex-col items-center text-gray-600 hover:text-gray-900 relative"
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">{wishlistCount}</span>
            )}
            <span className="text-xs mt-1">Wishlist</span>
          </button>
        )}
        {isLoggedIn ? (
          <Link
            href="/cart"
            className="flex flex-col items-center text-gray-600 hover:text-gray-900 relative"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">{cartCount}</span>
            )}
            <span className="text-xs mt-1">Cart</span>
          </Link>
        ) : (
          <button
            onClick={handleCartClick}
            className="flex flex-col items-center text-gray-600 hover:text-gray-900 relative"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">{cartCount}</span>
            )}
            <span className="text-xs mt-1">Cart</span>
          </button>
        )}
      </div>
    </div>
  );
} 