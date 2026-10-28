import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, useMemo } from "react";
import { TiltCard } from "@/components/TiltCard";
import { motion, useScroll, useTransform, useInView, AnimatePresence, animate, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TopNav } from "@/components/TopNav";
import { supabase } from "@/lib/supabase";
import { LazyMount } from "@/components/LazyMount";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { clientCategoriesData, ClientLogo, useClientCategories, CLIENT_SECTORS_AR, CLIENT_NAMES_AR } from "@/data/clientsData";
import { X, FileText, Briefcase, ShieldCheck, Award, Star, HeartHandshake, Target, Sparkles } from "lucide-react";

import { AboutInteractive } from "@/components/AboutInteractive";
import { LocationsSection } from "@/components/LocationsSection";
import { LinkedInEmbed } from "@/components/LinkedInEmbed";

function SectionFallback({ h = 320 }: { h?: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-sm bg-foreground/[0.04]"
      style={{ minHeight: h }}
      aria-hidden
    />
  );
}

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
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("viso_intro_seen");
    }
    return true;
  });
  const [cmsData, setCmsData] = useState<Record<string, any>>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("viso_cms_cache");
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  useEffect(() => {
    async function fetchCmsData() {
      try {
        const { data } = await supabase.from('cms_content').select('*');
        if (data) {
          const mapped = data.reduce((acc, row) => ({ ...acc, [row.section_key]: row.content }), {});
          setCmsData(mapped);
          if (typeof window !== "undefined") {
            localStorage.setItem("viso_cms_cache", JSON.stringify(mapped));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchCmsData();

    const handleCmsUpdated = () => {
      fetchCmsData();
    };
    window.addEventListener("viso_cms_updated", handleCmsUpdated);
    return () => window.removeEventListener("viso_cms_updated", handleCmsUpdated);
  }, [t]);

  const handleLoaderDone = () => {
    sessionStorage.setItem("viso_intro_seen", "true");
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingScreen onDone={handleLoaderDone} />}
      <div className="bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary">
        <TopNav />
        <main>
          <HeroSection data={cmsData.hero} isReady={!loading} />

          <LazyMount minHeight={720} fallback={<SectionFallback h={720} />}>
            <Suspense fallback={<SectionFallback h={720} />}>
              <About data={cmsData.about} />
            </Suspense>
          </LazyMount>

          <LazyMount minHeight={520} fallback={<SectionFallback h={520} />}>
            <div className="mt-8 md:mt-12 border-t border-foreground/5 pt-8 md:pt-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-center mb-4 md:mb-8"
              >
                <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">
                  {i18n.language === 'ar' ? (
                    <span className="text-gold">{t("home_interactive.our_services")}</span>
                  ) : (
                    <>
                      {t("home_interactive.our_services").split(' ')[0]} <span className="text-gold">{t("home_interactive.our_services").split(' ').slice(1).join(' ')}</span>
                    </>
                  )}
                </h2>
                <p className="text-lg text-black max-w-2xl mx-auto">{t("home_interactive.our_services_desc")}</p>
              </motion.div>

              <ServicesCarousel items={[
                {
                  title: t("home_interactive.services_carousel.sc_title"),
                  desc: t("home_interactive.services_carousel.sc_desc"),
                  url: "/security",
                  img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790589737/ChatGPT_Image_Sep_28_2026_03_32_06_PM.png",
                  color: "group-hover:border-blue-500/50 group-hover:shadow-blue-500/20",
                  moreInfo: t("home_interactive.services_carousel.sc_more")
                },
                {
                  title: t("home_interactive.services_carousel.trans_title"),
                  desc: t("home_interactive.services_carousel.trans_desc"),
                  url: "/translation",
                  img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
                  color: "group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/20",
                  moreInfo: t("home_interactive.services_carousel.trans_more")
                },
                {
                  title: t("home_interactive.services_carousel.train_title"),
                  desc: t("home_interactive.services_carousel.train_desc"),
                  url: "/services/training",
                  img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1792398542/1781183794364.jpg",
                  color: "group-hover:border-purple-500/50 group-hover:shadow-purple-500/20",
                  moreInfo: t("home_interactive.services_carousel.train_more")
                },
                {
                  title: t("home_interactive.services_carousel.ind_title"),
                  desc: t("home_interactive.services_carousel.ind_desc"),
                  url: "/services/industrial",
                  img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
                  color: "group-hover:border-orange-500/50 group-hover:shadow-orange-500/20",
                  moreInfo: t("home_interactive.services_carousel.ind_more")
                },
                {
                  title: t("home_interactive.services_carousel.gap_title"),
                  desc: t("home_interactive.services_carousel.gap_desc"),
                  url: "/services/gap-analysis",
                  img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
                  color: "group-hover:border-red-500/50 group-hover:shadow-red-500/20",
                  moreInfo: t("home_interactive.services_carousel.gap_more")
                },
                {
                  title: i18n.language === 'ar'
                    ? t("home_interactive.services_carousel.pm_title", "إدارة المشاريع")
                    : t("home_interactive.services_carousel.pm_title", "Project Management"),
                  desc: i18n.language === 'ar'
                    ? t("home_interactive.services_carousel.pm_desc", "إشراف هندسي وتنفيذي خبير على مشاريع هندسة الأمن المادي من الفكرة والتخطيط وحتى التسليم النهائي.")
                    : t("home_interactive.services_carousel.pm_desc", "Expert oversight and execution of high-end security architecture projects from conception to completion."),
                  url: "/services/project-management",
                  img: "/project_management.jpg",
                  color: "group-hover:border-yellow-500/50 group-hover:shadow-yellow-500/20",
                  moreInfo: i18n.language === 'ar'
                    ? t("home_interactive.services_carousel.pm_more", "تضمن فرق إدارة المشاريع المتخصصة في فيسو تنفيذ وتجهيز بنيتك التحتية الأمنية في الوقت المحدد، وضمن الميزانية المعتمدة، ووفق أعلى معايير الجودة والاشتراطات التنظيمية. نقدم خدمات تمثيل مهندس المالك، والإشراف الفني المستقل على المقاولين، ومراجعة التقديمات الفنية، وتتبع الجداول الزمنية بدقة متناهية لضمان تكامل أمني لا تشوبه شائبة في جميع منشآتكم.")
                    : t("home_interactive.services_carousel.pm_more", "Our dedicated project management teams ensure that your security infrastructure is deployed on time, within budget, and to the highest quality standards.")
                }
              ]} />
            </div>
          </LazyMount>

          <LazyMount minHeight={520} fallback={<SectionFallback h={520} />}>
            <ServiceLifecycle data={cmsData.lifecycle} />
          </LazyMount>

          {cmsData.core_values && (
            <LazyMount minHeight={540} fallback={<SectionFallback h={540} />}>
              <div className="mt-10 md:mt-12 mb-12 md:mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="text-center mb-5"
                >
                  <h2 className="text-3xl md:text-5xl font-light mb-2 text-foreground font-display">
                    {i18n.language === 'ar'
                      ? (cmsData.core_values.title_ar || t("about.values.title", "قيمنا الجوهرية"))
                      : (cmsData.core_values.title || t("about.values.title", "Our Core Values"))}
                  </h2>
                  <p className="text-base md:text-lg text-black">
                    {i18n.language === 'ar'
                      ? (cmsData.core_values.subtitle_ar || t("about.values.subtitle", "المبادئ التوجيهية الراسخة التي تقود مسيرة تميزنا وريادتنا الاستشارية."))
                      : (cmsData.core_values.subtitle || t("about.values.subtitle", "Guiding principles that drive our excellence."))}
                  </p>
                </motion.div>

                <div>
                  <ExpandingValueCards items={cmsData.core_values.items} />
                </div>
              </div>
            </LazyMount>
          )}



          <LazyMount minHeight={320} fallback={<SectionFallback h={320} />}>
            <ClientsSection data={cmsData.clients} />
          </LazyMount>

          {/* <LazyMount minHeight={360} fallback={<SectionFallback h={360} />}>
            <ServicesSection data={cmsData.services} />
          </LazyMount> */}

          <LinkedInPosts />

          <LazyMount minHeight={480} fallback={<SectionFallback h={480} />}>
            <Suspense fallback={<SectionFallback h={480} />}>
              <LocationsSection data={cmsData.locations} />
            </Suspense>
          </LazyMount>
        </main>
        <Footer data={cmsData.footer} />
      </div>
    </>
  );
}

/* ============================================================
   LOADING SCREEN — even pacing across each stage
   ============================================================ */
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // ~1.7s per stage word, then hold logo — even rhythm (not accelerating)
    const sequence = [
      setTimeout(() => setPhase(1), 2200),
      setTimeout(() => setPhase(2), 4400),
      setTimeout(() => setPhase(3), 6600),
    ];
    const timer = setTimeout(onDone, 8600);

    return () => {
      sequence.forEach(clearTimeout);
      clearTimeout(timer);
    };
  }, [onDone]);

  const { t } = useTranslation();
  const words = [
    t("loader.w1"),
    t("loader.w2"),
    t("loader.w3"),
    "VISO GROUP",
  ];
  const currentWord = words[phase];
  const finalLetters = "VISO GROUP".split("");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-20%", filter: "blur(20px)", transition: { duration: 1.0, ease: [0.77, 0, 0.175, 1] } }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden">

        {/* Background decorative text moving for extra motion */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
          className="absolute font-display text-[25vw] font-bold text-foreground/[0.02] whitespace-nowrap pointer-events-none"
        >
          {t("loader.bg_text")} {t("loader.bg_text")}
        </motion.div>

        <AnimatePresence mode="wait">
          {phase < 3 ? (
            <motion.div
              key={phase}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -36, skewY: -2, filter: "blur(8px)", scale: 1.05 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-2xl sm:text-3xl md:text-5xl lg:text-[72px] leading-tight text-foreground tracking-tighter uppercase absolute text-center px-4 max-w-[95vw]"
            >
              {currentWord.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.01, delay: index * 0.04 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="final"
              className="flex flex-col items-center justify-center absolute"
              style={{ perspective: 1000 }}
            >
              {/* Animated Logo */}
              <motion.img
                src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png"
                alt="Viso Group Logo"
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-32 h-auto sm:w-40 md:w-64 mb-8 md:mb-10 drop-shadow-[0_10px_30px_rgba(212,175,55,0.5)] object-contain"
              />

              {/* Staggered Typed Text */}
              <div className="flex items-center justify-center p-4">
                {finalLetters.map((l, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.28,
                      delay: i * 0.08 + 0.35,
                      ease: "easeOut"
                    }}
                    className={`font-display font-black text-3xl sm:text-5xl md:text-8xl lg:text-[110px] tracking-tight uppercase text-primary drop-shadow-md ${l === " " ? "w-3 sm:w-4 md:w-8" : ""}`}
                  >
                    {l}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip Intro Button */}
        <motion.button
          onClick={onDone}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          className="absolute bottom-8 right-8 z-[210] font-mono text-[10px] font-bold tracking-[0.2em] text-foreground bg-foreground/5 hover:bg-foreground/10 px-4 py-2 border border-foreground/10 rounded-sm transition-all duration-300 uppercase cursor-pointer"
        >
          {t("home.skip_intro")}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ============================================================
   HERO SECTION — Full-bleed imagery + caption panel
   ============================================================ */
const servicesListEn = [
  {
    title: "Security Consultancy",
    subtitle: "Comprehensive Physical Security Threat and Risk Assessment.",
    link: "/security",
    buttonText: "Go to Security",
  },
  {
    title: "Translation Services",
    subtitle: "Certified Translation Services for Technical, Legal, Medical, Official, and Security Documents.",
    link: "/translation",
    buttonText: "Go to Translation",
  }
];

const servicesListAr = [
  {
    title: "الاستشارات الأمنية",
    subtitle: "تقييم شامل لمخاطر وتهديدات الأمن المادي وهندسة الحماية المعتمدة من الهيئة العليا للأمن الصناعي (HCIS).",
    link: "/security",
    buttonText: "استكشف الاستشارات الأمنية",
  },
  {
    title: "خدمات الترجمة المعتمدة",
    subtitle: "خدمات ترجمة معتمدة للوثائق الفنية، والقانونية، والطبية، والرسمية، والأمنية بأعلى دقة وموثوقية.",
    link: "/translation",
    buttonText: "استكشف خدمات الترجمة",
  }
];

export function HeroSection({ data, isReady = true }: { data?: any; isReady?: boolean }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const ref = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCert, setSelectedCert] = useState<{ img: string; label: string; labelAr?: string } | null>(null);

  // Strictly keep only the 2 core services: Security Consultancy & Translation Services
  const slides = isArabic ? servicesListAr : servicesListEn;

  const MERGED_HERO_VIDEO_URL =
    "https://res.cloudinary.com/dppwnds6z/video/upload/fl_splice,l_video:gemini_generated_video_1c397ea0/gemini_generated_video_4932b2ba.mp4";

  const videoUrl =
    data?.videoUrl && !data.videoUrl.includes("8399bb9c")
      ? data.videoUrl
      : MERGED_HERO_VIDEO_URL;

  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isReady, slides.length]);

  const ARABIC_REGULATORY_MAP: Record<string, string> = {
    moi: "وزارة الداخلية (MOI)",
    sais: "الهيئة العليا للأمن الصناعي (HCIS / SAIS)",
    hcis: "الهيئة العليا للأمن الصناعي (HCIS / SAIS)",
    hcissais: "الهيئة العليا للأمن الصناعي (HCIS / SAIS)",
    neom: "نيوم (NEOM)",
    api780: "معايير معهد البترول الأمريكي (API 780)",
    api: "معايير معهد البترول الأمريكي (API 780)",
    aramco: "أرامكو السعودية (ARAMCO)",
    saudiaramco: "أرامكو السعودية (ARAMCO)",
  };

  const slide = slides[currentSlide % slides.length];
  const currentSlideData = data?.slides?.[currentSlide % slides.length];
  const slideTitle = isArabic
    ? (currentSlideData?.title_ar || slide.title)
    : (currentSlideData?.title || slide.title);
  const slideSubtitle = isArabic
    ? (currentSlideData?.subtitle_ar || slide.subtitle)
    : (currentSlideData?.subtitle || slide.subtitle);
  const slideButtonText = isArabic
    ? (currentSlideData?.buttonText_ar || slide.buttonText)
    : (currentSlideData?.buttonText || slide.buttonText);
  const slideLink = currentSlideData?.link || slide.link;

  const defaultRegulatoryLogos = [
    { slug: "moi", label: "MOI", labelAr: "وزارة الداخلية (MOI)", img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790599258/download.png", url: "/regulatory/moi" },
    { slug: "sais", label: "SAIS", labelAr: "الهيئة العليا للأمن الصناعي (HCIS / SAIS)", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBwqTj0FNNJJm59mHR1GKznOvHK23QpPB5jwKZQuFaQ&s=10", url: "/regulatory/sais" },
    { slug: "neom", label: "NEOM", labelAr: "نيوم (NEOM)", img: "https://neom.scene7.com/is/image/neom/logo-neom-en-spaced?fmt=png-alpha&scl=1", url: "/regulatory/neom" },
    { slug: "api780", label: "API 780", labelAr: "معايير معهد البترول الأمريكي (API 780)", img: "https://theshopmag.com/wp-content/uploads/2023/05/api-logo-stacked.png", url: "/regulatory/api780" },
    { slug: "aramco", label: "ARAMCO", labelAr: "أرامكو السعودية (ARAMCO)", img: "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Saudi_Aramco_logo.svg/1200px-Saudi_Aramco_logo.svg.png", url: "/regulatory/aramco" },
  ];

  const regulatoryLogos = data?.regulatoryLogos && data.regulatoryLogos.length > 0 ? data.regulatoryLogos : defaultRegulatoryLogos;

  const certificatesList = [
    { icon: <FileText size={20} />, img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790100377/8aef84d0-fbe6-426d-b485-b4241b30daae.png", label: "CR 2026-2027", labelAr: "السجل التجاري ٢٠٢٦-٢٠٢٧" },
    { icon: <Briefcase size={20} />, img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790100602/3d24f59b-1530-4316-bd0d-27ac9167ccff.png", label: "Business License", labelAr: "رخصة ممارسة النشاط الاستشاري" },
    { icon: <ShieldCheck size={20} />, img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790100668/865e7db3-7be4-4ed4-920e-e0a8b29af7bb.png", label: "SAIS Certificate", labelAr: "شهادة اعتماد الأمن الصناعي SAIS" },
    { icon: <Award size={20} />, img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1791982868/b88077c8-e8df-4ec4-9c8f-28236a827324.png", label: "CCC Certificate", labelAr: "شهادة الغرفة التجارية" }
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-[calc(100dvh-4.25rem)] md:min-h-[calc(100dvh-4.5rem)] mt-[4.25rem] md:mt-[4.5rem] overflow-hidden bg-[#0d1117]"
    >
      <video
        key={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        <source
          src="https://res.cloudinary.com/dppwnds6z/video/upload/v1792423642/gemini_generated_video_4932b2ba.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient Overlays for Readability */}
      <div className={`absolute inset-0 pointer-events-none ${
        isArabic
          ? "bg-gradient-to-l from-[#0d1117]/70 via-[#0d1117]/30 to-transparent"
          : "bg-gradient-to-r from-[#0d1117]/60 via-[#0d1117]/20 to-transparent"
      }`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/40 via-transparent to-[#0d1117]/10 pointer-events-none" />

      {/* Text Content overlay */}
      <div
        className="relative z-10 flex min-h-[inherit] items-center px-6 md:px-12 lg:px-16 py-10 md:py-14"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <motion.div
          className={`max-w-xl md:max-w-2xl lg:max-w-3xl w-full ${isArabic ? 'text-right' : 'text-left'}`}
        >
          <div className="relative h-64 md:h-56">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSlide}-${isArabic}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <h1 className={`font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] mb-6 ${isArabic ? 'font-arabic tracking-normal' : ''}`}>
                  {slideTitle}
                </h1>
                <p className={`font-sans text-lg md:text-xl text-white/80 font-light mb-8 max-w-xl text-pretty drop-shadow-md ${isArabic ? 'font-arabic' : ''}`}>
                  {slideSubtitle}
                </p>
                <Link
                  to={slideLink}
                  className={`inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-4 font-sans text-xs font-bold tracking-[0.2em] text-white transition-all duration-400 hover:bg-gold hover:scale-[1.03] shadow-[0_4px_20px_rgba(212,175,55,0.3)] uppercase cursor-pointer ${isArabic ? 'font-arabic tracking-normal' : ''}`}
                >
                  {slideButtonText}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Regulatory Bodies / Standards Icons on Top — Transparent Circle with Golden Border, Logo Name Tooltip on Hover */}
      <div className={`absolute top-6 ${isArabic ? "right-6 md:right-12" : "left-6 md:left-12"} z-30 flex gap-3 md:gap-4 items-center`} dir={isArabic ? "rtl" : "ltr"}>
        {regulatoryLogos.map((body: any, idx: number) => {
          const cleanSlug = (body.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const cleanLabel = (body.label || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const bodyLabel = isArabic
            ? (body.labelAr || ARABIC_REGULATORY_MAP[cleanSlug] || ARABIC_REGULATORY_MAP[cleanLabel] || body.label)
            : body.label;
          const targetUrl = body.url || body.link || `/regulatory/${cleanSlug || "sais"}`;
          const isExternal = typeof targetUrl === "string" && (targetUrl.startsWith("http://") || targetUrl.startsWith("https://"));
          const hashPart = targetUrl.includes("#") ? targetUrl.split("#")[1] : undefined;
          const pathPart = targetUrl.split("#")[0] || `/regulatory/${cleanSlug || "sais"}`;

          return (
            <div key={idx} className="relative group shrink-0">
              {isExternal ? (
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-transparent border-2 border-[#D4AF37] hover:border-[#FFD700] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_0_10px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.8)] cursor-pointer overflow-hidden block"
                  aria-label={bodyLabel}
                  title={isArabic ? `${bodyLabel} - استعراض معايير الامتثال` : `${bodyLabel} - View Standards & Compliance`}
                >
                  <img
                    src={body.img}
                    alt={bodyLabel}
                    className="w-full h-full object-cover rounded-full transition-all duration-500 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                  />
                </a>
              ) : (
                <Link
                  to={pathPart}
                  hash={hashPart}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-transparent border-2 border-[#D4AF37] hover:border-[#FFD700] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_0_10px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.8)] cursor-pointer overflow-hidden block"
                  aria-label={bodyLabel}
                  title={isArabic ? `${bodyLabel} - استعراض معايير الامتثال` : `${bodyLabel} - View Standards & Compliance`}
                >
                  <img
                    src={body.img}
                    alt={bodyLabel}
                    className="w-full h-full object-cover rounded-full transition-all duration-500 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                  />
                </Link>
              )}
              {/* Logo Name Tooltip on Hover */}
              <span className={`absolute top-[calc(100%+0.6rem)] ${
                isArabic 
                  ? "right-0 translate-x-0 text-right" 
                  : "left-1/2 -translate-x-1/2 text-center"
              } bg-black/95 backdrop-blur-md border border-[#D4AF37]/80 text-gold text-[10px] md:text-xs font-bold tracking-wide px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-[0_8px_25px_rgba(0,0,0,0.9)] z-50 ${
                isArabic ? 'font-arabic' : 'uppercase tracking-widest'
              }`}>
                {bodyLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 md:bottom-8 start-6 md:start-12 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={isArabic ? `الشريحة ${i + 1}` : `Slide ${i + 1}`}
            aria-current={i === currentSlide ? "true" : undefined}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-10 bg-gold shadow-[0_0_8px_#D4AF37]" : "w-3 bg-white/45 hover:bg-white/75"
              }`}
          />
        ))}
      </div>

      {/* Certificate Icons on Opposite Side */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-6 md:left-12" : "right-6 md:right-12"} z-30 flex flex-col gap-4`}>
        {certificatesList.map((cert, idx) => {
          const certLabel = isArabic ? cert.labelAr : cert.label;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedCert(cert)}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-gold backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_4px_15px_rgba(0,0,0,0.3)] group relative cursor-pointer"
              aria-label={certLabel}
            >
              {cert.icon}
              <span className={`absolute ${isArabic ? "left-full ml-4" : "right-full mr-4"} bg-black/80 backdrop-blur-sm border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${isArabic ? 'font-arabic' : ''}`}>
                {certLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute -top-12 right-0 text-white hover:text-gold transition-colors"
                aria-label={isArabic ? "إغلاق" : "Close"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <img src={selectedCert.img} alt={isArabic ? (selectedCert.labelAr || selectedCert.label) : selectedCert.label} className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
              <div className="mt-3 text-center">
                <span className={`font-display text-xs md:text-sm font-bold text-gold tracking-wider bg-black/80 px-4 py-1.5 rounded-full border border-gold/40 shadow-lg inline-block ${isArabic ? 'font-arabic' : ''}`}>
                  {isArabic ? (selectedCert.labelAr || selectedCert.label) : selectedCert.label}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============================================================
   SERVICES SECTION (Swiss Editorial Layout)
   ============================================================ */
function ServicesSection({ data }: { data?: any }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const title1 = data?.title1 || t("home_extra.architectural");
  const title2 = data?.title2 || t("home_extra.integrity");
  const desc = data?.desc || t("home_extra.approach_desc");
  const services = data?.items?.length > 0 ? data.items : [
    { num: "01", title: t("home_extra.master_planning"), desc: t("home_extra.master_planning_desc") },
    { num: "02", title: t("home_extra.facade"), desc: t("home_extra.facade_desc") },
    { num: "03", title: t("home_extra.access"), desc: t("home_extra.access_desc") },
  ];

  return (
    <section ref={ref} className="pt-20 pb-0 bg-surface relative">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16">
        <div className="grid lg:grid-cols-2 gap-20">

          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-5xl md:text-7xl leading-tight text-foreground tracking-tight">
                {title1} <br /><span className="text-primary">{title2}</span>
              </h2>
              <p className="font-sans mt-8 text-lg text-black max-w-md leading-relaxed">
                {desc}
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col gap-12 border-t border-foreground/10 pt-12">
            {services.map((srv: any, i: number) => (
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
                  <p className="font-sans text-sm text-black mt-3 max-w-sm">{srv.desc}</p>
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
function FrameworkSection({ data }: { data?: any }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const titleMono = data?.titleMono || t("framework.title_mono");
  const title1 = data?.title1 || t("framework.title_display");
  const title2 = data?.title2 || t("framework.title_display_italic");
  const desc = data?.desc || t("framework.desc");
  const items = data?.items?.length > 0 ? data.items : [
    { id: 1, num: "01", title: t("security.stages.s1.title"), subtitle: t("security.stages.s1.subtitle") },
    { id: 2, num: "02", title: t("security.stages.s2.title"), subtitle: t("security.stages.s2.subtitle") },
    { id: 3, num: "03", title: t("security.stages.s3.title"), subtitle: t("security.stages.s3.subtitle") },
    { id: 4, num: "04", title: t("security.stages.s4.title"), subtitle: t("security.stages.s4.subtitle"), img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790759493/4.png" }
  ];

  return (
    <section ref={ref} className="py-20 bg-surface-2 relative">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
          className="font-mono text-xs font-bold tracking-[0.3em] text-primary mb-6 uppercase"
        >
          {titleMono}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl leading-tight text-foreground"
        >
          {title1} <br />
          <span className="text-primary">{title2}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-lg text-black max-w-3xl mx-auto mt-8 leading-relaxed mb-16 whitespace-pre-wrap"
        >
          {desc}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left rtl:text-right">
          {items.map((stage: any, i: number) => (
            <TiltCard key={stage.id || i} className="h-full">
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
                  <div className="font-sans text-sm font-bold uppercase tracking-wider text-primary mb-6 flex items-center gap-3">
                    <span className="w-4 h-px bg-primary/50 group-hover:bg-primary transition-colors"></span>
                    {t("security.stage")} {stage.num}
                  </div>
                  <h3 className="font-display text-2xl leading-snug mb-3 text-foreground group-hover:text-primary transition-colors duration-300">{stage.title}</h3>
                  <p className="font-sans text-sm text-black mb-8 max-w-[90%]">{stage.subtitle}</p>

                  {stage.img && (
                    <div className="mt-2 mb-6 overflow-visible rounded-lg border border-foreground/10 opacity-80 group-hover:opacity-100 transition-opacity bg-background/50 flex items-center justify-center p-2">
                      <img src={stage.img} alt="" className="max-w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500" style={{ maxHeight: '180px' }} />
                    </div>
                  )}

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
function ShowcaseSection({ data }: { data?: any }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const bgImage =
    data?.imageUrl ||
    "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";

  return (
    <section ref={ref} className="py-16 overflow-hidden bg-background">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16">
        <div className="relative h-[70vh] rounded-xl overflow-hidden group">
          <motion.div style={{ y: y1 }} className="absolute inset-[-20%]">
            <img
              src={bgImage}
              alt="Showcase"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
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
function ClientsSection({ data }: { data?: any }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { categories } = useClientCategories();

  const titleMono = isAr 
    ? (data?.titleMonoAr || "محل ثقة كبرى الهيئات والشركات")
    : (data?.titleMono || "Trusted By");
  const title1 = isAr 
    ? (data?.title1Ar || "رواد")
    : (data?.title1 || "Industry");
  const title2 = isAr 
    ? (data?.title2Ar || "الصناعة والريادة.")
    : (data?.title2 || "Titans.");
  const subtitle = isAr
    ? "شركاء استراتيجيون لأبرز الهيئات الحكومية والمشاريع العملاقة وكبرى الشركات العالمية بالمملكة"
    : "Strategic partners to sovereign authorities, giga-projects, and enterprise leaders across the Kingdom";

  // Extract clients from dynamic categories managed in CMS with full Arabic localization
  const clients = useMemo(() => {
    const rawCategories = (categories && categories.length > 0) ? categories : clientCategoriesData;
    let extracted = rawCategories.flatMap(cat => {
      const sectorName = isAr 
        ? (cat.titleAr || CLIENT_SECTORS_AR[cat.title] || cat.title)
        : cat.title;

      return (cat.clients || []).map(client => {
        const clientName = isAr
          ? (client.nameAr || CLIENT_NAMES_AR[client.name] || client.name)
          : client.name;

        return {
          ...client,
          displayName: clientName,
          displaySector: sectorName,
        };
      });
    });

    if (extracted.length === 0) {
      extracted = clientCategoriesData.flatMap(cat => {
        const sectorName = isAr 
          ? (cat.titleAr || CLIENT_SECTORS_AR[cat.title] || cat.title)
          : cat.title;

        return cat.clients.map(client => ({
          ...client,
          displayName: isAr ? (client.nameAr || CLIENT_NAMES_AR[client.name] || client.name) : client.name,
          displaySector: sectorName,
        }));
      });
    }

    return extracted;
  }, [categories, isAr]);

  const row1 = clients.slice(0, Math.ceil(clients.length / 2));
  const row2 = clients.slice(Math.ceil(clients.length / 2));

  return (
    <section ref={ref} className="py-24 bg-background relative border-y border-foreground/5 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.8 }}
          className="font-mono text-xs font-bold tracking-[0.3em] text-primary mb-4 uppercase"
        >
          {titleMono}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl leading-tight text-foreground mb-4"
        >
          {title1} <span className="italic text-primary">{title2}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-sans text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* Marquee Row 1 */}
        <div dir="ltr" className="relative overflow-hidden w-full whitespace-nowrap mb-6 py-2">
          {/* Subtle fading edges */}
          <div className="absolute top-0 left-0 w-8 md:w-28 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 md:w-28 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex gap-5 w-max">
            {[...row1, ...row1].map((client: any, i: number) => (
              <div key={i} className="inline-block w-52 md:w-64 flex-shrink-0">
                <div 
                  className="group flex flex-col items-center justify-between bg-card hover:bg-card/90 border border-border/80 hover:border-primary/50 rounded-2xl p-4 transition-all duration-300 h-38 shadow-2xs hover:shadow-lg hover:-translate-y-1"
                  dir={isAr ? "rtl" : "ltr"}
                >
                  {/* High-contrast crisp logo container: pure white stage ensures both dark and light logos are 100% visible */}
                  <div className="w-full h-20 rounded-xl bg-white dark:bg-white/95 p-2.5 flex items-center justify-center border border-neutral-100 dark:border-neutral-200/50 shadow-2xs group-hover:scale-102 transition-transform duration-300">
                    <ClientLogo src={client.icon} name={client.displayName} />
                  </div>
                  <div className="w-full text-center mt-2">
                    <h3 className="font-sans font-bold text-foreground text-xs md:text-sm tracking-wide truncate group-hover:text-primary transition-colors">
                      {client.displayName}
                    </h3>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider truncate mt-0.5">
                      {client.displaySector}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 */}
        <div dir="ltr" className="relative overflow-hidden w-full whitespace-nowrap mb-12 py-2">
          <div className="absolute top-0 left-0 w-8 md:w-28 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 md:w-28 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-reverse flex gap-5 w-max">
            {[...row2, ...row2].map((client: any, i: number) => (
              <div key={i} className="inline-block w-52 md:w-64 flex-shrink-0">
                <div 
                  className="group flex flex-col items-center justify-between bg-card hover:bg-card/90 border border-border/80 hover:border-primary/50 rounded-2xl p-4 transition-all duration-300 h-38 shadow-2xs hover:shadow-lg hover:-translate-y-1"
                  dir={isAr ? "rtl" : "ltr"}
                >
                  <div className="w-full h-20 rounded-xl bg-white dark:bg-white/95 p-2.5 flex items-center justify-center border border-neutral-100 dark:border-neutral-200/50 shadow-2xs group-hover:scale-102 transition-transform duration-300">
                    <ClientLogo src={client.icon} name={client.displayName} />
                  </div>
                  <div className="w-full text-center mt-2">
                    <h3 className="font-sans font-bold text-foreground text-xs md:text-sm tracking-wide truncate group-hover:text-primary transition-colors">
                      {client.displayName}
                    </h3>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider truncate mt-0.5">
                      {client.displaySector}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to explore all clients */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="flex justify-center"
        >
          <Link
            to="/clients"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/30 transition-all duration-300 shadow-xs hover:shadow-md hover:scale-105"
          >
            <span>{isAr ? "استعرض كافة الشركاء والعملاء" : "View All Clients & Partners"}</span>
            <span className={isAr ? "rotate-180" : ""}>→</span>
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

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("image_url")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setGalleryImages(data.map(item => item.image_url));
        }
      } catch (err) {
        console.error("Error fetching gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  if (loading) return null;
  if (galleryImages.length === 0) return null;

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
              <img src={src} alt={`Gallery Image ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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

function StatsSection({ data }: { data?: any }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const inView = useInView(ref, { once: false, amount: 0.3 });

  const stats = data?.items || [
    { target: 2, prefix: "$", suffix: "B+", label: t("home_extra.assets") },
    { target: 45, prefix: "", suffix: "", label: t("home_extra.partners") },
    { target: 99, prefix: "", suffix: "%", label: t("home_extra.compliance") },
  ];
  const title = data?.title || t("home_extra.measurable");

  return (
    <section ref={ref} className="py-20 bg-surface border-y border-foreground/5">
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
          {title}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-16 md:gap-8">
          {stats.map((s: any, i: number) => (
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
function CTASection({ data }: { data?: any }) {
  const { t } = useTranslation();
  const title1 = data?.title1 || t("home_extra.ready_title1");
  const title2 = data?.title2 || t("home_extra.ready_title2");
  const desc = data?.desc || t("home_extra.ready_desc");
  const buttonText = data?.buttonText || t("home_extra.get_in_touch");
  const imageUrl = data?.imageUrl;

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-surface-2 -skew-x-12 origin-top-right z-0" />
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex-1">
          <h2 className="font-display text-5xl md:text-7xl text-foreground leading-tight">
            {title1} <br /><span className="text-primary italic">{title2}</span>
          </h2>
          <p className="font-sans text-lg text-black mt-6 max-w-md mb-8 whitespace-pre-wrap">
            {desc}
          </p>
          <Link to="/others" className="inline-flex rounded-sm bg-primary px-10 py-5 font-sans text-sm font-bold tracking-[0.2em] text-white transition-all duration-400 hover:bg-gold hover:scale-[1.03] shadow-xl uppercase">
            {buttonText}
          </Link>
        </div>
        <div className="flex-1 w-full relative h-[400px] rounded-xl overflow-hidden shadow-2xl border border-foreground/10 z-10 group bg-surface">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none z-10"></div>
          {imageUrl ? (
            <img src={imageUrl} alt="Call to Action" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <>
              <a
                href="https://maps.app.goo.gl/fJBkhFTExcBrhJnG9?g_st=ipc"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-20 cursor-pointer group-hover:bg-primary/5 transition-colors duration-300"
                title="Open exact Riyadh HQ location in Google Maps"
              >
                <span className="sr-only">Open exact Riyadh location on Google Maps</span>
              </a>
              <img
                src="https://staticmap.openstreetmap.de/staticmap.php?center=24.7738,46.7382&zoom=15&size=800x400&markers=24.7738,46.7382,red-pushpin"
                alt="VISO Group location — Al-Taawun, Riyadh"
                width={800}
                height={400}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
                style={{ filter: "contrast(1.1) grayscale(0.2)" }}
              />
            </>
          )}
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

function ExpandingValueCards({ items }: { items: any[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div
      className="flex flex-col lg:flex-row h-[750px] lg:h-[540px] w-full gap-[2px] rounded-3xl overflow-hidden bg-white/20 shadow-xl border border-white/10"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {items.map((cv, i) => {
        const isActive = activeIdx === i;
        const itemKey = `v${i + 1}`;
        const itemTitle = isArabic
          ? (cv.title_ar || t(`about.values.items.${itemKey}.title`, cv.title))
          : cv.title;
        const itemDesc = isArabic
          ? (cv.desc_ar || t(`about.values.items.${itemKey}.desc`, cv.desc))
          : cv.desc;

        let itemPoints: string[] = cv.points || [];
        if (isArabic) {
          if (cv.points_ar && Array.isArray(cv.points_ar) && cv.points_ar.length > 0) {
            itemPoints = cv.points_ar;
          } else {
            const localePoints = t(`about.values.items.${itemKey}.points`, { returnObjects: true });
            if (Array.isArray(localePoints) && localePoints.length > 0) {
              itemPoints = localePoints as string[];
            }
          }
        }

        return (
          <motion.div
            key={cv.id || i}
            className="relative overflow-hidden cursor-pointer bg-black group"
            layout
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.1 + i * 0.1,
              layout: { type: "spring", stiffness: 200, damping: 25 }
            }}
            onMouseEnter={() => setActiveIdx(i)}
            onClick={() => setActiveIdx(i)}
            style={{
              flex: isActive ? 6 : 1,
            }}
          >
            {/* Background Image with Zoom */}
            {(() => {
              let bgColor = null;
              if (i === 1 || cv.title?.toLowerCase().includes("customer")) bgColor = "#AEAC78";
              else if (i === 2) bgColor = "#5C6B73"; // Elegant muted blue-grey
              else if (i === 3) bgColor = "#827059"; // Rich warm taupe

              if (bgColor) {
                return (
                  <motion.div
                    className="absolute inset-0 w-full h-full z-0"
                    style={{ backgroundColor: bgColor }}
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      filter: isActive ? "brightness(0.8)" : "brightness(0.7)"
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                );
              }

              return (
                <motion.img
                  src={cv.imageUrl}
                  alt={itemTitle}
                  className="absolute inset-0 w-full h-full object-cover origin-center z-0"
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    filter: isActive ? "brightness(0.8) contrast(1.1)" : "brightness(0.7) contrast(1.1)"
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              );
            })()}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-black/20 z-10" />
            <div className={`absolute inset-0 transition-opacity duration-700 z-10 ${isActive ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100' : 'opacity-0'}`} />

            {/* Content Container */}
            <div className="absolute inset-0 z-20 overflow-hidden">
              <AnimatePresence mode="wait">
                {!isActive ? (
                  /* Vertical Title State (Inactive) */
                  <motion.div
                    key="inactive"
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center p-6"
                  >
                    <h3
                      className={`font-display font-bold text-3xl md:text-4xl text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${isArabic ? 'font-arabic tracking-normal' : ''}`}
                      style={
                        isArabic
                          ? { transform: "rotate(-90deg)" }
                          : { writingMode: "vertical-rl", transform: "rotate(180deg)" }
                      }
                    >
                      {itemTitle}
                    </h3>
                  </motion.div>
                ) : (
                  /* Expanded Content State (Active) */
                  <motion.div
                    key="active"
                    initial={{ opacity: 0, y: 40, rotateX: -45 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: 20, rotateX: 45 }}
                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                    className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 transform-gpu"
                  >
                    {/* Large Animated Floating Symbol */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
                      animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      className={`absolute top-8 ${isArabic ? 'left-8 md:top-12 md:left-12' : 'right-8 md:top-12 md:right-12'} w-28 h-28 md:w-48 md:h-48 pointer-events-none z-0`}
                    >
                      <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                      >
                        {i % 4 === 0 && <Star className="w-full h-full" strokeWidth={0.8} />}
                        {i % 4 === 1 && <HeartHandshake className="w-full h-full" strokeWidth={0.8} />}
                        {i % 4 === 2 && <ShieldCheck className="w-full h-full" strokeWidth={0.8} />}
                        {i % 4 === 3 && <Target className="w-full h-full" strokeWidth={0.8} />}
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="font-mono text-xs tracking-[0.2em] text-primary uppercase mb-2 flex items-center gap-3"
                    >
                      <span className="w-8 h-px bg-primary" />
                      {isArabic ? `القيمة الجوهرية ٠${i + 1}` : `Core Value ${String(i + 1).padStart(2, '0')}`}
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      className={`font-display text-3xl md:text-5xl text-white tracking-tight mb-3 md:mb-4 drop-shadow-md whitespace-nowrap ${isArabic ? 'font-arabic' : ''}`}
                    >
                      {itemTitle}
                    </motion.h3>

                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 items-start">
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className={`font-sans text-sm md:text-base text-white/90 max-w-md leading-relaxed hidden sm:block ${isArabic ? 'font-arabic' : ''}`}
                      >
                        {itemDesc}
                      </motion.p>

                      <motion.ul
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } }
                        }}
                        className="space-y-2 lg:space-y-3 min-w-[200px]"
                      >
                        {itemPoints.map((pt: string, idx: number) => (
                          <motion.li
                            key={idx}
                            variants={{
                              hidden: { opacity: 0, x: isArabic ? 10 : -10 },
                              visible: { opacity: 1, x: 0 }
                            }}
                            className={`flex items-start gap-3 text-white/80 font-sans text-xs md:text-sm ${isArabic ? 'font-arabic' : ''}`}
                          >
                            <span className="w-1.5 h-1.5 bg-gold rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#D4AF37]" />
                            <span>{pt}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="mt-4 md:mt-6"
                    >
                      <Link to="/about" className="inline-block text-[10px] md:text-xs font-bold font-mono tracking-[0.2em] text-black bg-gold hover:bg-white px-6 py-3 rounded-sm uppercase transition-colors shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
                        {isArabic ? "اعرف المزيد" : "Learn More"}
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ValueCard({ title, desc, points, imageUrl, delay }: { title: string, desc: string, points: string[], imageUrl: string, delay: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6, delay }}
      className="group relative bg-surface border border-foreground/5 text-center hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-500 rounded-2xl flex flex-col items-center overflow-hidden h-[420px]"
    >
      {/* Default State */}
      <div className="absolute inset-0 p-8 flex flex-col items-center transition-transform duration-700 ease-out group-hover:-translate-y-[120%]">
        <div className="h-40 w-40 mb-6 mt-2 rounded-xl overflow-hidden border border-foreground/10 group-hover:border-gold transition-colors duration-500 shadow-md">
          <img src={imageUrl} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <h3 className="font-display text-2xl mb-4 text-foreground">{title}</h3>
        <p className="font-sans text-sm text-black leading-relaxed">
          {desc}
        </p>
      </div>

      {/* Hover State (Points) */}
      <div className="absolute inset-0 p-8 flex flex-col items-center justify-center translate-y-full opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 bg-surface">
        <div className="h-20 w-20 mb-4 rounded-xl overflow-hidden border-2 border-gold shadow-lg shadow-gold/20">
          <img src={imageUrl} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <h3 className="font-display text-xl mb-4 text-foreground">{title}</h3>
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

function AreaCard({ title, desc, svg, imageUrl, delay }: { title?: string, desc?: string, svg?: React.ReactNode, imageUrl?: string, delay: number }) {
  if (imageUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="group relative overflow-hidden rounded-xl border border-foreground/10 hover:border-gold/50 shadow-md hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 min-h-[300px] h-full flex items-center justify-center bg-black/5"
      >
        <img
          src={imageUrl}
          alt={title || "Integrated Security Systems"}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {title && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-center z-10">
            <h3 className="font-display font-semibold text-lg tracking-wide mb-1 text-white">{title}</h3>
            {desc && <p className="font-sans text-xs text-white/80 leading-relaxed">{desc}</p>}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group bg-surface/50 border border-foreground/5 p-10 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 transition-all duration-500 rounded-lg flex flex-col items-center text-center h-full justify-center"
    >
      <div className="h-16 w-16 mb-6 text-primary group-hover:text-gold transition-colors duration-500 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-gold/10 rounded-full scale-150 transition-colors duration-500 -z-10 blur-xl"></div>
        {svg}
      </div>
      <h3 className="font-display font-semibold text-lg tracking-wide mb-3 text-foreground">{title}</h3>
      <p className="font-sans text-sm text-black leading-relaxed">
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

function About({ data }: { data?: any }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 30, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const maskImage = useMotionTemplate`radial-gradient(250px circle at ${smoothX}px ${smoothY}px, black 0%, transparent 100%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const title = isArabic
    ? (data?.title_ar || "عن فيسو")
    : (data?.title || "About VISO");
  const subtitle = isArabic
    ? (data?.subtitle_ar || "عرض تعريفي شامل لهوية فيسو، ودورة استشارات الأمن المادي، وإمكاناتنا، والقطاعات التي نخدمها، واعتماداتنا وخدماتنا المتكاملة.")
    : (data?.subtitle ||
      "A structured presentation of VISO's identity, security consultancy lifecycle, capabilities, sectors, credentials and integrated digital services.");
  const whoWeAreTitle = isArabic
    ? (data?.whoWeAreTitle_ar || "فيسو للاستشارات الأمنية")
    : (data?.whoWeAreTitle || "VISO Security Consultancy");
  const whoWeAreDesc = isArabic
    ? (data?.whoWeAreDesc_ar || "تقدم فيسو خدمات استشارية متخصصة في الأمن المادي عبر كافة مراحل دورة المشروع: من دراسات تقييم المخاطر الأمنية (SRA)، والتصاميم المبدئية والتفصيلية (CDS/DDS)، والإشراف الهندسي على التنفيذ، وصولاً إلى الاختبارات والتشغيل والجاهزية التشغيلية التامة.")
    : (data?.whoWeAreDesc ||
      "VISO provides security consultancy services across the lifecycle of security risk assessment, concept and detailed design, construction supervision, testing, commissioning and operational readiness.");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Parallax movement on the massive background watermark
      if (watermarkRef.current) {
        gsap.to(watermarkRef.current, {
          y: 120,
          opacity: 0.07,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative px-6 md:px-12 lg:px-16 min-h-[100dvh] flex flex-col justify-center bg-background overflow-hidden border-t border-foreground/5 py-24 group"
    >
      {/* Cursor Spotlight Reveal Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Base blurred layer */}
        <div className="absolute inset-0 opacity-10 hidden md:block">
          <img
            src="https://res.cloudinary.com/dppwnds6z/image/upload/v1792398542/1781183794364.jpg"
            alt=""
            className="w-full h-full object-cover blur-3xl grayscale"
          />
        </div>

        {/* Spotlight reveal layer */}
        <motion.div
          className="absolute inset-0 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
          style={{ WebkitMaskImage: maskImage, maskImage: maskImage }}
        >
          <img
            src="https://res.cloudinary.com/dppwnds6z/image/upload/v1792398542/1781183794364.jpg"
            alt=""
            className="w-full h-full object-cover opacity-15 group-hover:opacity-70 transition-opacity duration-[4000ms] ease-in-out"
          />
        </motion.div>

        {/* Mobile static fallback */}
        <div className="absolute inset-0 md:hidden opacity-5">
          <img
            src="https://res.cloudinary.com/dppwnds6z/image/upload/v1792398542/1781183794364.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Continuous Fluid Glowing Laser Sweep Horizon Beam */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 w-1/3 h-[2.5px] bg-gradient-to-r from-transparent via-gold to-transparent pointer-events-none shadow-[0_0_25px_#D4AF37]"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Grid Subtle Ambient Accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />

      {/* Parallax Watermark Layer */}
      <div
        ref={watermarkRef}
        className="pointer-events-none absolute -top-24 right-4 font-display font-extrabold text-[22vw] leading-none text-foreground/[0.03] tracking-tighter select-none will-change-transform"
      >
        VISO
      </div>

      <div className="absolute top-1/4 -left-32 w-[55vw] h-[55vw] bg-gold/[0.04] rounded-full blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-[1600px] relative z-10">
        <AboutInteractive
          title={title}
          subtitle={subtitle}
          whoWeAreTitle={whoWeAreTitle}
          whoWeAreDesc={whoWeAreDesc}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs text-muted-foreground tracking-wide font-mono uppercase"
        >
          <span>{isArabic ? "تأسست عام ٢٠١٩" : `${t("about.stats.established")} 2019`}</span>
          <span className="text-gold">·</span>
          <span>{isArabic ? "٤ مراكز إقليمية" : `${t("about.stats.offices")}: 4 Hubs`}</span>
          <span className="text-gold">·</span>
          <span className="text-foreground/80 font-medium">
            {isArabic ? "الرياض · الخُبر · الجبيل · جدة · ينبع" : "Riyadh · Khobar · Jubail · Jeddah · Yanbu"}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function teaserText(text: string, max = 110) {
  const value = String(text || "").trim();
  if (!value) return "";
  const sentence = value.split(/(?<=[.!?])\s/)[0];
  if (sentence.length <= max) return sentence;
  return `${value.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

const FRAME_TILT = [-1.25, 0.65, -0.55, 1.15] as const;

function WallFrameStageCard({
  stage,
  index,
  moreInfoLabel,
  isArabic = false,
}: {
  stage: { num: string; numAr?: string; title: string; desc: string; imageUrl: string; videoUrl?: string };
  index: number;
  moreInfoLabel: string;
  isArabic?: boolean;
}) {
  const tilt = FRAME_TILT[index % FRAME_TILT.length];

  return (
    <Link
      to="/security"
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-sm"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <motion.div
        className="relative h-full transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.01]"
        style={{ rotate: `${tilt}deg` }}
        whileHover={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {/* Wall shadow */}
        <div
          className="absolute inset-x-3 bottom-0 top-8 rounded-sm bg-foreground/15 blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"
          aria-hidden
        />

        {/* Outer wooden frame */}
        <div
          className="relative rounded-[2px] p-[7px] md:p-[9px] shadow-[0_18px_45px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.25)]"
          style={{
            background:
              "linear-gradient(145deg, #a67c2e 0%, #6b4f1d 35%, #8b6914 55%, #4a3820 100%)",
          }}
        >
          {/* Inner frame lip */}
          <div
            className="rounded-[1px] p-[4px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)]"
            style={{ background: "linear-gradient(180deg, #2c2418 0%, #1a1510 100%)" }}
          >
            {/* Mat board */}
            <div className="bg-[#f6f2e8] px-2.5 pt-2 pb-3 md:px-3 md:pt-2.5 md:pb-3 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
              <div className="relative w-full h-auto overflow-hidden border border-black/10 bg-[#eae6dc] shadow-[inset_0_0_12px_rgba(0,0,0,0.08)]">
                {stage.videoUrl ? (
                  <video
                    src={stage.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="block w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                ) : (
                  <img
                    src={stage.imageUrl}
                    alt={stage.title}
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
              </div>

              <div className="mt-3.5 text-center px-1">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-[1px] w-4 bg-primary/40" />
                  <p className={`font-sans text-sm font-bold tracking-[0.2em] text-primary uppercase ${isArabic ? 'font-arabic tracking-normal' : ''}`}>
                    {isArabic ? `المرحلة ${stage.numAr || stage.num}` : `Stage ${stage.num}`}
                  </p>
                  <div className="h-[1px] w-4 bg-primary/40" />
                </div>
                <h3 className={`font-display text-base md:text-lg leading-snug text-foreground tracking-tight font-bold ${isArabic ? 'font-arabic' : ''}`}>
                  {stage.title}
                </h3>
                <p className={`mt-2 text-[12px] text-foreground/75 leading-relaxed line-clamp-2 ${isArabic ? 'font-arabic' : ''}`}>
                  {teaserText(stage.desc, 100)}
                </p>
              </div>

              <div className="mt-2.5 flex justify-center">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-sm border border-primary/25 bg-primary/8 px-3 py-1.5 font-sans text-[9px] font-bold tracking-[0.16em] uppercase text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary ${isArabic ? 'font-arabic tracking-normal' : ''}`}
                >
                  {isArabic ? "اعرف المزيد" : moreInfoLabel}
                  <span className="text-sm rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Picture hook accent */}
        <div
          className="absolute -top-1 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#8b7355] to-[#4a3f32] shadow-sm opacity-80"
          aria-hidden
        />
      </motion.div>
    </Link>
  );
}

function ServiceLifecycle({ data }: { data?: any }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const defaultStagesEn = [
    {
      num: "01",
      title: "Security Risk Assessment",
      desc: "Threats, vulnerabilities, perimeter review, critical assets, and the initial protection concept for your facility.",
      imageUrl: "/images/explore/risk-assessment-hero.jpg",
    },
    {
      num: "02",
      title: "Concept / Preliminary Design",
      desc: "Protection philosophy, zoning, system concepts, and preliminary layouts aligned with authority expectations.",
      imageUrl: "/images/explore/preliminary-design-hero.jpg",
    },
    {
      num: "03",
      title: "Detailed Design",
      desc: "Drawings, specifications, schedules, and integration packages ready for procurement and build.",
      imageUrl: "/images/explore/detailed-design-hero.jpg",
    },
    {
      num: "04",
      title: "Construction & Readiness",
      desc: "Supervision, testing, commissioning, and handover—confirming systems perform as designed.",
      imageUrl: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790759493/4.png",
    },
  ];

  const defaultStagesAr = [
    {
      num: "01",
      numAr: "٠١",
      title: "تقييم المخاطر الأمنية (SRA)",
      desc: "تحديد التهديدات ونقاط الضعف، ومراجعة المحيط الأمني، وحصر الأصول الحيوية، ووضع المفهوم المبدئي لحماية المنشأة.",
      imageUrl: "/images/explore/risk-assessment-hero.jpg",
    },
    {
      num: "02",
      numAr: "٠٢",
      title: "التصميم المفاهيمي والمبدئي (CDS)",
      desc: "فلسفة الحماية، وتوزيع المناطق الأمنية، ومفاهيم الأنظمة، والمخططات الأولية المتوافقة مع متطلبات الهيئة العليا للأمن الصناعي.",
      imageUrl: "/images/explore/preliminary-design-hero.jpg",
    },
    {
      num: "03",
      numAr: "٠٣",
      title: "التصميم الهندسي التفصيلي (DDS)",
      desc: "المخططات الهندسية، والمواصفات الفنية المعتمدة، وجداول الكميات، وحزم التكامل التقني الجاهزة للطرح والتنفيذ.",
      imageUrl: "/images/explore/detailed-design-hero.jpg",
    },
    {
      num: "04",
      numAr: "٠٤",
      title: "الإشراف والجاهزية التشغيلية",
      desc: "الإشراف الميداني، واختبارات التشغيل والقبول (FAT/SAT)، وتأكيد الجاهزية التشغيلية التامة والتسليم النهائي المعتمد.",
      imageUrl: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790759493/4.png",
    },
  ];

  const defaultStages = isArabic ? defaultStagesAr : defaultStagesEn;

  const stages = defaultStages.map((fallback, i) => {
    const raw = data?.items?.[i];
    return {
      num: fallback.num,
      numAr: isArabic ? defaultStagesAr[i].numAr : undefined,
      title: isArabic
        ? (raw?.title_ar || fallback.title)
        : (raw?.title || fallback.title),
      desc: isArabic
        ? (raw?.desc_ar || fallback.desc)
        : (raw?.desc || fallback.desc),
      imageUrl: raw?.imageUrl || fallback.imageUrl,
      videoUrl: raw?.videoUrl || (fallback as any)?.videoUrl || "",
    };
  });

  const sectionLabel = isArabic
    ? (data?.title_ar || "إطار العمل الأمني")
    : (data?.title || "Security Framework");

  return (
    <section
      id="four-stages"
      className="relative px-6 py-8 md:py-10 border-t border-border overflow-hidden bg-[#e8e4dc]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.045) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/30" />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="text-center mb-6 md:mb-8 max-w-3xl mx-auto flex flex-col items-center">
          <Reveal>
            <SectionLabel n={isArabic ? "٠٢" : "02"} label={sectionLabel} />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className={`mt-3 font-display text-3xl leading-[1.08] md:text-4xl lg:text-5xl tracking-tight text-foreground ${isArabic ? 'font-arabic' : ''}`}>
              {isArabic ? (
                <>
                  من تقييم المخاطر إلى{" "}
                  <span className="text-primary font-normal">الجاهزية التامة</span>
                </>
              ) : (
                <>
                  From Risk to{" "}
                  <span className="text-primary font-normal">Readiness</span>
                </>
              )}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className={`mt-2.5 text-sm md:text-base text-foreground/80 font-light max-w-xl leading-relaxed ${isArabic ? 'font-arabic' : ''}`}>
              {isArabic
                ? (data?.subtitle_ar || "استشارات أمنية شاملة ومتوافقة مع متطلبات الهيئة العليا للأمن الصناعي (HCIS / SAIS) عبر كافة المراحل")
                : (data?.subtitle || "End-to-End SAIS Security Consultancy Across Every Stage")}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-5 xl:gap-4 items-stretch">
          {stages.map((stage, i: number) => (
            <Reveal key={stage.num} delay={0.12 + i * 0.08} className="h-full">
              <WallFrameStageCard
                stage={stage}
                index={i}
                moreInfoLabel={t("home.more_info")}
                isArabic={isArabic}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   LINKEDIN POSTS SECTION
   ============================================================ */
function LinkedInPosts() {
  return (
    <section className="py-24 bg-surface/50 border-t border-foreground/5">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">Latest Updates</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Follow our recent activities and announcements on LinkedIn.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <LinkedInEmbed
            embedSrc="https://www.linkedin.com/embed/feed/update/urn:li:share:7508147208584785920?collapsed=1"
            height={669}
            title="VISO LinkedIn update"
          />
          <LinkedInEmbed
            embedSrc="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7508234545876504576?collapsed=1"
            height={876}
            title="VISO LinkedIn project highlight"
          />
          <LinkedInEmbed
            embedSrc="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7470826319954628608?collapsed=1"
            height={627}
            title="VISO LinkedIn announcement"
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER SECTION
   ============================================================ */
function Footer({ data }: { data?: any }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  return (
    <footer 
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-white text-black relative overflow-hidden flex flex-col min-h-[450px]"
    >
      {/* Subtle gold glow at the top edge */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50 z-20"></div>

      {/* Grounded Cityscape Background Illustration */}
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-0 flex items-end">
        <img
          src={data?.imageUrl || "https://res.cloudinary.com/dppwnds6z/image/upload/v1790680329/ChatGPT_Image_Sep_29_2026_04_41_56_PM.png"}
          alt="Saudi Landmarks"
          loading="lazy"
          decoding="async"
          className="w-full h-auto min-w-full object-cover object-bottom opacity-80"
        />
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-8 md:px-16 pt-16 pb-12 relative z-10 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-0">

          {/* Brand Col */}
          <div className="space-y-6">
            <img
              src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png"
              alt="VISO Logo"
              loading="lazy"
              decoding="async"
              className="h-16 w-auto object-contain"
            />
            <p className="font-sans text-black/70 text-sm leading-relaxed max-w-xs text-justify">
              {t(
                "footer.desc",
                "Pioneering high-end security architecture, consulting, and seamless defensive integration for mega-projects worldwide."
              )}
            </p>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-gold">
              {t("footer.explore", "Explore")}
            </h4>
            <ul className="space-y-3 font-sans text-sm text-black/70">
              <li>
                <Link to="/" className="hover:text-gold transition-colors">
                  {t("nav.home", "Home")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors">
                  {t("nav.about", "About Us")}
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-gold transition-colors">
                  {t("nav.security", "Security Consultancy")}
                </Link>
              </li>
              <li>
                <Link to="/translation" className="hover:text-gold transition-colors">
                  {t("nav.translation", "Translation Services")}
                </Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-gold transition-colors">
                  {t("nav.careers", "Careers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-gold">
              {t("footer.contact_us", "Contact Us")}
            </h4>
            <ul className="space-y-3 font-sans text-sm text-black/70">
              <li className="flex items-center gap-3">
                <span className="text-gold">📍</span>{" "}
                <span>{t("footer.location", "Riyadh, Saudi Arabia")}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">✉️</span>{" "}
                <a href="mailto:info@visogroup.com" className="hover:text-gold transition-colors" dir="ltr">
                  info@visogroup.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold">📞</span>{" "}
                <a href="tel:+966114503289" className="hover:text-gold transition-colors" dir="ltr">
                  +966 11 450 3289
                </a>
              </li>
            </ul>
          </div>

          {/* Socials Col */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-gold">
              {t("footer.connect", "Connect")}
            </h4>
            <div className="flex items-center gap-5">
              <a
                href="https://www.linkedin.com/company/viso-security-consultant/posts/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="inline-flex items-center justify-center transition-all duration-300 hover:scale-115 hover:-translate-y-0.5 active:scale-95 focus:outline-none"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="w-9 h-9 drop-shadow-sm hover:drop-shadow-md transition-all duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect width="24" height="24" rx="4.5" fill="#0A66C2" />
                  <path
                    fill="#FFFFFF"
                    d="M19 19h-3.13v-4.9c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.88 1.27-1.88 2.59V19H9.23V8.87h3V10.25h.04c.42-.79 1.44-1.63 2.96-1.63 3.17 0 3.75 2.08 3.75 4.8V19zM5.7 7.48a1.82 1.82 0 110-3.64 1.82 1.82 0 010 3.64zm1.56 11.52H4.13V8.87h3.13V19z"
                  />
                </svg>
              </a>

              <a
                href="#"
                title="Twitter"
                className="inline-flex items-center justify-center transition-all duration-300 hover:scale-115 hover:-translate-y-0.5 active:scale-95 focus:outline-none"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-9 h-9 text-[#1DA1F2] drop-shadow-sm hover:drop-shadow-md transition-all duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                </svg>
              </a>

              <a
                href="https://portal.us.bn.cloud.ariba.com/dashboard/public/appext/company-profile#/certifications?bnoId=BNO-100000037809844"
                target="_blank"
                rel="noopener noreferrer"
                title="SAP Ariba Certifications"
                className="inline-flex items-center justify-center transition-all duration-300 hover:scale-115 hover:-translate-y-0.5 active:scale-95 focus:outline-none"
              >
                <span className="sr-only">SAP Ariba Certifications</span>
                <svg
                  className="w-10 h-10 drop-shadow-sm hover:drop-shadow-md transition-all duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M0 6.064v11.872h12.13L24 6.064z" fill="#FFFFFF" />
                  <path
                    fill="#0070BA"
                    d="M0 6.064v11.872h12.13L24 6.064zm3.264 2.208h.005c.863.001 1.915.245 2.676.633l-.82 1.43c-.835-.404-1.255-.442-1.73-.467-.708-.038-1.064.215-1.069.488-.007.332.669.633 1.305.838.964.306 2.19.715 2.377 1.9L7.77 8.437h2.046l2.064 5.576-.007-5.575h2.37c2.257 0 3.318.764 3.318 2.519 0 1.575-1.09 2.514-2.936 2.514h-.763l-.01 2.094-3.588-.003-.25-.908c-.37.122-.787.189-1.23.189-.456 0-.885-.071-1.263-.2l-.358.919-2 .006.09-.462c-.029.025-.057.05-.087.074-.535.43-1.208.629-2.037.644l-.213.002a5.075 5.075 0 0 1-2.581-.675l.73-1.448c.79.467 1.286.572 1.956.558.347-.007.598-.07.761-.239a.557.557 0 0 0 .156-.369c.007-.376-.53-.553-1.185-.756-.531-.164-1.135-.389-1.606-.735-.559-.41-.825-.924-.812-1.65a1.99 1.99 0 0 1 .566-1.377c.519-.537 1.357-.863 2.363-.863zm10.597 1.67v1.904h.521c.694 0 1.247-.23 1.248-.964 0-.709-.554-.94-1.248-.94zm-5.087.767l-.748 2.362c.223.085.481.133.757.133.268 0 .52-.047.742-.126l-.736-2.37z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 w-full border-t border-black/10 bg-white/60 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-black/70 font-semibold text-xs font-mono uppercase tracking-widest">
            {isArabic ? (
              <span>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} مجموعة فيزو (VISO Group).</span>
            ) : (
              <span>&copy; {new Date().getFullYear()} VISO Group. All rights reserved.</span>
            )}
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-black/70 font-semibold text-xs font-mono uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-gold transition-colors">
              {t("footer.privacy", "Privacy Policy")}
            </Link>
            <Link to="/terms" className="hover:text-gold transition-colors">
              {t("footer.terms", "Terms of Service")}
            </Link>
            <Link to="/contact" className="hover:text-gold transition-colors">
              {t("footer.contact", "Contact Us")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}