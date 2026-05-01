import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { courseSlug, lessonSlug } = await request.json();
  if (!courseSlug || !lessonSlug) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify user is enrolled
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .eq("status", "active")
    .single();

  if (!enrollment) {
    return Response.json({ error: "Not enrolled" }, { status: 403 });
  }

  await supabase.from("lesson_progress").upsert(
    { user_id: user.id, course_slug: courseSlug, lesson_slug: lessonSlug },
    { onConflict: "user_id,course_slug,lesson_slug" }
  );

  return Response.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("courseSlug");
  if (!courseSlug) return Response.json({ error: "Missing courseSlug" }, { status: 400 });

  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_slug")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug);

  return Response.json({ completed: data?.map((r) => r.lesson_slug) ?? [] });
}
