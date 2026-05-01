import Link from "next/link";
import type { Course } from "@/lib/content";

interface Props {
  courses: Course[];
}

const levelOrder = ["Cơ bản", "Trung cấp", "Nâng cao"];

const levelMeta: Record<string, { color: string; icon: string }> = {
  "Cơ bản": { color: "bg-green-500", icon: "🌱" },
  "Trung cấp": { color: "bg-yellow-500", icon: "🚀" },
  "Nâng cao": { color: "bg-red-500", icon: "🏆" },
};

export default function LearningPath({ courses }: Props) {
  const sorted = [...courses].sort(
    (a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level)
  );

  if (sorted.length < 2) return null;

  return (
    <section className="py-14 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Lộ trình học</h2>
        <p className="text-slate-500 text-center mb-10">Từ người mới đến chuyên gia TikTok Marketing</p>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-8 left-[calc(50%-1px)] w-px bg-slate-200 h-full -translate-x-1/2 sm:top-8 sm:left-0 sm:right-0 sm:w-full sm:h-px sm:translate-x-0 sm:translate-y-8" />

          <div className="grid gap-6 sm:grid-cols-3 relative">
            {sorted.map((course, i) => {
              const meta = levelMeta[course.level] ?? { color: "bg-slate-500", icon: "📚" };
              return (
                <div key={course.slug} className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full ${meta.color} text-white flex items-center justify-center text-2xl mb-3 relative z-10`}>
                    {meta.icon}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 w-full">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bước {i + 1}</span>
                    <h3 className="font-semibold text-slate-900 mt-1 mb-1 text-sm">{course.title}</h3>
                    <p className="text-xs text-slate-500 mb-3">{course.level}{course.duration ? ` • ${course.duration}` : ""}</p>
                    <Link
                      href={`/khoa-hoc/${course.slug}`}
                      className="text-xs text-orange-600 font-medium hover:underline"
                    >
                      Xem khóa học →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
