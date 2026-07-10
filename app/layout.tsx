import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "오늘여름",
  description:
    "도시 안에서 여름을 즐기고 근처 사람들의 소소한 일상을 발견하는 미니앱",
  openGraph: {
    title: "오늘여름",
    description:
      "멀리 가지 않아도 도시 안에서 여름을 즐기는 동네 여름 피드",
    images: [
      {
        url: "/og.png",
        width: 1600,
        height: 900,
        alt: "오늘여름 미니앱 미리보기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘여름",
    description:
      "멀리 가지 않아도 도시 안에서 여름을 즐기는 동네 여름 피드",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
