"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity, CalendarDays, CheckCircle2, Clock3, FileText, LogOut,
  RefreshCw, Search, Stethoscope, UserRound, Users, X, AlertCircle,
  Phone, Hash, ChevronRight, ClipboardList, Save, Plus, Trash2,
  HeartPulse, Pill, FlaskConical, CalendarClock, Eye, ClipboardCheck,
} from "lucide-react";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}
function getPatientId(item) {
  const patient = item?.patient || item?.patientId;
  if (typeof patient === "string") return patient;
  return firstValue(patient?._id, patient?.id, item?.patient?._id, item?.patientId?._id);
}
function getPatient(item) {
  if (item?.patient && typeof item.patient === "object") return item.patient;
  if (item?.patientId && typeof item.patientId === "object") return item.patientId;
  if (item?.patientDetails && typeof item.patientDetails === "object") return item.patientDetails;
  return {};
}
function formatTime(value) {
  if (!value) return "Time not set";
  if (/^\d{1,2}:\d{2}/.test(String(value))) return String(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function formatDate(value) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function getAppointmentDate(item) { return firstValue(item?.appointmentDate, item?.date, item?.scheduledAt, item?.createdAt); }
function getAppointmentTime(item) { return firstValue(item?.appointmentTime, item?.time, item?.scheduledAt, item?.appointmentDate); }
function statusClass(status) {
  const value = String(status || "PENDING").toUpperCase();
  if (["COMPLETED", "DONE"].includes(value)) return "bg-emerald-50 text-emerald-700";
  if (["CONFIRMED", "APPROVED", "IN_CONSULTATION"].includes(value)) return "bg-blue-50 text-blue-700";
  if (["CANCELLED", "CANCELED", "REJECTED"].includes(value)) return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-800";
}
function splitLines(value) { return String(value || "").split(/\n|,/).map((v) => v.trim()).filter(Boolean); }
function blankMedicine() { return { medicineName: "", strength: "", dose: "", route: "Oral", frequency: "", duration: "", timing: "", instructions: "" }; }
function blankForm() {
  return {
    symptomsText: "", temperature: "", bloodPressure: "", pulse: "", spo2: "", weight: "",
    examination: "", diagnosisText: "", testsText: "", medicines: [blankMedicine()], advice: "", followUpDate: "",
  };
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [panelMode, setPanelMode] = useState(""); // history | consultation
  const [patientHistory, setPatientHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [form, setForm] = useState(blankForm);
  const [consultationId, setConsultationId] = useState("");
  const [consultationStatus, setConsultationStatus] = useState("NEW");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const token = () => typeof window !== "undefined" ? sessionStorage.getItem("doctorToken") : null;

  const loadAppointments = useCallback(async () => {
    const currentToken = typeof window !== "undefined" ? sessionStorage.getItem("doctorToken") : null;
    if (!currentToken) { router.replace("/doctor/login"); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctor/appointments/today`, {
        headers: { Authorization: `Bearer ${currentToken}`, Accept: "application/json" }, cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("doctorToken"); sessionStorage.removeItem("doctorUser"); sessionStorage.removeItem("doctor");
        router.replace("/doctor/login"); return;
      }
      if (!response.ok || data.success === false) throw new Error(data.message || `Could not load appointments (${response.status}).`);
      const list = Array.isArray(data) ? data : firstValue(data.appointments, data.data?.appointments, data.data, data.results, []);
      setAppointments(Array.isArray(list) ? list : []);
      const storedDoctor = sessionStorage.getItem("doctor");
      if (storedDoctor) { try { setDoctor(JSON.parse(storedDoctor)); } catch { setDoctor(null); } }
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load today's appointments."); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  const filteredAppointments = useMemo(() => {
    const term = query.trim().toLowerCase();

    return appointments.filter((item) => {
      const status = String(
        item.status || item.appointmentStatus || "PENDING"
      )
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");

      const completedStatuses = ["COMPLETED", "DONE"];
      const cancelledStatuses = ["CANCELLED", "CANCELED", "REJECTED"];
      const pendingStatuses = [
        "BOOKED",
        "PENDING",
        "CONFIRMED",
        "APPROVED",
        "IN_CONSULTATION",
        "IN_PROGRESS",
      ];

      let matchesStatus = true;
      if (statusFilter === "PENDING") {
        matchesStatus = pendingStatuses.includes(status) && !cancelledStatuses.includes(status);
      } else if (statusFilter === "COMPLETED") {
        matchesStatus = completedStatuses.includes(status);
      }

      if (!matchesStatus) return false;
      if (!term) return true;

      const patient = getPatient(item);
      const searchableValues = [
        patient.name,
        patient.fullName,
        patient.phone,
        patient.mobile,
        patient.patientId,
        patient.uhid,
        item.patientName,
        item.patientPhone,
        item.phone,
        item.mobile,
        item.patientId,
        item.uhid,
        item.tokenNumber,
        item.appointmentNumber,
        item._id,
      ];

      return searchableValues.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [appointments, query, statusFilter]);

  function closePanel() {
    setSelectedAppointment(null); setPanelMode(""); setPatientHistory(null); setHistoryError("");
    setFormError(""); setFormMessage(""); setConsultationId(""); setConsultationStatus("NEW"); setForm(blankForm());
  }

  async function openHistory(appointment) {
    const patientId = getPatientId(appointment);
    setSelectedAppointment(appointment); setPanelMode("history"); setPatientHistory(null); setHistoryError("");
    if (!patientId) { setHistoryError("Patient ID is missing from this appointment response."); return; }
    setHistoryLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctor/patients/${encodeURIComponent(patientId)}`, {
        headers: { Authorization: `Bearer ${token()}`, Accept: "application/json" }, cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) throw new Error(data.message || `Could not load patient history (${response.status}).`);
      const patientRecord = data.patient || data.data?.patient || data.data || data;
      let consultations = [];
      try {
        const historyResponse = await fetch(`${API_BASE_URL}/api/doctor/consultations/patient/${encodeURIComponent(patientId)}`, {
          headers: { Authorization: `Bearer ${token()}`, Accept: "application/json" }, cache: "no-store",
        });
        const historyData = await historyResponse.json().catch(() => ({}));
        if (historyResponse.ok && historyData.success !== false) consultations = historyData.consultations || historyData.data?.consultations || [];
      } catch { /* Keep the patient profile visible if consultation history is unavailable. */ }
      setPatientHistory({ ...patientRecord, consultations });
    } catch (err) { setHistoryError(err instanceof Error ? err.message : "Unable to load patient history."); }
    finally { setHistoryLoading(false); }
  }

  async function openConsultation(appointment) {
    setSelectedAppointment(appointment); setPanelMode("consultation"); setForm(blankForm());
    setFormError(""); setFormMessage(""); setConsultationId(""); setConsultationStatus("NEW");
    // If an appointment already has a linked consultation ID, load it. The current appointments endpoint may not provide one.
    const appointmentId = firstValue(appointment._id, appointment.id, appointment.appointmentId?._id);
    const linkedId = firstValue(appointment.consultationId?._id, appointment.consultationId, appointment.consultation?._id);
    setFormLoading(true);
    try {
      const url = linkedId
        ? `${API_BASE_URL}/api/doctor/consultations/${encodeURIComponent(linkedId)}`
        : `${API_BASE_URL}/api/doctor/consultations/appointment/${encodeURIComponent(appointmentId)}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token()}`, Accept: "application/json" }, cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 404 && !linkedId) return; // No consultation exists yet; open a blank form.
      if (!response.ok || data.success === false) throw new Error(data.message || "Could not load consultation draft.");
      const c = data.consultation || data.data?.consultation || data.data;
      setConsultationId(c?._id || linkedId || ""); setConsultationStatus(c?.status || "DRAFT");
      setForm({
        symptomsText: (c?.symptoms || []).join("\n"), temperature: c?.vitals?.temperature ?? "",
        bloodPressure: c?.vitals?.bloodPressure ?? "", pulse: c?.vitals?.pulse ?? "", spo2: c?.vitals?.spo2 ?? "", weight: c?.vitals?.weight ?? "",
        examination: c?.examination || "", diagnosisText: (c?.diagnosis || []).join("\n"), testsText: (c?.tests || []).join("\n"),
        medicines: c?.medicines?.length ? c.medicines.map((m) => ({ ...blankMedicine(), ...m })) : [blankMedicine()],
        advice: c?.advice || "", followUpDate: c?.followUpDate ? String(c.followUpDate).slice(0, 10) : "",
      });
    } catch (err) { setFormError(err instanceof Error ? err.message : "Unable to load consultation."); }
    finally { setFormLoading(false); }
  }

  function logout() {
    sessionStorage.removeItem("doctorToken"); sessionStorage.removeItem("doctorUser"); sessionStorage.removeItem("doctor"); router.replace("/doctor/login");
  }

  function updateForm(key, value) { setForm((current) => ({ ...current, [key]: value })); }
  function updateMedicine(index, key, value) {
    setForm((current) => ({ ...current, medicines: current.medicines.map((medicine, i) => i === index ? { ...medicine, [key]: value } : medicine) }));
  }
  function buildPayload() {
    return {
      symptoms: splitLines(form.symptomsText),
      vitals: {
        ...(form.temperature !== "" ? { temperature: Number(form.temperature) } : {}),
        ...(form.bloodPressure.trim() ? { bloodPressure: form.bloodPressure.trim() } : {}),
        ...(form.pulse !== "" ? { pulse: Number(form.pulse) } : {}),
        ...(form.spo2 !== "" ? { spo2: Number(form.spo2) } : {}),
        ...(form.weight !== "" ? { weight: Number(form.weight) } : {}),
      },
      examination: form.examination.trim(), diagnosis: splitLines(form.diagnosisText), tests: splitLines(form.testsText),
      medicines: form.medicines.filter((m) => m.medicineName.trim()).map((m) => ({
        medicineName: m.medicineName.trim(), strength: m.strength.trim(), dose: m.dose.trim(), route: m.route.trim(),
        frequency: m.frequency.trim(), duration: m.duration.trim(), timing: m.timing.trim(), instructions: m.instructions.trim(),
      })),
      advice: form.advice.trim(), followUpDate: form.followUpDate || null,
    };
  }

  async function saveConsultation(finalize = false) {
    if (!selectedAppointment) return;
    const appointmentId = firstValue(selectedAppointment._id, selectedAppointment.id, selectedAppointment.appointmentId?._id);
    if (!appointmentId) { setFormError("Appointment ID is missing. Refresh appointments and try again."); return; }
    if (!splitLines(form.diagnosisText).length && finalize) { setFormError("Please enter the diagnosis before finalizing the consultation."); return; }
    setFormLoading(true); setFormError(""); setFormMessage("");
    try {
      const currentToken = token();
      const payload = buildPayload();
      let response;
      if (!consultationId) {
        response = await fetch(`${API_BASE_URL}/api/doctor/consultations`, {
          method: "POST", headers: { Authorization: `Bearer ${currentToken}`, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ appointmentId, ...payload }),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/doctor/consultations/${encodeURIComponent(consultationId)}`, {
          method: "PATCH", headers: { Authorization: `Bearer ${currentToken}`, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await response.json().catch(() => ({}));
      if (response.status === 409 && data.consultation?._id) {
        setConsultationId(data.consultation._id);
        throw new Error("A consultation already exists for this appointment. Refresh and reopen the appointment to load the existing draft.");
      }
      if (!response.ok || data.success === false) throw new Error(data.message || `Unable to save consultation (${response.status}).`);
      const consultation = data.consultation || data.data?.consultation;
      if (consultation?._id) setConsultationId(consultation._id);
      if (consultation?.status) setConsultationStatus(consultation.status);
      const savedId = consultation?._id || consultationId;
      if (finalize) {
        if (!savedId) throw new Error("Consultation was saved but its ID was not returned. Save again before finalizing.");
        const finalResponse = await fetch(`${API_BASE_URL}/api/doctor/consultations/${encodeURIComponent(savedId)}/finalize`, {
          method: "PATCH", headers: { Authorization: `Bearer ${currentToken}`, Accept: "application/json" },
        });
        const finalData = await finalResponse.json().catch(() => ({}));
        if (!finalResponse.ok || finalData.success === false) throw new Error(finalData.message || `Saved as draft, but finalization failed (${finalResponse.status}).`);
        setConsultationStatus("FINALIZED"); setFormMessage("Consultation finalized and appointment marked completed.");
      } else {
        setFormMessage(consultationId ? (consultationStatus === "FINALIZED" ? "Corrections saved to finalized consultation." : "Consultation draft updated.") : "Consultation saved as draft.");
        if (consultationStatus !== "FINALIZED") setConsultationStatus("DRAFT");
      }
      await loadAppointments();
    } catch (err) { setFormError(err instanceof Error ? err.message : "Unable to save consultation."); }
    finally { setFormLoading(false); }
  }

  const completedCount = appointments.filter((item) => ["COMPLETED", "DONE"].includes(String(item.status || "").toUpperCase())).length;
  const pendingCount = appointments.filter((item) => !["COMPLETED", "DONE", "CANCELLED", "CANCELED"].includes(String(item.status || "").toUpperCase())).length;
  const doctorName = doctor?.name || doctor?.fullName || "Doctor";
  const specialization = doctor?.specialization || doctor?.department || "Medical team";

  return (
    <main className="min-h-screen bg-[#f7fafc] text-[#123b50]">
      <header className="sticky top-0 z-20 border-b border-[#dceaf1] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16587b] text-white"><Stethoscope size={23} /></div><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a9002d]">City Hospital · Buxar</p><p className="font-semibold">Doctor Portal</p></div></div>
          <div className="flex items-center gap-2">
            <button onClick={loadAppointments} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#dceaf1] px-3 py-2 text-sm transition hover:border-[#16587b] hover:bg-[#eaf3f8] disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /><span className="hidden sm:inline">Refresh</span></button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-sm text-red-700 transition hover:bg-red-50"><LogOut size={16} /><span className="hidden sm:inline">Logout</span></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <section className="mb-7 flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#16587b] to-[#20769b] p-6 text-white shadow-sm sm:flex-row sm:items-center sm:p-8">
          <div><p className="text-sm text-white/75">Doctor dashboard</p><h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Welcome, {doctorName}</h1><p className="mt-2 text-sm text-white/80">{specialization} · Manage appointments and patient consultations.</p></div>
          <div className="flex items-center gap-2 self-start rounded-xl bg-white/10 px-4 py-3 sm:self-auto"><CalendarDays size={19} /><span className="text-sm">{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span></div>
        </section>

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Today's OPD" value={loading ? "—" : appointments.length} helper="Click to show all patients" active={statusFilter === "ALL"} onClick={() => setStatusFilter("ALL")} />
          <StatCard icon={Clock3} label="Pending / in progress" value={loading ? "—" : pendingCount} helper="Click to filter pending patients" active={statusFilter === "PENDING"} onClick={() => setStatusFilter("PENDING")} />
          <StatCard icon={CheckCircle2} label="Completed" value={loading ? "—" : completedCount} helper="Click to filter completed patients" active={statusFilter === "COMPLETED"} onClick={() => setStatusFilter("COMPLETED")} />
          <StatCard icon={Activity} label="Specialization" value={specialization} helper={doctor?.qualification || "Doctor profile"} compact />
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#dceaf1] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h2 className="text-xl font-bold text-[#123b50]">{statusFilter === "ALL" ? "Today's OPD patients" : statusFilter === "PENDING" ? "Pending / in-progress patients" : "Completed patients"}</h2><p className="mt-1 text-sm text-slate-600">Search by patient name, phone, UHID, patient ID, or token.</p></div><div className="relative w-full sm:max-w-sm"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search today's queue..." className="w-full rounded-xl border border-[#dceaf1] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10" /></div></div>
          {error && <div className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" /><div><p className="font-semibold">Could not load appointments</p><p className="mt-1">{error}</p></div></div>}
          {loading ? <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-slate-500"><RefreshCw size={18} className="animate-spin" />Loading today's appointments…</div> : filteredAppointments.length === 0 ? <div className="px-6 py-16 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3f8] text-[#16587b]"><CalendarDays size={26} /></div><h3 className="font-medium">{query ? "No matching appointments" : "No appointments found for today"}</h3><p className="mt-2 text-sm text-slate-500">{query ? "Try another patient name, phone number, or ID." : "Appointments assigned for today will appear here."}</p></div> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-[#f7fafc] text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4 font-medium">Patient</th><th className="px-6 py-4 font-medium">Token / ID</th><th className="px-6 py-4 font-medium">Appointment time</th><th className="px-6 py-4 font-medium">Status</th><th className="px-6 py-4 text-right font-medium">Actions</th></tr></thead>
              <tbody className="divide-y divide-[#edf3f6]">{filteredAppointments.map((item, index) => {
                const patient = getPatient(item); const name = firstValue(patient.name, patient.fullName, item.patientName, item.name, "Patient");
                const phone = firstValue(patient.phone, patient.mobile, item.patientPhone, item.phone, item.mobile);
                const tokenNumber = firstValue(item.tokenNumber, item.token, item.appointmentNumber, item.uhid, getPatientId(item), "—");
                const status = firstValue(item.status, item.appointmentStatus, "PENDING");
                const isCompleted = ["COMPLETED", "DONE"].includes(String(status).toUpperCase());
                return <tr key={item._id || item.id || `${tokenNumber}-${index}`} className="transition hover:bg-[#fbfdfe]">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf3f8] text-[#16587b]"><UserRound size={19} /></div><div><p className="font-medium text-[#123b50]">{name}</p>{phone && <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Phone size={12} />{phone}</p>}</div></div></td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 text-slate-600"><Hash size={14} />{String(tokenNumber)}</span></td>
                  <td className="px-6 py-4"><div className="text-slate-600">{formatTime(getAppointmentTime(item))}</div><div className="mt-1 text-xs text-slate-400">{formatDate(getAppointmentDate(item))}</div></td>
                  <td className="px-6 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(status)}`}>{String(status).replaceAll("_", " ")}</span></td>
                  <td className="px-6 py-4"><div className="flex justify-end gap-2"><button onClick={() => openHistory(item)} className="inline-flex items-center gap-1 rounded-lg border border-[#dceaf1] px-3 py-2 text-sm text-[#16587b] transition hover:border-[#16587b] hover:bg-[#eaf3f8]"><Eye size={15} />History</button>{!isCompleted && <button onClick={() => openConsultation(item)} className="inline-flex items-center gap-1 rounded-lg bg-[#16587b] px-3 py-2 text-sm text-white transition hover:-translate-y-0.5 hover:bg-[#123b50] hover:shadow-sm"><Stethoscope size={15} />{String(status).toUpperCase() === "IN_CONSULTATION" ? "Continue" : "Start consultation"}</button>}</div></td>
                </tr>;
              })}</tbody></table></div>
          )}
        </section>
        <p className="mt-6 text-center text-xs text-slate-400">City Hospital · Authorized clinical access only</p>
      </div>

      {selectedAppointment && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closePanel(); }}>
        <section className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
          <div className="flex items-center justify-between border-b border-[#dceaf1] bg-white px-5 py-4 sm:px-6"><div><div className="flex items-center gap-2 text-[#16587b]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf3f8]">{panelMode === "history" ? <ClipboardList size={17} /> : <Stethoscope size={17} />}</span><h2 className="font-semibold">{panelMode === "history" ? "Patient history" : "Consultation record"}</h2></div><p className="mt-1 text-xs text-slate-500">{firstValue(getPatient(selectedAppointment).name, selectedAppointment.patientName, "Selected patient")} · {formatDate(getAppointmentDate(selectedAppointment))}</p></div><button onClick={closePanel} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#123b50]" aria-label="Close panel"><X size={20} /></button></div>
          <div className="overflow-y-auto p-4 sm:p-6">
            {panelMode === "history" ? <>
              {historyLoading ? <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-500"><RefreshCw size={17} className="animate-spin" />Loading patient history…</div> : historyError ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{historyError}</div> : patientHistory ? <PatientHistoryView history={patientHistory} appointment={selectedAppointment} onConsult={() => openConsultation(selectedAppointment)} /> : null}
            </> : <ConsultationForm form={form} updateForm={updateForm} updateMedicine={updateMedicine} addMedicine={() => updateForm("medicines", [...form.medicines, blankMedicine()])} removeMedicine={(index) => updateForm("medicines", form.medicines.filter((_, i) => i !== index))} loading={formLoading} error={formError} message={formMessage} status={consultationStatus} onSave={() => saveConsultation(false)} onFinalize={() => saveConsultation(true)} patient={getPatient(selectedAppointment)} appointment={selectedAppointment} />}
          </div>
        </section>
      </div>}
    </main>
  );
}

