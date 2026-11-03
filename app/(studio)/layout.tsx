import localFont from "next/font/local";
const geist = localFont({
  src: "../(site)/fonts/Geist-Variable.woff2",
  display: "swap",
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={geist.className} style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
