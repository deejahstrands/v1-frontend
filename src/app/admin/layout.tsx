"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAuth } from "@/store/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  // Track when the layout mounts
  useEffect(() => {
    console.log('🏗️ Admin layout mounted');
    return () => {
      console.log('🏗️ Admin layout unmounted');
    };
  }, []);

  useEffect(() => {
    // Simple auth check - redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 Admin layout: User not authenticated, redirecting to login');
      toast.error("Authentication required. Please login.");
      router.push("/admin-auth/login");
      return;
    }

    // Check admin privileges
    if (!isLoading && user && !user.isAdmin) {
      console.log('🚫 Admin layout: User is not admin, redirecting to login');
      toast.error("Access denied. Admin privileges required.");
      router.push("/admin-auth/login");
      return;
    }
  }, [isLoading, isAuthenticated, user, router, toast]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isSidebarOpen]);

  // Show loading state only while actually loading
  if (isLoading) {
    console.log('⏳ Admin layout showing loading state');
    return (
      <div className="flex min-h-screen w-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render admin content if user is not authenticated or not admin
  if (!isAuthenticated || !user || !user.isAdmin) {
    console.log('🚫 Admin layout: Not rendering content - not authenticated or not admin');
    return null;
  }

  console.log('✅ Admin layout: Rendering admin content for user:', user.email);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-1 flex-col lg:ml-[200px] xl:ml-[248px] w-full">
        <div className="w-full  mx-auto">
          <AdminHeader setIsSidebarOpen={setIsSidebarOpen} currentUser={user} />
          <main className="flex-1 p-2 md:p-4 xl:p-8">{children}</main>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
} 