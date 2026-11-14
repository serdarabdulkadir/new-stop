import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk } from "next/font/google";
import "./globals.css";

const familjen = Familjen_Grotesk({
  variable: "--font-familjen",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "New Stop · Menü",
  description: "New Stop Cafe & Restaurant, Söğütlü. Dijital menü.",
  icons: { icon: "/img/logo.png", apple: "/img/logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f5f1",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={familjen.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
