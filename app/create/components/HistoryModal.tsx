"use client";

import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLoadRecord: (record: any) => void;
};

export default function HistoryModal({ isOpen, onClose, onLoadRecord }: Props) {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = JSON.parse(localStorage.getItem("feedback_history") || "[]");
      setRecords(stored);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/30 backdrop-blur-sm
        animate-fadeInModal
      "
      onClick={onClose}
    >
      <div
        className="
          bg-white rounded-2xl shadow-xl border border-gray-200
          w-full max-w-md max-h-[80vh]
          overflow-hidden flex flex-col
          animate-slideUpModal
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
          <span className="font-semibold text-gray-800 text-sm">히스토리</span>
          <button
            onClick={onClose}
            className="
              text-gray-500 hover:text-gray-700
              px-2 py-1 rounded-lg
              transition
            "
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-4 py-4 space-y-4">
          {records.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-10">
              저장된 히스토리가 없습니다.
            </p>
          ) : (
            records.map((rec: any) => (
              <button
                key={rec.id}
                onClick={() => onLoadRecord(rec)}
                className="
                  w-full flex items-center gap-3
                  p-3 rounded-xl border border-gray-200 bg-white shadow-sm
                  hover:bg-gray-50 active:bg-gray-100 transition
                  text-left
                "
              >
                {/* Thumbnail */}
                {rec.image ? (
                  <img
                    src={rec.image}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div
                    className="
                      w-16 h-16 flex items-center justify-center
                      rounded-lg bg-gray-100 text-gray-400 border border-gray-200
                    "
                  >
                    📝
                  </div>
                )}

                {/* Text */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {rec.raw.slice(0, 40) || "내용 없음"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(rec.createdAt).toLocaleString()}
                  </span>
                </div>

                <span className="text-gray-400">›</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Tailwind 기반 애니메이션 정의 */}
      <style>
        {`
          .animate-fadeInModal {
            animation: fadeInModal 0.18s ease-out forwards;
          }
          @keyframes fadeInModal {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .animate-slideUpModal {
            animation: slideUpModal 0.25s ease-out forwards;
          }
          @keyframes slideUpModal {
            from { transform: translateY(12px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
