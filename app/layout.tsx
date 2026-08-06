import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PixelCursor from "./components/PixelCursor";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const geistPixelSquare = localFont({
  src: "./fonts/GeistPixel-Square.woff2",
  variable: "--font-pixel-square",
  display: "swap",
});

const geistPixelCircle = localFont({
  src: "./fonts/GeistPixel-Circle.woff2",
  variable: "--font-pixel-circle",
  display: "swap",
});

const geistPixelGrid = localFont({
  src: "./fonts/GeistPixel-Grid.woff2",
  variable: "--font-pixel-grid",
  display: "swap",
});

const geistPixelTriangle = localFont({
  src: "./fonts/GeistPixel-Triangle.woff2",
  variable: "--font-pixel-triangle",
  display: "swap",
});

const geistPixelLine = localFont({
  src: "./fonts/GeistPixel-Line.woff2",
  variable: "--font-pixel-line",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nyxel",
  description: "Nyxel",
  icons: {
    icon: "/nyxel-icon-20260803.svg",
    shortcut: "/nyxel-icon-20260803.svg",
    apple: "/nyxel-icon-20260803.svg",
  },
};

const themeScript = `
  try {
    const saved = localStorage.getItem("theme");
    const systemDark = matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = saved || (systemDark ? "dark" : "light");
  } catch (_) {
    document.documentElement.dataset.theme = "dark";
  }
`;

const fontVars = [
  geistSans.variable,
  geistMono.variable,
  geistPixelSquare.variable,
  geistPixelCircle.variable,
  geistPixelGrid.variable,
  geistPixelTriangle.variable,
  geistPixelLine.variable,
].join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <PixelCursor />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
