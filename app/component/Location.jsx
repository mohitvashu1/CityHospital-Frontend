"use client";

import {
  MapPin,
  Navigation,
  Phone,
  Clock3,
  ExternalLink,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const HOSPITAL_ADDRESS =
  "Near Hindustan Machinery, Golumber, Buxar, Bihar 802101";

const HOSPITAL_PHONE = "+916183359844";

// Verified hospital map coordinates from the existing Google Reviews link.
const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=25.5795478,83.9930264&z=16&output=embed";

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=25.5795478,83.9930264";

export default function Location() {
  return (
    <section
      id="location"
      aria-labelledby="location-heading"
      className="relative isolate overflow-hidden bg-[#F7FAFC] py-10 sm:py-12 lg:py-14"
    >
      {/* Soft decorative background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 -z-10 h-64 w-64 rounded-full bg-[#84B3CE]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-[#A9002D]/[0.06] blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-9">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dceaf1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#16587b] shadow-sm">
            <MapPin size={14} className="text-[#A9002D]" />
            Visit Us
          </div>

          <h2
            id="location-heading"
            className="text-2xl font-bold tracking-tight text-[#123b50] sm:text-3xl lg:text-4xl"
          >
            Find <span className="text-[#16587b]">City Hospital</span>
          </h2>

          <span className="mx-auto mt-4 block h-[3px] w-20 rounded-full bg-[#A9002D]" />

          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
            We are here to care for you. Visit our hospital in the heart of
            Buxar for trusted medical care and support.
          </p>
        </div>

        {/* Map + hospital information */}
        <div className="grid items-stretch gap-5 lg:grid-cols-[1.55fr_0.85fr] lg:gap-7">
          {/* Map panel */}
          <div className="group relative min-h-[320px] overflow-hidden rounded-2xl border border-[#d5e5ed] bg-white p-2 shadow-[0_12px_35px_rgba(22,88,123,0.10)] sm:min-h-[390px] sm:rounded-3xl sm:p-3">
            <div className="relative h-[310px] overflow-hidden rounded-xl bg-[#eaf3f7] sm:h-[365px] sm:rounded-2xl lg:h-full lg:min-h-[430px]">
              <iframe
                title="City Hospital location on Google Maps"
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />

              {/* Map label */}
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur sm:left-4 sm:top-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf4f8] text-[#16587b]">
                  <MapPin size={17} />
                </span>
                <span>
                  <span className="block text-xs font-bold text-[#123b50] sm:text-sm">
                    City Hospital
                  </span>
                  <span className="block text-[10px] text-slate-500 sm:text-xs">
                    Golumber, Buxar
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Details panel */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[#d5e5ed] bg-white p-5 shadow-[0_12px_35px_rgba(22,88,123,0.08)] sm:rounded-3xl sm:p-7 lg:p-8">
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#16587b] via-[#84b3ce] to-[#A9002D]"
            />

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A9002D]">
                Our Location
              </p>
              <h3 className="mt-2 text-xl font-bold text-[#123b50] sm:text-2xl">
                Visit us today
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Easily find us and plan your visit to City Hospital, Buxar.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf4f8] text-[#16587b]">
                  <MapPin size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#123b50]">
                    Hospital Address
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {HOSPITAL_ADDRESS}
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#e8f0f4]" />

              <div className="flex gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf4f8] text-[#16587b]">
                  <Phone size={19} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#123b50]">
                    Call the Hospital
                  </p>
                  <a
                    href={`tel:${HOSPITAL_PHONE}`}
                    className="mt-1 inline-block text-sm font-medium text-[#16587b] transition hover:text-[#A9002D]"
                  >
                    +91 6183 359844
                  </a>
                </div>
              </div>

              <div className="h-px bg-[#e8f0f4]" />

              <div className="flex gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1f3] text-[#A9002D]">
                  <Clock3 size={19} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#123b50]">
                    Hospital Availability
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    OPD timings + 24/7 Emergency
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-[#dceaf1] bg-[#f5fafc] p-4">
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-[#16587b]"
                />
                <p className="text-xs leading-5 text-slate-600">
                  For emergency assistance, please call the hospital directly.
                  Emergency services are available 24/7.
                </p>
              </div>
            </div>

            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#16587b] px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#16587b]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#123f59] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#16587b]/20"
            >
              <Navigation size={17} />
              Get Directions
              <ArrowUpRight size={17} />
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=25.5795478,83.9930264"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#16587b] transition hover:text-[#A9002D]"
            >
              Open in Google Maps
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
