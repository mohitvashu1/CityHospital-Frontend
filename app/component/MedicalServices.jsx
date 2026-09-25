"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const services = [
  {
    id: 1,
    title: "General Medicine",
    category: "Medicine Center",
    image: "/services/general-medicine.png",
    description:
      "Comprehensive medical care for a wide range of acute and chronic health conditions.",
    points: [
      "ICU / Critical Care",
      "Gastroenterology",
      "Liver and digestive diseases",
      "Diabetes",
      "Heart diseases",
      "Jaundice",
      "Asthma / respiratory conditions",
      "Blood pressure",
      "Heart attack",
      "Heart failure",
      "Urology / kidney diseases",
      "Thyroid diseases",
      "Paralysis",
    ],
   
  },

  {
    id: 2,
     title: "Normal Delivery",
    category: "Maternity Care",
    image: "/services/normal-delivery.png",
    description:
      "Compassionate maternity care with dedicated support throughout pregnancy and delivery.",
    points: [
      "Pregnancy care",
      "Normal delivery",
      "Mother & baby care",
      "Post-delivery support",
    ],
    
  },

  {
    id: 3,
    title: "Women's Health",
    category: "Gynecology & Fertility",
    image: "/services/womens-health.png",
    description:
      "Specialized care for women's health, pregnancy, fertility and gynecological conditions.",
    points: [
      "Women's health check-ups",
      "Infertility treatment",
      "High-risk pregnancy care",
      "PCOD treatment",
      "White discharge-related conditions",
      "Pregnancy care",
      "Family-planning counselling",
      "Breast and uterine/fibroid lumps",
      "Ovulation/egg-related problems",
      "Fallopian tube blockage",
      "Irregular periods",
      "Ovarian cysts",
      "Recurrent pregnancy loss",
      "IUI fertility treatment",
    ],
  },
];

export default function MedicalServices() {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: -sliderRef.current.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: sliderRef.current.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* ================= HEADER ================= */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-[2px] w-8 bg-[#A9002D]" />

              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#16587B]">
                Our Medical Services
              </span>
            </div>

            <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#123B50] sm:text-4xl lg:text-[42px]">
              Complete Care For{" "}
              <span className="text-[#16587B]">Your Health</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Our hospital provides comprehensive medical care with
              experienced healthcare professionals and patient-focused
              treatment.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous services"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCEAF1] bg-white text-[#16587B] shadow-sm transition-all duration-200 hover:border-[#16587B] hover:bg-[#16587B] hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next services"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DCEAF1] bg-white text-[#16587B] shadow-sm transition-all duration-200 hover:border-[#16587B] hover:bg-[#16587B] hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* ================= SERVICE SLIDER ================= */}
        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {services.map((service) => (
            <article
              key={service.id}
              className="group relative min-w-[88%] snap-start overflow-hidden rounded-3xl border border-[#DCEAF1] bg-[#F7FAFC] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#84B3CE] hover:shadow-xl sm:min-w-[55%] lg:min-w-[calc(33.333%-14px)]"
            >
              {/* Decorative Circle */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#84B3CE]/10 transition-colors duration-300 group-hover:bg-[#84B3CE]/20" />

              {/* Service Image */}
              <div className="relative mb-6 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#16587B]/10 p-2">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={512}
                    height={512}
                    className="h-12 w-12 object-contain"
                  />
                </div>

                <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#16587B] shadow-sm">
                  {service.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="relative text-2xl font-bold text-[#123B50]">
                {service.title}
              </h3>

              {/* Description */}
              <p className="relative mt-3 text-sm leading-6 text-slate-600">
                {service.description}
              </p>

              {/* Service List */}
              <div className="relative mt-6 border-t border-[#DCEAF1] pt-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#84B3CE]">
                  Services & Conditions
                </p>

                <div className="grid gap-2.5">
                  {service.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-2 text-sm text-[#123B50]"
                    >
                      <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#16587B]/10">
                        <Check
                          size={10}
                          strokeWidth={3}
                          className="text-[#16587B]"
                        />
                      </span>

                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointment */}
              <div className="relative mt-7 border-t border-[#DCEAF1] pt-5">
                <a
                  href="/appointment"
                  className="inline-flex items-center text-sm font-semibold text-[#16587B] transition-colors duration-200 hover:text-[#A9002D]"
                >
                  Book an Appointment
                  <ChevronRight
                    size={17}
                    className="ml-1 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile Hint */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400 sm:hidden">
          <ChevronLeft size={14} />
          Swipe to explore
          <ChevronRight size={14} />
        </div>
      </div>
    </section>
  );
}