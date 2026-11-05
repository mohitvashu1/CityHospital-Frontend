"use client";
import { useRef, useState } from "react";
import { API_URL, getAdminToken } from "./AdminShell";

export default function ImageUpload({ value, onChange, folder = "doctors", label = "Profile image" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  async function choose(event) {
    const file = event.target.files?.[0]; if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) { setError("Choose an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be 5 MB or smaller."); return; }
    const body = new FormData(); body.append("folder", folder); body.append("image", file);
    setUploading(true);
    try {
      const response = await fetch(`${API_URL}/api/uploads/image`, { method: "POST", headers: { Authorization: `Bearer ${getAdminToken()}` }, body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Image upload failed");
      onChange(data.image);
    } catch (err) { setError(err.message); } finally { setUploading(false); event.target.value = ""; }
  }
  return <div className="sm:col-span-2">
    <label className="block text-sm font-semibold text-[#254a5d]">{label}</label>
    <div className="mt-2 flex flex-wrap items-center gap-4">
      {value ? <img src={value} alt="Profile preview" className="h-24 w-24 rounded-xl border border-[#dceaf1] object-cover"/> : <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-[#9bb8c8] bg-[#f7fafc] text-xs text-slate-500">No image</div>}
      <div><input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={choose} className="hidden"/><button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className="rounded-md border-2 border-[#16587b] px-4 py-2 text-sm font-bold text-[#16587b] disabled:opacity-50">{uploading ? "Uploading…" : value ? "Change image" : "Choose image"}</button><p className="mt-1 text-xs text-slate-500">Select from gallery · JPG, PNG, WEBP · Max 5 MB</p>{error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}</div>
    </div>
  </div>;
}
