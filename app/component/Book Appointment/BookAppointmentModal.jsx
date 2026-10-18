"use client";

import { useEffect, useState } from "react";
import {
  X, ArrowLeft, CalendarDays, Clock3, Stethoscope, UserRound,
  UserPlus, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck,
} from "lucide-react";
import { apiRequest } from "../../../lib/api";

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM",
];

const EMPTY_APPOINTMENT = {
  doctor: "",
  date: "",
  time: "",
  reason: "",
};

function todayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getStoredPatient() {
  try {
    return JSON.parse(sessionStorage.getItem("patient") || "null");
  } catch {
    return null;
  }
}

export default function BookAppointmentModal({ isOpen, onClose }) {
  const [step, setStep] = useState("appointment");
  const [doctors, setDoctors] = useState([]);
  const [patient, setPatient] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [register, setRegister] = useState({
    name: "", phone: "", aadhaar: "", gender: "", dob: "",
  });
  const [appointment, setAppointment] = useState(EMPTY_APPOINTMENT);

  useEffect(() => {
    if (!isOpen) return;
    const savedToken = sessionStorage.getItem("patientToken") || "";
    const savedPatient = getStoredPatient();
    setToken(savedToken);
    setPatient(savedPatient);
    setStep(savedToken ? "appointment" : "access");
    setError("");

    let cancelled = false;
    async function loadDoctors() {
      setLoadingDoctors(true);
      try {
        const result = await apiRequest("/api/doctors");
        if (!cancelled) {
          setDoctors(Array.isArray(result.doctors) ? result.doctors : []);
          if (!Array.isArray(result.doctors) || result.doctors.length === 0) {
            setError("No active doctors are available right now.");
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load doctors.");
      } finally {
        if (!cancelled) setLoadingDoctors(false);
      }
    }
    loadDoctors();
    return () => { cancelled = true; };
  }, [isOpen]);

  if (!isOpen) return null;

  const close = () => {
    setError("");
    onClose?.();
  };

  const updateAppointment = (event) => {
    setAppointment((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const saveSession = (data) => {
    if (!data?.token || !data?.patient) {
      throw new Error("The server returned an incomplete patient session.");
    }
    sessionStorage.setItem("patientToken", data.token);
    sessionStorage.setItem("patient", JSON.stringify(data.patient));
    setToken(data.token);
    setPatient(data.patient);
    setStep("appointment");
    setError("");
  };

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^\d{12}$/.test(aadhaar)) {
      setError("Enter a valid 12-digit Aadhaar number.");
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: { phone: phone.trim(), aadhaar: aadhaar.trim() },
      });
      saveSession(data);
    } catch (err) {
      setError(err.message || "Unable to verify patient details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    if (!register.name.trim()) {
      setError("Enter the patient's full name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(register.phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^\d{12}$/.test(register.aadhaar)) {
      setError("Enter a valid 12-digit Aadhaar number.");
      return;
    }
    setLoading(true);
    try {
      const body = {
        name: register.name.trim(),
        phone: register.phone.trim(),
        aadhaar: register.aadhaar.trim(),
        ...(register.dob ? { dateOfBirth: register.dob } : {}),
        ...(register.gender ? { gender: register.gender } : {}),
      };
      const data = await apiRequest("/api/auth/register", { method: "POST", body });
      saveSession(data);
    } catch (err) {
      setError(err.message || "Unable to register patient.");
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking(event) {
    event.preventDefault();
    setError("");
    const currentToken = sessionStorage.getItem("patientToken") || token;
    if (!currentToken) {
      setStep("access");
      setError("Please login or register before booking.");
      return;
    }
    if (!appointment.doctor || !appointment.date || !appointment.time || !appointment.reason.trim()) {
      setError("Please complete all appointment details.");
      return;
    }
    if (appointment.date < todayString()) {
      setError("Please select today or a future date.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/api/appointments", {
        method: "POST",
        token: currentToken,
        body: {
          doctorId: appointment.doctor,
          appointmentDate: appointment.date,
          appointmentTime: appointment.time,
          reason: appointment.reason.trim(),
        },
      });
      const saved = data.appointment;
      const doctor = doctors.find((item) => String(item._id || item.id) === appointment.doctor);
      setConfirmation({
        id: saved?.appointmentId || saved?._id || "Booked",
        patient: saved?.patientId?.name || patient?.name || "Patient",
        doctor: saved?.doctorId?.name || doctor?.name || "Selected doctor",
        specialty: saved?.doctorId?.specialization || doctor?.specialization || doctor?.department || "",
        date: appointment.date,
        time: appointment.time,
      });
      setStep("success");
    } catch (err) {
      setError(err.message || "Unable to book appointment.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-[#dceaf1] bg-white px-3.5 py-2.5 text-sm text-[#123b50] outline-none transition placeholder:text-gray-400 hover:border-[#84b3ce] focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10";
  const labelClass = "mb-1.5 block text-xs font-medium text-[#123b50]";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[#123b50]/55 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="appointment-title"
        className="my-auto flex max-h-[94vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-2xl">
        <aside className="relative hidden w-[31%] shrink-0 flex-col justify-between overflow-hidden bg-[#16587b] p-6 text-white md:flex">
          <div className="pointer-events-none absolute -right-16 -top-12 h-44 w-44 rounded-full border-[22px] border-white/[0.07]" />
          <div className="relative">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10"><Stethoscope size={23}/></div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#c7e1ee]">City Hospital · Buxar</p>
            <h2 className="mt-3 text-xl font-semibold leading-7">Book your visit</h2>
            <p className="mt-2 text-sm leading-6 text-blue-50/80">Choose your doctor and a convenient appointment time.</p>
            <div className="mt-6 h-1 w-10 rounded-full bg-[#a9002d]"/>
            <div className="mt-6 space-y-4 text-xs text-blue-50/90">
              <p className="flex items-center gap-2"><CheckCircle2 size={15}/> Secure patient session</p>
              <p className="flex items-center gap-2"><CheckCircle2 size={15}/> Active doctor list</p>
              <p className="flex items-center gap-2"><CheckCircle2 size={15}/> Confirmation from server</p>
            </div>
          </div>
          <p className="relative text-[11px] leading-5 text-blue-100/70">Near Hindustan Machinery,<br/>Golumber, Buxar, Bihar</p>
        </aside>

        <div className="min-w-0 flex-1 overflow-y-auto bg-[#fbfdfe]">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dceaf1] bg-white/95 px-4 py-3.5 backdrop-blur sm:px-6">
            <div className="flex items-center gap-2.5">
              {step !== "appointment" && step !== "success" && (
                <button type="button" onClick={() => { setStep(token ? "appointment" : "access"); setError(""); }}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-[#edf6fa] hover:text-[#16587b]" aria-label="Go back">
                  <ArrowLeft size={17}/>
                </button>
              )}
              <div>
                <h2 id="appointment-title" className="text-base font-semibold text-[#123b50]">
                  {step === "access" && "Patient access"}
                  {step === "login" && "Patient login"}
                  {step === "register" && "New patient registration"}
                  {step === "appointment" && "Appointment details"}
                  {step === "success" && "Appointment booked"}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  {step === "access" && "Login or create a patient account"}
                  {step === "login" && "Use your registered mobile and Aadhaar"}
                  {step === "register" && "Enter the patient's details"}
                  {step === "appointment" && "Select doctor, date and time"}
                  {step === "success" && "Your appointment is saved in the hospital system"}
                </p>
              </div>
            </div>
            <button type="button" onClick={close} className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-[#a9002d]" aria-label="Close booking">
              <X size={19}/>
            </button>
          </header>

          <div className="p-4 sm:p-6">
            {error && (
              <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                <AlertCircle size={17} className="mt-0.5 shrink-0"/><span>{error}</span>
              </div>
            )}

            {step === "access" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-[#dceaf1] bg-[#edf6fa] p-4">
                  <p className="text-sm font-medium text-[#123b50]">Continue to appointment booking</p>
                  <p className="mt-1 text-xs leading-5 text-gray-600">If you already logged in, your session will be reused automatically.</p>
                </div>
                <button onClick={() => { setStep("login"); setError(""); }} className="group flex w-full items-center gap-3 rounded-xl border border-[#dceaf1] bg-white p-4 text-left transition hover:border-[#84b3ce] hover:bg-[#f5fafc]">
                  <span className="rounded-lg bg-[#edf6fa] p-2.5 text-[#16587b]"><UserRound size={19}/></span>
                  <span className="flex-1"><span className="block text-sm font-medium">Already registered</span><span className="mt-1 block text-xs text-gray-500">Login with mobile and Aadhaar</span></span><span className="text-[#16587b] transition group-hover:translate-x-0.5">→</span>
                </button>
                <button onClick={() => { setStep("register"); setError(""); }} className="group flex w-full items-center gap-3 rounded-xl border border-[#dceaf1] bg-white p-4 text-left transition hover:border-[#84b3ce] hover:bg-[#f5fafc]">
                  <span className="rounded-lg bg-[#edf6fa] p-2.5 text-[#16587b]"><UserPlus size={19}/></span>
                  <span className="flex-1"><span className="block text-sm font-medium">New patient</span><span className="mt-1 block text-xs text-gray-500">Register, then book an appointment</span></span><span className="text-[#16587b] transition group-hover:translate-x-0.5">→</span>
                </button>
              </div>
            )}

            {step === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex items-start gap-2 rounded-xl border border-[#dceaf1] bg-[#edf6fa] p-3 text-xs leading-5 text-[#16587b]"><ShieldCheck size={17} className="mt-0.5 shrink-0"/> Use the same credentials registered with City Hospital.</div>
                <div><label className={labelClass} htmlFor="patient-phone">Mobile number</label><input id="patient-phone" className={inputClass} type="tel" inputMode="numeric" maxLength={10} autoComplete="tel" value={phone} onChange={(e)=>setPhone(e.target.value.replace(/\D/g,""))} placeholder="10-digit mobile number" required/></div>
                <div><label className={labelClass} htmlFor="patient-aadhaar">Aadhaar number</label><input id="patient-aadhaar" className={inputClass} type="password" inputMode="numeric" maxLength={12} autoComplete="off" value={aadhaar} onChange={(e)=>setAadhaar(e.target.value.replace(/\D/g,""))} placeholder="12-digit Aadhaar number" required/><p className="mt-1.5 text-[11px] leading-4 text-gray-500">Used only for verification; it is not saved in browser storage.</p></div>
                <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16587b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#123b50] focus:ring-4 focus:ring-[#16587b]/15 disabled:opacity-60">{loading && <RefreshCw size={15} className="animate-spin"/>}{loading ? "Verifying…" : "Verify and continue"}</button>
                <p className="text-center text-xs text-gray-500">New patient? <button type="button" onClick={()=>{setStep("register");setError("");}} className="font-medium text-[#16587b] hover:text-[#a9002d] hover:underline">Register here</button></p>
              </form>
            )}

            {step === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div><label className={labelClass} htmlFor="register-name">Full name</label><input id="register-name" name="name" value={register.name} onChange={(e)=>setRegister({...register,name:e.target.value})} className={inputClass} autoComplete="name" maxLength={100} placeholder="Patient's full name" required/></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className={labelClass} htmlFor="register-phone">Mobile number</label><input id="register-phone" type="tel" inputMode="numeric" maxLength={10} value={register.phone} onChange={(e)=>setRegister({...register,phone:e.target.value.replace(/\D/g,"")})} className={inputClass} placeholder="10 digits" required/></div>
                  <div><label className={labelClass} htmlFor="register-aadhaar">Aadhaar number</label><input id="register-aadhaar" type="password" inputMode="numeric" maxLength={12} value={register.aadhaar} onChange={(e)=>setRegister({...register,aadhaar:e.target.value.replace(/\D/g,"")})} className={inputClass} placeholder="12 digits" required/></div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className={labelClass} htmlFor="register-dob">Date of birth (optional)</label><input id="register-dob" type="date" value={register.dob} onChange={(e)=>setRegister({...register,dob:e.target.value})} className={inputClass}/></div>
                  <div><label className={labelClass} htmlFor="register-gender">Gender (optional)</label><select id="register-gender" value={register.gender} onChange={(e)=>setRegister({...register,gender:e.target.value})} className={inputClass}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></div>
                </div>
                <p className="text-[11px] leading-4 text-gray-500">Aadhaar is sent to the backend for verification and is not stored in browser storage.</p>
                <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16587b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#123b50] disabled:opacity-60">{loading && <RefreshCw size={15} className="animate-spin"/>}{loading ? "Creating account…" : "Register and continue"}</button>
              </form>
            )}

            {step === "appointment" && (
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-[#dceaf1] bg-white p-3">
                  <span className="rounded-lg bg-[#edf6fa] p-2.5 text-[#16587b]"><UserRound size={18}/></span>
                  <div className="min-w-0 flex-1"><p className="text-xs text-gray-500">Booking for</p><p className="truncate text-sm font-medium text-[#123b50]">{patient?.name || "Logged-in patient"}</p><p className="mt-0.5 text-xs text-gray-500">{patient?.phone || "Patient session verified"}</p></div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700"><CheckCircle2 size={12}/> Verified</span>
                </div>
                <div>
                  <label className={labelClass} htmlFor="appointment-doctor">Choose doctor</label>
                  <div className="relative"><Stethoscope size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#16587b]"/><select id="appointment-doctor" name="doctor" value={appointment.doctor} onChange={updateAppointment} className={`${inputClass} pl-9`} required disabled={loadingDoctors}><option value="">{loadingDoctors ? "Loading doctors…" : "Select a doctor"}</option>{doctors.map((doctor)=><option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>{doctor.name} — {doctor.specialization || doctor.department || doctor.qualification}</option>)}</select></div>
                  {loadingDoctors && <p className="mt-1.5 text-xs text-gray-500">Fetching active doctors…</p>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className={labelClass} htmlFor="appointment-date">Appointment date</label><div className="relative"><CalendarDays size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#16587b]"/><input id="appointment-date" name="date" type="date" min={todayString()} value={appointment.date} onChange={updateAppointment} className={`${inputClass} pl-9`} required/></div></div>
                  <div><label className={labelClass} htmlFor="appointment-time">Appointment time</label><div className="relative"><Clock3 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#16587b]"/><select id="appointment-time" name="time" value={appointment.time} onChange={updateAppointment} className={`${inputClass} pl-9`} required><option value="">Select a time</option>{TIME_SLOTS.map((time)=><option key={time} value={time}>{time}</option>)}</select></div></div>
                </div>
                <div><label className={labelClass} htmlFor="appointment-reason">Reason for visit</label><textarea id="appointment-reason" name="reason" rows={3} maxLength={500} value={appointment.reason} onChange={updateAppointment} className={`${inputClass} resize-y`} placeholder="Briefly describe why you need a consultation" required/></div>
                <div className="rounded-xl bg-[#edf6fa] px-3.5 py-3 text-xs leading-5 text-[#16587b]">Booking is confirmed only after the hospital server accepts the request. If a time slot is already booked, choose another time.</div>
                <button disabled={loading || loadingDoctors || doctors.length === 0} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16587b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#123b50] focus:ring-4 focus:ring-[#16587b]/15 disabled:cursor-not-allowed disabled:opacity-60">{loading && <RefreshCw size={15} className="animate-spin"/>}{loading ? "Booking appointment…" : "Confirm appointment"}</button>
              </form>
            )}

            {step === "success" && confirmation && (
              <div className="mx-auto max-w-md py-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={29}/></div>
                <h3 className="mt-3 text-center text-lg font-semibold text-[#123b50]">Appointment booked</h3>
                <p className="mt-1 text-center text-xs text-gray-500">Your booking has been saved successfully.</p>
                <div className="mt-5 rounded-xl border border-[#dceaf1] bg-white p-4">
                  <div className="flex items-center justify-between border-b border-[#edf2f5] pb-3"><span className="text-xs text-gray-500">Appointment ID</span><span className="text-sm font-semibold text-[#16587b]">{confirmation.id}</span></div>
                  <div className="mt-3 space-y-3 text-sm">
                    <div><p className="text-[11px] text-gray-500">Patient</p><p className="mt-0.5">{confirmation.patient}</p></div>
                    <div><p className="text-[11px] text-gray-500">Doctor</p><p className="mt-0.5">{confirmation.doctor}</p><p className="text-xs text-gray-500">{confirmation.specialty}</p></div>
                    <div className="grid grid-cols-2 gap-3"><div><p className="text-[11px] text-gray-500">Date</p><p className="mt-0.5">{new Date(`${confirmation.date}T00:00:00`).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</p></div><div><p className="text-[11px] text-gray-500">Time</p><p className="mt-0.5">{confirmation.time}</p></div></div>
                  </div>
                </div>
                <button onClick={close} className="mt-5 w-full rounded-xl bg-[#16587b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#123b50]">Done</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
