"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Đang tải thông tin thanh toán...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href={`/khoa-hoc/${slug}`} className="text-orange-600 hover:underline text-sm">
            ← Quay lại khóa học
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Link href={`/khoa-hoc/${slug}`} className="text-orange-600 text-sm hover:underline mb-6 block">
          ← Quay lại khóa học
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Thanh toán</h1>
        <p className="text-slate-500 text-sm mb-8">
          Chuyển khoản theo thông tin bên dưới để đăng ký khóa học
        </p>

        {/* Course summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Khóa học</p>
              <p className="font-semibold text-slate-900">{order.course_title}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Số tiền</p>
              <p className="text-xl font-bold text-orange-600">
                {order.amount.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-5">Thông tin chuyển khoản</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Bank details */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Ngân hàng</p>
                <p className="font-semibold text-slate-900">{order.bank_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Số tài khoản</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-slate-900 text-lg">{order.bank_account_no}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(order.bank_account_no)}
                    className="text-xs text-orange-600 hover:underline"
                  >
                    Sao chép
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Chủ tài khoản</p>
                <p className="font-semibold text-slate-900">{order.bank_account_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Số tiền</p>
                <p className="font-bold text-orange-600 text-lg">{order.amount.toLocaleString("vi-VN")}đ</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Nội dung chuyển khoản</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-slate-900 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                    {order.transfer_content}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(order.transfer_content)}
                    className="text-xs text-orange-600 hover:underline flex-shrink-0"
                  >
                    Sao chép
                  </button>
                </div>
                <p className="text-xs text-red-500 mt-1">
                  ⚠ Bắt buộc ghi đúng nội dung để tự động xác nhận
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              {order.qr_data_url ? (
                <div>
                  <p className="text-xs text-slate-500 mb-2 text-center">Quét mã QR để thanh toán</p>
                  <img
                    src={order.qr_data_url}
                    alt="QR chuyển khoản"
                    className="w-48 h-48 object-contain border border-slate-200 rounded-xl"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center text-center p-4">
                  <p className="text-xs text-slate-500">Nhập thông tin ngân hàng trong cài đặt Vercel để hiện QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm">Hướng dẫn</h3>
          <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
            <li>Chuyển khoản đúng số tiền và nội dung ở trên</li>
            <li>Hệ thống tự động xác nhận trong vòng 1-5 phút</li>
            <li>Bạn sẽ nhận được email xác nhận và có thể học ngay</li>
            <li>Nếu sau 15 phút chưa nhận được, liên hệ hỗ trợ</li>
          </ol>
        </div>

        {/* Confirm button */}
        {!confirmed ? (
          <button
            onClick={() => setConfirmed(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            Tôi đã chuyển khoản xong
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="font-semibold text-green-800 mb-1">Cảm ơn bạn!</p>
            <p className="text-sm text-green-700">
              Chúng tôi đang xác nhận thanh toán. Thường mất 1-5 phút. Bạn sẽ nhận thông báo qua email.
            </p>
            <Link
              href="/tai-khoan"
              className="inline-block mt-4 text-sm text-green-700 font-medium hover:underline"
            >
              Xem tài khoản →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
