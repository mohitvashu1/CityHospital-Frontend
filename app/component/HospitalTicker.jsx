
"use client";

import { MapPin, Phone, Mail, Clock3, Star } from "lucide-react";

const items = [
  {
    icon: Phone,
    content: "+91 7061848401",
    href: "tel:+917061848401",
  },
  {
    icon: Mail,
    content: "Cityhospitalbuxar@gmail.com",
    href: "mailto:Cityhospitalbuxar@gmail.com",
  },
  {
    icon: MapPin,
    content: "Near Hindustan Machinery, Golumber, Buxar, Bihar 802101",
  },
  {
    icon: Clock3,
    content: "Mon - Fri: 08 AM to PM | Sat - Sun: 08 AM to PM",
  },
  {
    icon: Star,
    content: "City Hospital, Buxar",
  },
];

export default function HospitalTicker() {
  return (
    <div className="w-full overflow-hidden border-b border-white/10 bg-[#0d2638] text-white">
      <div className="hospital-ticker-track flex w-max items-center py-2">
        {[0, 1].map((group) => (
          <div
            key={group}
            className="flex shrink-0 items-center gap-7 px-5 sm:gap-10 sm:px-8"
            aria-hidden={group === 1}
          >
            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={`${group}-${index}`}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[11px] sm:text-xs"
                >
                  <Icon size={14} className="shrink-0 text-[#84b3ce]" />
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-medium text-white/90 transition hover:text-[#84b3ce]"
                      tabIndex={group === 1 ? -1 : 0}
                    >
                      {item.content}
                    </a>
                  ) : (
                    <span className="font-medium text-white/90">
                      {item.content}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .hospital-ticker-track {
          animation: hospitalTicker 32s linear infinite;
        }

        .hospital-ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes hospitalTicker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hospital-ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}