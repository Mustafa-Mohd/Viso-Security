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
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { TopNav } from "@/components/TopNav";
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
    <div className="bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <TopNav />
      <AboutHero />
      <WhoWeAre title={whoTitle} desc={whoDesc} secondary={t("about.desc2")} />
      <CEOMessage />
      <VisionMission />
      <StatsBand />
      <RegulatoryCards />
      <ProfileJourney items={profile} />
      <LicensesAndCertifications />
      <AboutCta />
      <AboutFooter />
    </div>
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
          src="https://res.cloudinary.com/dppwnds6z/image/upload/v1790274846/ChatGPT_Image_Sep_25_2026_12_03_52_AM.png"
          alt="Architectural structure"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-[120%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />
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
          Established 2020 · Kingdom of Saudi Arabia
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
          className="font-display text-[14vw] md:text-[9vw] leading-[0.85] tracking-[-0.04em] uppercase text-foreground max-w-5xl"
        >
          VISO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease }}
          className="mt-6 md:mt-8 font-display text-2xl md:text-4xl lg:text-5xl text-foreground/90 max-w-2xl leading-[1.15] tracking-tight"
        >
          {t("about_page.hero_title")}{" "}
          <em className="text-primary not-italic font-light">{t("about_page.hero_title_italic")}</em>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="mt-5 max-w-lg text-sm md:text-base text-foreground/55 leading-relaxed font-light"
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
          Scroll
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const markX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="who"
      ref={ref}
      className="relative px-8 md:px-16 py-24 md:py-36 overflow-hidden"
    >
      <motion.div
        style={{ x: markX }}
        className="pointer-events-none absolute top-16 -left-4 font-display font-bold text-[22vw] leading-none text-foreground/[0.03] tracking-tighter select-none whitespace-nowrap"
      >
        WHO WE ARE
      </motion.div>

      <div className="relative z-10 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5">

          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-foreground">
              {title.includes("Peace") || title.includes("meets") || title.includes("يلتقي") ? (
                <>
                  {t("about_page.story_title")}{" "}
                  <em className="text-primary not-italic font-light">
                    {t("about_page.story_italic")}
                  </em>
                </>
              ) : (
                title
              )}
            </h2>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-10 relative aspect-[4/5] overflow-hidden rounded-sm">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt="VISO workspace"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-mono text-[10px] tracking-[0.25em] text-white/80 uppercase">
                  Headquartered in Riyadh
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pt-24 space-y-8">
          <Reveal delay={0.15}>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed font-light max-w-2xl">
              {desc}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="text-base md:text-lg text-foreground/50 leading-relaxed font-light max-w-2xl">
              {secondary}
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="pt-8 grid sm:grid-cols-2 gap-x-10 gap-y-8 border-t border-foreground/10">
              {[
                { label: "Founded", value: "January 2020" },
                { label: "HQ", value: "Riyadh, KSA" },
                { label: "Coverage", value: "5 Regional Offices" },
                { label: "Focus", value: "Physical Security" },
              ].map((item) => (
                <div key={item.label} className="group">
                  <div className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase mb-2">
                    {item.label}
                  </div>
                  <div className="font-display text-xl md:text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-500">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- CEO Message ---------- */
function CEOMessage() {
  const { t } = useTranslation();
  
  return (
    <section className="relative px-8 md:px-16 py-24 md:py-32 bg-background overflow-hidden border-t border-foreground/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal delay={0.1}>
              <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-sm overflow-hidden group">
                <ParallaxImage 
                  src="https://res.cloudinary.com/dppwnds6z/image/upload/v1790273889/WhatsApp_Image_2026-09-24_at_4.52.27_PM.jpg" 
                  alt="CEO of VISO Group" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="font-display text-2xl md:text-3xl text-foreground font-bold tracking-tight mb-1">
                    Mohammad Bin Sadiq
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase">
                    Chief Executive Officer
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-foreground/50 uppercase mt-1">
                    Vision of Solutions for Security Consultations
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          
          <div className="lg:col-span-7 order-1 lg:order-2 lg:pl-10">
            <Reveal delay={0.2}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-10">
                A Message from <br/>
                <em className="text-primary not-italic font-light">Our CEO</em>
              </h2>
            </Reveal>
            
            <Reveal delay={0.3}>
              <div className="relative">
                <span className="absolute -top-10 -left-6 text-8xl text-foreground/5 font-serif select-none pointer-events-none">"</span>
                <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 leading-relaxed font-light mb-8 relative z-10">
                  At Vision of Solutions for Security Consultations, we believe that security consulting is more than identifying risks or meeting regulatory requirements. It is about protecting people, assets, operations, and the confidence our clients place in us.
                </p>
                <p className="text-base md:text-lg text-foreground/60 leading-relaxed font-light mb-6">
                  Since our establishment, we have worked to build a consulting practice founded on integrity, technical excellence, independence, and a clear understanding of the security challenges facing critical infrastructure and organizations across the Kingdom.
                </p>
                <p className="text-base md:text-lg text-foreground/60 leading-relaxed font-light mb-6">
                  Our commitment is to provide practical, reliable, and forward-looking security solutions that help our clients make informed decisions, strengthen resilience, and protect what matters most to their organizations.
                </p>
                <p className="text-base md:text-lg text-foreground/60 leading-relaxed font-light mb-6">
                  We are proud of the expertise of our team, the trust of our clients, and the relationships we have built across the sectors we serve. As security needs continue to evolve, we remain committed to developing our capabilities, adopting effective technologies and methodologies, and delivering services that create lasting value.
                </p>
                <p className="text-base md:text-lg text-foreground/60 leading-relaxed font-light mb-10">
                  We look forward to continuing our journey with our clients and partners toward safer, more resilient, and more secure organizations.
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
    <section className="relative px-8 md:px-16 py-24 md:py-32 bg-surface-2/30 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">

        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Vision Card */}
          <Reveal delay={0.1}>
            <div className="group relative h-full p-6 md:p-8 border border-foreground/10 bg-background/40 backdrop-blur-md rounded-xl hover:border-primary/50 hover:bg-background/60 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-3xl" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 mb-6 rounded-2xl border border-primary/30 flex items-center justify-center bg-primary/10 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors duration-500 flex items-center gap-3">
                  Our Vision
                </h3>
                <div className="font-mono text-[10px] tracking-[0.1em] text-primary uppercase mb-4">
                  Trusted Leadership in Physical Security
                </div>
                <p className="text-foreground/60 leading-relaxed font-light text-base">
                  To become the trusted leader in physical security consultancy — renowned for our expertise, innovation, and unwavering commitment to excellence. We aspire to continually push the boundaries of security solutions, shaping a safer world for generations to come.
                </p>
              </div>
            </div>
          </Reveal>
          
          {/* Mission Card */}
          <Reveal delay={0.2}>
            <div className="group relative h-full p-6 md:p-8 border border-foreground/10 bg-background/40 backdrop-blur-md rounded-xl hover:border-primary/50 hover:bg-background/60 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-tl from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-3xl" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 mb-6 rounded-2xl border border-primary/30 flex items-center justify-center bg-primary/10 text-primary group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors duration-500 flex items-center gap-3">
                  Our Mission
                </h3>
                <div className="font-mono text-[10px] tracking-[0.1em] text-primary uppercase mb-4">
                  Protecting Assets, Ensuring Safety
                </div>
                <p className="text-foreground/60 leading-relaxed font-light text-base">
                  To protect our clients' assets and ensure their safety through thorough analysis, creative solutions, and unwavering commitment to excellence in physical security consultancy. We deliver customized strategies that surpass expectations, empowering our clients to thrive in a secure environment.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Values Card */}
          <Reveal delay={0.3}>
            <div className="group relative h-full p-6 md:p-8 border border-foreground/10 bg-background/40 backdrop-blur-md rounded-xl hover:border-primary/50 hover:bg-background/60 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-3xl" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 mb-6 rounded-2xl border border-primary/30 flex items-center justify-center bg-primary/10 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors duration-500 flex items-center gap-3">
                  Our Values
                </h3>
                <div className="font-mono text-[10px] tracking-[0.1em] text-primary uppercase mb-4">
                  Integrity &amp; Excellence
                </div>
                <p className="text-foreground/60 leading-relaxed font-light text-base">
                  Our practice is founded on integrity, technical excellence, and independence. With a clear understanding of the security challenges facing critical infrastructure, we are committed to practical, reliable, and forward-looking solutions.
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
    { value: 2020, suffix: "", label: t("about.stats.established"), prefix: "" },
    { value: 5, suffix: "", label: t("about.stats.offices"), prefix: "" },
    { value: 120, suffix: "+", label: t("about.stats.projects"), prefix: "" },
    { value: 100, suffix: "%", label: t("about.stats.local"), prefix: "" },
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
                  className={`w-full text-left group flex items-start gap-5 py-5 md:py-6 border-b border-foreground/10 transition-colors duration-500 ${
                    active === i ? "border-primary/40" : ""
                  }`}
                >
                  <span
                    className={`font-mono text-xs tracking-widest pt-1 transition-colors duration-500 ${
                      active === i ? "text-primary" : "text-foreground/30"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-display text-xl md:text-2xl tracking-tight transition-colors duration-500 ${
                        active === i ? "text-foreground" : "text-foreground/45"
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
    <section className="relative px-8 md:px-16 py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=2400&q=80"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight max-w-3xl leading-[1.05]">
            {t("about_page.ready_title")}{" "}
            <em className="text-primary not-italic font-light">{t("about_page.ready_italic")}</em>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 text-foreground/55 max-w-md font-light leading-relaxed">
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
              className="rounded-sm border border-foreground/15 px-8 py-4 font-sans text-xs font-bold tracking-[0.2em] text-foreground/70 transition-all duration-400 hover:border-primary hover:text-primary"
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
    <footer className="bg-foreground text-background py-12 border-t border-gold/20">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <img
          src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png"
          alt="VISO"
          loading="lazy"
          decoding="async"
          className="h-10 w-auto object-contain brightness-0 invert"
        />
        <p className="font-sans text-xs text-background/50 tracking-wide">
          © {new Date().getFullYear()} VISO Group. All rights reserved.
        </p>
        <div className="flex gap-6 font-sans text-xs text-background/60">
          <Link to="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <Link to="/contact" className="hover:text-gold transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Regulatory Cards ---------- */
function RegulatoryCards() {
  const cards = [
    {
      title: "MOI",
      desc: "Ministry of Interior Regulatory Frameworks.",
      url: "/regulatory/moi",
      color: "from-blue-950 to-slate-900 border-blue-500/20 hover:border-blue-400/60 shadow-blue-900/20"
    },
    {
      title: "SAIS",
      desc: "Supreme Authority for Industrial Security Standards.",
      url: "/regulatory/sais",
      color: "from-emerald-950 to-slate-900 border-emerald-500/20 hover:border-emerald-400/60 shadow-emerald-900/20"
    },
    {
      title: "Supervision",
      desc: "Comprehensive Project Security Supervision.",
      url: "/regulatory/hcis", // Usually HCIS or a dedicated supervision route
      color: "from-purple-950 to-slate-900 border-purple-500/20 hover:border-purple-400/60 shadow-purple-900/20"
    }
  ];

  return (
    <section className="py-20 bg-background relative z-10">
      <div className="mx-auto max-w-6xl px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <Link key={i} to={card.url} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative h-full flex flex-col p-8 rounded-2xl border bg-gradient-to-br ${card.color} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden`}
              >
                {/* Decorative background element */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500" />
                
                <h3 className="text-3xl font-display font-semibold text-white mb-4 relative z-10 group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-white/70 font-sans text-sm leading-relaxed mb-8 flex-grow relative z-10">{card.desc}</p>
                <div className="mt-auto flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/50 group-hover:text-primary transition-colors relative z-10">
                  <span>Explore</span>
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
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
    img: "https://visogroup.com/wp-content/uploads/2024/05/HCIS-2.png"
  },
  {
    org: "Literature, Publishing & Translation commission",
    certs: ["License to Practice Translation Profession"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/Literature-Publishing-Translation-commission.png"
  },
  {
    org: "Ministry of Commerce",
    certs: ["Commercial Register for Security Consultancy Activities", "Commercial Register for Translation Activities"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/Ministry-of-commerce.png"
  },
  {
    org: "Balady",
    certs: ["Municipal License"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/Balady.png"
  },
  {
    org: "ISO 9001:2015",
    certs: ["Quality Management System", "Security Risk Assessment, Preliminary Design of Security System, Detail Design of Security System, Operational Readiness"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/ISO9001.jpg"
  },
  {
    org: "ISO 45001:2018",
    certs: ["Occupational Health & Safety Management System", "Security Risk Assessment, Preliminary Design of Security System, Detail Design of Security System, Operational Readiness"],
    img: "https://visogroup.com/wp-content/uploads/2024/05/ISO45001.png"
  }
];

function LicensesAndCertifications() {
  return (
    <section id="licenses" className="relative z-20 bg-background py-24 border-t border-foreground/10">
      <div className="mx-auto max-w-6xl px-8">
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {certificatesData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm hover:shadow-lg transition-all hover:border-primary/50"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <div className="w-full bg-white flex items-center justify-center border-b border-foreground/10 overflow-hidden relative p-6 h-48">
                <img loading="lazy" decoding="async" src={item.img} alt={item.org} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-foreground mb-4 leading-snug">{item.org}</h3>
                <ul className="space-y-2 mt-auto">
                  {item.certs.map((c, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-foreground/70 leading-tight">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
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
  );
}
