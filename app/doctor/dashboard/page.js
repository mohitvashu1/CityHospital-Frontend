"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  LogOut,
  RefreshCw,
  Search,
  Stethoscope,
  UserRound,
  Users,
  X,
  AlertCircle,
  Phone,
  Hash,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function getPatientId(item) {
  const patient = item?.patient || item?.patientId;
  if (typeof patient === "string") return patient;
  return firstValue(patient?._id, patient?.id, item?.patient?._id, item?.patient?._id);
}

function getPatient(item) {
  if (item?.patient && typeof item.patient === "object") return item.patient;
  if (item?.patientDetails && typeof item.patientDetails === "object") return item.patientDetails;
  return {};
}

function formatTime(value) {
  if (!value) return "Time not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function getAppointmentDate(item) {
  return firstValue(item?.appointmentDate, item?.date, item?.scheduledAt, item?.createdAt);
}

function getAppointmentTime(item) {
  return firstValue(item?.appointmentTime, item?.time, item?.scheduledAt, item?.appointmentDate);
}

function statusClass(status) {
  const value = String(status || "PENDING").toUpperCase();
  if (["COMPLETED", "DONE"].includes(value)) return "bg-emerald-50 text-emerald-700";
  if (["CONFIRMED", "APPROVED"].includes(value)) return "bg-blue-50 text-blue-700";
  if (["CANCELLED", "CANCELED", "REJECTED"].includes(value)) return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const loadAppointments = useCallback(async () => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("doctorToken") : null;
    if (!token) {
      router.replace("/doctor/login");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctor/appointments/today`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("doctorToken");
        sessionStorage.removeItem("doctorUser");
        sessionStorage.removeItem("doctor");
        router.replace("/doctor/login");
        return;
      }
      if (!response.ok || data.success === false) {
        throw new Error(data.message || `Could not load appointments (${response.status}).`);
      }

      const list = Array.isArray(data)
        ? data
        : firstValue(data.appointments, data.data?.appointments, data.data, data.results, []);
      setAppointments(Array.isArray(list) ? list : []);
      const storedDoctor = sessionStorage.getItem("doctor");
      if (storedDoctor) {
        try { setDoctor(JSON.parse(storedDoctor)); } catch { setDoctor(null); }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load today's appointments.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const filteredAppointments = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return appointments;
    return appointments.filter((item) => {
      const patient = getPatient(item);
      const values = [
        patient.name, patient.fullName, patient.phone, patient.mobile,
        patient.patientId, patient.uhid, item.patientName, item.patientPhone,
        item.phone, item.mobile, item.patientId, item.uhid, item.tokenNumber,
        item.appointmentNumber, item._id,
      ];
      return values.some((value) => String(value ?? "").toLowerCase().includes(term));
    });
  }, [appointments, query]);

  async function openHistory(appointment) {
    const patientId = getPatientId(appointment);
    if (!patientId) {
      setSelectedAppointment(appointment);
      setPatientHistory(null);
      setHistoryError("Patient ID is not included in this appointment response, so history cannot be requested yet.");
      return;
    }
    const token = sessionStorage.getItem("doctorToken");
    setSelectedAppointment(appointment);
    setPatientHistory(null);
    setHistoryError("");
    setHistoryLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/doctor/patients/${encodeURIComponent(patientId)}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, cache: "no-store" }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        throw new Error(data.message || `Could not load patient history (${response.status}).`);
      }
      setPatientHistory(data.patient || data.data?.patient || data.data || data);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : "Unable to load patient history.");
    } finally {
      setHistoryLoading(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("doctorToken");
    sessionStorage.removeItem("doctorUser");
    sessionStorage.removeItem("doctor");
    router.replace("/doctor/login");
  }

  const completedCount = appointments.filter((item) =>
    ["COMPLETED", "DONE"].includes(String(item.status || "").toUpperCase())
  ).length;
  const pendingCount = appointments.filter((item) =>
    !["COMPLETED", "DONE", "CANCELLED", "CANCELED"].includes(String(item.status || "").toUpperCase())
  ).length;
  const doctorName = doctor?.name || "Doctor";
  const specialization = doctor?.specialization || doctor?.department || "Medical team";

  return (
    <main className="min-h-screen bg-[#f7fafc] text-[#123b50]">
      <header className="sticky top-0 z-20 border-b border-[#dceaf1] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16587b] text-white">
              <Stethoscope size={23} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a9002d]">City Hospital · Buxar</p>
              <p className="font-bold text-[#123b50]">Doctor Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAppointments} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#dceaf1] px-3 py-2 text-sm font-semibold hover:bg-[#f7fafc] disabled:opacity-60">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <section className="mb-7 flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#16587b] to-[#20769b] p-6 text-white shadow-sm sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-sm font-medium text-white/75">Doctor dashboard</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome, {doctorName}</h1>
            <p className="mt-2 text-sm text-white/80">{specialization} · Manage your appointments and patient visits.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-3 sm:self-auto">
            <CalendarDays size={19} />
            <span className="text-sm font-semibold">{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </section>

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Today's appointments" value={loading ? "—" : appointments.length} helper="Appointments returned by server" />
          <StatCard icon={Clock3} label="Pending / in progress" value={loading ? "—" : pendingCount} helper="Based on appointment status" />
          <StatCard icon={CheckCircle2} label="Completed" value={loading ? "—" : completedCount} helper="Marked completed in records" />
          <StatCard icon={Activity} label="Specialization" value={specialization} helper={doctor?.qualification || "Doctor profile"} compact />
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#dceaf1] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold">Today's appointments</h2>
              <p className="mt-1 text-sm text-gray-500">Search by patient name, phone, UHID, patient ID, or token.</p>
            </div>
            <div className="relative w-full sm:max-w-sm">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search today's queue..." className="w-full rounded-xl border border-[#dceaf1] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10" />
            </div>
          </div>

          {error && (
            <div className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div><p className="font-semibold">Could not load appointments</p><p className="mt-1">{error}</p><p className="mt-2 text-red-600">Check that the backend is running and the today-appointments endpoint returns JSON.</p></div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-gray-500"><RefreshCw size={18} className="animate-spin" /> Loading today's appointments…</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3f8] text-[#16587b]"><CalendarDays size={26} /></div>
              <h3 className="font-bold">{query ? "No matching appointments" : "No appointments found for today"}</h3>
              <p className="mt-2 text-sm text-gray-500">{query ? "Try a different patient name, phone number, or ID." : "When appointments are assigned to you for today, they will appear here."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#f7fafc] text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Patient</th>
                    <th className="px-6 py-4 font-semibold">Token / ID</th>
                    <th className="px-6 py-4 font-semibold">Appointment time</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf3f6]">
                  {filteredAppointments.map((item, index) => {
                    const patient = getPatient(item);
                    const name = firstValue(patient.name, patient.fullName, item.patientName, item.name, "Patient");
                    const phone = firstValue(patient.phone, patient.mobile, item.patientPhone, item.phone, item.mobile);
                    const tokenNumber = firstValue(item.tokenNumber, item.token, item.appointmentNumber, item.uhid, getPatientId(item), "—");
                    const status = firstValue(item.status, item.appointmentStatus, "PENDING");
                    return (
                      <tr key={item._id || item.id || `${tokenNumber}-${index}`} className="transition hover:bg-[#fbfdfe]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf3f8] font-bold text-[#16587b]"><UserRound size={19} /></div>
                            <div><p className="font-semibold text-[#123b50]">{name}</p>{phone && <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500"><Phone size={12} />{phone}</p>}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 text-gray-600"><Hash size={14} />{String(tokenNumber)}</span></td>
                        <td className="px-6 py-4"><span className="inline-flex items-center gap-2 text-gray-600"><Clock3 size={15} />{formatTime(getAppointmentTime(item) || getAppointmentDate(item))}</span></td>
                        <td className="px-6 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(status)}`}>{String(status).replaceAll("_", " ")}</span></td>
                        <td className="px-6 py-4 text-right"><button onClick={() => openHistory(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#dceaf1] px-3 py-2 font-semibold text-[#16587b] hover:bg-[#eaf3f8]">Patient history <ChevronRight size={15} /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-gray-400">City Hospital · Authorized clinical access only</p>
      </div>

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) { setSelectedAppointment(null); setPatientHistory(null); setHistoryError(""); } }}>
          <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#dceaf1] bg-white px-5 py-4 sm:px-6">
              <div><h2 className="font-bold">Patient history</h2><p className="mt-1 text-xs text-gray-500">{getPatient(selectedAppointment).name || selectedAppointment.patientName || "Selected patient"}</p></div>
              <button onClick={() => { setSelectedAppointment(null); setPatientHistory(null); setHistoryError(""); }} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close patient history"><X size={20} /></button>
            </div>
            <div className="p-5 sm:p-6">
              {historyLoading ? <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500"><RefreshCw size={17} className="animate-spin" /> Loading patient history…</div> : historyError ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{historyError}</div> : patientHistory ? (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Info label="Patient name" value={firstValue(patientHistory.name, patientHistory.fullName, getPatient(selectedAppointment).name, selectedAppointment.patientName, "—")} />
                    <Info label="Phone" value={firstValue(patientHistory.phone, patientHistory.mobile, getPatient(selectedAppointment).phone, "—")} />
                    <Info label="Patient ID / UHID" value={firstValue(patientHistory.patientId, patientHistory.uhid, patientHistory._id, getPatientId(selectedAppointment), "—")} />
                    <Info label="Blood group" value={firstValue(patientHistory.bloodGroup, patientHistory.blood_group, "Not available")} />
                  </div>
                  <div className="rounded-xl border border-[#dceaf1] p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-bold"><FileText size={17} className="text-[#16587b]" />Patient record returned by server</h3>
                    <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#f7fafc] p-3 text-xs leading-5 text-gray-700">{JSON.stringify(patientHistory, null, 2)}</pre>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function StatCard({ icon: Icon, label, value, helper, compact = false }) {
  return (
    <div className="rounded-2xl border border-[#dceaf1] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`mt-2 truncate font-bold text-[#123b50] ${compact ? "text-lg" : "text-3xl"}`}>{value}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf3f8] text-[#16587b]"><Icon size={21} /></div>
      </div>
      <p className="mt-2 text-xs text-gray-400">{helper}</p>
    </div>
  );
}

function Info({ label, value }) {
  return <div className="rounded-xl border border-[#dceaf1] p-3"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 break-words text-sm font-semibold text-[#123b50]">{String(value)}</p></div>;
}
