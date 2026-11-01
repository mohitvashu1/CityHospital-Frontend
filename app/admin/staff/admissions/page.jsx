
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  CheckCircle2,
  RefreshCw,
  BedDouble,
} from "lucide-react";

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const input =
  "w-full rounded-xl border border-[#dceaf1] bg-white px-3.5 py-3 text-sm text-[#123b50] outline-none transition focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10";

const label = "mb-1.5 block text-sm font-semibold text-[#123b50]";

export default function AdmissionsPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [patients, setPatients] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [rows, setRows] = useState([]);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  // Custom discharge modal state
  const [dischargeTarget, setDischargeTarget] = useState(null);
  const [dischargeBusy, setDischargeBusy] = useState(false);

  const [f, setF] = useState({
    name: "",
    phone: "",
    aadhaar: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    ward: "",
    bedNumber: "",
    reason: "",
  });

  const auth = () => ({
    Authorization: `Bearer ${token}`,
  });

  // Load admissions
  async function loadAdmissions(t = token) {
    if (!t) return;

    try {
      const r = await fetch(`${API}/api/staff/admissions`, {
        headers: {
          Authorization: `Bearer ${t}`,
        },
        cache: "no-store",
      });

      const d = await r.json();

      if (!r.ok || !d.success) {
        throw new Error(d.message || "Unable to load admissions");
      }

      setRows(d.admissions || []);
    } catch (e) {
      setError(e.message || "Unable to load admissions");
    }
  }

  // Authentication
  useEffect(() => {
    const t = sessionStorage.getItem("staffToken");

    if (!t) {
      router.replace("/admin/staff/login");
      return;
    }

    setToken(t);
  }, [router]);

  useEffect(() => {
    if (token) loadAdmissions(token);
  }, [token]);

  // Search existing patients
  useEffect(() => {
    if (!token || isNew || selected) return;

    const timer = setTimeout(async () => {
      try {
        const r = await fetch(
          `${API}/api/staff/patients?q=${encodeURIComponent(q)}`,
          {
            headers: auth(),
          }
        );

        const d = await r.json();
        setPatients(d.patients || []);
      } catch {
        setPatients([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [token, q, isNew, selected]);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 3000);

    return () => clearTimeout(timer);
  }, [notice]);

  // Create admission
  async function submit(e) {
    e.preventDefault();

    setError("");
    setNotice("");
    setBusy(true);

    try {
      const body = {
        patientId: !isNew ? selected?._id : undefined,

        newPatient: isNew
          ? {
              name: f.name,
              phone: f.phone,
              aadhaar: f.aadhaar,
              dateOfBirth: f.dateOfBirth || undefined,
              gender: f.gender || undefined,
              address: f.address || undefined,
            }
          : undefined,

        ward: f.ward,
        bedNumber: f.bedNumber,
        reason: f.reason,
      };

      const r = await fetch(`${API}/api/staff/admissions`, {
        method: "POST",
        headers: {
          ...auth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const d = await r.json();

      if (!r.ok || !d.success) {
        throw new Error(d.message || "Admission failed");
      }

      setNotice("Patient admitted successfully.");

      setSelected(null);
      setQ("");
      setIsNew(false);

      setF((v) => ({
        ...v,
        name: "",
        phone: "",
        aadhaar: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        ward: "",
        bedNumber: "",
        reason: "",
      }));

      await loadAdmissions();
    } catch (e) {
      setError(e.message || "Unable to admit patient");
    } finally {
      setBusy(false);
    }
  }

  // Discharge patient using custom modal
  async function discharge() {
    if (!dischargeTarget) return;

    setDischargeBusy(true);
    setError("");

    try {
      const r = await fetch(
        `${API}/api/staff/admissions/${dischargeTarget._id}/discharge`,
        {
          method: "PATCH",
          headers: auth(),
        }
      );

      const d = await r.json();

      if (!r.ok || !d.success) {
        throw new Error(d.message || "Discharge failed");
      }

      setDischargeTarget(null);
      setNotice("Patient discharged successfully.");

      await loadAdmissions();
    } catch (e) {
      setError(e.message || "Unable to discharge patient");
    } finally {
      setDischargeBusy(false);
    }
  }

  function back() {
    router.push("/admin/staff/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 py-6 text-[#123b50] sm:px-7">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={back}
          className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#dceaf1] bg-white px-4 py-2.5 text-sm font-semibold text-[#16587b] shadow-sm hover:bg-[#eaf3f8]"
        >
          <ArrowLeft size={16} />
          Reception dashboard
        </button>

        {/* Page Header */}
        <div className="mb-6 rounded-2xl bg-[#16587b] p-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <BedDouble size={26} />

            <div>
              <p className="text-xs uppercase tracking-widest text-white/70">
                Reception workspace
              </p>

              <h1 className="text-2xl font-bold">
                Patient admissions
              </h1>
            </div>
          </div>

          <p className="mt-2 text-sm text-white/80">
            Admit existing patients or register a new patient during admission.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800"
          >
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}

        {/* Admission Form */}
        <section className="rounded-2xl border border-[#dceaf1] bg-white p-5 shadow-sm sm:p-7">

          <div className="mb-5">
            <h2 className="text-lg font-bold">Admit patient</h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a registered patient or add a new record.
            </p>
          </div>

          {/* Patient Type */}
          <div className="mb-5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIsNew(false);
                setSelected(null);
              }}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
                !isNew
                  ? "bg-[#16587b] text-white"
                  : "border border-[#dceaf1] text-[#16587b]"
              }`}
            >
              Existing patient
            </button>

            <button
              type="button"
              onClick={() => {
                setIsNew(true);
                setSelected(null);
                setQ("");
              }}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
                isNew
                  ? "bg-[#16587b] text-white"
                  : "border border-[#dceaf1] text-[#16587b]"
              }`}
            >
              New patient
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5">

            {/* Existing Patient */}
            {!isNew ? (
              <div>
                <label className={label}>
                  Search existing patient
                </label>

                {selected ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <div>
                      <p className="font-semibold">
                        {selected.name}
                      </p>

                      <p className="text-sm text-slate-600">
                        {selected.phone}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelected(null);
                        setQ("");
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-800"
                    >
                      <X size={15} />
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search
                      size={17}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />

                    <input
                      className={`${input} pl-10`}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      aria-label="Search patient by name or phone"
                      placeholder="Search by patient name or phone"
                    />

                    {q.trim() && (
                      <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-[#dceaf1] bg-white shadow-lg">

                        {patients.length ? (
                          patients.map((p) => (
                            <button
                              type="button"
                              key={p._id}
                              onClick={() => {
                                setSelected(p);
                                setQ("");
                                setPatients([]);
                              }}
                              className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-[#f4f8fb]"
                            >
                              <span className="block text-sm font-semibold">
                                {p.name}
                              </span>

                              <span className="text-xs text-slate-500">
                                {p.phone}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="p-3 text-sm text-slate-500">
                            No matching patient found.
                          </p>
                        )}

                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* New Patient */
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className={label}>Patient full name</label>
                  <input
                    required
                    className={input}
                    value={f.name}
                    onChange={(e) =>
                      setF({ ...f, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className={label}>Mobile number</label>
                  <input
                    required
                    inputMode="numeric"
                    maxLength={10}
                    className={input}
                    value={f.phone}
                    onChange={(e) =>
                      setF({
                        ...f,
                        phone: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>

                <div>
                  <label className={label}>
                    Aadhaar number (12 digits)
                  </label>
                  <input
                    required
                    inputMode="numeric"
                    maxLength={12}
                    className={input}
                    value={f.aadhaar}
                    onChange={(e) =>
                      setF({
                        ...f,
                        aadhaar: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>

                <div>
                  <label className={label}>Date of birth</label>
                  <input
                    type="date"
                    className={input}
                    value={f.dateOfBirth}
                    onChange={(e) =>
                      setF({ ...f, dateOfBirth: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className={label}>Gender</label>
                  <select
                    className={input}
                    value={f.gender}
                    onChange={(e) =>
                      setF({ ...f, gender: e.target.value })
                    }
                  >
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className={label}>Address</label>
                  <input
                    className={input}
                    value={f.address}
                    onChange={(e) =>
                      setF({ ...f, address: e.target.value })
                    }
                  />
                </div>

              </div>
            )}

            {/* Admission Details */}
            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label className={label}>Ward / department</label>
                <input
                  required
                  className={input}
                  value={f.ward}
                  onChange={(e) =>
                    setF({ ...f, ward: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={label}>Bed number</label>
                <input
                  required
                  className={input}
                  value={f.bedNumber}
                  onChange={(e) =>
                    setF({ ...f, bedNumber: e.target.value })
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className={label}>Reason for admission</label>
                <textarea
                  className={input}
                  rows={3}
                  value={f.reason}
                  onChange={(e) =>
                    setF({ ...f, reason: e.target.value })
                  }
                />
              </div>

            </div>

            <button
              disabled={busy || (!isNew && !selected)}
              className="rounded-xl bg-[#16587b] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#123b50] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Please wait…" : "Confirm admission"}
            </button>

          </form>
        </section>

        {/* Recent Admissions */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-[#dceaf1] p-5">
            <div>
              <h2 className="font-bold">Recent admissions</h2>

              <p className="mt-1 text-xs text-slate-500">
                Manage active and discharged admissions.
              </p>
            </div>

            <button
              onClick={() => loadAdmissions()}
              className="rounded-lg border border-[#dceaf1] p-2 text-[#16587b]"
              aria-label="Refresh admissions"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">

              <thead className="bg-[#f7fafc] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Ward</th>
                  <th className="p-4">Bed</th>
                  <th className="p-4">Admitted</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((a) => (
                  <tr
                    key={a._id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4 font-semibold">
                      {a.patientId?.name || "Patient"}
                      <p className="text-xs font-normal text-slate-500">
                        {a.patientId?.phone}
                      </p>
                    </td>

                    <td className="p-4">{a.ward}</td>
                    <td className="p-4">{a.bedNumber}</td>

                    <td className="p-4">
                      {a.admissionDate
                        ? new Date(a.admissionDate).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          a.status === "ADMITTED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {a.status === "ADMITTED" ? (
                        <button
                          disabled={busy || dischargeBusy}
                          onClick={() => setDischargeTarget(a)}
                          className="rounded-lg border border-[#a9002d] px-3 py-2 text-xs font-semibold text-[#a9002d] hover:bg-red-50 disabled:opacity-50"
                        >
                          Discharge
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">
                          Discharged{" "}
                          {a.dischargeDate
                            ? new Date(a.dischargeDate).toLocaleDateString("en-IN")
                            : ""}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {!rows.length && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No admission records found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </section>

      </div>

      {/* Custom Discharge Confirmation Modal */}
      {dischargeTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="discharge-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#dceaf1] bg-white p-6 shadow-2xl">

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-[#a9002d]">
              <BedDouble size={21} />
            </div>

            <h2
              id="discharge-title"
              className="text-lg font-bold text-[#123b50]"
            >
              Confirm patient discharge
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Discharge{" "}
              <strong>
                {dischargeTarget.patientId?.name || "this patient"}
              </strong>{" "}
              from <strong>{dischargeTarget.ward}</strong>, bed{" "}
              <strong>{dischargeTarget.bedNumber}</strong>?
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                disabled={dischargeBusy}
                onClick={() => setDischargeTarget(null)}
                className="rounded-lg border border-[#dceaf1] px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={dischargeBusy}
                onClick={discharge}
                className="rounded-lg bg-[#a9002d] px-4 py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-60"
              >
                {dischargeBusy ? "Discharging…" : "Confirm discharge"}
              </button>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
