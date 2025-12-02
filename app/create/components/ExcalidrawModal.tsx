"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Excalidraw는 클라이언트 전용 + 동적 로딩
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

type ExcalidrawModalProps = {
  isOpen: boolean;
  onClose: () => void;
  image?: string | null;
  onSave: (blob: Blob) => void;
};

export default function ExcalidrawModal({
  isOpen,
  onClose,
  image,
  onSave,
}: ExcalidrawModalProps) {
  const [api, setApi] = useState<any>(null);

  // 업로드된 이미지를 배경으로 설정
  useEffect(() => {
    if (!api || !image) return;

    api.updateScene({
      appState: {
        viewBackgroundColor: "#ffffff",
      },
      elements: [],
      // 필요하다면 여기서 backgroundImage 관련 추가 설정 가능
    });
  }, [api, image]);

  if (!isOpen) return null;

  const handleApply = async () => {
    if (!api) return;

    // Excalidraw의 PNG export 사용
    const blob: Blob = await api.getSceneAsPng({
      mimeType: "image/png",
      quality: 1,
      backgroundColor: "#ffffff",
    });

    onSave(blob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="bg-white w-full max-w-3xl h-[80vh] rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">이미지 편집</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 min-h-0">
          <Excalidraw
            // ✅ 여기! onReady가 아니라 excalidrawAPI 콜백
            excalidrawAPI={(apiObj: any) => {
              setApi(apiObj);
            }}
            initialData={{
              elements: [],
              appState: {
                viewBackgroundColor: "#ffffff",
              },
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
