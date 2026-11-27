"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { getCourseBySlug } from "@/lib/content";

export async function grantCourse(formData: FormData) {
  const { supabase } = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const courseSlug = String(formData.get("course_slug") ?? "");
  if (!userId || !getCourseBySlug(courseSlug)) return;

  await supabase.from("enrollments").upsert(
    { user_id: userId, course_slug: courseSlug, status: "active", enrolled_at: new Date().toISOString() },
    { onConflict: "user_id,course_slug" }
  );
  revalidatePath("/quan-tri");
}

export async function revokeCourse(formData: FormData) {
  const { supabase } = await requireAdmin();
  const enrollmentId = String(formData.get("enrollment_id") ?? "");
  if (!enrollmentId) return;

  await supabase.from("enrollments").update({ status: "revoked" }).eq("id", enrollmentId);
  revalidatePath("/quan-tri");
}

// Same effect as a matched SePay webhook: mark the order paid and open the course.
export async function markOrderPaid(formData: FormData) {
  const { supabase } = await requireAdmin();
  const orderId = String(formData.get("order_id") ?? "");
  if (!orderId) return;

  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id, course_slug, status")
    .eq("id", orderId)
    .single();
  if (!order || order.status !== "pending") return;

  await supabase.from("orders").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", order.id);
  await supabase.from("enrollments").upsert(
    { user_id: order.user_id, course_slug: order.course_slug, status: "active", enrolled_at: new Date().toISOString() },
    { onConflict: "user_id,course_slug" }
  );
  revalidatePath("/quan-tri");
}
