
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

export default function DoctorsPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await adminFetch("/api/admin/doctors");
      setRows(data.doctors || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminShell
      title="Doctor Management"
      subtitle={`${rows.length} doctor profiles`}
      actions={
        <button
          className={primaryButton}
          onClick={() => router.push("/admin/super-admin/doctors/add")}
        >
          <UserPlus size={16} /> Add Doctor
        </button>
      }
    >
      <Alert error={error} />

      <Panel
        title="Doctors Directory"
        description="Manage doctor profiles and login accounts."
      >
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading doctors…
          </p>
        ) : (
          <Table
            columns={[
              {
                key: "name",
                label: "Doctor",
                render: (r) => (
                  <div className="flex items-center gap-2">
                    {r.image && (
                      <img
                        src={r.image}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    )}
                    <b>{r.name}</b>
                  </div>
                ),
              },
              { key: "specialization", label: "Specialty" },
              { key: "qualification", label: "Qualification" },
              { key: "email", label: "Email" },
              {
                key: "account",
                label: "Login status",
                render: (r) =>
                  r.account?.active ? (
                    <span className="font-bold text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="font-bold text-red-700">
                      Inactive / missing
                    </span>
                  ),
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
                          router.push(`/admin/super-admin/doctors/${r._id}`)
                        }
                      >
                        View profile
                      </button>

                      <button
                        className="w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-50"
                        onClick={() =>
                          router.push(
                            `/admin/super-admin/doctors/${r._id}?edit=1`
                          )
                        }
                      >
                        Edit profile
                      </button>
                    </div>
                  </details>
                ),
              },
            ]}
            rows={rows}
            empty="No doctor profiles found."
          />
        )}
      </Panel>
    </AdminShell>
  );
}
