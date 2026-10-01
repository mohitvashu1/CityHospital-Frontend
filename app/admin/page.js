
"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Stethoscope,
  ClipboardList,
  FlaskConical,
  Pill,
  ArrowLeft,
  LockKeyhole,
  UserRound,
  Eye,
  EyeOff,
} from "lucide-react";

const roles = [
  {
    id: "SUPER_ADMIN",
    title: "Super Admin",
    description: "Manage hospital operations and staff",
    icon: ShieldCheck,
    color: "text-red-700",
    bg: "bg-red-50",
    permissions: [
  "Manage doctors",
  "Manage staff",
  "Change / reset passwords of all users",
  "Manage user roles and access",
  "Manage medicines",
  "Manage tests",
  "View reports",
  "Manage hospital settings",
],
  },
  {
    id: "DOCTOR",
    title: "Doctor",
    description: "Patient consultations and prescriptions",
    icon: Stethoscope,
    color: "text-blue-700",
    bg: "bg-blue-50",
    permissions: [
      "View assigned appointments",
      "View patient history",
      "Add diagnosis",
      "Add investigations",
      "Add medicines and advice",
      "Create prescriptions",
    ],
  },
  {
    id: "RECEPTIONIST",
    title: "Receptionist",
    description: "Patient registration and appointment desk",
    icon: ClipboardList,
    color: "text-green-700",
    bg: "bg-green-50",
    permissions: [
      "Register patients",
      "Book appointments",
      "View basic patient information",
      "Print finalized prescriptions",
    ],
  },
  {
    id: "LAB_STAFF",
    title: "Lab Staff",
    description: "Investigations and laboratory reports",
    icon: FlaskConical,
    color: "text-purple-700",
    bg: "bg-purple-50",
    permissions: [
      "View requested tests",
      "Enter test results",
      "Upload reports",
    ],
  },
  {
    id: "PHARMACY",
    title: "Pharmacy",
    description: "Prescription dispensing and medicine counter",
    icon: Pill,
    color: "text-orange-700",
    bg: "bg-orange-50",
    permissions: [
      "View authorized prescriptions",
      "Manage dispensing",
      "Manage inventory, if enabled",
    ],
  },
];

export default function AdminPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const selected = roles.find((role) => role.id === selectedRole);

  function handleLogin(e) {
    e.preventDefault();
    setMessage(
      "Login is not connected yet. Backend authentication will be added later."
    );
  }

  function chooseRole(roleId) {
    setSelectedRole(roleId);
    setMessage("");
    setUserId("");
    setPassword("");
  }

  return (
    <main className="min-h-screen bg-[#f7fafc] px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#16587b] text-white shadow-lg">
            <ShieldCheck size={34} />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#a9002d]">
            City Hospital
          </p>

          <h1 className="text-3xl font-bold text-[#123b50] sm:text-4xl">
            Staff & Admin Portal
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
            Select your portal to securely access your hospital workspace.
          </p>
        </div>

        {!selectedRole ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => chooseRole(role.id)}
                  className="group rounded-2xl border border-[#dceaf1] bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#16587b] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#16587b]"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${role.bg} ${role.color}`}
                  >
                    <Icon size={28} />
                  </div>

                  <h2 className="text-xl font-bold text-[#123b50]">
                    {role.title}
                  </h2>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
                    {role.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#dceaf1] pt-4">
                    <span className="text-sm font-semibold text-[#16587b]">
                      Continue to login
                    </span>
                    <span className="text-xl text-[#16587b] transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-xl md:grid-cols-2">
            <section className="bg-[#16587b] p-7 text-white sm:p-9">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="mb-10 inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
              >
                <ArrowLeft size={17} />
                Change portal
              </button>

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                {selected && <selected.icon size={32} />}
              </div>

              <p className="text-sm font-medium uppercase tracking-widest text-white/70">
                City Hospital
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {selected?.title} Login
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/80">
                Sign in with your authorized account to access your portal.
              </p>

              <div className="mt-9 border-t border-white/20 pt-6">
                <h3 className="mb-4 font-semibold">Portal access</h3>
                <ul className="space-y-3">
                  {selected?.permissions.map((permission) => (
                    <li
                      key={permission}
                      className="flex items-start gap-2 text-sm text-white/85"
                    >
                      <span className="mt-0.5">✓</span>
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="p-7 sm:p-9">
              <div className="mb-7">
                <h3 className="text-2xl font-bold text-[#123b50]">
                  Welcome back
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your credentials to continue.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label
                    htmlFor="userId"
                    className="mb-2 block text-sm font-semibold text-[#123b50]"
                  >
                    User ID / Email / Phone
                  </label>
                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="userId"
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Enter your login ID"
                      autoComplete="username"
                      required
                      className="w-full rounded-xl border border-[#dceaf1] py-3 pl-10 pr-4 text-sm text-[#123b50] outline-none transition focus:border-[#16587b] focus:ring-2 focus:ring-[#16587b]/15"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-[#123b50]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-[#dceaf1] py-3 pl-10 pr-12 text-sm text-[#123b50] outline-none transition focus:border-[#16587b] focus:ring-2 focus:ring-[#16587b]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#16587b]"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {message && (
                  <p
                    role="status"
                    className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16587b] px-5 py-3.5 font-semibold text-white transition hover:bg-[#123b50] focus:outline-none focus:ring-2 focus:ring-[#16587b] focus:ring-offset-2"
                >
                  Secure Login
                  <span>→</span>
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-gray-500">
                Authorized hospital staff only. Your access will be verified
                by the server.
              </p>
            </section>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} City Hospital. All rights reserved.
        </p>
      </div>
    </main>
  );
}