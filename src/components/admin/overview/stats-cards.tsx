"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  CreditCard,
  Package,
  Briefcase,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const statsData = [
  {
    title: "Total Orders",
    value: "123",
    change: "+5%",
    changeType: "increase",
    icon: <ShoppingCart className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Total Revenue",
    value: "₦46,009,284",
    change: "+16%",
    changeType: "increase",
    icon: <CreditCard className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Product in Store",
    value: "543",
    change: "-9%",
    changeType: "decrease",
    icon: <Package className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Active Consultation",
    value: "12",
    change: "+12%",
    changeType: "increase",
    icon: <Briefcase className="h-6 w-6 text-gray-500" />,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{stat.title}</span>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <div className="flex items-center text-sm mt-2">
              <span
                className={`flex items-center gap-1 ${
                  stat.changeType === "increase"
                    ? "text-green-500 bg-green-100"
                    : "text-red-500 bg-red-100"
                } px-2 py-1 rounded-full`}
              >
                {stat.changeType === "increase" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {stat.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 