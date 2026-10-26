import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  phrases: string[];
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
}

export function TypewriterText({ phrases, className, cursorClassName, showCursor = false }: TypewriterTextProps) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 30);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    } else {
      if (text.length < currentPhrase.length) {
        timeout = setTimeout(() => setText(currentPhrase.slice(0, text.length + 1)), 60);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2500);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{text}</span>
      {showCursor && (
        <span className={cn("inline-block w-[2px] h-[1.1em] bg-primary ms-0.5 animate-pulse shrink-0", cursorClassName)} aria-hidden="true" />
      )}
    </span>
  );
}
