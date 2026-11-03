"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "../lib/content-schema";

type Section = "books" | "movies" | "diary" | "bio" | "projects";
export default function ContentEditor({ initial, revision: initialRevision, local }: { initial: SiteContent; revision: string; local: boolean }) {
  const [data, setData] = useState(initial);
  const [revision, setRevision] = useState(initialRevision);
  const [section, setSection] = useState<Section>("books");
  const [selected, setSelected] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    function prevent(event: BeforeUnloadEvent) { if (dirty) event.preventDefault(); }
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  function change(next: SiteContent) { setData(next); setDirty(true); setMessage(""); }
  async function save() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data, revision }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setRevision(result.revision); setDirty(false); setMessage("保存しました");
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }
  function field(label: string, value: string, update: (value: string) => void, multiline = false, large = false) {
    return <label className="editor-field">{label}{multiline
      ? <textarea value={value} rows={large ? 18 : 4} onChange={e => update(e.target.value)} />
      : <input value={value} onChange={e => update(e.target.value)} />}</label>;
  }
  const media = section === "books" || section === "movies" ? data[section][selected] : undefined;
  function updateMedia(patch: Partial<NonNullable<typeof media>>) {
    if (section !== "books" && section !== "movies") return;
    change({ ...data, [section]: data[section].map((item, i) => i === selected ? { ...item, ...patch } : item) });
  }
  function add() {
    if (section === "bio") return;
    const item = section === "diary" ? { slug: `entry-${Date.now()}`, date: new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" }), title: "新しい日記", paragraphs: [] }
      : section === "projects" ? { name: "新しいプロジェクト", description: "", href: "/" } : { name: "新しい作品" };
    setSelected(data[section].length);
    change({ ...data, [section]: [...data[section], item] });
  }
  function remove() {
    if (section === "bio" || !confirm("この項目を削除しますか？保存するまでは公開内容に反映されません。")) return;
    change({ ...data, [section]: data[section].filter((_, i) => i !== selected) }); setSelected(0);
  }
  return <div className="editor">
    <div className="editor-toolbar">
      <nav aria-label="編集対象">{([['books','本'],['movies','映画'],['diary','日記'],['bio','About'],['projects','Projects']] as const).map(([key,label]) => <button key={key} aria-pressed={section === key} onClick={() => { setSection(key); setSelected(0); }}>{label}</button>)}</nav>
      <div className="editor-actions"><button className="editor-save" disabled={!dirty || busy} onClick={save}>{busy ? "保存中…" : "保存"}</button>
        {!local && <button disabled={busy || dirty} onClick={async () => { await fetch("/api/admin/session", {method:"DELETE"}); location.reload(); }}>ログアウト</button>}
      </div>
    </div>
    <p className="editor-status" role="status">{message || (dirty ? "未保存の変更があります" : local ? "手元のサイトに保存します" : "保存するとサイトに反映されます")}</p>
    <fieldset className="editor-layout" disabled={busy}>
      {section !== "bio" && <aside className="editor-list">
        <button onClick={add}>＋ 追加</button>
        {data[section].map((item, i) => <button key={i} aria-pressed={selected === i} onClick={() => setSelected(i)}>{"name" in item ? item.name : item.title}</button>)}
      </aside>}
      <div className="editor-fields">
        {section === "bio" && field("About", data.bio.join("\n\n"), value => change({ ...data, bio: value ? value.split(/\n\s*\n/) : [] }), true, true)}
        {media && <>
          {field("題名", media.name, name => updateMedia({ name }))}
          {field("著者・監督", media.creator ?? "", creator => updateMedia({ creator }))}
          {field("表紙・ポスターのURL", media.cover ?? "", cover => updateMedia({ cover: cover || undefined }))}
          {field("概要", media.summary ?? "", summary => updateMedia({ summary }), true)}
          {field("作品データ（1行にひとつ。「出版年: 2005」のように入力）", media.facts?.map(f => `${f.label}: ${f.value}`).join("\n") ?? "", value => updateMedia({ facts: value.split("\n").filter(Boolean).map(line => { const index = line.search(/[:：]/); return index < 0 ? { label: line, value: "" } : { label: line.slice(0,index).trim(), value: line.slice(index+1).trim() }; }) }), true)}
          <fieldset className="editor-links"><legend>リンク</legend>
            {(media.links ?? (media.href ? [{ label: "公式サイト", href: media.href }] : [])).map((link, i, links) => <div key={i}>
              <input aria-label={`リンク${i+1}の名前`} value={link.label} onChange={e => updateMedia({ links: links.map((l,j) => j === i ? {...l,label:e.target.value} : l) })} />
              <input aria-label={`リンク${i+1}のURL`} value={link.href} onChange={e => updateMedia({ links: links.map((l,j) => j === i ? {...l,href:e.target.value} : l) })} />
              <button aria-label={`リンク${i+1}を削除`} onClick={() => updateMedia({ links: links.filter((_,j) => j !== i) })}>×</button>
            </div>)}
            <button onClick={() => updateMedia({ links: [...(media.links ?? (media.href ? [{ label: "公式サイト", href: media.href }] : [])), { label: "Amazon", href: "https://www.amazon.co.jp/" }] })}>＋ リンク</button>
          </fieldset>
          {field("自分の感想", media.review ?? "", review => updateMedia({ review }), true, true)}
        </>}
        {section === "diary" && data.diary[selected] && (() => {
          const entry = data.diary[selected];
          const update = (patch: Partial<typeof entry>) => change({ ...data, diary: data.diary.map((d,i) => i === selected ? {...d,...patch} : d) });
          return <>{field("タイトル", entry.title, title => update({title}))}{field("日付（YYYY-MM-DD）", entry.date, date => update({date}))}{field("URLの末尾（半角英数字とハイフン）", entry.slug, slug => update({slug}))}{field("本文", entry.paragraphs.join("\n\n"), value => update({paragraphs:value.split(/\n\s*\n/)}), true, true)}</>;
        })()}
        {section === "projects" && data.projects[selected] && (() => {
          const project = data.projects[selected];
          const update = (patch: Partial<typeof project>) => change({ ...data, projects: data.projects.map((d,i) => i === selected ? {...d,...patch} : d) });
          return <>{field("名前",project.name,name=>update({name}))}{field("説明",project.description,description=>update({description}))}{field("URL",project.href,href=>update({href}))}</>;
        })()}
        {section !== "bio" && data[section][selected] && <button className="editor-delete" onClick={remove}>この項目を削除</button>}
      </div>
    </fieldset>
  </div>;
}
