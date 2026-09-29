
"use client";

import React from "react";
import { Phone, Mail, MapPin, Clock3, Star } from "lucide-react";

const tickerItems = [
  {
    icon: Phone,
    content: (
      <a
        href="tel:+917061848401"
        className="font-medium text-white/90 transition hover:text-[#84b3ce]"
      >
        +91 7061848401
      </a>
    ),
  },
  {
    icon: Mail,
    content: (
      <a
        href="mailto:Cityhospitalbuxar@gmail.com"
        className="font-medium text-white/90 transition hover:text-[#84b3ce]"
      >
        Cityhospitalbuxar@gmail.com
      </a>
    ),
  },
  {
    icon: MapPin,
    content: (
      <span className="font-medium text-white/90">
        Near Hindustan Machinery, Golumber, Buxar, Bihar 802101
      </span>
    ),
  },
  {
    icon: Clock3,
    content: (
      <span className="font-medium text-white/90">
        Mon - Fri: 08 AM to PM | Sat - Sun: 08 AM to PM
      </span>
    ),
  },
  {
    icon: Star,
    content: (
      <span className="font-medium text-white/90">
        City Hospital, Buxar
      </span>
    ),
  },
];

function TickerContent({ duplicate = false }) {
  return (
    <div
      className="flex shrink-0 items-center gap-7 px-5 sm:gap-10 sm:px-8"
      aria-hidden={duplicate ? "true" : undefined}
    >
      {tickerItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={`${duplicate ? "duplicate" : "original"}-${index}`}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[11px] sm:text-xs"
          >
            <Icon
              size={14}
              className="shrink-0 text-[#84b3ce]"
              aria-hidden="true"
            />
            {item.content}
          </div>
        );
      })}
    </div>
  );
}

export default function HospitalTicker() {
  return (
    <div className="hospital-ticker w-full overflow-hidden border-b border-white/10 bg-[#123b50] text-white">
      <div className="hospital-ticker-track flex w-max items-center py-2">
        <TickerContent />
        <TickerContent duplicate />
      </div>
    </div>
  );
}