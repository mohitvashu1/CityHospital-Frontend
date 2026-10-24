
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ClipboardList,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  LoaderCircle,
  ArrowLeft,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export default function StaffLoginPage() {
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
      const response = await fetch(`${API_URL}/api/staff/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to sign in. Check your credentials."
        );
      }

      if (!data.token || data.user?.role !== "RECEPTIONIST") {
        throw new Error(
          "This account is not authorized for the Reception Staff portal."
        );
      }

      sessionStorage.setItem("staffToken", data.token);
      sessionStorage.setItem("staffUser", JSON.stringify(data.user));

      router.replace("/admin/staff/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7fafc] px-4 py-8 text-[#123b50] sm:px-6 sm:py-12">
      {/* Hospital logo */}
      <header className="mx-auto mb-8 flex max-w-5xl items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="City Hospital home"
          className="rounded-md focus:outline-none focus:ring-2 focus:ring-[#16587b]"
        >
          <Image
            src="/logo1.png"
            alt="City Hospital"
            width={220}
            height={65}
            priority
            className="h-11 w-auto object-contain sm:h-14"
          />
        </Link>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#16587b] transition hover:bg-[#eaf3f8]"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">All portals</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </header>

      {/* Login card */}
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        {/* Information panel */}
        <section className="relative overflow-hidden bg-[#16587b] p-7 text-white sm:p-10 lg:p-11">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10" />

          <div className="relative">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10">
              <ClipboardList size={23} strokeWidth={1.7} />
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/70">
              City Hospital · Buxar
            </p>

            <h1 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Reception Staff
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
              Your workspace for managing daily appointments, patient
              registration and reception operations.
            </p>

            <div className="mt-9 space-y-4 border-t border-white/15 pt-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <ShieldCheck size={17} strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-sm font-medium">Authorized access</p>
                  <p className="mt-1 text-sm leading-5 text-white/70">
                    Your account permissions control access to hospital data.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <ClipboardList size={17} strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-sm font-medium">Daily operations</p>
                  <p className="mt-1 text-sm leading-5 text-white/70">
                    Access appointment queues and permitted patient details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Login form */}
        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#a9002d]">
              Staff account
            </p>

            <h2 className="mt-2 text-2xl font-medium tracking-tight text-[#123b50]">
              Sign in to your account
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter the credentials provided by hospital management.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="staff-email"
                className="mb-2 block text-sm font-medium text-[#123b50]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  strokeWidth={1.7}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="staff-email"
                  type="email"
                  autoComplete="username"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  placeholder="staff@cityhospital.in"
                  className="h-12 w-full rounded-lg border border-[#dceaf1] bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10 disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="staff-password"
                className="mb-2 block text-sm font-medium text-[#123b50]"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  strokeWidth={1.7}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="staff-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-lg border border-[#dceaf1] bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10 disabled:bg-slate-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-[#eaf3f8] hover:text-[#16587b]"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.7} />
                  ) : (
                    <Eye size={18} strokeWidth={1.7} />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#16587b] bg-[#16587b] px-4 text-sm font-medium text-white transition hover:border-[#123b50] hover:bg-[#123b50] focus:outline-none focus:ring-4 focus:ring-[#16587b]/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in securely
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-[#dceaf1] pt-5">
            <p className="text-xs leading-5 text-slate-500">
              This portal is for authorized reception staff. Login credentials
              are verified by the City Hospital server.
            </p>
          </div>
        </section>
      </div>

      <footer className="mx-auto mt-8 max-w-5xl text-center text-xs text-slate-500">
        © {new Date().getFullYear()} City Hospital, Buxar, Bihar
      </footer>
    </main>
  );
}
