"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Stethoscope,
} from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. P.C. Rai",
    qualification: "M.B.B.S., M.D. (General Medicine), CPCDM",
    specialty: "General Medicine",
    experience: "Experienced Physician",
    image: "/doctors/dr-pc-rai.png",
    description:
      "Providing comprehensive medical care with a focus on diagnosis, treatment and long-term health management.",
  },
  {
    id: 2,
    name: "Dr. Rashmi Rai",
    qualification:
      "M.S. (Obstetrics & Gynecology), Infertility Specialist",
    specialty: "Obstetrics & Gynecology",
    experience: "Infertility & Women's Health",
    image: "/doctors/dr-rashmi-rai.png",
    description:
      "Focused on women's health, pregnancy care, gynecology and fertility-related treatments.",
  },
  {
    id: 3,
    name: "Dr. Abhishek Kumar",
    qualification: "M.B.B.S., M.S. (General Medicine)",
    specialty: "General Medicine",
    experience: "Medical Care",
    image: "/doctors/dr-abhishek-kumar.png",
    description:
      "Dedicated to providing patient-focused medical consultation, diagnosis and personalized treatment.",
  },
];

export default function Doctors() {
  const sliderRef = useRef(null);

  const moveSlider = (direction) => {
    if (!sliderRef.current) return;

    const card = sliderRef.current.querySelector("article");

    if (!card) return;

    const cardWidth = card.offsetWidth + 20;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* ================= HEADER ================= */}
        <div className="mx-auto max-w-2xl text-center">

          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-[#A9002D]" />

            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#16587B]">
              Meet Our Doctors
            </span>

            <span className="h-[2px] w-8 bg-[#A9002D]" />
          </div>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#123B50] sm:text-4xl lg:text-[42px]">
            Experienced Doctors,
            <span className="text-[#16587B]"> Trusted Care</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Meet our dedicated healthcare professionals committed to providing
            compassionate and patient-focused medical care.
          </p>
        </div>

        {/* ================= DOCTOR SLIDER ================= */}
        <div className="relative mt-10 sm:mt-12">

          {/* LEFT BUTTON */}
          <button
            type="button"
            onClick={() => moveSlider("left")}
            aria-label="Previous doctor"
            className="absolute left-0 top-[145px] z-30 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[#16587B] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#124B69] sm:h-11 sm:w-11 lg:hidden"
          >
            <ChevronLeft size={22} />
          </button>

          {/* RIGHT BUTTON */}
          <button
            type="button"
            onClick={() => moveSlider("right")}
            aria-label="Next doctor"
            className="absolute right-0 top-[145px] z-30 flex h-10 w-10 translate-x-1/2 items-center justify-center rounded-full bg-[#16587B] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#124B69] sm:h-11 sm:w-11 lg:hidden"
          >
            <ChevronRight size={22} />
          </button>

          {/* SLIDER */}
          <div
  ref={sliderRef}
  className="flex gap-5 overflow-x-auto scroll-smooth px-2 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
>
            {doctors.map((doctor) => (
              <article
                key={doctor.id}
                className="group min-w-[82%] snap-center overflow-hidden rounded-2xl border border-[#DCEAF1] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#84B3CE] hover:shadow-xl sm:min-w-[48%] lg:min-w-0"  
              >

                {/* ================= PHOTO ================= */}
                <div className="relative h-[230px] overflow-hidden bg-[#EAF4F8] sm:h-[250px]">

                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={600}
                    height={700}
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 33vw"
                    className="
                      h-full
                      w-full
                      object-cover
                      object-top
                      transition-transform
                      duration-500
                      group-hover:scale-[1.03]
                    "
                  />

                  {/* Specialty */}
                  <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#16587B] shadow-md backdrop-blur">
                    {doctor.specialty}
                  </div>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-5">

                  <h3 className="text-xl font-bold text-[#123B50]">
                    {doctor.name}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-sm font-medium leading-6 text-[#16587B]">
                    {doctor.qualification}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Stethoscope
                      size={15}
                      className="text-[#84B3CE]"
                    />

                    {doctor.experience}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {doctor.description}
                  </p>

                  {/* Appointment */}
                  <Link
                    href="/appointment"
                    className="
                      mt-5
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#16587B]
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#124B69]
                    "
                  >
                    <CalendarDays size={16} />
                    Book Appointment
                  </Link>

                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ================= MOBILE SWIPE HINT ================= */}
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400 sm:hidden">
          <ChevronLeft size={14} />
          Swipe to view doctors
          <ChevronRight size={14} />
        </div>

        {/* ================= VIEW ALL ================= */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/doctors"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#16587B]
              bg-white
              px-6
              py-3
              text-sm
              font-semibold
              text-[#16587B]
              transition
              hover:bg-[#16587B]
              hover:text-white
            "
          >
            View All Doctors
            <ChevronRight size={17} />
          </Link>
        </div>

      </div>
    </section>
  );
}