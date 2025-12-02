"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  image: string | null;
  onSave: (blob: Blob) => void;
}

export default function ExcalidrawModal({ isOpen, onClose, image, onSave }: Props) {
  const excalidrawAPI = useRef<any>(null);
  const [ready, setReady] = useState(false);

  // 배경 이미지 적용
  useEffect(() => {
    if (!ready) return;
    if (!excalidrawAPI.current) return;
    if (!image) return;

    excalidrawAPI.current.updateScene({
      appState: {
        viewBackgroundColor: "#ffffff",
      },
      elements: [],
      // backgroundImage는 elements 대신 appState로 설정하는 방식 권장됨
    });

    // Excalidraw는 backgroundImage를 scene에 직접 넣는 API 제공X
    // 대신 이미지 투명 요소로 그려 넣는 방식 사용
    excalidrawAPI.current.addFiles([image]);
  }, [ready, image]);

  // PNG Export
  const handleApply = async () => {
    if (!excalidrawAPI.current) return;

    const blob = await excalidrawAPI.current.getFiles().image?.blob
    || await excalidrawAPI.current.getSceneAsPng({
      includeBackground: true,
    });

    if (blob) onSave(blob);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[95%] max-w-4xl h-[90vh] shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">이미지 편집</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 min-h-0">
          <Excalidraw
            excalidrawAPI={(api: any) => {
              excalidrawAPI.current = api;
              setReady(true);
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            취소
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
