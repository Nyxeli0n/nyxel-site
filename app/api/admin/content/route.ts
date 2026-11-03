import { NextResponse } from "next/server";
import { BlobPreconditionFailedError } from "@vercel/blob";
import { isAdmin, sameOrigin } from "../../../lib/admin-auth";
import { contentSchema } from "../../../lib/content-schema";
import { saveContent } from "../../../lib/content-store";

export async function PUT(request: Request) {
  if (!sameOrigin(request) || !await isAdmin()) return NextResponse.json({ error: "ログインしてください" }, { status: 403 });
  const bodyText = await request.text();
  if (Buffer.byteLength(bodyText) > 2000000) return NextResponse.json({ error: "内容が大きすぎます" }, { status: 413 });
  let body;
  try { body = JSON.parse(bodyText); } catch { return NextResponse.json({ error: "保存内容を確認してください" }, { status: 400 }); }
  const parsed = contentSchema.safeParse(body.data);
  if (!parsed.success || typeof body.revision !== "string") return NextResponse.json({ error: parsed.success ? "再読み込みしてください" : parsed.error.issues[0].message }, { status: 400 });
  try {
    return NextResponse.json({ revision: await saveContent(parsed.data, body.revision) });
  } catch (error) {
    const conflict = (error as Error).message === "CONFLICT" || error instanceof BlobPreconditionFailedError;
    return NextResponse.json({ error: conflict ? "別の画面で更新されています。編集内容を控えてから再読み込みしてください。" : "保存できませんでした。保存先の設定を確認してください。" }, { status: conflict ? 409 : 503 });
  }
}
