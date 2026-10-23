
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppChrome({ children }) {
  const pathname = usePathname();

  // Show the normal Navbar on this exact login route.
  const isSuperAdminLogin =
    pathname === "/admin/super-admin/login";
     const isDocLogin =
    pathname === "/admin/doctor/login";

  // Hide the normal Navbar on all other portal pages.
  const isStaffPortal =
    (pathname.startsWith("/admin/super-admin") &&
      !isSuperAdminLogin) ||
    (pathname.startsWith("/admin/doctor") &&
      !isDocLogin) ||
    pathname.startsWith("/staff");

  // Logo-only layout for Super Admin, Doctor and Staff portals.
  if (isStaffPortal) {
    return (
      <div className="min-h-screen bg-[#f7fafc]">
        {/* <header className="flex h-[76px] items-center border-b-2 border-[#a9002d] bg-white px-5 sm:px-8">
          <Link
            href="/"
            aria-label="City Hospital home"
            className="inline-flex items-center rounded-md focus:outline-none focus:ring-2 focus:ring-[#16587b]"
          >
            <Image
              src="/logo1.png"
              alt="City Hospital"
              width={180}
              height={58}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>
        </header> */}

        <main>{children}</main>
      </div>
    );
  }

  // Normal Navbar and Footer for login page, /admin and public pages.
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
