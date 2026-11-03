import "server-only";
import { cookies } from "next/headers";
import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { localEditor } from "./content-store";

const name = "nyxel-editor";
function signature(value: string) { return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(value).digest("hex"); }
export function sameSecret(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}
export async function isAdmin() {
  if (localEditor()) return true;
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) return false;
  const value = (await cookies()).get(name)?.value;
  if (!value) return false;
  const [expires, sig] = value.split(".");
  return Number(expires) > Date.now() && !!sig && sameSecret(signature(expires), sig);
}
export async function setSession() {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  (await cookies()).set(name, `${expires}.${signature(expires)}`, { httpOnly: true, secure: !!process.env.VERCEL, sameSite: "strict", path: "/", maxAge: 28800 });
}
export async function clearSession() { (await cookies()).delete(name); }
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !!origin && new URL(origin).host === request.headers.get("host");
}
