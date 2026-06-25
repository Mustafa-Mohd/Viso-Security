import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device supports hover (desktop vs mobile)
    const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", listener);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      mediaQuery.removeEventListener("change", listener);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile) return null;

  return (
    <>
      <style>{`
        /* Hide default cursor on devices that support hover */
        @media (hover: hover) and (pointer: fine) {
          body * {
            cursor: none !important;
          }
        }
      `}</style>
      
      <div className="pointer-events-none fixed inset-0 z-[99999]">
        {/* The arrow exactly following the mouse */}
        <motion.div
          className="absolute left-0 top-0 z-50 pointer-events-none drop-shadow-[0_8px_16px_rgba(223,155,42,0.5)]"
          style={{ x: cursorX, y: cursorY, opacity: isVisible ? 1 : 0 }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
            <defs>
              <linearGradient id="goldCursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE3A7" />
                <stop offset="50%" stopColor="#DF9B2A" />
                <stop offset="100%" stopColor="#A86E15" />
              </linearGradient>
            </defs>
            <path 
              d="M0 0 L9 22 L12 15 L19 12 Z" 
              fill="url(#goldCursorGradient)" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
            />
          </svg>
        </motion.div>
        
        {/* The rotating text following with a spring delay */}
        <motion.div
          className="absolute left-0 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] mix-blend-difference"
          style={{ x: smoothX, y: smoothY, opacity: isVisible ? 1 : 0 }}
        >
          <motion.svg 
            viewBox="0 0 100 100" 
            className="h-full w-full overflow-visible"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          >
            <path 
              id="cursorPath" 
              d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" 
              fill="none" 
            />
            <text className="font-mono text-[9px] font-bold uppercase tracking-[0.25em]" fill="#DF9B2A">
              <textPath href="#cursorPath" startOffset="0%">
                VISO SECURITY • VISO SECURITY •
              </textPath>
            </text>
          </motion.svg>
        </motion.div>
      </div>
    </>
  );
}
