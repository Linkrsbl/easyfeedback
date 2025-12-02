// app/create/components/ExcalidrawModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";

// 👉 타입 꼬임 방지를 위해 any 래퍼 사용
const ExcalidrawAny: any = Excalidraw;

type ExcalidrawModalProps = {
  isOpen: boolean;
  onClose: () => void;
  image: string | null;
  onSave: (blob: Blob) => void;
};

export default function ExcalidrawModal({
  isOpen,
  onClose,
  image,
  onSave,
}: ExcalidrawModalProps) {
  const excalidrawRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  /** Excalidraw 준비 완료 → ref 저장 */
  const handleReady = (api: any) => {
    excalidrawRef.current = api;
    setIsReady(true);
  };

  /** 이미지 중앙 배치 + 자동 스케일링 */
  useEffect(() => {
    if (!isOpen || !isReady || !image || !excalidrawRef.current) return;

    const api = excalidrawRef.current;

    const insertImage = async () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = image;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("이미지 로드 실패"));
      });

      // 기존 요소 제거
      api.updateScene({ elements: [] });

      const appState = api.getAppState();
      const canvasW = appState.width ?? 900;
      const canvasH = appState.height ?? 600;

      const maxW = canvasW * 0.8;
      const maxH = canvasH * 0.8;

      let w = img.width;
      let h = img.height;
      const ratio = Math.min(maxW / w, maxH / h, 1);

      w *= ratio;
      h *= ratio;

      const x = canvasW / 2 - w / 2;
      const y = canvasH / 2 - h / 2;

      const fileId = `image-${Date.now()}`;

      api.addFiles({
        [fileId]: {
          id: fileId,
          dataURL: image,
          mimeType: "image/png",
          created: Date.now(),
          lastRetrieved: Date.now(),
        },
      });

      api.updateScene({
        elements: [
          {
            id: fileId,
            type: "image",
            x,
            y,
            width: w,
            height: h,
            angle: 0,
            strokeColor: "transparent",
            backgroundColor: "transparent",
            seed: Math.random() * 100000,
            version: 1,
            versionNonce: 1,
            isDeleted: false,
            status: "pending",
            locked: false,
            fileId,
            scale: [1, 1],
            groupIds: [],
            opacity: 100,
            roundness: null,
            boundElements: null,
            link: null,
          } as any,
        ],
      });

      // 뷰 맞추기(지원 안 하면 무시됨)
      if (api.zoomToFit) {
        api.zoomToFit(null, 70);
      }

      if (api.history?.clear) {
        api.history.clear();
      }
    };

    insertImage().catch(console.error);
  }, [isOpen, isReady, image]);

  /** 적용하기 → PNG Blob으로 export */
  const handleApply = async () => {
    const api = excalidrawRef.current;
    if (!api) return;

    const elements = api.getSceneElements();
    const files = api.getFiles ? api.getFiles() : undefined;

    if (!elements || elements.length === 0) {
      onClose();
      return;
    }

    const blob = await exportToBlob({
      elements,
      files,
      appState: {
        viewBackgroundColor: "#ffffff",
      } as any,
      mimeType: "image/png",
      quality: 1,
    });

    onSave(blob);
    onClose();
  };

  if (!isOpen) return null;

  const initialData: any = {
    elements: [],
    appState: {
      viewBackgroundColor: "#ffffff",
    },
  };

  const uiOptions: any = {
    canvasActions: {
      changeViewBackgroundColor: false,
      clearCanvas: false,
      export: false,
      loadScene: false,
      saveToActiveFile: false,
      toggleTheme: false,
    },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">이미지 편집</h2>
          <button
            onClick={onClose}
            className="text-2xl px-2 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* 캔버스 */}
        <div className="flex-1 min-h-0">
          <ExcalidrawAny
            onReady={handleReady}
            initialData={initialData}
            UIOptions={uiOptions}
          />
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t flex justify-end gap-2">
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
