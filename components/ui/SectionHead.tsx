// SMUFT section heading: gradient bar + kicker + big uppercase title.
export default function SectionHead({
  kicker,
  title,
  accent,
  lead,
  as: Tag = "h2",
  onDark = false,
  className = "",
}: {
  kicker: string;
  title?: string;
  accent?: string;
  lead?: React.ReactNode;
  as?: "h1" | "h2";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <header className={`section-head reveal ${onDark ? "on-dark" : ""} ${className}`}>
      <p className="kicker">{kicker}</p>
      <Tag>
        {title}
        {title && accent ? " " : null}
        {accent && <span className="accent">{accent}</span>}
      </Tag>
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}
