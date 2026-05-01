import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCourseBySlug } from "@/lib/content";

async function fetchVietQR(accountNo: string, accountName: string, acqId: string, amount: number, content: string) {
  try {
    const res = await fetch("https://api.vietqr.io/v2/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-client-id": "leviethung", "x-api-key": "da6de560-d11b-442c-9c10-bd7e1d6bfb9a" },
      body: JSON.stringify({
        accountNo,
        accountName,
        acqId,
        amount,
        addInfo: content,
        format: "text",
        template: "compact2",
      }),
    });
    const data = await res.json();
    return data?.data?.qrDataURL ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { course_slug } = await request.json();

  const course = getCourseBySlug(course_slug);
  if (!course || !course.price) {
    return Response.json({ error: "Khóa học không tìm thấy" }, { status: 404 });
  }

  // Check existing pending order
  const { data: existing } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_slug", course_slug)
    .eq("status", "pending")
    .maybeSingle();

  let transfer_content: string;

  if (existing) {
    transfer_content = existing.transfer_content;
  } else {
    // Generate unique transfer content
    const slugPart = course_slug.replace(/-/g, "").toUpperCase().slice(0, 8);
    const timePart = Date.now().toString(36).toUpperCase().slice(-6);
    transfer_content = `LVH${slugPart}${timePart}`;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    await supabase.from("orders").insert({
      user_id: user.id,
      user_email: user.email,
      user_name: profile?.full_name ?? null,
      course_slug,
      amount: course.price,
      transfer_content,
    });
  }

  // Fetch QR code if bank env vars are set
  const bankAccountNo = process.env.BANK_ACCOUNT_NO ?? "";
  const bankAccountName = process.env.BANK_ACCOUNT_NAME ?? "";
  const bankAcqId = process.env.BANK_ACQ_ID ?? "";
  const bankName = process.env.BANK_NAME ?? "Ngân hàng";

  let qr_data_url: string | null = null;
  if (bankAccountNo && bankAccountName && bankAcqId) {
    qr_data_url = await fetchVietQR(bankAccountNo, bankAccountName, bankAcqId, course.price, transfer_content);
  }

  return Response.json({
    transfer_content,
    amount: course.price,
    course_title: course.title,
    qr_data_url,
    bank_account_no: bankAccountNo,
    bank_account_name: bankAccountName,
    bank_name: bankName,
  });
}
