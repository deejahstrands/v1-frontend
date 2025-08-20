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
  const { user, isAuthenticated, isLoading, authInitialized } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Debug auth state
  console.log('🔐 Admin layout auth state:', {
    authInitialized,
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    userIsAdmin: user?.isAdmin
  });

  // Track when the layout mounts
  useEffect(() => {
    console.log('🏗️ Admin layout mounted');
    return () => {
      console.log('🏗️ Admin layout unmounted');
    };
  }, []);

  useEffect(() => {
    // Only redirect if auth has been initialized and we're sure the user is not authenticated
    if (authInitialized && !isLoading && !isAuthenticated) {
      console.log('🚫 Admin layout: User not authenticated, redirecting to login');
      toast.error("Authentication required. Please login.");
      router.push("/admin-auth/login");
      return;
    }

    // Check admin privileges once we have user data and auth is initialized
    if (authInitialized && !isLoading && user && !user.isAdmin) {
      console.log('🚫 Admin layout: User is not admin, redirecting to login');
      toast.error("Access denied. Admin privileges required.");
      router.push("/admin-auth/login");
      return;
    }
  }, [authInitialized, isLoading, isAuthenticated, user, router, toast]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isSidebarOpen]);

  // Show loading state while auth is being checked
  if (!authInitialized || isLoading) {
    console.log('⏳ Admin layout showing loading state:', {
      authInitialized,
      isLoading,
      isAuthenticated
    });
    return (
      <div className="flex min-h-screen w-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
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