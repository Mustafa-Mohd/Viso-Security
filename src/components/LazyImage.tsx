import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type LazyImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Skip lazy for LCP / above-the-fold images */
  priority?: boolean;
};

/**
 * Image with native lazy-loading, async decode, and soft fade-in.
 */
export function LazyImage({
  priority = false,
  className,
  onLoad,
  alt = "",
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn(
        "transition-opacity duration-500 ease-out",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      {...props}
    />
  );
}
