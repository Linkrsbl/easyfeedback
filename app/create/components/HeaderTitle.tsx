"use client";

import { useState, useEffect } from "react";

const texts = [
  "개떡같이 말해도",
  "찰떡같이 알아듣는",
  "디자인 피드백 만들기",
];

export default function HeaderTitle() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<"typing" | "waiting" | "deleting">("typing");

  // 타이핑 속도 & 딜레이 설정
  const typingSpeed = 65;      // 글자 나타나는 속도
  const deletingSpeed = 50;    // 글자 지워지는 속도
  const displayDuration = 2000; // 문구 유지 시간

  useEffect(() => {
    const current = texts[index];

    if (phase === "typing") {
      if (displayText.length < current.length) {
        const timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length + 1));
        }, typingSpeed);

        return () => clearTimeout(timeout);
      } else {
        setPhase("waiting");
      }
    }

    if (phase === "waiting") {
      const timeout = setTimeout(() => {
        setPhase("deleting");
      }, displayDuration);

      return () => clearTimeout(timeout);
    }

    if (phase === "deleting") {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length - 1));
        }, deletingSpeed);

        return () => clearTimeout(timeout);
      } else {
        setIndex((prev) => (prev + 1) % texts.length);
        setPhase("typing");
      }
    }
  }, [displayText, phase, index]);

  return (
    <h1
      className={
        "text-xl font-semibold tracking-tight text-gray-900 min-h-[32px] select-none"
      }
    >
      <span className="border-r-2 border-gray-400 pr-1 animate-blink">
        {displayText}
      </span>

      <style jsx>{`
        .animate-blink {
          animation: 0.8s steps(2, end) infinite blinkCursor;
        }
        @keyframes blinkCursor {
          0%, 100% {
            border-color: transparent;
          }
          50% {
            border-color: #555;
          }
        }
      `}</style>
    </h1>
  );
}
