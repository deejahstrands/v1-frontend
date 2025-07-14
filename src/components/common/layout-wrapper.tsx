"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { ClientFooterWrapper } from "./client-footer-wrapper";
import { Footer } from "./footer";
import { ScrollToTopButton } from "./scroll-to-top-button";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/admin-auth');
  const isAuthRoute = pathname?.startsWith('/auth');

  // For admin or auth routes, just render children directly (let admin/auth layout handle it)
  if (isAdminRoute || isAuthRoute) {
    return <>{children}</>;
  }

  // For ecommerce routes, apply the full ecommerce layout
  return (
    <>
      <Header />
      <main className="flex-1 md:pb-0">
        {children}
      </main>
      <ClientFooterWrapper />
      <ScrollToTopButton />
      <Footer />
    </>
  );
} 