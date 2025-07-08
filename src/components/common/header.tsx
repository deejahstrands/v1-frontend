"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import { MobileMenu } from "./mobile-menu";
import { SearchModal } from "./search-modal";
import { Button } from "./button";
import { SectionContainer } from "./section-container";
import { categories } from "@/data/categories";

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
  const isLoggedIn = false; // TODO: Replace with actual auth state

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
                  className={`text-sm font-medium py-2 border-b-2 transition-colors text-tertiary hover:text-tertiary ${
                    pathname === item.href
                      ? "border-secondary text-secondary"
                      : "border-transparent text-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center text-sm font-medium py-2 border-b-2 border-transparent text-tertiary hover:text-tertiary">
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full w-48 py-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={`/shop/category/${encodeURIComponent(category.name)}`}
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
                  className="p-2 text-tertiary hover:text-tertiary"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>

                {isLoggedIn ? (
                  <>
                    <Link href="/account/wishlist" className="p-2 text-tertiary hover:text-tertiary">
                      <Heart className="h-5 w-5" />
                    </Link>
                    <Link href="/cart" className="p-2 text-tertiary hover:text-tertiary">
                      <ShoppingBag className="h-5 w-5" />
                    </Link>
                    <Link href="/account" className="p-2 text-tertiary hover:text-tertiary">
                      <User className="h-5 w-5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/account/wishlist" className="p-2 text-tertiary hover:text-tertiary">
                      <Heart className="h-5 w-5" />
                    </Link>
                    <Link href="/cart" className="p-2 text-tertiary hover:text-tertiary">
                      <ShoppingBag className="h-5 w-5" />
                    </Link>
                    <Link href="/auth/login" className="hidden sm:inline-flex">
                      <Button variant="tertiary" className="w-full">Login</Button>
                    </Link>
                  </>
                )}
              </div>
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden p-2 text-tertiary hover:text-tertiary"
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
          href: `/shop?category=${encodeURIComponent(cat.name)}`
        }))}
        isLoggedIn={isLoggedIn}
      />

      {/* Search modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
} 