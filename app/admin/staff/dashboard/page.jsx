"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, CalendarDays, CheckCircle2, Clock3, LogOut, RefreshCw, Search, Users, UserRound, Phone, Hash, AlertCircle, ClipboardList, Stethoscope, ChevronRight } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
const BLUE = "#16587b";

function formatTime(value) {
  if (!value) return "—";
  if (/^\d{1,2}:\d{2}/.test(String(value))) return String(value);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function statusStyle(status) {
  const s = String(status || "BOOKED").toUpperCase();
  if (s === "COMPLETED") return "bg-emerald-50 text-emerald-700";
  if (s === "IN_CONSULTATION") return "bg-blue-50 text-blue-700";
  if (s === "CANCELLED") return "bg-red-50 text-red-700";
  if (s === "WAITING") return "bg-amber-50 text-amber-800";
  return "bg-slate-100 text-slate-700";
}

export default function StaffDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("appointments");
  const [loading, setLoading] = useState(true);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date().toLocaleDateString("en-CA"));
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [feeFilter, setFeeFilter] = useState("ALL");

  const token = () => typeof window !== "undefined" ? sessionStorage.getItem("staffToken") : null;

  const loadAppointments = useCallback(async () => {
    const currentToken = typeof window !== "undefined" ? sessionStorage.getItem("staffToken") : null;
    if (!currentToken) { router.replace("/admin/staff/login"); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch(`${API_URL}/api/staff/appointments?date=${encodeURIComponent(dateFilter)}`, { headers: { Authorization: `Bearer ${currentToken}`, Accept: "application/json" }, cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) { sessionStorage.removeItem("staffToken"); sessionStorage.removeItem("staffUser"); router.replace("/admin/staff/login"); return; }
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load today's appointments.");
      setAppointments(Array.isArray(data.appointments) ? data.appointments : []);
      try { setUser(JSON.parse(sessionStorage.getItem("staffUser") || "null")); } catch { setUser(null); }
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load appointments."); }
    finally { setLoading(false); }
  }, [router, dateFilter]);

  const loadPatients = useCallback(async (term = "") => {
    const currentToken = typeof window !== "undefined" ? sessionStorage.getItem("staffToken") : null;
    if (!currentToken) return;
    setPatientsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/staff/patients?q=${encodeURIComponent(term)}`, { headers: { Authorization: `Bearer ${currentToken}`, Accept: "application/json" }, cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load patient records.");
      setPatients(Array.isArray(data.patients) ? data.patients : []);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load patients."); }
    finally { setPatientsLoading(false); }
  }, []);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);
  useEffect(() => { if (tab === "patients") loadPatients(search); }, [tab, search, loadPatients]);

  const filteredAppointments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (tab !== "appointments") return appointments;
    return appointments.filter(a => {
      const p = a.patientId && typeof a.patientId === "object" ? a.patientId : {};
      const appointmentDate = a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString("en-CA") : "";
      const matchesSearch = !q || [p.name, p.phone, a.appointmentId, a.appointmentTime, a.status, a.doctorId?.name].some(v => String(v ?? "").toLowerCase().includes(q));
      const matchesDate = !dateFilter || appointmentDate === dateFilter;
      const matchesStatus = statusFilter === "ALL" || String(a.status || "BOOKED").toUpperCase() === statusFilter;
      const matchesFee = feeFilter === "ALL" || String(a.feePayment?.status || "NOT_PAID").toUpperCase() === feeFilter;
      return matchesSearch && matchesDate && matchesStatus && matchesFee;
    });
  }, [appointments, search, tab, dateFilter, statusFilter, feeFilter]);

  async function updateStatus(appointmentId, status) {
    setBusyId(appointmentId); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/api/staff/appointments/${encodeURIComponent(appointmentId)}/status`, { method: "PATCH", headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ status }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message || "Could not update appointment.");
      setNotice(`Appointment updated to ${status.replaceAll("_", " ")}.`);
      await loadAppointments();
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to update appointment."); }
    finally { setBusyId(""); }
  }

  async function markFeePaid(appointment) {
    const id = appointment?._id || appointment?.id;
    if (!id) return;
    const currentAmount = Number(appointment?.feePayment?.amount || appointment?.feeAmount || 0);
    const amountInput = window.prompt("Enter OPD fee amount received (INR):", currentAmount > 0 ? String(currentAmount) : "");
    if (amountInput === null) return;
    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid fee amount greater than ₹0.");
      return;
    }
    const methodInput = window.prompt("Payment method: CASH, UPI, CARD", "CASH");
    if (methodInput === null) return;
    const method = methodInput.trim().toUpperCase();
    if (!["CASH", "UPI", "CARD"].includes(method)) {
      setError("Payment method must be CASH, UPI, or CARD.");
      return;
    }
    setBusyId(id); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/api/staff/appointments/${encodeURIComponent(id)}/fee`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ status: "PAID", amount, method }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message || "Could not record fee payment.");
      setNotice(`Fee recorded as paid: ₹${amount.toFixed(2)} via ${method}.`);
      await loadAppointments();
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to record payment."); }
    finally { setBusyId(""); }
  }

  function logout() { sessionStorage.removeItem("staffToken"); sessionStorage.removeItem("staffUser"); router.replace("/admin/staff/login"); }

  const waiting = appointments.filter(a => ["BOOKED", "WAITING"].includes(String(a.status || "BOOKED").toUpperCase())).length;
  const completed = appointments.filter(a => String(a.status || "").toUpperCase() === "COMPLETED").length;

  return (
    <main className="min-h-screen bg-[#f7fafc] text-[#123b50]">
      <header className="sticky top-0 z-20 border-b border-[#dceaf1] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-7">
          <div className="flex min-w-0 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#16587b] text-white"><ClipboardList size={23}/></div><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#a9002d]">City Hospital · Buxar</p><p className="font-bold">Reception Staff Portal</p></div></div>
          <div className="flex items-center gap-2"><button type="button" onClick={loadAppointments} disabled={loading} className="inline-flex items-center gap-2 rounded-md border-2 border-[#16587b] px-3 py-2 text-sm font-bold text-[#16587b] hover:bg-[#eaf3f8] disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""}/><span className="hidden sm:inline">Refresh</span></button><button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-md border-2 border-[#16587b] bg-[#16587b] px-3 py-2 text-sm font-bold text-white hover:bg-[#123b50]"><LogOut size={16}/><span className="hidden sm:inline">Logout</span></button></div>
        </div>
      </header>
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7">
        <section className="mb-6 flex flex-col justify-between gap-4 rounded-xl bg-[#16587b] p-6 text-white sm:flex-row sm:items-center"><div><p className="text-sm text-white/75">Staff dashboard</p><h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Welcome, {user?.name || "Reception Staff"}</h1><p className="mt-2 text-sm text-white/85">Manage the reception queue and basic patient lookup.</p></div><div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm"><CalendarDays size={18}/>{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div></section>
        {error && <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border-2 border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0"/>{error}</div>}
        {notice && <div role="status" className="mb-4 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{notice}</div>}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={CalendarDays} label="Today's appointments" value={loading ? "—" : appointments.length} hint="All appointments scheduled today"/>
          <Metric icon={Clock3} label="Waiting / booked" value={loading ? "—" : waiting} hint="Patients awaiting reception / OPD"/>
          <Metric icon={CheckCircle2} label="Completed" value={loading ? "—" : completed} hint="Visits completed today"/>
          <Metric icon={Users} label="Fee pending" value={loading ? "—" : appointments.filter(a => String(a.feePayment?.status || "NOT_PAID").toUpperCase() !== "PAID").length} hint="Appointments with unpaid OPD fee"/>
        </section>
        <section className="overflow-hidden rounded-xl border-2 border-[#d7e2e8] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#d7e2e8] p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-extrabold">Reception workspace</h2><p className="mt-1 text-sm text-slate-600">Use appointment queue for today's visits or search patient records.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => router.push("/admin/staff/book-appointment")} className="rounded-md border-2 border-[#16587b] px-3 py-2 text-sm font-bold text-[#16587b] hover:bg-[#eaf3f8]">+ Book appointment</button><button onClick={() => router.push("/admin/staff/admissions")} className="rounded-md border-2 border-[#16587b] px-3 py-2 text-sm font-bold text-[#16587b] hover:bg-[#eaf3f8]">Admit patient</button><button onClick={() => { setTab("appointments"); setSearch(""); }} className={`rounded-md border-2 px-3 py-2 text-sm font-bold ${tab === "appointments" ? "border-[#16587b] bg-[#16587b] text-white" : "border-[#dceaf1] text-[#16587b] hover:bg-[#eaf3f8]"}`}><CalendarDays size={15} className="mr-1 inline"/>Appointments</button><button onClick={() => { setTab("patients"); setSearch(""); }} className={`rounded-md border-2 px-3 py-2 text-sm font-bold ${tab === "patients" ? "border-[#16587b] bg-[#16587b] text-white" : "border-[#dceaf1] text-[#16587b] hover:bg-[#eaf3f8]"}`}><Users size={15} className="mr-1 inline"/>Patients</button></div></div>
          <div className="border-b border-[#d7e2e8] p-4"><div className="relative max-w-xl"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder={tab === "appointments" ? "Search patient, phone, appointment ID, doctor..." : "Search patient name or phone..."} className="w-full rounded-lg border-2 border-[#dceaf1] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10"/></div>
            {tab === "appointments" && <div className="mt-3 flex flex-wrap gap-3">
              <label className="text-xs font-semibold text-slate-600">Date <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="ml-2 rounded-md border border-[#dceaf1] p-2 text-sm text-[#123b50]"/></label>
              <label className="text-xs font-semibold text-slate-600">Visit status <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="ml-2 rounded-md border border-[#dceaf1] p-2 text-sm text-[#123b50]"><option value="ALL">All statuses</option><option value="BOOKED">Booked</option><option value="WAITING">Waiting</option><option value="IN_CONSULTATION">In consultation</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select></label>
              <label className="text-xs font-semibold text-slate-600">OPD fee <select value={feeFilter} onChange={e => setFeeFilter(e.target.value)} className="ml-2 rounded-md border border-[#dceaf1] p-2 text-sm text-[#123b50]"><option value="ALL">All fees</option><option value="NOT_PAID">Not paid</option><option value="PAID">Paid</option></select></label>
              <button onClick={() => { setDateFilter(""); setStatusFilter("ALL"); setFeeFilter("ALL"); setSearch(""); }} className="rounded-md border border-[#dceaf1] px-3 py-2 text-xs font-bold text-[#16587b]">Clear filters</button>
            </div>}
          </div>
          {tab === "appointments" ? loading ? <Loading/> : filteredAppointments.length === 0 ? <Empty title="No appointments found" text="Today's appointments will appear here when scheduled."/> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#f7fafc] text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Patient</th><th className="px-5 py-3">Appointment</th><th className="px-5 py-3">Doctor</th><th className="px-5 py-3">Time</th><th className="px-5 py-3">Visit status</th><th className="px-5 py-3">OPD fee</th><th className="px-5 py-3">Reception actions</th></tr></thead><tbody className="divide-y divide-[#e6eef2]">{filteredAppointments.map((a, i) => { const patient = a.patientId && typeof a.patientId === "object" ? a.patientId : {}; const doctor = a.doctorId && typeof a.doctorId === "object" ? a.doctorId : {}; const status = String(a.status || "BOOKED").toUpperCase(); const id = a._id || a.id; return <tr key={id || i} className="hover:bg-[#fbfdfe]"><td className="px-5 py-4"><p className="font-bold">{patient.name || "Patient"}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Phone size={12}/>{patient.phone || "Phone not available"}</p></td><td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-slate-600"><Hash size={13}/>{a.appointmentId || "—"}</span></td><td className="px-5 py-4"><span className="inline-flex items-center gap-2"><Stethoscope size={15} className="text-[#16587b]"/>{doctor.name || "Not assigned"}</span><p className="mt-1 text-xs text-slate-500">{doctor.specialization || ""}</p></td><td className="px-5 py-4">{formatTime(a.appointmentTime)}</td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(status)}`}>{status.replaceAll("_", " ")}</span></td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${String(a.feePayment?.status || "NOT_PAID").toUpperCase() === "PAID" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>{String(a.feePayment?.status || "NOT_PAID").toUpperCase() === "PAID" ? "PAID" : "NOT PAID"}</span><p className="mt-1 text-xs text-slate-500">{a.feePayment?.status === "PAID" ? `₹${Number(a.feePayment?.amount || 0).toFixed(2)} · ${a.feePayment?.method || "—"}` : "OPD fee pending"}</p></td><td className="px-5 py-4"><div className="flex flex-wrap gap-2">{status === "BOOKED" && <button disabled={busyId === id} onClick={() => updateStatus(id, "WAITING")} className="rounded-md bg-[#16587b] px-3 py-2 text-xs font-bold text-white hover:bg-[#123b50] disabled:opacity-50">{busyId === id ? "Updating…" : "Mark waiting"}</button>}{String(a.feePayment?.status || "NOT_PAID").toUpperCase() !== "PAID" ? <button disabled={busyId === id} onClick={() => markFeePaid(a)} className="rounded-md border border-emerald-600 bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">{busyId === id ? "Saving…" : "Mark fee paid"}</button> : <span className="text-xs font-semibold text-emerald-700">Payment recorded</span>}</div></td></tr>; })}</tbody></table></div> : patientsLoading ? <Loading/> : patients.length === 0 ? <Empty title="No patient records found" text="Try searching by another name or phone number."/> : <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-[#f7fafc] text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Patient</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Gender</th><th className="px-5 py-3">Registered</th></tr></thead><tbody className="divide-y divide-[#e6eef2]">{patients.map((p, i) => <tr key={p._id || i} className="hover:bg-[#fbfdfe]"><td className="px-5 py-4"><span className="flex items-center gap-2 font-bold"><UserRound size={16} className="text-[#16587b]"/>{p.name || "—"}</span></td><td className="px-5 py-4">{p.phone || "—"}</td><td className="px-5 py-4">{p.gender || "—"}</td><td className="px-5 py-4">{p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "—"} <button onClick={() => router.push(`/admin/staff/patients/${p._id}`)} className="ml-3 rounded-md border border-[#16587b] px-2 py-1 text-xs font-bold text-[#16587b] hover:bg-[#eaf3f8]">View patient</button></td></tr>)}</tbody></table></div>}
        </section>
        <p className="mt-5 text-center text-xs text-slate-500">City Hospital · Authorized reception access only</p>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value, hint }) { return <div className="rounded-xl border-2 border-[#d7e2e8] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-slate-600">{label}</p><p className="mt-2 text-3xl font-extrabold text-[#123b50]">{value}</p></div><span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eaf3f8] text-[#16587b]"><Icon size={21}/></span></div><p className="mt-2 text-xs text-slate-500">{hint}</p></div>; }
function Loading() { return <div className="flex items-center justify-center gap-2 px-5 py-14 text-sm text-slate-500"><RefreshCw size={17} className="animate-spin"/>Loading records…</div>; }
function Empty({ title, text }) { return <div className="px-5 py-14 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf3f8] text-[#16587b]"><ChevronRight size={23}/></div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm text-slate-500">{text}</p></div>; }
