
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, MoreHorizontal } from "lucide-react";
import AdminShell, {
  adminFetch,
  Alert,
  Panel,
  Table,
  primaryButton,
} from "../_components/AdminShell";

export default function StaffPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const data = await adminFetch("/api/admin/users?role=RECEPTIONIST");
      setRows(data.users || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminShell
      title="Reception Staff Management"
      subtitle={`${rows.length} receptionist account${rows.length === 1 ? "" : "s"}`}
      actions={
        <button
          className={primaryButton}
          onClick={() => router.push("/admin/super-admin/staff/add")}
        >
          <UserPlus size={16} /> Add Staff
        </button>
      }
    >
      <Alert error={error} />

      <Panel
        title="Reception Staff Directory"
        description="Reception accounts are kept separate from doctor accounts."
      >
        <Table
          columns={[
            {
              key: "name",
              label: "Staff name",
              render: (r) => (
                <div className="flex items-center gap-2">
                  {r.profileImage && (
                    <img
                      src={r.profileImage}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  )}
                  <b>{r.name}</b>
                </div>
              ),
            },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            {
              key: "active",
              label: "Account status",
              render: (r) => (
                <span
                  className={
                    r.active
                      ? "font-bold text-green-700"
                      : "font-bold text-red-700"
                  }
                >
                  {r.active ? "Active" : "Inactive"}
                </span>
              ),
            },
            {
              key: "createdAt",
              label: "Created",
              render: (r) =>
                r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("en-IN")
                  : "—",
            },
            {
              key: "actions",
              label: "More actions",
              render: (r) => (
                <details className="relative">
                  <summary className="flex w-fit cursor-pointer list-none items-center gap-1 rounded-md border px-3 py-2 text-sm font-bold text-[#16587b]">
                    <MoreHorizontal size={16} /> Actions
                  </summary>
                  <div className="absolute right-0 z-20 mt-1 min-w-40 rounded-lg border bg-white p-1 shadow-lg">
                    <button
                      className="w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-50"
                      onClick={() =>
                        router.push(`/admin/super-admin/staff/${r._id}`)
                      }
                    >
                      View / edit profile
                    </button>
                  </div>
                </details>
              ),
            },
          ]}
          rows={rows}
          empty="No reception staff accounts found."
        />
      </Panel>
    </AdminShell>
  );
}
