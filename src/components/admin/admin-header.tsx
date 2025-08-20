"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, ChevronDown, Menu, LogOut, CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/lib/use-media-query";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/store/use-auth";
import { User } from "@/services/auth";

export function AdminHeader({
  setIsSidebarOpen,
  currentUser,
}: {
  setIsSidebarOpen: (isOpen: boolean) => void;
  currentUser: User;
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [currentDate, setCurrentDate] = useState("");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(new Intl.DateTimeFormat("en-US", options).format(date));
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      logout(); // This will clear remembered credentials
      router.push("/admin-auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isDesktop) {
    return (
      <>
        <header className="sticky top-0 z-20 flex items-center justify-between h-[70px] lg:h-[68px] xl:h-[88px] px-4 md:px-6 bg-white border-b border-gray-200">
          <div className="flex-1"></div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
              <CalendarIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">{currentDate}</span>
            </div>

            <div className="h-6 border-l border-gray-300 hidden lg:block"></div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-600 hover:text-gray-900 focus-visible:outline-none">
                    <Bell size={20} />
                    <span className="sr-only">Notifications</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="h-6 border-l border-gray-300 hidden lg:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 focus-visible:outline-none">
                  <Image
                    src="/dummy/avatar.svg"
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                  <ChevronDown size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowLogoutModal(true)} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold mt-2">Log out</h2>
            <p className="text-gray-600 text-center">Are you sure you want to log out from this account?</p>
            <div className="flex gap-4 w-full mt-2">
              <button
                className="flex-1 border-2 border-red-400 text-red-500 rounded-lg py-2 font-medium hover:bg-red-50 transition"
                onClick={() => setShowLogoutModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-500 text-white rounded-lg py-2 font-medium hover:bg-red-600 transition"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? "Logging out..." : "Log out"}
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-[70px] lg:h-[68px] xl:h-[88px] px-4 md:px-6 bg-white border-b border-gray-200">
      <button
        className="lg:hidden text-gray-600 hover:text-gray-900"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
        <span className="sr-only">Open sidebar</span>
      </button>
      <div className="flex-1"></div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-600 hover:text-gray-900 focus-visible:outline-none">
              <Bell size={20} />
              <span className="sr-only">Notifications</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Coming soon</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus-visible:outline-none">
              <Image
                src="/dummy/avatar.svg"
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <ChevronDown size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowLogoutModal(true)} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold mt-2">Log out</h2>
          <p className="text-gray-600 text-center">Are you sure you want to log out from this account?</p>
          <div className="flex gap-4 w-full mt-2">
            <button
              className="flex-1 border-2 border-red-400 text-red-500 rounded-lg py-2 font-medium hover:bg-red-50 transition"
              onClick={() => setShowLogoutModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-red-500 text-white rounded-lg py-2 font-medium hover:bg-red-600 transition"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
} 