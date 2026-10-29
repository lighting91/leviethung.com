import Link from "next/link";
import Logo from "@/components/ui/Logo";
import BrandIcon from "@/components/ui/BrandIcon";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/site";

const footerLinks = [
  { href: "/ve-toi", label: "Về tôi" },
  { href: "/khoa-hoc", label: "Khóa học" },
  { href: "/tai-nguyen", label: "Tài nguyên" },
  { href: "/blog", label: "Blog" },
];

const socials = [
  { href: site.facebook, label: "Facebook", icon: <BrandIcon name="facebook" /> },
  { href: site.tiktok, label: "TikTok", icon: <BrandIcon name="tiktok" /> },
  { href: site.youtube, label: "YouTube", icon: <BrandIcon name="youtube" /> },
  { href: `mailto:${site.email}`, label: "Email", icon: <Icon name="mail" /> },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-black py-10 text-[#8b95a3]">
      <div className="container-x grid items-center gap-x-10 gap-y-6 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link href="/" aria-label="Lê Viết Hưng — trang chủ">
            <Logo light />
          </Link>
          <p className="text-[0.82rem] uppercase tracking-[0.08em]">{site.tagline}</p>
        </div>

        <div className="flex flex-col gap-5 md:items-end">
          <nav className="flex flex-wrap gap-x-[26px] gap-y-2.5 text-[0.92rem]" aria-label="Liên kết chân trang">
            {footerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
            <a href={site.zalo.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              Zalo {site.zalo.display}
            </a>
          </nav>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-cyan hover:text-cyan"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <p className="border-t border-white/10 pt-5 text-[0.84rem] md:col-span-2">
          © {year} Lê Viết Hưng · Founder{" "}
          <a href={site.smuft} target="_blank" rel="noopener" className="text-white/80 underline decoration-cyan/60 underline-offset-4 hover:text-cyan">
            SMUFT Agency
          </a>
        </p>
      </div>
    </footer>
  );
}
