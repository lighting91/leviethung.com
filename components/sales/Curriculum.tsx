"use client";

import { useState } from "react";
import type { Course } from "@/lib/content";

interface Props {
  course: Course;
}

export default function Curriculum({ course }: Props) {
  const [openModule, setOpenModule] = useState<number>(0);

  if (!course.modules || course.modules.length === 0) return null;

  const totalLessons = course.modules.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0);

  return (
    <section className="py-14 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Nội dung khóa học</h2>
        <p className="text-slate-500 text-center mb-8">
          {course.modules.length} module • {totalLessons} bài học
          {course.duration && ` • ${course.duration}`}
        </p>

        <div className="space-y-3">
          {course.modules.map((mod, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenModule(openModule === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">{mod.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{mod.lessons?.length ?? 0} bài học</p>
                </div>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${openModule === i ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openModule === i && mod.lessons && (
                <div className="border-t border-slate-100">
                  {mod.lessons.map((lesson, j) => (
                    <div key={j} className="flex items-center gap-3 px-5 py-3 border-b border-slate-50 last:border-0">
                      <span className="text-green-500 flex-shrink-0">
                        {lesson.free_preview ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm text-slate-700 flex-1">{lesson.title}</span>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {lesson.free_preview && (
                          <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-medium">Miễn phí</span>
                        )}
                        {lesson.duration && <span>{lesson.duration}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
