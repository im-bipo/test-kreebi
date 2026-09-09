import { NextResponse, after } from "next/server";
import {
  appendVisit,
  getRefDomain,
  parseAttribution,
  resolveSource,
} from "../../lib/visits";
import { notifySlack } from "../../lib/slack";

// Receives beacons from <VisitTracker />: which route + where they came from.
export async function POST(request: Request) {
  let body: { path?: unknown; referrer?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const path =
    typeof body.path === "string" && body.path.startsWith("/")
      ? body.path.slice(0, 500)
      : "/";
  const referrer =
    typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;
  const refDomain = getRefDomain(referrer);
  const attr = parseAttribution(path);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const entry = {
    ts: new Date().toISOString(),
    path,
    referrer,
    refDomain,
    source: resolveSource(attr.source, refDomain),
    medium: attr.medium,
    campaign: attr.campaign,
    ip,
    ua: (request.headers.get("user-agent") ?? "unknown").slice(0, 300),
  };

  console.log(`[visit] ${entry.path} <- ${entry.source} (ip=${entry.ip})`);

  // Respond immediately; persist + notify Slack after the response is sent.
  after(async () => {
    await appendVisit(entry);
    await notifySlack(
      [
        `New visit: ${entry.path} <- ${entry.source}`,
        `Ref: ${entry.referrer ?? "direct"}${
          entry.campaign ? ` · campaign: ${entry.campaign}` : ""
        }`,
        `IP: ${entry.ip} · ${entry.ts}`,
      ].join("\n"),
    );
  });

  return NextResponse.json({ ok: true });
}
