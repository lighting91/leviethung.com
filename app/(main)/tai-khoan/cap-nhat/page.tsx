"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type MsgState = { type: "success" | "error"; text: string } | null;

export default function CapNhatPage() {
  const router = useRouter();

  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<MsgState>(null);

  const [passwords, setPasswords] = useState({ newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<MsgState>(null);

  const [userEmail, setUserEmail] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/dang-nhap"); return; }

      setUserEmail(user.email ?? "");

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name ?? "",
          phone: data.phone ?? "",
        });
      }
      setPageLoading(false);
    }
    load();
  }, [router]);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name,
      phone: profile.phone,
    });

    setProfileMsg(
      error
        ? { type: "error", text: error.message }
        : { type: "success", text: "Đã cập nhật thông tin thành công!" }
    );
    setProfileLoading(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);

    if (passwords.newPw.length < 6) {
      setPwMsg({ type: "error", text: "Mật khẩu tối thiểu 6 ký tự" });
      return;
    }
    if (passwords.newPw !== passwords.confirm) {
      setPwMsg({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return;
    }

    setPwLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: passwords.newPw });

    if (error) {
      setPwMsg({ type: "error", text: error.message });
    } else {
      setPwMsg({ type: "success", text: "Đã đổi mật khẩu thành công!" });
      setPasswords({ newPw: "", confirm: "" });
    }
    setPwLoading(false);
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/tai-khoan" className="text-orange-600 text-sm hover:underline mb-6 block">
        ← Về trang tài khoản
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-8">Cập nhật tài khoản</h1>

      {/* Account info */}
      <div className="bg-slate-50 rounded-xl px-5 py-3 mb-6 text-sm text-slate-600">
        Email đăng nhập: <span className="font-medium text-slate-900">{userEmail}</span>
      </div>

      {/* Profile form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-5">Thông tin cá nhân</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ và tên</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              placeholder="Nguyễn Văn A"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Số điện thoại</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              placeholder="0912 345 678"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {profileMsg && (
            <div
              className={`text-sm px-4 py-3 rounded-lg border ${
                profileMsg.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {profileMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={profileLoading}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            {profileLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>

      {/* Password form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-1">Đổi mật khẩu</h2>
        <p className="text-sm text-slate-500 mb-5">Mật khẩu mới sẽ được áp dụng ngay lập tức</p>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu mới</label>
            <input
              type="password"
              value={passwords.newPw}
              onChange={(e) => setPasswords((p) => ({ ...p, newPw: e.target.value }))}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {pwMsg && (
            <div
              className={`text-sm px-4 py-3 rounded-lg border ${
                pwMsg.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {pwMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={pwLoading}
            className="bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            {pwLoading ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}
