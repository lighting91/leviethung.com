"use client";

import Link from "next/link";
import { useState } from "react";
import type { Course, Module, Lesson } from "@/lib/content";

interface Props {
  course: Course;
  currentLesson: Lesson;
  currentModule: Module;
  isEnrolled: boolean;
}

function extractYouTubeId(input: string): string {
  // Already a plain ID (no slashes or dots)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.split("?")[0])) return input.split("?")[0];
  // youtu.be/ID or youtube.com/watch?v=ID or youtube.com/embed/ID
  const m = input.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : input.split("?")[0];
}

export default function LessonViewer({ course, currentLesson, currentModule, isEnrolled }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Flat list of all lessons for prev/next navigation
  const allLessons = course.modules?.flatMap((m) =>
    m.lessons?.map((l) => ({ ...l, moduleTitle: m.title })) ?? []
  ) ?? [];

  const currentIndex = allLessons.findIndex((l) => l.slug === currentLesson.slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-900">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div>
          <p className="text-xs text-slate-400">{currentModule.title}</p>
          <p className="text-sm text-white font-medium truncate max-w-[200px]">{currentLesson.title}</p>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-sm text-slate-300 bg-slate-700 px-3 py-1.5 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Nội dung
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "block" : "hidden"} lg:block
          w-full lg:w-72 xl:w-80 flex-shrink-0
          bg-slate-800 border-r border-slate-700
          lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
        `}
      >
        {/* Course title */}
        <div className="p-4 border-b border-slate-700">
          <Link href={`/khoa-hoc/${course.slug}`} className="text-orange-400 text-xs hover:underline mb-1 block">
            ← Trang khóa học
          </Link>
          <h2 className="text-white font-semibold text-sm line-clamp-2">{course.title}</h2>
        </div>

        {/* Module list */}
        <div className="py-2">
          {course.modules?.map((mod, mi) => (
            <div key={mi}>
              <div className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {mod.title}
              </div>
              {mod.lessons?.map((lesson) => {
                const isActive = lesson.slug === currentLesson.slug;
                const canAccess = isEnrolled || lesson.free_preview;

                return (
                  <div key={lesson.slug}>
                    {canAccess ? (
                      <Link
                        href={`/khoa-hoc/${course.slug}/hoc/${lesson.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-start gap-3 px-4 py-3 text-sm transition-colors ${
                          isActive
                            ? "bg-orange-600/20 text-orange-400 border-r-2 border-orange-500"
                            : "text-slate-300 hover:bg-slate-700/50"
                        }`}
                      >
                        <span className={`flex-shrink-0 mt-0.5 ${isActive ? "text-orange-400" : "text-green-400"}`}>
                          {isActive ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="block leading-snug">{lesson.title}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            {lesson.free_preview && !isEnrolled && (
                              <span className="text-xs text-green-500">Miễn phí</span>
                            )}
                            {lesson.duration && (
                              <span className="text-xs text-slate-500">{lesson.duration}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-start gap-3 px-4 py-3 text-sm text-slate-600 cursor-not-allowed">
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>{lesson.title}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Video area */}
        <div className="bg-black w-full">
          {currentLesson.youtube_id ? (
            <div className="aspect-video w-full max-w-5xl mx-auto">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(currentLesson.youtube_id)}?rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentLesson.title}
              />
            </div>
          ) : (
            <div className="aspect-video w-full max-w-5xl mx-auto flex items-center justify-center bg-slate-800">
              <div className="text-center">
                <div className="text-5xl mb-3">🎬</div>
                <p className="text-slate-400 text-sm">Video đang được chuẩn bị</p>
                <p className="text-slate-500 text-xs mt-1">Sẽ có sớm!</p>
              </div>
            </div>
          )}
        </div>

        {/* Lesson info + navigation */}
        <div className="flex-1 bg-white max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
          <div className="mb-1 text-sm text-slate-500">{currentModule.title}</div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">{currentLesson.title}</h1>

          {/* Prev / Next */}
          <div className="flex items-center justify-between gap-4 py-4 border-t border-slate-200">
            {prevLesson ? (
              <Link
                href={`/khoa-hoc/${course.slug}/hoc/${prevLesson.slug}`}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">{prevLesson.title}</span>
                <span className="sm:hidden">Trước</span>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link
                href={`/khoa-hoc/${course.slug}/hoc/${nextLesson.slug}`}
                className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                <span className="hidden sm:inline">{nextLesson.title}</span>
                <span className="sm:hidden">Tiếp theo</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div className="text-sm text-green-600 font-medium">🎉 Bạn đã hoàn thành khóa học!</div>
            )}
          </div>

          {/* Upsell if not enrolled and not free preview */}
          {!isEnrolled && !currentLesson.free_preview && (
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
              <p className="font-semibold text-slate-900 mb-1">Bài học này dành cho học viên đã đăng ký</p>
              <p className="text-sm text-slate-500 mb-4">Đăng ký ngay để xem toàn bộ {allLessons.length} bài học</p>
              <Link
                href={`/khoa-hoc/${course.slug}#dang-ky`}
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                Xem chi tiết khóa học →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
