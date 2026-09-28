"use client";

import { useRouter } from "next/navigation";
import BookAppointmentModal from "../component/Book Appointment/BookAppointmentModal";

export default function AppointmentPage() {
  const router = useRouter();

  return (
    <BookAppointmentModal
      isOpen={true}
      onClose={() => router.push("/")}
    />
  );
}