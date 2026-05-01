"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/tai-nguyen", label: "Tài nguyên" },
  { href: "/khoa-hoc", label: "Khóa học" },
  { href: "/ve-toi", label: "Về tôi" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser(u: User | null) {
      setUser(u);
      if (!u) { setUserName(""); return; }
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", u.id)
        .single();
      const name = data?.full_name || u.email?.split("@")[0] || "Tài khoản";
      setUserName(name);
    }

    supabase.auth.getUser().then(({ data }) => loadUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      loadUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserName("");
    setUserMenuOpen(false);
    window.location.href = "/";
  }

  const avatarLetter = userName ? userName[0].toUpperCase() : "?";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg text-slate-900 tracking-tight">
          Lê Viết Hưng
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 hover:text-orange-600 transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors max-w-[200px]"
              >
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {avatarLetter}
                </div>
                <span className="truncate">{userName}</span>
                <svg className="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                  {/* User info header */}
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/tai-khoan"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Khóa học của tôi
                  </Link>

                  <Link
                    href="/tai-khoan/cap-nhat"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Cài đặt tài khoản
                  </Link>

                  <hr className="my-1 border-slate-100" />

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Đăng nhập
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-700 font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <hr className="my-1 border-slate-100" />

          {user ? (
            <>
              <div className="flex items-center gap-2.5 py-2">
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {avatarLetter}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <Link
                href="/tai-khoan"
                className="text-sm text-slate-700 font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                📚 Khóa học của tôi
              </Link>
              <Link
                href="/tai-khoan/cap-nhat"
                className="text-sm text-slate-700 font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                ⚙️ Cài đặt tài khoản
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-red-500 font-medium py-2 text-left"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href="/dang-nhap"
              className="text-sm text-orange-600 font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              Đăng nhập
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
