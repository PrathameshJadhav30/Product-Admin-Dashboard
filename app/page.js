"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    router.replace(isAuthenticated ? "/products" : "/login");
  }, [router, isAuthenticated]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-slate-600">
      <p>Loading dashboard...</p>
    </div>
  );
}
