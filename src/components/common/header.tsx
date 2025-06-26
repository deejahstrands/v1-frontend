"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import { MobileMenu } from "./mobile-menu";
import { SearchModal } from "./search-modal";

const mainNavItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Book A Consultation", href: "/consultation" },
  { label: "Customization", href: "/customization" },
];

const categories = [
  { label: "Hair Extensions", href: "/category/hair-extensions" },
  { label: "Wigs", href: "/category/wigs" },
  { label: "Hair Care", href: "/category/hair-care" },
  { label: "Accessories", href: "/category/accessories" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isLoggedIn = false; // TODO: Replace with actual auth state

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -ml-2 p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo/logo.svg"
                  alt="Deejah Strands"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="ml-2 text-lg font-semibold hidden sm:inline">DEEJAH STRANDS</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-8">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium py-2 border-b-2 transition-colors hover:text-gray-900 ${
                    pathname === item.href
                      ? "border-[#ED6745] text-gray-900"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center text-sm font-medium py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 group-hover:border-[#ED6745]">
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full w-48 py-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {categories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {isLoggedIn ? (
                <>
                  <Link href="/account/wishlist" className="p-2 text-gray-600 hover:text-gray-900">
                    <Heart className="h-5 w-5" />
                  </Link>
                  <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900">
                    <ShoppingBag className="h-5 w-5" />
                  </Link>
                  <Link href="/account" className="p-2 text-gray-600 hover:text-gray-900">
                    <User className="h-5 w-5" />
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/account/wishlist" className="p-2 text-gray-600 hover:text-gray-900">
                    <Heart className="h-5 w-5" />
                  </Link>
                  <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900">
                    <ShoppingBag className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        mainNavItems={mainNavItems}
        categories={categories}
      />

      {/* Search modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
} 