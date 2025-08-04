"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { X, ChevronLeft, ChevronRight, User, Heart, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import type { User as UserType } from "@/services/auth";
import { useCart } from '@/store/use-cart';
import { useWishlist } from '@/store/use-wishlist';
import { useLoginModal } from '@/hooks/use-login-modal';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavItems: Array<{ label: string; href: string }>;
  categories: Array<{ label: string; href: string }>;
  isLoggedIn?: boolean;
  user?: UserType | null;
  onLogout?: () => void;
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  mainNavItems, 
  categories,
  isLoggedIn = false,
  user,
  onLogout
}: MobileMenuProps) {
  const pathname = usePathname();
  const [showCategories, setShowCategories] = useState(false);
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

  const handleClose = () => {
    setShowCategories(false);
    onClose();
  };

  return (
    <Transition show={isOpen} appear={true}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Backdrop */}
        <TransitionChild>
          <div 
            className={clsx([
              "fixed inset-0 bg-black/40 transition ease-in-out",
              "data-closed:opacity-0",
              "data-enter:duration-200",
              "data-leave:duration-150"
            ])}
            onClick={handleClose}
          />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <TransitionChild>
                <DialogPanel 
                  className={clsx([
                    "pointer-events-auto w-screen max-w-md",
                    "transition ease-in-out",
                    "data-closed:-translate-x-full",
                    "data-enter:duration-300 data-enter:ease-out",
                    "data-leave:duration-200 data-leave:ease-in"
                  ])}
                >
                  <div className="flex h-full flex-col overflow-hidden bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 border-b border-gray-100 relative z-10 bg-white">
                      {showCategories ? (
                        <button
                          type="button"
                          className="flex items-center text-gray-600 hover:text-gray-900"
                          onClick={() => setShowCategories(false)}
                        >
                          <ChevronLeft className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">Back to Menu</span>
                        </button>
                      ) : (
                        <div className="text-sm font-medium text-gray-900"></div>
                      )}
                      <button
                        type="button"
                        className="p-2 text-gray-600 hover:text-gray-900"
                        onClick={handleClose}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto">
                      <Transition show={!showCategories}>
                        <TransitionChild>
                          <div 
                            className={clsx([
                              "absolute inset-0 bg-white pt-[73px]",
                              "transition ease-in-out",
                              "data-closed:-translate-x-full",
                              "data-enter:duration-200 data-enter:ease-out",
                              "data-leave:duration-150 data-leave:ease-in"
                            ])}
                          >
                            <nav className="px-4 py-6 space-y-4">
                              {mainNavItems.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className={`block px-3 py-2 text-base font-medium rounded-lg ${
                                    pathname === item.href
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  }`}
                                  onClick={handleClose}
                                >
                                  {item.label}
                                </Link>
                              ))}
                              <button
                                className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
                                onClick={() => setShowCategories(true)}
                              >
                                Categories
                                <ChevronRight className="h-5 w-5" />
                              </button>
                              
                              {/* Cart and Wishlist Icons */}
                              <div className="flex items-center justify-center space-x-4 mt-6">
                                {isLoggedIn ? (
                                  <>
                                    <Link
                                      href="/account/wishlist"
                                      className="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg relative"
                                      onClick={handleClose}
                                    >
                                      <Heart className="h-6 w-6" />
                                      {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                                          {wishlistCount}
                                        </span>
                                      )}
                                    </Link>
                                    <Link
                                      href="/cart"
                                      className="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg relative"
                                      onClick={handleClose}
                                    >
                                      <ShoppingBag className="h-6 w-6" />
                                      {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                                          {cartCount}
                                        </span>
                                      )}
                                    </Link>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={handleWishlistClick}
                                      className="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg relative"
                                    >
                                      <Heart className="h-6 w-6" />
                                      {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                                          {wishlistCount}
                                        </span>
                                      )}
                                    </button>
                                    <button
                                      onClick={handleCartClick}
                                      className="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg relative"
                                    >
                                      <ShoppingBag className="h-6 w-6" />
                                      {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                                          {cartCount}
                                        </span>
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>

                              {/* Login/Account Button */}
                              {isLoggedIn ? (
                                <div className="space-y-2 mt-6">
                                  <Link
                                    href="/account"
                                    className="flex items-center justify-center w-full px-3 py-3 text-base font-medium text-white bg-black hover:bg-gray-900 rounded-lg"
                                    onClick={handleClose}
                                  >
                                    <User className="h-5 w-5 mr-2" />
                                    {user?.firstName ? `${user.firstName}'s Account` : "My Account"}
                                  </Link>
                                  {onLogout && (
                                    <button
                                      onClick={() => {
                                        onLogout();
                                        handleClose();
                                      }}
                                      className="flex items-center justify-center w-full px-3 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                    >
                                      Logout
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <Link
                                  href="/auth/login"
                                  className="flex items-center justify-center w-full px-3 py-3 text-base font-medium text-white bg-black hover:bg-gray-900 rounded-lg mt-6"
                                  onClick={handleClose}
                                >
                                  <User className="h-5 w-5 mr-2" />
                                  Login
                                </Link>
                              )}
                            </nav>
                          </div>
                        </TransitionChild>
                      </Transition>

                      <Transition show={showCategories}>
                        <TransitionChild>
                          <div 
                            className={clsx([
                              "absolute inset-0 bg-white pt-[73px]",
                              "transition ease-in-out",
                              "data-closed:translate-x-full",
                              "data-enter:duration-200 data-enter:ease-out",
                              "data-leave:duration-150 data-leave:ease-in"
                            ])}
                          >
                            <nav className="px-4 py-6 space-y-2">
                              {categories.map((category) => (
                                <Link
                                  key={category.href}
                                  href={category.href}
                                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
                                  onClick={handleClose}
                                >
                                  {category.label}
                                </Link>
                              ))}
                            </nav>
                          </div>
                        </TransitionChild>
                      </Transition>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 