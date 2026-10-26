import { useEffect, useState, useRef } from "react";
import { Palette, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "default" | "blue" | "dark" | "sky" | "emerald" | "purple";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("default");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check local storage or default
    const savedTheme = localStorage.getItem("viso-theme") as Theme;
    if (savedTheme && ["default", "blue", "dark", "sky", "emerald", "purple"].includes(savedTheme)) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }

    // Close when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyTheme = (t: Theme) => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      "theme-blue",
      "theme-dark",
      "theme-sky",
      "theme-emerald",
      "theme-purple"
    );
    if (t === "blue") {
      document.documentElement.classList.add("theme-blue");
    } else if (t === "dark") {
      document.documentElement.classList.add("theme-dark");
    } else if (t === "sky") {
      document.documentElement.classList.add("theme-sky");
    } else if (t === "emerald") {
      document.documentElement.classList.add("theme-emerald");
    } else if (t === "purple") {
      document.documentElement.classList.add("theme-purple");
    }
    // Also save to localStorage
    localStorage.setItem("viso-theme", t);
  };

  const selectTheme = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
    setIsOpen(false);
  };

  const themeOptions = [
    { id: "default" as Theme, name: "Light Gold", class: "bg-[#F8F8F6] border-foreground/10" },
    { id: "blue" as Theme, name: "Royal Blue", class: "bg-[#0B1329] border-white/10" },
    { id: "dark" as Theme, name: "Luxury Dark", class: "bg-[#050505] border-white/10" },
    { id: "sky" as Theme, name: "Sky Blue", class: "bg-[#F0F9FF] border-foreground/10" },
    { id: "emerald" as Theme, name: "Forest Emerald", class: "bg-[#022C22] border-white/10" },
    { id: "purple" as Theme, name: "Amethyst Purple", class: "bg-[#120D1E] border-white/10" },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/50 transition-colors hover:bg-surface text-foreground backdrop-blur-sm cursor-pointer"
        aria-label="Select theme"
      >
        <Palette className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 p-2 bg-surface border border-border rounded-xl shadow-xl flex flex-col gap-1 min-w-[120px] z-[200]"
          >
            {themeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => selectTheme(opt.id)}
                className="flex items-center justify-between w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-foreground/5 cursor-pointer text-foreground"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full ${opt.class} border`} />
                  <span>{opt.name}</span>
                </div>
                {theme === opt.id && <Check className="w-3 h-3 text-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
