"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/doctor/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: cleanEmail, password }),
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to sign in. Please check your credentials."
        );
      }

      if (!data.token || !data.user || !data.doctor) {
        throw new Error("The server returned an incomplete login response.");
      }

      // Use sessionStorage to match the current app's tab-session auth flow.
      // Never persist the password or other credentials.
      sessionStorage.setItem("doctorToken", data.token);
      sessionStorage.setItem("doctorUser", JSON.stringify(data.user));
      sessionStorage.setItem("doctor", JSON.stringify(data.doctor));

      router.replace("/doctor/dashboard");
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
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#dceaf1] bg-white shadow-xl md:grid md:grid-cols-2">
          <section className="relative overflow-hidden bg-[#16587b] p-7 text-white sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border-[28px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full border-[32px] border-white/5" />

            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="relative mb-10 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              <ArrowLeft size={17} />
              Back to portals
            </button>

            <div className="relative">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <Stethoscope size={32} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                City Hospital · Buxar
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                Doctor Portal
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
                Sign in to manage your appointments, review patient history,
                and create consultations and prescriptions.
              </p>

              <div className="mt-9 space-y-4 border-t border-white/20 pt-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <HeartPulse size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Patient-first care</p>
                    <p className="mt-1 text-xs leading-5 text-white/70">
                      Access the information you need for your consultations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <ShieldCheck size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Secure staff access</p>
                    <p className="mt-1 text-xs leading-5 text-white/70">
                      Only active, authorized doctor accounts can sign in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="p-7 sm:p-10">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf3f8] text-[#16587b]">
                <LockKeyhole size={23} />
              </div>
              <p className="text-sm font-semibold text-[#a9002d]">
                Welcome back
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[#123b50]">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Enter the email and password provided by hospital management.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="doctor-email"
                  className="mb-2 block text-sm font-semibold text-[#123b50]"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="doctor-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="doctor@cityhospital.in"
                    autoComplete="username"
                    inputMode="email"
                    maxLength={254}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#dceaf1] bg-white py-3.5 pl-11 pr-4 text-sm text-[#123b50] outline-none transition placeholder:text-gray-400 focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="doctor-password"
                  className="mb-2 block text-sm font-semibold text-[#123b50]"
                >
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={18}
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="doctor-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#dceaf1] bg-white py-3.5 pl-11 pr-12 text-sm text-[#123b50] outline-none transition placeholder:text-gray-400 focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:text-[#16587b] focus:outline-none focus:ring-2 focus:ring-[#16587b]/30 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16587b] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#123b50] focus:outline-none focus:ring-4 focus:ring-[#16587b]/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Secure Login
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-gray-500">
              Authorized hospital doctors only. Your credentials are verified
              by City Hospital&apos;s server.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
