import { useEffect, useRef, useState } from "react";

type LinkedInEmbedProps = {
  embedSrc: string;
  height: number;
  title: string;
};

/** Loads LinkedIn's official embed iframe when the section enters the viewport. */
export function LinkedInEmbed({ embedSrc, height, title }: LinkedInEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadEmbed, setLoadEmbed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadEmbed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[504px] overflow-hidden rounded-xl border border-foreground/10 bg-white shadow-sm"
      style={{ minHeight: loadEmbed ? height : 320 }}
    >
      {loadEmbed ? (
        <iframe
          src={embedSrc}
          height={height}
          width="100%"
          title={title}
          className="block w-full border-0"
          loading="lazy"
        />
      ) : (
        <div
          className="flex h-[320px] items-center justify-center px-6 text-center text-sm text-foreground/50"
          aria-hidden
        >
          Loading LinkedIn post…
        </div>
      )}
    </div>
  );
}
