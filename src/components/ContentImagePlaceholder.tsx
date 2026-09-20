import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export type ImagePlaceholderAspect = "video" | "wide" | "hero" | "card" | "square";

const aspectClasses: Record<ImagePlaceholderAspect, string> = {
  video: "aspect-video",
  wide: "aspect-[21/9]",
  hero: "min-h-[200px] md:min-h-[280px] aspect-[4/3] md:aspect-[16/10]",
  card: "aspect-[4/3]",
  square: "aspect-square",
};

type ContentImagePlaceholderProps = {
  /** Set a URL when ready; leave empty for the dashed placeholder UI */
  src?: string | null;
  alt?: string;
  label?: string;
  hint?: string;
  aspect?: ImagePlaceholderAspect;
  className?: string;
  accent?: string;
  priority?: boolean;
};

export function ContentImagePlaceholder({
  src,
  alt = "",
  label = "Image placeholder",
  hint = "Add an image URL in the content data file for this section.",
  aspect = "video",
  className,
  accent,
  priority = false,
}: ContentImagePlaceholderProps) {
  const trimmed = src?.trim();
  const hasImage = Boolean(trimmed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-foreground/10 bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.02]",
        aspectClasses[aspect],
        className,
      )}
    >
      {hasImage ? (
        <motion.img
          key={trimmed}
          src={trimmed}
          alt={alt}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease }}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
        >
          <div
            className="rounded-2xl border border-dashed border-foreground/20 bg-background/50 p-5 transition-colors duration-300 group-hover:border-primary/35"
            style={
              accent
                ? { boxShadow: `0 0 48px -12px ${accent}40` }
                : undefined
            }
          >
            <ImageIcon className="h-9 w-9 text-foreground/25" strokeWidth={1.25} aria-hidden />
          </div>
          <p className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase text-foreground/45">
            {label}
          </p>
          {hint && (
            <p className="text-[11px] leading-relaxed text-foreground/30 max-w-[240px]">{hint}</p>
          )}
        </motion.div>
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/[0.12] via-transparent to-transparent opacity-80"
        aria-hidden
      />
      {accent && (
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-0.5 opacity-60"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
          aria-hidden
        />
      )}
    </motion.div>
  );
}

/** Stagger wrapper for page sections */
export function PageSection({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
