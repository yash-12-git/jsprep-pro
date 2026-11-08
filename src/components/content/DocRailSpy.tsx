"use client";

import { useEffect } from "react";

/**
 * Marks the "On this page" link for the section being read with
 * aria-current, which content.css styles as the active item. The rail itself
 * stays server-rendered; this only reads the links already in it.
 *
 * The active section is the last one whose top has passed just under the
 * floating nav. At the very bottom of the page the last section wins, since a
 * short final section may never reach that line.
 */
export default function DocRailSpy() {
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>(".doc-rail");
    if (!rail) return;
    const list = rail.querySelector<HTMLElement>("ol");
    const links = Array.from(rail.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const targets = links
      .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    let current: HTMLAnchorElement | null = null;
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = 120;
      let index = 0;
      targets.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) index = i;
      });
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) index = targets.length - 1;

      const link = links.find((a) => a.hash === `#${targets[index].id}`) ?? null;
      if (link === current) return;
      current?.removeAttribute("aria-current");
      link?.setAttribute("aria-current", "location");
      current = link;

      // On phones the rail is a horizontal scroller: keep the active link in
      // view without moving the page.
      if (link && list && list.scrollWidth > list.clientWidth) {
        const left = link.offsetLeft - list.offsetLeft - 16;
        list.scrollTo({ left, behavior: "smooth" });
      }
    };

    // A short timer rather than requestAnimationFrame, which never fires
    // while the tab is hidden, so the rail would be stale when you return.
    const onScroll = () => {
      if (!frame) frame = window.setTimeout(update, 50);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      current?.removeAttribute("aria-current");
    };
  }, []);

  return null;
}
