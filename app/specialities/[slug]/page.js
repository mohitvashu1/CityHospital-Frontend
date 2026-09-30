
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiPhone } from "react-icons/fi";
import {
  specialities,
  getSpecialityBySlug,
} from "../../data/specialities";

export function generateStaticParams() {
  return specialities.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const speciality = getSpecialityBySlug(slug);

  if (!speciality) {
    return {
      title: "Speciality Not Found | City Hospital",
    };
  }

  return {
    title: `${speciality.title} | City Hospital Buxar`,
    description: speciality.shortDescription,
  };
}

export default async function SpecialityPage({ params }) {
  const { slug } = await params;
  const speciality = getSpecialityBySlug(slug);

  if (!speciality) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7fafc]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#16587b]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[40px] border-white" />
          <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full border-[35px] border-white" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
          <div>
            <Link
              href="/specialities"
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
            >
              <span aria-hidden="true">&#8592;</span>
              All Specialities
            </Link>

            <span className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              {speciality.tag}
            </span>

            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {speciality.title}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              {speciality.shortDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/appointment"
                className="inline-flex items-center justify-center rounded-lg bg-[#a9002d] px-6 py-3 font-semibold text-white transition hover:bg-[#8f0026]"
              >
                Book Appointment
              </Link>

              <a
                href="tel:06183359844"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <FiPhone size={18} />
                Call Hospital
              </a>
            </div>
          </div>

          <div className="relative mx-auto h-64 w-full max-w-xl overflow-hidden rounded-2xl border-4 border-white/15 bg-white/10 shadow-2xl sm:h-80">
            <Image
              src={speciality.image}
              alt={speciality.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

    

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid  md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <span className="text-xl font-bold uppercase tracking-wider text-[#a9002d]">
              About this speciality
            </span>

            <h2 className="mt-3 text-2xl font-bold text-[#123b50] sm:text-3xl">
              Care focused on your health
            </h2>

            <p className="mt-5 text-base leading-8 text-[#567384]">
              {speciality.description}
            </p>
          </div>

          <div className="rounded-2xl border border-[#dceaf1] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#123b50]">
              Need a consultation?
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#617b89]">
              Contact City Hospital to ask about appointments and the care
              available for your needs.
            </p>

            <Link
              href="/appointment"
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#16587b] px-5 py-3 font-semibold text-white transition hover:bg-[#104662]"
            >
              Book Appointment
            </Link>

            <a
              href="tel:06183359844"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#dceaf1] px-5 py-3 font-semibold text-[#16587b] transition hover:bg-[#f2f8fb]"
            >
              <FiPhone size={18} />
              06183 359 844
            </a>
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-wider text-[#a9002d]">
              Our care
            </span>
            <h2 className="mt-3 text-2xl font-bold text-[#123b50] sm:text-3xl">
              Treatments & Consultation
            </h2>
            <p className="mt-3 leading-7 text-[#617b89]">
              Consultation and care options may vary depending on clinical
              assessment and the hospital's available services.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {speciality.treatments.map((treatment, index) => (
              <div
                key={treatment}
                className="flex items-start gap-4 rounded-xl border border-[#dceaf1] bg-[#f7fafc] p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e3f0f7] font-bold text-[#16587b]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="pt-1 font-semibold leading-6 text-[#123b50]">
                  {treatment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-sm font-bold uppercase tracking-wider text-[#a9002d]">
            Patient support
          </span>
          <h2 className="mt-3 text-2xl font-bold text-[#123b50] sm:text-3xl">
            Care & Facilities
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {speciality.facilities.map((facility) => (
            <div
              key={facility}
              className="rounded-xl border border-[#dceaf1] bg-white p-5 shadow-sm"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f2f8] text-xl text-[#16587b]">
                +
              </span>
              <h3 className="font-semibold leading-6 text-[#123b50]">
                {facility}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors */}
      {speciality.doctors.length > 0 && (
        <section className="bg-[#eaf3f8] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="text-sm font-bold uppercase tracking-wider text-[#a9002d]">
                Medical team
              </span>
              <h2 className="mt-3 text-2xl font-bold text-[#123b50] sm:text-3xl">
                Consult our Doctors
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {speciality.doctors.map((doctor) => (
                <div
                  key={doctor}
                  className="rounded-xl border border-[#dceaf1] bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f2f8] text-xl text-[#16587b]">
                    +
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#123b50]">
                    {doctor}
                  </h3>
                  <p className="mt-2 text-sm text-[#617b89]">
                    City Hospital, Buxar
                  </p>
                  <Link
                    href="/doctors"
                    className="mt-5 inline-flex font-semibold text-[#16587b] hover:text-[#a9002d]"
                  >
                    View Doctors <span className="ml-2">&#8594;</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-2xl bg-[#123b50] p-7 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Your health matters to us
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/75">
              Contact City Hospital for appointment details and information
              about available medical services.
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
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10 md:flex-none"
            >
              <FiPhone size={18} />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}