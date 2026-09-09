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

// Logs every page view: which route was hit and where the visitor came from.
// Runs before the route renders. Static assets / API routes are excluded below.
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname + request.nextUrl.search;
  const from = refDomain(request.headers.get("referer"));
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  console.log(`[visit] ${request.method} ${path} <- ${from} (ip=${ip})`);

  return NextResponse.next();
}

export const config = {
  // Page routes only: skip API, Next internals, and files (images, favicon, …)
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
