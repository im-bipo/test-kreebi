import { NextResponse, after } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { notifySlack } from "../../lib/slack";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOG_FILE = path.join(process.cwd(), "data", "beta.jsonl");

// Best-effort per-IP throttle so the public form can't spam the Slack
// channel. In-memory only (resets on redeploy) — good enough for a beta list.
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  rec.count += 1;
  return rec.count > 5;
}

// Beta / newsletter signup: validates the email, logs it, notifies Slack.
export async function POST(request: Request) {
  let body: { email?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase().slice(0, 254)
      : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts — please try again later." },
      { status: 429 },
    );
  }

  const entry = {
    ts: new Date().toISOString(),
    email,
    ip,
    ua: (request.headers.get("user-agent") ?? "unknown").slice(0, 300),
  };

  console.log(`[beta] ${entry.email} (ip=${entry.ip})`);

  // Respond immediately; persist + notify Slack after the response is sent.
  after(async () => {
    try {
      await mkdir(path.dirname(LOG_FILE), { recursive: true });
      await appendFile(LOG_FILE, JSON.stringify(entry) + "\n", "utf8");
    } catch {
      // ignore — console + Slack remain the record
    }
    await notifySlack(
      [`Beta signup: ${entry.email}`, `IP: ${entry.ip} · ${entry.ts}`].join(
        "\n",
      ),
    );
  });

  return NextResponse.json({ ok: true });
}
