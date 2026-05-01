import type { Metadata } from "next";
import { getAllResources } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tài nguyên",
  description: "Template, playbook và công cụ miễn phí về TikTok Marketing.",
};

export default function TaiNguyenPage() {
  const resources = getAllResources();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tài nguyên miễn phí</h1>
        <p className="text-slate-500">
          Template, playbook và công cụ giúp bạn làm TikTok Marketing hiệu quả hơn.
        </p>
      </div>

      {/* Always show the PDF playbook */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 text-white">
          <div className="text-5xl">📘</div>
          <div className="flex-1 text-center sm:text-left">
            <span className="inline-block text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium mb-3">
              PDF · Miễn phí
            </span>
            <h2 className="text-xl font-bold mb-2">TikTok Cosmetic One-Shot Playbook</h2>
            <p className="text-orange-100 text-sm">
              Cẩm nang toàn diện về TikTok Marketing dành cho ngành mỹ phẩm. Bao gồm chiến lược nội dung, cách tăng tương tác và chuyển đổi doanh số.
            </p>
          </div>
          <a
            href="/files/TikTok_Cosmetic_One-Shot_Playbook.pdf"
            download
            className="flex-shrink-0 bg-white text-orange-700 font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap"
          >
            Tải về PDF →
          </a>
        </div>
      </div>

      {resources.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {resources.map((res) => (
            <div key={res.slug} className="bg-white rounded-xl border border-slate-200 p-6">
              <span className="inline-block text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium mb-3">
                {res.category}
              </span>
              <h3 className="font-semibold text-slate-900 mb-2 text-lg">{res.title}</h3>
              <p className="text-sm text-slate-500 mb-5">{res.description}</p>
              {res.fileUrl && (
                <a
                  href={res.fileUrl}
                  download
                  className="inline-flex items-center gap-2 text-sm text-orange-600 font-medium hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Tải về
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {resources.length === 0 && (
        <div className="mt-6">
          <p className="text-slate-500 text-sm text-center py-6">Thêm tài nguyên sẽ được cập nhật sớm!</p>
        </div>
      )}
    </div>
  );
}
