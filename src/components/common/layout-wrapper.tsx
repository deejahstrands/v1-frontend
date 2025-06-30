"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { ClientFooterWrapper } from "./client-footer-wrapper";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/admin-auth');

  // For admin routes, just render children directly (let admin layout handle it)
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For ecommerce routes, apply the full ecommerce layout
  return (
    <>
      <Header />
      <main className="flex-1 pb-[72px] md:pb-0">
        {children}
      </main>
      <ClientFooterWrapper />
    </>
  );
} 