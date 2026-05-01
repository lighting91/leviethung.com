import Link from "next/link";
import type { Course } from "@/lib/content";

interface Props {
  course: Course;
}

export default function SalesHero({ course }: Props) {
  const ctaHref = `#dang-ky`;

  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          Khóa học {course.level}
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">
          {course.hero_headline ?? course.title}
        </h1>

        {course.hero_subheadline && (
          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {course.hero_subheadline}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-slate-400">
          {course.duration && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration}
            </span>
          )}
          {course.modules && course.modules.length > 0 && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {course.modules.length} module • {course.modules.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0)} bài học
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Học trọn đời
          </span>
        </div>

        <Link
          href={ctaHref}
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors shadow-lg shadow-orange-900/30"
        >
          {course.cta_text ?? "ĐĂNG KÝ NGAY"}
        </Link>
      </div>
    </section>
  );
}
