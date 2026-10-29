"use client";

import { useState } from "react";
import type { Course } from "@/lib/content";

interface Props {
  course: Course;
}

export default function Faq({ course }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!course.faq || course.faq.length === 0) return null;

  return (
    <section className="py-14 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-ink text-center mb-8">Câu hỏi thường gặp</h2>

        <div className="space-y-3">
          {course.faq.map((item, i) => (
            <div key={i} className="border border-line rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-soft transition-colors"
              >
                <span className="font-medium text-ink pr-4">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-muted flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-body text-sm leading-relaxed border-t border-line pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
