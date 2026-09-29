
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, CalendarDays, Stethoscope, Users, HeartPulse } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. P.C. Rai",
    qualification: "M.B.B.S., M.D. (General Medicine), CPCDM",
    specialty: "General Medicine",
    description:
      "Focused on diagnosis, treatment and ongoing care for a wide range of medical conditions.",
    image: "/doctors/dr-pc-rai1.png",
    tags: ["General Medicine", "Diabetes Care", "Internal Medicine"],
  },
  {
    id: 2,
    name: "Dr. Rashmi Rai",
    qualification: "M.S. (Obstetrics & Gynecology)",
    specialty: "Gynecology",
    description:
      "Providing care for women's health, pregnancy, maternity and fertility-related concerns.",
    image: "/doctors/dr-rashmi-rai.jpeg",
    tags: ["Gynecology", "Maternity Care", "Infertility"],
  },
  {
    id: 3,
    name: "Dr. Abhishek Kumar",
    qualification: "M.B.B.S., M.S. (General Physician)",
    specialty: "General Physician",
    description:
      "Providing general medical consultation, health assessment and patient-focused care.",
    image: "/doctors/dr-abhishek-kumar.png",
    tags: ["General Physician", "General Medicine"],
  },
];

const specialties = [
  "All Doctors",
  "General Medicine",
  "Gynecology",
  "General Physician",
  "Infertility",
  "Maternity Care",
  "Diabetes Care",
];

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("All Doctors");

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const searchableText = [
        doctor.name,
        doctor.qualification,
        doctor.specialty,
        doctor.description,
        ...doctor.tags,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesSpecialty =
        activeSpecialty === "All Doctors" ||
        doctor.tags.some(
          (tag) => tag.toLowerCase() === activeSpecialty.toLowerCase()
        ) ||
        doctor.specialty.toLowerCase() === activeSpecialty.toLowerCase();

      return matchesSearch && matchesSpecialty;
    });
  }, [search, activeSpecialty]);

  const clearFilters = () => {
    setSearch("");
    setActiveSpecialty("All Doctors");
  };

  return (
    <main className="min-h-screen bg-[#f7fafc] text-[#123b50]">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-[#16587b]">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <Stethoscope size={16} />
              City Hospital, Buxar
            </div>

            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Meet Our Doctors
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Find the right doctor for your healthcare needs. Explore our
              doctors by name or specialization and book an appointment.
            </p>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <Users size={18} />
                Experienced Medical Team
              </div>
              <div className="flex items-center gap-2">
                <HeartPulse size={18} />
                Patient-focused Care
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="relative z-10 mx-auto -mt-7 max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-[#dceaf1] bg-white p-4 shadow-[0_12px_40px_rgba(18,59,80,0.08)] sm:p-6">
          <label
            htmlFor="doctor-search"
            className="mb-3 block text-sm font-semibold text-[#123b50]"
          >
            Search doctors
          </label>

          <div className="flex h-12 items-center gap-3 rounded-xl border border-[#dceaf1] bg-[#f7fafc] px-4 transition focus-within:border-[#16587b] focus-within:ring-2 focus-within:ring-[#16587b]/10">
            <Search size={20} className="shrink-0 text-[#16587b]" />

            <input
              id="doctor-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by doctor name, degree or specialization..."
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#123b50] outline-none placeholder:text-slate-400 sm:text-base"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="rounded-full p-1 text-slate-500 transition hover:bg-[#dceaf1] hover:text-[#123b50]"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-[#123b50]">
              Browse by specialty
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {specialties.map((specialty) => {
                const isActive = activeSpecialty === specialty;

                return (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => setActiveSpecialty(specialty)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-[#16587b] bg-[#16587b] text-white"
                        : "border-[#dceaf1] bg-white text-[#16587b] hover:border-[#16587b] hover:bg-[#f0f7fa]"
                    }`}
                  >
                    {specialty}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Results */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a9002d]">
              Our Medical Team
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#123b50] sm:text-3xl">
              Our Doctors
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {filteredDoctors.length}{" "}
              {filteredDoctors.length === 1 ? "doctor" : "doctors"} found
            </p>
          </div>

          {(search || activeSpecialty !== "All Doctors") && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#a9002d] transition hover:bg-[#a9002d]/5"
            >
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dceaf1] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#84b3ce] hover:shadow-[0_16px_40px_rgba(18,59,80,0.10)]"
              >
                <div className="relative flex h-64 items-end justify-center overflow-hidden bg-[#eaf3f8] sm:h-72">
                  <div className="absolute left-4 top-4 z-10 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#16587b] shadow-sm">
                    {doctor.specialty}
                  </div>

                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-contain object-bottom transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-xl font-bold text-[#123b50]">
                    {doctor.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-[#16587b]">
                    {doctor.qualification}
                  </p>

                  <div className="my-4 h-px bg-[#dceaf1]" />

                  <p className="flex-1 text-sm leading-6 text-slate-600">
                    {doctor.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {doctor.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f0f7fa] px-3 py-1.5 text-xs font-medium text-[#16587b]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/appointment?doctor=${encodeURIComponent(doctor.name)}`}
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#16587b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#104662] focus:outline-none focus:ring-2 focus:ring-[#16587b] focus:ring-offset-2"
                  >
                    <CalendarDays size={17} />
                    Book Appointment
                    <ArrowRight
                      size={17}
                      className="ml-auto transition group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#b9d2e0] bg-white px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f7fa] text-[#16587b]">
              <Search size={25} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#123b50]">
              No doctors found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find a doctor matching your search. Try another name
              or choose a different specialty.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-[#16587b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#104662]"
            >
              Show all doctors
            </button>
          </div>
        )}
      </section>

      {/* Appointment CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#eaf3f8] p-6 sm:p-8 md:flex-row md:items-center lg:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#a9002d]">
              Need medical assistance?
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#123b50] sm:text-3xl">
              Book your appointment today
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Schedule a consultation with our medical team at City Hospital,
              Buxar.
            </p>
          </div>

          <Link
            href="/appointment"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-[#a9002d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#870024]"
          >
            Book Appointment
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}