import Icon from "@/components/ui/Icon";
import type { Testimonial } from "@/lib/content";

function initials(name: string) {
  const parts = name.replace(/^(Mr|Ms|Mrs)\.\s*/i, "").trim().split(/\s+/);
  return parts[parts.length - 1]?.[0]?.toUpperCase() ?? "?";
}

export default function TestimonialCard({ t }: { t: Testimonial }) {
  const rating = Math.max(0, Math.min(5, t.rating ?? 5));
  return (
    <figure className="card reveal relative mb-6 break-inside-avoid p-7">
      <div className="mb-3.5 flex gap-[3px] text-star" aria-label={`${rating} sao`}>
        {Array.from({ length: rating }).map((_, i) => (
          <Icon key={i} name="star" className="h-[18px] w-[18px]" filled />
        ))}
      </div>
      {t.platform && <p className="absolute right-[26px] top-[26px] text-xs font-semibold text-cyan-deep">#{t.platform}</p>}
      <blockquote className="mb-5 text-[0.97rem] text-ink">“{t.body}”</blockquote>
      {t.result && (
        <p className="mb-5 rounded-card-sm bg-soft px-4 py-2.5 text-sm font-semibold text-navy">{t.result}</p>
      )}
      <figcaption className="flex items-center gap-3 text-[0.84rem] leading-snug text-muted">
        {t.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.avatar} alt="" width={48} height={48} className="h-12 w-12 flex-none rounded-full object-cover" loading="lazy" />
        ) : (
          <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-ink font-bold text-cyan">{initials(t.name)}</span>
        )}
        <span>
          <strong className="block text-[0.95rem] text-navy">{t.name}</strong>
          {t.role}
        </span>
      </figcaption>
    </figure>
  );
}
