
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
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#16587b] focus:ring-2 focus:ring-[#e4f1f7]";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[#092c40]/75 p-3 backdrop-blur-md sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-title"
        className="relative my-auto flex max-h-[94vh] w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_100px_-25px_rgba(8,47,73,0.45)]"
      >
        <aside className="relative hidden w-[34%] shrink-0 flex-col justify-between overflow-hidden bg-[#16587b] p-8 text-white md:flex lg:p-10">
          <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border-[38px] border-white/[0.06]" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[38px] border-white/[0.06]" />
          <div className="relative z-10">
            <div className="mb-9 flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-lg shadow-slate-950/10">
              <img src="/logo1.png" alt="City Hospital logo" className="h-full w-full object-contain" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b9d8e8]">City Hospital · Buxar</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight lg:text-[2.5rem]">Care that feels closer.</h2>
            <p className="mt-4 max-w-xs text-sm leading-7 text-blue-50/85">Book your consultation in a few simple steps. Our team is here to help you plan your visit.</p>
            <div className="mt-9 h-1 w-14 rounded-full bg-[#a9002d]" />
            <div className="mt-8 space-y-5 text-sm text-blue-50/90">
              <div className="flex items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">01</span><span><strong className="block font-semibold text-white">Patient details</strong><span className="mt-1 block text-blue-100/75">Login or create your profile</span></span></div>
              <div className="flex items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">02</span><span><strong className="block font-semibold text-white">Choose consultation</strong><span className="mt-1 block text-blue-100/75">Select doctor, date and time</span></span></div>
              <div className="flex items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">03</span><span><strong className="block font-semibold text-white">Review booking</strong><span className="mt-1 block text-blue-100/75">Confirm your appointment details</span></span></div>
            </div>
          </div>
          <div className="relative z-10 mt-10 border-t border-white/15 pt-5 text-xs leading-5 text-blue-100/70">Your health, our priority.<br />Near Hindustan Machinery, Golumber, Buxar</div>
        </aside>
        <div className="min-w-0 flex-1 overflow-y-auto bg-[#fbfdfe]">
        {/* HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#dceaf1] bg-white/95 px-5 py-4 backdrop-blur-md sm:px-8 sm:py-5">
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
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-[#edf6fa] hover:text-[#16587b]"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </button>
            )}

            <div>
              <h2
                id="appointment-title"
                className="text-xl font-bold text-gray-900 sm:text-2xl"
              >
                {step === "main" && "Book Appointment"}
                {step === "login" && "Patient Login"}
                {step === "register" && "Patient Registration"}
                {step === "appointment" && "Appointment Details"}
                {step === "success" && "Appointment Confirmed"}
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-red-50 hover:text-red-500"
          >
            <X size={21} />
          </button>
        </div>

        <div className="p-5 sm:p-8 lg:p-9">
          {/* MAIN CHOICE */}
          {step === "main" && (
            <div className="space-y-4">
              <div className="mb-6 rounded-2xl border border-[#d4e7f0] bg-[#edf6fa] p-5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#16587b] text-white">
                  <CalendarDays size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Schedule your visit
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Continue with your existing patient account or
                  register as a new patient.
                </p>
              </div>

              <button
                type="button"
                onClick={() => changeStep("login")}
                className="group flex w-full items-center gap-4 rounded-2xl border border-gray-200 p-4 text-left transition hover:border-[#16587b] hover:bg-[#edf6fa]/60"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e2f0f7] text-[#16587b]">
                  <UserRound size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900">
                    Already Registered?
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                    Login with your mobile and Aadhaar number.
                  </p>
                </div>
                <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#16587b]">
                  →
                </span>
              </button>

              <button
                type="button"
                onClick={() => changeStep("register")}
                className="group flex w-full items-center gap-4 rounded-2xl border border-gray-200 p-4 text-left transition hover:border-[#16587b] hover:bg-[#edf6fa]/60"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e2f0f7] text-[#16587b]">
                  <UserPlus size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900">
                    New Patient?
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                    Register your details and book an appointment.
                  </p>
                </div>
                <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#16587b]">
                  →
                </span>
              </button>

              <p className="pt-2 text-center text-xs text-gray-400">
                Demo frontend only. Real authentication will be
                connected later.
              </p>
            </div>
          )}

          {/* REGISTERED PATIENT LOGIN */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="flex gap-3 rounded-xl border border-[#d4e7f0] bg-[#edf6fa] p-4">
                <ShieldCheck className="mt-0.5 shrink-0 text-[#16587b]" size={22} />
                <p className="text-sm leading-6 text-[#104662]">
                  Enter the details associated with your registered
                  patient profile.
                </p>
              </div>

              <div>
                <label className={labelClass}>Mobile Number</label>
                <div className="flex overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#16587b] focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-600">
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
                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Use fictional demo details only. Never enter your
                  real Aadhaar number in this prototype.
                </p>
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#16587b] px-5 py-3.5 font-semibold text-white transition hover:bg-[#104662] active:scale-[0.99]"
              >
                Verify & Continue
              </button>

              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Demo login credentials
                </p>
                <p className="text-sm text-gray-700">
                  Mobile: <strong>9876543210</strong>
                </p>
                <p className="mt-1 text-sm text-gray-700">
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

              <p className="text-center text-sm text-gray-500">
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
                <div className="flex overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#16587b] focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 text-sm text-gray-600">
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
                <p className="mt-1 text-xs text-gray-400">
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
                <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#16587b] px-5 py-3.5 font-semibold text-white transition hover:bg-[#104662]"
              >
                Register & Continue
              </button>

              <p className="text-center text-sm text-gray-500">
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
              <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <CheckCircle2 size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                    Patient Verified
                  </p>
                  <h3 className="mt-1 truncate font-bold text-gray-900">
                    {patient.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
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
                          : "border-gray-200 hover:border-[#a7cadc]"
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2f0f7] text-[#16587b]">
                        <UserRound size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {doctor.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
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
                <p className="mt-1 text-right text-xs text-gray-400">
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
                        : "border-gray-200"
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
                    <span className="text-sm font-semibold text-gray-800">
                      Cash
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      appointment.payment === "online"
                        ? "border-[#16587b] bg-[#edf6fa]"
                        : "border-gray-200"
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
                    <span className="text-sm font-semibold text-gray-800">
                      Online
                    </span>
                  </label>
                </div>
                {appointment.payment === "online" && (
                  <p className="mt-2 text-xs text-gray-500">
                    Online payment is a UI demo only. No payment will be
                    processed.
                  </p>
                )}
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
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
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 size={44} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900">
                Appointment Booked!
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Your demo appointment has been created successfully.
              </p>

              <div className="my-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left">
                <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-sm text-gray-500">
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
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-right text-sm font-semibold text-gray-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mb-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                This is a frontend demonstration. The booking has not
                been saved to a hospital database, and the slot has
                not been confirmed by hospital staff.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-xl bg-[#16587b] px-5 py-3.5 font-semibold text-white transition hover:bg-[#104662]"
              >
                Done
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}