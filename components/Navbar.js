"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-sm font-bold text-white shadow-md">
            PA
          </div>
          <Link href={isAuthenticated ? "/products" : "/login"} className="text-lg font-bold tracking-tight text-slate-900">
            Product Admin
          </Link>
        </div>

        {isAuthenticated ? (
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-600 sm:gap-3">
            <Link href="/products" className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
              Products
            </Link>
            <Link href="/products/new" className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
              Add Product
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-slate-900 px-3 py-2 text-white shadow-sm transition hover:bg-slate-700"
            >
              Logout
            </button>
          </nav>
        ) : (
          <Link href="/login" className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
