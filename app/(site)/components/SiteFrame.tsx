"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";

const pages = [
  { href: "/", title: "About" },
  { href: "/projects", title: "Projects" },
  { href: "/books", title: "Book reviews" },
  { href: "/movies", title: "Movie reviews" },
  { href: "/diary", title: "Blog" },
];

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navigation = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const nav = navigation.current;
    const active = nav?.querySelector<HTMLAnchorElement>(
      '[aria-current="page"]',
    );
    if (!nav || !active) return;
    // Scroll only the menu, preserving the document's position.
    const left = active.offsetLeft;
    if (left < nav.scrollLeft) nav.scrollLeft = left;
    else if (left + active.offsetWidth > nav.scrollLeft + nav.clientWidth)
      nav.scrollLeft = left + active.offsetWidth - nav.clientWidth;
  }, [pathname]);

  return (
    <main>
      <header className="site-head fade-in">
        <h1 className="site-title" lang="en">
          <Link href="/">Nyxel</Link>
        </h1>
        <ThemeToggle />
      </header>
      <nav
        className="contacts fade-in delay-1"
        aria-label="外部リンク"
        lang="en"
      >
        <a href="https://x.com/nyxeli0n" target="_blank" rel="noreferrer">
          X
        </a>
        <a href="https://github.com/Nyxeli0n" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
      <nav
        ref={navigation}
        className="page-navigation fade-in delay-2"
        aria-label="ページ"
        lang="en"
      >
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            aria-current={
              pathname === page.href || pathname.startsWith(`${page.href}/`)
                ? "page"
                : undefined
            }
          >
            {page.title}
          </Link>
        ))}
      </nav>
      <div key={pathname} className="page-content fade-in">
        {children}
      </div>
    </main>
  );
}
