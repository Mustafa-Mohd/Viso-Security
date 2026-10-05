import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { TopNav } from "@/components/TopNav";
import { TypewriterText } from "@/components/TypewriterText";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "VISO | About" },
      {
        name: "description",
        content:
          "VISO Security Consultancy — physical security architecture across the Kingdom of Saudi Arabia.",
      },
    ],
  }),
});

const ease = [0.16, 1, 0.3, 1] as const;

const defaultServices = [
  {
    title: "Security Consulting",
    desc: "Full physical security lifecycle — from risk assessment through operational readiness.",
  },
  {
    title: "Translation",
    desc: "Certified translation supporting regulatory submissions and multilingual delivery.",
  },
  {
    title: "Digital Portal",
    desc: "Secure employee access and document management for project teams.",
  },
  {
    title: "SAIS Alignment",
    desc: "Regulatory coordination and compliance with national security directives.",
  },
];

const defaultProfile = [
  {
    num: "01",
    title: "Identity & Positioning",
    desc: "Clear corporate introduction, value proposition and service positioning.",
  },
  {
    num: "02",
    title: "Capabilities & Lifecycle",
    desc: "Four connected security consultancy stages from concept to handover.",
  },
  {
    num: "03",
    title: "Sectors & Clients",
    desc: "Approved client logos, sectors and project environments across the Kingdom.",
  },
  {
    num: "04",
    title: "Credentials & Verification",
    desc: "Licensing, qualification and official verification links.",
  },
];

