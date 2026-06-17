import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: StoryPage,
  head: () => ({
    meta: [
      { title: "Viso Security | Advanced Protective Intelligence" },
      { name: "description", content: "Elite security architecture and vulnerability management for the Kingdom's sovereign operations." },
    ],
  }),
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================================================
   LOADING SCREEN
   ============================================================ */
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
    >
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_50%_50%,#00AEEF22,transparent_60%)]" />
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160" className="drop-shadow-[0_0_30px_#00AEEF80]">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00AEEF" />
              <stop offset="100%" stopColor="#0066ff" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r="60" fill="none" stroke="#ffffff10" strokeWidth="2" />
          <motion.circle
            cx="80" cy="80" r="60" fill="none" stroke="url(#lg)" strokeWidth="2"
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={(1 - progress) * 2 * Math.PI * 60}
            transform="rotate(-90 80 80)"
          />
          <path d="M80 40 L110 55 V85 C110 105 80 120 80 120 C80 120 50 105 50 85 V55 Z"
            fill="none" stroke="url(#lg)" strokeWidth="1.5" />
        </svg>
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00AEEF] to-transparent"
          style={{ top: `${20 + progress * 120}px` }}
        />
      </div>
      <div className="mt-10 font-mono text-xs tracking-[0.4em] text-foreground/60">
        SECURE BOOT · {Math.floor(progress * 100).toString().padStart(3, "0")}%
      </div>
    </motion.div>
  );
}

/* ============================================================
   NAV / SCROLL PROGRESS
   ============================================================ */
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[150] h-[2px] origin-left bg-gradient-to-r from-[#00AEEF] via-[#3dd9ff] to-[#00AEEF] shadow-[0_0_12px_#00AEEF]"
    />
  );
}

function TopNav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[140] flex items-center justify-between px-8 py-5 mix-blend-difference">
      <div className="font-mono text-xs tracking-[0.3em] text-foreground">VISO · ADVANCED SECURITY</div>
      <div className="flex items-center gap-6">
        <ThemeToggle />
        <div className="hidden md:flex gap-8 font-mono text-[10px] tracking-[0.3em] text-foreground/70">
          <span>MODULES 01 — 09</span>
          <span>RIYADH · KSA</span>
        </div>
        <Link to="/home" className="rounded-full border border-foreground/20 bg-foreground/10 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-foreground hover:bg-foreground/20 transition-colors backdrop-blur">
          ENTER SITE
        </Link>
      </div>
    </div>
  );
}

/* ============================================================
   HERO CAROUSEL
   ============================================================ */
function HeroCarousel() {
  const images = ["/images/hero_1.png", "/images/hero_2.png", "/images/hero_3.png"];
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-background">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity"
        />
      </AnimatePresence>
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_20%,var(--color-background)_80%)]" />
      <div className="absolute inset-0 bg-background/20" />
    </div>
  );
}

