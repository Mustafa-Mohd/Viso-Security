import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, FileText } from "lucide-react";

export const Route = createFileRoute("/translation")({
  component: TranslationPage,
  head: () => ({
    meta: [
      { title: "VISO | Certified Translation Services" },
      { name: "description", content: "Officially accredited translation services in Saudi Arabia." },
    ],
  }),
});

// Custom Premium SVG Icons for the translation domains
function OfficialStampIcon() {
  return (
    <svg className="w-14 h-14 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 45H70M30 55H70M35 50H65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="38" y="32" width="24" height="36" rx="2" stroke="currentColor" strokeWidth="2" fill="var(--background)" />
      <path d="M44 42H56M44 50H56M44 58H50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="62" r="5" fill="currentColor" />
    </svg>
  );
}

function MedicalPulseIcon() {
  return (
    <svg className="w-14 h-14 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M25 50H38L43 32L50 68L56 45L60 50H75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="43" cy="32" r="3" fill="currentColor" />
      <circle cx="50" cy="68" r="3" fill="currentColor" />
    </svg>
  );
}

function LegalScalesIcon() {
  return (
    <svg className="w-14 h-14 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" />
      {/* Central Pillar */}
      <path d="M50 25V75M42 75H58M45 25H55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Balance Beam */}
      <path d="M30 35H70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Left scale pan */}
      <path d="M30 35L22 55M30 35L38 55" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 55H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Right scale pan */}
      <path d="M70 35L62 55M70 35L78 55" stroke="currentColor" strokeWidth="1.5" />
      <path d="M60 55H80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MediaMegaphoneIcon() {
  return (
    <svg className="w-14 h-14 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" />
      {/* Megaphone body */}
      <path d="M32 45H42L56 32V68L42 55H32C30 55 28 53 28 50C28 47 30 45 32 45Z" stroke="currentColor" strokeWidth="2.5" fill="var(--background)" strokeLinejoin="round" />
      {/* Handle */}
      <path d="M44 55L48 68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Audio waves */}
      <path d="M66 40C69 43 71 47 71 50C71 53 69 57 66 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 32C79 37 82 43 82 50C82 57 79 63 74 68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function SecurityShieldIcon() {
  return (
    <svg className="w-14 h-14 text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" />
      {/* Shield */}
      <path d="M50 25C58 25 70 28 70 28V50C70 63 59 72 50 75C41 72 30 63 30 50V28C30 28 42 25 50 25Z" stroke="currentColor" strokeWidth="2.5" fill="var(--background)" strokeLinejoin="round" />
      {/* Checkmark inside */}
      <path d="M42 50L48 56L58 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const serviceKeys = ["official", "medical", "legal", "media", "security"] as const;

function TranslationPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");
  const detailRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [sliderOffset, setSliderOffset] = useState(0);

  // Re-adjust slider offset if screen size is resized
  useEffect(() => {
    setSliderOffset(0);
  }, []);

  const icons = [
    <OfficialStampIcon key="official" />,
    <MedicalPulseIcon key="medical" />,
    <LegalScalesIcon key="legal" />,
    <MediaMegaphoneIcon key="media" />,
    <SecurityShieldIcon key="security" />
  ];

  const handleSelectService = (idx: number) => {
    setActiveIdx(idx);
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nextSlide = () => {
    if (sliderOffset < serviceKeys.length - 1) {
      setSliderOffset(prev => prev + 1);
    } else {
      setSliderOffset(0); // Wrap around
    }
  };

  const prevSlide = () => {
    if (sliderOffset > 0) {
      setSliderOffset(prev => prev - 1);
    } else {
      setSliderOffset(serviceKeys.length - 1); // Wrap around
    }
  };

  // Safe fetch of localized list items
  const getServiceItems = (key: typeof serviceKeys[number]): string[] => {
    const raw = t(`translation_page.services.${key}.items`, { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  };

  return (
    <div className={`bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary ${isAr ? "rtl" : "ltr"}`}>
      <SmoothScroll />
      <TopNav />

      <main className="pt-28 pb-40">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#D4AF37_0%,transparent_60%)] opacity-5" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </div>

          <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[10px] tracking-[0.2em] uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                {t("translation_page.eyebrow")}
              </div>
              <h1 className="font-display text-5xl md:text-7xl leading-tight text-foreground tracking-tight max-w-4xl mx-auto">
                {t("translation_page.title")}{" "}
                <span className="italic text-primary block sm:inline">{t("translation_page.title_italic")}</span>
              </h1>
              <p className="font-sans text-base md:text-lg text-foreground/60 max-w-2xl mx-auto mt-6 leading-relaxed">
                {t("translation_page.desc")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Toggle navigation pill */}
        <div className="flex justify-center mb-16 px-4">
          <div className="inline-flex bg-neutral-900/90 dark:bg-neutral-950/95 rounded-full p-1.5 border border-foreground/10 shadow-2xl relative z-10">
            <Link
              to="/security"
              className="px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 text-neutral-400 hover:text-white"
            >
              {t("translation_page.toggle_security")}
            </Link>
            <div className="px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase bg-primary text-white shadow-lg shadow-primary/25 cursor-default font-sans">
              {t("translation_page.toggle_translation")}
            </div>
          </div>
        </div>

        {/* Premium Slider/Carousel Section */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 relative mb-24 z-10">
          <div className="relative group">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous service"
              className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-surface border border-foreground/10 hover:border-primary/50 text-foreground hover:text-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-115 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next service"
              className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-surface border border-foreground/10 hover:border-primary/50 text-foreground hover:text-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-115 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slider track viewport */}
            <div className="overflow-hidden py-6 px-2 md:px-4">
              <motion.div
                className="flex gap-6 md:gap-8"
                animate={{ x: `-${sliderOffset * 300}px` }} // Sliding offset based on card width
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
              >
                {serviceKeys.map((key, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <motion.div
                      key={key}
                      onClick={() => setActiveIdx(idx)}
                      className={`min-w-[280px] sm:min-w-[340px] max-w-[340px] flex-1 rounded-3xl p-8 border cursor-pointer select-none transition-all duration-500 flex flex-col bg-surface shadow-md hover:shadow-xl relative overflow-hidden group ${
                        isActive
                          ? "border-primary bg-surface-2 ring-1 ring-primary/45 scale-[1.02]"
                          : "border-foreground/5 hover:border-primary/30"
                      }`}
                    >
                      {/* Active state top accent glow */}
                      <div
                        className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-gold to-primary transition-opacity duration-500 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                        }`}
                      />

                      {/* Circular icon container */}
                      <div className="mb-6 flex justify-center">
                        <div
                          className={`w-28 h-28 rounded-full border flex items-center justify-center shadow-inner transition-transform duration-700 group-hover:scale-105 bg-background ${
                            isActive ? "border-primary/40 bg-primary/5" : "border-foreground/10"
                          }`}
                        >
                          {icons[idx]}
                        </div>
                      </div>

                      <h3
                        className={`text-center font-sans font-bold text-lg md:text-xl mb-4 group-hover:text-primary transition-colors duration-300 ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {t(`translation_page.services.${key}.title`)}
                      </h3>

                      <p className="text-center font-sans text-sm text-foreground/60 leading-relaxed mb-6 flex-grow">
                        {t(`translation_page.services.${key}.short_desc`)}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectService(idx);
                        }}
                        className={`w-full py-3.5 rounded-full font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md ${
                          isActive
                            ? "bg-primary text-white hover:bg-neutral-800"
                            : "bg-neutral-100 hover:bg-primary text-foreground hover:text-white"
                        }`}
                      >
                        {t("translation_page.read_more")}
                        {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detailed Service Section with Breadcrumbs */}
        <div ref={detailRef} className="scroll-mt-36 max-w-[1400px] mx-auto px-4 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-surface rounded-3xl border border-foreground/5 shadow-2xl overflow-hidden relative"
            >
              {/* Top Accent Divider matching premium look */}
              <div className="h-2 bg-gradient-to-r from-primary via-gold to-secondary" />

              {/* White clean inner card */}
              <div className="p-8 md:p-16">
                {/* Breadcrumb row */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-sans font-medium text-foreground/40 mb-8 border-b border-foreground/5 pb-4">
                  <span>{t("translation_page.breadcrumb_base")}</span>
                  <span className="text-primary">/</span>
                  <span>{t("translation_page.breadcrumb_mid")}</span>
                  <span className="text-primary">/</span>
                  <span className="text-primary font-bold">
                    {t(`translation_page.services.${serviceKeys[activeIdx]}.title`)}
                  </span>
                </div>

                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 items-start">
                  <div>
                    <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6 leading-tight">
                      {t(`translation_page.services.${serviceKeys[activeIdx]}.title`)}
                    </h2>
                    <p className="font-sans text-base md:text-lg leading-relaxed text-foreground/75 mb-8 text-justify">
                      {t(`translation_page.services.${serviceKeys[activeIdx]}.desc`)}
                    </p>
                  </div>

                  <div className="bg-background rounded-2xl p-6 md:p-10 border border-foreground/10 relative shadow-inner">
                    <div className="absolute top-4 right-4 text-primary/10">
                      <FileText className="w-20 h-20" />
                    </div>
                    
                    <ul className="space-y-5 relative z-10">
                      {getServiceItems(serviceKeys[activeIdx]).map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.4 }}
                          className="flex items-start gap-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20 text-sm font-mono font-bold">
                            {idx + 1}
                          </div>
                          <span className="font-sans text-sm md:text-base text-foreground/80 leading-relaxed pt-1 font-medium">
                            {item}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
