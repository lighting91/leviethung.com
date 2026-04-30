import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Về tôi",
  description: "Tìm hiểu về Lê Viết Hưng — TikTok Marketing Expert.",
};

export default function VeToiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-12">
        <div className="flex-shrink-0 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
          LH
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Lê Viết Hưng</h1>
          <p className="text-indigo-600 font-medium mb-3">TikTok Marketing Expert & Content Creator</p>
          <p className="text-slate-600 leading-relaxed">
            Tôi giúp các thương hiệu Việt Nam tăng trưởng trên TikTok thông qua chiến lược nội dung sáng tạo và data-driven marketing.
          </p>
        </div>
      </div>

      {/* About */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Về tôi</h2>
        <div className="prose prose-slate max-w-none">
          <p>
            Với nhiều năm kinh nghiệm trong lĩnh vực digital marketing, tôi đã giúp nhiều thương hiệu Việt — đặc biệt trong ngành mỹ phẩm và FMCG — xây dựng sự hiện diện mạnh mẽ trên TikTok.
          </p>
          <p>
            Triết lý của tôi đơn giản: <strong>nội dung tốt + chiến lược đúng = tăng trưởng bền vững</strong>. Tôi không tin vào những "hack" ngắn hạn mà tập trung vào việc xây dựng cộng đồng thực sự.
          </p>
          <p>
            Trên trang này, tôi chia sẻ toàn bộ những gì mình đã học được — hoàn toàn miễn phí — vì tôi tin rằng kiến thức tốt nhất là kiến thức được chia sẻ.
          </p>
        </div>
      </section>

      {/* What I do */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Tôi làm gì</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: "📱", title: "TikTok Strategy", desc: "Xây dựng chiến lược nội dung TikTok từ đầu cho thương hiệu" },
            { icon: "🎬", title: "Content Creation", desc: "Sản xuất và tối ưu nội dung video ngắn hiệu quả cao" },
            { icon: "📊", title: "Marketing Analytics", desc: "Phân tích dữ liệu và tối ưu hiệu suất chiến dịch" },
            { icon: "🎓", title: "Training & Coaching", desc: "Đào tạo đội ngũ marketing về TikTok và social media" },
          ].map((item) => (
            <div key={item.title} className="bg-slate-50 rounded-xl p-5">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-semibold text-slate-900 mt-2 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Cùng làm việc nhé?</h2>
        <p className="text-indigo-100 mb-6 max-w-md mx-auto">
          Nếu bạn cần tư vấn về TikTok Marketing hoặc muốn hợp tác, hãy liên hệ với tôi.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:contact@leviethung.com"
            className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            ✉️ Gửi email
          </a>
          <a
            href="https://facebook.com/leviethung"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            Facebook
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-indigo-200 text-sm mb-4">Hoặc xem thêm tài nguyên miễn phí:</p>
          <Link
            href="/tai-nguyen"
            className="text-white font-medium text-sm hover:underline"
          >
            Tải Playbook TikTok Cosmetic →
          </Link>
        </div>
      </section>
    </div>
  );
}
