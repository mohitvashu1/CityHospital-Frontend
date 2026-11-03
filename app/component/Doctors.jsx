"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Stethoscope } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function Doctors() {
  const sliderRef = useRef(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_URL}/api/doctors`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load doctors");
        return response.json();
      })
      .then((data) => {
        if (mounted) setDoctors(data.doctors || []);
      })
      .catch((error) => console.error("Homepage doctors:", error))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const moveSlider = (direction) => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.querySelector("article");
    if (!card) return;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -(card.offsetWidth + 20) : card.offsetWidth + 20,
      behavior: "smooth",
    });
  };

  return (
    <section className="overflow-hidden bg-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-[#A9002D]" />
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#16587B]">Meet Our Doctors</span>
            <span className="h-[2px] w-8 bg-[#A9002D]" />
          </div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#123B50] sm:text-4xl lg:text-[42px]">
            Experienced Doctors, <span className="text-[#16587B]">Trusted Care</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Meet our dedicated healthcare professionals committed to providing compassionate and patient-focused medical care.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-[#dceaf1] bg-[#f7fafc] py-12 text-center text-sm text-slate-500">
            Loading our medical team...
          </div>
        ) : doctors.length ? (
          <>
            <div className="relative mt-8 sm:mt-10">
              <button type="button" onClick={() => moveSlider("left")} aria-label="Previous doctor"
                className="absolute left-0 top-[115px] z-30 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[#16587B] text-white shadow-lg transition hover:bg-[#124B69] sm:top-[125px] sm:h-11 sm:w-11 lg:hidden">
                <ChevronLeft size={21} />
              </button>
              <button type="button" onClick={() => moveSlider("right")} aria-label="Next doctor"
                className="absolute right-0 top-[115px] z-30 flex h-10 w-10 translate-x-1/2 items-center justify-center rounded-full bg-[#16587B] text-white shadow-lg transition hover:bg-[#124B69] sm:top-[125px] sm:h-11 sm:w-11 lg:hidden">
                <ChevronRight size={21} />
              </button>

              <div ref={sliderRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-2 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
                {doctors.slice(0, 6).map((doctor) => (
                  <article key={doctor._id} className="group min-w-[82%] snap-center overflow-hidden rounded-2xl border border-[#DCEAF1] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#84B3CE] hover:shadow-xl sm:min-w-[48%] lg:min-w-0">
                    <div className="relative h-[230px] overflow-hidden bg-[#EAF4F8] sm:h-[250px]">
                      <img
                        src={doctor.image || "/hero-doctor.png"}
                        alt={doctor.name}
                        onError={(event) => { event.currentTarget.src = "/hero-doctor.png"; }}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#16587B] shadow-md">
                        {doctor.specialization}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-[#123B50]">{doctor.name}</h3>
                      <p className="mt-2 min-h-[48px] text-sm font-medium leading-6 text-[#16587B]">{doctor.qualification}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Stethoscope size={15} className="text-[#84B3CE]" />
                        {doctor.experience || doctor.department || doctor.specialization}
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {doctor.description || "Dedicated to providing compassionate, patient-focused medical care."}
                      </p>
                      <Link href={`/appointment?doctor=${encodeURIComponent(doctor.name)}`}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#16587B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#124B69]">
                        <CalendarDays size={16} /> Book Appointment
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400 lg:hidden">
              <ChevronLeft size={14} /> Swipe to view doctors <ChevronRight size={14} />
            </div>
          </>
        ) : (
          <div className="mt-9 rounded-2xl border border-dashed border-[#b9d2e0] bg-[#f7fafc] px-5 py-10 text-center text-sm text-slate-500">
            Doctor profiles will be displayed here once added by the hospital administration.
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Link href="/doctors" className="inline-flex items-center gap-2 rounded-xl border border-[#16587B] bg-white px-6 py-3 text-sm font-semibold text-[#16587B] transition hover:bg-[#16587B] hover:text-white">
            View All Doctors <ChevronRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
