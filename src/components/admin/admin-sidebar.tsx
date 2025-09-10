"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  FolderOpen,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customization", label: "Customization", icon: Palette, hasSubItems: true },
  { href: "/admin/customization/types", label: "Types", icon: Palette, parent: "customization" },
  { href: "/admin/customization/options", label: "Options", icon: Palette, parent: "customization" },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/collections", label: "Collection", icon: Star },
  { href: "/admin/discounts", label: "Discount & Deals", icon: Ticket },
  { href: "/admin/consultation", label: "Consultation", icon: MessageSquare, hasSubItems: true },
  { href: "/admin/consultation/types", label: "Types", icon: Settings, parent: "consultation" },
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const isCustomizationExpanded = pathname.startsWith('/admin/customization');
  const isConsultationExpanded = pathname.startsWith('/admin/consultation');

  useEffect(() => {
    const expandedMenus = [];
    if (isCustomizationExpanded) {
      expandedMenus.push('customization');
    }
    if (isConsultationExpanded) {
      expandedMenus.push('consultation');
    }
    setExpandedMenus(expandedMenus);
  }, [isCustomizationExpanded, isConsultationExpanded]);

  const toggleMenu = (menuKey: string) => {

    setExpandedMenus((prev: string[]) => {
      const newState = prev.includes(menuKey)
        ? prev.filter((item: string) => item !== menuKey)
        : [...prev, menuKey];

      return newState;
    });
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-[256px] lg:w-[200px] xl:w-[248px] bg-white text-black lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col border-r border-gray-200",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-shrink-0 items-center justify-between lg:justify-center h-[70px] lg:h-[68px] xl:h-[88px] px-6 border-b border-gray-200">
          <Link href="/admin">
            <Image
              src="/logo/logo.svg"
              alt="Deejah Strands Logo"
              width={80}
              height={30}
              className="h-auto w-12 lg:w-15 xl:w-16 2xl:w-18"
            />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {sidebarNavItems.map(({ href, label, icon: Icon, parent, hasSubItems }) => {
            if (parent) {

              return null;
            }


            if (hasSubItems) {
              const menuKey = label.toLowerCase();
              const isExpanded = expandedMenus.includes(menuKey);
              const isInParentSection = pathname.startsWith(href);
              const ChevronIcon = isExpanded ? ChevronUp : ChevronDown;


              return (
                <div key={href}>
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900",
                      isInParentSection && "bg-black text-white"
                    )}
                  >
                    <Link
                      href={href}
                      className="flex items-center gap-3 flex-1"
                    >
                      <Icon className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                      <span className="text-xs lg:text-xs xl:text-sm">{label}</span>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMenu(menuKey);
                      }}
                      className="p-1 rounded-full hover:bg-gray-200 focus:outline-none transition-colors cursor-pointer"
                      type="button"
                    >
                      <ChevronIcon className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 space-y-1 pt-2">
                          {sidebarNavItems
                            .filter(item => item.parent === menuKey)
                            .map(subItem => {
                              const isSubItemActive = pathname === subItem.href;
                              return (
                                <motion.div
                                  key={subItem.href}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ duration: 0.2, delay: 0.1 }}
                                >
                                  <Link
                                    href={subItem.href}
                                    className={cn(
                                      "flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900",
                                      isSubItemActive && "text-black"
                                    )}
                                  >
                                    {isSubItemActive && (
                                      <ChevronRight className="h-3 w-3 text-black" />
                                    )}
                                    <subItem.icon className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                                    <span className="text-xs lg:text-xs xl:text-sm">{subItem.label}</span>
                                  </Link>
                                </motion.div>
                              );
                            })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900",
                  pathname === href && "bg-black text-white"
                )}
              >
                <Icon className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                <span className="text-xs lg:text-xs xl:text-sm">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
} 