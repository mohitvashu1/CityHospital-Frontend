
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function PatientLoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
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
        body: {
          phone: phone.trim(),
          aadhaar: aadhaar.trim(),
        },
      });

      if (!data.token) {
        throw new Error(
          "Login response did not include an authentication token."
        );
      }

      // Temporary development authentication.
      // Never store the Aadhaar number in browser storage.
      sessionStorage.setItem("patientToken", data.token);

      if (data.patient) {
        sessionStorage.setItem(
          "patient",
          JSON.stringify(data.patient)
        );
      }

      router.push("/patient/dashboard");
    } catch (err) {
      setError(
        err.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7fafc] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#dceaf1] bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#16587b]">
            City Hospital
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Patient Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-[#123b50]"
            >
              Mobile Number
            </label>

            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              placeholder="Enter 10-digit mobile number"
              required
              className="w-full rounded-lg border border-[#dceaf1] px-4 py-3 outline-none focus:border-[#16587b] focus:ring-2 focus:ring-[#84b3ce]"
            />
          </div>

          <div>
            <label
              htmlFor="aadhaar"
              className="mb-2 block text-sm font-medium text-[#123b50]"
            >
              Aadhaar Number
            </label>

            <input
              id="aadhaar"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={12}
              value={aadhaar}
              onChange={(e) =>
                setAadhaar(
                  e.target.value.replace(/\D/g, "").slice(0, 12)
                )
              }
              placeholder="Enter 12-digit Aadhaar number"
              required
              className="w-full rounded-lg border border-[#dceaf1] px-4 py-3 outline-none focus:border-[#16587b] focus:ring-2 focus:ring-[#84b3ce]"
            />

            <p className="mt-1 text-xs text-gray-500">
              Use the credentials registered with the hospital.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#16587b] px-4 py-3 font-semibold text-white transition hover:bg-[#123b50] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          City Hospital, Buxar, Bihar
        </p>
      </section>
    </main>
  );
}
