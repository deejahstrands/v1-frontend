"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MobileMenu } from "./mobile-menu";
import { SearchModal } from "./search-modal";
import { Button } from "./button";
import { SectionContainer } from "./section-container";
import { useCart } from '@/store/use-cart';
import { useWishlist } from '@/store/use-wishlist';
import { useAuth } from '@/store/use-auth';
import { useCategories } from '@/store/use-categories';
import { useLoginModal } from '@/hooks/use-login-modal';

const mainNavItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Book A Consultation", href: "/consultation" },
  { label: "Customization", href: "/customization" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { openModal } = useLoginModal();
  const { categories } = useCategories();
  const cartCount = useCart(state => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useWishlist(state => state.getWishlistCount());

  const handleCartClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openModal("View Cart", () => {
        // After login, user can access cart
        window.location.href = '/cart';
      });
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openModal("View Wishlist", () => {
        // After login, user can access wishlist
        window.location.href = '/account/wishlist';
      });
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(target)) {
        setIsCategoriesOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(target)) {
        setIsAccountOpen(false);
      }
    };

    if (isCategoriesOpen || isAccountOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoriesOpen, isAccountOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary border-b border-gray-100">
        <SectionContainer>
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo/logo-white.svg"
                  alt="Deejah Strands"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <span className="ml-2 text-lg text-tertiary font-semibold font-ethereal hidden xl:inline">DEEJAH STRANDS</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-8">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium py-2 border-b-2 transition-colors text-tertiary hover:text-tertiary ${pathname === item.href
                    ? "border-secondary text-secondary"
                    : "border-transparent text-secondary"
                    }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div className="relative group" ref={categoriesDropdownRef}>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center text-sm font-medium py-2 border-b-2 border-transparent text-tertiary hover:text-tertiary cursor-pointer"
                >
                  Categories
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute left-0 top-full w-48 py-2 bg-white rounded-lg shadow-lg transition-all duration-200 z-50 ${isCategoriesOpen
                  ? 'opacity-100 visible'
                  : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                  }`}>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/shop/category/${category.id}`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Right side icons and mobile menu button */}
            <div className="flex items-center">
              <div className="hidden lg:flex items-center space-x-4">
                <button
                  type="button"
                  className="p-2 text-tertiary hover:text-tertiary cursor-pointer"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>

                {isAuthenticated ? (
                  <>
                    <Link href="/account/wishlist" className="p-2 text-tertiary hover:text-tertiary relative">
                      <Heart className="h-5 w-5" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">{wishlistCount}</span>
                      )}
                    </Link>
                    <Link href="/cart" className="p-2 text-tertiary hover:text-tertiary relative">
                      <ShoppingBag className="h-5 w-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">{cartCount}</span>
                      )}
                    </Link>
                    <div className="relative group" ref={accountDropdownRef}>
                      <button
                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                        className="p-2 text-tertiary hover:text-tertiary flex items-center gap-1 cursor-pointer"
                      >
                        <User className="h-5 w-5" />
                        <span className="text-sm hidden sm:block">{user?.firstName || 'Account'}</span>
                      </button>
                      <div className={`absolute right-0 top-full w-48 py-2 bg-white rounded-lg shadow-lg transition-all duration-200 z-50 ${isAccountOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                        <Link
                          href="/account"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                          My Account
                        </Link>
                        <button
                          onClick={logout}
                          onMouseDown={() => setIsAccountOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleWishlistClick}
                      className="p-2 text-tertiary hover:text-tertiary relative cursor-pointer"
                    >
                      <Heart className="h-5 w-5" />
                      {isAuthenticated && wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">{wishlistCount}</span>
                      )}
                    </button>
                    <button
                      onClick={handleCartClick}
                      className="p-2 text-tertiary hover:text-tertiary relative cursor-pointer"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      {isAuthenticated && cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">{cartCount}</span>
                      )}
                    </button>
                    <Link href="/auth/login" className="hidden sm:inline-flex">
                      <Button variant="tertiary" className="w-full cursor-pointer">Login</Button>
                    </Link>
                  </>
                )}
              </div>
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden p-2 text-tertiary hover:text-tertiary cursor-pointer"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </SectionContainer>
      </header>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        mainNavItems={mainNavItems}
        categories={categories.map(cat => ({
          label: cat.name,
          href: `/shop/category/${cat.id}`
        }))}
        user={user}
        onLogout={logout}
      />

      {/* Search modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
} 