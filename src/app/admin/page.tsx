'use client'

import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    const random = Math.random().toString(36).substring(7);
    router.push(`/admin-auth/login?purged=${random}`);
    router.refresh();
  };

  return (
    <div>
      <h1>Admin Dashboard (admin only)</h1>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
} 