import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export type VisitEntry = {
  ts: string;
  path: string;
  referrer: string | null;
  refDomain: string;
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
