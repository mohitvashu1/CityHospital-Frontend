"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Stethoscope,
  PhoneCall,
  CalendarDays,
} from "lucide-react";

const quickInfo = [
  {
    id: 1,
    title: "Specialties",
    description:
      "Comprehensive medical care for your healthcare needs.",
    linkText: "Explore Specialties",
    link: "/services",
    icon: Stethoscope,
    type: "light",
  },
  {
    id: 2,
    title: "24/7 Emergency Care",
    description:
      "Our emergency team is ready to provide immediate care when you need it.",
    linkText: "Emergency Support",
    link: "/contact",
    icon: PhoneCall,
    type: "primary",
    phone: "+91 XXXXX XXXXX",
  },
  {
    id: 3,
    title: "Book Appointment",
    description:
      "Schedule an appointment with our experienced doctors.",
    linkText: "Book Now",
    link: "/appointment",
    icon: CalendarDays,
    type: "light",
  },
];

export default function QuickInfo() {
  const sliderRef = useRef(null);

  const moveSlider = (direction) => {
    if (!sliderRef.current) return;

    const card = sliderRef.current.querySelector("article");

    if (!card) return;

    const cardWidth = card.offsetWidth + 16;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="overflow-hidden bg-[#F7FAFC] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* ================= MOBILE SLIDER AREA ================= */}
        <div className="relative">

          {/* Left Arrow - Mobile Only */}
          <button
            type="button"
            onClick={() => moveSlider("left")}
            aria-label="Previous information"
            className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#16587B] text-white shadow-lg transition hover:bg-[#123B50] lg:hidden"
          >
            <ChevronLeft size={19} />
          </button>

          {/* Right Arrow - Mobile Only */}
          <button
            type="button"
            onClick={() => moveSlider("right")}
            aria-label="Next information"
            className="absolute right-0 top-1/2 z-20 flex h-9 w-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#16587B] text-white shadow-lg transition hover:bg-[#123B50] lg:hidden"
          >
            <ChevronRight size={19} />
          </button>

          {/* Cards */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible"
          >
            {quickInfo.map((item) => {
              const Icon = item.icon;
              const isPrimary = item.type === "primary";

              return (
                <article
                  key={item.id}
                  className={`group relative min-w-[88%] overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 sm:min-w-[55%] lg:min-w-0 ${
                    isPrimary
                      ? "border-[#16587B] bg-[#16587B] text-white"
                      : "border-[#DCEAF1] bg-white text-[#123B50] hover:-translate-y-1 hover:border-[#84B3CE] hover:shadow-md"
                  }`}
                >
                  {/* Decorative Circle */}
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${
                      isPrimary
                        ? "bg-[#84B3CE]/20"
                        : "bg-[#84B3CE]/10"
                    }`}
                  />

                  <div className="relative flex items-center justify-between gap-4">

                    {/* Text */}
                    <div className="min-w-0 flex-1">

                      <h3
                        className={`text-lg font-bold sm:text-xl ${
                          isPrimary
                            ? "text-white"
                            : "text-[#123B50]"
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`mt-2 max-w-[300px] text-xs leading-5 sm:text-sm ${
                          isPrimary
                            ? "text-white/80"
                            : "text-slate-600"
                        }`}
                      >
                        {item.description}
                      </p>

                      {item.phone && (
                        <div className="mt-3 flex items-center gap-2">
                          <PhoneCall size={14} />
                          <span className="text-xs font-semibold">
                            {item.phone}
                          </span>
                        </div>
                      )}

                      <Link
                        href={item.link}
                        className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold sm:text-sm ${
                          isPrimary
                            ? "text-white hover:text-[#DCEAF1]"
                            : "text-[#16587B] hover:text-[#A9002D]"
                        }`}
                      >
                        {item.linkText}
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>

                    {/* Icon */}
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                        isPrimary
                          ? "bg-white/10 text-white"
                          : "bg-[#16587B]/10 text-[#16587B]"
                      }`}
                    >
                      <Icon size={28} strokeWidth={1.7} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        
      </div>
    </section>
  );
}