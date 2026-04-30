import type { Metadata } from "next";
import Link from "next/link";
import { getAllCourses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Khóa học",
  description: "Chương trình học TikTok Marketing từ cơ bản đến nâng cao.",
};

const levelColors: Record<string, string> = {
  "Cơ bản": "bg-green-50 text-green-700",
  "Trung cấp": "bg-yellow-50 text-yellow-700",
  "Nâng cao": "bg-red-50 text-red-700",
};

export default function KhoaHocPage() {
  const courses = getAllCourses();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Khóa học</h1>
        <p className="text-slate-500">
          Chương trình học bài bản về TikTok Marketing, từ cơ bản đến nâng cao.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Đang xây dựng</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Các khóa học đang được chuẩn bị. Hãy theo dõi trang này để cập nhật sớm nhất!
          </p>
          <Link
            href="/ve-toi"
            className="inline-block mt-6 text-sm text-indigo-600 font-medium hover:underline"
          >
            Liên hệ để biết thêm →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {courses.map((course) => (
            <div key={course.slug} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[course.level] ?? "bg-slate-100 text-slate-600"}`}>
                  {course.level}
                </span>
                {course.duration && (
                  <span className="text-xs text-slate-400">• {course.duration}</span>
                )}
              </div>
              <h2 className="font-semibold text-slate-900 text-lg mb-2">{course.title}</h2>
              <p className="text-sm text-slate-500 mb-5">{course.description}</p>
              <Link
                href={`/khoa-hoc/${course.slug}`}
                className="text-sm text-indigo-600 font-medium hover:underline"
              >
                Xem chi tiết →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
