import Link from "next/link";
import Icon from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import type { Course } from "@/lib/content";

interface Props {
  courses: Course[];
}

const levelOrder = ["Cơ bản", "Trung cấp", "Nâng cao"];

export default function LearningPath({ courses }: Props) {
  const sorted = [...courses].sort(
    (a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level)
  );

  if (sorted.length < 2) return null;

  return (
    <div>
      <SectionHead kicker="Learning path" title="Lộ trình" accent="học" lead="Đi từ nền tảng đến tăng trưởng — mỗi khóa là một bước rõ ràng." />
      <ol className="relative grid gap-5 md:grid-cols-3">
        {sorted.map((course, i) => (
          <li key={course.slug} className="reveal relative rounded-card bg-white p-7 shadow-[0_20px_44px_-26px_rgba(14,15,18,.4)]">
            <span className="mb-[18px] grid h-[54px] w-[54px] place-items-center rounded-full border-2 border-cyan bg-white text-navy">
              <Icon name={i === 0 ? "bulb" : i === sorted.length - 1 ? "chart" : "board"} className="h-6 w-6" />
            </span>
            <span className="absolute right-6 top-6 text-[2rem] font-bold tracking-[-0.04em] text-[#e6e9ed]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mb-1 text-[1.04rem] font-bold leading-snug text-navy">{course.title}</h3>
            <p className="mb-4 text-[0.9rem] text-muted">{course.level}{course.duration ? ` · ${course.duration}` : ""}</p>
            <Link href={`/khoa-hoc/${course.slug}`} className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink hover:text-cyan-deep">
              Xem khóa học <Icon name="arrow-right" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
