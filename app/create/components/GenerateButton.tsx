"use client";

import { useEffect, useState } from "react";

export default function GenerateButton({
  onGenerate,
  loading,
  loadingMessage,
}: {
  onGenerate: () => void;
  loading: boolean;
  loadingMessage: string;
}) {
  const [visibleMessage, setVisibleMessage] = useState(loadingMessage);
  const [fade, setFade] = useState<"in" | "out">("in");

  // 처음 로딩 시작 시에도 반영되도록 보정
  useEffect(() => {
    if (loading) {
      setVisibleMessage(loadingMessage);
    }
  }, [loading]);

  // 문구 변경 애니메이션
  useEffect(() => {
    if (!loading) return;

    setFade("out");

    const timer = setTimeout(() => {
      setVisibleMessage(loadingMessage);
      setFade("in");
    }, 200);

    return () => clearTimeout(timer);
  }, [loadingMessage, loading]);

  return (
    <div className="w-full">

      {/* 기본 버튼 */}
      {!loading && (
        <button
          onClick={onGenerate}
          className="
            w-full h-[52px] rounded-xl 
            bg-blue-600 text-white font-medium 
            hover:bg-blue-700 active:bg-blue-800 
            transition
          "
        >
          생성해줘
        </button>
      )}

      {/* 로딩 버튼 */}
      {loading && (
        <div
          className="
            w-full h-[52px] rounded-xl 
            bg-gray-100 border border-gray-300 
            text-gray-700 font-medium 
            flex justify-center items-center
            overflow-hidden
          "
        >
          <span
            className={`
              transition-all duration-[400ms] ease-out
              ${fade === "in" 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 -translate-y-2"}
              block
            `}
          >
            {visibleMessage}
          </span>
        </div>
      )}
    </div>
  );
}
