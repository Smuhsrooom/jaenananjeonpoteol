import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Options = {
  /** once visible, stay visible (default true) */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
};

export function useInView<T extends HTMLElement = HTMLDivElement>(options: Options = {}) {
  const { once = true, rootMargin = "0px 0px -8% 0px", threshold = 0.12 } = options;
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();
  const [inView, setInView] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold, reduced]);

  return { ref, inView } as const;
}
