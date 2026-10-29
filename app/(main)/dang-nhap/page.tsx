"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/ui/AuthShell";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/tai-khoan";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email hoặc mật khẩu không đúng.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="ban@email.com"
        />
      </div>

      <div className="field">
        <label htmlFor="login-password">Mật khẩu</label>
        <input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="••••••••"
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
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}

export default function DangNhapPage() {
  return (
    <AuthShell
      kicker="Welcome back"
      title="Đăng nhập"
      subtitle="Đăng nhập để xem khóa học của bạn."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="font-semibold text-cyan-deep hover:underline">
            Đăng ký miễn phí
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-40 animate-pulse rounded-card-sm bg-soft" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
