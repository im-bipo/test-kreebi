import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function refDomain(referer: string | null): string {
  if (!referer) return "direct";
  try {
    return new URL(referer).hostname.replace(/^www\./, "") || "direct";
  } catch {
    return "direct";
  }
}

// ?utm_source=youtube / ?ref=facebook — tagged links survive in-app
// browsers that strip the referrer. Kept inline: proxy shouldn't share
// modules with the app (it can run separately on the CDN).
function taggedSource(search: string): string | null {
  const m = /[?&](?:utm_source|ref)=([^&]{1,100})/.exec(search);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]).trim().toLowerCase() || null;
  } catch {
    return null;
  }
}

// Logs every page view: which route was hit and where the visitor came from.
// Runs before the route renders. Static assets / API routes are excluded below.
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname + request.nextUrl.search;
  const tag = taggedSource(request.nextUrl.search);
  const from = tag ?? refDomain(request.headers.get("referer"));
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  console.log(`[visit] ${request.method} ${path} <- ${from} (ip=${ip})`);

  return NextResponse.next();
}

export const config = {
  // Page routes only: skip API, Next internals, and files (images, favicon, …)
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
