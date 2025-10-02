"use client";

import { useEffect } from "react";
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
import { useOverviewStore } from "@/store/admin/use-overview";

interface StatsCardsProps {
  selectedPeriod: string;
}

export function StatsCards({ selectedPeriod }: StatsCardsProps) {
  const { 
    overviewData, 
    isLoading, 
    error, 
    loadOverview, 
    setCurrentPeriod,
    setFiltering,
    clearError 
  } = useOverviewStore();

  // Load overview data on mount and when selectedPeriod changes
  useEffect(() => {
    const currentState = useOverviewStore.getState();
    
    // Only proceed if period is actually changing
    if (selectedPeriod === currentState.currentPeriod) {
      return;
    }
    
    // If period is changing, set filtering state
    setFiltering(true);
    setCurrentPeriod(selectedPeriod);
    
    if (selectedPeriod === 'all') {
      loadOverview(); // No since parameter = get all data
    } else {
      loadOverview({
        since: selectedPeriod as
          | 'this_week'
          | 'this_month'
          | 'last_seven_days'
          | 'last_thirty_days'
          | 'last_three_months'
          | 'last_six_months'
          | 'last_year',
      });
    }
  }, [selectedPeriod, loadOverview, setCurrentPeriod, setFiltering]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load overview data</p>
          <button
            onClick={() => {
              clearError();
              if (selectedPeriod === 'all') {
                loadOverview();
              } else {
                loadOverview({
                  since: selectedPeriod as
                    | 'this_week'
                    | 'this_month'
                    | 'last_seven_days'
                    | 'last_thirty_days'
                    | 'last_three_months'
                    | 'last_six_months'
                    | 'last_year',
                });
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!overviewData) {
    return null;
  }

  const statsData = [
    {
      title: "Total Orders",
      value: overviewData.orders.totalOrders.toString(),
      change: "+0%", // You can calculate this based on previous period
      changeType: "increase" as const,
      icon: <ShoppingCart className="h-6 w-6 text-gray-500" />,
    },
    {
      title: "Pending Orders",
      value: overviewData.orders.pendingOrders.toString(),
      change: "+0%",
      changeType: "increase" as const,
      icon: <Clock className="h-6 w-6 text-orange-500" />,
    },
    {
      title: "Completed Orders",
      value: overviewData.orders.completedOrders.toString(),
      change: "+0%",
      changeType: "increase" as const,
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Processing Orders",
      value: overviewData.orders.processingOrders.toString(),
      change: "+0%",
      changeType: "increase" as const,
      icon: <Settings className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Total Consultations",
      value: overviewData.consultation.totalConsultations.toString(),
      change: "+0%",
      changeType: "increase" as const,
      icon: <Briefcase className="h-6 w-6 text-gray-500" />,
    },
    {
      title: "Scheduled Consultations",
      value: overviewData.consultation.scheduledConsultations.toString(),
      change: "+0%",
      changeType: "increase" as const,
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Pending Consultations",
      value: overviewData.consultation.pendingConsultations.toString(),
      change: "+0%",
      changeType: "increase" as const,
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
    },
    {
      title: "Total Revenue",
      value: `₦${overviewData.revenue.toLocaleString()}`,
      change: "+0%",
      changeType: "increase" as const,
      icon: <CreditCard className="h-6 w-6 text-gray-500" />,
    },
    {
      title: "Products in Store",
      value: overviewData.products.totalProducts.toString(),
      change: "+0%",
      changeType: "increase" as const,
      icon: <Package className="h-6 w-6 text-gray-500" />,
    },
    {
      title: "Total Users",
      value: overviewData.users.totalUsers.toString(),
      change: "+0%",
      changeType: "increase" as const,
      icon: <Users className="h-6 w-6 text-cyan-500" />,
    },
  ];

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