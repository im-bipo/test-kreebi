"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Reports every page view (route + referrer) to /api/track.
// Fires on full loads and on client-side navigations (e.g. / -> /about).
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const payload = JSON.stringify({
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || null,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
