"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell, {
  adminFetch,
  Alert,
  Panel,
  fieldClass,
  primaryButton,
  secondaryButton,
} from "../../_components/AdminShell";

const initialForm = {
  name: "",
  email: "",
  password: "",
  specialization: "",
  qualification: "",
  registrationNumber: "",
  phone: "",
  department: "",
  image: "",
  experience: "",
  description: "",
  tags: "",
};

const fields = [
  ["name", "Full name", "text", true],
  ["email", "Doctor login email", "email", true],
  ["password", "Temporary password (12+ characters)", "password", true],
  ["specialization", "Specialty", "text", true],
  ["qualification", "Qualification", "text", true],
  ["registrationNumber", "Medical registration number", "text", true],
  ["phone", "Mobile number", "tel", false],
  ["department", "Department", "text", false],
  ["image", "Profile image path or URL", "text", false],
  ["experience", "Experience / role label", "text", false],
];

export default function AddDoctorPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };
      const data = await adminFetch("/api/admin/doctors", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setNotice(data.message || "Doctor profile created successfully.");
      setTimeout(() => router.push("/admin/super-admin/doctors"), 700);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell
      title="Add Doctor"
      subtitle="Create the doctor's login account and public profile in one place."
      actions={
        <button className={secondaryButton} onClick={() => router.push("/admin/super-admin/doctors")}>
          Back to doctors
        </button>
      }
    >
      <Alert error={error} notice={notice} />

      <Panel
        title="Doctor Profile & Login"
        description="The profile details entered here will appear on the homepage and Doctors page when the account is active."
      >
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {fields.map(([key, label, type, required]) => (
            <label key={key} className={`block text-sm font-semibold text-[#254a5d] ${key === "password" ? "sm:col-span-2" : ""}`}>
              {label}{required && <span className="text-[#a9002d]"> *</span>}
              <input
                type={type}
                required={required}
                minLength={key === "password" ? 12 : undefined}
                maxLength={key === "password" ? 128 : key === "image" ? 500 : 254}
                className={`${fieldClass} mt-2`}
                value={form[key]}
                onChange={(event) => update(key, event.target.value)}
                placeholder={key === "image" ? "/doctors/doctor-name.jpg or https://..." : ""}
              />
            </label>
          ))}

          <label className="block text-sm font-semibold text-[#254a5d] sm:col-span-2">
            Profile description
            <textarea
              rows={4}
              maxLength={1200}
              className={`${fieldClass} mt-2`}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Write a short introduction about the doctor..."
            />
          </label>

          <label className="block text-sm font-semibold text-[#254a5d] sm:col-span-2">
            Profile tags (comma separated)
            <input
              className={`${fieldClass} mt-2`}
              value={form.tags}
              onChange={(event) => update("tags", event.target.value)}
              placeholder="General Medicine, Diabetes Care, Internal Medicine"
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">
              Up to 12 tags. These help patients filter doctors by specialty.
            </span>
          </label>

          {form.image && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-[#254a5d]">Image preview</p>
              <img
                src={form.image}
                alt="Doctor profile preview"
                className="h-40 w-36 rounded-xl border border-[#dceaf1] bg-[#f7fafc] object-cover"
                onError={(event) => { event.currentTarget.style.display = "none"; }}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button disabled={saving} className={primaryButton}>
              {saving ? "Creating..." : "Create Doctor Profile"}
            </button>
            <button type="button" className={secondaryButton} onClick={() => router.back()}>
              Cancel
            </button>
          </div>
        </form>
      </Panel>
    </AdminShell>
  );
}
