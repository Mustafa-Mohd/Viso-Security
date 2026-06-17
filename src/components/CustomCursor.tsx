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
        {/* The center dot exactly following the mouse */}
        <motion.div
          className="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00AEEF] shadow-[0_0_10px_#00AEEF]"
          style={{ x: cursorX, y: cursorY, opacity: isVisible ? 1 : 0 }}
        />
        
        {/* The rotating text following with a spring delay */}
        <motion.div
          className="absolute left-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2"
          style={{ x: smoothX, y: smoothY, opacity: isVisible ? 1 : 0 }}
        >
          <motion.svg 
            viewBox="0 0 100 100" 
            className="h-full w-full overflow-visible"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          >
            <path 
              id="cursorPath" 
              d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" 
              fill="none" 
            />
            <text className="font-mono text-[9px] uppercase tracking-[0.2em]" fill="#00AEEF">
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
