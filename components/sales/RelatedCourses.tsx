import Link from "next/link";
import type { Course } from "@/lib/content";

interface Props {
  courses: Course[];
}

const levelColors: Record<string, string> = {
  "Cơ bản": "bg-cyan/10 text-navy",
  "Trung cấp": "bg-soft text-navy",
  "Nâng cao": "bg-red-50 text-red-700",
};

export default function RelatedCourses({ courses }: Props) {
  if (courses.length === 0) return null;

  return (
    <section className="py-14 px-4 sm:px-6 bg-soft">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-ink text-center mb-2">Khóa học tiếp theo</h2>
        <p className="text-muted text-center mb-8">Tiếp tục hành trình học TikTok Marketing của bạn</p>

        <div className="grid gap-5 sm:grid-cols-2">
          {courses.map((course) => (
            <div key={course.slug} className="bg-white rounded-xl border border-line p-6 hover:border-cyan-2 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[course.level] ?? "bg-soft text-body"}`}>
                  {course.level}
                </span>
                {course.duration && <span className="text-xs text-muted">• {course.duration}</span>}
              </div>
              <h3 className="font-semibold text-ink text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-muted mb-4">{course.description}</p>
              <Link
                href={`/khoa-hoc/${course.slug}`}
                className="text-sm text-cyan-deep font-medium hover:underline"
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
