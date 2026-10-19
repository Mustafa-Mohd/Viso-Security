import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
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

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function getServiceWhatsAppUrl(serviceTitle: string, isArabic = false): string {
  const phone = "966114503289";
  const message = isArabic
    ? `السلام عليكم ورحمة الله وبركاته،\n\nأود الاستفسار بخصوص خدمات "${serviceTitle}" لدى مجموعة فيزو للاستشارات الأمنية.\n\nنرجو تزويدنا بمزيد من التفاصيل حول نطاق الخدمة، متطلبات الامتثال التنظيمي، وإمكانية جدولة جلسة استشارية.\n\nشاكرين ومقدرين تعاونكم.`
    : `Dear VISO Security Group,\n\nI would like to inquire about your "${serviceTitle}" services as featured on your website.\n\nCould you please share detailed information regarding the scope of work, regulatory compliance alignment, and consultation scheduling?\n\nThank you for your assistance.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function ServicesCarousel({ items }: { items: ServiceItem[] }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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
                    } else if (item.url === "/translation" || item.url === "/security") {
                      navigate({ to: item.url });
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
                      <div className="mt-auto pt-3 border-t border-foreground/10 flex items-center justify-between gap-2">
                        <div className={`flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-foreground/50 transition-colors ${isCenter ? 'group-hover:text-primary' : ''}`}>
                          <span>{t("home_interactive.read_more")}</span>
                          <span className={`transform transition-transform inline-block rtl:rotate-180 ${isCenter ? 'group-hover:translate-x-1 rtl:group-hover:-translate-x-1' : ''}`}>→</span>
                        </div>
                        <a
                          href={getServiceWhatsAppUrl(item.title, i18n.language === 'ar')}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white transition-all duration-300 text-xs font-semibold shadow-xs hover:shadow-md hover:scale-105 shrink-0 z-20 cursor-pointer"
                          title={i18n.language === 'ar' ? "استفسار عبر واتساب" : "Inquire via WhatsApp"}
                          aria-label={i18n.language === 'ar' ? `استفسار عبر واتساب عن ${item.title}` : `Inquire via WhatsApp about ${item.title}`}
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                          <span className="text-[11px] font-semibold">{i18n.language === 'ar' ? "واتساب" : "WhatsApp"}</span>
                        </a>
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
        {selectedService && (() => {
          const isTraining = Boolean(
            selectedService.url === "/services/training" ||
            selectedService.title?.toLowerCase().includes("train") ||
            selectedService.title?.includes("تدريب")
          );

          return (
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
                <div className={isTraining ? "relative h-36 md:h-44 flex-shrink-0" : "relative h-48 md:h-64 flex-shrink-0"}>
                  <img src={selectedService.img} alt={selectedService.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-md"
                  >
                    <X size={20} />
                  </button>
                  <h2 className={isTraining ? "absolute bottom-4 left-6 md:left-8 rtl:left-auto rtl:right-6 rtl:md:right-8 text-2xl md:text-3xl font-display font-bold text-white" : "absolute bottom-6 left-6 md:left-8 text-3xl md:text-4xl font-display font-bold text-white"}>
                    {selectedService.title}
                  </h2>
                </div>
                <div className={isTraining ? "p-5 md:p-6 font-sans overflow-y-auto flex-1 flex flex-col" : "p-6 md:p-8 font-sans"}>
                  <p className={isTraining ? "text-base md:text-lg text-foreground/80 mb-3 font-medium leading-snug" : "text-lg md:text-xl text-foreground/80 mb-6 font-medium leading-relaxed"}>
                    {selectedService.desc}
                  </p>
                  {selectedService.moreInfo && (
                    <div className={isTraining ? "prose prose-sm max-w-none text-foreground/70 leading-normal" : "prose prose-sm md:prose-base max-w-none text-foreground/70 leading-loose"}>
                      {selectedService.moreInfo.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className={isTraining ? "mb-2" : "mb-4"}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  
                  <div className={isTraining ? "mt-4 pt-3 border-t border-foreground/10 flex flex-wrap items-center justify-between gap-2 shrink-0" : "mt-8 pt-6 border-t border-foreground/10 flex flex-wrap items-center justify-between gap-3"}>
                    <a
                      href={getServiceWhatsAppUrl(selectedService.title, i18n.language === 'ar')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        isTraining
                          ? "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                          : "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                      }
                    >
                      <WhatsAppIcon className={isTraining ? "w-3.5 h-3.5 text-white" : "w-4 h-4 text-white"} />
                      <span>{i18n.language === 'ar' ? "طلب استشارة عبر واتساب" : "Request Consultation via WhatsApp"}</span>
                    </a>

                    {(selectedService.url === "/translation" || selectedService.url === "/security") && (
                      <Link 
                        to={selectedService.url}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm tracking-wide hover:bg-primary/90 transition-colors"
                      >
                        {selectedService.url === "/translation" ? t("nav.translation") : t("nav.security")} <ChevronRight size={16} className="rtl:rotate-180" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
