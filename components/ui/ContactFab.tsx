import Icon from "@/components/ui/Icon";
import { site } from "@/lib/site";

// Floating quick-contact buttons (bottom-right), as on smuft.vn.
export default function ContactFab() {
  return (
    <div className="fixed bottom-[18px] right-[18px] z-[90] grid gap-3 max-sm:bottom-3.5 max-sm:right-3.5" aria-label="Liên hệ nhanh">
      <a
        href={site.zalo.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat Zalo ${site.zalo.display}`}
        className="grid h-[54px] w-[54px] place-items-center rounded-full bg-zalo text-[0.8rem] font-bold tracking-[0.02em] text-white shadow-[0_12px_28px_-10px_rgba(14,15,18,.5)] transition-transform hover:scale-[1.08] max-sm:h-[50px] max-sm:w-[50px]"
      >
        Zalo
      </a>
      <a
        href={`mailto:${site.email}`}
        aria-label={`Gửi email ${site.email}`}
        className="relative grid h-[54px] w-[54px] place-items-center rounded-full bg-ink text-cyan shadow-[0_12px_28px_-10px_rgba(14,15,18,.5)] transition-transform hover:scale-[1.08] max-sm:h-[50px] max-sm:w-[50px]"
      >
        <span className="animate-ring pointer-events-none absolute inset-0 rounded-full border-2 border-cyan [animation:ring_2s_ease-out_infinite]" aria-hidden="true" />
        <Icon name="mail" className="h-6 w-6" />
      </a>
    </div>
  );
}
