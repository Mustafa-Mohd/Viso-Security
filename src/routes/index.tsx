import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TiltCard } from "@/components/TiltCard";
import { motion, useScroll, useTransform, useInView, AnimatePresence, animate, useMotionValue, useSpring } from "framer-motion";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TopNav } from "@/components/TopNav";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "VISO | High-End Security Architecture" },
      { name: "description", content: "Premium security architecture and consulting." },
    ],
  }),
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function HomePage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <div className="bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary">
        <TopNav />
        <main>
          <HeroSection />
          <About />
        {/* Core Values Section */}
        <div className="mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">{t("about.values.title")}</h2>
            <p className="text-lg text-foreground/60">{t("about.values.subtitle")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard 
              title={t("about.values.items.v1.title")} 
              desc={t("about.values.items.v1.desc")} 
              points={t("about.values.items.v1.points", { returnObjects: true }) as string[]}
              svg={<HonestySVG />} 
              delay={0.1}
            />
            <ValueCard 
              title={t("about.values.items.v2.title")} 
              desc={t("about.values.items.v2.desc")} 
              points={t("about.values.items.v2.points", { returnObjects: true }) as string[]}
              svg={<ExcellenceSVG />} 
              delay={0.2}
            />
            <ValueCard 
              title={t("about.values.items.v3.title")} 
              desc={t("about.values.items.v3.desc")} 
              points={t("about.values.items.v3.points", { returnObjects: true }) as string[]}
              svg={<LeadershipSVG />} 
              delay={0.3}
            />
            <ValueCard 
              title={t("about.values.items.v4.title")} 
              desc={t("about.values.items.v4.desc")} 
              points={t("about.values.items.v4.points", { returnObjects: true }) as string[]}
              svg={<InnovationSVG />} 
              delay={0.4}
            />
          </div>
        </div>

        {/* Areas We Serve Section */}
        <div className="mt-20 border-t border-foreground/5 pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">{t("areas.title")}</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">{t("areas.subtitle")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AreaCard 
              title={t("areas.items.a1.title")} 
              desc={t("areas.items.a1.desc")} 
              svg={<IntegratedSecuritySVG />} 
              delay={0.1}
            />
            <AreaCard 
              title={t("areas.items.a2.title")} 
              desc={t("areas.items.a2.desc")} 
              svg={<MeteorologySVG />} 
              delay={0.2}
            />
            <AreaCard 
              title={t("areas.items.a3.title")} 
              desc={t("areas.items.a3.desc")} 
              svg={<PlaneSVG />} 
              delay={0.3}
            />
            <AreaCard 
              title={t("areas.items.a4.title")} 
              desc={t("areas.items.a4.desc")} 
              svg={<IctSVG />} 
              delay={0.4}
            />
            <AreaCard 
              title={t("areas.items.a5.title")} 
              desc={t("areas.items.a5.desc")} 
              svg={<MarineSVG />} 
              delay={0.5}
            />
            <AreaCard 
              title={t("areas.items.a6.title")} 
              desc={t("areas.items.a6.desc")} 
              svg={<EngineeringSVG />} 
              delay={0.6}
            />
          </div>
        </div>
          <FrameworkSection />
          <ShowcaseSection />
          <ClientsSection />
          <ServicesSection />
          <GallerySection />
          <StatsSection />
          <CTASection />
        </main>
      </div>
    </>
  );
}

