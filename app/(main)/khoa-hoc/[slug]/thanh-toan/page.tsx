"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Icon from "@/components/ui/Icon";

interface OrderInfo {
  transfer_content: string;
  amount: number;
  course_title: string;
  qr_data_url?: string;
  bank_account_no: string;
  bank_account_name: string;
  bank_name: string;
}

export default function ThanhToanPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function copy(key: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
  }

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/dang-nhap?redirect=/khoa-hoc/${slug}/thanh-toan`);
        return;
      }

      // Check if already enrolled
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_slug", slug)
        .eq("status", "active")
        .single();

      if (enrollment) {
        router.push(`/khoa-hoc/${slug}/hoc/gioi-thieu`);
        return;
      }

      // Create or get order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_slug: slug }),
      });

      if (!res.ok) {
        setError("Không thể tạo đơn hàng. Vui lòng thử lại.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setOrder(data);
      setLoading(false);
    }

    init();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-soft">
        <p className="flex items-center gap-3 text-[0.95rem] text-muted">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-cyan-ink" aria-hidden="true" />
          Đang tải thông tin thanh toán...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-soft px-4">
        <div className="card max-w-md p-8 text-center">
          <p className="alert-error mb-5">{error}</p>
          <Link href={`/khoa-hoc/${slug}`} className="btn btn-outline btn-sm">
            <Icon name="chevron-left" className="h-4 w-4" strokeWidth={2} /> Quay lại khóa học
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const copyBtn = (key: string, text: string) => (
    <button
      onClick={() => copy(key, text)}
      className="inline-flex flex-none items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:border-cyan-2"
    >
      <Icon name={copied === key ? "check" : "copy"} className="h-3.5 w-3.5" strokeWidth={2} />
      {copied === key ? "Đã chép" : "Sao chép"}
    </button>
  );

  return (
    <div className="bg-soft">
      <div className="container-x max-w-[760px] py-12 sm:py-16">
        <Link href={`/khoa-hoc/${slug}`} className="mb-8 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink hover:text-cyan-deep">
          <Icon name="chevron-left" className="h-4 w-4" strokeWidth={2} /> Quay lại khóa học
        </Link>

        <header className="section-head sm">
          <p className="kicker">Checkout</p>
          <h1>Thanh <span className="accent">toán</span></h1>
          <p className="lead !text-[0.95rem]">Chuyển khoản theo thông tin bên dưới để đăng ký khóa học.</p>
        </header>

        {/* Course summary */}
        <div className="card mb-5 flex items-center justify-between gap-4 p-5 sm:p-6">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Khóa học</p>
            <p className="font-bold text-navy">{order.course_title}</p>
          </div>
          <div className="flex-none text-right">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Số tiền</p>
            <p className="text-[1.4rem] font-bold tracking-[-0.02em] text-cyan-ink">{order.amount.toLocaleString("vi-VN")}đ</p>
          </div>
        </div>

        {/* Payment info */}
        <div className="card mb-5 p-6 sm:p-7">
          <h2 className="mb-6 flex items-center gap-3 text-[1.1rem] font-bold">
            <span className="icon-tile !h-10 !w-10"><Icon name="bank" className="h-5 w-5" /></span>
            Thông tin chuyển khoản
          </h2>

          <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
            <dl className="space-y-4">
              <div>
                <dt className="mb-1 text-xs text-muted">Ngân hàng</dt>
                <dd className="font-semibold text-ink">{order.bank_name}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted">Số tài khoản</dt>
                <dd className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-lg font-bold text-ink">{order.bank_account_no}</span>
                  {copyBtn("account", order.bank_account_no)}
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted">Chủ tài khoản</dt>
                <dd className="font-semibold text-ink">{order.bank_account_name}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted">Số tiền</dt>
                <dd className="text-lg font-bold text-cyan-ink">{order.amount.toLocaleString("vi-VN")}đ</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted">Nội dung chuyển khoản</dt>
                <dd className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-lg border border-cyan/40 bg-cyan/10 px-3 py-1.5 font-mono font-bold text-ink">
                    {order.transfer_content}
                  </span>
                  {copyBtn("content", order.transfer_content)}
                </dd>
                <p className="mt-2 text-xs font-medium text-[#b42318]">Bắt buộc ghi đúng nội dung để hệ thống tự động xác nhận.</p>
              </div>
            </dl>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              {order.qr_data_url ? (
                <div>
                  <p className="mb-2 text-center text-xs text-muted">Quét mã QR để thanh toán</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.qr_data_url}
                    alt="QR chuyển khoản"
                    className="h-52 w-52 rounded-card-sm border border-line object-contain"
                  />
                </div>
              ) : (
                <div className="grid h-52 w-52 place-items-center rounded-card-sm bg-soft p-4 text-center">
                  <p className="text-xs text-muted">Nhập thông tin ngân hàng trong cài đặt Vercel để hiện QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 rounded-card bg-ink p-6 text-[#c8ced6]">
          <h3 className="mb-3 text-[0.95rem] font-bold text-white">Hướng dẫn</h3>
          <ol className="grid gap-2.5 text-[0.92rem]">
            {[
              "Chuyển khoản đúng số tiền và nội dung ở trên",
              "Hệ thống tự động xác nhận trong vòng 1-5 phút",
              "Bạn sẽ nhận được email xác nhận và có thể học ngay",
              "Nếu sau 15 phút chưa nhận được, liên hệ hỗ trợ",
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="grid h-6 w-6 flex-none place-items-center rounded-full border-2 border-cyan text-[0.72rem] font-bold text-cyan">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Confirm button */}
        {!confirmed ? (
          <button onClick={() => setConfirmed(true)} className="btn btn-dark btn-block py-4 text-base">
            Tôi đã chuyển khoản xong
          </button>
        ) : (
          <div className="card p-6 text-center">
            <span className="icon-tile mx-auto mb-3"><Icon name="check" className="h-6 w-6" strokeWidth={2.4} /></span>
            <p className="mb-1 font-bold text-ink">Cảm ơn bạn!</p>
            <p className="text-[0.92rem]">
              Chúng tôi đang xác nhận thanh toán. Thường mất 1-5 phút. Bạn sẽ nhận thông báo qua email.
            </p>
            <Link href="/tai-khoan" className="btn btn-outline btn-sm mt-5">
              Xem tài khoản <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
