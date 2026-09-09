import { NextResponse } from "next/server";
import { readVisits } from "../../lib/visits";

// GET /api/visits?limit=100            (dev: open)
// GET /api/visits?limit=100&key=SECRET (prod: requires VISITS_KEY env var)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(Number.parseInt(url.searchParams.get("limit") ?? "100", 10) || 100, 1),
    1000,
  );

  const requiredKey = process.env.VISITS_KEY;
  if (requiredKey) {
    if (url.searchParams.get("key") !== requiredKey) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "set VISITS_KEY env var to enable visit logs" },
      { status: 403 },
    );
  }

  return NextResponse.json({ visits: await readVisits(limit) });
}
