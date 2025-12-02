"use client";

export default function EditImageButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        w-full py-2 rounded-xl border 
        transition font-medium
        ${disabled
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 active:bg-blue-200"
        }
      `}
    >
      ✏️ 이미지 편집하기
    </button>
  );
}
