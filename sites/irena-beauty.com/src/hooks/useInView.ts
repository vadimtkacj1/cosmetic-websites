'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Options {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Set by HomePage after the page has been in view for a couple of seconds.
// On back-navigation all useInView hooks read this and skip the hidden→visible animation.
export const PAGE_LOADED_SESSION_KEY = 'irena-page-loaded';

export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.05,
  rootMargin = '0px 0px 0px 0px',
  once = true,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  // On mount: if page was already fully loaded once this session, show immediately.
  // Also handles the normal case: element already in viewport on mount.
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || !once) return;

    try {
      if (sessionStorage.getItem(PAGE_LOADED_SESSION_KEY)) {
        setInView(true);
        return;
      }
    } catch {}

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true);
    }
  }, [once]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
