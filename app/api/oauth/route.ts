import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://leviethung.com";

  const params = new URLSearchParams({
    client_id: clientId!,
    scope: "repo,user",
    redirect_uri: `${siteUrl}/api/oauth/callback`,
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params}`
  );
}
