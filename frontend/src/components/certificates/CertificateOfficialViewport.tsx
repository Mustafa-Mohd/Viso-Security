import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** Fits full A4 official layout on narrow screens by scaling — print stays 1:1. */
export function CertificateOfficialViewport({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; width: number; height: number } | null>(null);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    const onBefore = () => setPrinting(true);
    const onAfter = () => setPrinting(false);
    window.addEventListener("beforeprint", onBefore);
    window.addEventListener("afterprint", onAfter);
    return () => {
      window.removeEventListener("beforeprint", onBefore);
      window.removeEventListener("afterprint", onAfter);
    };
  }, []);

  useLayoutEffect(() => {
    if (printing) return;
    const measure = () => {
      const outer = outerRef.current;
      const page = pageRef.current;
      if (!outer || !page) return;
      const pageWidth = page.offsetWidth;
      const pageHeight = page.offsetHeight;
      if (pageWidth <= 0) return;
      const available = outer.clientWidth;
      const scale = available < pageWidth ? available / pageWidth : 1;
      setFit({
        scale,
        width: pageWidth * scale,
        height: pageHeight * scale,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (outerRef.current) ro.observe(outerRef.current);
    if (pageRef.current) ro.observe(pageRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [printing]);

  const scale = fit?.scale ?? 1;
  const scaled = Boolean(!printing && fit && scale < 0.999);

  return (
    <div
      ref={outerRef}
      className="cert-official-viewport-outer w-full flex justify-center print:block print:w-auto"
    >
      <div
        className={
          scaled
            ? "cert-official-viewport-box relative print:static print:!w-auto print:!h-auto"
            : "print:static"
        }
        style={scaled && fit ? { width: fit.width, height: fit.height } : undefined}
      >
        <div
          ref={pageRef}
          className={
            scaled
              ? "cert-official-viewport-page absolute left-0 top-0 print:static print:!transform-none"
              : "cert-official-viewport-page print:static"
          }
          style={
            scaled
              ? { transform: `scale(${scale})`, transformOrigin: "top left" }
              : undefined
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}