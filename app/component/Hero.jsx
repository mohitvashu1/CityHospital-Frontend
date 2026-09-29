
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";

const heroImages = [
  "/hero/slide-1.png",
  "/hero/slide-2.png",
  "/hero/slide-3.png",
  "/hero/slide-4.png",
  "/hero/slide-5.png",
  "/hero/slide-6.png",
];

const animatedTexts = [
  "Our Priority.",
  "Our Commitment.",
  "Your Wellbeing.",
  "Your Family's Health.",
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Image slider: change image every 3 seconds
  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(sliderInterval);
  }, []);

  // Typewriter animation
  useEffect(() => {
    const currentText = animatedTexts[textIndex];
    let timeout;

    if (!isDeleting) {
      if (typedText.length < currentText.length) {
        timeout = setTimeout(() => {
          setTypedText(currentText.slice(0, typedText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      if (typedText.length > 0) {
        timeout = setTimeout(() => {
          setTypedText(currentText.slice(0, typedText.length - 1));
        }, 45);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % animatedTexts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, textIndex]);

  return (
    <main className="relative overflow-hidden bg-[#F7FAFC]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#84B3CE]/10" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#16587B]/5" />

      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          {/* LEFT CONTENT */}
          <div className="max-w-2xl">
            {/* Trust badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#84B3CE]/40 bg-white px-4 py-2 shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#16587B]/10">
                <ShieldCheck size={15} className="text-[#16587B]" />
              </span>

              <span className="text-xs font-semibold tracking-wide text-[#16587B] sm:text-sm">
                Trusted Healthcare For Your Family
              </span>
            </div>

            {/* Animated heading */}
            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-[#123B50] sm:text-5xl lg:text-6xl">
              Your Health,
              <br />

              <span className="text-[#16587B]">
                {typedText}
                <span className="ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-1 animate-pulse bg-[#A9002D]" />
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

            {/* Stats */}
            <div className="mt-10 grid max-w-xl grid-cols-3 border-t border-[#DCEAF1] pt-7">
              <div className="pr-4">
                <div className="flex items-center gap-2">
                  <HeartPulse size={18} className="text-[#A9002D]" />
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

          {/* RIGHT IMAGE SLIDER */}
          <div className="relative mx-auto w-full max-w-[600px] lg:ml-auto">
            {/* Main image container: 3:2 ratio */}
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[28px] bg-[#EAF4F8] shadow-xl">
              {/* Sliding images */}
              {heroImages.map((image, index) => (
                <div
                  key={image}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    currentImage === index
                      ? "z-10 opacity-100"
                      : "z-0 opacity-0"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`City Hospital care image ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 90vw, 600px"
                    className="object-cover"
                  />
                </div>
              ))}

              Image overlay
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#123B50]/35 via-transparent to-[#123B50]/10" />

              

              {/* Slider indicators */}
              <div className="absolute bottom-1.5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show image ${index + 1}`}
                    aria-pressed={currentImage === index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentImage === index
                        ? "w-7 bg-[#16587B]"
                        : "w-1.5 bg-white/80 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-5 -top-5 -z-10 h-28 w-28 rounded-full bg-[#84B3CE]/30 sm:-right-7 sm:-top-7 sm:h-36 sm:w-36" />

            <div className="pointer-events-none absolute -bottom-5 -left-5 -z-10 h-24 w-24 rounded-full bg-[#16587B]/10 sm:-bottom-7 sm:-left-7 sm:h-32 sm:w-32" />
          </div>
        </div>
      </section>
    </main>
  );
}