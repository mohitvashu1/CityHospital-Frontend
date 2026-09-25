"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiMapPin, FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // =====================================================
  // CITY HOSPITAL LOCATION
  // =====================================================

  const hospitalAddress =
    "near Hindustan Machinery, Golumber, Buxar, Bihar 802101";

  // Exact Google Maps link provided by you
  const hospitalMapsUrl =
    "https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgYIARBFGDsyBggCEEUYOTIHCAMQABiPAjIHCAQQABiPAjIGCAUQRRg8MgYIBhBFGD0yBggHEEUYPNIBCDEzMjFqMGo3qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KV9-YDUjdZI5MQZ-qa4gPhgL&daddr=near+Hindustan+Machinery,+Golumber,+Buxar,+Bihar+802101";

  // =====================================================
  // GET DIRECTION
  // =====================================================

  const handleGetDirection = () => {
    // Browser doesn't support geolocation
    if (!navigator.geolocation) {
      window.open(
        hospitalMapsUrl,
        "_blank",
        "noopener,noreferrer"
      );
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

        window.open(
          directionUrl,
          "_blank",
          "noopener,noreferrer"
        );
      },

      // Location permission denied
      () => {
        window.open(
          hospitalMapsUrl,
          "_blank",
          "noopener,noreferrer"
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="mx-auto flex h-[80px] max-w-[1400px] items-center justify-between px-5 lg:px-10">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center"
        >
          <img
            src="/logo1.png"
            alt="City Hospital"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div className="hidden items-center gap-7 lg:flex">

          {/* HOME */}

          <Link
            href="/"
            className="text-gray-700 transition-colors duration-200 hover:text-[#16587B]"
          >
            Home
          </Link>

          {/* ALL DOCTORS */}

          <Link
            href="/doctors"
            className="text-gray-700 transition-colors duration-200 hover:text-[#16587B]"
          >
            All Doctors
          </Link>

          {/* CONTACT */}

          <Link
            href="/contact"
            className="text-gray-700 transition-colors duration-200 hover:text-[#16587B]"
          >
            Contact
          </Link>

          {/* =================================================
              GET DIRECTION
          ================================================= */}

          <button
            type="button"
            onClick={handleGetDirection}
            className="group flex items-center gap-2 rounded-full border border-[#16587B] px-5 py-2.5 font-medium text-[#16587B] transition-all duration-200 hover:bg-[#16587B] hover:text-white"
          >
            <FiMapPin
              size={18}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            />

            <span>Get Direction</span>

            <FiArrowUpRight
              size={17}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>

          {/* =================================================
              BOOK APPOINTMENT
          ================================================= */}

          <Link
            href="/appointment"
            className="rounded-full bg-[#16587B] px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-[#1a79ac]"
          >
            Book Appointment
          </Link>
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-all duration-200 hover:border-[#16587B] hover:text-[#16587B] lg:hidden"
          aria-label={
            isMenuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <FiX size={25} strokeWidth={2} />
          ) : (
            <FiMenu size={25} strokeWidth={2} />
          )}
        </button>
      </nav>

      {/* ===================================================
          MOBILE MENU
      =================================================== */}

      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg lg:hidden">

          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-6">

            {/* HOME */}

            <Link
              href="/"
              onClick={closeMenu}
              className="text-gray-700 transition-colors duration-200 hover:text-[#16587B]"
            >
              Home
            </Link>

            {/* ALL DOCTORS */}

            <Link
              href="/doctors"
              onClick={closeMenu}
              className="text-gray-700 transition-colors duration-200 hover:text-[#16587B]"
            >
              All Doctors
            </Link>

            {/* CONTACT */}

            <Link
              href="/contact"
              onClick={closeMenu}
              className="text-gray-700 transition-colors duration-200 hover:text-[#16587B]"
            >
              Contact
            </Link>

            {/* =================================================
                MOBILE GET DIRECTION
            ================================================= */}

            <button
              type="button"
              onClick={() => {
                closeMenu();
                handleGetDirection();
              }}
              className="group flex w-full items-center justify-center gap-2 rounded-full border border-[#16587B] px-5 py-3 font-medium text-[#16587B] transition-all duration-200 hover:bg-[#16587B] hover:text-white"
            >
              <FiMapPin
                size={18}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:-translate-y-0.5"
              />

              <span>Get Direction</span>

              <FiArrowUpRight
                size={17}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>

            {/* =================================================
                MOBILE BOOK APPOINTMENT
            ================================================= */}

            <Link
              href="/appointment"
              onClick={closeMenu}
              className="flex w-full items-center justify-center rounded-full bg-[#16587B] px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-[#1a79ac]"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;