function PatientHistoryView({ history, appointment, onConsult }) {
  const patient = history.patient || history;
  const records = firstValue(history.consultations, history.medicalHistory, history.records, patient.consultations, []);
  const list = Array.isArray(records) ? records : [];
  return <div className="space-y-5">
    <div className="flex flex-col gap-4 rounded-2xl bg-[#f7fafc] p-4 sm:flex-row sm:items-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16587b] text-white"><UserRound size={25} /></div><div className="flex-1"><h3 className="text-lg font-semibold">{firstValue(patient.name, patient.fullName, getPatient(appointment).name, appointment.patientName, "Patient")}</h3><p className="mt-1 text-sm text-slate-500">Patient ID: {firstValue(patient.patientId, patient.uhid, patient._id, getPatientId(appointment), "—")}</p></div><button onClick={onConsult} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16587b] px-4 py-2.5 text-sm text-white transition hover:bg-[#123b50]"><Stethoscope size={16} />Start consultation</button></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><Info label="Phone" value={firstValue(patient.phone, patient.mobile, getPatient(appointment).phone, "Not recorded")} /><Info label="Gender" value={firstValue(patient.gender, "Not recorded")} /><Info label="Date of birth" value={formatDate(patient.dateOfBirth)} /><Info label="Blood group" value={firstValue(patient.bloodGroup, patient.blood_group, "Not recorded")} /><Info label="Address" value={firstValue(patient.address, "Not recorded")} /><Info label="Current appointment" value={firstValue(appointment.status, "Booked").toString().replaceAll("_", " ")} /></div>
    <section className="rounded-2xl border border-[#dceaf1] p-4"><div className="mb-3 flex items-center gap-2"><FileText size={18} className="text-[#16587b]" /><h3 className="font-semibold">Previous consultations</h3></div>
      {list.length ? <div className="space-y-3">{list.map((record, index) => <HistoryVisit key={record._id || index} record={record} />)}</div> : <div className="rounded-xl bg-[#f7fafc] p-4 text-sm text-slate-500">The patient endpoint did not return a previous-consultations list. This area will show records when the backend includes them.</div>}
    </section>
  </div>;
}