function AboutPage() {
  const { t } = useTranslation();
  const [cms, setCms] = useState<any>(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("cms_content")
          .select("*")
          .eq("section_key", "about")
          .maybeSingle();
        if (data?.content) setCms(data.content);
      } catch {
        /* use defaults */
      }
    }
    load();
  }, []);

  const whoTitle =
    cms?.whoWeAreTitle || t("about.title") + " " + t("about.title_italic");
  const whoDesc = cms?.whoWeAreDesc || t("about.desc1");

  const profile =
    cms?.profileContents?.length > 0 ? cms.profileContents : defaultProfile;

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-foreground tracking-tight mb-6">
                Welcome to the <span className="text-primary">VISO Group</span>
              </h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
                className="h-1 bg-primary mx-auto rounded-full" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden ${showIntro ? 'h-screen overflow-hidden' : ''}`}>
        <TopNav />
      <AboutHero />
      <CEOMessage />
      <WhoWeAre title={whoTitle} desc={whoDesc} secondary={t("about.desc2")} />
      <VisionMission />
      <StatsBand />
      <RegulatoryCards />
      <ProfileJourney items={profile} />
      <LicensesAndCertifications />
      <AboutCta />
      <AboutFooter />
      </div>
    </>
  );
}

/* ---------- Hero ---------- */
function AboutHero() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex items-end overflow-hidden"
    >
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/dppwnds6z/image/upload/v1790599106/ChatGPT_Image_Sep_28_2026_06_08_11_PM.png"
          alt="About Hero Background"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-[120%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </motion.div>

      {/* Ambient gold wash */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/[0.07] to-transparent pointer-events-none" />

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-[1600px] mx-auto px-8 md:px-16 pb-20 md:pb-28 pt-40"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          className="font-sans text-[11px] font-bold tracking-[0.35em] text-primary uppercase mb-8 flex items-center gap-4"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="origin-left inline-block w-14 h-px bg-primary"
          />
          {t("about_page.est")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
          className="font-display text-[14vw] md:text-[9vw] leading-[0.85] tracking-[-0.04em] uppercase text-white max-w-5xl"
        >
          VISO
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease }}
          className="font-mono text-[10px] md:text-sm tracking-[0.2em] text-primary uppercase mt-6 mb-2 flex items-center whitespace-nowrap"
        >
          <span className="text-white">{t("about_page.vision_for")}&nbsp;</span>
          <TypewriterText phrases={[t("about_page.sec_consult"), t("about_page.trans_services")]} className="min-w-[200px] md:min-w-[250px]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease }}
          className="mt-6 md:mt-8 font-display text-2xl md:text-4xl lg:text-5xl text-white/90 max-w-2xl leading-[1.15] tracking-tight"
        >
          {t("about_page.hero_title")}{" "}
          <em className="text-primary not-italic font-light">{t("about_page.hero_title_italic")}</em>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="mt-5 max-w-lg text-sm md:text-base text-white/70 leading-relaxed font-light"
        >
          {t("about_page.hero_desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="mt-10 flex items-center gap-8"
        >
          <a
            href="#who"
            className="rounded-sm bg-primary px-8 py-4 font-sans text-xs font-bold tracking-[0.2em] text-white transition-all duration-400 hover:bg-secondary hover:scale-[1.03]"
          >
            {t("about.who_we_are")}
          </a>
          <Link
            to="/security"
            className="font-sans text-xs font-bold tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors"
          >
            {t("about_page.explore")} →
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 right-8 md:right-16 z-10 hidden md:flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-foreground/40 uppercase rotate-90 origin-center translate-x-3 mb-8">
          {t("about_page.scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}

/* ---------- Enhanced Animated Text Component ---------- */
function AnimatedText({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: () => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay * 0.2 },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      filter: "blur(4px)",
    },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="inline-block mr-1.5">
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
}

/* ---------- Interactive 3D Logo Component ---------- */
function ThreeDLogoInteractive() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-300, 300], [25, -25]);
  const rotateY = useTransform(x, [-300, 300], [-25, 25]);
  
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl bg-white flex items-center justify-center border border-black/5 group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1500 }}
    >
      {/* Dynamic Background Gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-primary/10 opacity-50 transition-opacity duration-700 group-hover:opacity-80"
        style={{
           x: useTransform(x, [-300, 300], [-20, 20]),
           y: useTransform(y, [-300, 300], [-20, 20]),
        }}
      />
      
      <motion.div
        style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Glow */}
        <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.2, 0.4, 0.2] 
           }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           className="absolute w-[70%] h-[70%] bg-gold/20 blur-[100px] rounded-full"
           style={{ translateZ: -60 }}
        />
        
        {/* Logo Image */}
        <motion.img
          src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png"
          alt="VISO Logo 3D"
          className="w-1/2 md:w-[60%] object-contain drop-shadow-[0_20px_40px_rgba(212,175,55,0.4)] pointer-events-none"
          style={{ translateZ: 120 }}
          animate={{ y: [-12, 12, -12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Rings */}
        <motion.div
           className="absolute w-[80%] h-[80%] rounded-full border border-gold/10 pointer-events-none"
           style={{ translateZ: 60 }}
           animate={{ rotate: 360, scale: [1, 1.05, 1] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
           className="absolute w-[90%] h-[90%] rounded-full border border-primary/10 pointer-events-none"
           style={{ translateZ: 20 }}
           animate={{ rotate: -360, scale: [1, 1.02, 1] }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <div className="absolute bottom-6 left-6 right-6">
        <p className="font-mono text-[10px] tracking-[0.25em] text-gold uppercase drop-shadow-md">
          VISO GROUP HEADQUARTERS
        </p>
      </div>
    </div>
  );
}

/* ---------- Who We Are ---------- */
function WhoWeAre({
  title,
  desc,
  secondary,
}: {
  title: string;
  desc: string;
  secondary: string;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      id="who"
      ref={ref}
      className="relative px-8 md:px-16 py-12 md:py-20 overflow-hidden"
    >
      <div className="relative z-10 max-w-[1600px] mx-auto bg-surface border border-foreground/10 rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-sm transition-all duration-700 hover:shadow-xl hover:border-gold/30">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side: 3D Interactive Logo */}
          <div className="order-2 lg:order-1">
            <Reveal delay={0.25}>
              <ThreeDLogoInteractive />
            </Reveal>
          </div>

          {/* Right Side: Information */}
          <div className="order-1 lg:order-2 space-y-6">
            <Reveal delay={0.1}>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] leading-[1.1] tracking-tight text-foreground whitespace-nowrap">
                {title.includes("Peace") || title.includes("meets") || title.includes("يلتقي") ? (
                  <>
                    {t("about_page.story_title")}{" "}
                    <em className="text-primary not-italic font-light relative">
                      {t("about_page.story_italic")}
                      <motion.span 
                         initial={{ scaleX: 0 }}
                         whileInView={{ scaleX: 1 }}
                         viewport={{ once: true }}
                         transition={{ duration: 1, delay: 0.5 }}
                         className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-transparent origin-left"
                      />
                    </em>
                  </>
                ) : (
                  title
                )}
              </h2>
            </Reveal>

            <AnimatedText 
              text={desc} 
              delay={2}
              className="text-base md:text-lg text-foreground/90 leading-relaxed font-light text-justify"
            />
            
            <AnimatedText 
              text={secondary} 
              delay={4}
              className="text-sm md:text-base text-foreground/80 leading-relaxed font-light text-justify mt-4"
            />

            <Reveal delay={0.5}>
              <div className="pt-6 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-foreground/10">
                {[
                  { label: t("about_page.founded_label"), value: t("about_page.founded_val") },
                  { label: t("about_page.hq_label"), value: t("about_page.hq_val") },
                  { label: t("about_page.coverage_label"), value: t("about_page.coverage_val") },
                  { label: t("about_page.focus_label"), value: t("about_page.focus_val") },
                ].map((item, idx) => (
                  <motion.div 
                    key={item.label} 
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                  >
                    <div className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase mb-1.5 flex items-center gap-2">
                      <span className="w-2 h-px bg-primary/50 group-hover:bg-primary transition-colors duration-300 group-hover:w-4" />
                      {item.label}
                    </div>
                    <div className="font-display text-lg md:text-xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-500 group-hover:translate-x-1 transform">
                      {item.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CEO Message ---------- */
function CEOMessage() {
  const { t } = useTranslation();

  return (
    <section className="relative px-8 md:px-16 py-16 md:py-24 bg-background overflow-hidden border-t border-foreground/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal delay={0.1}>
              <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-sm overflow-hidden group">
                <ParallaxImage
                  src="https://res.cloudinary.com/dppwnds6z/image/upload/v1790273889/WhatsApp_Image_2026-09-24_at_4.52.27_PM.jpg"
                  alt="CEO of VISO Group"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="font-display text-2xl md:text-3xl text-white font-bold tracking-tight mb-1">
                    {t("about_page.ceo_name")}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase">
                    {t("about_page.founder_ceo")}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase mt-2 flex items-center whitespace-nowrap">
                    <span className="text-white">{t("about_page.vision_for")}&nbsp;</span>
                    <TypewriterText phrases={[t("about_page.sec_consult"), t("about_page.trans_services")]} className="text-primary ml-1" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 lg:pl-10">
            <Reveal delay={0.2}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-10">
                {t("about_page.msg_title1")} <br />
                <em className="text-primary not-italic font-light">{t("about_page.msg_title2")}</em>
              </h2>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="relative border-l-4 border-primary/60 pl-6 md:pl-8 py-2">
                <p className="text-lg md:text-xl lg:text-2xl text-foreground/90 leading-relaxed font-light mb-5 relative z-10 text-justify">
                  {t("about_page.msg_p1")}
                </p>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-light mb-4 text-justify">
                  {t("about_page.msg_p2")}
                </p>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-light mb-4 text-justify">
                  {t("about_page.msg_p3")}
                </p>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-light mb-4 text-justify">
                  {t("about_page.msg_p4")}
                </p>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-light text-justify">
                  {t("about_page.msg_p5")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Vision & Mission ---------- */
function VisionMission() {
  const { t } = useTranslation();
  return (
    <section className="relative px-8 md:px-16 py-20 md:py-32 bg-background overflow-hidden border-t border-foreground/5">
      <div className="max-w-[1600px] mx-auto">
        <Reveal delay={0.1}>
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-6">
              {t("about_page.vm_title")}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary via-gold to-secondary mx-auto rounded-full" />
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
          {/* Vision Card */}
          <Reveal delay={0.15}>
            <div className="group relative h-full p-8 lg:p-12 border border-foreground/10 bg-surface rounded-[2rem] shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-gold to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <h3 className="font-sans font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-3 group-hover:text-primary transition-colors duration-500">
                  {t("about_page.vision_h3")}
                </h3>
                <div className="font-sans text-[13px] font-semibold tracking-[0.1em] text-[#B8860B] uppercase mb-6">
                  {t("about_page.vision_sub")}
                </div>
                <p className="text-foreground/80 leading-relaxed font-normal text-base md:text-lg text-justify hyphens-none">
                  {t("about_page.vision_p")}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Mission Card */}
          <Reveal delay={0.25}>
            <div className="group relative h-full p-8 lg:p-12 border border-foreground/10 bg-surface rounded-[2rem] shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-gold to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <h3 className="font-sans font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-3 group-hover:text-primary transition-colors duration-500">
                  {t("about_page.mission_h3")}
                </h3>
                <div className="font-sans text-[13px] font-semibold tracking-[0.1em] text-[#B8860B] uppercase mb-6">
                  {t("about_page.mission_sub")}
                </div>
                <p className="text-foreground/80 leading-relaxed font-normal text-base md:text-lg text-justify hyphens-none">
                  {t("about_page.mission_p")}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Values Card */}
          <Reveal delay={0.35}>
            <div className="group relative h-full p-8 lg:p-12 border border-foreground/10 bg-surface rounded-[2rem] shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-gold to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <h3 className="font-sans font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-3 group-hover:text-primary transition-colors duration-500">
                  {t("about_page.values_h3")}
                </h3>
                <div className="font-sans text-[13px] font-semibold tracking-[0.1em] text-[#B8860B] uppercase mb-6">
                  {t("about_page.values_sub")}
                </div>
                <p className="text-foreground/80 leading-relaxed font-normal text-base md:text-lg text-justify hyphens-none">
                  {t("about_page.values_p")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Stats ---------- */
function StatsBand() {
  const { t } = useTranslation();
  const stats = [
    { value: 2019, suffix: "", label: t("about.stats.established"), prefix: "" },
    { value: 4, suffix: "", label: t("about.stats.offices"), prefix: "" },
    { value: 120, suffix: "+", label: t("about.stats.projects"), prefix: "" },
    { value: 100, suffix: "%", label: "CLIENT SATISFACTION", prefix: "" },
  ];

  return (
    <section className="relative border-y border-foreground/10 bg-foreground text-background overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        className="absolute top-1/2 -translate-y-1/2 font-display font-bold text-[18vw] text-background/[0.04] whitespace-nowrap pointer-events-none select-none"
      >
        SECURITY · ARCHITECTURE · CONSULTANCY · SECURITY · ARCHITECTURE ·
        CONSULTANCY ·
      </motion.div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-8 md:px-16 py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  prefix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, value, delay, mv, spring]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease }}
      className="text-center lg:text-left"
    >
      <div className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-primary tabular-nums">
        {display}
        {suffix}
      </div>
      <div className="mt-3 font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-background/45">
        {label}
      </div>
    </motion.div>
  );
}

/* ---------- Capabilities ---------- */
function Capabilities({
  services,
  title,
  subtitle,
}: {
  services: { title: string; desc: string }[];
  title: string;
  subtitle: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <section className="relative px-8 md:px-16 py-24 md:py-36 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="max-w-3xl mb-16 md:mb-24">

          <Reveal delay={0.1}>
            <div className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase mb-6 flex items-center gap-4">
              <span className="w-8 h-px bg-primary" />
              About VISO
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-foreground drop-shadow-sm">
              <TypewriterEffect text={title} />
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-foreground/50 leading-relaxed font-light max-w-xl">
              {subtitle}
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 space-y-1">
            {services.map((srv, i) => (
              <Reveal key={srv.title} delay={0.05 * i}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`w-full text-left group flex items-start gap-5 py-5 md:py-6 border-b border-foreground/10 transition-colors duration-500 ${active === i ? "border-primary/40" : ""
                    }`}
                >
                  <span
                    className={`font-mono text-xs tracking-widest pt-1 transition-colors duration-500 ${active === i ? "text-primary" : "text-foreground/30"
                      }`}
                  >
                    0{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-display text-xl md:text-2xl tracking-tight transition-colors duration-500 ${active === i ? "text-foreground" : "text-foreground/45"
                        }`}
                    >
                      {srv.title}
                    </h3>
                    <motion.p
                      initial={false}
                      animate={{
                        height: active === i ? "auto" : 0,
                        opacity: active === i ? 1 : 0,
                        marginTop: active === i ? 8 : 0,
                      }}
                      transition={{ duration: 0.4, ease }}
                      className="overflow-hidden text-sm text-foreground/55 font-light leading-relaxed"
                    >
                      {srv.desc}
                    </motion.p>
                  </div>
                  <motion.span
                    animate={{ x: active === i ? 0 : -4, opacity: active === i ? 1 : 0 }}
                    className="text-primary pt-1 text-lg"
                  >
                    →
                  </motion.span>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-7 relative min-h-[320px] md:min-h-[480px]">
            <div className="sticky top-28 h-[320px] md:h-[480px] overflow-hidden rounded-sm">
              <AnimateCapabilityVisual index={active} />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="font-display text-2xl md:text-3xl text-white tracking-tight max-w-md"
                >
                  {services[active]?.title}
                </motion.p>
                <motion.p
                  key={`d-${active}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-3 text-sm text-white/70 max-w-md font-light"
                >
                  {services[active]?.desc}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const capabilityImages = [
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
];

function AnimateCapabilityVisual({ index }: { index: number }) {
  return (
    <motion.img
      key={index}
      src={capabilityImages[index % capabilityImages.length]}
      alt=""
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.85, ease }}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

/* ---------- Profile Journey ---------- */
function ProfileJourney({
  items,
}: {
  items: { num: string; title: string; desc: string }[];
}) {
  return (
    <section className="relative px-8 md:px-16 py-24 md:py-32 bg-surface-2/50 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">

        <Reveal delay={0.1}>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-16 md:mb-20 max-w-xl">
            How we present{" "}
            <em className="text-primary not-italic font-light">VISO</em>
          </h2>
        </Reveal>

        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/10 hidden md:block" />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease }}
            className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/60 to-transparent origin-top hidden md:block"
          />

          <div className="space-y-0">
            {items.map((item, i) => (
              <Reveal key={item.num} delay={0.08 * i}>
                <div className="group relative md:pl-14 py-8 md:py-10 border-b border-foreground/8 last:border-0">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-background border-2 border-primary opacity-0 md:opacity-100 group-hover:scale-125 transition-transform duration-500 hidden md:block" />

                  <div className="grid md:grid-cols-12 gap-4 md:gap-8 items-baseline">
                    <div className="md:col-span-2">
                      <span className="font-display text-4xl md:text-5xl text-primary/80 tracking-tight group-hover:text-primary transition-colors duration-500">
                        {item.num}
                      </span>
                    </div>
                    <div className="md:col-span-4">
                      <h3 className="font-display text-xl md:text-2xl tracking-tight text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <div className="md:col-span-6">
                      <p className="text-sm md:text-base text-foreground/50 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
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

/* ---------- CTA ---------- */
function AboutCta() {
  const { t } = useTranslation();
  return (
    <section className="relative px-8 md:px-16 py-28 md:py-40 overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=2400&q=80"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight max-w-3xl leading-[1.05] text-white">
            {t("about_page.ready_title")}{" "}
            <em className="text-primary not-italic font-light">{t("about_page.ready_italic")}</em>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 text-white/70 max-w-md font-light leading-relaxed">
            {t("about_page.ready_desc")}
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-wrap gap-5">
            <Link
              to="/contact"
              className="rounded-sm bg-primary px-8 py-4 font-sans text-xs font-bold tracking-[0.2em] text-white transition-all duration-400 hover:bg-secondary hover:scale-[1.03]"
            >
              {t("about_page.contact_team")}
            </Link>
            <Link
              to="/security"
              className="rounded-sm border border-white/20 px-8 py-4 font-sans text-xs font-bold tracking-[0.2em] text-white/80 transition-all duration-400 hover:border-primary hover:text-primary"
            >
              {t("about_page.view_framework")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AboutFooter() {
  return (
    <footer className="bg-white text-black py-12 border-t border-black/10">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <img
          src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png"
          alt="VISO"
          loading="lazy"
          decoding="async"
          className="h-10 w-auto object-contain"
        />
        <p className="font-sans text-xs text-black/50 tracking-wide">
          © {new Date().getFullYear()} VISO Group. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 font-sans text-xs text-black/60">
          <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          <Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Regulatory Cards ---------- */
function RegulatoryCards() {
  const cards: Array<{ title: string; desc: string; url: string; logo: string; color: string; logoBg?: string }> = [
    {
      title: "SAIS",
      desc: "Supreme Authority for Industrial Security Standards.",
      url: "/regulatory/sais",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBwqTj0FNNJJm59mHR1GKznOvHK23QpPB5jwKZQuFaQ&s=10",
      color: "from-emerald-100 to-emerald-50 border-emerald-200 hover:border-emerald-300 shadow-sm"
    },
    {
      title: "ARAMCO",
      desc: "Saudi Aramco Safety and Security Standards.",
      url: "/regulatory/aramco",
      logo: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790621083/aramco.jpg",
      color: "from-cyan-100 to-cyan-50 border-cyan-200 hover:border-cyan-300 shadow-sm"
    },
    {
      title: "NEOM",
      desc: "NEOM Public Safety & Security Consultancy Services.",
      url: "/regulatory/neom",
      logo: "https://neom.scene7.com/is/image/neom/logo-neom-en-spaced?fmt=png-alpha&scl=1",
      color: "from-purple-100 to-purple-50 border-purple-200 hover:border-purple-300 shadow-sm"
    },
    {
      title: "API",
      desc: "Security Risk Assessment for Petroleum & Petrochemical Industries.",
      url: "/regulatory/api780",
      logo: "https://theshopmag.com/wp-content/uploads/2023/05/api-logo-stacked.png",
      color: "from-sky-100 to-sky-50 border-sky-200 hover:border-sky-300 shadow-sm"
    },
    {
      title: "MOI",
      desc: "Ministry of Interior Regulatory Frameworks.",
      url: "/regulatory/moi",
      logo: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790599258/download.png",
      color: "from-blue-100 to-blue-50 border-blue-200 hover:border-blue-300 shadow-sm"
    }
  ];

  return (
    <section className="py-24 bg-background relative z-10 border-t border-foreground/10">
      <div className="mx-auto max-w-[1600px] px-8 md:px-16">
        <div className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="h-px w-8 bg-primary" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Governance
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            Standards and Compliance
          </motion.h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((card, i) => (
            <Link key={i} to={card.url} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative h-full flex flex-col p-6 md:p-8 rounded-[2rem] border bg-gradient-to-br ${card.color} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden`}
              >
                {/* Decorative background element */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-foreground/5 rounded-full blur-2xl group-hover:bg-foreground/10 transition-colors duration-500 pointer-events-none" />

                <div className={`mb-8 w-28 h-28 md:w-32 md:h-32 ${card.logoBg || "bg-white"} rounded-2xl p-4 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-foreground/5 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                  <img src={card.logo} alt={card.title} className="max-h-full max-w-full object-contain" />
                </div>

                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3 relative z-10 group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-foreground/75 font-sans text-sm md:text-base leading-relaxed mb-8 flex-grow relative z-10 max-w-sm">{card.desc}</p>
                <div className="mt-auto flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-foreground/50 group-hover:text-primary transition-colors relative z-10">
                  <span>Explore Framework</span>
                  <span className="transform transition-transform group-hover:translate-x-2">→</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.img
        style={{ y }}
        src={src}
        alt={alt}
        className="h-[125%] w-full object-cover"
      />
    </div>
  );
}

function TypewriterEffect({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [text, inView]);

  return (
    <span ref={ref}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[0.1em] h-[0.9em] bg-primary ml-1 align-middle translate-y-[-0.05em]"
      />
    </span>
  );
}

/* ---------- Licenses & Certifications ---------- */
const certificatesData = [
  {
    org: "CR 2026-2027",
    certs: ["Commercial Register"],
    img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790100377/8aef84d0-fbe6-426d-b485-b4241b30daae.png"
  },
  {
    org: "Business License",
    certs: ["Official Business License"],
    img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790100602/3d24f59b-1530-4316-bd0d-27ac9167ccff.png"
  },
  {
    org: "SAIS Certificate",
    certs: ["SAIS Official Certification"],
    img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790100668/865e7db3-7be4-4ed4-920e-e0a8b29af7bb.png"
  },
  {
    org: "Higher Commission for Industrial Security (HCIS)",
    certs: ["License to Practice Security Consultancy", "Security Consultancy Qualification Certificate"],
    img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790755927/ChatGPT_Image_Sep_30__2026__01_39_49_PM-removebg-preview.png"
  },
  {
    org: "Literature, Publishing & Translation commission",
    certs: ["License to Practice Translation Profession"],
    img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790757968/ChatGPT_Image_Sep_30_2026_02_15_55_PM.png"
  },
  {
    org: "Ministry of Commerce",
    certs: ["Commercial Register for Security Consultancy Activities", "Commercial Register for Translation Activities"],
    img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790600382/imgi_14_Ministry-of-commerce.png"
  },
  {
    org: "Balady",
    certs: ["Municipal License"],
    img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790600394/imgi_15_Balady.png"
  },
  {
    org: "ISO 9001:2015",
    certs: ["Quality Management System", "Security Risk Assessment, Preliminary Design of Security System, Detail Design of Security System, Operational Readiness"],
    img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790600390/imgi_16_ISO9001.jpg"
  },
  {
    org: "ISO 45001:2018",
    certs: ["Occupational Health & Safety Management System", "Security Risk Assessment, Preliminary Design of Security System, Detail Design of Security System, Operational Readiness"],
    img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790600410/imgi_17_ISO45001.png"
  }
];

function LicensesAndCertifications() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <section id="licenses" className="relative z-20 bg-background py-24 border-t border-foreground/10">
        <div className="mx-auto max-w-[1600px] px-8 md:px-16">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
            >
              Accreditations
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
              Licenses &amp; Certifications
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl mx-auto text-foreground/60 text-lg"
            >
              Our official licenses, credentials, and international certifications underscoring our commitment to compliance and excellence.
            </motion.p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {certificatesData.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-foreground/10 bg-surface shadow-sm hover:shadow-xl transition-all duration-500 hover:border-primary/40"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                {/* Clickable Image Container */}
                <div
                  className="w-full bg-white flex items-center justify-center border-b border-foreground/10 overflow-hidden relative h-64 md:h-72 cursor-pointer"
                  onClick={() => setSelectedImage(item.img)}
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.img}
                    alt={item.org}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                  />

                  {/* Zoom indicator overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-sm text-white rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-8 flex flex-col flex-1 bg-surface relative z-10">
                  <h3 className="text-xl font-display font-bold text-foreground mb-4 leading-snug group-hover:text-primary transition-colors duration-300">
                    {item.org}
                  </h3>
                  <ul className="space-y-3 mt-auto">
                    {item.certs.map((c, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm md:text-base text-foreground/75 leading-relaxed font-light">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Certificate Preview"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-white p-2 md:p-6 cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 transition-colors p-3 rounded-full cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
