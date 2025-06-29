"use client";

import Link from "next/link";
import { User, Search, Heart, ShoppingBag } from "lucide-react";

interface MobileFooterProps {
  isLoggedIn?: boolean;
  onSearchClick: () => void;
}

export function MobileFooter({ isLoggedIn = false, onSearchClick }: MobileFooterProps) {
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
        <button
          onClick={onSearchClick}
          className="flex flex-col items-center text-gray-600 hover:text-gray-900"
        >
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Search</span>
        </button>
        <Link
          href="/account/wishlist"
          className="flex flex-col items-center text-gray-600 hover:text-gray-900"
        >
          <Heart className="w-6 h-6" />
          <span className="text-xs mt-1">Wishlist</span>
        </Link>
        <Link
          href="/cart"
          className="flex flex-col items-center text-gray-600 hover:text-gray-900"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs mt-1">Cart</span>
        </Link>
      </div>
    </div>
  );
} 