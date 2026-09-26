"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const services = [
  {
    id: 1,
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
    id: 2,
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
  {
    id: 4,
    title: "ICU / Critical Care",
    category: "Critical Care",
    image: "/services/general-medicine.png",
    description:
      "Specialized medical attention and monitoring for patients requiring critical care.",
    points: [
      "Critical patient monitoring",
      "Emergency medical care",
      "Intensive observation",
      "Supportive treatment",
    ],
  },
  {
    id: 5,
    title: "Heart Care",
    category: "Cardiac Care",
    image: "/services/general-medicine.png",
    description:
      "Medical care for common heart-related conditions and cardiovascular health.",
    points: [
      "Heart diseases",
      "Heart attack",
      "Heart failure",
      "Blood pressure",
    ],
  },
  {
    id: 6,
    title: "Gastroenterology",
    category: "Digestive Health",
    image: "/services/general-medicine.png",
    description:
      "Care for digestive, liver and gastrointestinal health conditions.",
    points: [
      "Gastroenterology",
      "Liver diseases",
      "Digestive diseases",
      "Jaundice",
    ],
  },
  {
    id: 7,
    title: "Diabetes Care",
    category: "Diabetes Management",
    image: "/services/general-medicine.png",
    description:
      "Comprehensive support for diabetes management and long-term health.",
    points: [
      "Diabetes management",
      "Regular monitoring",
      "Diet guidance",
      "Long-term care",
    ],
  },
  {
    id: 8,
    title: "Urology & Kidney Care",
    category: "Urology",
    image: "/services/general-medicine.png",
    description:
      "Medical consultation and care for urinary and kidney-related conditions.",
    points: [
      "Urology conditions",
      "Kidney diseases",
      "Urinary conditions",
      "Medical consultation",
    ],
  },
];

export default function MedicalServices() {
  const sliderRef = useRef(null);

  const moveSlider = (direction) => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const card = slider.querySelector("article");

    if (!card) return;

    const gap = 20;
    const cardWidth = card.offsetWidth + gap;

    slider.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="overflow-hidden bg-[#F7FAFC] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Section Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-[2px] w-7 bg-[#A9002D]" />

            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#16587B]">
              Our Medical Specialties
            </span>
          </div>

          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#123B50] sm:text-4xl">
            Complete Care For{" "}
            <span className="text-[#16587B]">Your Health</span>
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Our hospital provides comprehensive medical care with experienced
            healthcare professionals and patient-focused treatment.
          </p>
        </div>

        {/* Slider Wrapper */}
        <div className="relative">

          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => moveSlider("left")}
            aria-label="Previous specialty"
            className="absolute left-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCEAF1] bg-white text-[#16587B] shadow-lg transition-all duration-200 hover:border-[#16587B] hover:bg-[#16587B] hover:text-white sm:left-1 lg:-left-5"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => moveSlider("right")}
            aria-label="Next specialty"
            className="absolute right-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#DCEAF1] bg-white text-[#16587B] shadow-lg transition-all duration-200 hover:border-[#16587B] hover:bg-[#16587B] hover:text-white sm:right-1 lg:-right-5"
          >
            <ChevronRight size={20} />
          </button>

          {/* Cards Slider */}
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-7 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-8 lg:px-0"
          >
            {services.map((service) => (
              <article
                key={service.id}
                className="group relative min-w-[86%] snap-start overflow-hidden rounded-2xl border border-[#DCEAF1] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#84B3CE] hover:shadow-lg sm:min-w-[48%] lg:min-w-[calc((100%-40px)/3)]"
              >
                {/* Decorative Circle */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#84B3CE]/10 transition group-hover:bg-[#84B3CE]/20" />

                {/* Icon + Category */}
                <div className="relative mb-4 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#16587B]/10 p-2">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={512}
                      height={512}
                      className="h-10 w-10 object-contain"
                    />
                  </div>

                  <span className="max-w-[150px] truncate rounded-full bg-[#F7FAFC] px-3 py-1 text-[10px] font-semibold text-[#16587B] shadow-sm">
                    {service.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="relative min-h-[28px] text-xl font-bold text-[#123B50]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="relative mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-600">
                  {service.description}
                </p>

                {/* Highlights */}
                <div className="relative mt-4 border-t border-[#DCEAF1] pt-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#84B3CE]">
                    Key Highlights
                  </p>

                  <div className="grid gap-2">
                    {service.points.slice(0, 5).map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-2 text-sm text-[#123B50]"
                      >
                        <span className="mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#16587B]/10">
                          <Check
                            size={9}
                            strokeWidth={3}
                            className="text-[#16587B]"
                          />
                        </span>

                        <span className="line-clamp-1">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Appointment Button */}
                <div className="relative mt-5 border-t border-[#DCEAF1] pt-4">
                  <Link
                    href="/appointment"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#16587B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124B69]"
                  >
                    Book Appointment
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400 lg:hidden">
          <ChevronLeft size={13} />
          Swipe to explore
          <ChevronRight size={13} />
        </div>

        
      </div>
    </section>
  );
}