import { NextResponse } from "next/server";
import { sameOrigin, sameSecret, setSession, clearSession } from "../../../lib/admin-auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "アクセスできません" }, { status: 403 });
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) return NextResponse.json({ error: "本番のログイン設定が必要です" }, { status: 503 });
  const body = await request.json().catch(() => null);
  if (typeof body?.password !== "string" || body.password.length > 1000 || !sameSecret(body.password, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "パスワードが違います" }, { status: 401 });
  }
  await setSession();
  return NextResponse.json({ ok: true });
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({}, { status: 403 });
  await clearSession();
  return NextResponse.json({ ok: true });
}
