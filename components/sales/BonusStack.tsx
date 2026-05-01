import type { Course } from "@/lib/content";

interface Props {
  course: Course;
}

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function BonusStack({ course }: Props) {
  if (!course.bonuses || course.bonuses.length === 0) return null;

  const totalValue = course.bonuses.reduce((acc, b) => acc + (b.value ?? 0), 0);

  return (
    <section className="py-14 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block bg-yellow-50 text-yellow-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
            🎁 Bonus đặc biệt
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Đăng ký hôm nay — nhận thêm</h2>
        </div>

        <div className="space-y-3 mb-6">
          {course.bonuses.map((bonus, i) => (
            <div key={i} className="flex items-start gap-4 bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold text-sm">
                {i + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{bonus.title}</h3>
                {bonus.description && <p className="text-sm text-slate-600 mt-0.5">{bonus.description}</p>}
              </div>
              {bonus.value && (
                <span className="flex-shrink-0 text-sm font-bold text-orange-600">
                  +{formatPrice(bonus.value)}
                </span>
              )}
            </div>
          ))}
        </div>

        {totalValue > 0 && (
          <div className="text-center bg-yellow-100 rounded-xl p-4">
            <p className="text-slate-600 text-sm">Tổng giá trị bonus</p>
            <p className="text-2xl font-bold text-orange-600">{formatPrice(totalValue)}</p>
            <p className="text-slate-500 text-sm mt-1">Bạn nhận được miễn phí khi đăng ký ngay hôm nay</p>
          </div>
        )}
      </div>
    </section>
  );
}
