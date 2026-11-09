"use client";

export default function ErrorPage({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <div className="state-panel" role="alert">
      <h2>読み込めませんでした</h2>
      <p className="empty-state">時間をおいて、もう一度お試しください。</p>
      <button className="text-button" onClick={() => retry()}>
        もう一度読み込む
      </button>
    </div>
  );
}
