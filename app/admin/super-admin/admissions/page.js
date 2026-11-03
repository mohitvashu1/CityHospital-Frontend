"use client";

import { useEffect, useState } from "react";
import { BedDouble, RefreshCw, X, AlertTriangle } from "lucide-react";
import AdminShell, {
  adminFetch,
  Alert,
  Panel,
  Table,
  fieldClass,
  primaryButton,
  secondaryButton,
} from "../_components/AdminShell";

export default function AdmissionsPage() {
  const [patients, setPatients] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ patientId: "", ward: "", bedNumber: "", reason: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [dischargeTarget, setDischargeTarget] = useState(null);
  const [discharging, setDischarging] = useState(false);

  async function load() {
    setError("");
    try {
      const [admissionData, patientData] = await Promise.all([
        adminFetch(`/api/admin/admissions${showAll ? "?status=all" : ""}`),
        adminFetch("/api/admin/patients"),
      ]);
      setRows(admissionData.admissions || []);
      setPatients(patientData.patients || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, [showAll]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const data = await adminFetch("/api/admin/admissions", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setNotice(data.message);
      setForm({ patientId: "", ward: "", bedNumber: "", reason: "" });
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function confirmDischarge() {
    if (!dischargeTarget) return;
    setDischarging(true);
    setError("");
    try {
      const data = await adminFetch(`/api/admin/admissions/${dischargeTarget._id}/discharge`, {
        method: "PATCH",
        body: JSON.stringify({}),
      });
      setNotice(data.message);
      setDischargeTarget(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDischarging(false);
    }
  }

  return (
    <AdminShell
      title="Inpatient Admissions"
      subtitle="Track admitted patients, ward and bed assignment, and discharge status."
      actions={
        <>
          <button className={secondaryButton} onClick={() => setShowAll((value) => !value)}>
            {showAll ? "Active only" : "Show all admissions"}
          </button>
          <button className={secondaryButton} onClick={load}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className={primaryButton} onClick={() => setShowForm((value) => !value)}>
            <BedDouble size={16} /> Admit Patient
          </button>
        </>
      }
    >
      <Alert error={error} notice={notice} />

      {showForm && (
        <div className="mb-5">
          <Panel title="New Admission" description="Select an existing patient and assign a ward and bed.">
            <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold sm:col-span-2">
                Patient
                <select required className={`${fieldClass} mt-2`} value={form.patientId}
                  onChange={(event) => setForm({ ...form, patientId: event.target.value })}>
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>{patient.name} · {patient.phone}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Ward
                <input required maxLength={80} className={`${fieldClass} mt-2`} value={form.ward}
                  onChange={(event) => setForm({ ...form, ward: event.target.value })} placeholder="e.g. General Ward" />
              </label>
              <label className="text-sm font-bold">
                Bed number
                <input required maxLength={30} className={`${fieldClass} mt-2`} value={form.bedNumber}
                  onChange={(event) => setForm({ ...form, bedNumber: event.target.value })} placeholder="e.g. G-12" />
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Admission reason (optional)
                <textarea className={`${fieldClass} mt-2`} value={form.reason}
                  onChange={(event) => setForm({ ...form, reason: event.target.value })} />
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <button className={primaryButton}>Save Admission</button>
                <button type="button" className={secondaryButton} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </Panel>
        </div>
      )}

      <Panel title={showAll ? "Admission History" : "Currently Admitted Patients"} description={`${rows.length} admission records`}>
        <Table
          columns={[
            { key: "patient", label: "Patient", render: (row) => <><b>{row.patientId?.name || "Unknown patient"}</b><span className="block text-xs text-gray-500">{row.patientId?.phone || ""}</span></> },
            { key: "ward", label: "Ward" },
            { key: "bedNumber", label: "Bed" },
            { key: "admissionDate", label: "Admitted", render: (row) => new Date(row.admissionDate).toLocaleDateString("en-IN") },
            { key: "status", label: "Status", render: (row) => <span className={row.status === "ADMITTED" ? "font-extrabold text-green-700" : "font-bold text-gray-500"}>{row.status}</span> },
            { key: "action", label: "Action", render: (row) => row.status === "ADMITTED"
              ? <button className="rounded-lg border border-[#a9002d] px-3 py-1.5 text-xs font-bold text-[#a9002d] transition hover:bg-[#a9002d] hover:text-white" onClick={() => setDischargeTarget(row)}>Discharge</button>
              : row.dischargeDate ? new Date(row.dischargeDate).toLocaleDateString("en-IN") : "—" },
          ]}
          rows={rows}
          empty="No admission records found."
        />
      </Panel>

      {dischargeTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget && !discharging) setDischargeTarget(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="discharge-title"
            className="w-full max-w-md rounded-2xl border border-[#dceaf1] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-[#a9002d]">
                <AlertTriangle size={22} />
              </div>
              <button type="button" aria-label="Close confirmation" disabled={discharging}
                onClick={() => setDischargeTarget(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X size={19} />
              </button>
            </div>
            <h2 id="discharge-title" className="mt-4 text-xl font-bold text-[#123b50]">Confirm patient discharge</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Are you sure you want to discharge <strong>{dischargeTarget.patientId?.name || "this patient"}</strong>
              {dischargeTarget.ward ? ` from ${dischargeTarget.ward}` : ""}? This will update the admission status to discharged.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" disabled={discharging} onClick={() => setDischargeTarget(null)} className={secondaryButton}>Cancel</button>
              <button type="button" disabled={discharging} onClick={confirmDischarge}
                className="inline-flex items-center justify-center rounded-lg border border-[#a9002d] bg-[#a9002d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#870024] disabled:cursor-not-allowed disabled:opacity-60">
                {discharging ? "Discharging..." : "Confirm Discharge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