/* ============================================================
   SECTION 1 — HERO
   ============================================================ */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const scanY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const subline = "An elite security advisory firm based in Riyadh, dedicated to safeguarding vital operations and critical infrastructure region-wide.";
  const chars = subline.split("");

  return (
    <section ref={ref} className="relative h-[110vh] overflow-hidden bg-background">
      <HeroCarousel />
      
      {/* sweep scan line */}
      <motion.div
        style={{ top: scanY }}
        className="pointer-events-none absolute left-0 right-0 h-[140px] bg-gradient-to-b from-transparent via-[#00AEEF22] to-transparent z-10"
      />

      <motion.div style={{ y: titleY }} className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-6 font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]"
        >
          ◉ STRATEGIC OVERSIGHT · RIYADH HQ
        </motion.div>
        <h1 className="max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.95] tracking-tight text-foreground">
          {"Engineering Resilience.\nProtecting the Future.".split("\n").map((line, i) => (
            <motion.span
              key={i} className="block"
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.span>
          ))}
        </h1>
        <p className="mt-8 max-w-2xl text-base text-foreground/60">
          {chars.map((c, i) => (
            <motion.span
              key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.9 + i * 0.012 }}
            >{c}</motion.span>
          ))}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] tracking-[0.3em] text-foreground/40">
          {["VULNERABILITY", "INTELLIGENCE", "COMPLIANCE", "ARCHITECTURE"].map((c, i) => (
            <span key={c} className="flex items-center gap-3">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-[#00AEEF]/60" />}
              {c}
            </span>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-12"
        >
          <RadarPing />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-foreground/40 z-20"
      >
        INITIATE SEQUENCE ↓
      </motion.div>
    </section>
  );
}

function RadarPing() {
  return (
    <div className="relative flex items-center justify-center h-24 w-24">
      <motion.div className="absolute h-full w-full rounded-full border border-[#00AEEF]/50" animate={{ scale: [1, 2], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
      <motion.div className="absolute h-full w-full rounded-full border border-[#00AEEF]/30" animate={{ scale: [1, 2], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }} />
      <div className="h-4 w-4 rounded-full bg-[#00AEEF] shadow-[0_0_15px_#00AEEF]" />
    </div>
  );
}

/* ============================================================
   SECTION 2 — THE IMPERATIVE (Pinned Threat Section)
   ============================================================ */
function ThreatImperativeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const dotCount = useTransform(scrollYProgress, [0, 1], [40, 600]);
  const [dots, setDots] = useState(40);
  useEffect(() => dotCount.on("change", (v) => setDots(Math.floor(v))), [dotCount]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/cap_bg.png')] bg-cover bg-center mix-blend-overlay" />
        
        <svg viewBox="0 0 800 400" className="absolute inset-0 h-full w-full">
          {Array.from({ length: dots }).map((_, i) => {
            const x = (i * 73) % 780 + 10;
            const y = (i * 47) % 380 + 10;
            return (
              <motion.circle
                key={i} cx={x} cy={y} r="1.6" fill="#ff3855"
                initial={{ opacity: 0 }} animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: (i % 20) * 0.05 }}
              />
            );
          })}
        </svg>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <div className="font-mono text-[10px] tracking-[0.4em] text-[#ff3855]">PHASE 01 · THE IMPERATIVE</div>
            <h2 className="mt-4 max-w-3xl text-5xl font-light leading-tight text-foreground md:text-7xl">
              The Imperative of <span className="italic text-[#ff3855]">Absolute Defense</span>.
            </h2>
            <p className="mt-6 max-w-xl text-foreground/60">Unauthorized access, structural breaches, and compliance failures represent critical risks to your operations. Proactive mitigation is no longer optional.</p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <ThreatStat n={100} suffix="%" label="Exposure across highly connected, digitized industrial frameworks" delay={0} />
            <ThreatStat n={360} suffix="°" label="Continuous surveillance required to preempt modern intrusion tactics" delay={0.2} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ThreatStat({ n, suffix, label, delay }: { n: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const obj = { v: 0 };
    gsap.to(obj, { v: n, duration: 2.2, delay, ease: "power3.out", onUpdate: () => setVal(Math.floor(obj.v)) });
  }, [inView, n, delay]);
  return (
    <motion.div
      ref={ref}
      initial={{ y: 80, opacity: 0, rotateX: -20 }}
      whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-surface/50 p-8 backdrop-blur-xl"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#00AEEF]/10 blur-3xl" />
      <div className="font-mono text-[10px] tracking-[0.3em] text-foreground/40">ANALYTIC · 0{Math.floor(delay * 10) + 1}</div>
      <div className="mt-3 text-6xl font-light text-foreground md:text-7xl">
        {val}<span className="text-[#00AEEF]">{suffix}</span>
      </div>
      <div className="mt-3 text-sm text-foreground/60">{label}</div>
    </motion.div>
  );
}

/* ============================================================
   SECTION 3 — CORE CAPABILITIES (Combined SOC & KDOCS)
   ============================================================ */
function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const capabilities = [
    { code: "VRA", t: "Vulnerability & Risk Analysis", d: "Systematic evaluation of critical assets to determine proportional defensive measures." },
    { code: "GTI", t: "Global Threat Intelligence", d: "Comprehensive analysis of local and global threat landscapes to protect operations." },
    { code: "IST", t: "Infrastructure Stress Testing", d: "Simulated adversarial attacks on physical and digital environments to expose gaps." },
    { code: "BSA", t: "Bespoke Security Architecture", d: "End-to-end design and engineering of advanced security frameworks." },
    { code: "RAA", t: "Regulatory Assurance & Auditing", d: "Detailed on-site evaluations to guarantee alignment with strict industry standards." },
    { code: "SSE", t: "Strategic Security Education", d: "Specialized capacity-building programs for security personnel and leadership teams." },
  ];

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-background py-32">
      <div className="absolute right-0 top-0 opacity-20 w-1/2 h-full bg-[url('/images/cap_bg.png')] bg-cover bg-left mix-blend-screen [mask-image:linear-gradient(to_left,black,transparent)]" />
      <div className="mx-auto max-w-7xl px-8 relative z-10">
        <div className="mb-16">
          <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">PHASE 02 · FULL SPECTRUM SERVICES</div>
          <h2 className="mt-4 max-w-3xl text-5xl font-light leading-tight text-foreground md:text-7xl">
            Unified protection. <br /><span className="text-foreground/40">Architected for scale.</span>
          </h2>
          <p className="mt-6 max-w-xl text-foreground/60">An integrated methodology converging rigorous risk evaluation, architectural design, and operational compliance into a cohesive defensive matrix.</p>
        </div>

        <motion.div style={{ x }} className="relative grid gap-4 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.code}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -5, borderColor: "rgba(0, 174, 239, 0.5)", boxShadow: "0 10px 30px -10px rgba(0,174,239,0.3)" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-foreground/10 bg-surface-2/50 p-6 backdrop-blur-md transition-all duration-300"
            >
              <div className="flex items-center justify-between font-mono text-[9px] text-[#00AEEF]/70">
                <span>{cap.code}-{String(i + 1).padStart(2, "0")}</span>
                <span className="text-foreground/30">ACTIVE</span>
              </div>
              <div className="mt-8 text-xl font-light text-foreground">{cap.t}</div>
              <div className="mt-2 text-sm text-foreground/50">{cap.d}</div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#00AEEF] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-20 flex justify-center">
          <Link to="/home" className="group flex items-center gap-3 rounded-full border border-[#00AEEF]/50 px-8 py-4 font-mono text-[11px] tracking-[0.2em] text-[#00AEEF] hover:bg-[#00AEEF]/10 transition-colors">
            ENGAGE OUR TEAM <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 4 — DEFENSE PILLARS
   ============================================================ */
function DefensePillarsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const stages = [
    "PERSONNEL — Safeguarding individual wellbeing", 
    "PHYSICAL ASSETS — Multi-tiered barrier networks", 
    "DATA INTEGRITY — Securing sensitive network nodes", 
    "CONTINUOUS AUDIT — Relentless system verification"
  ];
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const [stage, setStage] = useState(0);
  useEffect(() => scrollYProgress.on("change", (v) => setStage(Math.min(3, Math.floor(v * 4)))), [scrollYProgress]);

  const tint = ["transparent", "#00AEEF", "#4a00e0", "#ff3855"][stage];

  return (
    <section ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 transition-colors duration-700 opacity-[0.03]" style={{ backgroundColor: tint }} />
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_center,#00AEEF22,transparent_60%)]" />
        <div className="relative grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-8 md:grid-cols-2">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">PHASE 03 · CORE METHODOLOGY</div>
            <h2 className="mt-4 text-5xl font-light leading-tight text-foreground md:text-7xl">Comprehensive defense <span className="italic text-[#00AEEF]">at every layer</span>.</h2>
            <p className="mt-6 max-w-md text-foreground/60">Personnel, Physical Assets, and Data Integrity — defended through layered strategies, advanced technology, and rigorous auditing.</p>
            <div className="mt-10 space-y-3">
              {stages.map((s, i) => (
                <motion.div
                  key={s}
                  animate={{ opacity: stage >= i ? 1 : 0.25, x: stage >= i ? 0 : -10 }}
                  className="flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-foreground"
                >
                  <span className={`h-px transition-all ${stage >= i ? "w-12 bg-[#00AEEF]" : "w-4 bg-foreground/30"}`} />
                  <span>{String(i + 1).padStart(2, "0")} · {s}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <motion.div style={{ rotateY: rotate }} className="relative" >
              <BadgeArt stage={stage} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BadgeArt({ stage }: { stage: number }) {
  return (
    <div className="relative h-[340px] w-[240px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, scale: 0.85, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 rounded-2xl border border-[#00AEEF]/40 bg-surface/50 p-6 shadow-[0_0_60px_#00AEEF40] backdrop-blur-xl"
        >
          <div className="font-mono text-[9px] tracking-[0.3em] text-[#00AEEF]">VISO · CLEARANCE</div>
          <div className="mt-6 flex h-40 items-center justify-center">
            {stage === 0 && <div className="h-20 w-32 rounded border border-[#00AEEF] [background:repeating-linear-gradient(45deg,#00AEEF10,#00AEEF10_4px,transparent_4px,transparent_8px)]" />}
            {stage === 1 && <div className="h-24 w-24 rounded-full border-2 border-dashed border-[#00AEEF] animate-spin-slow" />}
            {stage === 2 && <div className="h-16 w-16 border-4 border-double border-[#00AEEF] rotate-45" />}
            {stage === 3 && <div className="flex gap-2"><span className="h-16 w-4 bg-[#00AEEF]" /><span className="h-16 w-4 bg-[#00AEEF]/50" /><span className="h-16 w-4 bg-[#00AEEF]/20" /></div>}
          </div>
          <div className="mt-4 font-mono text-xs text-foreground/70">LEVEL · {stage + 1} / 4</div>
          <div className="mt-1 font-mono text-[10px] text-foreground/40">ID-2026-{(stage + 1) * 1731}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   SECTION 5 — SOVEREIGN ASSETS
   ============================================================ */
function SovereignAssetsSection() {
  const industries = [
    { name: "Petrochemicals & Energy", sub: "Refineries · Pipelines · Generation Nodes" },
    { name: "Maritime Logistics", sub: "Commercial Ports · Naval Facilities" },
    { name: "Mega-Infrastructure", sub: "Aviation Hubs · Transit Networks" },
    { name: "Governmental Sectors", sub: "Ministries · Sovereign Facilities" },
    { name: "Giga-Development", sub: "Next-Gen Cities · Hospitality Ecosystems" },
  ];
  return (
    <section className="relative bg-background py-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">PHASE 04 · SECTOR EXPERTISE</div>
        <h2 className="mt-4 max-w-3xl text-5xl font-light leading-tight text-foreground md:text-7xl">
          The Defensive Foundation for <span className="italic">Sovereign Assets</span>.
        </h2>

        <div className="mt-20 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 80, filter: "blur(20px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-72 overflow-hidden rounded-xl border border-foreground/10 bg-surface/30 p-6 backdrop-blur-xl transition-colors hover:border-[#00AEEF]/50"
            >
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(#00AEEF22_1px,transparent_1px),linear-gradient(90deg,#00AEEF22_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="relative mt-auto pt-32">
                <div className="font-mono text-[9px] tracking-[0.3em] text-foreground/40">SECTOR {String(i + 1).padStart(2, "0")}</div>
                <div className="mt-2 text-xl font-light text-foreground">{ind.name}</div>
                <div className="mt-2 text-[11px] text-foreground/40">{ind.sub}</div>
              </div>
              <motion.div
                className="absolute inset-x-0 bottom-0 h-px bg-[#00AEEF]"
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 + i * 0.12 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 6 — PROCESS
   ============================================================ */
function ProcessSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const distance = track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    { n: "01", t: "Initial Conception", d: "Defining strict parameters, mapping threat vectors, and aligning operational mandates." },
    { n: "02", t: "Vulnerability Auditing", d: "Executing deep-dive assessments to identify structural and procedural weaknesses." },
    { n: "03", t: "Architectural Blueprint", d: "Drafting robust, highly resilient protective blueprints optimized for threat deterrence." },
    { n: "04", t: "Implementation Oversight", d: "Guiding the deployment of technologies and physical barriers to exact specifications." },
    { n: "05", t: "Operational Readiness", d: "Final stress testing and handover, ensuring the system operates with absolute certainty." },
  ];

  return (
    <section ref={wrapRef} className="relative h-screen overflow-hidden bg-background">
      <div className="absolute top-10 left-8 z-10">
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">PHASE 05 · EXECUTION WORKFLOW</div>
        <h2 className="mt-2 text-3xl font-light text-foreground md:text-5xl">From Conception to Operational Readiness.</h2>
      </div>
      <div ref={trackRef} className="flex h-full items-center gap-10 pl-[10vw] pr-[20vw] will-change-transform">
        {steps.map((s, i) => (
          <div key={s.n} className="relative flex h-[60vh] w-[70vw] shrink-0 flex-col justify-between rounded-2xl border border-foreground/10 bg-surface/50 p-10 backdrop-blur-xl md:w-[40vw]">
            <div className="font-mono text-[180px] leading-none text-[#00AEEF]/10 md:text-[260px]">{s.n}</div>
            <div>
              <div className="font-mono text-xs tracking-[0.3em] text-[#00AEEF]">STAGE {s.n}</div>
              <div className="mt-2 text-4xl font-light text-foreground md:text-6xl">{s.t}</div>
              <div className="mt-4 max-w-md text-foreground/60">{s.d}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="absolute -right-8 top-1/2 hidden h-px w-10 bg-[#00AEEF]/30 md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 7 — INCIDENT RESPONSE
   ============================================================ */
function IncidentResponseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [phase, setPhase] = useState(0);
  useEffect(() => scrollYProgress.on("change", (v) => setPhase(Math.min(4, Math.floor(v * 5)))), [scrollYProgress]);

  const phases = [
    { t: "Discourage — Preempt adversarial action", c: "#ff3855" },
    { t: "Discover — Rapid anomaly identification", c: "#ff8c1a" },
    { t: "Disrupt — Impede threat progression", c: "#ffd400" },
    { t: "Neutralize — Eliminate the active risk", c: "#3df58b" },
    { t: "Restore — Rapid return to normality", c: "#00AEEF" },
  ];
  const active = phases[phase];

  return (
    <section ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-background">
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: phase < 4 ? [0.2, 0.5, 0.2] : 0 }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ background: `radial-gradient(circle at center, ${active.c}33, transparent 60%)` }}
        />
        {phase < 4 && (
          <motion.div
            className="absolute inset-0 origin-center"
            animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${active.c}22 30deg, transparent 60deg)` }}
          />
        )}

        <div className="relative z-10 mx-auto max-w-5xl px-8 text-center">
          <div className="font-mono text-[10px] tracking-[0.4em]" style={{ color: active.c }}>
            PHASE 06 · CRISIS MITIGATION SEQUENCE
          </div>
          <AnimatePresence mode="wait">
            <motion.h2
              key={phase}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-6xl font-light text-foreground md:text-8xl"
              style={{ textShadow: `0 0 60px ${active.c}` }}
            >
              {active.t}
            </motion.h2>
          </AnimatePresence>

          <div className="mt-12 flex justify-center gap-2">
            {phases.map((p, i) => (
              <div key={i} className="h-1 w-16 rounded-full transition-all" style={{ background: phase >= i ? p.c : "#ffffff20" }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 8 — TRUST METRICS
   ============================================================ */
function TrustMetricsSection() {
  const metrics = [
    { n: 120, suffix: "+", label: "Audits Completed (Since 2020)" },
    { n: 5, suffix: "", label: "Regional Headquarters" },
    { n: 99.9, suffix: "%", label: "Compliance Success Rate" },
  ];
  return (
    <section className="relative bg-background py-40">
      <div className="mx-auto max-w-7xl px-8">
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">PHASE 07 · QUANTIFIABLE IMPACT</div>
        <h2 className="mt-4 max-w-3xl text-5xl font-light leading-tight text-foreground md:text-7xl">Verified Security Matrices.</h2>
        <div className="mt-20 grid gap-12 md:grid-cols-3">
          {metrics.map((m, i) => <BigCounter key={i} {...m} delay={i * 0.15} />)}
        </div>
      </div>
    </section>
  );
}

function BigCounter({ n, suffix, label, delay }: { n: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const o = { v: 0 };
    gsap.to(o, { v: n, duration: 2.4, delay, ease: "power3.out", onUpdate: () => setV(o.v) });
  }, [inView, n, delay]);
  const display = n % 1 ? v.toFixed(1) : Math.floor(v);
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.9, delay }}
    >
      <div className="text-[120px] font-extralight leading-none text-foreground md:text-[180px]">
        {display}<span className="text-[#00AEEF]">{suffix}</span>
      </div>
      <div className="mt-4 font-mono text-xs tracking-[0.3em] text-foreground/50">{label.toUpperCase()}</div>
    </motion.div>
  );
}

/* ============================================================
   SECTION 9 — WHY CHOOSE
   ============================================================ */
function WhyChooseSection() {
  const items = [
    { q: "Hyper-specialized advisory dedicated exclusively to advanced physical and digital perimeter security.", a: "Distinct Advantage · 01" },
    { q: "Deep regulatory insight ensuring flawless alignment with stringent sovereign mandates.", a: "Distinct Advantage · 02" },
    { q: "Unbiased, vendor-agnostic consulting focused entirely on optimal defensive outcomes.", a: "Distinct Advantage · 03" },
  ];
  return (
    <section className="relative bg-background py-32">
      <div className="mx-auto max-w-5xl px-8">
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">PHASE 08 · THE VISO DIFFERENCE</div>
        <h2 className="mt-4 text-5xl font-light leading-tight text-foreground md:text-6xl">Uncompromising Expertise.</h2>
        <div className="mt-20 space-y-6">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -6, rotate: 0.4 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-surface/40 p-10 backdrop-blur-xl"
            >
              <div className="absolute right-6 top-6 font-mono text-[9px] tracking-[0.3em] text-[#00AEEF]/70">VERIFIED</div>
              <div className="absolute left-0 top-0 h-full w-1 bg-[#00AEEF]" />
              <p className="text-2xl font-light leading-snug text-foreground md:text-3xl">"{it.q}"</p>
              <div className="mt-6 font-mono text-xs tracking-[0.2em] text-foreground/50">— {it.a}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 10 — MISSION CONTROL
   ============================================================ */
function MissionControlSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const earthScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.05]);
  const glow = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const btnRef = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 15 });
  const sy = useSpring(my, { stiffness: 200, damping: 15 });
  const onMove = (e: React.MouseEvent) => {
    const r = btnRef.current!.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-background">
        <motion.div style={{ opacity: glow }} className="absolute inset-0 [background:radial-gradient(circle_at_center,#00AEEF33,transparent_55%)]" />
        <motion.div style={{ scale: earthScale, rotate }} className="absolute h-[120vh] w-[120vh] rounded-full">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#0a3a6b,#020a18_70%,#000)] shadow-[inset_0_0_120px_#00AEEF60]" />
          <svg viewBox="0 0 400 400" className="absolute inset-0">
            {[...Array(60)].map((_, i) => {
              const a = (i / 60) * Math.PI * 2;
              const r1 = 180, r2 = 190 + (i % 5) * 6;
              return (
                <motion.line
                  key={i}
                  x1={200 + Math.cos(a) * r1} y1={200 + Math.sin(a) * r1}
                  x2={200 + Math.cos(a) * r2} y2={200 + Math.sin(a) * r2}
                  stroke="#00AEEF" strokeWidth="0.5"
                  animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, delay: i * 0.05, repeat: Infinity }}
                />
              );
            })}
          </svg>
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1 }}
            className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]"
          >
            PHASE 09 · INITIATION
          </motion.div>
          <h2 className="mt-6 text-6xl font-light leading-[0.95] tracking-tight text-foreground md:text-8xl">
            Securing the <br /><span className="italic text-[#00AEEF]">Horizon</span>.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-foreground/60">
            Elevating defensive protocols to guarantee absolute resilience across your most critical infrastructure.
          </p>
          <div className="mt-12">
            <motion.button
              ref={btnRef}
              onMouseMove={onMove} onMouseLeave={onLeave}
              style={{ x: sx, y: sy }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-full border border-[#00AEEF] bg-[#00AEEF]/10 px-10 py-5 font-mono text-sm tracking-[0.25em] text-foreground shadow-[0_0_40px_#00AEEF80] backdrop-blur-xl transition-shadow hover:shadow-[0_0_80px_#00AEEFcc]"
            >
              <span className="relative">INITIATE CONSULTATION →</span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PARTICLES (background)
   ============================================================ */
function Particles() {
  const items = Array.from({ length: 30 });
  return (
    <div className="pointer-events-none fixed inset-0 z-[10] overflow-hidden">
      {items.map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[#00AEEF]"
          initial={{ x: `${(i * 37) % 100}%`, y: "110%", opacity: 0 }}
          animate={{ y: "-10%", opacity: [0, 0.6, 0] }}
          transition={{ duration: 12 + (i % 6) * 2, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
          style={{ left: `${(i * 37) % 100}%` }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
function StoryPage() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="bg-background text-foreground">
      <SmoothScroll />
      <AnimatePresence>{loading && <LoadingScreen onDone={() => setLoading(false)} />}</AnimatePresence>
      <ProgressBar />
      <TopNav />
      <Particles />
      <main className="relative z-20">
        <HeroSection />
        <ThreatImperativeSection />
        <CapabilitiesSection />
        <DefensePillarsSection />
        <SovereignAssetsSection />
        <ProcessSection />
        <IncidentResponseSection />
        <TrustMetricsSection />
        <WhyChooseSection />
        <MissionControlSection />
      </main>
    </div>
  );
}
