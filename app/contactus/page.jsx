
"use client";

import { useState } from "react";
import {
  Phone,
  MapPin,
  Clock3,
  Mail,
  MessageCircle,
  Navigation,
  ShieldAlert,
  Send,
  CheckCircle2,
  Loader2,
  Share2,
} from "lucide-react";

const FORMSPREE_URL = "https://formspree.io/f/mnppgzoe";

const HOSPITAL_PHONE = "+916183359844";
const WHATSAPP_NUMBER = "918957052687";
const SOS_NUMBER = "+916183359844";

const HOSPITAL_ADDRESS =
  "Near Hindustan Machinery, Golumber, Buxar, Bihar 802101";

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("City Hospital, " + HOSPITAL_ADDRESS);

const inputClass =
  "w-full rounded-xl border border-[#dceaf1] bg-white px-3.5 py-2.5 text-sm text-[#123b50] outline-none transition placeholder:text-slate-400 focus:border-[#16587b] focus:ring-4 focus:ring-[#16587b]/10";

const labelClass =
  "mb-1.5 block text-sm font-medium text-[#123b50]";

const categories = ["Enquiry", "Feedback", "Others"];

export default function ContactUsPage() {
  const [category, setCategory] = useState("Enquiry");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          category,
          hospital: "City Hospital, Buxar",
          _subject: `${category} - City Hospital Contact Form`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.errors?.[0]?.message ||
            "Unable to submit your message. Please try again."
        );
      }

      setSuccess(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f7fafc] font-sans antialiased">

      {/* FULL-PAGE BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/contact/contact-bg.png')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-white/65 backdrop-blur-[1px]"
      />

      {/* HERO */}
      <section className="relative z-10 overflow-hidden px-4 py-14 text-center text-white sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#123b50]/85 via-[#16587b]/75 to-[#123b50]/85" />

        <div className="relative z-10 mx-auto max-w-4xl">

          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest">
            <MessageCircle size={15} />
            We're here to help
          </span>

          <h1 className="text-3xl font-bold drop-shadow-sm sm:text-4xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
            We would love to hear from you. Contact City Hospital
            for appointments, enquiries, feedback and assistance.
            Our team is always ready to help.
          </p>

        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.35fr]">

          {/* LEFT CONTACT DETAILS */}
          <div className="overflow-hidden rounded-2xl border border-[#dceaf1] bg-white/95 backdrop-blur-xl shadow-lg shadow-[#123b50]/8">

            <div className="p-5 sm:p-6">

              <h2 className="text-xl font-semibold tracking-tight text-[#123b50] sm:text-2xl">
                Contact Details
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-lg">
                Get in touch with our hospital team.
              </p>

              <div className="mt-6 space-y-5">

                {/* PHONE */}
                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eaf3f8] text-[#16587b]">
                    <Phone size={22} />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-[#123b50]">
                      Phone Number
                    </h3>

                    <a
                      href={`tel:${HOSPITAL_PHONE}`}
                      className="mt-2 block text-sm font-semibold text-slate-700 hover:text-[#16587b] sm:text-lg"
                    >
                      +91 61833 59844
                    </a>

                    <p className="mt-1 text-xs text-slate-400">
                      Call our hospital reception
                    </p>
                  </div>

                </div>

                {/* EMAIL */}
                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eaf3f8] text-[#16587b]">
                    <Mail size={22} />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-[#123b50]">
                      Email
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Contact us through the enquiry form.
                    </p>
                  </div>

                </div>

                {/* ADDRESS */}
                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eaf3f8] text-[#16587b]">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-[#123b50]">
                      Hospital Address
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-lg">
                      {HOSPITAL_ADDRESS}
                    </p>

                    <a
                      href={MAP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#16587b] hover:text-[#a9002d]"
                    >
                      Get Directions
                      <Navigation size={15} />
                    </a>
                  </div>

                </div>

                {/* TIMINGS */}
                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eaf3f8] text-[#16587b]">
                    <Clock3 size={22} />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-[#123b50]">
                      Working Hours
                    </h3>

                    <p className="mt-2 text-base text-slate-700 sm:text-lg">
                      OPD timings + 24/7 Emergency
                    </p>

                    <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Emergency Available 24/7
                    </span>
                  </div>

                </div>

              </div>

            </div>

            {/* SOCIAL LINKS */}
            <div className="border-t border-[#dceaf1] bg-[#f7fafc] p-5 sm:p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16587b] text-white">
                  <Share2 size={19} />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#123b50]">
                    Follow Us
                  </h3>
                  <p className="text-sm text-slate-500">
                    Stay connected with City Hospital
                  </p>
                </div>
              </div>

              
            </div>

          </div>

          {/* RIGHT CONTACT FORM */}
          <div className="rounded-2xl border border-[#dceaf1] bg-white/95 p-5 backdrop-blur-xl shadow-lg shadow-[#123b50]/8 sm:p-6 lg:p-7">

            <div className="mb-8">

              <h2 className="text-xl font-semibold tracking-tight text-[#123b50] sm:text-2xl">
                Send Us a Message
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-lg">
                Fill in the details below and our team will get in touch.
              </p>

            </div>

            {/* CATEGORY TABS */}
            <div className="mb-8 flex flex-wrap gap-2">

              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    category === item
                      ? "border-[#16587b] bg-[#16587b] text-white shadow-md shadow-[#16587b]/20"
                      : "border-[#dceaf1] bg-white text-[#123b50] hover:border-[#16587b] hover:text-[#16587b]"
                  }`}
                >
                  {item}
                </button>
              ))}

            </div>

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">

                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />

                <div>
                  <p className="font-bold">
                    Message submitted successfully!
                  </p>

                  <p className="mt-1 text-sm">
                    Thank you for contacting City Hospital. We will get back to you.
                  </p>
                </div>

              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

              <input
                type="hidden"
                name="category"
                value={category}
              />

              <div className="grid gap-5 sm:grid-cols-2">

                {/* NAME */}
                <div>
                  <label className={labelClass}>
                    Full Name *
                  </label>

                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="Enter your name"
                    className={inputClass}
                    maxLength={100}
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className={labelClass}>
                    E-mail
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="Enter your email"
                    className={inputClass}
                    maxLength={150}
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className={labelClass}>
                    Mobile Number *
                  </label>

                  <input
                    required
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    maxLength={10}
                    minLength={10}
                    pattern="[6-9][0-9]{9}"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      })
                    }
                    placeholder="Enter 10-digit mobile number"
                    className={inputClass}
                  />
                </div>

                {/* HOSPITAL */}
                <div>
                  <label className={labelClass}>
                    Hospital *
                  </label>

                  <input
                    value="City Hospital, Buxar"
                    readOnly
                    className={`${inputClass} cursor-not-allowed bg-slate-50`}
                  />
                </div>

              </div>

              {/* MESSAGE */}
              <div>
                <label className={labelClass}>
                  Your Message *
                </label>

                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  rows={5}
                  maxLength={2000}
                  placeholder={
                    category === "Feedback"
                      ? "Share your experience with us..."
                      : category === "Enquiry"
                      ? "How can we help you?"
                      : "Write your message here..."
                  }
                  className={`${inputClass} resize-y`}
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.message.length}/2000
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16587b] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#16587b]/20 transition hover:bg-[#123b50] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-44"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Submit {category}
                  </>
                )}
              </button>

              <p className="text-xs leading-5 text-slate-400">
                Your contact information will only be used to respond to your message.
              </p>

            </form>

          </div>

        </div>

        {/* MAP SECTION */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-[#dceaf1] bg-white/95 backdrop-blur-xl shadow-sm">

          <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">

            <div>
              <h2 className="text-xl font-semibold text-[#123b50] sm:text-2xl">
                Find City Hospital
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-lg">
                {HOSPITAL_ADDRESS}
              </p>
            </div>

            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16587b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123b50]"
            >
              <Navigation size={17} />
              Get Directions
            </a>

          </div>

          <iframe
            title="City Hospital location map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              "City Hospital, " + HOSPITAL_ADDRESS
            )}&output=embed`}
            width="100%"
            height="350"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0"
          />

        </div>

      </section>

      {/* FLOATING WHATSAPP - BOTTOM RIGHT */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          "Hello City Hospital, I need assistance."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with City Hospital on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-white shadow-xl shadow-black/20 transition hover:scale-105 sm:bottom-7 sm:right-7"
      >
        <MessageCircle size={21} />
        <span className="text-sm font-semibold">WhatsApp</span>
      </a>

      {/* SOS EMERGENCY - STACKED ABOVE WHATSAPP */}
      <a
        href={`tel:${SOS_NUMBER}`}
        aria-label="Call City Hospital emergency"
        className="fixed bottom-[4.25rem] right-5 z-50 flex items-center gap-2 rounded-full bg-[#a9002d] px-4 py-3 text-sm font-bold text-white shadow-xl shadow-black/20 transition hover:scale-105 hover:bg-red-800 sm:bottom-[5rem] sm:right-7"
      >
        <ShieldAlert size={18} />
        SOS Emergency
      </a>

    </main>
  );
}

function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dceaf1] bg-white text-[#16587b] transition hover:border-[#16587b] hover:bg-[#16587b] hover:text-white"
    >
      {icon}
    </a>
  );
}
