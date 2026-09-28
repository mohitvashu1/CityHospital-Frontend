
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  ChevronRight,
  HeartPulse,
  ArrowUpRight,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Our Doctors", href: "/doctors" },
  { label: "Medical Specialties", href: "/specialties" },
  { label: "Book Appointment", href: "/appointment" },
  { label: "Contact Us", href: "/contact" },
];

const specialties = [
  "Normal Delivery",
  "General Medicine",
  "Women's Health",
  "ICU / Critical Care",
  "Heart Care",
  "Gastroenterology",
  "Diabetes Care",
  "Urology & Kidney Care",
];

export default function Footer() {
  return (
    <footer className="bg-[#123B50] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 lg:px-10 lg:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Hospital Info */}
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white p-2">
                <Image src="/logo1.png" alt="City Hospital Logo" width={100} height={100} className="h-full w-full object-contain" />
              </span>
              <span>
                <span className="block text-xl font-bold tracking-wide">City Hospital</span>
                <span className="mt-1 block text-xs text-white/65">Care • Compassion • Commitment</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-6 text-white/70">
              Dedicated to providing compassionate, patient-focused healthcare
              and medical support for you and your family.
            </p>

            <Link href="/appointment" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#16587B] transition hover:bg-[#EAF4F8]">
              Book an Appointment
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-base font-bold">Quick Links</h3>
            <span className="mb-5 block h-0.5 w-10 bg-[#A9002D]" />
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                    <ChevronRight size={14} className="text-[#84B3CE] transition group-hover:translate-x-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="mb-5 text-base font-bold">Our Specialties</h3>
            <span className="mb-5 block h-0.5 w-10 bg-[#A9002D]" />
            <ul className="space-y-3">
              {specialties.map((item) => (
                <li key={item}>
                  <Link href="/specialties" className="group inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                    <ChevronRight size={14} className="text-[#84B3CE] transition group-hover:translate-x-1" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-base font-bold">Contact Us</h3>
            <span className="mb-5 block h-0.5 w-10 bg-[#A9002D]" />

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#84B3CE]">
                  <MapPin size={17} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Our Address</p>
                  <p className="mt-1 text-sm leading-5 text-white/70">
                    Near Hindustan Machinery, Golumber, Buxar, Bihar 802101
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#84B3CE]">
                  <Phone size={17} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Call Us</p>
                  <a href="tel:06183359844" className="mt-1 block text-sm text-white/70 transition hover:text-white">
                    06183 359 844
                  </a>
                  <p className="mt-1 text-sm text-white/55">xxxxxxxxxx</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#84B3CE]">
                  <Mail size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">Email Address</p>
                  <a href="mailto:Cityhospitalbuxar@gmail.com" className="mt-1 block break-all text-sm text-white/70 transition hover:text-white">
                    Cityhospitalbuxar@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#84B3CE]">
                  <Clock3 size={17} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">Working Hours</p>
                  <p className="mt-1 text-sm leading-5 text-white/70">
                    Monday – Sunday
                    <br />
                    08 AM – PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-center sm:px-8 md:flex-row md:text-left lg:px-10">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} City Hospital. All rights reserved.
          </p>

          <p className="inline-flex items-center gap-1.5 text-xs text-white/60">
            Made with <HeartPulse size={14} className="text-[#E77A8E]" /> for better healthcare
          </p>

          <Link href="/appointment" className="text-xs font-medium text-white/70 transition hover:text-white">
            Book Appointment
          </Link>
        </div>
      </div>
    </footer>
  );
}