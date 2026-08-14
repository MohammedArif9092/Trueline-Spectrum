import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, setSessionCookie } from "@/lib/auth";
import { audit } from "@/lib/audit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Very small in-memory rate limiter (per-process). Good enough for a single-node
// deployment; swap for a shared store when scaling horizontally.
const attempts = new Map<string, { count: number; ts: number }>();
const WINDOW = 15 * 60 * 1000;
const MAX = 8;

function limited(key: string): boolean {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now - rec.ts > WINDOW) {
    attempts.set(key, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter your email and password." }, { status: 400 });
  }

  const session = await authenticate(parsed.data.email, parsed.data.password);
  if (!session) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setSessionCookie(session);
  await audit({ adminId: session.sub, action: "LOGIN", entity: "Admin", entityId: session.sub });

  return NextResponse.json({ ok: true });
}
