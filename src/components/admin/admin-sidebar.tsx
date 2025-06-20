"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  ShoppingCart,
  Package,
  Palette,
  Star,
  Ticket,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customization", label: "Customization", icon: Palette },
  { href: "/admin/collection", label: "Collection", icon: Star },
  { href: "/admin/discounts", label: "Discount & Deals", icon: Ticket },
  { href: "/admin/consultation", label: "Consultation", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-white text-black w-64 lg:w-72 lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col border-r border-gray-200",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between lg:justify-center h-[88px] px-6 border-b border-gray-200">
          <Link href="/admin">
            <Image
              src="/logo/logo.svg"
              alt="Deejah Strands Logo"
              width={80}
              height={30}
            />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {sidebarNavItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900",
                pathname === href && "bg-black text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
} 