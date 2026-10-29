"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/ui/AuthShell";
import Icon from "@/components/ui/Icon";

export default function DangKyPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Email này đã được đăng ký. Hãy đăng nhập."
          : error.message
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <AuthShell kicker="Almost there" title="Kiểm tra email">
        <div className="text-center">
          <span className="icon-tile mx-auto mb-4"><Icon name="mail" className="h-6 w-6" /></span>
          <p className="mb-6 text-[0.95rem]">
            Chúng tôi đã gửi link xác nhận tới <strong>{email}</strong>. Nhấp vào link để kích hoạt tài khoản.
          </p>
          <Link href="/dang-nhap" className="btn btn-outline btn-sm">
            Quay lại đăng nhập <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      kicker="Join free"
      title="Đăng ký tài khoản"
      subtitle="Miễn phí — học thử bài đầu tiên và nhận tài nguyên độc quyền."
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="font-semibold text-cyan-deep hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="field">
              <label htmlFor="signup-full-name">Họ và tên</label>
              <input
          id="signup-full-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="field">
              <label htmlFor="signup-email">Email</label>
              <input
          id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="ban@email.com"
              />
            </div>

            <div className="field">
              <label htmlFor="signup-password">Mật khẩu</label>
              <input
          id="signup-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            {error && (
              <div className="alert-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-dark btn-block"
            >
              {loading ? "Đang tạo tài khoản..." : "Đăng ký miễn phí"}
            </button>
          </form>
    </AuthShell>
  );
}
