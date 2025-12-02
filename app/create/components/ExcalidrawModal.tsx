// app/create/components/ExcalidrawModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Excalidraw,
  type ExcalidrawImperativeAPI,
  exportToBlob,
} from "@excalidraw/excalidraw";

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
  const excalidrawRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Excalidraw 준비 완료시 ref 저장
  const handleReady = (api: ExcalidrawImperativeAPI) => {
    excalidrawRef.current = api;
    setIsReady(true);
  };

  // 업로드된 이미지를 캔버스 가운데에 자동으로 배치 + 사이즈 맞추기
  useEffect(() => {
    const insertImageToCenter = async () => {
      if (!isOpen || !isReady || !image || !excalidrawRef.current) return;

      const api = excalidrawRef.current as any;

      // 캔버스 초기화
      api.updateScene({ elements: [] });

      // 이미지 로드
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = image;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("이미지 로드 실패"));
      });

      const appState: any = api.getAppState();
      const canvasWidth = appState.width ?? 800;
      const canvasHeight = appState.height ?? 600;
      const zoom = appState.zoom?.value ?? 1;

      // 캔버스의 80% 안에 들어오도록 스케일링
      const maxW = canvasWidth * 0.8;
      const maxH = canvasHeight * 0.8;

      let w = img.width;
      let h = img.height;
      const ratio = Math.min(maxW / w, maxH / h, 1);
      w *= ratio;
      h *= ratio;

      // 중앙 좌표 계산
      const centerX =
        (canvasWidth / 2 - w / 2) / zoom + (appState.scrollX ?? 0);
      const centerY =
        (canvasHeight / 2 - h / 2) / zoom + (appState.scrollY ?? 0);

      const fileId = `image-${Date.now()}`;

      // 파일 등록
      api.addFiles({
        [fileId]: {
          id: fileId,
          dataURL: image,
          mimeType: "image/png",
          created: Date.now(),
          lastRetrieved: Date.now(),
        },
      });

      // 이미지 엘리먼트 추가
      api.updateScene({
        elements: [
          ...(api.getSceneElements() || []),
          {
            id: fileId,
            type: "image",
            x: centerX,
            y: centerY,
            width: w,
            height: h,
            angle: 0,
            strokeColor: "transparent",
            backgroundColor: "transparent",
            fillStyle: "solid",
            strokeWidth: 1,
            strokeStyle: "solid",
            roughness: 0,
            opacity: 100,
            groupIds: [],
            seed: Date.now(),
            version: 1,
            versionNonce: 1,
            isDeleted: false,
            boundElements: null,
            updated: Date.now(),
            link: null,
            locked: false,
            status: "pending",
            fileId,
            scale: [1, 1],
          } as any,
        ],
      });

      // 히스토리 초기화
      api.history.clear();
    };

    insertImageToCenter().catch((e) => {
      console.error(e);
    });
  }, [isOpen, isReady, image]);

  // "적용하기" → Blob으로 내보내서 부모에게 전달
  const handleApply = async () => {
    const api = excalidrawRef.current as any;
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

  // 타입 에러 방지를 위해 any로 선언
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-[min(1000px,100vw-40px)] h-[min(700px,100vh-80px)] flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-sm font-semibold">이미지 편집</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black px-2 py-1 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* 캔버스 영역 */}
        <div className="flex-1 min-h-0">
          <Excalidraw
            onReady={handleReady}
            initialData={initialData}
            UIOptions={uiOptions}
          />
        </div>

        {/* 푸터 버튼 */}
        <div className="flex justify-end gap-2 border-t px-4 py-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
