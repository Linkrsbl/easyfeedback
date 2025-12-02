"use client";

export default function OutputTypeSelect({
  mode,
  setMode,
}: {
  mode: "messenger" | "email";
  setMode: (v: "messenger" | "email") => void;
}) {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
        
        {/* Messenger Button */}
        <button
          onClick={() => setMode("messenger")}
          className={`
            px-4 py-2 text-sm rounded-lg transition flex items-center gap-1
            ${mode === "messenger"
              ? "bg-white shadow-sm border border-gray-200"
              : "text-gray-600 hover:bg-gray-200"}
          `}
        >
          💬 <span>(짧게)</span>
        </button>

        {/* Email Button */}
        <button
          onClick={() => setMode("email")}
          className={`
            px-4 py-2 text-sm rounded-lg transition flex items-center gap-1
            ${mode === "email"
              ? "bg-white shadow-sm border border-gray-200"
              : "text-gray-600 hover:bg-gray-200"}
          `}
        >
          ✉️ <span>(길게)</span>
        </button>

      </div>
    </div>
  );
}
