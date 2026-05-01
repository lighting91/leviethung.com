import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function logToGoogleSheet(data: Record<string, unknown>) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // non-critical
  }
}

export async function POST(request: NextRequest) {
  // Verify SePay secret
  const secret = request.headers.get("x-sepay-secret") ?? request.headers.get("authorization");
  const expectedSecret = process.env.SEPAY_SECRET;
  if (expectedSecret && secret !== expectedSecret && secret !== `Bearer ${expectedSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // SePay webhook body fields
  const transferContent = (body.content ?? body.addInfo ?? "") as string;
  const transferAmount = (body.transferAmount ?? body.amount ?? 0) as number;
  const transferType = (body.transferType ?? "in") as string;

  // Only process incoming transfers
  if (transferType !== "in") {
    return Response.json({ ok: true, message: "Skipped outgoing" });
  }

  if (!transferContent) {
    return Response.json({ error: "No transfer content" }, { status: 400 });
  }

  const supabase = await createClient();

  // Find matching pending order
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("transfer_content", transferContent.trim())
    .eq("status", "pending")
    .maybeSingle();

  if (!order) {
    return Response.json({ ok: true, message: "Order not found or already processed" });
  }

  // Verify amount (allow small difference for bank fees)
  if (transferAmount < order.amount * 0.99) {
    console.error(`Amount mismatch: expected ${order.amount}, got ${transferAmount}`);
    return Response.json({ error: "Amount mismatch" }, { status: 400 });
  }

  // Update order to paid
  await supabase
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", order.id);

  // Create enrollment
  await supabase.from("enrollments").upsert(
    {
      user_id: order.user_id,
      course_slug: order.course_slug,
      status: "active",
      enrolled_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_slug" }
  );

  // Log to Google Sheet
  await logToGoogleSheet({
    timestamp: new Date().toISOString(),
    name: order.user_name ?? "",
    email: order.user_email ?? "",
    course: order.course_slug,
    amount: order.amount,
    transfer_content: order.transfer_content,
    order_id: order.id,
  });

  return Response.json({ ok: true, message: "Enrollment created" });
}
