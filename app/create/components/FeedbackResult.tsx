"use client";

export default function FeedbackResult({
  result,
  onCopy,
  onCopySuccess,
  onReset,
}: {
  result: string | null;
  onCopy: () => void;
  onCopySuccess: () => void;
  onReset: () => void;
}) {
  if (!result) return null;

  const handleCopy = () => {
    onCopy();
    onCopySuccess(); // ← 페이지에 신호 보내기
  };

  return (
    <div className="p-4 rounded-xl border border-gray-300 bg-gray-50 space-y-3">
      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
        {result}
      </pre>

      <div className="flex gap-2 justify-end">
        <button
          onClick={handleCopy}
          className="
            px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700 active:bg-blue-800 transition
          "
        >
          복사하기
        </button>

        <button
          onClick={onReset}
          className="
            px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium
            hover:bg-gray-300 active:bg-gray-400 transition
          "
        >
          다시 생성하기
        </button>
      </div>
    </div>
  );
}
