import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lifeniche-calc.local"),
  title: {
    default: "생활틈새 계산기 | 한국 생활·금융 계산기 모음",
    template: "%s | 생활틈새 계산기"
  },
  description: "검색은 많은데 제대로 된 계산기가 없는 것들만 모았습니다. 한국인에게 필요한 틈새 생활·금융 계산기 모음.",
  applicationName: "생활틈새 계산기",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "생활틈새 계산기",
    title: "생활틈새 계산기",
    description: "한국인을 위한 틈새 생활·금융 계산기 모음",
    images: ["/icon.svg"]
  },
  appleWebApp: {
    capable: true,
    title: "생활틈새 계산기",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#172033",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <PwaRegister />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
