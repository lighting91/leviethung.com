import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-3">
              TikTok Marketing Expert
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Xin chào, tôi là{" "}
              <span className="text-indigo-600">Lê Viết Hưng</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto md:mx-0">
              Tôi chia sẻ kiến thức về TikTok Marketing, chiến lược nội dung và cách xây dựng thương hiệu trên mạng xã hội.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/tai-nguyen"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Tải tài nguyên miễn phí
              </Link>
              <Link
                href="/blog"
                className="bg-white text-slate-700 px-6 py-3 rounded-lg font-semibold border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                Đọc blog
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-6xl font-bold shadow-xl">
              LH
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resource */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 text-white">
            <div className="text-5xl">📘</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide mb-2">Miễn phí</p>
              <h2 className="text-2xl font-bold mb-2">TikTok Cosmetic One-Shot Playbook</h2>
              <p className="text-indigo-100 text-sm">
                Cẩm nang toàn diện về TikTok Marketing dành cho ngành mỹ phẩm — chiến lược, content và tăng trưởng.
              </p>
            </div>
            <a
              href="/files/TikTok_Cosmetic_One-Shot_Playbook.pdf"
              download
              className="flex-shrink-0 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Tải về →
            </a>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Bài viết mới nhất</h2>
            <Link href="/blog" className="text-sm text-indigo-600 font-medium hover:underline">
              Xem tất cả →
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <p className="text-slate-500 text-center py-10">Chưa có bài viết nào. Hãy quay lại sớm!</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-4">{post.excerpt}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(post.date).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Tôi có thể giúp gì cho bạn?</h2>
          <p className="text-slate-500 mb-10 max-w-lg mx-auto">
            Từ kiến thức miễn phí đến chương trình đào tạo chuyên sâu, đây là những gì bạn sẽ tìm thấy trên trang này.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "✍️",
                title: "Blog & Kiến thức",
                desc: "Bài viết chuyên sâu về TikTok, content marketing và xây dựng thương hiệu số.",
                href: "/blog",
                label: "Đọc blog",
              },
              {
                icon: "📦",
                title: "Tài nguyên miễn phí",
                desc: "Template, playbook, checklist và công cụ giúp bạn marketing hiệu quả hơn.",
                href: "/tai-nguyen",
                label: "Xem tài nguyên",
              },
              {
                icon: "🎓",
                title: "Khóa học",
                desc: "Chương trình học bài bản từ cơ bản đến nâng cao về TikTok Marketing.",
                href: "/khoa-hoc",
                label: "Xem khóa học",
              },
            ].map((item) => (
              <div key={item.title} className="bg-slate-50 rounded-xl p-6 text-left">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{item.desc}</p>
                <Link href={item.href} className="text-sm text-indigo-600 font-medium hover:underline">
                  {item.label} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
