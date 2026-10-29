// Line icon set ported from the SMUFT Agency sprite (24×24, 1.6 stroke).
const paths = {
  arrow: <><circle cx="12" cy="12" r="10" /><path d="M9 15l6-6M10 9h5v5" /></>,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  strategy: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" /></>,
  store: <><path d="M3.5 9 5 4h14l1.5 5" /><path d="M4.5 9v11h15V9" /><path d="M3.5 9h17" /><path d="M9.5 20v-6h5v6" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" /><path d="M18 14.2c2.1.7 3.5 2.6 3.5 5.8" /></>,
  live: <><rect x="2.5" y="6" width="13.5" height="12" rx="2.5" /><path d="m16 10.2 5.5-3.2v10l-5.5-3.2z" /><circle cx="6.5" cy="10" r="1.2" /></>,
  megaphone: <><path d="M3 10.5v3a1 1 0 0 0 1 1h3l6 4.5v-14L7 9.5H4a1 1 0 0 0-1 1z" /><path d="M16.5 9a4.2 4.2 0 0 1 0 6" /><path d="M19 6.5a8 8 0 0 1 0 11" /></>,
  grad: <><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11.2V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.8" /><path d="M22 9v5.5" /></>,
  hub: <><circle cx="12" cy="12" r="3" /><circle cx="4.5" cy="5" r="2" /><circle cx="19.5" cy="5" r="2" /><circle cx="4.5" cy="19" r="2" /><circle cx="19.5" cy="19" r="2" /><path d="m6 6.5 3.8 3.5M18 6.5l-3.8 3.5M6 17.5l3.8-3.5M18 17.5 14.2 14" /></>,
  gear: <><circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /></>,
  spark: <><path d="m12 3 2.1 5.4L19.5 10l-5.4 2.1L12 17.5l-2.1-5.4L4.5 10l5.4-1.6z" /><path d="M19 16v4M17 18h4" /></>,
  pen: <><path d="m4 20 4.2-1L19.3 7.9a2.1 2.1 0 0 0-3-3L5.2 16z" /><path d="m14.5 6.5 3 3" /></>,
  chat: <><path d="M4 5h16v11H9.5L4 20z" /><path d="M8 9.5h8M8 12.5h5" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 3h6v3H9z" /><path d="M9 11h6M9 15h4" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></>,
  handover: <path d="M6 8h12l-3.5-3.5M18 16H6l3.5 3.5" />,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" /></>,
  board: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="m8 20 4-4 4 4" /><path d="m7 12 3-3 2 2 4-4" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  phone: <path d="M5 3.5h3.5l2 5-2.5 1.6a11 11 0 0 0 5.9 5.9l1.6-2.5 5 2v3.5a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  pin: <><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></>,
  star: <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.5 1.2 6.4L12 17.3l-5.7 3.1 1.2-6.4-4.7-4.5 6.4-.8z" />,
  download: <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M4 19h16" /></>,
  book: <><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z" /><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" /></>,
  file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
  play: <><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5 3.5-5 3.5z" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  gift: <><rect x="3.5" y="9" width="17" height="11" rx="1.5" /><path d="M2.5 9h19v-3h-19zM12 6v14" /><path d="M12 6c-1.5-3-5-3-5-.8C7 6 9.5 6 12 6zM12 6c1.5-3 5-3 5-.8C17 6 14.5 6 12 6z" /></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" /><path d="m8.8 12 2.3 2.3 4.2-4.6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
  logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 17l-5-5 5-5M5 12h11" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  bank: <><path d="M3 9.5 12 4l9 5.5" /><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></>,
} as const;

export type IconName = keyof typeof paths;

export default function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.6,
  filled = false,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
