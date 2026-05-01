import type { Course } from "@/lib/content";

interface Props {
  course: Course;
}

export default function SolutionIntro({ course }: Props) {
  return (
    <section className="py-14 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-block bg-orange-50 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          Giải pháp
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Giới thiệu khóa học <span className="text-orange-600">{course.title}</span>
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-8">
          {course.description}
        </p>

        <div className="grid gap-4 sm:grid-cols-3 text-left">
          {[
            { icon: "🎯", title: "Thực chiến 100%", desc: "Mọi bài học đều có ví dụ thực tế và bài tập áp dụng ngay" },
            { icon: "⚡", title: "Kết quả nhanh", desc: "Chỉ 30 ngày để thấy sự thay đổi rõ rệt trên kênh của bạn" },
            { icon: "🔄", title: "Học trọn đời", desc: "Mua một lần, xem lại bất kỳ lúc nào, bao gồm cả cập nhật mới" },
          ].map((item) => (
            <div key={item.title} className="bg-slate-50 rounded-xl p-5">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
