"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href={isAuthenticated ? "/products" : "/login"} className="text-lg font-bold text-slate-900">
            Product Admin
          </Link>
        </div>

        {isAuthenticated ? (
          <nav className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Link href="/products" className="rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
              Products
            </Link>
            <Link href="/products/new" className="rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
              Add Product
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-md bg-slate-900 px-3 py-2 text-white transition hover:bg-slate-700"
            >
              Logout
            </button>
          </nav>
        ) : (
          <Link href="/login" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
