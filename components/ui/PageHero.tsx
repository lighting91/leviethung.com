import SectionHead from "@/components/ui/SectionHead";

// Inner-page header: soft gradient band with the SMUFT section heading as the page H1.
export default function PageHero({
  kicker,
  title,
  accent,
  lead,
  children,
}: {
  kicker: string;
  title?: string;
  accent?: string;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-gradient-to-b from-white to-soft pb-14 pt-14 sm:pb-16 sm:pt-20">
      <div className="container-x">
        <SectionHead as="h1" kicker={kicker} title={title} accent={accent} lead={lead} className="!mb-0" />
        {children}
      </div>
    </section>
  );
}
