"use client";

import { useState, useEffect } from "react";

import ImageUpload from "./components/ImageUpload";
import FeedbackEditor from "./components/FeedbackEditor";
import OutputTypeSelect from "./components/OutputTypeSelect";
import GenerateButton from "./components/GenerateButton";
import FeedbackResult from "./components/FeedbackResult";
import HistoryModal from "./components/HistoryModal";

export default function CreatePage() {
  const [image, setImage] = useState<string | null>(null);
  const [feedbackRaw, setFeedbackRaw] = useState("");
  const [mode, setMode] = useState<"messenger" | "email">("messenger");

  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [lastStageStart, setLastStageStart] = useState<number | null>(null);

  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const [isHistoryOpen, setHistoryOpen] = useState(false);

  // 🔥 토스트 상태
  const [toast, setToast] = useState(false);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 1600);
  };

  // 로딩 메시지
  const loadingMessages = [
    "이미지를 분석하는 중…",
    "핵심 내용을 정리하는 중…",
    "결과를 정돈하는 중…",
  ];

  useEffect(() => {
    if (!loading) return;

    setLoadingStage(0);
    setLastStageStart(null);

    const stageDurations = [1500, 1500, 1000];
    let stageIndex = 0;
    let timer: any;

    const step = () => {
      timer = setTimeout(() => {
        stageIndex += 1;

        if (stageIndex <= 2) {
          setLoadingStage(stageIndex);
          if (stageIndex === 2) {
            setLastStageStart(Date.now());
          }
          step();
        }
      }, stageDurations[stageIndex]);
    };

    step();
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!aiResponse) return;
    if (loadingStage < 2) return;
    if (!lastStageStart) return;

    const elapsed = Date.now() - lastStageStart;
    const remain = Math.max(0, 1000 - elapsed);

    const timer = setTimeout(() => {
      setResult(aiResponse);
      setLoading(false);
      setAiResponse(null);
    }, remain);

    return () => clearTimeout(timer);
  }, [aiResponse, loadingStage, lastStageStart]);

  const handleGenerate = async () => {
    if (!feedbackRaw.trim()) {
      return alert("피드백 텍스트를 입력해주세요.");
    }

    setLoading(true);
    setResult(null);
    setAiResponse(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          image,
          feedback_raw: feedbackRaw,
          mode,
        }),
      });

      const data = await res.json();
      setAiResponse(data.result);

      saveHistory({
        id: crypto.randomUUID(),
        image,
        raw: feedbackRaw,
        result: data.result,
        mode,
        createdAt: Date.now(),
      });
    } catch (e) {
      console.error(e);
      alert("생성 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const saveHistory = (record: any) => {
    const old = JSON.parse(localStorage.getItem("feedback_history") || "[]");
    const newArr = [record, ...old].slice(0, 10);
    localStorage.setItem("feedback_history", JSON.stringify(newArr));
  };

  const handleLoadRecord = (record: any) => {
    setImage(record.image);
    setFeedbackRaw(record.raw);
    setMode(record.mode);
    setResult(record.result);
    setHistoryOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6 bg-white text-black">

      {/* ---------------- Header ---------------- */}
      <header
        className="
          sticky top-0 z-40
          backdrop-blur-md bg-white/80
          border-b border-gray-200
          px-4 py-3 flex items-center justify-between
        "
      >
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">
          Feedback Generator
        </h1>

        <button
          onClick={() => setHistoryOpen(true)}
          className="
            flex items-center gap-1.5 text-sm font-medium
            text-blue-600 hover:text-blue-700
            hover:bg-blue-50 active:bg-blue-100
            px-2.5 py-1.5 rounded-lg transition
          "
        >
          <span className="text-base">🕘</span>
          히스토리
        </button>
      </header>

      {/* ---------------- Card ---------------- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">

        <ImageUpload image={image} setImage={setImage} />

        <FeedbackEditor value={feedbackRaw} onChange={setFeedbackRaw} />

        <OutputTypeSelect mode={mode} setMode={setMode} />

        <GenerateButton
          onGenerate={handleGenerate}
          loading={loading}
          loadingMessage={loadingMessages[loadingStage]}
        />

        <FeedbackResult
          result={result}
          onCopy={() => navigator.clipboard.writeText(result || "")}
          onCopySuccess={showToast}     // 🔥 여기서 토스트 작동!
          onReset={() => setResult(null)}
        />

      </div>

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setHistoryOpen(false)}
        onLoadRecord={handleLoadRecord}
      />

      {/* ---------------- Toast ---------------- */}
      {toast && (
        <div
          className="
            fixed bottom-10 left-1/2 -translate-x-1/2
            bg-black/80 text-white px-4 py-2
            rounded-xl shadow-lg text-sm
            animate-fade-in-up
            z-50
          "
        >
          ✓ 복사되었습니다
        </div>
      )}
    </div>
  );
}
