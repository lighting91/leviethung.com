"use client";

import { useEffect } from "react";

// Adds `.visible` to `.reveal` elements as they scroll into view. A MutationObserver
// picks up elements rendered later (client navigation, async lists) and elements
// whose className React rewrote, so nothing stays hidden.
export default function RevealObserver() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pending = () => document.querySelectorAll<HTMLElement>(".reveal:not(.visible)");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      const showAll = () => pending().forEach((el) => el.classList.add("visible"));
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const observeAll = () => pending().forEach((el) => io.observe(el));
    observeAll();

    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
