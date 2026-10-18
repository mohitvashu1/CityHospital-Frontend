"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiMapPin,
  FiArrowUpRight,
  FiMenu,
  FiX,
  FiChevronDown,
  FiHome,
  FiActivity,
  FiStar,
  FiPhone,
  FiCalendar,
  FiHeart,
  FiArrowRight,
  FiShield,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiCompass,
} from "react-icons/fi";

const exploreItems = [
  {
    label: "Home",
    description: "Discover City Hospital",
    id: "home",
    icon: FiHome,
    color: "bg-sky-50 text-sky-700",
  },
  // All Doctors intentionally hidden.
  // {
  //   label: "All Doctors",
  //   description: "Meet our experienced medical team",
  //   id: "doctors",
  //   icon: FiUsers,
  //   color: "bg-blue-50 text-blue-700",
  // },
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

const hospitalAddress =
  "Near Hindustan Machinery, Golumber, Buxar, Bihar 802101";

const underlineBase =
  "relative inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-base font-bold transition-colors duration-200 after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[3px] after:rounded-full after:transition-colors after:duration-200";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () =>
      setLoggedIn(Boolean(sessionStorage.getItem("patientToken")));

    checkLogin();
    window.addEventListener("storage", checkLogin);
    window.addEventListener("focus", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("focus", checkLogin);
    };
  }, [pathname]);

  function closeMenus() {
    setMenuOpen(false);
    setExploreOpen(false);
    setLoginOpen(false);
    setMobileExploreOpen(false);
    setMobileLoginOpen(false);
  }

  function logout() {
    sessionStorage.removeItem("patientToken");
    sessionStorage.removeItem("patient");
    setLoggedIn(false);
    closeMenus();
    router.push("/");
    router.refresh();
  }

  function goHome() {
    closeMenus();
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  function scrollToSection(id) {
    closeMenus();
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${id}`);
    }
  }

  function getDirection() {
    const fallback =
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(hospitalAddress);

    if (!navigator.geolocation) {
      window.open(fallback, "_blank", "noopener,noreferrer");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const url =
          "https://www.google.com/maps/dir/?api=1" +
          `&origin=${coords.latitude},${coords.longitude}` +
          `&destination=${encodeURIComponent(hospitalAddress)}`;
        window.open(url, "_blank", "noopener,noreferrer");
      },
      () => window.open(fallback, "_blank", "noopener,noreferrer"),
      { timeout: 10000, maximumAge: 0 }
    );
  }

  function navLink(href) {
    const active =
      href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `${underlineBase} ${
      active
        ? "bg-[#eaf3f8] text-[#16587b] after:bg-[#a9002d]"
        : "bg-transparent text-[#16587b] after:bg-transparent hover:after:bg-[#a9002d] hover:bg-[#f0f7fa]"
    }`;
  }

  function menuToggleClass(open) {
    return `${underlineBase} ${
      open
        ? "bg-[#eaf3f8] text-[#16587b] after:bg-[#a9002d]"
        : "bg-transparent text-[#16587b] after:bg-transparent hover:bg-[#f0f7fa] hover:after:bg-[#a9002d]"
    }`;
  }

  function mobileLink(href) {
    const active =
      href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-base font-bold transition ${
      active
        ? "bg-[#eaf3f8] text-[#16587b]"
        : "text-[#16587b] hover:bg-[#f0f7fa]"
    }`;
  }

  function ExploreLinks({ mobile = false }) {
    return (
      <>
        {exploreItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={
                mobile
                  ? "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-600 hover:bg-[#f0f7fa]"
                  : "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[#f0f7fa]"
              }
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#123b50]">
                  {item.label}
                </span>
                {!mobile && (
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {item.description}
                  </span>
                )}
              </span>
              {!mobile && (
                <FiArrowRight className="text-slate-300 group-hover:text-[#16587b]" />
              )}
            </button>
          );
        })}
        <Link
          href="/admin"
          onClick={closeMenus}
          className={
            mobile
              ? "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-600 hover:bg-[#f0f7fa]"
              : "group flex w-full items-center gap-3 rounded-xl px-3 py-3 hover:bg-[#f0f7fa]"
          }
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <FiShield size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-[#123b50]">
              Admin
            </span>
            {!mobile && (
              <span className="mt-0.5 block text-xs text-slate-500">
                Hospital administration panel
              </span>
            )}
          </span>
          {!mobile && <FiArrowRight className="text-slate-300" />}
        </Link>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#dceaf1] bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex h-[86px] max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-[100px] lg:px-8">
        <Link
          href="/"
          aria-label="City Hospital Buxar Home"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            closeMenus();
          }}
          className="shrink-0"
        >
          <img
            src="/logo.png"
            alt="City Hospital Buxar"
            className="h-11 w-auto object-contain sm:h-12 lg:h-14"
          />
        </Link>

        {/* DESKTOP LINKS: equal sizing, active red underline */}
        <div className="hidden items-center gap-1 lg:flex xl:gap-2">
          <button onClick={goHome} className={navLink("/")}>
            <FiHome size={20} /> Home
          </button>


          {!loggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLoginOpen(!loginOpen);
                  setExploreOpen(false);
                }}
                aria-expanded={loginOpen}
                className={menuToggleClass(loginOpen || pathname === "/patient-login")}
              >
                <FiLogIn size={20} /> Login
                <FiChevronDown
                  className={`transition-transform ${loginOpen ? "rotate-180" : ""}`}
                />
              </button>
              {loginOpen && (
                <>
                  <button
                    aria-label="Close Login"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setLoginOpen(false)}
                  />
                  <div className="absolute left-0 top-[calc(100%+12px)] z-50 w-56 rounded-2xl border border-[#dceaf1] bg-white p-2 shadow-xl">
                    <Link
                      href="/patient-login"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-[#16587b] hover:bg-[#f0f7fa]"
                    >
                      <FiUser size={18} /> Patient
                    </Link>
                    <Link
                      href="/admin"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-[#16587b] hover:bg-[#f0f7fa]"
                    >
                      <FiShield size={18} /> Admin
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={logout}
              className={`${underlineBase} text-[#16587b] after:bg-transparent hover:bg-[#f0f7fa] hover:after:bg-[#a9002d]`}
            >
              <FiLogOut size={20} /> Logout
            </button>
          )}


          <Link href="/specialities" className={navLink("/specialities")}>
            <FiActivity size={20} /> Specialities
          </Link>

          {/* All Doctors intentionally hidden */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setExploreOpen(!exploreOpen);
                setLoginOpen(false);
              }}
              aria-expanded={exploreOpen}
              className={menuToggleClass(exploreOpen)}
            >
              <FiCompass size={20} /> Explore
              <FiChevronDown
                className={`transition-transform ${exploreOpen ? "rotate-180" : ""}`}
              />
            </button>
            {exploreOpen && (
              <>
                <button
                  aria-label="Close Explore"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setExploreOpen(false)}
                />
                <div className="absolute left-0 top-[calc(100%+12px)] z-50 w-[330px] overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-xl">
                  <div className="bg-[#16587b] px-5 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <FiHeart size={24} />
                      <div>
                        <p className="font-bold">Explore City Hospital</p>
                        <p className="text-xs text-white/75">
                          Your health, our priority
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2"><ExploreLinks /></div>
                  <div className="border-t border-[#dceaf1] bg-[#f7fafc] px-4 py-3 text-center text-xs text-[#16587b]">
                    Compassionate care for every patient
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

        {/* RIGHT-SIDE ACTIONS: one Profile button only */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {loggedIn ? (
            <Link
              href="/patient/dashboard"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#16587b] px-6 text-base font-bold text-[#16587b] transition hover:bg-[#eaf3f8]"
            >
              <FiUser size={20} /> My Profile
            </Link>
          ) : (
            <button
              type="button"
              onClick={getDirection}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#16587b] px-5 text-base font-bold text-[#16587b] transition hover:bg-[#eaf3f8]"
            >
              <FiMapPin size={20} /> Get Direction <FiArrowUpRight size={18} />
            </button>
          )}
          <Link
            href="/appointment"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#16587b] px-6 text-base font-bold text-white shadow-sm transition hover:bg-[#104662]"
          >
            <FiCalendar size={19} /> Book Appointment
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#dceaf1] text-[#16587b] lg:hidden"
        >
          {menuOpen ? <FiX size={23} /> : <FiMenu size={23} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-[#dceaf1] bg-white shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-[1400px] flex-col px-4 py-4 sm:px-6">
            <button onClick={goHome} className={mobileLink("/")}>
              <FiHome size={19} /> Home
            </button>

            {!loggedIn ? (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileLoginOpen(!mobileLoginOpen);
                    setMobileExploreOpen(false);
                  }}
                  aria-expanded={mobileLoginOpen}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-base font-bold transition ${
                    mobileLoginOpen || pathname === "/patient-login"
                      ? "bg-[#eaf3f8] text-[#16587b]"
                      : "text-[#16587b] hover:bg-[#f0f7fa]"
                  }`}
                >
                  <span className="flex items-center gap-3"><FiLogIn size={19} /> Login</span>
                  <FiChevronDown className={mobileLoginOpen ? "rotate-180" : ""} />
                </button>
                {mobileLoginOpen && (
                  <div className="ml-4 space-y-1 border-l-2 border-[#dceaf1] py-1 pl-3">
                    <Link href="/patient-login" onClick={closeMenus} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#16587b] hover:bg-[#f0f7fa]">
                      <FiUser size={17} /> Patient
                    </Link>
                    <Link href="/admin" onClick={closeMenus} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[#16587b] hover:bg-[#f0f7fa]">
                      <FiShield size={17} /> Admin
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-base font-bold text-[#16587b] hover:bg-[#f0f7fa]">
                <FiLogOut size={19} /> Logout
              </button>
            )}

            <Link href="/specialities" onClick={closeMenus} className={mobileLink("/specialities")}>
              <FiActivity size={19} /> Specialities
            </Link>

            <div>
              <button
                type="button"
                onClick={() => {
                  setMobileExploreOpen(!mobileExploreOpen);
                  setMobileLoginOpen(false);
                }}
                aria-expanded={mobileExploreOpen}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-base font-bold transition ${
                  mobileExploreOpen
                    ? "bg-[#eaf3f8] text-[#16587b]"
                    : "text-[#16587b] hover:bg-[#f0f7fa]"
                }`}
              >
                <span className="flex items-center gap-3"><FiCompass size={19} /> Explore</span>
                <FiChevronDown className={mobileExploreOpen ? "rotate-180" : ""} />
              </button>
              {mobileExploreOpen && (
                <div className="ml-4 space-y-1 border-l-2 border-[#dceaf1] py-1 pl-3">
                  <ExploreLinks mobile />
                </div>
              )}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 border-t border-[#dceaf1] pt-4 sm:grid-cols-2">
              {loggedIn ? (
                <Link href="/patient/dashboard" onClick={closeMenus} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#16587b] px-4 py-3 text-base font-bold text-[#16587b]">
                  <FiUser size={19} /> My Profile
                </Link>
              ) : (
                <button type="button" onClick={() => { closeMenus(); getDirection(); }} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#16587b] px-4 py-3 text-base font-bold text-[#16587b]">
                  <FiMapPin size={19} /> Get Direction <FiArrowUpRight size={17} />
                </button>
              )}
              <Link href="/appointment" onClick={closeMenus} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#16587b] px-4 py-3 text-base font-bold text-white">
                <FiCalendar size={18} /> Book Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
  