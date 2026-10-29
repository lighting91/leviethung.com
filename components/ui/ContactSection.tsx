import Link from "next/link";
import Icon, { type IconName } from "@/components/ui/Icon";
import BrandIcon from "@/components/ui/BrandIcon";
import SectionHead from "@/components/ui/SectionHead";
import { site } from "@/lib/site";

const routes: { icon: IconName; title: string; desc: string; href: string; label: string; external?: boolean }[] = [
  { icon: "grad", title: "Tôi muốn học bài bản", desc: "Khóa học có lộ trình, học tuần tự, áp dụng ngay.", href: "/khoa-hoc", label: "Xem khóa học" },
  { icon: "download", title: "Tôi cần tài liệu", desc: "Playbook, template, checklist miễn phí.", href: "/tai-nguyen", label: "Tải tài nguyên" },
  { icon: "store", title: "Doanh nghiệp cần người vận hành", desc: "Tư vấn, vận hành TikTok Shop/Shopee, KOC, livestream cùng SMUFT.", href: site.zalo.url, label: "Chat Zalo", external: true },
];

export default function ContactSection() {
  return (
    <section className="section on-dark relative overflow-hidden bg-black" id="lien-he">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,rgba(54,209,214,.18),transparent_60%)]"
      />
      <div className="container-x relative grid items-start gap-14 md:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionHead kicker="Contact" title="Kết nối với Hưng" onDark />
          <p className="reveal mb-6 max-w-[460px] text-[1.05rem]">
            Kể cho tôi nghe mục tiêu của bạn — nhắn Zalo để được trả lời nhanh nhất, hoặc gửi email nếu cần trao đổi chi tiết.
          </p>
          <a href={site.zalo.url} target="_blank" rel="noopener noreferrer" className="btn btn-accent reveal mb-8 px-7 py-[15px] text-base">
            <Icon name="chat" className="h-[18px] w-[18px]" strokeWidth={2} />
            Chat Zalo: {site.zalo.display}
          </a>
          <ul className="reveal border-t border-white/15">
            <li className="flex items-start gap-4 border-b border-white/15 py-[18px]">
              <Icon name="chat" className="mt-1 h-[22px] w-[22px] flex-none text-cyan" />
              <span>
                <small className="block text-[0.78rem] uppercase tracking-[0.12em] text-[#8b95a3]">Zalo</small>
                <a href={site.zalo.url} target="_blank" rel="noopener noreferrer" className="border-b border-cyan/50 font-medium text-white hover:text-cyan">{site.zalo.display}</a>
              </span>
            </li>
            <li className="flex items-start gap-4 border-b border-white/15 py-[18px]">
              <Icon name="mail" className="mt-1 h-[22px] w-[22px] flex-none text-cyan" />
              <span>
                <small className="block text-[0.78rem] uppercase tracking-[0.12em] text-[#8b95a3]">E-mail</small>
                <a href={`mailto:${site.email}`} className="border-b border-cyan/50 font-medium text-white hover:text-cyan">{site.email}</a>
              </span>
            </li>
            <li className="flex items-start gap-4 border-b border-white/15 py-[18px]">
              <BrandIcon name="facebook" className="mt-1 h-[22px] w-[22px] flex-none text-cyan" />
              <span>
                <small className="block text-[0.78rem] uppercase tracking-[0.12em] text-[#8b95a3]">Facebook</small>
                <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="border-b border-cyan/50 font-medium text-white hover:text-cyan">Lê Viết Hưng</a>
              </span>
            </li>
            <li className="flex items-start gap-4 border-b border-white/15 py-[18px]">
              <Icon name="globe" className="mt-1 h-[22px] w-[22px] flex-none text-cyan" />
              <span>
                <small className="block text-[0.78rem] uppercase tracking-[0.12em] text-[#8b95a3]">Agency</small>
                <a href={site.smuft} target="_blank" rel="noopener" className="border-b border-cyan/50 font-medium text-white hover:text-cyan">smuft.vn</a>
              </span>
            </li>
          </ul>
        </div>

        <div className="reveal grid gap-4 rounded-card bg-white p-6 text-body sm:p-8">
          <h3 className="text-[1.4rem] font-bold text-ink">Bạn đang cần gì?</h3>
          {routes.map((r) => {
            const inner = (
              <>
                <span className="icon-tile"><Icon name={r.icon} className="h-6 w-6" /></span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-[1.02rem] text-navy">{r.title}</strong>
                  <span className="block text-[0.9rem] leading-snug">{r.desc}</span>
                </span>
                <Icon name="arrow-right" className="h-5 w-5 flex-none text-ink transition-transform group-hover:translate-x-1" strokeWidth={2} />
              </>
            );
            const cls = "group flex items-center gap-4 rounded-card-sm border border-line p-4 transition-colors hover:border-cyan-2";
            return r.external ? (
              <a key={r.title} href={r.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${r.title} — ${r.label}`}>{inner}</a>
            ) : (
              <Link key={r.title} href={r.href} className={cls} aria-label={`${r.title} — ${r.label}`}>{inner}</Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
