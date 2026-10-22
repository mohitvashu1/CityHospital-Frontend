"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Stethoscope, UserRound, CalendarDays, LogOut, ShieldCheck, UserPlus, RefreshCw } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [notice, setNotice] = useState("");

  async function loadData(token) {
    const headers = { Authorization: `Bearer ${token}` };
    const [overviewRes, usersRes] = await Promise.all([
      fetch(`${API_URL}/api/admin/overview`, { headers, cache: "no-store" }),
      fetch(`${API_URL}/api/admin/users`, { headers, cache: "no-store" }),
    ]);
    const overviewData = await overviewRes.json().catch(() => ({}));
    const usersData = await usersRes.json().catch(() => ({}));
    if (!overviewRes.ok) throw new Error(overviewData.message || "Unable to load dashboard");
    if (!usersRes.ok) throw new Error(usersData.message || "Unable to load users");
    setOverview(overviewData.overview);
    setUsers(usersData.users || []);
  }

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    const storedUser = sessionStorage.getItem("adminUser");
    if (!token) {
      router.replace("/admin/super-admin/login");
      return;
    }
    try {
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      if (parsed?.role !== "SUPER_ADMIN") {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUser");
        router.replace("/admin/super-admin/login");
        return;
      }
      setUser(parsed);
    } catch {
      router.replace("/admin/super-admin/login");
      return;
    }
    loadData(token).catch((err) => setError(err.message || "Unable to load data")).finally(() => setLoading(false));
  }, [router]);

  async function createStaff(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    const token = sessionStorage.getItem("adminToken");
    try {
      const response = await fetch(`${API_URL}/api/admin/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: staffName, email: staffEmail, password: staffPassword, role: "RECEPTIONIST" }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to create staff account");
      setNotice("Receptionist account created successfully.");
      setStaffName(""); setStaffEmail(""); setStaffPassword(""); setShowCreate(false);
      await loadData(token);
    } catch (err) {
      setError(err.message || "Unable to create staff account");
    }
  }

  function logout() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    router.replace("/admin/super-admin/login");
  }

  const stats = [
    { label: "Patients", value: overview?.patients ?? "—", icon: Users },
    { label: "Doctors", value: overview?.doctors ?? "—", icon: Stethoscope },
    { label: "Reception staff", value: overview?.staff ?? "—", icon: UserRound },
    { label: "Appointments", value: overview?.appointments ?? "—", icon: CalendarDays },
  ];

  return (
    <main className="min-h-screen bg-[#f7fafc] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dceaf1] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf3f8] text-[#16587b]"><ShieldCheck size={23} /></div><div><p className="text-xs font-semibold uppercase tracking-wider text-[#a9002d]">City Hospital</p><h1 className="text-xl font-semibold text-[#123b50]">Super Admin Dashboard</h1><p className="mt-0.5 text-sm text-gray-500">{user?.name || "Administrator"}</p></div></div>
          <div className="flex gap-2"><button onClick={() => { const t = sessionStorage.getItem("adminToken"); if (t) { setLoading(true); loadData(t).catch(e => setError(e.message)).finally(() => setLoading(false)); } }} className="inline-flex items-center gap-2 rounded-lg border border-[#dceaf1] px-3 py-2 text-sm text-[#16587b] hover:bg-[#f1f8fb]"><RefreshCw size={16} /> Refresh</button><button onClick={logout} className="inline-flex items-center gap-2 rounded-lg bg-[#16587b] px-3 py-2 text-sm font-medium text-white hover:bg-[#104661]"><LogOut size={16} /> Logout</button></div>
        </header>

        {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</p>}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-[#dceaf1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><p className="text-sm text-gray-600">{label}</p><span className="rounded-lg bg-[#eaf3f8] p-2 text-[#16587b]"><Icon size={19} /></span></div><p className="mt-3 text-3xl font-semibold text-[#123b50]">{loading ? "…" : value}</p></div>)}
        </section>

        <section className="mt-6 rounded-2xl border border-[#dceaf1] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-[#123b50]">Reception staff accounts</h2><p className="mt-1 text-sm text-gray-500">Create login accounts for reception staff. Passwords are hashed by the backend.</p></div><button onClick={() => setShowCreate(v => !v)} className="inline-flex items-center gap-2 rounded-lg bg-[#a9002d] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#870024]"><UserPlus size={17} /> Add staff</button></div>
          {showCreate && <form onSubmit={createStaff} className="mt-5 grid gap-3 rounded-xl bg-[#f7fafc] p-4 sm:grid-cols-2"><input required maxLength={100} value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="Staff full name" className="rounded-lg border border-[#dceaf1] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#16587b]" /><input required type="email" maxLength={254} value={staffEmail} onChange={e => setStaffEmail(e.target.value)} placeholder="Staff email" className="rounded-lg border border-[#dceaf1] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#16587b]" /><input required minLength={12} maxLength={128} type="password" value={staffPassword} onChange={e => setStaffPassword(e.target.value)} placeholder="Temporary password (12+ chars)" className="rounded-lg border border-[#dceaf1] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#16587b] sm:col-span-2" /><div className="flex gap-2 sm:col-span-2"><button className="rounded-lg bg-[#16587b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#104661]">Create account</button><button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-[#dceaf1] px-4 py-2 text-sm text-gray-600 hover:bg-white">Cancel</button></div></form>}
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead><tr className="border-b border-[#dceaf1] text-xs uppercase tracking-wide text-gray-500"><th className="px-3 py-3 font-medium">Name</th><th className="px-3 py-3 font-medium">Email</th><th className="px-3 py-3 font-medium">Role</th><th className="px-3 py-3 font-medium">Status</th></tr></thead><tbody>{users.map(item => <tr key={item._id} className="border-b border-[#edf3f6] last:border-0"><td className="px-3 py-3 font-medium text-[#123b50]">{item.name}</td><td className="px-3 py-3 text-gray-600">{item.email}</td><td className="px-3 py-3 text-gray-600">{item.role}</td><td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-xs ${item.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.active ? "Active" : "Inactive"}</span></td></tr>)}{!users.length && !loading && <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-500">No staff or doctor accounts found.</td></tr>}</tbody></table></div>
        </section>
      </div>
    </main>
  );
}
