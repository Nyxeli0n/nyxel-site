"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";

const pages = [
  { href: "/about", title: "About" },
  { href: "/projects", title: "Projects" },
  { href: "/books", title: "Books" },
  { href: "/movies", title: "Movies" },
  { href: "/diary", title: "Diary" },
];

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activePage = pages.find(page => pathname === page.href || pathname.startsWith(`${page.href}/`));
  const navigation = useRef<HTMLElement>(null);

  function moveIndicator(href?: string) {
    const nav = navigation.current;
    if (!nav) return;
    const link = href ? nav.querySelector<HTMLAnchorElement>(`a[href="${href}"]`) : null;
    nav.style.setProperty("--indicator-opacity", link ? "1" : "0");
    if (link) {
      const bounds = link.getBoundingClientRect();
      const origin = nav.getBoundingClientRect();
      nav.style.setProperty("--indicator-x", `${bounds.left - origin.left}px`);
      nav.style.setProperty("--indicator-y", `${bounds.bottom - origin.top + 8}px`);
      nav.style.setProperty("--indicator-width", `${bounds.width}px`);
    }
  }

  useLayoutEffect(() => {
    const nav = navigation.current;
    if (!nav) return;
    const update = () => moveIndicator(activePage?.href);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    nav.querySelectorAll("a").forEach(link => observer.observe(link));
    return () => observer.disconnect();
  }, [activePage?.href]);

  return <main>
    <header className="site-head fade-in"><h1>Nyxel</h1><ThemeToggle /></header>
    <nav className="contacts fade-in delay-1" aria-label="Navigation">
      <Link href="/">Home</Link>
      <a href="https://x.com/nyxeli0n" target="_blank" rel="noreferrer">X</a>
      <a href="https://github.com/Nyxeli0n" target="_blank" rel="noreferrer">GitHub</a>
    </nav>
    <nav ref={navigation} className="contacts page-navigation fade-in delay-2" aria-label="Pages">
      {pages.map(page => <Link key={page.href} href={page.href}
        aria-current={activePage?.href === page.href ? "page" : undefined}
        onNavigate={() => moveIndicator(page.href)}>{page.title}</Link>)}
      <span className="page-indicator" aria-hidden="true" />
    </nav>
    <div key={pathname} className="page-content fade-in">{children}</div>
  </main>;
}
