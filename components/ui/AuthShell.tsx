import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { site } from "@/lib/site";

const perks = [
  "Học thử miễn phí trước khi đăng ký",
  "Theo dõi tiến độ, học tuần tự từng bài",
  "Học trọn đời, xem lại bất kỳ lúc nào",
];

// Split auth layout: dark brand panel (desktop) + form card.
export default function AuthShell({
  kicker,
  title,
  subtitle,
  children,
  footer,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-soft">
      <div className="container-x grid min-h-[calc(100dvh-var(--nav-h))] items-center gap-12 py-12 lg:grid-cols-2 lg:py-16">
        <div className="on-dark relative hidden min-h-[560px] overflow-hidden rounded-card bg-ink lg:flex lg:flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.portrait} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_15%] opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" aria-hidden="true" />
          <div className="relative p-9">
            <Link href="/" aria-label="Lê Viết Hưng — trang chủ"><Logo light /></Link>
          </div>
          <div className="relative mt-auto p-9">
            <p className="mb-3 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-cyan">Khu vực học viên</p>
            <p className="mb-6 text-[1.9rem] font-medium uppercase leading-[1.08] tracking-[-0.035em] text-white">
              Học TikTok Shop <span className="font-bold text-cyan">thực chiến</span>
            </p>
            <ul className="grid gap-2.5 text-[0.95rem]">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <Icon name="check" className="h-5 w-5 flex-none text-cyan" strokeWidth={2.4} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="card p-7 shadow-card sm:p-9">
            <header className="section-head sm !mb-7">
              <p className="kicker">{kicker}</p>
              <h1>{title}</h1>
            </header>
            {subtitle && <p className="-mt-3 mb-7 text-[0.95rem]">{subtitle}</p>}
            {children}
            {footer && <p className="mt-6 text-center text-[0.92rem] text-muted">{footer}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
