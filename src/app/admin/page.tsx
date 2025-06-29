"use client";

import { StatsCards } from "@/components/admin/overview/stats-cards";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base lg:text-xl xl:text-2xl font-bold tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-gray-500 text-xs xl:text-sm">
            Showing data over the last 30 days
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm">
              <span>This Week</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>This Week</DropdownMenuItem>
            <DropdownMenuItem>This Month</DropdownMenuItem>
            <DropdownMenuItem>This Year</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <StatsCards />
    </div>
  );
} 