/* ============================================================
   LOADING SCREEN (5-SECOND CRAZY TEXT ANIMATION)
   ============================================================ */
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 7.5 seconds total to allow the final phase to hold longer.
    const sequence = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2400),
      setTimeout(() => setPhase(3), 3600),
    ];
    const timer = setTimeout(onDone, 7500);

    return () => {
      sequence.forEach(clearTimeout);
      clearTimeout(timer);
    };
  }, [onDone]);

  const { t } = useTranslation();
  const words = [t("security.stages.s1.title"), t("security.stages.s2.title"), t("security.stages.s3.title"), "VISO GROUP"];
  const currentWord = words[phase];
  const finalLetters = "VISO GROUP".split("");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-20%", filter: "blur(20px)", transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] } }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden">

        {/* Background decorative text moving for extra motion */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 5, ease: "linear", repeat: Infinity }}
          className="absolute font-display text-[25vw] font-bold text-foreground/[0.02] whitespace-nowrap pointer-events-none"
        >
          SECURITY ARCHITECTURE SECURITY ARCHITECTURE
        </motion.div>

        <AnimatePresence mode="wait">
          {phase < 3 ? (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 50, skewY: 5, filter: "blur(10px)", scale: 0.9 }}
              animate={{ opacity: 1, y: 0, skewY: 0, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, y: -50, skewY: -5, filter: "blur(10px)", scale: 1.1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-5xl md:text-7xl lg:text-[100px] text-foreground tracking-tighter uppercase absolute"
            >
              {currentWord}
            </motion.div>
          ) : (
            <motion.div
              key="final"
              className="flex flex-col items-center justify-center absolute"
              style={{ perspective: 1000 }}
            >
              {/* Animated Logo */}
              <motion.img 
                src="https://res.cloudinary.com/dcefror3c/image/upload/v1782911668/Luxurious_black_and_gold_logo_design_kjv4np.png"
                alt="Viso Group Logo"
                initial={{ opacity: 0, scale: 0.5, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 1.5, 
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-48 h-auto md:w-64 mb-10 drop-shadow-[0_10px_30px_rgba(212,175,55,0.5)] object-contain"
              />

              {/* Staggered Typed Text */}
              <div className="flex items-center justify-center p-4">
                {finalLetters.map((l, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.2, 
                      delay: i * 0.1 + 0.8, // starts typing after logo appears
                      ease: "easeOut"
                    }}
                    className={`font-display font-black text-5xl md:text-8xl lg:text-[110px] tracking-tight uppercase text-primary drop-shadow-md ${l === " " ? "w-4 md:w-8" : ""}`}
                  >
                    {l}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ============================================================
   HERO SECTION (60/40 Split, Faded BG Text, Floating Render)
   ============================================================ */
const heroImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
];

export function HeroSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100vh] pt-20 pb-20 overflow-hidden flex items-center">
      {/* Oversized Faded Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none w-full flex justify-center z-0">
        <motion.h1
          style={{ y }}
          className="font-display font-bold text-[18vw] leading-none text-foreground/[0.02] tracking-tighter whitespace-nowrap"
        >
          INNOVATION
        </motion.h1>
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-8 md:px-16 grid lg:grid-cols-[60%_40%] gap-12 items-center relative z-10">

        {/* Left Side: Massive Typography */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          <div className="font-sans text-xs font-bold tracking-[0.3em] text-primary mb-6 uppercase flex items-center gap-4">
            <span className="w-12 h-px bg-primary"></span>
            {t("home.strategic_architecture")}
          </div>
          <h2 className="font-display text-6xl md:text-8xl lg:text-[110px] leading-[0.9] tracking-[-0.02em] text-foreground uppercase">
            {t("home.designing")} <br />
            <span className="text-primary italic font-light">{t("home.the_future")}</span>
          </h2>
          <h3 className="font-sans text-xl md:text-2xl font-light text-foreground/70 mt-8 max-w-xl leading-snug">
            {t("home.subtitle")}
          </h3>
          <p className="font-sans text-base text-foreground/50 mt-6 max-w-lg leading-relaxed">
            {t("home.desc")}
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-12">
            <Link to="/about" className="rounded-sm bg-primary px-8 py-4 font-sans text-xs font-bold tracking-[0.2em] text-white transition-all duration-400 hover:bg-secondary hover:scale-[1.03] shadow-[0_10px_30px_rgba(39,55,77,0.15)]">
              DISCOVER MORE
            </Link>
            <Link to="/home" className="rounded-sm border border-primary/20 bg-transparent px-8 py-4 font-sans text-xs font-bold tracking-[0.2em] text-primary transition-all duration-400 hover:border-primary hover:bg-primary/5 hover:scale-[1.03]">
              VIEW PROJECTS
            </Link>
          </div>
        </motion.div>

        {/* Right Side: Floating Renders */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[600px] hidden lg:block"
        >
          {/* Main Floating Render */}
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0 top-10 w-[95%] h-[550px] rounded overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.08)] z-10 bg-surface"
          >
            <AnimatePresence>
              <motion.img 
                key={currentImage}
                src={heroImages[currentImage]} 
                alt="Premium Architecture" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-full h-full object-cover absolute inset-0"
              />
            </AnimatePresence>
          </motion.div>

          {/* Circular Overlapping Image */}
          <motion.div
            animate={{ y: [15, -15, 15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute left-[-15%] bottom-16 w-72 h-72 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-8 border-background z-20 bg-surface flex items-center justify-center"
          >
            <img src="https://res.cloudinary.com/dcefror3c/image/upload/v1782911817/Luxurious_black_and_gold_logo_design-removebg-preview_pztvcs.png" alt="VISO Group Logo" className="w-[70%] h-[70%] object-contain drop-shadow-[0_10px_20px_rgba(212,175,55,0.2)]" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

/* ============================================================
   SERVICES SECTION (Swiss Editorial Layout)
   ============================================================ */
function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const services = [
    { num: "01", title: "Master Planning", desc: "Holistic site analysis and macro-scale architectural defensive zoning." },
    { num: "02", title: "Facade Engineering", desc: "Integrating blast-resistant aesthetics without compromising visual purity." },
    { num: "03", title: "Access Topography", desc: "Seamless flow management blending security gates into environmental design." },
  ];

  return (
    <section ref={ref} className="py-20 bg-white relative">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16">
        <div className="grid lg:grid-cols-2 gap-20">

          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-5xl md:text-7xl leading-tight text-foreground tracking-tight">
                Architectural <br /><span className="text-primary italic">Precision.</span>
              </h2>
              <p className="font-sans mt-8 text-lg text-foreground/60 max-w-md leading-relaxed">
                Our approach favors minimalism and strict geometric order, ensuring that safety protocols disappear into the elegance of the structure.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col gap-12 border-t border-foreground/10 pt-12">
            {services.map((srv, i) => (
              <motion.div
                key={srv.num}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[60px_1fr] gap-6 group cursor-pointer"
              >
                <div className="font-mono text-xs text-primary pt-2 group-hover:text-gold transition-colors duration-400">{srv.num} //</div>
                <div>
                  <h3 className="font-display text-3xl text-foreground group-hover:text-primary transition-colors duration-400">{srv.title}</h3>
                  <p className="font-sans text-sm text-foreground/50 mt-3 max-w-sm">{srv.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FRAMEWORK SECTION (TEASER)
   ============================================================ */
function FrameworkSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-surface-2 relative">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="font-mono text-xs font-bold tracking-[0.3em] text-primary mb-6 uppercase"
        >
          {t("framework.title_mono")}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl leading-tight text-foreground"
        >
          {t("framework.title_display")} <br />
          <span className="italic text-primary">{t("framework.title_display_italic")}</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-lg text-foreground/60 max-w-3xl mx-auto mt-8 leading-relaxed mb-16"
        >
          {t("framework.desc")}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left rtl:text-right">
          {[
            { id: 1, num: "01", title: t("security.stages.s1.title"), subtitle: t("security.stages.s1.subtitle") },
            { id: 2, num: "02", title: t("security.stages.s2.title"), subtitle: t("security.stages.s2.subtitle") },
            { id: 3, num: "03", title: t("security.stages.s3.title"), subtitle: t("security.stages.s3.subtitle") },
            { id: 4, num: "04", title: t("security.stages.s4.title"), subtitle: t("security.stages.s4.subtitle") }
          ].map((stage, i) => (
            <TiltCard key={stage.id} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + (i * 0.1) }}
                className="group relative bg-background border border-foreground/5 p-8 flex flex-col hover:border-gold/30 hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)] hover:-translate-y-2 transition-all duration-500 rounded-xl overflow-hidden min-h-[340px] h-full"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Faded Background Number */}
                <div className="absolute -bottom-4 -right-2 font-display text-[120px] font-bold text-foreground/[0.02] group-hover:text-gold/[0.05] transition-colors duration-500 pointer-events-none select-none z-0 leading-none">
                  {stage.num}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="font-mono text-xs tracking-widest text-primary mb-6 flex items-center gap-3">
                    <span className="w-4 h-px bg-primary/50 group-hover:bg-primary transition-colors"></span>
                    {t("security.stage")} {stage.num}
                  </div>
                  <h3 className="font-display text-2xl leading-snug mb-3 text-foreground group-hover:text-primary transition-colors duration-300">{stage.title}</h3>
                  <p className="font-sans text-sm text-foreground/60 mb-8 max-w-[90%]">{stage.subtitle}</p>
                  
                  <div className="mt-auto pt-8 border-t border-foreground/5 group-hover:border-gold/20 transition-colors duration-500">
                    <Link to="/security" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary group-hover:text-gold uppercase transition-colors">
                      {t("home.learn_more")}
                      <span className="text-lg rtl:rotate-180 inline-block transition-transform duration-300 group-hover:translate-x-2 rtl:group-hover:-translate-x-2">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ============================================================
   SHOWCASE SECTION (Parallax)
   ============================================================ */
function ShowcaseSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="py-16 overflow-hidden bg-background">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16">
        <div className="relative h-[70vh] rounded-xl overflow-hidden group">
          <motion.div style={{ y: y1 }} className="absolute inset-[-20%]">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Corporate Lobby" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors duration-700" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CLIENTS SECTION (Teaser)
   ============================================================ */
function ClientsSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const topClients = [
    { name: "Saudi Aramco", sector: "Oil & Gas", icon: "🛢️" },
    { name: "NEOM", sector: "Mega Project", icon: "🏙️" },
    { name: "SAMA", sector: "Government / Financial", icon: "🏛️" },
    { name: "Amazon", sector: "E-commerce", icon: "📦" },
    { name: "ACWA Power", sector: "Power & Water", icon: "💡" },
    { name: "Red Sea Global", sector: "Mega Project", icon: "🌊" },
  ];

  return (
    <section ref={ref} className="py-20 bg-background relative border-y border-foreground/5">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="font-mono text-xs font-bold tracking-[0.3em] text-primary mb-6 uppercase"
        >
          Trusted By
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl leading-tight text-foreground mb-16"
        >
          Industry <span className="italic text-primary">Titans.</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {topClients.map((client, i) => (
            <TiltCard key={i} className="h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
                className="bg-surface border border-foreground/5 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 h-full w-full"
              >
                <div className="text-4xl mb-4">{client.icon}</div>
                <h3 className="font-sans font-bold text-foreground text-sm">{client.name}</h3>
                <p className="font-mono text-[10px] text-foreground/50 mt-1 uppercase tracking-wider">{client.sector}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link to="/clients" className="inline-flex items-center gap-2 rounded-sm bg-surface-2 border border-foreground/10 px-8 py-4 font-sans text-xs font-bold tracking-[0.2em] text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 uppercase">
            View All Clients
            <span className="text-lg leading-none">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   GALLERY SECTION
   ============================================================ */
function GallerySection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const galleryImages = [
    "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHocOIHseXbk5L-q6ABIpO3Uj7RIBDCAfJQHmF03LVbsGfzNDD3hW8EC0INE_jnOx8wu6a2ieSSUVFfTn0NrWOBYRzwVJnw_rXvVP-CB41DkaYP2F4R-IEoOz2BSRi8yp-ZBK9KlA=w408-h306-k-no",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541888081699-272e259e8756?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <section ref={ref} className="py-20 bg-surface-2 relative">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="font-mono text-xs font-bold tracking-[0.3em] text-primary mb-6 uppercase"
        >
          Our Facilities
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl leading-tight text-foreground mb-16"
        >
          Visual <span className="italic text-primary">Gallery.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + (i * 0.1) }}
              className="group relative h-[300px] rounded-xl overflow-hidden shadow-lg border border-foreground/5 cursor-pointer"
            >
              <img src={src} alt={`Gallery Image ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white font-mono text-xs tracking-widest uppercase">View</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   STATS SECTION (Minimalist Typography)
   ============================================================ */
function AnimatedCounter({ from = 0, to, prefix = "", suffix = "", duration = 2.5, inView = true }: { from?: number, to: number, prefix?: string, suffix?: string, duration?: number, inView?: boolean }) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;
    
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration: duration,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = `${prefix}${Math.round(value)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [from, to, duration, inView, prefix, suffix]);

  return <span ref={nodeRef}>{prefix}{from}{suffix}</span>;
}

function StatsSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const inView = useInView(ref, { once: false, amount: 0.3 });

  const stats = [
    { target: 2, prefix: "$", suffix: "B+", label: "Assets Protected" },
    { target: 45, prefix: "", suffix: "", label: "Global Partners" },
    { target: 99, prefix: "", suffix: "%", label: "Design Compliance" },
  ];

  return (
    <section ref={ref} className="py-20 bg-white border-y border-foreground/5">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 text-center relative">
        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: 1 - scrollYProgress.get() * 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="font-mono text-[9px] tracking-[0.3em] text-foreground/40">{t("home.scroll_down")}</div>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-mono text-xs font-bold tracking-[0.3em] text-gold mb-16 uppercase"
        >
          Measurable Excellence
        </motion.div>

        <div className="grid md:grid-cols-3 gap-16 md:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="font-display text-7xl md:text-8xl text-primary font-light mb-6">
                <AnimatedCounter to={s.target} prefix={s.prefix} suffix={s.suffix} inView={inView} />
              </div>
              <div className="font-sans text-sm font-medium tracking-wide text-foreground/50">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA SECTION
   ============================================================ */
function CTASection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-surface-2 -skew-x-12 origin-top-right z-0" />
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex-1">
          <h2 className="font-display text-5xl md:text-7xl text-foreground leading-tight">
            Ready to shape <br /><span className="text-primary italic">the future?</span>
          </h2>
          <p className="font-sans text-lg text-foreground/60 mt-6 max-w-md mb-8">
            Connect with our lead architects and security consultants to begin your project.
          </p>
          <Link to="/others" className="inline-flex rounded-sm bg-primary px-10 py-5 font-sans text-sm font-bold tracking-[0.2em] text-white transition-all duration-400 hover:bg-gold hover:scale-[1.03] shadow-xl">
            SCHEDULE CONSULTATION
          </Link>
        </div>
        <div className="flex-1 w-full relative h-[400px] rounded-xl overflow-hidden shadow-2xl border border-foreground/10 z-10 group bg-surface">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none z-10"></div>
          <iframe 
            src="https://maps.google.com/maps?q=VISO+Group,+Riyadh&t=&z=14&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: "contrast(1.1) grayscale(0.2)" }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="VISO Group Location"
            className="absolute inset-0 z-0"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
function StatCard({ title, value, subtitle, svg, delay }: { title: string, value: string, subtitle?: string, svg: React.ReactNode, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
      className="relative group bg-surface border border-foreground/10 p-8 rounded-2xl overflow-hidden transition-all duration-500"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF9B2A]/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700" />
      <div className="h-16 w-16 mb-8 text-[#DF9B2A]">
        {svg}
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-foreground/50 mb-2">{title}</div>
      <div className="text-4xl md:text-5xl font-light text-foreground">{value}</div>
      {subtitle && <div className="text-sm text-foreground/60 mt-2">{subtitle}</div>}
    </motion.div>
  );
}

function CalendarSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <motion.rect x="3" y="4" width="18" height="18" rx="2" ry="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.line x1="16" y1="2" x2="16" y2="6" 
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      />
      <motion.line x1="8" y1="2" x2="8" y2="6" 
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
      />
      <motion.line x1="3" y1="10" x2="21" y2="10" 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
      <motion.circle cx="12" cy="15" r="1.5" fill="currentColor" 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      />
    </svg>
  );
}

function MapSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full relative">
      <motion.polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.line x1="9" y1="3" x2="9" y2="18" 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
      <motion.line x1="15" y1="6" x2="15" y2="21" 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      />
      
      {/* 5 Points for 5 locations */}
      {[
        { cx: 7, cy: 10, d: 1.0 },
        { cx: 12, cy: 8, d: 1.2 },
        { cx: 17, cy: 12, d: 1.4 },
        { cx: 10, cy: 15, d: 1.6 },
        { cx: 18, cy: 18, d: 1.8 },
      ].map((pt, i) => (
        <motion.circle key={i} cx={pt.cx} cy={pt.cy} r="1.5" fill="#DF9B2A" stroke="none"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
          transition={{ delay: pt.d, duration: 0.5 }}
        />
      ))}
    </svg>
  );
}

function ShieldSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <motion.path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path d="M9 12l2 2 4-4" 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 1 }}
      />
    </svg>
  );
}

function ChartSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <motion.path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        initial={{ pathLength: 0, opacity: 0.2 }}
        animate={{ pathLength: 1, opacity: 0.2 }}
        transition={{ duration: 0.1 }}
      />
      <motion.path d="M21 12a9 9 0 01-9 9M12 3a9 9 0 019 9" 
        stroke="#DF9B2A"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 0.5253 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
      />
      <motion.text x="12" y="14" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none" className="font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        %
      </motion.text>
    </svg>
  );
}

function ValueCard({ title, desc, points, svg, delay }: { title: string, desc: string, points: string[], svg: React.ReactNode, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative bg-surface border border-foreground/5 text-center hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-500 rounded-2xl flex flex-col items-center overflow-hidden h-[420px]"
    >
      {/* Default State */}
      <div className="absolute inset-0 p-8 flex flex-col items-center transition-transform duration-700 ease-out group-hover:-translate-y-[120%]">
        <div className="h-20 w-20 mb-8 mt-4 text-foreground group-hover:text-gold transition-colors duration-500">
          {svg}
        </div>
        <h3 className="font-display text-2xl mb-4 text-foreground">{title}</h3>
        <p className="font-sans text-sm text-foreground/60 leading-relaxed">
          {desc}
        </p>
      </div>
      
      {/* Hover State (Points) */}
      <div className="absolute inset-0 p-8 flex flex-col items-center justify-center translate-y-full opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 bg-surface">
        <div className="h-12 w-12 mb-6 text-gold drop-shadow-md">
          {svg}
        </div>
        <h3 className="font-display text-xl mb-6 text-foreground">{title}</h3>
        <ul className="text-left w-full space-y-4">
          {Array.isArray(points) && points.map((pt, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
              <span className="font-sans text-sm font-medium text-foreground/80">{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function HonestySVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <motion.path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
      <motion.path d="M9 12l2 2 4-4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
    </svg>
  );
}

function ExcellenceSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <motion.polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
    </svg>
  );
}

function LeadershipSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <motion.circle cx="12" cy="12" r="10" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
      <motion.polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
    </svg>
  );
}

function InnovationSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <motion.path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
      <motion.circle cx="12" cy="12" r="4" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} />
    </svg>
  );
}

function AreaCard({ title, desc, svg, delay }: { title: string, desc: string, svg: React.ReactNode, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group bg-surface/50 border border-foreground/5 p-10 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 transition-all duration-500 rounded-lg flex flex-col items-center text-center"
    >
      <div className="h-16 w-16 mb-6 text-primary group-hover:text-gold transition-colors duration-500 relative">
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-gold/10 rounded-full scale-150 transition-colors duration-500 -z-10 blur-xl"></div>
        {svg}
      </div>
      <h3 className="font-display font-semibold text-lg tracking-wide mb-3 text-foreground">{title}</h3>
      <p className="font-sans text-sm text-foreground/60 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

function IntegratedSecuritySVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-sm">
      <motion.path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
      <motion.circle cx="12" cy="11" r="2" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} />
      <motion.path d="M12 13v3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
      <motion.path d="M10.5 9.5L9 8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
      <motion.path d="M13.5 9.5L15 8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
    </svg>
  );
}

function MeteorologySVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-sm">
      <motion.path d="M17.5 19a4.5 4.5 0 00.5-8.9A7 7 0 006 8.5 5 5 0 005.5 18" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
      <motion.path d="M8 13a4 4 0 108 0 4 4 0 10-8 0" strokeDasharray="2 2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }} />
      <motion.path d="M12 9v1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
      <motion.path d="M12 16v1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
      <motion.path d="M9 12h-1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
      <motion.path d="M16 12h-1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
    </svg>
  );
}

function IctSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-sm">
      <motion.rect x="4" y="4" width="16" height="16" rx="2" ry="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
      <motion.path d="M4 12h16" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
      <motion.path d="M12 4v16" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
      <motion.circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.1" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
    </svg>
  );
}

function MarineSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-sm">
      <motion.path d="M2 12c2 0 3-2 5-2s3 2 5 2 3-2 5-2 3 2 5 2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
      <motion.path d="M2 18c2 0 3-2 5-2s3 2 5 2 3-2 5-2 3 2 5 2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }} />
      <motion.path d="M12 3v9" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
      <motion.path d="M9 6h6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} />
      <motion.path d="M12 12a3 3 0 00-3-3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
      <motion.path d="M12 12a3 3 0 013-3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
    </svg>
  );
}

function EngineeringSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-sm">
      <motion.path d="M12 3L4 21" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
      <motion.path d="M12 3l8 18" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
      <motion.path d="M8 13h8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} />
      <motion.circle cx="12" cy="5" r="2" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} />
      <motion.path d="M6 18c2.5-2 5.5-2 8 0" strokeDasharray="2 2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1 }} />
    </svg>
  );
}

function PlaneSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-sm">
      <motion.path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5 6.3 7.7l-1.6 1.6 6 3.4-3.6 3.6-2.8-.7-1.4 1.4 3.5 2 2 3.5 1.4-1.4-.7-2.8 3.6-3.6 3.4 6 1.6-1.6z" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
    </svg>
  );
}

/* ---------- helpers ---------- */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
      <span className="text-gold">{n}</span>
      <span className="h-px w-8 bg-border" />
      <span>{label}</span>
    </div>
  );
}

/* ---------- About ---------- */
function About() {
  const stats = [
    ["2020", "Established"],
    ["5", "Regional Offices"],
    ["92+", "Projects Delivered"],
    ["52.53%", "Local Content"],
  ] as const;
  return (
    <section id="about" className="relative px-6 py-16 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <SectionLabel n="01" label="About VISO" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-5xl leading-[1.05] text-balance md:text-6xl">
              Where security meets <em className="text-gradient-gold">peace of mind.</em>
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal delay={0.15}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              VISO is a premier physical security consultancy specializing in
              safeguarding our clients&apos; most valuable assets. Founded in January
              2020 and headquartered in Riyadh, we now operate from five offices
              across the Kingdom — delivering tailored solutions that align with
              national authorities and the highest international benchmarks.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground/80">
              Our team brings decades of combined experience in security analysis,
              risk assessment and integrated protective measures across critical
              national infrastructure, energy, industrial, financial and government
              sectors.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
            {stats.map(([n, l], i) => (
              <Reveal key={l} delay={0.3 + i * 0.08}>
                <div className="bg-background p-6">
                  <div className="font-display text-4xl text-gold">{n}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {l}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}