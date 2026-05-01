import type { Testimonial } from "@/lib/content";

interface Props {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ testimonials }: Props) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-14 px-4 sm:px-6 bg-orange-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Học viên nói gì?</h2>
        <p className="text-slate-500 text-center mb-8">Kết quả thực tế từ những người đã học</p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.slug} className="bg-white rounded-xl p-5 shadow-sm border border-orange-100">
              <StarRating rating={t.rating ?? 5} />

              <p className="text-slate-700 text-sm leading-relaxed mt-3 mb-4">"{t.body}"</p>

              {t.result && (
                <div className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg mb-4">
                  📈 {t.result}
                </div>
              )}

              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  {t.role && <p className="text-xs text-slate-500">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
