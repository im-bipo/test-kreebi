// Posts a plain-text message to Slack via the LOG_WEBHOOK env var.
// Best-effort: a missing/invalid webhook or network error never throws.
// The secret stays server-side (never sent to the browser).
export async function notifySlack(text: string): Promise<void> {
  const webhook = process.env.LOG_WEBHOOK;
  if (!webhook) return;
  try {
    new URL(webhook);
  } catch {
    console.error("[slack] invalid LOG_WEBHOOK, skipping notify");
    return;
  }
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // ignore — console + file logs remain the durable record
  }
}
