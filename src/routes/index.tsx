import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScroll } from "@/components/SmoothScroll";

import { TopNav } from "@/components/TopNav";

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
      <div className="absolute inset-0 opacity-30 " />
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160" className="drop-shadow-[0_0_30px_#DF9B2A80]">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DF9B2A" />
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
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DF9B2A] to-transparent"
          style={{ top: `${20 + progress * 120}px` }}
        />
      </div>
      <div className="mt-10 font-mono text-xs tracking-[0.4em] text-foreground/80">
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
      className="fixed top-0 left-0 right-0 z-[150] h-[2px] origin-left bg-gradient-to-r from-[#DF9B2A] via-[#3dd9ff] to-[#DF9B2A] shadow-[0_0_12px_#DF9B2A]"
    />
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
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover "
        />
      </AnimatePresence>
      {/* Subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40" />
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
        className="pointer-events-none absolute left-0 right-0 h-[140px]  z-10"
      />

      <motion.div style={{ y: titleY }} className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-6 font-mono text-[10px] tracking-[0.4em] text-[#DF9B2A]"
        >
          ◉ STRATEGIC OVERSIGHT · RIYADH HQ
        </motion.div>
        <h1 className="max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.95] tracking-tight text-white">
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
        <p className="mt-8 max-w-2xl text-base text-white/80">
          {chars.map((c, i) => (
            <motion.span
              key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.9 + i * 0.012 }}
            >{c}</motion.span>
          ))}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] tracking-[0.3em] text-white/60">
          {["VULNERABILITY", "INTELLIGENCE", "COMPLIANCE", "ARCHITECTURE"].map((c, i) => (
            <span key={c} className="flex items-center gap-3">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-[#DF9B2A]/60" />}
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
      <motion.div className="absolute h-full w-full rounded-full border border-[#DF9B2A]/50" animate={{ scale: [1, 2], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
      <motion.div className="absolute h-full w-full rounded-full border border-[#DF9B2A]/30" animate={{ scale: [1, 2], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }} />
      <div className="h-4 w-4 rounded-full bg-[#DF9B2A] shadow-[0_0_15px_#DF9B2A]" />
    </div>
  );
}

/* ============================================================
   SECTION 2 — THE IMPERATIVE (Pinned Threat Section)
   ============================================================ */
function ThreatImperativeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const v1 = useRef<HTMLVideoElement>(null);
  const v2 = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const inView = useInView(sectionRef, { amount: 0.3 });

  useEffect(() => {
    if (inView) {
      if (active === 0) v1.current?.play().catch(() => {});
      else v2.current?.play().catch(() => {});
    } else {
      v1.current?.pause();
      v2.current?.pause();
    }
  }, [inView, active]);

  return (
    <section ref={sectionRef} className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
      <video
        ref={v1}
        src="https://res.cloudinary.com/dcefror3c/video/upload/v1782413947/Create_an_second_ultra_premi_gm7co0.mp4"
        playsInline
        onEnded={() => setActive(1)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${active === 0 ? "opacity-100 z-10" : "opacity-0 z-0"}`}
      />
      <video
        ref={v2}
        src="https://res.cloudinary.com/dcefror3c/video/upload/v1782415959/according_to_u_add_continuatio_wflq57.mp4"
        playsInline
        onEnded={() => setActive(0)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${active === 1 ? "opacity-100 z-10" : "opacity-0 z-0"}`}
      />
    </section>
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
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-black py-32">
      <div className="absolute right-0 top-0 w-full md:w-2/3 h-full bg-[url('/images/cap_bg.png')] bg-cover bg-left [mask-image:linear-gradient(to_left,black,transparent)] opacity-60 mix-blend-lighten" />
      <div className="mx-auto max-w-7xl px-8 relative z-10">
        <div className="mb-16">
          <div className="font-mono text-[10px] tracking-[0.4em] text-[#DF9B2A]">PHASE 02 · FULL SPECTRUM SERVICES</div>
          <h2 className="mt-4 max-w-3xl text-5xl font-light leading-tight text-white md:text-7xl">
            Unified protection. <br /><span className="text-white/40">Architected for scale.</span>
          </h2>
          <p className="mt-6 max-w-xl text-white/80">An integrated methodology converging rigorous risk evaluation, architectural design, and operational compliance into a cohesive defensive matrix.</p>
        </div>

        <motion.div style={{ x }} className="relative grid gap-6 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.code}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group relative aspect-[4/3] w-full [perspective:1000px]"
            >
              <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Face */}
                <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm [backface-visibility:hidden]">
                  <div className="flex items-center justify-between font-mono text-[9px] text-[#DF9B2A]">
                    <span>{cap.code}-{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-white/30 tracking-widest transition-colors group-hover:text-[#DF9B2A]">HOVER</span>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-white leading-snug">{cap.t}</div>
                    <div className="mt-6 h-px w-12 bg-[#DF9B2A]" />
                  </div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 flex flex-col justify-center overflow-hidden rounded-xl border border-[#DF9B2A]/30 bg-black p-8 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="absolute inset-0 bg-[#DF9B2A]/10" />
                  <div className="relative z-10">
                    <div className="font-mono text-[9px] tracking-widest text-[#DF9B2A] mb-4">SYSTEM DETAILS</div>
                    <div className="text-sm text-white/90 leading-relaxed">{cap.d}</div>
                    <button className="mt-6 flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#DF9B2A] transition-colors hover:text-white">
                      EXPLORE DEPLOYMENT 
                      <span className="text-lg leading-none">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-20 flex justify-center">
          <Link to="/home" className="group flex items-center gap-3 rounded-full border border-[#DF9B2A]/50 px-8 py-4 font-mono text-[11px] tracking-[0.2em] text-[#DF9B2A] hover:bg-[#DF9B2A]/10 transition-colors">
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

  const tint = ["transparent", "#DF9B2A", "#4a00e0", "#ff3855"][stage];

  return (
    <section ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img src="https://apuedge.com/wp-content/uploads/IHS-Lead-042820.jpg" className="h-full w-full object-cover opacity-30" alt="Background" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="absolute inset-0 transition-colors duration-700 opacity-20" style={{ backgroundColor: tint }} />
        <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_center,#DF9B2A44,transparent_60%)]" />
        <div className="relative grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-8 md:grid-cols-2">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] text-[#DF9B2A]">PHASE 03 · CORE METHODOLOGY</div>
            <h2 className="mt-2 text-4xl font-light leading-tight text-white md:text-5xl">Comprehensive defense <span className="italic text-[#DF9B2A]">at every layer</span>.</h2>
            <p className="mt-4 max-w-md text-sm text-white/80">Personnel, Physical Assets, and Data Integrity — defended through layered strategies, advanced technology, and rigorous auditing.</p>
            <div className="mt-6 flex flex-col gap-2">
              {stages.map((s, i) => {
                const isActive = stage === i;
                const isPassed = stage > i;
                const isVisible = stage >= i;
                return (
                  <div key={s} className="group relative flex items-start gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${isActive ? 'border-[#DF9B2A] bg-[#DF9B2A]/20 text-[#DF9B2A]' : isPassed ? 'border-white/30 bg-white/10 text-white/60' : 'border-white/10 bg-transparent text-white/20'}`}>
                        <span className="font-mono text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      {i !== stages.length - 1 && (
                        <div className={`mt-1 h-6 w-px transition-colors duration-500 ${isPassed ? 'bg-[#DF9B2A]/50' : 'bg-white/10'}`} />
                      )}
                    </div>
                    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}`}>
                      <h3 className={`font-mono text-xs tracking-[0.1em] transition-colors ${isActive ? 'text-[#DF9B2A] font-bold' : isPassed ? 'text-white/80' : 'text-white/40'}`}>
                        {s.split(" — ")[0]}
                      </h3>
                      <p className={`mt-0.5 text-xs transition-colors ${isActive ? 'text-white' : isPassed ? 'text-white/60' : 'text-white/30'}`}>
                        {s.split(" — ")[1]}
                      </p>
                    </div>
                  </div>
                );
              })}
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
    <div className="relative h-[360px] w-[260px] preserve-3d">
      <div className="absolute inset-0 rounded-3xl border border-black/10 bg-white shadow-2xl p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[9px] tracking-[0.3em] text-[#DF9B2A] font-bold">VISO · CLEARANCE</div>
          <div className="h-2 w-2 rounded-full animate-pulse bg-[#DF9B2A]" />
        </div>
        
        <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-black/5 bg-black/5 p-4">
          <img 
            src="https://res.cloudinary.com/dcefror3c/image/upload/v1782392385/ChatGPT_Image_Jun_25_2026_06_29_30_PM_agmwib.png" 
            alt="Clearance Badge" 
            className="h-full w-full object-contain drop-shadow-md"
          />
        </div>
        
        <div>
          <div className="font-mono text-sm text-black font-bold transition-all duration-300">LEVEL · {stage + 1} / 4</div>
          <div className="mt-1 font-mono text-[10px] text-black/40 transition-all duration-300">ID-2026-{(stage + 1) * 1731}</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION 5 — SOVEREIGN ASSETS
   ============================================================ */
function SovereignAssetsSection() {
  const industries = [
    { name: "Petrochemicals & Energy", sub: "Refineries · Pipelines · Generation Nodes", img: "https://energyeducation.ca/wiki/images/c/c6/640px-TASNEE_001.jpg" },
    { name: "Maritime Logistics", sub: "Commercial Ports · Naval Facilities" ,img:"https://static.fibre2fashion.com/Newsresource/images/310/shutterstock-2382999737-1-_322395.jpg?tr=w-710,h-450,c-at_max,cm-pad_resize"},
    { name: "Mega-Infrastructure", sub: "Aviation Hubs · Transit Networks",img:"https://www.nbmcw.com/images/34-Infra/46594-Mega-Projects-1.webp" },
    { name: "Governmental Sectors", sub: "Ministries · Sovereign Facilities" ,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpqiIfaDzewTOCKZmADoRuIg-filu99dqa5Vopl1Ih0Q&s=10"},
    { name: "Giga-Development", sub: "Next-Gen Cities · Hospitality Ecosystems",img:"https://www.hoteliermiddleeast.com/2021/05/OeUBMPAG-District-Al-Faisaliah-development.jpg" },
  ];
  return (
    <section className="relative bg-background py-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#DF9B2A]">PHASE 04 · SECTOR EXPERTISE</div>
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
              className="group relative h-72 overflow-hidden rounded-xl border border-foreground/10 bg-surface shadow-lg p-6  transition-colors hover:border-[#DF9B2A]/50"
            >
              {ind.img && (
                <div className="absolute inset-0 z-0">
                  <img src={ind.img} alt={ind.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-black/30" />
                </div>
              )}
              <div className="absolute inset-0 z-0 opacity-30 [background-image:linear-gradient(#DF9B2A44_1px,transparent_1px),linear-gradient(90deg,#DF9B2A44_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="relative z-10 flex h-full flex-col justify-end pt-32">
                <div className={`font-mono text-[9px] tracking-[0.3em] ${ind.img ? 'text-white/80' : 'text-foreground/40'}`}>SECTOR {String(i + 1).padStart(2, "0")}</div>
                <div className={`mt-2 text-xl font-light ${ind.img ? 'text-white' : 'text-foreground'}`}>{ind.name}</div>
                <div className={`mt-2 text-[11px] ${ind.img ? 'text-white/60' : 'text-foreground/40'}`}>{ind.sub}</div>
              </div>
              <motion.div
                className="absolute inset-x-0 bottom-0 z-20 h-px bg-[#DF9B2A]"
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
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#DF9B2A]">PHASE 05 · EXECUTION WORKFLOW</div>
        <h2 className="mt-2 text-3xl font-light text-foreground md:text-5xl">From Conception to Operational Readiness.</h2>
      </div>
      <div ref={trackRef} className="flex h-full items-center gap-10 pl-[10vw] pr-[20vw] will-change-transform">
        {steps.map((s, i) => (
          <div key={s.n} className="relative flex h-[60vh] w-[70vw] shrink-0 flex-col justify-between rounded-2xl border border-foreground/10 bg-surface shadow-lg p-10  md:w-[40vw]">
            <div className="font-mono text-[180px] leading-none text-[#DF9B2A]/30 md:text-[260px]">{s.n}</div>
            <div>
              <div className="font-mono text-xs tracking-[0.3em] text-[#DF9B2A]">STAGE {s.n}</div>
              <div className="mt-2 text-4xl font-light text-foreground md:text-6xl">{s.t}</div>
              <div className="mt-4 max-w-md text-foreground/80">{s.d}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="absolute -right-8 top-1/2 hidden h-px w-10 bg-[#DF9B2A]/30 md:block" />
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
    { t: "Restore — Rapid return to normality", c: "#DF9B2A" },
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
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#DF9B2A]">PHASE 07 · QUANTIFIABLE IMPACT</div>
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
        {display}<span className="text-[#DF9B2A]">{suffix}</span>
      </div>
      <div className="mt-4 font-mono text-xs tracking-[0.3em] text-foreground/80">{label.toUpperCase()}</div>
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
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#DF9B2A]">PHASE 08 · THE VISO DIFFERENCE</div>
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
              className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-lg p-10 "
            >
              <div className="absolute right-6 top-6 font-mono text-[9px] tracking-[0.3em] text-[#DF9B2A]/70">VERIFIED</div>
              <div className="absolute left-0 top-0 h-full w-1 bg-[#DF9B2A]" />
              <p className="text-2xl font-light leading-snug text-foreground md:text-3xl">"{it.q}"</p>
              <div className="mt-6 font-mono text-xs tracking-[0.2em] text-foreground/80">— {it.a}</div>
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
        <motion.div style={{ opacity: glow }} className="absolute inset-0 [background:radial-gradient(circle_at_center,#DF9B2A55,transparent_55%)]" />
        <motion.div style={{ scale: earthScale, rotate }} className="absolute h-[120vh] w-[120vh] rounded-full">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#0a3a6b,#020a18_70%,#000)] shadow-[inset_0_0_120px_#DF9B2A60]" />
          <svg viewBox="0 0 400 400" className="absolute inset-0">
            {[...Array(60)].map((_, i) => {
              const a = (i / 60) * Math.PI * 2;
              const r1 = 180, r2 = 190 + (i % 5) * 6;
              return (
                <motion.line
                  key={i}
                  x1={200 + Math.cos(a) * r1} y1={200 + Math.sin(a) * r1}
                  x2={200 + Math.cos(a) * r2} y2={200 + Math.sin(a) * r2}
                  stroke="#DF9B2A" strokeWidth="0.5"
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
            className="font-mono text-[10px] tracking-[0.4em] text-[#DF9B2A]"
          >
            PHASE 09 · INITIATION
          </motion.div>
          <h2 className="mt-6 text-6xl font-light leading-[0.95] tracking-tight text-foreground md:text-8xl">
            Securing the <br /><span className="italic text-[#DF9B2A]">Horizon</span>.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-foreground/80">
            Elevating defensive protocols to guarantee absolute resilience across your most critical infrastructure.
          </p>
          <div className="mt-12">
            <motion.button
              ref={btnRef}
              onMouseMove={onMove} onMouseLeave={onLeave}
              style={{ x: sx, y: sy }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-full border border-[#DF9B2A] bg-[#DF9B2A]/10 px-10 py-5 font-mono text-sm tracking-[0.25em] text-foreground shadow-[0_0_40px_#DF9B2A80]  transition-shadow hover:shadow-[0_0_80px_#DF9B2Acc]"
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
          className="absolute h-1 w-1 rounded-full bg-[#DF9B2A]"
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
