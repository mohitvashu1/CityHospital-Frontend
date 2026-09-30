
"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { specialities } from "../data/specialities";

export default function MedicalServices() {
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;

    const amount = sliderRef.current.clientWidth * 0.85;
    sliderRef.current.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section id="specialities" className="w-full bg-[#f7fafc] py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex rounded-full bg-[#e7f2f8] px-4 py-2 text-sm font-semibold text-[#16587b]">
              Our Medical Services
            </span>

            <h2 className="text-3xl font-bold leading-tight text-[#123b50] sm:text-4xl">
              Specialities & Healthcare
            </h2>

            <p className="mt-3 text-base leading-7 text-[#567384]">
              Explore our medical specialities and find the care information
              you need at City Hospital, Buxar.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => scrollSlider("prev")}
              aria-label="Previous specialities"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dceaf1] bg-white text-xl text-[#16587b] shadow-sm transition hover:bg-[#16587b] hover:text-white"
            >
              &#8592;
            </button>

            <button
              type="button"
              onClick={() => scrollSlider("next")}
              aria-label="Next specialities"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dceaf1] bg-white text-xl text-[#16587b] shadow-sm transition hover:bg-[#16587b] hover:text-white"
            >
              &#8594;
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {specialities.map((speciality) => (
            <article
              key={speciality.slug}
              className="group flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[48%] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <Link
                href={`/specialities/${speciality.slug}`}
                className="relative block h-56 overflow-hidden bg-[#eaf3f8]"
                aria-label={`View ${speciality.title}`}
              >
                <Image
                  src={speciality.image}
                  alt={speciality.title}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#16587b] shadow-sm">
                  {speciality.tag}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-xl font-bold text-[#123b50] transition group-hover:text-[#16587b]">
                  {speciality.title}
                </h3>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#617b89]">
                  {speciality.shortDescription}
                </p>

                <div className="mt-6 border-t border-[#dceaf1] pt-4">
                  <Link
                    href={`/specialities/${speciality.slug}`}
                    className="inline-flex items-center gap-2 font-semibold text-[#16587b] transition hover:gap-3 hover:text-[#a9002d]"
                  >
                    Learn More
                    <span aria-hidden="true">&#8594;</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-3 flex justify-center">
          <p className="text-xs text-[#78909c]">
            Swipe or use the arrows to explore our specialities
          </p>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
  <Link
    href="/specialities"
    className="inline-flex items-center gap-2 rounded-lg bg-[#16587b] px-6 py-3 font-semibold text-white transition hover:bg-[#a9002d]"
  >
    View All Specialities
    <span aria-hidden="true">→</span>
  </Link>
</div>
    </section>
    
  );
}