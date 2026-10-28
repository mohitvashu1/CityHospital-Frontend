"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, LockKeyhole, Eye, EyeOff, LoaderCircle } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to sign in");
      if (data.user?.role !== "SUPER_ADMIN" || !data.token) throw new Error("This account is not authorized as Super Admin.");
      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("adminUser", JSON.stringify(data.user));
      router.replace("/admin/super-admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7fafc] px-4 py-8 text-[#123b50] sm:px-6 sm:py-12">
      <div className="mx-auto mb-8 flex w-full max-w-5xl items-center justify-between">
        <a href="/admin" aria-label="Back to portals" className="text-sm text-[#16587b] transition hover:text-[#123b50]">
          ← All portals
        </a>
      </div>

      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative overflow-hidden bg-[#16587b] p-7 text-white sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10">
              <ShieldCheck size={24} strokeWidth={1.7} />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/70">City Hospital · Buxar</p>
            <h1 className="mt-3 text-3xl font-medium tracking-tight">Super Admin</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
              Secure access to hospital administration, staff accounts and operational records.
            </p>
            <div className="mt-9 border-t border-white/15 pt-5 text-sm leading-6 text-white/75">
              This workspace is restricted to authorized Super Admin accounts.
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#a9002d]">Administrator account</p>
          <h2 className="mt-2 text-2xl font-medium tracking-tight text-[#123b50]">Sign in to continue</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the administrator credentials created during secure setup.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-[#123b50]">Email address</label>
              <div className="relative">
                <Mail size={18} strokeWidth={1.7} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="admin@cityhospital.in"
                  className="h-12 w-full rounded-lg border border-[#dceaf1] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-[#123b50]">Password</label>
              <div className="relative">
                <LockKeyhole size={18} strokeWidth={1.7} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-12 w-full rounded-lg border border-[#dceaf1] py-3 pl-11 pr-12 text-sm outline-none transition focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10 disabled:bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-[#eaf3f8] hover:text-[#16587b]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#16587b] bg-[#16587b] px-4 text-sm font-medium text-white transition hover:border-[#123b50] hover:bg-[#123b50] focus:outline-none focus:ring-4 focus:ring-[#16587b]/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <LoaderCircle size={17} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign in securely"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
