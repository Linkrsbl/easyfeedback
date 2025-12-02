// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Feedback Generator",
  description: "Design feedback assistant",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="light">
      <body className="bg-white text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
