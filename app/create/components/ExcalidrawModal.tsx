"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  exportToBlob,
  type ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw";

// TS에서 ref 관련 오류가 나지 않도록 any로 캐스팅
// (실제 런타임에는 문제 없음)
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
) as any;

type ExcalidrawModalProps = {
  isOpen: boolean;
  onClose: () => void;
  baseImage: string | null;      // 업로드된 원본(or 이미 편집된) 이미지 dataURL
  onApply: (dataUrl: string) => void; // 최종 편집 결과 dataURL
};

export default function ExcalidrawModal({
  isOpen,
  onClose,
  baseImage,
  onApply,
}: ExcalidrawModalProps) {
  const excalRef = useRef<ExcalidrawImperativeAPI | null>(null);

  // 배경 이미지 세팅 + 자동 스케일링
  useEffect(() => {
    if (!isOpen) return;
    if (!baseImage) return;

    const img = new Image();
    img.src = baseImage;

    img.onload = () => {
      if (!excalRef.current) return;

      const maxWidth = 1000;
      const maxHeight = 700;
      const scale = Math.min(
        maxWidth / img.width,
        maxHeight / img.height,
        1
      );

      // 타입 정의에 아직 없는 필드가 있어 any 캐스팅으로 우회
      const appState = {
        ...(excalRef.current!.getAppState() as any),
        viewBackgroundImage: true,
        backgroundImage: {
          id: "bg-image",
          dataURL: baseImage,
          x: 0,
          y: 0,
          scale,
        },
      };

      (excalRef.current as any).updateScene({
        appState,
      });
    };
  }, [isOpen, baseImage]);

  // Blob → dataURL 변환 유틸
  const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

  // "적용하기" 클릭 시 → PNG export → dataURL로 상위에 전달
  const handleApply = async () => {
    if (!excalRef.current) return;

    const elements = excalRef.current.getSceneElements();
    const appState = excalRef.current.getAppState();
    const files = excalRef.current.getFiles();

    const blob = await exportToBlob({
      elements,
      appState,
      files,
      mimeType: "image/png",
      quality: 1,
    });

    const dataUrl = await blobToDataUrl(blob);
    onApply(dataUrl);
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 bg-black/40 backdrop-blur-sm
        flex items-center justify-center z-50
      "
    >
      <div
        className="
          bg-white w-full max-w-3xl h-[80vh]
          rounded-xl shadow-xl overflow-hidden
          flex flex-col
        "
      >
        {/* Header */}
        <div
          className="
            px-4 py-3 border-b border-gray-200
            flex justify-between items-center
          "
        >
          <h2 className="text-base font-semibold">이미지 편집</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Excalidraw Canvas */}
        <div className="flex-1 relative">
          <Excalidraw
            ref={excalRef}
            initialData={{}}
            theme="light"
            langCode="ko-KR"
            UIOptions={{
              // 불필요한 버튼 일부 숨기기 (필요 시 추가 조절 가능)
              canvasActions: {
                saveToActiveFile: false,
                loadScene: false,
                toggleTheme: false,
              },
            }}
          />
        </div>

        {/* Footer */}
        <div
          className="
            px-4 py-3 border-t border-gray-200
            flex justify-end gap-3
          "
        >
          <button
            onClick={onClose}
            className="
              px-4 py-2 text-sm rounded-lg
              bg-gray-100 hover:bg-gray-200 transition
            "
          >
            취소
          </button>

          <button
            onClick={handleApply}
            className="
              px-4 py-2 text-sm rounded-lg text-white
              bg-blue-600 hover:bg-blue-700 transition
            "
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
