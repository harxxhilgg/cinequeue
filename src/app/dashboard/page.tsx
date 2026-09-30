"use client";

import { useAuthStore } from "@/stores/use-auth-store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="min-h-screen p-6">
      <h1>Dashboard</h1>

      <p>Welcome, {user?.name}</p>
    </main>
  );
}