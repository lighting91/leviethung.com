import Icon from "@/components/ui/Icon";
import { site } from "@/lib/site";

// Dark "commit" block from smuft.vn, used for the free playbook lead magnet.
export default function PlaybookCta() {
  return (
    <div className="on-dark reveal relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-card bg-ink px-7 py-9 md:flex-row md:items-center md:px-12 md:py-11">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(54,209,214,.35),transparent_65%)]"
      />
      <div className="relative z-[1] max-w-[720px]">
        <span className="chip chip-dark mb-4"><Icon name="file" className="h-3.5 w-3.5" strokeWidth={2} />PDF · Miễn phí</span>
        <h2 className="mb-3 text-[1.6rem] font-bold tracking-[-0.02em] sm:text-[2rem]">TikTok Cosmetic One-Shot Playbook</h2>
        <p className="text-[1.05rem] leading-relaxed">
          Cẩm nang TikTok cho ngành mỹ phẩm — chiến lược nội dung, cách tăng tương tác và chuyển đổi doanh số. Tải về và áp dụng ngay cho kênh của bạn.
        </p>
      </div>
      <a href={site.playbook} download className="btn btn-light relative z-[1]">
        <Icon name="download" className="h-[18px] w-[18px]" strokeWidth={2} />
        Tải Playbook miễn phí
      </a>
    </div>
  );
}
