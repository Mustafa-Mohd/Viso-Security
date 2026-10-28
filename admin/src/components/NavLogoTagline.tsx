import { useMemo } from "react";
import { TypewriterText } from "@/components/TypewriterText";
import { cn } from "@/lib/utils";

function ShiningSwordLine() {
  return (
    <div
      className="h-0.5 w-full bg-gradient-to-r from-primary via-gold to-primary/50 rounded-full my-0.5"
      aria-hidden
    />
  );
}

type NavLogoTaglineProps = {
  visionLine: string;
  taglinePhrases: string[];
  isAr: boolean;
};

function visionTextClass(isAr: boolean) {
  return cn(
    "font-brand-condensed font-semibold text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[16px] uppercase whitespace-nowrap leading-tight",
    isAr ? "tracking-normal" : "tracking-[0.035em] xl:tracking-[0.048em]",
  );
}

function taglineTextClass(isAr: boolean) {
  return cn(
    "font-brand-condensed font-semibold text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[16px] uppercase whitespace-nowrap leading-tight",
    isAr ? "tracking-normal" : "tracking-[0.11em] sm:tracking-[0.125em] xl:tracking-[0.145em]",
  );
}

export function NavLogoTagline({ visionLine, taglinePhrases, isAr }: NavLogoTaglineProps) {
  const longestTagline = useMemo(
    () => taglinePhrases.reduce((a, b) => (a.length >= b.length ? a : b)),
    [taglinePhrases],
  );

  return (
    <div className="relative max-w-[calc(100vw-8rem)] shrink-0 border-s border-foreground/20 ps-2 sm:ps-2.5 xl:ps-3.5 py-0.5 font-brand-condensed">
      <div className="inline-grid grid-cols-1 grid-rows-1">
        <div
          className="col-start-1 row-start-1 flex flex-col items-stretch invisible pointer-events-none select-none"
          aria-hidden
        >
          <span className={cn("text-foreground", visionTextClass(isAr))}>{visionLine}</span>
          <ShiningSwordLine />
          <span className={cn("text-primary", taglineTextClass(isAr))}>{longestTagline}</span>
        </div>

        <div className="col-start-1 row-start-1 flex min-w-0 flex-col items-stretch">
          <span className={cn("text-foreground", visionTextClass(isAr))}>{visionLine}</span>
          <ShiningSwordLine />
          <span className={cn("text-primary", taglineTextClass(isAr))}>
            <TypewriterText phrases={taglinePhrases} />
          </span>
        </div>
      </div>
    </div>
  );
}
