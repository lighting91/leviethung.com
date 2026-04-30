import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-slate-900">Lê Việt Hùng</p>
            <p className="text-sm text-slate-500 mt-1">TikTok Marketing & Digital Content Creator</p>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://tiktok.com/@leviethung"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
              </svg>
            </a>

            <a
              href="https://facebook.com/leviethung"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <a
              href="https://youtube.com/@leviethung"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {year} Lê Việt Hùng. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/blog" className="hover:text-slate-600 transition-colors">Blog</Link>
            <Link href="/tai-nguyen" className="hover:text-slate-600 transition-colors">Tài nguyên</Link>
            <Link href="/khoa-hoc" className="hover:text-slate-600 transition-colors">Khóa học</Link>
            <Link href="/ve-toi" className="hover:text-slate-600 transition-colors">Về tôi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
