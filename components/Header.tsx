"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { site } from "@/lib/site";

const navLinks = [
  { href: "/ve-toi", label: "Về tôi" },
  { href: "/khoa-hoc", label: "Khóa học" },
  { href: "/tai-nguyen", label: "Tài nguyên" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Nav shadow once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside; close menus on Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserName("");
    setUserMenuOpen(false);
    window.location.href = "/";
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const avatarLetter = userName ? userName[0].toUpperCase() : "?";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] h-[var(--nav-h)] border-b bg-white/[.92] backdrop-blur-[14px] backdrop-saturate-[1.4] transition-[border-color,box-shadow] duration-200 ${
        scrolled || mobileOpen ? "border-line shadow-[0_6px_24px_-18px_rgba(14,15,18,.35)]" : "border-transparent"
      }`}
    >
      <div className="container-x flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label="Lê Viết Hưng — trang chủ" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-[30px] lg:flex" aria-label="Điều hướng chính">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`group relative text-[0.95rem] font-medium transition-colors hover:text-ink ${
                isActive(link.href) ? "text-ink" : "text-body"
              }`}
            >
              {link.label}
              <span
                className={`absolute inset-x-0 -bottom-1.5 h-0.5 rounded-sm bg-cyan transition-transform duration-200 group-hover:scale-x-100 ${
                  isActive(link.href) ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          ))}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                className="flex max-w-[200px] items-center gap-2 text-[0.95rem] font-medium text-body transition-colors hover:text-ink"
              >
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-ink text-xs font-bold text-cyan">
                  {avatarLetter}
                </span>
                <span className="truncate">{userName}</span>
                <Icon name="chevron-down" className="h-4 w-4 flex-none text-muted" strokeWidth={2} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-56 rounded-card-sm border border-line bg-white py-1.5 shadow-card" role="menu">
                  <div className="border-b border-line px-4 py-2.5">
                    <p className="truncate text-sm font-semibold text-ink">{userName}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                  <Link
                    href="/tai-khoan"
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body transition-colors hover:bg-soft hover:text-ink"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Icon name="book" className="h-4 w-4 text-cyan-ink" />
                    Khóa học của tôi
                  </Link>
                  <Link
                    href="/tai-khoan/cap-nhat"
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body transition-colors hover:bg-soft hover:text-ink"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Icon name="settings" className="h-4 w-4 text-cyan-ink" />
                    Cài đặt tài khoản
                  </Link>
                  <hr className="my-1 border-line" />
                  <button
                    onClick={handleSignOut}
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[#b42318] transition-colors hover:bg-[#fdecec]"
                  >
                    <Icon name="logout" className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              className={`text-[0.95rem] font-medium transition-colors hover:text-ink ${isActive("/dang-nhap") ? "text-ink" : "text-body"}`}
            >
              Đăng nhập
            </Link>
          )}

          <a href={site.zalo.url} target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm">
            <Icon name="chat" className="h-[18px] w-[18px]" strokeWidth={2} />
            Chat Zalo
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="grid h-11 w-11 place-items-center text-ink lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <Icon name={mobileOpen ? "close" : "menu"} className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>

      {/* Mobile nav */}
      <nav
        id="mobile-nav"
        aria-label="Điều hướng di động"
        className={`fixed inset-x-0 top-[var(--nav-h)] max-h-[calc(100dvh-var(--nav-h))] overflow-y-auto border-b border-line bg-white px-6 pb-6 pt-2 shadow-[0_24px_40px_-24px_rgba(14,15,18,.35)] transition-[opacity,transform,visibility] duration-200 lg:hidden ${
          mobileOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(link.href) ? "page" : undefined}
            className={`block border-b border-line py-3.5 text-base font-medium ${isActive(link.href) ? "text-cyan-deep" : "text-ink"}`}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        {user ? (
          <>
            <div className="flex items-center gap-2.5 border-b border-line py-3.5">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-ink text-xs font-bold text-cyan">
                {avatarLetter}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">{userName}</span>
                <span className="block truncate text-xs text-muted">{user.email}</span>
              </span>
            </div>
            <Link href="/tai-khoan" className="flex items-center gap-2.5 border-b border-line py-3.5 text-base font-medium text-ink" onClick={() => setMobileOpen(false)}>
              <Icon name="book" className="h-5 w-5 text-cyan-ink" /> Khóa học của tôi
            </Link>
            <Link href="/tai-khoan/cap-nhat" className="flex items-center gap-2.5 border-b border-line py-3.5 text-base font-medium text-ink" onClick={() => setMobileOpen(false)}>
              <Icon name="settings" className="h-5 w-5 text-cyan-ink" /> Cài đặt tài khoản
            </Link>
            <button onClick={handleSignOut} className="flex w-full items-center gap-2.5 border-b border-line py-3.5 text-left text-base font-medium text-[#b42318]">
              <Icon name="logout" className="h-5 w-5" /> Đăng xuất
            </button>
          </>
        ) : (
          <Link href="/dang-nhap" className="block border-b border-line py-3.5 text-base font-medium text-ink" onClick={() => setMobileOpen(false)}>
            Đăng nhập
          </Link>
        )}

        <a href={site.zalo.url} target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-block mt-4">
          <Icon name="chat" className="h-[18px] w-[18px]" strokeWidth={2} />
          Chat Zalo tư vấn
        </a>
      </nav>
    </header>
  );
}
