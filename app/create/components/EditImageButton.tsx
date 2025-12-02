"use client";

type EditImageButtonProps = {
  // 선택값으로 변경 (옵셔널)
  disabled?: boolean;
  onClick: () => void;
};

export default function EditImageButton({
  disabled = false,
  onClick,
}: EditImageButtonProps) {
  return (
    <div className="flex justify-end mt-2">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`
          inline-flex items-center gap-1.5
          rounded-lg border px-2.5 py-1.5 text-xs font-medium
          transition
          ${
            disabled
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              : "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
          }
        `}
      >
        <span className="text-sm">✏️</span>
        이미지 위에 그리기
      </button>
    </div>
  );
}
