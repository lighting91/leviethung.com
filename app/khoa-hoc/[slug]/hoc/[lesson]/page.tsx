import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBySlug, getLessonBySlug } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import LessonViewer from "@/components/LessonViewer";

interface Props {
  params: Promise<{ slug: string; lesson: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lesson: lessonSlug } = await params;
  const result = getLessonBySlug(slug, lessonSlug);
  if (!result) return {};
  return { title: result.lesson.title };
}

export default async function LessonPage({ params }: Props) {
  const { slug, lesson: lessonSlug } = await params;

  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const result = getLessonBySlug(slug, lessonSlug);
  if (!result) notFound();

  const { lesson, module: currentModule } = result;

  // Check enrollment
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isEnrolled = false;
  if (user) {
    const { data } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", slug)
      .eq("status", "active")
      .single();
    isEnrolled = !!data;
  }

  // Free preview lessons are accessible to all
  const canAccess = isEnrolled || (lesson.free_preview ?? false);

  return (
    <LessonViewer
      course={course}
      currentLesson={lesson}
      currentModule={currentModule}
      isEnrolled={canAccess}
    />
  );
}
