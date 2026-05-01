import Link from "next/link";
import type { Course } from "@/lib/content";

interface Props {
  course: Course;
}

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function PriceAnchor({ course }: Props) {
  if (!course.price) return null;

  const discount = course.original_price
    ? Math.round((1 - course.price / course.original_price) * 100)
    : 0;

  return (
    <section className="py-14 px-4 sm:px-6 bg-slate-900 text-white" id="dang-ky">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Đăng ký khóa học</h2>
        <p className="text-slate-400 mb-8">Đầu tư một lần, học mãi mãi</p>

        <div className="bg-white rounded-2xl p-8 text-slate-900">
          {course.original_price && (
            <p className="text-slate-400 text-lg line-through mb-1">
              {formatPrice(course.original_price)}
            </p>
          )}

          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl font-bold text-orange-600">
              {formatPrice(course.price)}
            </span>
            {discount > 0 && (
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-lg">
                -{discount}%
              </span>
            )}
          </div>

          <p className="text-slate-500 text-sm mb-6">Thanh toán một lần, không phí ẩn</p>

          <ul className="text-left space-y-2 mb-8">
            {[
              "Truy cập toàn bộ bài học ngay sau khi đăng ký",
              "Học lại không giới hạn số lần",
              "Bao gồm tất cả bonus ở trên",
              "Group hỗ trợ sau khóa học",
              "Bảo hành hoàn tiền 30 ngày",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <Link
            href={`/khoa-hoc/${course.slug}/thanh-toan`}
            className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg py-4 rounded-xl transition-colors text-center"
          >
            {course.cta_text ?? "ĐĂNG KÝ NGAY"}
          </Link>

          {course.slots_remaining && course.slots_remaining <= 30 && (
            <p className="text-red-500 text-sm font-medium mt-3">
              ⚠️ Chỉ còn {course.slots_remaining} slot — đăng ký ngay để giữ chỗ
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
