"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function EditorLogin() {
  const router = useRouter();
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  return <form className="editor-login" onSubmit={async event => {
    event.preventDefault(); setBusy(true); setError("");
    const password = new FormData(event.currentTarget).get("password");
    try {
      const response = await fetch("/api/admin/session", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password}) });
      if (!response.ok) throw new Error((await response.json()).error);
      router.refresh();
    } catch (error) { setError((error as Error).message); }
    finally { setBusy(false); }
  }}>
    <label className="editor-field">パスワード<input name="password" type="password" required autoComplete="current-password" /></label>
    <button disabled={busy}>{busy ? "確認中…" : "ログイン"}</button>
    <p role="status">{error}</p>
  </form>;
}
