"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ username: "emilys", password: "emilyspass" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/products");
    }
  }, [isAuthenticated, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await loginUser({
        username: form.username,
        password: form.password,
      });

      const authUser = {
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        id: response.id,
      };

      login(authUser, response.token);
      router.push("/products");
    } catch (requestError) {
      setError("Invalid username or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur-sm">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100">Access Portal</p>
          <h1 className="mt-2 text-2xl font-bold">Welcome back</h1>
        </div>

        <div className="p-6 sm:p-8">
          <p className="mb-5 text-sm text-slate-600">Sign in to manage products</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <LoadingSpinner label="Logging in..." className="py-0" /> : "Login"}
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            Demo credentials: <span className="font-medium">emilys</span> / <span className="font-medium">emilyspass</span>
          </div>
        </div>
      </div>
    </div>
  );
}
