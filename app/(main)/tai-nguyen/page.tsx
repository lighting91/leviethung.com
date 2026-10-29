import type { Metadata } from "next";
import { getAllResources } from "@/lib/content";
import PageHero from "@/components/ui/PageHero";
import PlaybookCta from "@/components/ui/PlaybookCta";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tài nguyên",
  description: "Playbook, template và checklist miễn phí về TikTok Shop, KOC và nội dung bán hàng.",
};

export default function TaiNguyenPage() {
  // The playbook already has its own feature block, so it is not listed twice.
  const resources = getAllResources().filter((r) => r.fileUrl !== site.playbook);

  return (
    <>
      <PageHero
        kicker="Free resources"
        title="Tài nguyên"
        accent="miễn phí"
        lead="Playbook, template và checklist đúc kết từ các dự án thật — tải về là dùng được."
      />

      <section className="section">
        <div className="container-x">
          <PlaybookCta />

          {resources.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((res) => (
                <article key={res.slug} className="card reveal flex flex-col p-7">
                  <div className="mb-4 flex items-center gap-3.5">
                    <span className="icon-tile"><Icon name="file" className="h-6 w-6" /></span>
                    <span className="chip">{res.category}</span>
                  </div>
                  <h2 className="mb-2 text-[1.18rem] font-bold text-navy">{res.title}</h2>
                  <p className="mb-6 text-[0.95rem]">{res.description}</p>
                  {res.fileUrl && (
                    <a href={res.fileUrl} download className="btn btn-outline btn-sm mt-auto self-start">
                      <Icon name="download" className="h-4 w-4" strokeWidth={2} /> Tải về
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="reveal mt-10 text-center text-[0.95rem] text-muted">Thêm tài nguyên sẽ được cập nhật sớm!</p>
          )}
        </div>
      </section>
    </>
  );
}
