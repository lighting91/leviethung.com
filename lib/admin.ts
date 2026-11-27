import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Server-side gate for /quan-tri: only profiles flagged is_admin get through, everyone else sees a 404.
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) notFound();

  return { supabase, user };
}

export interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  lessons_done: number;
}

export interface AdminEnrollment {
  id: string;
  user_id: string;
  course_slug: string;
  status: "active" | "revoked";
  enrolled_at: string;
}

export interface AdminOrder {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  course_slug: string;
  amount: number;
  transfer_content: string;
  status: "pending" | "paid" | "refunded";
  created_at: string;
  paid_at: string | null;
}
