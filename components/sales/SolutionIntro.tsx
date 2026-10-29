import type { Course } from "@/lib/content";

interface Props {
  course: Course;
}

export default function SolutionIntro({ course }: Props) {
  return (
    <section className="py-14 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-block bg-cyan/10 text-cyan-deep text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          Giải pháp
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">
          Giới thiệu khóa học <span className="text-cyan-ink">{course.title}</span>
        </h2>
        <p className="text-body text-lg leading-relaxed mb-8">
          {course.description}
        </p>

        <div className="grid gap-4 sm:grid-cols-3 text-left">
          {[
            { icon: "🎯", title: "Thực chiến 100%", desc: "Mọi bài học đều có ví dụ thực tế và bài tập áp dụng ngay" },
            { icon: "⚡", title: "Kết quả nhanh", desc: "Chỉ 30 ngày để thấy sự thay đổi rõ rệt trên kênh của bạn" },
            { icon: "🔄", title: "Học trọn đời", desc: "Mua một lần, xem lại bất kỳ lúc nào, bao gồm cả cập nhật mới" },
          ].map((item) => (
            <div key={item.title} className="bg-soft rounded-xl p-5">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-ink mb-1">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
