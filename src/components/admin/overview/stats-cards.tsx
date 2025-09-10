"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  CreditCard,
  Package,
  Briefcase,
  Clock,
  CheckCircle,
  Settings,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const statsData = [
  {
    title: "Total Orders",
    value: "213",
    change: "+5%",
    changeType: "increase",
    icon: <ShoppingCart className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Pending Orders",
    value: "23",
    change: "+8%",
    changeType: "increase",
    icon: <Clock className="h-6 w-6 text-orange-500" />,
  },
  {
    title: "Completed Orders",
    value: "156",
    change: "+12%",
    changeType: "increase",
    icon: <CheckCircle className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Processing Orders",
    value: "34",
    change: "+3%",
    changeType: "increase",
    icon: <Settings className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Active Consultations",
    value: "45",
    change: "+18%",
    changeType: "increase",
    icon: <Briefcase className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Scheduled Consultations",
    value: "8",
    change: "+25%",
    changeType: "increase",
    icon: <Calendar className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "Pending Consultations",
    value: "12",
    change: "+5%",
    changeType: "increase",
    icon: <AlertCircle className="h-6 w-6 text-red-500" />,
  },
  {
    title: "Total Revenue",
    value: "₦46,009,284",
    change: "+16%",
    changeType: "increase",
    icon: <CreditCard className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Products in Store",
    value: "543",
    change: "-9%",
    changeType: "decrease",
    icon: <Package className="h-6 w-6 text-gray-500" />,
  },
  {
    title: "Total Users",
    value: "1,247",
    change: "+22%",
    changeType: "increase",
    icon: <Users className="h-6 w-6 text-cyan-500" />,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
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