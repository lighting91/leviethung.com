"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Icon from "@/components/ui/Icon";

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
      <div className="grid min-h-[60vh] place-items-center bg-soft">
        <p className="flex items-center gap-3 text-[0.95rem] text-muted">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-cyan-ink" aria-hidden="true" />
          Đang tải...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-soft">
    <div className="container-x max-w-[720px] pb-24 pt-12 sm:pt-16">
      <Link href="/tai-khoan" className="mb-8 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink hover:text-cyan-deep">
        <Icon name="chevron-left" className="h-4 w-4" strokeWidth={2} /> Về trang tài khoản
      </Link>

      <header className="section-head sm">
        <p className="kicker">Settings</p>
        <h1>Cập nhật <span className="accent">tài khoản</span></h1>
      </header>

      {/* Account info */}
      <div className="card mb-5 flex items-center gap-3 px-5 py-4 text-[0.92rem]">
        <Icon name="mail" className="h-5 w-5 flex-none text-cyan-ink" />
        <span>Email đăng nhập: <strong>{userEmail}</strong></span>
      </div>

      {/* Profile form */}
      <div className="card mb-5 p-6 sm:p-7">
        <h2 className="mb-5 text-[1.1rem] font-bold">Thông tin cá nhân</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="field">
            <label htmlFor="acc-name">Họ và tên</label>
            <input
              id="acc-name"
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              placeholder="Nguyễn Văn A"
              className="input"
            />
          </div>
          <div className="field">
            <label htmlFor="acc-phone">Số điện thoại</label>
            <input
              id="acc-phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              placeholder="0912 345 678"
              className="input"
            />
          </div>

          {profileMsg && (
            <div className={profileMsg.type === "success" ? "alert-success" : "alert-error"} role="status">
              {profileMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={profileLoading}
            className="btn btn-dark btn-sm"
          >
            {profileLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>

      {/* Password form */}
      <div className="card p-6 sm:p-7">
        <h2 className="mb-1 text-[1.1rem] font-bold">Đổi mật khẩu</h2>
        <p className="mb-5 text-[0.92rem] text-muted">Mật khẩu mới sẽ được áp dụng ngay lập tức</p>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="field">
            <label htmlFor="acc-new-password">Mật khẩu mới</label>
            <input
              id="acc-new-password"
              type="password"
              value={passwords.newPw}
              onChange={(e) => setPasswords((p) => ({ ...p, newPw: e.target.value }))}
              placeholder="Tối thiểu 6 ký tự"
              className="input"
            />
          </div>
          <div className="field">
            <label htmlFor="acc-confirm-password">Xác nhận mật khẩu mới</label>
            <input
              id="acc-confirm-password"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="Nhập lại mật khẩu mới"
              className="input"
            />
          </div>

          {pwMsg && (
            <div className={pwMsg.type === "success" ? "alert-success" : "alert-error"} role="status">
              {pwMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={pwLoading}
            className="btn btn-outline btn-sm"
          >
            {pwLoading ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
