
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  Stethoscope,
  UserRound,
  Users,
  BedDouble,
} from "lucide-react";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export function getAdminToken() {
  return typeof window !== "undefined"
    ? sessionStorage.getItem("adminToken")
    : null;
}

export async function adminFetch(path, options = {}) {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

const nav = [
  ["Dashboard", "/admin/super-admin/dashboard", LayoutDashboard],
  ["Patients", "/admin/super-admin/patients", Users],
  ["Doctors", "/admin/super-admin/doctors", Stethoscope],
  ["Reception Staff", "/admin/super-admin/staff", UserRound],
  ["Today's Appointments", "/admin/super-admin/appointments", CalendarDays],
  ["Admissions", "/admin/super-admin/admissions", BedDouble],
  ["Settings", "/admin/super-admin/settings", Settings],
];

export default function AdminShell({
  title,
  subtitle,
  children,
  actions,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");

    let parsed = null;

    try {
      parsed = JSON.parse(sessionStorage.getItem("adminUser") || "null");
    } catch {
      parsed = null;
    }

    if (!token || parsed?.role !== "SUPER_ADMIN") {
      router.replace("/admin/super-admin/login");
      return;
    }

    setAdmin(parsed);
  }, [router]);

  function logout() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    router.replace("/");
  }

  return (
    <main className="min-h-screen bg-[#f7fafc] text-[#123b50]">
      {/* Top Header */}
      <header className="border-b border-[#dceaf1] bg-white">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-7">
          {/* Real Hospital Logo */}
          <Link
            href="/admin/super-admin/dashboard"
            aria-label="City Hospital Admin Dashboard"
            className="flex shrink-0 items-center rounded-md focus:outline-none focus:ring-2 focus:ring-[#16587b]"
          >
            <Image
              src="/logo.png"
              alt="City Hospital"
              width={220}
              height={65}
              priority
              className="h-12 w-auto object-contain sm:h-14"
            />
          </Link>

          {/* Admin Details and Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-base font-medium text-[#123b50]">
                {admin?.name || "City Hospital Admin"}
              </p>

              <p className="text-xs font-medium tracking-wide text-[#a9002d]">
                SUPER ADMIN
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
className="inline-flex items-center gap-2 rounded-lg border border-[#16587b] bg-[#16587b] px-3.5 py-2.5 text-sm font-medium text-white transition hover:border-[#123b50] hover:bg-[#123b50]"            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Layout */}
      <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 sm:px-7 lg:grid-cols-[245px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="h-fit rounded-xl border border-[#dceaf1] bg-white p-3 shadow-sm">
          <p className="mb-2 px-3 py-2 text-[13px] font-medium uppercase tracking-[0.14em] text-[#0a1a64]">
            Hospital Management
          </p>

          <nav className="space-y-1">
            {nav.map(([label, href, Icon]) => {
              const active =
                pathname === href ||
                (href !== "/admin/super-admin/dashboard" &&
                  pathname.startsWith(`${href}/`));

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between rounded-md border px-3 py-3 text-sm font-bold transition ${
                    active
                      ? "border-[#dceaf1] bg-[#eaf3f8] text-[#16587b]"
                      : "border-transparent text-[#526b79] hover:border-[#dceaf1] hover:bg-[#f7fafc] hover:text-[#16587b]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {label}
                  </span>

                  {active && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>

          {/* Security Notice */}
          <div className="mt-5 rounded-lg border border-[#dceaf1] bg-[#f7fafc] p-3">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#16587b]">
              <Activity size={15} />
              Secure Workspace
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-600">
              Patient records are private. Access only for authorized hospital
              staff.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <section className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[#dceaf1] pb-5">
            <div>
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[.15em] text-[#a9002d]">
                City Hospital / Admin
              </p>

              <h1 className="text-2xl font-medium tracking-tight text-[#123b50] sm:text-3xl">
                {title}
              </h1>

              {subtitle && (
                <p className="mt-1 text-sm leading-6 text-[#526b79]">
                  {subtitle}
                </p>
              )}
            </div>

            {actions}
          </div>

          {children}
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#dceaf1] bg-white px-4 py-4 text-center text-xs text-gray-500">
        City Hospital, Buxar · Administration Portal
      </footer>
    </main>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-xl border border-[#dceaf1] bg-white shadow-sm ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dceaf1] px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-medium text-[#123b50]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>

        {actions}
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function Alert({ error, notice }) {
  return (
    <>
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {notice}
        </div>
      )}
    </>
  );
}

export const fieldClass =
  "w-full rounded-lg border border-[#dceaf1] bg-white px-3.5 py-2.5 text-sm text-[#123b50] outline-none transition focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10";

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[#16587b] bg-[#16587b] px-4 py-2.5 text-sm font-medium text-white transition hover:border-[#123b50] hover:bg-[#123b50]";

export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[#dceaf1] bg-white px-4 py-2.5 text-sm font-medium text-[#16587b] transition hover:border-[#84b3ce] hover:bg-[#eaf3f8]";

export function Table({
  columns,
  rows,
  empty = "No records found.",
  onRowClick,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#dceaf1]">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-[#f4f8fb]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b border-[#dceaf1] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#526b79]"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row._id || row.id || index}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-[#edf2f5] last:border-0 ${
                onRowClick
                  ? "cursor-pointer hover:bg-[#f7fafc]"
                  : ""
              }`}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3.5 font-normal text-[#254a5d]"
                >
                  {column.render
                    ? column.render(row)
                    : row[column.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}

          {!rows.length && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-gray-500"
              >
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
