import type { Metadata } from "next";
import { Geist_Mono, Golos_Text } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const golosText = Golos_Text({
  variable: "--font-golos-text",
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
});

const russoOne = localFont({
  src: "../public/fonts/RussoOne-Regular.ttf",
  variable: "--font-russo-one",
  weight: "400",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PHOTO DREAM — Аренда фотостудии в Москве",
  description:
    "Почасовая аренда фотостудии в Москве. Пространство для съёмок, экспериментов со светом и кадров, которые передают твоё видение.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${golosText.variable} ${russoOne.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
