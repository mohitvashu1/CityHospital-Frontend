"use client";

import {
  MapPin,
  Phone,
  Mail,
  Clock3,
} from "lucide-react";

export default function ContactStrip() {
  return (
    <section className="w-full bg-[#16587B] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/15 px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-8 lg:grid-cols-4 lg:px-10">

        {/* Address */}
        <div className="flex items-start gap-4 px-4 py-5 sm:px-5 lg:px-6">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
            <MapPin size={18} />
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide">
              Visit Our Hospital
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-white/75">
              Near Hindustan Machinery,
              <br />
              Golumber, Buxar, Bihar 802101
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4 px-4 py-5 sm:px-5 lg:px-6">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Phone size={18} />
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide">
              Call Us Anytime
            </h3>

            <a
              href="tel:06183359844"
              className="mt-1 block text-[11px] text-white/85 transition hover:text-white"
            >
              06183 359 844
            </a>

            <a
              href="tel:xxxxxxxxxx"
              className="mt-1 block text-[11px] text-white/65 transition hover:text-white"
            >
              xxxxxxxxxx
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4 px-4 py-5 sm:px-5 lg:px-6">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Mail size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wide">
              Email Us
            </h3>

            <a
              href="mailto:Cityhospitalbuxar@gmail.com"
              className="mt-1 block break-all text-[11px] leading-5 text-white/75 transition hover:text-white"
            >
              Cityhospitalbuxar@gmail.com
            </a>
          </div>
        </div>

        {/* Working Hours */}
        <div className="flex items-start gap-4 px-4 py-5 sm:px-5 lg:px-6">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Clock3 size={18} />
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide">
              Working Hours
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-white/75">
              Mon - Fri : 08 AM to PM
              <br />
              Sat - Sun : 08 AM to PM
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}