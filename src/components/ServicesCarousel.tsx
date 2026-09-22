import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceItem {
  title: string;
  desc: string;
  url: string;
  img: string;
  color: string;
}

export function ServicesCarousel({ items }: { items: ServiceItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [items.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Determine offsets for seamless wrapping
  const getOffset = (index: number) => {
    const total = items.length;
    let diff = index - activeIndex;
    
    // Normalize diff to be between -Math.floor(total/2) and Math.floor(total/2)
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden px-4 py-2 md:py-4 flex items-center justify-center min-h-[420px] md:min-h-[500px]">
      
      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 md:left-12 z-50 p-3 md:p-4 rounded-full bg-surface/90 border border-foreground/10 hover:bg-surface hover:text-primary transition-colors backdrop-blur-md shadow-xl"
        aria-label="Previous Service"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-4 md:right-12 z-50 p-3 md:p-4 rounded-full bg-surface/90 border border-foreground/10 hover:bg-surface hover:text-primary transition-colors backdrop-blur-md shadow-xl"
        aria-label="Next Service"
      >
        <ChevronRight size={24} />
      </button>

      {/* Cards Container */}
      <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] h-[400px] md:h-[480px] flex justify-center items-center">
        {items.map((item, i) => {
          const offset = getOffset(i);
          const isCenter = offset === 0;
          
          const xPercent = offset * 115; 
          const scale = isCenter ? 1 : 0.85 - Math.abs(offset) * 0.05;
          const opacity = isCenter ? 1 : 1 - Math.abs(offset) * 0.35;
          const zIndex = 40 - Math.abs(offset);

          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                x: `${xPercent}%`,
                scale,
                opacity,
                zIndex
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <Link 
                to={item.url} 
                className={`block group w-full h-full ${!isCenter && "cursor-pointer"}`} 
                onClick={(e) => {
                  if (!isCenter) {
                    e.preventDefault();
                    setActiveIndex(i);
                  }
                }}
              >
                <div className={`relative bg-surface border border-foreground/10 rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-500 shadow-xl ${isCenter ? 'hover:shadow-2xl shadow-black/10' : ''} ${item.color}`}>
                  <div className="h-[45%] md:h-[55%] overflow-hidden relative">
                    <div className={`absolute inset-0 bg-black/20 ${isCenter ? 'group-hover:bg-transparent' : ''} transition-colors duration-500 z-10`} />
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${isCenter ? 'group-hover:scale-110' : ''}`}
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
                    <h3 className={`font-display text-xl md:text-2xl mb-2 text-foreground transition-colors ${isCenter ? 'group-hover:text-primary' : ''}`}>{item.title}</h3>
                    <p className="font-sans text-sm md:text-base text-foreground/70 leading-relaxed mb-4">{item.desc}</p>
                    <div className={`mt-auto flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground/50 transition-colors ${isCenter ? 'group-hover:text-primary' : ''}`}>
                      <span>Access</span>
                      <span className={`transform transition-transform ${isCenter ? 'group-hover:translate-x-1' : ''}`}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
