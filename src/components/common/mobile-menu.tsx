"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { X, ChevronLeft, ChevronRight, User } from "lucide-react";
import clsx from "clsx";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavItems: Array<{ label: string; href: string }>;
  categories: Array<{ label: string; href: string }>;
  isLoggedIn?: boolean;
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  mainNavItems, 
  categories,
  isLoggedIn = false
}: MobileMenuProps) {
  const pathname = usePathname();
  const [showCategories, setShowCategories] = useState(false);

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
                              
                              {/* Login/Account Button */}
                              <Link
                                href={isLoggedIn ? "/account" : "/auth/login"}
                                className="flex items-center justify-center w-full px-3 py-3 text-base font-medium text-white bg-black hover:bg-gray-900 rounded-lg mt-8"
                                onClick={handleClose}
                              >
                                <User className="h-5 w-5 mr-2" />
                                {isLoggedIn ? "My Account" : "Login"}
                              </Link>
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