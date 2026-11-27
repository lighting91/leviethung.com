// Only allow redirects back into this site after sign-in (blocks open redirects like "//evil.com").
export function safeNext(path: string | null | undefined, fallback = "/tai-khoan"): string {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return fallback;
  return path;
}
