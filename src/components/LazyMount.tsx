import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyMountProps = {
  children: ReactNode;
  /** Root margin for early prefetch before entering viewport */
  rootMargin?: string;
  /** Min height placeholder to reduce layout shift */
  minHeight?: number | string;
  className?: string;
  /** Fallback shown before mount */
  fallback?: ReactNode;
};

/**
 * Mounts children only when near the viewport — keeps initial load light.
 */
export function LazyMount({
  children,
  rootMargin = "280px 0px",
  minHeight,
  className,
  fallback = null,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={minHeight && !show ? { minHeight } : undefined}
    >
      {show ? children : fallback}
    </div>
  );
}
