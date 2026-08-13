import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
