"use client";

export default function FeedbackEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={5}
      placeholder={`수정사항을 편하게 작성해주세요. 그러면 AI가 알아서 정리해줄거에요 :)`}
      className="w-full p-4 rounded-2xl border border-gray-200 bg-white shadow-sm text-sm leading-relaxed 
             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
    />
  );
}
