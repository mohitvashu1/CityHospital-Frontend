import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ShieldCheck, HeartPulse } from "lucide-react";

export default function Hero() {
  return (
    <main className="relative overflow-hidden bg-[#F7FAFC]">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#84B3CE]/10" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#16587B]/5" />

      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-16">

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">

          {/* ================= LEFT CONTENT ================= */}
          <div className="max-w-2xl">

            {/* Trust badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#84B3CE]/40 bg-white px-4 py-2 shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#16587B]/10">
                <ShieldCheck
                  size={15}
                  className="text-[#16587B]"
                />
              </span>

              <span className="text-xs font-semibold tracking-wide text-[#16587B] sm:text-sm">
                Trusted Healthcare For Your Family
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#123B50] sm:text-5xl lg:text-6xl">

              Your Health,
              <br />

              <span className="text-[#16587B]">
                Our Priority.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Providing compassionate and reliable healthcare with
              experienced doctors, modern facilities, and patient-focused
              medical services.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/appointment"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16587B] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#124B69] hover:shadow-lg"
              >
                <CalendarDays size={18} />
                Book Appointment
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/doctors"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#84B3CE] bg-white px-6 py-3.5 text-sm font-semibold text-[#16587B] transition-all duration-300 hover:border-[#16587B] hover:bg-[#F0F7FA]"
              >
                Meet Our Doctors
              </Link>

            </div>

            {/* ================= STATS ================= */}
            <div className="mt-10 grid max-w-xl grid-cols-3 border-t border-[#DCEAF1] pt-7">

              <div className="pr-4">
                <div className="flex items-center gap-2">
                  <HeartPulse
                    size={18}
                    className="text-[#A9002D]"
                  />

                  <span className="text-xl font-bold text-[#16587B] sm:text-2xl">
                    10+
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Years Experience
                </p>
              </div>

              <div className="border-l border-[#DCEAF1] px-4">
                <p className="text-xl font-bold text-[#16587B] sm:text-2xl">
                  10K+
                </p>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Happy Patients
                </p>
              </div>

              <div className="border-l border-[#DCEAF1] pl-4">
                <p className="text-xl font-bold text-[#16587B] sm:text-2xl">
                  3+
                </p>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Expert Doctors
                </p>
              </div>

            </div>
          </div>

          {/* ================= RIGHT VISUAL ================= */}
          <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">

            {/* Main image container */}
            <div className="relative overflow-hidden rounded-[32px] bg-[#EAF4F8]">

              {/* Decorative circle */}
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#84B3CE]/30" />

              {/* Doctor image */}
              <div className="relative flex min-h-[420px] items-end justify-center sm:min-h-[500px]">

                {/* 
                  Replace this image with your actual doctor/hero image.
                  Put it inside /public as hero-doctor.png
                */}

                <Image
                  src="/hero-doctor.png"
                  alt="Doctor providing healthcare"
                  width={600}
                  height={650}
                  priority
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className="relative z-10 h-auto w-full object-contain"
                />

              </div>

              {/* Bottom gradient */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#16587B]/10 to-transparent" />
            </div>

            {/* ================= FLOATING CARD ================= */}
            <div className="absolute -bottom-5 left-4 z-20 flex items-center gap-3 rounded-2xl border border-[#DCEAF1] bg-white p-4 shadow-xl sm:left-[-20px]">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16587B]/10">
                <ShieldCheck
                  size={22}
                  className="text-[#16587B]"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-[#123B50]">
                  Trusted Care
                </p>

                <p className="text-xs text-slate-500">
                  Your health matters to us
                </p>
              </div>

            </div>

            {/* Online indicator */}
            <div className="absolute right-3 top-5 z-20 flex items-center gap-2 rounded-full border border-[#DCEAF1] bg-white px-3 py-2 shadow-md sm:right-[-15px]">

              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              <span className="text-xs font-medium text-[#16587B]">
                Healthcare Support
              </span>

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}