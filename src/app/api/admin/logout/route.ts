import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth";
import { audit } from "@/lib/audit";

export async function POST() {
  const session = await getSession();
  await clearSessionCookie();
  if (session) {
    await audit({ adminId: session.sub, action: "LOGOUT", entity: "Admin", entityId: session.sub });
  }
  return NextResponse.json({ ok: true });
}
