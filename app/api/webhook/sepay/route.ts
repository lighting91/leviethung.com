import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function logToGoogleSheet(data: Record<string, unknown>) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch { /* non-critical */ }
}

// Forward tới WS305 nếu payment không phải của leviethung.com courses
async function forwardToWS305(body: Record<string, unknown>) {
  const ws305Url = process.env.WS305_WEBHOOK_URL;
  if (!ws305Url) return;
  try {
    await fetch(ws305Url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward secret key của WS305
        "X-Secret-Key": process.env.WS305_SECRET_KEY ?? "",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error("WS305 forward error:", e);
  }
}

// Kiểm tra transfer content có thuộc về leviethung.com courses không
function isLVHPayment(content: string): boolean {
  return /^LVH[A-Z0-9]+$/i.test(content.trim());
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Verify SePay secret (dùng chung secret key)
  const secret = request.headers.get("x-sepay-secret")
    ?? request.headers.get("x-secret-key")
    ?? request.headers.get("authorization");
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

  // Lấy nội dung chuyển khoản — SePay gửi nhiều field khác nhau tuỳ version
  const transferContent = (
    body.content ??
    body.addInfo ??
    body["transfer_content"] ??
    body.description ??
    ""
  ) as string;

  const transferAmount = (body.transferAmount ?? body.amount ?? 0) as number;
  const transferType = (body.transferType ?? "in") as string;

  // Chỉ xử lý incoming transfer
  if (transferType !== "in") {
    return Response.json({ ok: true, message: "Skipped outgoing" });
  }

  // ── Phân luồng ──────────────────────────────────────────────────────────────

  if (!isLVHPayment(transferContent)) {
    // Không phải payment của leviethung.com → forward sang WS305
    await forwardToWS305(body);
    return Response.json({ ok: true, message: "Forwarded to WS305" });
  }

  // ── Xử lý payment của leviethung.com courses ────────────────────────────────

  const supabase = await createClient();

  // Tìm order khớp với transfer content
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("transfer_content", transferContent.trim())
    .eq("status", "pending")
    .maybeSingle();

  if (!order) {
    return Response.json({ ok: true, message: "Order not found or already processed" });
  }

  // Kiểm tra số tiền (cho phép sai lệch 1% do phí ngân hàng)
  if (transferAmount < order.amount * 0.99) {
    console.error(`Amount mismatch: expected ${order.amount}, got ${transferAmount}`);
    return Response.json({ error: "Amount mismatch" }, { status: 400 });
  }

  // Cập nhật order → paid
  await supabase
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", order.id);

  // Tạo enrollment
  await supabase.from("enrollments").upsert(
    {
      user_id: order.user_id,
      course_slug: order.course_slug,
      status: "active",
      enrolled_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_slug" }
  );

  // Log sang Google Sheet
  await logToGoogleSheet({
    timestamp: new Date().toISOString(),
    name: order.user_name ?? "",
    email: order.user_email ?? "",
    course: order.course_slug,
    amount: order.amount,
    transfer_content: order.transfer_content,
    order_id: order.id,
    source: "leviethung.com",
  });

  return Response.json({ ok: true, message: "Enrollment created" });
}
