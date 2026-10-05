import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ServiceItem {
  title: string;
  desc: string;
  url: string;
  img: string;
  color: string;
  moreInfo?: string;
}

export function ServicesCarousel({ items }: { items: ServiceItem[] }) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    if (selectedService) return; // Pause carousel if modal is open
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length, selectedService]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const getOffset = (index: number) => {
    const total = items.length;
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <>
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden px-4 py-2 md:py-4 flex items-center justify-center min-h-[420px] md:min-h-[500px]">
        
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          className="absolute start-4 md:start-12 z-40 p-3 md:p-4 rounded-full bg-surface/90 border border-foreground/10 hover:bg-surface hover:text-primary transition-colors backdrop-blur-md shadow-xl"
          aria-label="Previous Service"
        >
          <ChevronLeft size={24} className="rtl:rotate-180" />
        </button>

        <button 
          onClick={handleNext}
          className="absolute end-4 md:end-12 z-40 p-3 md:p-4 rounded-full bg-surface/90 border border-foreground/10 hover:bg-surface hover:text-primary transition-colors backdrop-blur-md shadow-xl"
          aria-label="Next Service"
        >
          <ChevronRight size={24} className="rtl:rotate-180" />
        </button>

        {/* Cards Container */}
        <div 
          className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] h-[400px] md:h-[480px] flex justify-center items-center"
          style={{ perspective: "1500px" }}
        >
          {items.map((item, i) => {
            const offset = getOffset(i);
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;
            const direction = Math.sign(offset);
            
            // 3D Coverflow Calculations
            const xPercent = isCenter ? 0 : direction * (85 + absOffset * 22); 
            const rotateY = offset * -18; // Inward facing
            const scale = 1 - absOffset * 0.12;
            const opacity = 1 - absOffset * 0.3;
            const zIndex = 30 - absOffset;
            const blur = absOffset > 1 ? "blur(2px)" : "blur(0px)";

            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  x: `${xPercent}%`,
                  rotateY,
                  scale,
                  opacity,
                  zIndex,
                  filter: blur
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 25,
                  mass: 0.8
                }}
                className="absolute top-0 left-0 w-full h-full"
              >
                <div 
                  className={`block group w-full h-full cursor-pointer`} 
                  onClick={() => {
                    if (!isCenter) {
                      setActiveIndex(i);
                    } else {
                      setSelectedService(item);
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
                    <div className="p-6 md:p-8 flex flex-col flex-grow bg-white text-start">
                      <h3 className={`font-display text-xl md:text-2xl mb-2 text-foreground transition-colors ${isCenter ? 'group-hover:text-primary' : ''}`}>{item.title}</h3>
                      <p className="font-sans text-sm md:text-base text-foreground/70 leading-relaxed mb-4 line-clamp-3">{item.desc}</p>
                      <div className={`mt-auto flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground/50 transition-colors ${isCenter ? 'group-hover:text-primary' : ''}`}>
                        <span>{t("home_interactive.read_more")}</span>
                        <span className={`transform transition-transform inline-block rtl:rotate-180 ${isCenter ? 'group-hover:translate-x-1 rtl:group-hover:-translate-x-1' : ''}`}>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="relative h-48 md:h-64 flex-shrink-0">
                <img src={selectedService.img} alt={selectedService.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-md"
                >
                  <X size={20} />
                </button>
                <h2 className="absolute bottom-6 left-6 md:left-8 text-3xl md:text-4xl font-display font-bold text-white">
                  {selectedService.title}
                </h2>
              </div>
              <div className="p-6 md:p-8 font-sans">
                <p className="text-lg md:text-xl text-foreground/80 mb-6 font-medium leading-relaxed">
                  {selectedService.desc}
                </p>
                {selectedService.moreInfo && (
                  <div className="prose prose-sm md:prose-base max-w-none text-foreground/70 leading-loose">
                    {selectedService.moreInfo.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                )}
                
                {(selectedService.url === "/translation" || selectedService.url === "/security") && (
                  <div className="mt-8 pt-6 border-t border-foreground/10 flex justify-end">
                    <Link 
                      to={selectedService.url}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm tracking-wide hover:bg-primary/90 transition-colors"
                    >
                      {selectedService.url === "/translation" ? t("nav.translation") : t("nav.security")} <ChevronRight size={16} className="rtl:rotate-180" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
