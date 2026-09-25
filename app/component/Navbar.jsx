"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "All Doctors",
    href: "/doctors",
  },
  {
    name: "Contact",
    href: "/contact",
  },
  {
    name: "About Us",
    href: "/about",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#DCEAF1] bg-[#F7FAFC]/95 backdrop-blur-md">
        <nav className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          {/* Logo */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center"
          >
            <Image
              src="/logo1.png"
              alt="City Hospital"
              width={190}
              height={65}
              priority
              className="h-auto w-[150px] sm:w-[175px] lg:w-[190px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative text-[15px] font-medium text-[#16587B]"
              >
                {link.name}

                <span className="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-[#A9002D] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Appointment Button */}
          <Link
            href="/appointment"
            className="hidden items-center gap-2 rounded-xl bg-[#16587B] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#124B69] lg:inline-flex"
          >
            Book Appointment
            <ChevronRight size={17} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16587B] text-white lg:hidden"
          >
            <Menu size={23} />
          </button>
        </nav>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[60] bg-[#123B50]/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-[82%] max-w-[360px] flex-col bg-[#F7FAFC] shadow-2xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex h-[78px] items-center justify-between border-b border-[#DCEAF1] px-5">

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src="/logo1.png"
              alt="City Hospital"
              width={165}
              height={55}
              className="h-auto w-[145px]"
            />
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#16587B] shadow-sm"
          >
            <X size={21} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex flex-1 flex-col px-5 py-7">

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#84B3CE]">
            Navigation
          </p>

          {/* Links */}
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between border-b border-[#DCEAF1] py-4 text-[16px] font-medium text-[#16587B] hover:text-[#A9002D]"
              >
                <span>{link.name}</span>

                <ChevronRight
                  size={18}
                  className="text-[#84B3CE] transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>

          {/* Appointment */}
          <div className="mt-8">
            <Link
              href="/appointment"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16587B] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#124B69]"
            >
              Book Appointment
              <ChevronRight size={17} />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#DCEAF1] bg-white px-5 py-5">
          <p className="text-xs leading-5 text-[#16587B]/60">
            Quality healthcare with compassion and care.
          </p>
        </div>
      </aside>
    </>
  );
}