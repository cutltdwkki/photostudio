"use client";

import { useEffect, useRef, useState } from "react";

type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  /** Fraction of viewport height used for “already in view” check */
  visibleTopRatio?: number;
  visibleBottomMin?: number;
};

/**
 * Intersection / reduced-motion reveal without sync setState in effects.
 */
export function useSectionReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const {
    threshold = 0.12,
    rootMargin = "0px 0px -4% 0px",
    visibleTopRatio = 0.88,
    visibleBottomMin = 0,
  } = options;

  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed) return;

    let cancelled = false;

    const reveal = () => {
      queueMicrotask(() => {
        if (!cancelled) setRevealed(true);
      });
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      reveal();
      return () => {
        cancelled = true;
      };
    }

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * visibleTopRatio && rect.bottom > visibleBottomMin) {
      reveal();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [revealed, threshold, rootMargin, visibleTopRatio, visibleBottomMin]);

  return { ref, revealed };
}
