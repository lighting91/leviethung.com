import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug, getLessonBySlug } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import LessonViewer from "@/components/LessonViewer";

interface Props {
  params: Promise<{ slug: string; lesson: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lesson: lessonSlug } = await params;
  const result = getLessonBySlug(slug, lessonSlug);
  if (!result) return {};
  return { title: `${result.lesson.title} — ${getCourseBySlug(slug)?.title ?? ""}` };
}

export default async function LessonPage({ params }: Props) {
  const { slug, lesson: lessonSlug } = await params;

  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const result = getLessonBySlug(slug, lessonSlug);
  if (!result) notFound();

  const { lesson, module: currentModule } = result;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isEnrolled = false;
  let completedLessons: string[] = [];
  let userName: string | null = null;

  if (user) {
    // Check enrollment
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", slug)
      .eq("status", "active")
      .single();
    isEnrolled = !!enrollment;

    if (isEnrolled) {
      // Get completed lessons
      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("lesson_slug")
        .eq("user_id", user.id)
        .eq("course_slug", slug);
      completedLessons = progress?.map((p) => p.lesson_slug) ?? [];
    }

    // Get user name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    userName = profile?.full_name ?? user.email?.split("@")[0] ?? null;
  }

  // Sequential access check
  const allLessons = course.modules?.flatMap((m) => m.lessons ?? []) ?? [];
  const lessonIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const previousLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;

  const isFreePreview = lesson.free_preview ?? false;
  const previousCompleted = !previousLesson || completedLessons.includes(previousLesson.slug);
  const sequentialAccess = isEnrolled && previousCompleted;
  const canAccessLesson = isFreePreview || sequentialAccess;

  // Related courses
  const allCourses = getAllCourses();
  const relatedCourses = allCourses.filter((c) => c.slug !== slug).slice(0, 3);

  return (
    <LessonViewer
      course={course}
      currentLesson={lesson}
      currentModule={currentModule}
      isEnrolled={isEnrolled || isFreePreview}
      canAccessLesson={canAccessLesson}
      userName={userName}
      completedLessons={completedLessons}
      relatedCourses={relatedCourses}
    />
  );
}
