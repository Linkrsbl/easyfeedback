// app/create/components/ExcalidrawModal.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";

// 타입 충돌 피하기용 any 래퍼
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
  // Excalidraw Imperative API 저장용
  const excalidrawApiRef = useRef<any>(null);

  /**
   * 업로드된 이미지를 캔버스에 넣어서
   * 중앙 배치 + 자동 스케일링
   */
  const insertImageToScene = async (api: any, imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("이미지 로드 실패"));
    });

    // 기존 요소 제거
    api.updateScene({ elements: [] });

    // 캔버스 대략 크기
    const appState = api.getAppState ? api.getAppState() : {};
    const canvasW = appState.width ?? 900;
    const canvasH = appState.height ?? 600;

    const maxW = canvasW * 0.8;
    const maxH = canvasH * 0.8;

    let w = img.width;
    let h = img.height;
    const ratio = Math.min(maxW / w, maxH / h, 1);

    w *= ratio;
    h *= ratio;

    // 중앙 배치
    const x = canvasW / 2 - w / 2;
    const y = canvasH / 2 - h / 2;

    const fileId = `image-${Date.now()}`;

    // 파일 등록
    api.addFiles?.({
      [fileId]: {
        id: fileId,
        dataURL: imageUrl,
        mimeType: "image/png",
        created: Date.now(),
        lastRetrieved: Date.now(),
      },
    });

    const element = {
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
    } as any;

    api.updateScene({
      elements: [element],
    });

    // 가능하면 히스토리 초기화
    api.history?.clear?.();
  };

  /**
   * 모달이 열리고 image가 있을 때
   * (API가 이미 준비된 경우) 이미지 삽입
   */
  useEffect(() => {
    if (!isOpen || !image) return;
    const api = excalidrawApiRef.current;
    if (!api) return;

    insertImageToScene(api, image).catch((err) =>
      console.error("이미지 삽입 오류:", err)
    );
  }, [isOpen, image]);

  /**
   * 적용하기 → 현재 캔버스를 PNG Blob으로 export 해서 부모에 전달
   */
  const handleApply = async () => {
    const api = excalidrawApiRef.current;
    if (!api) {
      onClose();
      return;
    }

    const elements = api.getSceneElements ? api.getSceneElements() : [];
    const files = api.getFiles ? api.getFiles() : undefined;

    if (!elements || elements.length === 0) {
      onClose();
      return;
    }

    try {
      const appState = api.getAppState ? api.getAppState() : {};

      const blob = await exportToBlob({
        elements,
        files,
        appState: {
          ...appState,
          viewBackgroundColor: "#ffffff",
        } as any,
        mimeType: "image/png",
        quality: 1,
      });

      onSave(blob); // page.tsx에서 넘어온 handleSaveEditedImage 실행
      onClose();
    } catch (err) {
      console.error("exportToBlob 실패:", err);
      alert("이미지 내보내기에 실패했습니다. 다시 시도해주세요.");
    }
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
            initialData={initialData}
            UIOptions={uiOptions}
            // ✅ 여기서 Excalidraw API를 받아서 ref에 저장
            excalidrawAPI={(api: any) => {
              excalidrawApiRef.current = api;

              // API가 준비된 시점에 이미지와 모달이 이미 열려있다면 바로 삽입
              if (isOpen && image) {
                insertImageToScene(api, image).catch((err) =>
                  console.error("이미지 삽입 오류:", err)
                );
              }
            }}
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
