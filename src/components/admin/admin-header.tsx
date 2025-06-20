"use client";

import React from "react";
import Image from "next/image";
import { Bell, ChevronDown, Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminHeader({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin-auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-[88px] px-4 md:px-6 bg-white border-b border-gray-200">
      <button
        className="lg:hidden text-gray-600 hover:text-gray-900"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
        <span className="sr-only">Open sidebar</span>
      </button>

      {/* Spacer to push user profile to the right */}
      <div className="flex-1"></div>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-900">
          <Bell size={20} />
          <span className="sr-only">Notifications</span>
        </button>
        <div className="flex items-center gap-2">
          <Image
            src="/dummy/user-avatar.png" // Placeholder
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium">Olanrewaju</p>
            <p className="text-xs text-gray-500">user@email.com</p>
          </div>
          <button>
            <ChevronDown size={20} />
          </button>
        </div>
        <div className="ml-4">
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-500">
            <LogOut size={20} />
            <span className="sr-only">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
} 