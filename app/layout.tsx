import type { Metadata } from "next";
import { Geist_Mono, Golos_Text } from "next/font/google";
import "./globals.css";

const golosText = Golos_Text({
  variable: "--font-golos-text",
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STUDIO 01 — Фотостудия в Москве",
  description:
    "Почасовая аренда фотостудии в Москве у м. Воробьёвы горы. Пространство для съёмок, в которых есть настроение.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${golosText.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
