  "use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, CalendarDays, ChevronRight, ClipboardList, LayoutDashboard, LogOut, Settings, ShieldCheck, Stethoscope, UserRound, Users, BedDouble } from "lucide-react";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
export function getAdminToken() { return typeof window !== "undefined" ? sessionStorage.getItem("adminToken") : null; }
export async function adminFetch(path, options = {}) {
  const token = getAdminToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
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

export default function AdminShell({ title, subtitle, children, actions }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    let parsed = null;
    try { parsed = JSON.parse(sessionStorage.getItem("adminUser") || "null"); } catch {}
    if (!token || parsed?.role !== "SUPER_ADMIN") { router.replace("/admin/super-admin/login"); return; }
    setAdmin(parsed);
  }, [router]);
  function logout() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    router.replace("/admin/super-admin/login");
  }
  return (
    <main className="min-h-screen bg-[#f5f8fa] text-[#123b50]">
      <header className="border-b-2 border-[#a9002d] bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-7">
          <Link href="/admin/super-admin/dashboard" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#a9002d] bg-white text-[#a9002d]"><ShieldCheck size={27}/></span>
            <span><span className="block text-md font-extrabold uppercase tracking-[.18em] text-[#202676]">City Hospital · Buxar</span><span className="block text-xl font-extrabold leading-tight text-[#123b50]">Administration</span></span>
          </Link>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-bold">{admin?.name || "Super Admin"}</p><p className="text-xs font-semibold text-[#a9002d]">SUPER ADMIN</p></div><button onClick={logout} className="inline-flex items-center gap-2 rounded-md border-2 border-[#a9002d] px-3 py-2 text-sm font-bold text-[#a9002d] hover:bg-[#a9002d] hover:text-white"><LogOut size={16}/> Logout</button></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 sm:px-7 lg:grid-cols-[245px_minmax(0,1fr)]">
        <aside className="h-fit rounded-lg border-2 border-[#d7e2e8] bg-white p-3 shadow-sm">
          <p className="mb-2 px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-[#a9002d]">Hospital management</p>
          <nav className="space-y-1">{nav.map(([label, href, Icon]) => {
            const active = pathname === href || (href !== "/admin/super-admin/dashboard" && pathname.startsWith(href + "/"));
            return <Link key={href} href={href} className={`flex items-center justify-between rounded-md border px-3 py-3 text-sm font-bold transition ${active ? "border-[#a9002d] bg-[#fff1f4] text-[#a9002d]" : "border-transparent text-[#254a5d] hover:border-[#d7e2e8] hover:bg-[#f5f8fa]"}`}><span className="flex items-center gap-3"><Icon size={18}/>{label}</span>{active && <ChevronRight size={16}/>}</Link>;
          })}</nav>
          <div className="mt-5 rounded-md border border-[#d7e2e8] bg-[#f7fafc] p-3"><p className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#16587b]"><Activity size={15}/> Secure workspace</p><p className="mt-1 text-xs leading-5 text-gray-600">Patient records are private. Access only for authorized hospital staff.</p></div>
        </aside>
        <section className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b-2 border-[#a9002d] pb-4"><div><p className="mb-1 text-xs font-extrabold uppercase tracking-[.16em] text-[#a9002d]">City Hospital / Admin</p><h1 className="text-2xl font-extrabold text-[#123b50 ] sm:text-3xl">{title}</h1>{subtitle && <p className="mt-1 text-sm font-medium text-[#526b79]">{subtitle}</p>}</div>{actions}</div>
          {children}
        </section>
      </div>
      <footer className="border-t border-[#d7e2e8] bg-white px-4 py-4 text-center text-xs font-semibold text-gray-500">City Hospital, Buxar · Administration Portal</footer>
    </main>
  );
}

export function Panel({ title, description, actions, children, className = "" }) {
  return <section className={`rounded-lg border-2 border-[#d7e2e8] bg-white shadow-sm ${className}`}><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d7e2e8] px-4 py-4 sm:px-5"><div><h2 className="text-lg font-extrabold text-[#a9002d]">{title}</h2>{description && <p className="mt-1 text-sm text-gray-600">{description}</p>}</div>{actions}</div><div className="p-4 sm:p-5">{children}</div></section>;
}
export function Alert({ error, notice }) { return <>{error && <div role="alert" className="mb-4 rounded-md border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">{error}</div>}{notice && <div role="status" className="mb-4 rounded-md border-2 border-green-300 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">{notice}</div>}</>; }
export const fieldClass = "w-full rounded-md border-2 border-[#d7e2e8] bg-white px-3 py-2.5 text-sm text-[#123b50] outline-none focus:border-[#a9002d] focus:ring-2 focus:ring-[#a9002d]/10";
export const primaryButton = "inline-flex items-center justify-center gap-2 rounded-md border-2 border-[#a9002d] bg-[#a9002d] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#870024]";
export const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-md border-2 border-[#16587b] bg-white px-4 py-2.5 text-sm font-extrabold text-[#16587b] transition hover:bg-[#edf6fa]";
export function Table({ columns, rows, empty = "No records found.", onRowClick }) {
  return <div className="overflow-x-auto rounded-md border border-[#d7e2e8]"><table className="w-full min-w-[640px] border-collapse text-left text-sm"><thead className="bg-[#fff1f4]"><tr>{columns.map(c => <th key={c.key} className="border-b-2 border-[#a9002d] px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-[#a9002d]">{c.label}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={row._id || row.id || i} onClick={onRowClick ? () => onRowClick(row) : undefined} className={`border-b border-[#e3ebef] last:border-0 ${onRowClick ? "cursor-pointer hover:bg-[#fff8f9]" : ""}`}>{columns.map(c => <td key={c.key} className="px-4 py-3.5 font-medium text-[#254a5d]">{c.render ? c.render(row) : (row[c.key] ?? "—")}</td>)}</tr>)}{!rows.length && <tr><td colSpan={columns.length} className="px-4 py-10 text-center font-semibold text-gray-500">{empty}</td></tr>}</tbody></table></div>;
}
