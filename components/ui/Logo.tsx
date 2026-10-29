// Wordmark: LH monogram + name, matching the SMUFT ink/cyan palette.
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className={`grid h-10 w-10 flex-none place-items-center rounded-xl text-[0.95rem] font-bold tracking-tight text-cyan ${light ? "bg-white/10" : "bg-ink"}`}>
        LH
      </span>
      <span className="leading-tight">
        <span className={`block text-[1.02rem] font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
          Lê Viết Hưng
        </span>
        <span className={`block text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${light ? "text-[#8b95a3]" : "text-muted"}`}>
          Founder SMUFT
        </span>
      </span>
    </span>
  );
}
