
"use client";

import { useState } from "react";
import {
  X,
  ArrowLeft,
  UserRound,
  UserPlus,
  CalendarDays,
  Clock3,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Banknote,
  Stethoscope,
  FileText,
} from "lucide-react";
import { demoPatients } from "../../data/demoPatients";

const doctors = [
  { id: "DOC001", name: "Doctor 1", specialty: "General Physician" },
  { id: "DOC002", name: "Doctor 2", specialty: "General Physician" },
  { id: "DOC003", name: "Doctor 3", specialty: "General Physician" },
];

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
];

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const initialAppointment = {
  doctor: "",
  date: "",
  time: "",
  reason: "",
  payment: "cash",
};

export default function BookAppointmentModal({ isOpen, onClose }) {
  const [step, setStep] = useState("main");
  const [patients, setPatients] = useState(demoPatients);

  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [patient, setPatient] = useState(null);

  const [register, setRegister] = useState({
    name: "",
    phone: "",
    aadhaar: "",
    gender: "",
    dob: "",
  });

  const [appointment, setAppointment] = useState(initialAppointment);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  if (!isOpen) return null;

  const resetModal = () => {
    setStep("main");
    setPhone("");
    setAadhaar("");
    setPatient(null);
    setError("");
    setRegister({
      name: "",
      phone: "",
      aadhaar: "",
      gender: "",
      dob: "",
    });
    setAppointment(initialAppointment);
    setConfirmation(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const updateRegister = (e) => {
    const { name, value } = e.target;

    setRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateAppointment = (e) => {
    const { name, value } = e.target;

    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // DEMO ONLY: Replace with real backend authentication later.
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{12}$/.test(aadhaar)) {
      setError("Enter a valid 12-digit Aadhaar number.");
      return;
    }

    const found = patients.find(
      (item) => item.phone === phone && item.aadhaar === aadhaar
    );

    if (!found) {
      setError("Patient not found. Please check your details or register.");
      return;
    }

    setPatient(found);
    setStep("appointment");
  };

  // DEMO ONLY: Registration is stored in temporary component state.
  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(register.phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{12}$/.test(register.aadhaar)) {
      setError("Enter a valid 12-digit Aadhaar number.");
      return;
    }

    const alreadyExists = patients.some(
      (item) =>
        item.phone === register.phone ||
        item.aadhaar === register.aadhaar
    );

    if (alreadyExists) {
      setError("This mobile or Aadhaar number is already registered.");
      return;
    }

    const newPatient = {
      id: `PAT${String(patients.length + 1).padStart(3, "0")}`,
      ...register,
    };

    setPatients((prev) => [...prev, newPatient]);
    setPatient(newPatient);
    setStep("appointment");
  };

  const handleBooking = (e) => {
    e.preventDefault();
    setError("");

    if (!patient || !appointment.doctor ||
        !appointment.date || !appointment.time ||
        !appointment.reason.trim()) {
      setError("Please complete all appointment details.");
      return;
    }

    if (appointment.date < getToday()) {
      setError("Please select a valid future date.");
      return;
    }

    // DEMO ONLY: No appointment is saved to a real database.
    setConfirmation({
      id: `DEMO-${Date.now().toString().slice(-6)}`,
      patient: patient.name,
      doctor: doctors.find(
        (doctor) => doctor.id === appointment.doctor
      )?.name,
      date: appointment.date,
      time: appointment.time,
      payment: appointment.payment,
    });

    setStep("success");
  };

  const changeStep = (nextStep) => {
    setError("");
    setStep(nextStep);
  };

  const inputClass =
    "w-full rounded-xl border border-[#dceaf1] bg-white px-4 py-3 text-sm text-[#123b50] outline-none transition placeholder:text-[#8aa3b1] focus:border-[#16587b] focus:ring-2 focus:ring-[#dceaf1]";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#34586a]";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-title"
        className="relative my-auto max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#dceaf1] bg-white shadow-[0_24px_80px_rgba(18,59,80,0.22)] sm:rounded-3xl"
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/15 bg-[#16587b] px-5 py-4 text-white sm:px-7 sm:py-5">
          <div className="flex items-center gap-3">
            {step !== "main" && step !== "success" && (
              <button
                type="button"
                onClick={() => {
                  if (step === "appointment" && patient) {
                    changeStep("main");
                  } else {
                    changeStep("main");
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:text-white"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </button>
            )}

            <div>
              <h2
                id="appointment-title"
                className="text-xl font-bold tracking-tight text-white sm:text-2xl"
              >
                {step === "main" && "Book Appointment"}
                {step === "login" && "Patient Login"}
                {step === "register" && "Patient Registration"}
                {step === "appointment" && "Appointment Details"}
                {step === "success" && "Appointment Confirmed"}
              </h2>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                {step === "main" && "Your health, our priority."}
                {step === "login" && "Verify your registered account."}
                {step === "register" && "Create your patient profile."}
                {step === "appointment" && "Schedule your hospital visit."}
                {step === "success" && "Your demo booking is complete."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-[#a9002d] hover:text-white"
          >
            <X size={21} />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          {/* MAIN CHOICE */}
          {step === "main" && (
            <div className="space-y-4">
              <div className="mb-6 rounded-2xl border border-[#dceaf1] bg-gradient-to-br from-[#edf6fa] to-white p-5 sm:p-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#16587b] text-white">
                  <CalendarDays size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#123b50]">
                  Schedule your visit
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#527184]">
                  Continue with your existing patient account or
                  register as a new patient.
                </p>
              </div>

              <button
                type="button"
                onClick={() => changeStep("login")}
                className="group flex w-full items-center gap-4 rounded-2xl border border-[#dceaf1] p-4 text-left transition hover:border-[#16587b] hover:bg-[#edf6fa]/60"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#dceaf1] text-[#16587b]">
                  <UserRound size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#123b50]">
                    Already Registered?
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#668293] sm:text-sm">
                    Login with your mobile and Aadhaar number.
                  </p>
                </div>
                <span className="text-xl text-[#8aa3b1] transition group-hover:translate-x-1 group-hover:text-[#16587b]">
                  →
                </span>
              </button>

              <button
                type="button"
                onClick={() => changeStep("register")}
                className="group flex w-full items-center gap-4 rounded-2xl border border-[#dceaf1] p-4 text-left transition hover:border-[#16587b] hover:bg-[#edf6fa]/60"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#dceaf1] text-[#16587b]">
                  <UserPlus size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#123b50]">
                    New Patient?
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[#668293] sm:text-sm">
                    Register your details and book an appointment.
                  </p>
                </div>
                <span className="text-xl text-[#8aa3b1] transition group-hover:translate-x-1 group-hover:text-[#16587b]">
                  →
                </span>
              </button>

              <p className="pt-2 text-center text-xs text-[#8aa3b1]">
                Demo frontend only. Real authentication will be
                connected later.
              </p>
            </div>
          )}

          {/* REGISTERED PATIENT LOGIN */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="flex gap-3 rounded-xl border border-[#dceaf1] bg-[#edf6fa] p-4">
                <ShieldCheck className="mt-0.5 shrink-0 text-[#16587b]" size={22} />
                <p className="text-sm leading-6 text-[#123b50]">
                  Enter the details associated with your registered
                  patient profile.
                </p>
              </div>

              <div>
                <label className={labelClass}>Mobile Number</label>
                <div className="flex overflow-hidden rounded-xl border border-[#dceaf1] focus-within:border-[#16587b] focus-within:ring-2 focus-within:ring-[#dceaf1]">
                  <span className="flex items-center border-r border-[#dceaf1] bg-[#f7fafc] px-4 text-sm font-medium text-[#527184]">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="10-digit mobile number"
                    className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Aadhaar Number</label>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={12}
                  value={aadhaar}
                  onChange={(e) =>
                    setAadhaar(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 12-digit test number"
                  className={inputClass}
                  required
                />
                <p className="mt-2 text-xs leading-5 text-[#8aa3b1]">
                  Use fictional demo details only. Never enter your
                  real Aadhaar number in this prototype.
                </p>
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-[#fff1f2] p-3 text-sm text-[#a9002d]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#16587b] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#16587b]/15 transition hover:bg-[#104662] active:scale-[0.99]"
              >
                Verify & Continue
              </button>

              <div className="rounded-xl border border-dashed border-[#dceaf1] bg-[#f7fafc] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#668293]">
                  Demo login credentials
                </p>
                <p className="text-sm text-[#34586a]">
                  Mobile: <strong>9876543210</strong>
                </p>
                <p className="mt-1 text-sm text-[#34586a]">
                  Aadhaar: <strong>123456789012</strong>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPhone("9876543210");
                    setAadhaar("123456789012");
                    setError("");
                  }}
                  className="mt-3 text-sm font-semibold text-[#16587b] hover:underline"
                >
                  Fill demo details
                </button>
              </div>

              <p className="text-center text-sm text-[#668293]">
                New patient?{" "}
                <button
                  type="button"
                  onClick={() => changeStep("register")}
                  className="font-semibold text-[#16587b] hover:underline"
                >
                  Register here
                </button>
              </p>
            </form>
          )}

          {/* NEW PATIENT REGISTRATION */}
          {step === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  name="name"
                  value={register.name}
                  onChange={updateRegister}
                  placeholder="Enter full name"
                  className={inputClass}
                  required
                  maxLength={80}
                />
              </div>

              <div>
                <label className={labelClass}>Mobile Number</label>
                <div className="flex overflow-hidden rounded-xl border border-[#dceaf1] focus-within:border-[#16587b] focus-within:ring-2 focus-within:ring-[#dceaf1]">
                  <span className="flex items-center border-r border-[#dceaf1] bg-[#f7fafc] px-4 text-sm text-[#527184]">
                    +91
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    value={register.phone}
                    onChange={(e) =>
                      setRegister((prev) => ({
                        ...prev,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      }))
                    }
                    placeholder="10-digit mobile number"
                    className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Aadhaar Number</label>
                <input
                  name="aadhaar"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  value={register.aadhaar}
                  onChange={(e) =>
                    setRegister((prev) => ({
                      ...prev,
                      aadhaar: e.target.value.replace(/\D/g, "").slice(0, 12),
                    }))
                  }
                  placeholder="12-digit test number"
                  className={inputClass}
                  required
                />
                <p className="mt-1 text-xs text-[#8aa3b1]">
                  Use fictional data only in this demo.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Gender</label>
                  <select
                    name="gender"
                    value={register.gender}
                    onChange={updateRegister}
                    className={inputClass}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input
                    name="dob"
                    type="date"
                    max={getToday()}
                    value={register.dob}
                    onChange={updateRegister}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-[#fff1f2] p-3 text-sm text-[#a9002d]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#16587b] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#16587b]/15 transition hover:bg-[#104662]"
              >
                Register & Continue
              </button>

              <p className="text-center text-sm text-[#668293]">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => changeStep("login")}
                  className="font-semibold text-[#16587b] hover:underline"
                >
                  Login here
                </button>
              </p>
            </form>
          )}

          {/* APPOINTMENT FORM */}
          {step === "appointment" && patient && (
            <form onSubmit={handleBooking} className="space-y-5">
              <div className="flex items-center gap-3 rounded-2xl border border-[#dcfce7] bg-[#f0fdf4] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#166534]">
                  <CheckCircle2 size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#166534]">
                    Patient Verified
                  </p>
                  <h3 className="mt-1 truncate font-bold text-[#123b50]">
                    {patient.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#668293]">
                    +91 {patient.phone}
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-2">
                    <Stethoscope size={17} className="text-[#16587b]" />
                    Select Doctor
                  </span>
                </label>
                <div className="space-y-2">
                  {doctors.map((doctor) => (
                    <label
                      key={doctor.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                        appointment.doctor === doctor.id
                          ? "border-[#16587b] bg-[#edf6fa]"
                          : "border-[#dceaf1] hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="doctor"
                        value={doctor.id}
                        checked={appointment.doctor === doctor.id}
                        onChange={updateAppointment}
                        className="h-4 w-4 accent-[#16587b]"
                      />
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dceaf1] text-[#16587b]">
                        <UserRound size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#123b50]">
                          {doctor.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#668293]">
                          {doctor.specialty}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={16} className="text-[#16587b]" />
                      Appointment Date
                    </span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    min={getToday()}
                    value={appointment.date}
                    onChange={updateAppointment}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 size={16} className="text-[#16587b]" />
                      Time Slot
                    </span>
                  </label>
                  <select
                    name="time"
                    value={appointment.time}
                    onChange={updateAppointment}
                    className={inputClass}
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option value={slot} key={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-2">
                    <FileText size={16} className="text-[#16587b]" />
                    Reason / Symptoms
                  </span>
                </label>
                <textarea
                  name="reason"
                  value={appointment.reason}
                  onChange={updateAppointment}
                  rows={3}
                  maxLength={500}
                  placeholder="Briefly describe your symptoms or reason for visit..."
                  className={`${inputClass} resize-none`}
                  required
                />
                <p className="mt-1 text-right text-xs text-[#8aa3b1]">
                  {appointment.reason.length}/500
                </p>
              </div>

              <div>
                <label className={labelClass}>Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      appointment.payment === "cash"
                        ? "border-[#16587b] bg-[#edf6fa]"
                        : "border-[#dceaf1]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={appointment.payment === "cash"}
                      onChange={updateAppointment}
                      className="h-4 w-4 accent-[#16587b]"
                    />
                    <Banknote size={20} className="text-[#16587b]" />
                    <span className="text-sm font-semibold text-[#123b50]">
                      Cash
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      appointment.payment === "online"
                        ? "border-[#16587b] bg-[#edf6fa]"
                        : "border-[#dceaf1]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={appointment.payment === "online"}
                      onChange={updateAppointment}
                      className="h-4 w-4 accent-[#16587b]"
                    />
                    <CreditCard size={20} className="text-[#16587b]" />
                    <span className="text-sm font-semibold text-[#123b50]">
                      Online
                    </span>
                  </label>
                </div>
                {appointment.payment === "online" && (
                  <p className="mt-2 text-xs text-[#668293]">
                    Online payment is a UI demo only. No payment will be
                    processed.
                  </p>
                )}
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-[#fff1f2] p-3 text-sm text-[#a9002d]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#16587b] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#16587b]/20 transition hover:bg-[#104662] active:scale-[0.99]"
              >
                Confirm Appointment
              </button>
            </form>
          )}

          {/* SUCCESS */}
          {step === "success" && confirmation && (
            <div className="py-4 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
                <CheckCircle2 size={44} />
              </div>

              <h3 className="text-2xl font-bold text-[#123b50]">
                Appointment Booked!
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#668293]">
                Your demo appointment has been created successfully.
              </p>

              <div className="my-6 rounded-2xl border border-[#dceaf1] bg-[#f7fafc] p-5 text-left">
                <div className="mb-4 flex items-center justify-between border-b border-[#dceaf1] pb-3">
                  <span className="text-sm text-[#668293]">
                    Demo Booking ID
                  </span>
                  <span className="text-sm font-bold text-[#16587b]">
                    {confirmation.id}
                  </span>
                </div>

                {[
                  ["Patient", confirmation.patient],
                  ["Doctor", confirmation.doctor],
                  ["Date", confirmation.date],
                  ["Time", confirmation.time],
                  ["Payment", confirmation.payment === "cash" ? "Cash at hospital" : "Online (demo)"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-3 py-2"
                  >
                    <span className="text-sm text-[#668293]">{label}</span>
                    <span className="text-right text-sm font-semibold text-[#123b50]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mb-5 rounded-xl bg-[#fffbeb] p-3 text-xs leading-5 text-[#92400e]">
                This is a frontend demonstration. The booking has not
                been saved to a hospital database, and the slot has
                not been confirmed by hospital staff.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-xl bg-[#16587b] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#16587b]/15 transition hover:bg-[#104662]"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}