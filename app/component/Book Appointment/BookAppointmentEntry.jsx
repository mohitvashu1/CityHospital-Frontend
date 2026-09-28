
"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import BookAppointmentModal from "./BookAppointmentModal";

export default function BookAppointmentEntry() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16587b] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#16587b]/20 transition hover:bg-[#104662] active:scale-[0.98]"
      >
        <CalendarDays size={18} />
        Book Appointment
      </button>

      <BookAppointmentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}