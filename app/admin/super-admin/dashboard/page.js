"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, Stethoscope, UserRound, BedDouble, RefreshCw, ArrowUpRight, Clock3 } from "lucide-react";
import AdminShell, { adminFetch, Alert, Panel, secondaryButton } from "../_components/AdminShell";

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [overview, setOverview] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  async function load() {
    setError(""); setLoading(true);
    try {
      const [o, a] = await Promise.all([adminFetch("/api/admin/overview"), adminFetch("/api/admin/appointments/today")]);
      setOverview(o.overview); setAppointments(a.appointments || []);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  const cards = [
    { label: "Total Patients", value: overview?.patients, icon: Users, href: "/admin/super-admin/patients", hint: "Open patient records" },
    { label: "Total Doctors", value: overview?.doctors, icon: Stethoscope, href: "/admin/super-admin/doctors", hint: "Manage doctor accounts" },
    { label: "Reception Staff", value: overview?.staff, icon: UserRound, href: "/admin/super-admin/staff", hint: "Manage staff accounts" },
    { label: "Admitted Patients", value: overview?.admittedPatients, icon: BedDouble, href: "/admin/super-admin/admissions", hint: "View inpatient list" },
  ];
  return <AdminShell title="Hospital Dashboard"
   subtitle="A clear overview of hospital operations and today's OPD schedule." actions={<button onClick={load} className={secondaryButton}><RefreshCw size={16}/> Refresh</button>}>
    <Alert error={error}/>
    <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, href, hint }) => <button key={label} onClick={() => router.push(href)} className="group rounded-lg border-2 border-[#d7e2e8] bg-white p-5 text-left shadow-sm transition hover:border-[#222b60] hover:shadow-md"><div className="flex items-start justify-between gap-2"><span className="flex h-11 w-11 items-center justify-center rounded-md border border-[#c2cbf0] bg-[#d9e0ea] text-[#040404]"><Icon size={22}/></span><ArrowUpRight size={18} className="text-gray-400 group-hover:text-[#1f0a5c]"/></div><p className="mt-4 text-sm font-bold text-[#526b79]">{label}</p><p className="mt-1 text-2xl font-extrabold text-[#283854]">{loading ? "—" : (value ?? 0)}</p><p className="mt-2 text-xs font-semibold text-[#16587b]">{hint}</p></button>)}</div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,.8fr)]">
      <Panel title="Today's Appointments" description={`${appointments.length} appointment${appointments.length === 1 ? "" : "s"} scheduled for today`} actions={<button className={secondaryButton} onClick={() => router.push("/admin/super-admin/appointments")}>View all <ArrowUpRight size={15}/></button>}>
        {loading ? <p className="py-8 text-center font-semibold text-gray-500">Loading appointments…</p> : appointments.length ? <div className="overflow-x-auto"><table className="w-full min-w-[550px] text-left text-sm"><thead><tr className="border-b-2 border-[#a9002d] bg-[#fff1f4] text-xs font-extrabold uppercase text-[#a9002d]"><th className="px-3 py-3">Time</th><th className="px-3 py-3">Patient</th><th className="px-3 py-3">Doctor</th><th className="px-3 py-3">Status</th></tr></thead><tbody>{appointments.slice(0, 8).map(a => <tr key={a._id} className="border-b border-[#e3ebef]"><td className="px-3 py-3 font-bold"><span className="inline-flex items-center gap-2"><Clock3 size={14} className="text-[#00a919]"/>{a.appointmentTime || "—"}</span></td><td className="px-3 py-3 font-bold text-[#16587b]">{a.patientId?.name || "Unknown patient"}<span className="block text-xs font-medium text-gray-500">{a.patientId?.phone || ""}</span></td><td className="px-3 py-3">{a.doctorId?.name || "—"}</td><td className="px-3 py-3"><span className="rounded border border-[#d7e2e8] px-2 py-1 text-xs font-bold">{String(a.status || "BOOKED").replaceAll("_", " ")}</span></td></tr>)}</tbody></table></div> : <div className="py-10 text-center"><CalendarDays className="mx-auto mb-2 text-gray-400" size={28}/><p className="font-bold text-gray-600">No appointments scheduled for today.</p></div>}
      </Panel>
      <Panel title="Quick Actions" description="Open a management section"><div className="grid gap-2">{[["Register admission", "/admin/super-admin/admissions", BedDouble], ["Add doctor", "/admin/super-admin/doctors/add", Stethoscope], ["Add reception staff", "/admin/super-admin/staff/add", UserRound], ["View all patients", "/admin/super-admin/patients", Users]].map(([label, href, Icon]) => <button key={href} onClick={() => router.push(href)} className="flex items-center justify-between rounded-md border-2 border-[#d7e2e8] px-3 py-3 text-left font-bold text-[#16587b] hover:border-[#a9002d] hover:bg-[#fff8f9] hover:text-[#a9002d]"><span className="flex items-center gap-3"><Icon size={18}/>{label}</span><ArrowUpRight size={16}/></button>)}</div></Panel>
    </div>
  </AdminShell>;
}
  