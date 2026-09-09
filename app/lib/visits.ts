import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export type VisitEntry = {
  ts: string;
  path: string;
  referrer: string | null;
  refDomain: string;
  source: string;
  medium: string | null;
  campaign: string | null;
  ip: string;
  ua: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(DATA_DIR, "visits.jsonl");

// "https://www.facebook.com/..." -> "facebook.com", null -> "direct"
export function getRefDomain(ref: string | null | undefined): string {
  if (!ref) return "direct";
  try {
    return new URL(ref).hostname.replace(/^www\./, "") || "direct";
  } catch {
    return "direct";
  }
}

export type Attribution = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
};

// Reads ?utm_source= / ?ref= (plus medium/campaign) from a page path like
// "/?utm_source=youtube". Use tagged links when sharing so the source is
// tracked even when apps (Facebook, YouTube) strip the referrer.
export function parseAttribution(pagePath: string): Attribution {
  try {
    const q = new URL(pagePath, "http://x").searchParams;
    const clean = (v: string | null) => v?.trim().slice(0, 100) || null;
    return {
      source: clean(q.get("utm_source") ?? q.get("ref")),
      medium: clean(q.get("utm_medium")),
      campaign: clean(q.get("utm_campaign")),
    };
  } catch {
    return { source: null, medium: null, campaign: null };
  }
}

// Final verdict on where a visit came from: tagged source wins,
// then the referrer domain, then "direct".
export function resolveSource(
  taggedSource: string | null,
  refDomain: string,
): string {
  if (taggedSource) return taggedSource.toLowerCase();
  return refDomain;
}

// Best-effort: never throws (filesystem is ephemeral on serverless hosts,
// so console logs remain the durable record in production).
export async function appendVisit(entry: VisitEntry): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(LOG_FILE, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // ignore — already logged to console by the caller
  }
}

export async function readVisits(limit: number): Promise<VisitEntry[]> {
  try {
    const raw = await readFile(LOG_FILE, "utf8");
    const lines = raw.split("\n").filter(Boolean);
    const entries = lines.map((l) => JSON.parse(l) as VisitEntry);
    return entries.slice(-limit).reverse();
  } catch {
    return [];
  }
}
