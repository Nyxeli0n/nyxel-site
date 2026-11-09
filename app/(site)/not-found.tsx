import Link from "next/link";

export default function NotFound() {
  return (
    <div className="state-panel">
      <h2>ページが見つかりません</h2>
      <Link className="text-button" href="/">
        Aboutへ戻る
      </Link>
    </div>
  );
}
