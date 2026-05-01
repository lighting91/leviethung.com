"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Course, Module, Lesson } from "@/lib/content";

interface Props {
  course: Course;
  currentLesson: Lesson;
  currentModule: Module;
  isEnrolled: boolean;
  canAccessLesson: boolean;
  userName?: string | null;
  completedLessons?: string[];
  relatedCourses?: Course[];
}

function extractYouTubeId(input: string): string {
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.split("?")[0])) return input.split("?")[0];
  const m = input.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : input.split("?")[0];
}

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function LessonViewer({
  course,
  currentLesson,
  currentModule,
  isEnrolled,
  canAccessLesson,
  userName,
  completedLessons = [],
  relatedCourses = [],
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localCompleted, setLocalCompleted] = useState<string[]>(completedLessons);
  const [marking, setMarking] = useState(false);

  const allLessons = course.modules?.flatMap((m) =>
    m.lessons?.map((l) => ({ ...l, moduleTitle: m.title })) ?? []
  ) ?? [];

  const currentIndex = allLessons.findIndex((l) => l.slug === currentLesson.slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isCurrentCompleted = localCompleted.includes(currentLesson.slug);

  // Determine if next lesson is accessible (for the next button)
  const nextLessonAccessible = nextLesson
    ? (nextLesson.free_preview ?? false) || (isEnrolled && localCompleted.includes(currentLesson.slug))
    : false;

  function getLessonState(lesson: Lesson, index: number): "active" | "completed" | "available" | "locked-sequential" | "locked-not-enrolled" {
    const isActive = lesson.slug === currentLesson.slug;
    const isCompleted = localCompleted.includes(lesson.slug);

    if (lesson.free_preview) {
      if (isActive) return "active";
      return isCompleted ? "completed" : "available";
    }

    if (!isEnrolled) return "locked-not-enrolled";

    if (isCompleted) return isActive ? "active" : "completed";
    if (index === 0) return isActive ? "active" : "available";

    const prevCompleted = localCompleted.includes(allLessons[index - 1].slug);
    if (prevCompleted) return isActive ? "active" : "available";

    return "locked-sequential";
  }

  async function markComplete() {
    setMarking(true);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug, lessonSlug: currentLesson.slug }),
      });
      setLocalCompleted((prev) => [...prev, currentLesson.slug]);
    } finally {
      setMarking(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // Block view-source and common copy shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && ["s", "u", "p"].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === "F12") e.preventDefault();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const videoId = currentLesson.youtube_id ? extractYouTubeId(currentLesson.youtube_id) : "";

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen bg-slate-900 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="min-w-0">
          <p className="text-xs text-slate-400 truncate">{currentModule.title}</p>
          <p className="text-sm text-white font-medium truncate max-w-[200px]">{currentLesson.title}</p>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex-shrink-0 flex items-center gap-2 text-sm text-slate-300 bg-slate-700 px-3 py-1.5 rounded-lg ml-2"
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
        {/* User info */}
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          {userName ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{userName[0].toUpperCase()}</span>
                </div>
                <span className="text-white text-sm font-medium truncate">{userName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link href="/dang-nhap" className="text-orange-400 text-xs hover:underline">
              Đăng nhập để lưu tiến trình
            </Link>
          )}
        </div>

        {/* Course title */}
        <div className="p-4 border-b border-slate-700">
          <Link href={`/khoa-hoc/${course.slug}`} className="text-orange-400 text-xs hover:underline mb-1 block">
            ← Trang khóa học
          </Link>
          <h2 className="text-white font-semibold text-sm line-clamp-2">{course.title}</h2>
          {isEnrolled && (
            <div className="mt-2">
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.round((localCompleted.length / Math.max(allLessons.length, 1)) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {localCompleted.length}/{allLessons.length} bài hoàn thành
              </p>
            </div>
          )}
        </div>

        {/* Module list */}
        <div className="py-2">
          {course.modules?.map((mod, mi) => (
            <div key={mi}>
              <div className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {mod.title}
              </div>
              {mod.lessons?.map((lesson, li) => {
                const globalIndex = allLessons.findIndex((l) => l.slug === lesson.slug);
                const state = getLessonState(lesson, globalIndex);
                const isActive = state === "active";
                const isAccessible = state === "active" || state === "completed" || state === "available";

                const icon = () => {
                  if (state === "completed") return (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  );
                  if (state === "active") return (
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  );
                  if (isAccessible) return (
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  );
                  return (
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  );
                };

                const content = (
                  <>
                    <span className="flex-shrink-0 mt-0.5">{icon()}</span>
                    <div className="flex-1 min-w-0">
                      <span className="block leading-snug">{lesson.title}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        {lesson.free_preview && !isEnrolled && (
                          <span className="text-xs text-green-500">Miễn phí</span>
                        )}
                        {state === "locked-sequential" && (
                          <span className="text-xs text-slate-600">Hoàn thành bài trước</span>
                        )}
                        {lesson.duration && (
                          <span className="text-xs text-slate-500">{lesson.duration}</span>
                        )}
                      </div>
                    </div>
                  </>
                );

                return (
                  <div key={lesson.slug}>
                    {isAccessible ? (
                      <Link
                        href={`/khoa-hoc/${course.slug}/hoc/${lesson.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-start gap-3 px-4 py-3 text-sm transition-colors ${
                          isActive
                            ? "bg-orange-600/20 text-orange-400 border-r-2 border-orange-500"
                            : "text-slate-300 hover:bg-slate-700/50"
                        }`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex items-start gap-3 px-4 py-3 text-sm text-slate-600 cursor-not-allowed">
                        {content}
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
        <div
          className="bg-black w-full"
          onContextMenu={(e) => e.preventDefault()}
        >
          {!canAccessLesson ? (
            <div className="aspect-video w-full max-w-5xl mx-auto flex items-center justify-center bg-slate-800">
              <div className="text-center px-6">
                <div className="text-5xl mb-3">🔒</div>
                <p className="text-white font-semibold mb-2">Hoàn thành bài học trước để mở khóa</p>
                <p className="text-slate-400 text-sm">
                  {prevLesson ? `Bài "${prevLesson.title}" cần được hoàn thành trước` : "Bài học này chưa mở khóa"}
                </p>
                {prevLesson && (
                  <Link
                    href={`/khoa-hoc/${course.slug}/hoc/${prevLesson.slug}`}
                    className="inline-block mt-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                  >
                    Học bài trước →
                  </Link>
                )}
              </div>
            </div>
          ) : videoId ? (
            <div className="aspect-video w-full max-w-5xl mx-auto">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">{currentLesson.title}</h1>

          {/* Mark complete button */}
          {isEnrolled && canAccessLesson && (
            <div className="mb-6">
              {isCurrentCompleted ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bài học đã hoàn thành
                </div>
              ) : (
                <button
                  onClick={markComplete}
                  disabled={marking}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {marking ? "Đang lưu..." : "Đánh dấu hoàn thành"}
                </button>
              )}
            </div>
          )}

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
                <span className="hidden sm:inline truncate max-w-[180px]">{prevLesson.title}</span>
                <span className="sm:hidden">Trước</span>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              nextLessonAccessible ? (
                <Link
                  href={`/khoa-hoc/${course.slug}/hoc/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <span className="hidden sm:inline truncate max-w-[180px]">{nextLesson.title}</span>
                  <span className="sm:hidden">Tiếp theo</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="hidden sm:inline">Hoàn thành bài này để mở khóa</span>
                  <span className="sm:hidden">Hoàn thành trước</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )
            ) : (
              <div className="text-sm text-green-600 font-medium">🎉 Bạn đã hoàn thành khóa học!</div>
            )}
          </div>

          {/* Upsell if not enrolled and not free preview */}
          {!isEnrolled && !currentLesson.free_preview && (
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
              <p className="font-semibold text-slate-900 mb-1">Bài học này dành cho học viên đã đăng ký</p>
              <p className="text-sm text-slate-500 mb-4">
                Đăng ký ngay để xem toàn bộ {allLessons.length} bài học
              </p>
              <Link
                href={`/khoa-hoc/${course.slug}/thanh-toan`}
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                Đăng ký khóa học →
              </Link>
            </div>
          )}
        </div>

        {/* Related courses */}
        {relatedCourses.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Khóa học tiếp theo</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedCourses.map((rc) => (
                  <Link
                    key={rc.slug}
                    href={`/khoa-hoc/${rc.slug}`}
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:border-orange-300 hover:shadow-sm transition-all group"
                  >
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{rc.level}</span>
                    <h3 className="font-semibold text-slate-900 mt-2.5 mb-1 text-sm group-hover:text-orange-600 transition-colors leading-snug">
                      {rc.title}
                    </h3>
                    <p className="text-sm font-semibold text-orange-600">
                      {rc.price ? formatPrice(rc.price) : "Liên hệ"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
