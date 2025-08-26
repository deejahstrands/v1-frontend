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
  const { user, isAuthenticated, isLoading, getCurrentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);


  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token
        const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

        if (token && !isAuthenticated) {
          await getCurrentUser();
        }
      } catch (error) {
        console.error('❌ Admin layout: Failed to initialize auth:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [getCurrentUser, isAuthenticated]);

  useEffect(() => {
    // Don't check auth until initialization is complete
    if (isInitializing) {
      return;
    }

    // Simple auth check - redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      ;
      toast.error("Authentication required. Please login.");
      router.push("/admin-auth/login");
      return;
    }

    // Check admin privileges
    if (!isLoading && user && !user.isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/admin-auth/login");
      return;
    }
  }, [isInitializing, isLoading, isAuthenticated, user, router, toast]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isSidebarOpen]);

  // Show loading state while initializing or loading
  if (isInitializing || isLoading) {
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
    return null;
  }



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