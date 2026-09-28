
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Star,
  ThumbsUp,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

const googleReviewsUrl =
  "https://www.google.com/maps/place/City+hospital/@25.5795478,83.9904515,17z/data=!4m8!3m7!1s0x3992752335607e5f:0xb183e20aea97e06!8m2!3d25.5795478!4d83.9930264!9m1!1b1!16s%2Fg%2F11l6dbxqxr?entry=ttu";

const reviews = [
  {
    name: "pruthviraj rajole",
    count: "3 reviews",
    date: "2 years ago",
    initials: "PR",
    color: "#16587b",
    text: "Firstly, I am overwhelmed by the humility of Dr Prakash Rai and Dr. Rashmi Rai...they are not only experts in their field but are also very affectionate and polite as person...i think city hospital not only provides with best medical facilities but also with humane care and love...lots of wishes and please carry on the good work.",
    likes: 0,
  },
  {
    name: "Akshay Bhangire",
    count: "3 reviews",
    date: "11 months ago",
    initials: "AB",
    color: "#0d9488",
    text: "Good communication skills and excellent patient care",
    likes: 0,
  },
  {
    name: "shashikant Prajapati",
    count: "1 review",
    date: "2 years ago",
    initials: "SP",
    color: "#64748b",
    text: "Dr behaviour is good and has sympathy towards his patients.",
    likes: 1,
  },
  {
    name: "Dinesh Tiwary",
    count: "1 review",
    date: "Edited 2 years ago",
    initials: "D",
    color: "#6840b5",
    text: "Dr Rashmi and Dr. Prakash is a best surgeon",
    likes: 1,
    response: "Thank you",
  },
  {
    name: "Dr. Abhishek Kumar",
    count: "Local Guide · 75 reviews · 61 photos",
    date: "a year ago",
    initials: "AK",
    color: "#16587b",
    text: "डॉ. प्रकाश बक्सर में एक बहुत अच्छे चिकित्सक हैं। उनके पास चिकित्सा के अलावा भी व्यापक ज्ञान है। वह विभिन्न बीमारियों से निपट सकते हैं और हर चीज को बहुत स्पष्ट रूप से समझा सकते हैं। यदि आप बीमार हैं तो मैं रोगी को उनसे मिलने का सुझाव दूंगा। वह युवा और ऊर्जावान हैं।",
    likes: 0,
  },
  {
    name: "Vikas Rai",
    count: "1 review",
    date: "2 years ago",
    initials: "V",
    color: "#0d9488",
    text: "I got best treatment here by experienced doctor dr. Prakash (MBBS, MD). I think he is a best physician in buxer district. And service of hospital was too good. You should visit here to get best treatment. Thank you. City hospital.",
    likes: 5,
  },
  {
    name: "Sanjeevani Hospitals",
    count: "1 review",
    date: "2 years ago",
    initials: "S",
    color: "#92756b",
    text: "A wonderful doctor with great experience... very supportive staff like Guddu, Naveen, Gupta ji",
    likes: 5,
    response: "Thank you",
  },
  {
    name: "Aditya Sharma",
    count: "3 reviews",
    date: "2 years ago",
    initials: "AS",
    color: "#c28b00",
    text: "Very good service and most cooperative staff I'm happy. Thanks to city hospital team.",
    likes: 0,
  },
];

function ReviewCard({ review }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#dceaf1] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: review.color }}
        >
          {review.initials}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-[#202124]">
            {review.name}
          </h3>
          <p className="text-sm text-gray-500">{review.count}</p>
        </div>

        <span className="text-xl leading-none text-gray-500">⋮</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div
          className="flex items-center gap-0.5 text-[#fbbc04]"
          aria-label="5 out of 5 stars"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={18}
              fill="currentColor"
              strokeWidth={1.5}
            />
          ))}
        </div>

        <span className="text-sm text-gray-500">{review.date}</span>
      </div>

      <p className="mt-3 flex-1 overflow-y-auto whitespace-pre-line text-[15px] leading-6 text-[#30343b]">
        {review.text}
      </p>

      {review.response && (
        <div className="mt-3 border-l-2 border-[#dceaf1] pl-3">
          <p className="text-sm font-medium text-gray-700">
            Response from the owner
            <span className="ml-2 font-normal text-gray-500">2 years ago</span>
          </p>
          <p className="mt-1 text-sm text-gray-600">{review.response}</p>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <ThumbsUp size={17} />
        <span>{review.likes > 0 ? review.likes : "Like"}</span>
      </div>
    </article>
  );
}

export default function GoogleReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimer = useRef(null);

  const pauseSlider = () => {
    clearTimeout(resumeTimer.current);
    setIsPaused(true);
  };

  const resumeSlider = () => {
    clearTimeout(resumeTimer.current);

    resumeTimer.current = setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };

  const previousReview = () => {
    setActiveIndex((current) => (current - 1 + reviews.length) % reviews.length);
  };

  const nextReview = () => {
    setActiveIndex((current) => (current + 1) % reviews.length);
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeIndex, isPaused]);

  useEffect(() => {
    return () => clearTimeout(resumeTimer.current);
  }, []);

  return (
    <section className="bg-[#f7fafc] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="h-[2px] w-8 bg-[#A9002D]" />
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#16587b]">
            Patient Testimonials
          </span>
          <span className="h-[2px] w-8 bg-[#A9002D]" /> 

          <h2 className="mt-2 text-3xl font-bold text-[#123b50] sm:text-4xl">
            What Our Patients Say
          </h2>

          <p className="mt-3 text-gray-600">
            Experiences shared by patients of City Hospital.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="font-semibold text-[#202124]">Google</span>
            <span>4.9</span>
            <span className="flex items-center gap-0.5 text-[#fbbc04]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={17}
                  fill="currentColor"
                  strokeWidth={1.5}
                />
              ))}
            </span>
            <span> 75 Reviews</span>
          </div>
        </div>

        <div className="mx-auto flex max-w-2xl items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={previousReview}
            aria-label="Previous review"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dceaf1] bg-white text-[#16587b] shadow-sm transition hover:bg-[#eaf4f9] sm:flex"
          >
            <ChevronUp size={22} />
          </button>

          <div
            className="relative h-[340px] min-w-0 flex-1 overflow-hidden rounded-2xl sm:h-[310px]"
            onMouseEnter={pauseSlider}
            onMouseLeave={resumeSlider}
            onTouchStart={pauseSlider}
            onTouchEnd={resumeSlider}
            onTouchCancel={resumeSlider}
            onFocusCapture={pauseSlider}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                resumeSlider();
              }
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-full transition-transform duration-[2000ms] ease-in-out"
              style={{ transform: `translateY(-${activeIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={`${review.name}-${index}`} className="h-full w-full pb-2">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={nextReview}
            aria-label="Next review"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dceaf1] bg-white text-[#16587b] shadow-sm transition hover:bg-[#eaf4f9] sm:flex"
          >
            <ChevronDown size={22} />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={`${review.name}-dot-${index}`}
              type="button"
              aria-label={`Show review ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index
                  ? "w-7 bg-[#16587b]"
                  : "w-2.5 bg-[#b7cfdd]"
              }`}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#16587B] px-5 py-2.5 font-medium text-[#16587B] transition-all duration-200 hover:bg-[#16587B] hover:text-white"
          >
            Read All Reviews on Google
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}