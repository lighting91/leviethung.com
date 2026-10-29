"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
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
      className="flex flex-col lg:flex-row min-h-screen bg-ink select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#16181d] border-b border-white/10">
        <div className="min-w-0">
          <p className="text-xs text-[#8b95a3] truncate">{currentModule.title}</p>
          <p className="text-sm text-white font-medium truncate max-w-[200px]">{currentLesson.title}</p>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex-shrink-0 flex items-center gap-2 text-sm text-[#c8ced6] bg-white/10 px-3 py-1.5 rounded-lg ml-2"
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
          bg-[#16181d] border-r border-white/10
          lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
        `}
      >
        {/* User info */}
        <div className="p-4 border-b border-white/10 bg-black/30">
          {userName ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-cyan flex items-center justify-center flex-shrink-0">
                  <span className="text-ink text-xs font-bold">{userName[0].toUpperCase()}</span>
                </div>
                <span className="text-white text-sm font-medium truncate">{userName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs text-[#8b95a3] hover:text-[#ff8a80] transition-colors flex-shrink-0"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link href="/dang-nhap" className="text-cyan text-xs hover:underline">
              Đăng nhập để lưu tiến trình
            </Link>
          )}
        </div>

        {/* Course title */}
        <div className="p-4 border-b border-white/10">
          <Link href={`/khoa-hoc/${course.slug}`} className="text-cyan text-xs hover:underline mb-1 block">
            ← Trang khóa học
          </Link>
          <h2 className="text-white font-semibold text-sm line-clamp-2">{course.title}</h2>
          {isEnrolled && (
            <div className="mt-2">
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-cyan h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.round((localCompleted.length / Math.max(allLessons.length, 1)) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-[#8b95a3] mt-1">
                {localCompleted.length}/{allLessons.length} bài hoàn thành
              </p>
            </div>
          )}
        </div>

        {/* Module list */}
        <div className="py-2">
          {course.modules?.map((mod, mi) => (
            <div key={mi}>
              <div className="px-4 py-2.5 text-xs font-semibold text-[#8b95a3] uppercase tracking-wider">
                {mod.title}
              </div>
              {mod.lessons?.map((lesson, li) => {
                const globalIndex = allLessons.findIndex((l) => l.slug === lesson.slug);
                const state = getLessonState(lesson, globalIndex);
                const isActive = state === "active";
                const isAccessible = state === "active" || state === "completed" || state === "available";

                const icon = () => {
                  if (state === "completed") return (
                    <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  );
                  if (state === "active") return (
                    <svg className="w-4 h-4 text-cyan" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  );
                  if (isAccessible) return (
                    <svg className="w-4 h-4 text-[#8b95a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  );
                  return (
                    <svg className="w-4 h-4 text-[#5b636e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          <span className="text-xs text-cyan">Miễn phí</span>
                        )}
                        {state === "locked-sequential" && (
                          <span className="text-xs text-[#5b636e]">Hoàn thành bài trước</span>
                        )}
                        {lesson.duration && (
                          <span className="text-xs text-[#8b95a3]">{lesson.duration}</span>
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
                            ? "bg-cyan/10 text-cyan border-r-2 border-cyan"
                            : "text-[#c8ced6] hover:bg-white/5"
                        }`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex items-start gap-3 px-4 py-3 text-sm text-[#5b636e] cursor-not-allowed">
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
      <main className="flex-1 flex flex-col bg-white">
        {/* Video area */}
        <div
          className="bg-black w-full"
          onContextMenu={(e) => e.preventDefault()}
        >
          {!canAccessLesson ? (
            <div className="aspect-video w-full max-w-5xl mx-auto flex items-center justify-center bg-[#16181d]">
              <div className="text-center px-6">
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border-2 border-cyan text-cyan"><Icon name="lock" className="h-6 w-6" /></span>
                <p className="text-white font-semibold mb-2">Hoàn thành bài học trước để mở khóa</p>
                <p className="text-[#8b95a3] text-sm">
                  {prevLesson ? `Bài "${prevLesson.title}" cần được hoàn thành trước` : "Bài học này chưa mở khóa"}
                </p>
                {prevLesson && (
                  <Link
                    href={`/khoa-hoc/${course.slug}/hoc/${prevLesson.slug}`}
                    className="btn btn-accent btn-sm mt-5"
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
            <div className="aspect-video w-full max-w-5xl mx-auto flex items-center justify-center bg-[#16181d]">
              <div className="text-center">
                <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border-2 border-cyan text-cyan"><Icon name="live" className="h-6 w-6" /></span>
                <p className="text-[#c8ced6] text-sm">Video đang được chuẩn bị</p>
                <p className="text-[#8b95a3] text-xs mt-1">Sẽ có sớm!</p>
              </div>
            </div>
          )}
        </div>

        {/* Lesson info + navigation */}
        <div className="flex-1 bg-white max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
          <div className="mb-1 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-muted">{currentModule.title}</div>
          <h1 className="text-xl sm:text-[1.7rem] font-bold tracking-[-0.02em] text-ink mb-5">{currentLesson.title}</h1>

          {/* Mark complete button */}
          {isEnrolled && canAccessLesson && (
            <div className="mb-6">
              {isCurrentCompleted ? (
                <div className="flex items-center gap-2 text-cyan-deep text-sm font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bài học đã hoàn thành
                </div>
              ) : (
                <button
                  onClick={markComplete}
                  disabled={marking}
                  className="btn btn-accent btn-sm"
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
          <div className="flex items-center justify-between gap-4 py-4 border-t border-line">
            {prevLesson ? (
              <Link
                href={`/khoa-hoc/${course.slug}/hoc/${prevLesson.slug}`}
                className="flex items-center gap-2 text-sm text-body hover:text-cyan-deep transition-colors"
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
                  className="flex items-center gap-2 text-sm font-semibold text-ink hover:text-cyan-deep transition-colors"
                >
                  <span className="hidden sm:inline truncate max-w-[180px]">{nextLesson.title}</span>
                  <span className="sm:hidden">Tiếp theo</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="hidden sm:inline">Hoàn thành bài này để mở khóa</span>
                  <span className="sm:hidden">Hoàn thành trước</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-deep"><Icon name="check" className="h-5 w-5" strokeWidth={2.4} /> Bạn đã hoàn thành khóa học!</div>
            )}
          </div>

          {/* Upsell if not enrolled and not free preview */}
          {!isEnrolled && !currentLesson.free_preview && (
            <div className="on-dark mt-6 rounded-card bg-ink p-6 text-center">
              <p className="font-semibold text-white mb-1">Bài học này dành cho học viên đã đăng ký</p>
              <p className="text-sm mb-5">
                Đăng ký ngay để xem toàn bộ {allLessons.length} bài học
              </p>
              <Link
                href={`/khoa-hoc/${course.slug}/thanh-toan`}
                className="btn btn-accent btn-sm"
              >
                Đăng ký khóa học
              </Link>
            </div>
          )}
        </div>

        {/* Related courses */}
        {relatedCourses.length > 0 && (
          <div className="bg-soft border-t border-line">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
              <h2 className="text-lg font-bold text-ink mb-5">Khóa học tiếp theo</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedCourses.map((rc) => (
                  <Link
                    key={rc.slug}
                    href={`/khoa-hoc/${rc.slug}`}
                    className="card card-hover p-5 group"
                  >
                    <span className="chip">{rc.level}</span>
                    <h3 className="font-bold text-navy mt-3 mb-1 text-[0.95rem] group-hover:text-cyan-deep transition-colors leading-snug">
                      {rc.title}
                    </h3>
                    <p className="text-sm font-bold text-cyan-deep">
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
