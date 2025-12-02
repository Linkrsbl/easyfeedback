"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

const exportToBlob = dynamic(
  async () => (await import("@excalidraw/excalidraw")).exportToBlob,
  { ssr: false }
);

export interface ExcalidrawModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (blob: Blob) => void;
}

export default function ExcalidrawModal({
  open,
  onClose,
  onSave,
}: ExcalidrawModalProps) {
  // 공식 문서: ref는 "any"가 가장 호환됨 (타입 안정성 유지됨)
  const excalidrawRef = useRef<any>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[90vw] h-[80vh] p-4 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <div className="w-full h-full">
          <Excalidraw
            ref={excalidrawRef}
            initialData={{
              elements: [],
              appState: { viewBackgroundColor: "#ffffff" },
            }}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            취소
          </button>

          <button
            onClick={async () => {
              if (!excalidrawRef.current) return;

              const scene = excalidrawRef.current.getSceneElements();

              const exporter = await exportToBlob;
              const blob = await exporter({
                elements: scene,
                mimeType: "image/png",
              });

              onSave(blob);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
