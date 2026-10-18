"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import BookAppointmentModal from "./BookAppointmentModal";

export default function BookAppointmentEntry({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#16587b] px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#123b50] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#16587b]/15 ${className}`}
      >
        <CalendarDays size={16} />
        Book appointment
      </button>
      <BookAppointmentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
