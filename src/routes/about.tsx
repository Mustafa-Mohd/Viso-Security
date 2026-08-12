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
  const pageTitle = cms?.title || "A Professional Digital Company Profile";
  const pageSubtitle =
    cms?.subtitle ||
    "Security consultancy across risk assessment, design, supervision and operational readiness — connected to the services and portals that support every project.";
  const services =
    cms?.services?.length > 0
      ? cms.services.map((s: any) => ({ title: s.title, desc: s.desc }))
      : defaultServices;
  const profile =
    cms?.profileContents?.length > 0 ? cms.profileContents : defaultProfile;

  return (
    <div className="bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <TopNav />
      <AboutHero />
      <WhoWeAre title={whoTitle} desc={whoDesc} secondary={t("about.desc2")} />
      <StatsBand />
      <Capabilities services={services} title={pageTitle} subtitle={pageSubtitle} />
      <ProfileJourney items={profile} />
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
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80"
          alt="Architectural structure"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-[120%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
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
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
              <span className="text-gold">01</span>
              <span className="h-px w-8 bg-border" />
              <span>{t("about.who_we_are")}</span>
            </div>
          </Reveal>
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
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
              <span className="text-gold">02</span>
              <span className="h-px w-8 bg-border" />
              <span>Capabilities</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.1] tracking-tight">
              {title}
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
        <Reveal>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
            <span className="text-gold">03</span>
            <span className="h-px w-8 bg-border" />
            <span>Company Profile</span>
          </div>
        </Reveal>
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
          src="https://res.cloudinary.com/dcefror3c/image/upload/v1782911668/Luxurious_black_and_gold_logo_design_kjv4np.png"
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
        className="absolute inset-0 h-[130%] w-full object-cover -top-[15%]"
      />
    </div>
  );
}
