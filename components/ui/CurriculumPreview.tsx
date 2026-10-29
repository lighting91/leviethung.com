import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { Course } from "@/lib/content";

// With a single course, the second column previews its curriculum instead of staying empty.
export default function CurriculumPreview({ course }: { course: Course }) {
  const modules = course.modules ?? [];
  const freeLesson = modules.flatMap((m) => m.lessons ?? []).find((l) => l.free_preview);
  return (
    <div className="on-dark reveal flex flex-col rounded-card bg-ink p-7">
      <p className="mb-4 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#a3acb9]">Nội dung khóa học</p>
      <ol className="mb-6 grid gap-3">
        {modules.map((m, i) => (
          <li key={m.title} className="flex items-start gap-3.5 border-b border-white/10 pb-3 last:border-0 last:pb-0">
            <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full border-2 border-cyan text-[0.75rem] font-bold text-cyan">
              {i + 1}
            </span>
            <span className="min-w-0">
              <strong className="block text-[0.95rem] font-semibold leading-snug">{m.title.replace(/^Module \d+:\s*/i, "")}</strong>
              <span className="text-[0.82rem] text-[#8b95a3]">{m.lessons?.length ?? 0} bài học</span>
            </span>
          </li>
        ))}
      </ol>
      <Link
        href={freeLesson ? `/khoa-hoc/${course.slug}/hoc/${freeLesson.slug}` : `/khoa-hoc/${course.slug}`}
        className="btn btn-accent mt-auto self-start"
      >
        <Icon name="play" className="h-[18px] w-[18px]" strokeWidth={2} />
        {freeLesson ? "Học thử miễn phí" : "Xem chi tiết"}
      </Link>
    </div>
  );
}
