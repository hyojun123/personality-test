import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "동물 성격 테스트",
  description: "30개의 질문을 통해 당신의 성격을 20가지 동물 유형 중 하나로 분석합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
