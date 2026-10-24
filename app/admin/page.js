
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Stethoscope,
  Users,
  ArrowRight,
  Building2,
} from "lucide-react";

const portals = [
  {
    title: "Super Admin",
    subtitle: "Hospital administration",
    description:
      "Manage doctors, staff accounts, patients, appointments and hospital operations.",
    href: "/admin/super-admin/login",
    icon: ShieldCheck,
    label: "ADMINISTRATION",
  },
  {
    title: "Doctor Portal",
    subtitle: "Clinical workspace",
    description:
      "Review today's OPD, access patient history and manage consultations and prescriptions.",
    href: "/admin/doctor/login",
    icon: Stethoscope,
    label: "CLINICAL ACCESS",
  },
  {
    title: "Staff Portal",
    subtitle: "Hospital operations",
    description:
      "Handle reception workflows, patient registration and appointment queues.",
    href: "/admin/staff/login",
    icon: Users,
    label: "STAFF ACCESS",
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f7fafc] text-[#123b50]">
      

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16">
        {/* Page heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#dceaf1] bg-white text-[#16587b]">
            <Building2 size={24} strokeWidth={1.7} />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#a9002d]">
            City Hospital · Buxar
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#123b50] sm:text-4xl">
            Hospital Management Portal
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Choose your portal to access hospital services and management
            tools. Your account permissions determine which features are
            available to you.
          </p>
        </div>

        {/* Portal cards */}
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {portals.map((portal) => {
            const Icon = portal.icon;

            return (
              <article
                key={portal.title}
                className="group flex min-h-[320px] flex-col rounded-xl border border-[#dceaf1] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#84b3ce] hover:shadow-lg hover:shadow-[#16587b]/5 sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf3f8] text-[#16587b] transition-colors group-hover:bg-[#16587b] group-hover:text-white">
                    <Icon size={23} strokeWidth={1.7} />
                  </div>

                  <span className="rounded-md border border-[#dceaf1] bg-[#f7fafc] px-2.5 py-1 text-[11px] font-medium text-[#16587b]">
                    Secure portal
                  </span>
                </div>

                <p className="mt-7 text-[11px] font-medium tracking-[0.12em] text-[#a9002d]">
                  {portal.label}
                </p>

                <h2 className="mt-2 text-xl font-medium tracking-tight text-[#123b50]">
                  {portal.title}
                </h2>

                <p className="mt-1 text-sm text-[#16587b]">
                  {portal.subtitle}
                </p>

                <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                  {portal.description}
                </p>

                <Link
                  href={portal.href}
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#16587b] bg-[#16587b] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#123b50] hover:bg-[#123b50] focus:outline-none focus:ring-4 focus:ring-[#16587b]/15"
                >
                  Continue to login
                  <ArrowRight
                    size={16}
                    strokeWidth={1.8}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </article>
            );
          })}
        </div>

        {/* Security notice */}
        <div className="mx-auto mt-8 flex max-w-6xl items-start gap-3 rounded-xl border border-[#dceaf1] bg-white p-4 sm:p-5">
          <ShieldCheck
            size={20}
            strokeWidth={1.7}
            className="mt-0.5 shrink-0 text-[#16587b]"
          />

          <div>
            <h3 className="text-sm font-medium text-[#123b50]">
              Secure hospital access
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              Sign in using the credentials issued by hospital management.
              Access to patient records and administrative functions is
              controlled by your account permissions.
            </p>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} City Hospital, Buxar, Bihar. All rights
          reserved.
        </footer>
      </section>
    </main>
  );
}
