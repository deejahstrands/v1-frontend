"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Package,
  Users,
  Calendar,
  ShoppingCart,
  Settings,
  FileText,
  Palette,
  Tag,
  Percent,
} from "lucide-react";
import { useRouter } from "next/navigation";

const quickActions = [
  {
    title: "Add Product",
    description: "Create a new product",
    icon: <Plus className="h-5 w-5" />,
    href: "/admin/products?mode=add", // Products page with create functionality
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "View Products",
    description: "Manage all products",
    icon: <Package className="h-5 w-5" />,
    href: "/admin/products",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Manage Customers",
    description: "View customer list",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/customers",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Consultations",
    description: "View consultations",
    icon: <Calendar className="h-5 w-5" />,
    href: "/admin/consultation",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    title: "Orders",
    description: "Manage orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    href: "/admin/orders",
    color: "bg-indigo-500 hover:bg-indigo-600",
  },
  {
    title: "Collections",
    description: "Manage collections",
    icon: <FileText className="h-5 w-5" />,
    href: "/admin/collections",
    color: "bg-pink-500 hover:bg-pink-600",
  },
  {
    title: "Customization",
    description: "Manage customization",
    icon: <Palette className="h-5 w-5" />,
    href: "/admin/customization",
    color: "bg-amber-300 hover:bg-amber-400",
  },
  {
    title: "Categories",
    description: "Manage categories",
    icon: <Tag className="h-5 w-5" />,
    href: "/admin/categories",
    color: "bg-teal-500 hover:bg-teal-600",
  },
  {
    title: "Discounts",
    description: "Manage discounts",
    icon: <Percent className="h-5 w-5" />,
    href: "/admin/discounts",
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    title: "Settings",
    description: "System settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/admin/settings",
    color: "bg-gray-500 hover:bg-gray-600",
  },
];

export function QuickActions() {
  const router = useRouter();

  const handleActionClick = (href: string) => {
    router.push(href);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        <p className="text-sm text-gray-500">
          Common tasks and navigation shortcuts
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-center gap-2 text-center ${action.color} text-white border-0 hover:scale-105 transition-transform`}
              onClick={() => handleActionClick(action.href)}
            >
              {action.icon}
              <div>
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
