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
    <main className="min-h-screen bg-[#f7fafc] px-4 py-10 flex items-center justify-center">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-xl md:grid-cols-2">
        <section className="bg-[#16587b] p-8 text-white sm:p-10">
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><ShieldCheck size={30} /></div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">City Hospital</p>
          <h1 className="mt-3 text-3xl font-semibold">Super Admin</h1>
          <p className="mt-3 text-sm leading-6 text-white/80">Secure access for authorized hospital management.</p>
          <p className="mt-8 border-t border-white/20 pt-5 text-sm leading-6 text-white/75">Manage staff and accounts, review hospital activity, and oversee appointments.</p>
        </section>
        <section className="p-7 sm:p-10">
          <h2 className="text-2xl font-semibold text-[#123b50]">Sign in</h2>
          <p className="mt-2 text-sm text-gray-600">Use the administrator credentials created during secure setup.</p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-[#123b50]">Email address</label>
              <div className="relative"><Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input id="admin-email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} placeholder="admin@cityhospital.in" className="w-full rounded-xl border border-[#dceaf1] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10 disabled:bg-gray-50" /></div>
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-[#123b50]">Password</label>
              <div className="relative"><LockKeyhole size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="w-full rounded-xl border border-[#dceaf1] py-3 pl-11 pr-12 text-sm outline-none focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10 disabled:bg-gray-50" /><button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-[#16587b]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </div>
            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16587b] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#104661] disabled:cursor-not-allowed disabled:opacity-60">{loading && <LoaderCircle size={17} className="animate-spin" />}{loading ? "Signing in..." : "Sign in securely"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
