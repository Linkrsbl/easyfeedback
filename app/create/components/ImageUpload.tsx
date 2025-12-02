"use client";

import { useState, useCallback } from "react";
import Spinner from "./Spinner";

type Props = {
  image: string | null;
  setImage: (v: string | null) => void;
};

export default function ImageUpload({ image, setImage }: Props) {
  const [uploading, setUploading] = useState(false);

  // 이미지 리사이즈 (최대 너비 1280px)
  const resizeImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;

      img.onload = () => {
        const MAX_WIDTH = 1280;

        // 이미 충분히 작으면 그대로 사용
        if (img.width <= MAX_WIDTH) {
          return resolve(reader.result as string);
        }

        const ratio = MAX_WIDTH / img.width;
        const canvas = document.createElement("canvas");
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * ratio;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas context error");

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.85);
        resolve(resizedBase64);
      };

      img.onerror = reject;

      reader.readAsDataURL(file);
    });
  }, []);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const resized = await resizeImage(file);
      setImage(resized);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onClick={() => {
        if (!uploading) {
          const input = document.getElementById("fileInput") as HTMLInputElement | null;
          input?.click();
        }
      }}
      className="
        rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100
        transition cursor-pointer p-8 text-center shadow-sm
      "
    >
      {uploading ? (
        <div className="flex justify-center py-10">
          <Spinner size={32} />
        </div>
      ) : image ? (
        <img
          src={image}
          className="w-full rounded-2xl shadow-sm object-cover"
          alt="uploaded"
        />
      ) : (
        <div className="flex flex-col items-center text-gray-500 space-y-3">
          <span className="text-3xl">📤</span>
          <div className="text-sm leading-relaxed text-center">
            <div>캡처 이미지를 업로드하세요</div>
            <div className="text-xs text-gray-400 mt-1">
              JPEG/PNG · 최대 5MB · 큰 이미지는 자동으로 축소됩니다
            </div>
          </div>
        </div>
      )}

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void handleFile(file);
          }
        }}
      />
    </div>
  );
}
