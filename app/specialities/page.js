
import Image from "next/image";
import Link from "next/link";
import { specialities } from "../data/specialities";

export const metadata = {
  title: "All Specialities | City Hospital Buxar",
  description:
    "Explore medical specialities and healthcare services at City Hospital, Buxar.",
};

export default function AllSpecialitiesPage() {
  return (
    <main className="min-h-screen bg-[#f7fafc]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#16587b]">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-white/10" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full border-[35px] border-white/10" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 text-white sm:px-6 md:py-20 lg:px-8">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            <span aria-hidden="true">←</span> Back to Home
          </Link>

          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold">
              City Hospital, Buxar
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Our Medical Specialities
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Explore our medical specialities, learn about healthcare
              services and find information to help plan your consultation.
            </p>

            <span className="mt-7 inline-flex rounded-lg bg-white/10 px-4 py-2 text-sm font-medium">
              {specialities.length} Specialities
            </span>
          </div>
        </div>
      </section>

      {/* All Specialities */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="mb-9">
          <p className="text-sm font-bold uppercase tracking-wider text-[#a9002d]">
            Explore Services
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#123b50] sm:text-3xl">
            Find the care you need
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#617b89]">
            Select a speciality to view its details, care information and
            appointment options.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specialities.map((speciality) => (
            <article
              key={speciality.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#dceaf1] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Link
                href={`/specialities/${speciality.slug}`}
                className="relative block h-56 overflow-hidden bg-[#eaf3f8]"
                aria-label={`Learn more about ${speciality.title}`}
              >
                <Image
                  src={speciality.image}
                  alt={speciality.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#16587b] shadow-sm">
                  {speciality.tag}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-xl font-bold text-[#123b50] transition group-hover:text-[#16587b]">
                  {speciality.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-[#617b89]">
                  {speciality.shortDescription}
                </p>

                <div className="mt-5 border-t border-[#dceaf1] pt-4">
                  <Link
                    href={`/specialities/${speciality.slug}`}
                    className="inline-flex items-center gap-2 font-semibold text-[#16587b] transition hover:gap-3 hover:text-[#a9002d]"
                  >
                    Learn More <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#123b50] p-7 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Need an appointment?
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/75">
              Contact City Hospital for appointment and service information.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-3 md:w-auto">
            <Link
              href="/appointment"
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#a9002d] px-6 py-3 font-semibold text-white transition hover:bg-[#8f0026] md:flex-none"
            >
              Book Appointment
            </Link>

            <a
              href="tel:06183359844"
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10 md:flex-none"
            >
              Call Hospital
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}