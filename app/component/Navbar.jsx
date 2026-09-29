
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiMapPin,
  FiArrowUpRight,
  FiMenu,
  FiX,
  FiChevronDown,
  FiHome,
  FiUsers,
  FiBriefcase,
  FiActivity,
  FiStar,
  FiPhone,
  FiCalendar,
  FiHeart,
  FiArrowRight,
} from "react-icons/fi";

const exploreItems = [
  {
    label: "Home",
    description: "Discover City Hospital",
    id: "home",
    icon: FiHome,
    color: "bg-sky-50 text-sky-700",
  },
  {
    label: "All Doctors",
    description: "Meet our experienced medical team",
    id: "doctors",
    icon: FiUsers,
    color: "bg-blue-50 text-blue-700",
  },
  {
    label: "Medical Services",
    description: "Explore our healthcare specialties",
    id: "medical-services",
    icon: FiActivity,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    label: "Patient Reviews",
    description: "Read patient experiences",
    id: "reviews",
    icon: FiStar,
    color: "bg-amber-50 text-amber-700",
  },
  {
    label: "Contact & Location",
    description: "Find and contact our hospital",
    id: "contact",
    icon: FiPhone,
    color: "bg-rose-50 text-rose-700",
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const hospitalAddress =
    "Near Hindustan Machinery, Golumber, Buxar, Bihar 802101";

  const hospitalMapsUrl =
    "https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgYIARBFGDsyBggCEEUYOTIHCAMQABiPAjIHCAQQABiPAjIGCAUQRRg8MgYIBhBFGD0yBggHEEUYPNIBCDEzMjFqMGo3qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KV9-YDUjdZI5MQZ-qa4gPhgL&daddr=near+Hindustan+Machinery,+Golumber,+Buxar,+Bihar+802101";

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsExploreOpen(false);
    setIsMobileExploreOpen(false);
  };

  // Get Direction
  const handleGetDirection = () => {
    if (!navigator.geolocation) {
      window.open(hospitalMapsUrl, "_blank", "noopener,noreferrer");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const destination = encodeURIComponent(hospitalAddress);

        const directionUrl =
          `https://www.google.com/maps/dir/?api=1` +
          `&origin=${latitude},${longitude}` +
          `&destination=${destination}`;

        window.open(directionUrl, "_blank", "noopener,noreferrer");
      },
      () => {
        window.open(hospitalMapsUrl, "_blank", "noopener,noreferrer");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Scroll to homepage sections
  const scrollToSection = (id) => {
    closeMenu();

    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    if (id === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      router.push(`/#${id}`);
    }
  };

  // Active navigation styling
  const navLinkClass = (href) => {
    const isActive =
      href === "/"
        ? pathname === "/"
        : pathname.startsWith(href);

    return `group relative inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-[#eaf3f8] text-[#16587b]"
        : "text-[#385568] hover:bg-[#f0f7fa] hover:text-[#16587b]"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#dceaf1] bg-white/95 shadow-[0_4px_18px_rgba(18,59,80,0.06)] backdrop-blur-md">
      <nav className="mx-auto flex h-[80px] max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-[86px] lg:px-10">

        {/* LOGO */}
        <Link
          href="/"
          onClick={(event) => {
            closeMenu();

            if (pathname === "/") {
              event.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
          aria-label="City Hospital Buxar - Home"
          className="flex shrink-0 items-center rounded-lg outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#16587b] focus-visible:ring-offset-4"
        >
          <img
            src="/logo.png"
            alt="City Hospital Buxar"
            className="h-12 w-auto object-contain sm:h-16"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 lg:flex">

          {/* HOME */}
          <Link href="/" className={navLinkClass("/")}>
            <FiHome size={16} />
            <span>Home</span>

            {pathname === "/" && (
              <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full bg-[#a9002d]" />
            )}
          </Link>

          {/* ALL DOCTORS */}
          <Link href="/doctors" className={navLinkClass("/doctors")}>
            <FiUsers size={16} />
            <span>All Doctors</span>

            {pathname.startsWith("/doctors") && (
              <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full bg-[#a9002d]" />
            )}
          </Link>

          {/* ADMIN */}
          <Link href="/Admin" className={navLinkClass("/Admin")}>
            <FiBriefcase size={16} />
            <span>Admin</span>

            {pathname.startsWith("/Admin") && (
              <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full bg-[#a9002d]" />
            )}
          </Link>

          {/* EXPLORE DROPDOWN */}
          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setIsExploreOpen((prev) => !prev)}
              aria-expanded={isExploreOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isExploreOpen
                  ? "bg-[#16587b] text-white shadow-md"
                  : "text-[#385568] hover:bg-[#f0f7fa] hover:text-[#16587b]"
              }`}
            >
              Explore
              <FiChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isExploreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExploreOpen && (
              <>
                {/* Click outside to close */}
                <button
                  type="button"
                  aria-label="Close Explore menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsExploreOpen(false)}
                />

                {/* Dropdown panel */}
                <div className="absolute right-0 top-[calc(100%+16px)] z-50 w-[320px] overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-[0_20px_60px_rgba(18,59,80,0.18)] sm:w-[340px]">

                  {/* Dropdown header */}
                  <div className="relative overflow-hidden bg-[#16587b] px-5 py-5">
                    <div className="absolute -right-7 -top-10 h-28 w-28 rounded-full border-[18px] border-white/5" />
                    <div className="absolute -bottom-12 right-20 h-24 w-24 rounded-full bg-white/5" />

                    <div className="relative flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
                        <FiHeart size={22} />
                      </div>

                      <div>
                        <p className="text-base font-bold text-white">
                          Explore City Hospital
                        </p>
                        <p className="mt-1 text-xs text-white/75">
                          Your health, our priority
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown links */}
                  <div className="p-2.5">
                    {exploreItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-[#f0f7fa]"
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color} transition-transform duration-200 group-hover:scale-105`}
                          >
                            <Icon size={18} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-[#123b50] transition-colors group-hover:text-[#16587b]">
                              {item.label}
                            </span>

                            <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                              {item.description}
                            </span>
                          </span>

                          <FiArrowRight
                            size={16}
                            className="shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#16587b]"
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Dropdown footer */}
                  <div className="border-t border-[#dceaf1] bg-[#f7fafc] px-5 py-3">
                    <p className="text-center text-[11px] font-medium text-[#16587b]">
                      Compassionate care for every patient
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* DESKTOP ACTION BUTTONS */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <button
            type="button"
            onClick={handleGetDirection}
            className="group inline-flex h-11 items-center gap-2 rounded-full border border-[#16587b] px-5 text-sm font-semibold text-[#16587b] transition-all duration-200 hover:bg-[#16587b] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16587b] focus-visible:ring-offset-2"
          >
            <FiMapPin
              size={17}
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            />
            <span>Get Direction</span>
            <FiArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>

          <Link
            href="/appointment"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#16587b] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#104662] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16587b] focus-visible:ring-offset-2"
          >
            <FiCalendar size={16} />
            Book Appointment
          </Link>
        </div>

        {/* COMPACT ACTION BUTTONS: LAPTOP */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:hidden">
          <button
            type="button"
            onClick={handleGetDirection}
            aria-label="Get direction"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#16587b] text-[#16587b] transition hover:bg-[#16587b] hover:text-white"
          >
            <FiMapPin size={18} />
          </button>

          <Link
            href="/appointment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16587b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#104662]"
          >
            <FiCalendar size={15} />
            Book Appointment
          </Link>
        </div>

        {/* MOBILE AND TABLET MENU BUTTON */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dceaf1] bg-white text-[#16587b] transition hover:border-[#16587b] hover:bg-[#f0f7fa] lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {/* MOBILE AND TABLET MENU */}
      {isMenuOpen && (
        <div className="border-t border-[#dceaf1] bg-white shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-[1400px] flex-col px-4 py-4 sm:px-6">

            {/* Mobile Home */}
            <Link
              href="/"
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                pathname === "/"
                  ? "bg-[#eaf3f8] text-[#16587b]"
                  : "text-[#385568] hover:bg-[#f0f7fa] hover:text-[#16587b]"
              }`}
            >
              <FiHome size={18} />
              Home
            </Link>

            {/* Mobile All Doctors */}
            <Link
              href="/doctors"
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                pathname.startsWith("/doctors")
                  ? "bg-[#eaf3f8] text-[#16587b]"
                  : "text-[#385568] hover:bg-[#f0f7fa] hover:text-[#16587b]"
              }`}
            >
              <FiUsers size={18} />
              All Doctors
            </Link>

            {/* Mobile Admin */}
            <Link
              href="/Admin"
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                pathname.startsWith("/Admin")
                  ? "bg-[#eaf3f8] text-[#16587b]"
                  : "text-[#385568] hover:bg-[#f0f7fa] hover:text-[#16587b]"
              }`}
            >
              <FiBriefcase size={18} />
              Admin
            </Link>

            {/* Mobile Explore */}
            <div className="mt-1 border-t border-[#dceaf1] pt-2">
              <button
                type="button"
                onClick={() =>
                  setIsMobileExploreOpen((prev) => !prev)
                }
                aria-expanded={isMobileExploreOpen}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isMobileExploreOpen
                    ? "bg-[#eaf3f8] text-[#16587b]"
                    : "text-[#385568] hover:bg-[#f0f7fa] hover:text-[#16587b]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FiActivity size={18} />
                  Explore
                </span>

                <FiChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${
                    isMobileExploreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMobileExploreOpen && (
                <div className="ml-4 mt-2 space-y-1 border-l-2 border-[#dceaf1] py-1 pl-3">
                  {exploreItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-[#f0f7fa] hover:text-[#16587b]"
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                        >
                          <Icon size={16} />
                        </span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile actions */}
            <div className="mt-3 grid grid-cols-1 gap-3 border-t border-[#dceaf1] pt-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  handleGetDirection();
                }}
                className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#16587b] px-4 py-3 text-sm font-semibold text-[#16587b] transition hover:bg-[#16587b] hover:text-white"
              >
                <FiMapPin size={17} />
                Get Direction
                <FiArrowUpRight size={16} />
              </button>

              <Link
                href="/appointment"
                onClick={closeMenu}
                className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#16587b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#104662]"
              >
                <FiCalendar size={17} />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}