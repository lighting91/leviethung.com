import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { Course } from "@/lib/content";

export function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function CourseCard({ course }: { course: Course }) {
  const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0) ?? 0;

  return (
    <Link href={`/khoa-hoc/${course.slug}`} className="card card-hover reveal group flex flex-col p-7">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[0.82rem] text-muted">
        <span className="chip">{course.level}</span>
        {course.duration && (
          <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4" />{course.duration}</span>
        )}
        {totalLessons > 0 && (
          <span className="inline-flex items-center gap-1.5"><Icon name="play" className="h-4 w-4" />{totalLessons} bài học</span>
        )}
      </div>
      <h3 className="mb-2 text-[1.3rem] font-bold tracking-[-0.02em] text-navy transition-colors group-hover:text-cyan-deep">
        {course.title}
      </h3>
      <p className="mb-6 text-[0.95rem]">{course.description}</p>
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-dashed border-line pt-5">
        {course.price ? (
          <div className="leading-tight">
            {course.original_price && (
              <span className="block text-sm text-muted line-through">{formatPrice(course.original_price)}</span>
            )}
            <span className="text-[1.5rem] font-bold tracking-[-0.03em] text-cyan-ink">{formatPrice(course.price)}</span>
          </div>
        ) : (
          <span className="text-sm text-muted">Liên hệ để đăng ký</span>
        )}
        <span className="inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-ink">
          Xem chi tiết <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
