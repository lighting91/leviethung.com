import type { Course } from "@/lib/content";

interface Props {
  course: Course;
}

export default function PainPoints({ course }: Props) {
  if (!course.pain_points || course.pain_points.length === 0) return null;

  return (
    <section className="py-14 px-4 sm:px-6 bg-soft">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-ink text-center mb-2">
          Bạn có đang gặp phải điều này không?
        </h2>
        <p className="text-muted text-center mb-8">
          Nếu bạn thấy mình trong ít nhất 1 điều dưới đây, khóa học này dành cho bạn.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {course.pain_points.map((point, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-line">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">✗</span>
              <p className="text-body text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
