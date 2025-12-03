// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import "@excalidraw/excalidraw/index.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "말만 하세요. 찰떡같이 정리된 피드백이 완성됩니다.",
  description:
    "이미지와 간단한 메모만 올리면, 디자이너가 바로 이해할 수 있는 명확한 피드백 문장으로 자동 변환해드립니다.",
  openGraph: {
    title: "말만 하세요. 찰떡같이 정리된 피드백이 완성됩니다.",
    description:
      "이미지와 메모만 올리면 명확한 디자인 피드백으로 자동 변환하는 AI 도구.",
    type: "website",
    locale: "ko_KR",
    siteName: "Feedback AI",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "디자인 피드백 생성 미리보기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "말만 하세요. 찰떡같이 정리된 피드백이 완성됩니다.",
    description:
      "디자이너가 바로 이해할 수 있는 구조화된 피드백을 자동으로 만들어주는 서비스.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="light">
      <body className="bg-white text-black min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
