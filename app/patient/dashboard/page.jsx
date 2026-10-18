
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  UserRound,
  LogOut,
  RefreshCw,
  ClipboardList,
  Stethoscope,
  AlertCircle,
} from "lucide-react";
import { apiRequest } from "../../../lib/api";

function formatDate(value) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusStyle(status) {
  const value = String(status || "").toUpperCase();

  if (value === "COMPLETED") {
    return "bg-green-100 text-green-700";
  }

  if (value === "CANCELLED") {
    return "bg-red-100 text-red-700";
  }

  if (value === "IN_CONSULTATION") {
    return "bg-purple-100 text-purple-700";
  }

  if (value === "WAITING") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-blue-100 text-blue-700";
}

export default function PatientDashboard() {
  const router = useRouter();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("patientToken");
      const savedPatient = sessionStorage.getItem("patient");

      if (!token) {
        router.replace("/patient-login");
        return;
      }

      if (savedPatient) {
        try {
          setPatient(JSON.parse(savedPatient));
        } catch {
          sessionStorage.removeItem("patient");
        }
      }

      const [profileResult, appointmentsResult] =
        await Promise.all([
          apiRequest("/api/auth/profile", { token }),
          apiRequest("/api/appointments/my", { token }),
        ]);

      setPatient(profileResult.patient);

      sessionStorage.setItem(
        "patient",
        JSON.stringify(profileResult.patient)
      );

      setAppointments(
        Array.isArray(appointmentsResult.appointments)
          ? appointmentsResult.appointments
          : []
      );
    } catch (err) {
      setError(err.message || "Unable to load your dashboard.");

      if (
        /token|unauthorized|authorization|expired/i.test(
          err.message || ""
        )
      ) {
        sessionStorage.removeItem("patientToken");
        sessionStorage.removeItem("patient");
        router.replace("/patient-login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  function handleLogout() {
    sessionStorage.removeItem("patientToken");
    sessionStorage.removeItem("patient");
    router.replace("/patient-login");
  }

  const upcomingAppointments = appointments.filter((item) => {
    const status = String(item.status || "").toUpperCase();
    const date = new Date(item.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      date >= today &&
      !["CANCELLED", "COMPLETED"].includes(status)
    );
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fafc]">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-[#16587b]"
            size={32}
          />
          <p className="mt-4 text-sm text-gray-600">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fafc] text-[#123b50]">
      <header className="border-b border-[#dceaf1] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16587b] text-white">
              <Stethoscope size={24} />
            </div>

            <div>
              <h1 className="font-bold text-[#16587b]">
                City Hospital
              </h1>
              <p className="text-xs text-gray-500">
                Patient Portal · Buxar
              </p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-[#16587b] p-6 text-white sm:p-9">
          <p className="text-sm text-blue-100">
            Patient Dashboard
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Welcome, {patient?.name || "Patient"}!
          </h2>

          <p className="mt-3 text-sm leading-6 text-blue-100">
            Manage your appointments and keep track of your
            hospital visits in one place.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/10 px-4 py-2">
              <UserRound
                size={15}
                className="mr-2 inline"
              />
              +91 {patient?.phone || "—"}
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2">
              <CalendarDays
                size={15}
                className="mr-2 inline"
              />
              {upcomingAppointments.length} upcoming
            </span>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={20} className="shrink-0" />
            <div className="flex-1">{error}</div>

            <button
              onClick={loadDashboard}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#dceaf1] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#edf6fa] p-3 text-[#16587b]">
                <CalendarDays size={23} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Total Appointments
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {appointments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dceaf1] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-50 p-3 text-green-700">
                <ClipboardList size={23} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Upcoming Appointments
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {upcomingAppointments.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold">
                My Appointments
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your appointments fetched from the hospital database.
              </p>
            </div>

            <button
              onClick={loadDashboard}
              className="flex items-center gap-2 rounded-xl border border-[#dceaf1] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#edf6fa]"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {!error && appointments.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-[#c9dfe9] bg-white p-10 text-center">
              <CalendarDays
                size={40}
                className="mx-auto text-[#84b3ce]"
              />

              <h4 className="mt-4 font-bold">
                No appointments yet
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                Book an appointment with one of our doctors to
                see it here.
              </p>

              <button
  onClick={() => router.push("/appointment")}
  className="inline-flex items-center gap-2 rounded-xl bg-[#16587b] px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#123b50] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#16587b]/15"
>
  <CalendarDays size={16} />
  Book Appointment
</button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {appointments.map((item) => {
                const doctor =
                  item.doctorId &&
                  typeof item.doctorId === "object"
                    ? item.doctorId
                    : null;

                return (
                  <article
                    key={item._id || item.appointmentId}
                    className="rounded-2xl border border-[#dceaf1] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-[#edf6fa] p-3 text-[#16587b]">
                          <Stethoscope size={23} />
                        </div>

                        <div>
                          <h4 className="font-bold">
                            {doctor?.name || "Doctor details unavailable"}
                          </h4>

                          <p className="mt-1 text-sm text-gray-500">
                            {doctor?.specialization ||
                              doctor?.department ||
                              "Medical consultation"}
                          </p>

                          <p className="mt-2 text-xs text-gray-400">
                            Booking ID:{" "}
                            {item.appointmentId || item._id || "—"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(item.status)}`}
                      >
                        {String(item.status || "BOOKED").replaceAll(
                          "_",
                          " "
                        )}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays
                          size={17}
                          className="text-[#16587b]"
                        />
                        {formatDate(item.appointmentDate)}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock3
                          size={17}
                          className="text-[#16587b]"
                        />
                        {item.appointmentTime || "Time not specified"}
                      </p>
                    </div>

                    {item.reason && (
                      <div className="mt-4 rounded-xl bg-gray-50 p-3">
                        <p className="text-xs font-semibold text-gray-500">
                          Reason for visit
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                          {item.reason}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="py-8 text-center text-xs text-gray-400">
          City Hospital · Buxar, Bihar
        </footer>
      </div>
    </main>
  );
}
