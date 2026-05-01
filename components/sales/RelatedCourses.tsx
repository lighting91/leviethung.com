import Link from "next/link";
import type { Course } from "@/lib/content";

interface Props {
  courses: Course[];
}

const levelColors: Record<string, string> = {
  "Cơ bản": "bg-green-50 text-green-700",
  "Trung cấp": "bg-yellow-50 text-yellow-700",
  "Nâng cao": "bg-red-50 text-red-700",
};

export default function RelatedCourses({ courses }: Props) {
  if (courses.length === 0) return null;

  return (
    <section className="py-14 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Khóa học tiếp theo</h2>
        <p className="text-slate-500 text-center mb-8">Tiếp tục hành trình học TikTok Marketing của bạn</p>

        <div className="grid gap-5 sm:grid-cols-2">
          {courses.map((course) => (
            <div key={course.slug} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-orange-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[course.level] ?? "bg-slate-100 text-slate-600"}`}>
                  {course.level}
                </span>
                {course.duration && <span className="text-xs text-slate-400">• {course.duration}</span>}
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{course.description}</p>
              <Link
                href={`/khoa-hoc/${course.slug}`}
                className="text-sm text-orange-600 font-medium hover:underline"
              >
                Xem chi tiết →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