function HistoryVisit({ record }) {
  const [open, setOpen] = useState(false);
  const vitals = record.vitals || {};
  const medicines = Array.isArray(record.medicines) ? record.medicines : [];
  return <div className="overflow-hidden rounded-xl border border-[#dceaf1] bg-white">
    <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full flex-wrap items-center justify-between gap-3 bg-[#edf6fa] p-4 text-left transition hover:bg-[#dceef6]">
      <div><p className="font-bold text-[#123b50]">{(record.diagnosis || []).join(", ") || "Diagnosis not recorded"}</p><p className="mt-1 text-sm text-slate-600">Visit date: {formatDate(record.createdAt || record.date || record.appointmentId?.appointmentDate)}</p></div><span className="text-sm font-semibold text-[#16587b]">{open ? "Hide details −" : "View visit +"}</span>
    </button>
    {open && <div className="space-y-4 p-4">
      <div><h4 className="mb-2 font-bold text-[#123b50]">Symptoms & examination</h4><p className="text-sm text-slate-700">Symptoms: {(record.symptoms || []).join(", ") || "Not recorded"}</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">Examination: {record.examination || "Not recorded"}</p></div>
      <div><h4 className="mb-2 font-bold text-[#123b50]">Vitals</h4><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{[["Temperature", vitals.temperature == null ? "—" : `${vitals.temperature} °F`],["Blood pressure", vitals.bloodPressure || "—"],["Pulse", vitals.pulse == null ? "—" : `${vitals.pulse} bpm`],["SpO₂", vitals.spo2 == null ? "—" : `${vitals.spo2}%`],["Weight", vitals.weight == null ? "—" : `${vitals.weight} kg`]].map(([label,value]) => <Info key={label} label={label} value={value} />)}</div></div>
      <div><h4 className="mb-2 font-bold text-[#123b50]">Medicines</h4>{medicines.length ? <div className="space-y-2">{medicines.map((m,i) => <div key={m._id || i} className="rounded-lg bg-[#f7fafc] p-3 text-sm"><p className="font-semibold">{m.medicineName} {m.strength || ""}</p><p className="mt-1 text-slate-600">Dose: {m.dose || "—"} · Route: {m.route || "—"} · Frequency: {m.frequency || "—"} · Duration: {m.duration || "—"}</p>{(m.timing || m.instructions) && <p className="mt-1 text-slate-600">{[m.timing,m.instructions].filter(Boolean).join(" · ")}</p>}</div>)}</div> : <p className="text-sm text-slate-500">No medicines recorded.</p>}</div>
      <div className="grid gap-3 sm:grid-cols-2"><Info label="Tests / investigations" value={(record.tests || []).join(", ") || "Not recorded"} /><Info label="Follow-up" value={formatDate(record.followUpDate)} /></div>
      <div><h4 className="font-bold text-[#123b50]">Advice</h4><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{record.advice || "Not recorded"}</p></div>
      <p className="text-xs text-slate-500">Record status: {record.status || "Not recorded"}</p>
    </div>}
  </div>;
}

function ConsultationForm({ form, updateForm, updateMedicine, addMedicine, removeMedicine, loading, error, message, status, onSave, onFinalize, patient, appointment }) {
  const completed = status === "FINALIZED";
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f7fafc] p-4"><div><p className="font-medium">{firstValue(patient.name, patient.fullName, appointment.patientName, "Patient")}</p><p className="mt-1 text-xs text-slate-500">Phone: {firstValue(patient.phone, appointment.patientPhone, "Not available")} · Appointment: {formatDate(getAppointmentDate(appointment))}</p></div><span className={`rounded-full px-3 py-1 text-xs font-medium ${completed ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{completed ? "FINALIZED" : status === "DRAFT" ? "DRAFT" : "NEW CONSULTATION"}</span></div>
    {error && <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</div>}
    {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>}
    {completed && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-900">This consultation is finalized. Authorized corrections can be saved; the appointment will remain completed.</div>}
    <fieldset disabled={loading} className="space-y-5 disabled:opacity-80">
      <FormSection icon={ClipboardList} title="Symptoms and examination"><Field label="Symptoms" hint="Enter one symptom per line" ><textarea value={form.symptomsText} onChange={(e) => updateForm("symptomsText", e.target.value)} rows={3} placeholder="e.g. Fever for 2 days" className={inputClass + " resize-y"} /></Field><Field label="Clinical examination / findings"><textarea value={form.examination} onChange={(e) => updateForm("examination", e.target.value)} rows={3} placeholder="Record examination findings" className={inputClass + " resize-y"} /></Field></FormSection>
      <FormSection icon={HeartPulse} title="Vitals"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Field label="Temperature (°F)"><input type="number" step="0.1" value={form.temperature} onChange={(e) => updateForm("temperature", e.target.value)} placeholder="e.g. 98.6" className={inputClass} /></Field><Field label="Blood pressure"><input value={form.bloodPressure} onChange={(e) => updateForm("bloodPressure", e.target.value)} placeholder="120/80" className={inputClass} /></Field><Field label="Pulse (bpm)"><input type="number" value={form.pulse} onChange={(e) => updateForm("pulse", e.target.value)} placeholder="72" className={inputClass} /></Field><Field label="SpO₂ (%)"><input type="number" value={form.spo2} onChange={(e) => updateForm("spo2", e.target.value)} placeholder="98" className={inputClass} /></Field><Field label="Weight (kg)"><input type="number" step="0.1" value={form.weight} onChange={(e) => updateForm("weight", e.target.value)} placeholder="70" className={inputClass} /></Field></div></FormSection>
      <FormSection icon={ClipboardCheck} title="Diagnosis and tests"><Field label="Diagnosis" hint="Enter one diagnosis per line"><textarea value={form.diagnosisText} onChange={(e) => updateForm("diagnosisText", e.target.value)} rows={3} placeholder="Enter diagnosis after clinical assessment" className={inputClass + " resize-y"} /></Field><Field label="Tests / investigations" hint="Enter one test per line"><textarea value={form.testsText} onChange={(e) => updateForm("testsText", e.target.value)} rows={2} placeholder="Tests, if clinically indicated" className={inputClass + " resize-y"} /></Field></FormSection>
      <FormSection icon={Pill} title="Prescription"><div className="space-y-3">{form.medicines.map((medicine, index) => <div key={index} className="rounded-xl border border-[#dceaf1] p-3 sm:p-4"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-medium">Medicine {index + 1}</p>{form.medicines.length > 1 && <button type="button" onClick={() => removeMedicine(index)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-600 transition hover:bg-red-50"><Trash2 size={14} />Remove</button>}</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Field label="Medicine name"><input value={medicine.medicineName} onChange={(e) => updateMedicine(index, "medicineName", e.target.value)} placeholder="Medicine name" className={inputClass} /></Field><Field label="Strength"><input value={medicine.strength} onChange={(e) => updateMedicine(index, "strength", e.target.value)} placeholder="e.g. 500 mg" className={inputClass} /></Field><Field label="Dose"><input value={medicine.dose} onChange={(e) => updateMedicine(index, "dose", e.target.value)} placeholder="e.g. 1 tablet" className={inputClass} /></Field><Field label="Route"><select value={medicine.route} onChange={(e) => updateMedicine(index, "route", e.target.value)} className={inputClass}><option>Oral</option><option>Topical</option><option>Injection</option><option>Inhalation</option><option>Other</option></select></Field><Field label="Frequency"><input value={medicine.frequency} onChange={(e) => updateMedicine(index, "frequency", e.target.value)} placeholder="e.g. twice daily" className={inputClass} /></Field><Field label="Duration"><input value={medicine.duration} onChange={(e) => updateMedicine(index, "duration", e.target.value)} placeholder="e.g. 5 days" className={inputClass} /></Field><Field label="Timing"><input value={medicine.timing} onChange={(e) => updateMedicine(index, "timing", e.target.value)} placeholder="e.g. after food" className={inputClass} /></Field><Field label="Instructions"><input value={medicine.instructions} onChange={(e) => updateMedicine(index, "instructions", e.target.value)} placeholder="Additional instructions" className={inputClass} /></Field></div></div>)}<button type="button" onClick={addMedicine} className="inline-flex items-center gap-2 rounded-lg border border-[#dceaf1] px-3 py-2 text-sm text-[#16587b] transition hover:border-[#16587b] hover:bg-[#eaf3f8]"><Plus size={15} />Add medicine</button></div></FormSection>
      <FormSection icon={CalendarClock} title="Advice and follow-up"><Field label="Advice / instructions"><textarea value={form.advice} onChange={(e) => updateForm("advice", e.target.value)} rows={3} placeholder="Doctor's advice and patient instructions" className={inputClass + " resize-y"} /></Field><Field label="Follow-up date"><input type="date" value={form.followUpDate} onChange={(e) => updateForm("followUpDate", e.target.value)} className={inputClass} /></Field></FormSection>
    </fieldset>
    <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-[#dceaf1] bg-white pt-4 sm:flex-row sm:justify-end"><button type="button" disabled={loading} onClick={onSave} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dceaf1] px-4 py-2.5 text-sm font-semibold text-[#16587b] transition hover:bg-[#f7fafc] disabled:opacity-60"><Save size={16} />{loading ? "Saving…" : completed ? "Save corrections" : "Save as draft"}</button>{!completed && <button type="button" disabled={loading} onClick={onFinalize} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16587b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123b50] disabled:opacity-60"><CheckCircle2 size={16} />{loading ? "Please wait…" : "Save & finalize"}</button>}</div>
    <p className="text-xs leading-5 text-slate-400">Enter only clinically verified findings and prescriptions. Finalizing marks the appointment completed. Corrections to finalized records should be limited to authorized clinical staff.</p>
  </div>;
}

const inputClass = "w-full rounded-xl border border-[#dceaf1] bg-white px-3 py-2.5 text-sm text-[#123b50] outline-none transition placeholder:text-slate-400 hover:border-[#b6d2e0] focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10 disabled:bg-slate-50";
function Field({ label, hint, children }) { return <label className="block min-w-0"><span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>{children}{hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}</label>; }
function FormSection({ icon: Icon, title, children }) { return <section className="rounded-2xl border border-[#dceaf1] p-4 sm:p-5"><div className="mb-4 flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf3f8] text-[#16587b]"><Icon size={17} /></span><h3 className="font-semibold">{title}</h3></div>{children}</section>; }
function StatCard({ icon: Icon, label, value, helper, compact = false, active = false, onClick }) { const content = <><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-semibold text-slate-600">{label}</p><p className={`mt-2 truncate font-bold text-[#123b50] ${compact ? "text-lg" : "text-3xl"}`}>{value}</p></div><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${active ? "bg-[#16587b] text-white" : "bg-[#eaf3f8] text-[#16587b]"}`}><Icon size={21} /></div></div><p className="mt-2 text-xs text-slate-500">{helper}</p></>; return onClick ? <button type="button" onClick={onClick} className={`w-full rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#16587b]/15 ${active ? "border-[#16587b] bg-[#edf6fa] ring-1 ring-[#16587b]" : "border-[#dceaf1] bg-white hover:border-[#16587b]"}`}>{content}</button> : <div className="rounded-2xl border border-[#dceaf1] bg-white p-5 shadow-sm">{content}</div>; }
function Info({ label, value }) { return <div className="rounded-xl border border-[#dceaf1] p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-medium text-[#123b50]">{String(value)}</p></div>; }
