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
      { title: "Our Story — Fortifying Tomorrow | VISO Security Consultations" },
      { name: "description", content: "A cinematic scroll-driven journey through VISO — a Riyadh-based physical security consultancy protecting the Kingdom's critical assets." },
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
      <div className="font-mono text-xs tracking-[0.3em] text-foreground">VISO · SECURITY CONSULTATIONS</div>
      <div className="flex items-center gap-6">
        <ThemeToggle />
        <div className="hidden md:flex gap-8 font-mono text-[10px] tracking-[0.3em] text-foreground/70">
          <span>CHAPTER 01 — 10</span>
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
   SHARED: World Map SVG with network lines
   ============================================================ */
function WorldNetwork({ intensity = 1 }: { intensity?: number }) {
  // Simplified dotted world with arcs
  const nodes = [
    [120, 110], [210, 95], [305, 105], [380, 120], [460, 100], [540, 130], [620, 110], [705, 140],
    [160, 180], [260, 200], [355, 190], [450, 215], [560, 200], [660, 220],
    [140, 260], [240, 280], [340, 270], [440, 290], [555, 280], [665, 295],
  ];
  return (
    <svg viewBox="0 0 800 400" className="w-full h-full">
      <defs>
        <radialGradient id="node" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#00AEEF00" />
        </radialGradient>
        <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00AEEF00" />
          <stop offset="50%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#00AEEF00" />
        </linearGradient>
      </defs>
      {/* dotted continents grid */}
      {Array.from({ length: 40 }).map((_, r) =>
        Array.from({ length: 80 }).map((_, c) => {
          const x = c * 10 + 5, y = r * 10 + 5;
          // crude landmask via sin waves
          const m = Math.sin(c / 6) * Math.cos(r / 5) + Math.sin((c + r) / 8);
          if (m < 0.2) return null;
          return <circle key={`${r}-${c}`} cx={x} cy={y} r="0.9" fill="#ffffff" opacity={0.12} />;
        })
      )}
      {/* arcs */}
      {nodes.map((a, i) => {
        const b = nodes[(i + 5) % nodes.length];
        const mx = (a[0] + b[0]) / 2;
        const my = Math.min(a[1], b[1]) - 60;
        return (
          <motion.path
            key={i}
            d={`M${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`}
            stroke="url(#arc)" strokeWidth="1" fill="none" opacity={intensity * 0.7}
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 2.4, delay: i * 0.05, ease: "easeOut" }}
          />
        );
      })}
      {nodes.map(([x, y], i) => (
        <g key={`n${i}`}>
          <circle cx={x} cy={y} r="10" fill="url(#node)" opacity={0.6 * intensity} />
          <motion.circle
            cx={x} cy={y} r="2" fill="#00AEEF"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2 + (i % 5) * 0.3, repeat: Infinity }}
          />
        </g>
      ))}
    </svg>
  );
}

/* ============================================================
   SECTION 1 — HERO
   ============================================================ */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mapScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const scanY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const subline = "A premier physical security consultancy headquartered in Riyadh — protecting people, property and information across the Kingdom.";
  const chars = subline.split("");

  return (
    <section ref={ref} className="relative h-[110vh] overflow-hidden bg-background">
      <motion.div style={{ scale: mapScale, opacity: mapOpacity }} className="absolute inset-0 opacity-70">
        <WorldNetwork />
      </motion.div>
      {/* sweep scan line */}
      <motion.div
        style={{ top: scanY }}
        className="pointer-events-none absolute left-0 right-0 h-[140px] bg-gradient-to-b from-transparent via-[#00AEEF22] to-transparent"
      />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_30%,#050505_75%)]" />

      <motion.div style={{ y: titleY }} className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-6 font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]"
        >
          ◉ EST. 2020 · RIYADH · KINGDOM OF SAUDI ARABIA
        </motion.div>
        <h1 className="max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.95] tracking-tight text-foreground">
          {"Fortifying Tomorrow.\nSecuring the Kingdom.".split("\n").map((line, i) => (
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
          {["RIYADH", "KHOBAR", "JUBAIL", "JEDDAH", "YANBU"].map((c, i) => (
            <span key={c} className="flex items-center gap-3">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-[#00AEEF]/60" />}
              {c}
            </span>
          ))}
        </div>

        {/* fingerprint */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-12"
        >
          <Fingerprint />
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-foreground/40"
      >
        SCROLL TO ENTER ↓
      </motion.div>
    </section>
  );
}

function Fingerprint() {
  return (
    <svg width="90" height="110" viewBox="0 0 90 110" className="drop-shadow-[0_0_30px_#00AEEF80]">
      {[...Array(7)].map((_, i) => (
        <motion.path
          key={i}
          d={`M ${15 + i * 2} ${50 + i * 3} Q 45 ${10 - i * 2}, ${75 - i * 2} ${50 + i * 3} Q 45 ${100 + i * 2}, ${15 + i * 2} ${50 + i * 3}`}
          fill="none" stroke="#00AEEF" strokeWidth="1" opacity={0.7 - i * 0.07}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: i * 0.1 }}
        />
      ))}
      <motion.line
        x1="0" x2="90" y1="50" y2="50"
        stroke="#00AEEF" strokeWidth="0.5"
        animate={{ y1: [10, 100, 10], y2: [10, 100, 10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ============================================================
   SECTION 2 — THREAT LANDSCAPE (pinned)
   ============================================================ */
function ThreatSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const dotCount = useTransform(scrollYProgress, [0, 1], [40, 600]);
  const [dots, setDots] = useState(40);
  useEffect(() => dotCount.on("change", (v) => setDots(Math.floor(v))), [dotCount]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-50">
          <WorldNetwork intensity={0.4} />
        </div>
        {/* threat dots */}
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
            <div className="font-mono text-[10px] tracking-[0.4em] text-[#ff3855]">CHAPTER 02 · THE NEED</div>
            <h2 className="mt-4 max-w-3xl text-5xl font-light leading-tight text-foreground md:text-7xl">
              Why structured security <span className="italic text-[#ff3855]">is essential</span>.
            </h2>
            <p className="mt-6 max-w-xl text-foreground/60">Theft, vandalism, breaches, and regulatory exposure threaten every critical facility in the Kingdom. The cost of inaction is measurable — and rising.</p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <ThreatStat n={60} suffix="%" label="of businesses faced a physical security breach in the past 5 years" delay={0} />
            <ThreatStat n={100} suffix="K USD" label="average cost to address a single breach incident" delay={0.2} />
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
      className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-white/[0.03] p-8 backdrop-blur-xl"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#00AEEF]/10 blur-3xl" />
      <div className="font-mono text-[10px] tracking-[0.3em] text-foreground/40">METRIC · 0{Math.floor(delay * 10) + 1}</div>
      <div className="mt-3 text-6xl font-light text-foreground md:text-7xl">
        {val}<span className="text-[#00AEEF]">{suffix}</span>
      </div>
      <div className="mt-3 text-sm text-foreground/60">{label}</div>
    </motion.div>
  );
}

/* ============================================================
   SECTION 3 — SOC
   ============================================================ */
function SOCSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const beamY = useTransform(scrollYProgress, [0, 1], ["-100%", "200%"]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-surface py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background" />
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16">
          <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">CHAPTER 03 · TECHNOLOGY INTEGRATION</div>
          <h2 className="mt-4 max-w-3xl text-5xl font-light leading-tight text-foreground md:text-7xl">
            One ecosystem. <br /><span className="text-foreground/40">Centrally managed.</span>
          </h2>
          <p className="mt-6 max-w-xl text-foreground/60">Proven technologies converged into a single security platform — interoperable with ICT, BMS, fire-safety and operational systems.</p>
        </div>

        <motion.div style={{ x }} className="relative grid gap-4 md:grid-cols-3">
          {[
            { code: "CCTV", t: "CCTV & Video Analytics", d: "AI-enabled surveillance, command-room integration." },
            { code: "ACS", t: "Access Control", d: "Multi-factor identity, biometrics, zoned permissions." },
            { code: "PIDS", t: "Perimeter Intrusion", d: "Fence detection, radar and microwave layers." },
            { code: "PSIM", t: "PSIM / Command Centre", d: "Unified situational awareness and response." },
            { code: "COMMS", t: "Communications", d: "Resilient radio, data networks, emergency dispatch." },
            { code: "FLS", t: "Fire & Life Safety", d: "Detection, suppression, mass-notification." },
          ].map((tech, i) => (
            <motion.div
              key={tech.code}
              initial={{ opacity: 0, y: 40, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.8 }}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#00AEEF]/20 bg-gradient-to-br from-[#0a1628] to-[#050b15] p-5"
              style={{ perspective: 1000 }}
            >
              <div className="flex items-center justify-between font-mono text-[9px] text-[#00AEEF]/70">
                <span>{tech.code}-{String(i + 1).padStart(2, "0")}</span>
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>● ONLINE</motion.span>
              </div>
              <motion.div
                style={{ top: beamY }}
                className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-[#00AEEF40] to-transparent"
              />
              <MiniChart seed={i} />
              <div className="mt-3 text-lg font-light text-foreground">{tech.t}</div>
              <div className="mt-1 text-xs text-foreground/50">{tech.d}</div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-20 flex justify-center">
          <Link to="/home" className="group flex items-center gap-3 rounded-full border border-[#00AEEF]/50 px-8 py-4 font-mono text-[11px] tracking-[0.2em] text-[#00AEEF] hover:bg-[#00AEEF]/10 transition-colors">
            EXPLORE OUR SERVICES <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function MiniChart({ seed }: { seed: number }) {
  const points = Array.from({ length: 20 }).map((_, i) => {
    const v = 30 + Math.sin(i / 2 + seed) * 12 + Math.cos(i + seed * 0.7) * 8;
    return `${i * 8},${v}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 160 80" className="mt-6 w-full">
      <motion.polyline
        points={points} fill="none" stroke="#00AEEF" strokeWidth="1.5"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 1.5, delay: seed * 0.05 }}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1="0" x2="160" y1={15 * (i + 1)} y2={15 * (i + 1)} stroke="#ffffff08" />
      ))}
    </svg>
  );
}

/* ============================================================
   SECTION 4 — ACCESS CONTROL STORY
   ============================================================ */
function AccessControlSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const stages = ["PEOPLE — Safety of every individual", "PROPERTY — Layered physical protection", "INFORMATION — Confidentiality & data security", "ASSURANCE — Continuous review & audit"];
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const [stage, setStage] = useState(0);
  useEffect(() => scrollYProgress.on("change", (v) => setStage(Math.min(3, Math.floor(v * 4)))), [scrollYProgress]);

  const bg = ["#050505", "#06121e", "#0a1224", "#0e0a24"][stage];

  return (
    <section ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden transition-colors duration-700" style={{ background: bg }}>
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_center,#00AEEF22,transparent_60%)]" />
        <div className="relative grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-8 md:grid-cols-2">
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">CHAPTER 04 · OUR APPROACH</div>
            <h2 className="mt-4 text-5xl font-light leading-tight text-foreground md:text-7xl">Three pillars frame <span className="italic text-[#00AEEF]">every engagement</span>.</h2>
            <p className="mt-6 max-w-md text-foreground/60">People, property and information — protected through robust protocols, integrated technology and disciplined assurance.</p>
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
          className="absolute inset-0 rounded-2xl border border-[#00AEEF]/40 bg-white/[0.03] p-6 shadow-[0_0_60px_#00AEEF40] backdrop-blur-xl"
        >
          <div className="font-mono text-[9px] tracking-[0.3em] text-[#00AEEF]">VISO · CLEARANCE</div>
          <div className="mt-6 flex h-40 items-center justify-center">
            {stage === 0 && <div className="h-20 w-32 rounded border border-[#00AEEF] [background:repeating-linear-gradient(45deg,#00AEEF10,#00AEEF10_4px,transparent_4px,transparent_8px)]" />}
            {stage === 1 && <Fingerprint />}
            {stage === 2 && <FaceMesh />}
            {stage === 3 && <AIBrain />}
          </div>
          <div className="mt-4 font-mono text-xs text-foreground/70">LEVEL · {stage + 1} / 4</div>
          <div className="mt-1 font-mono text-[10px] text-foreground/40">ID-2026-{(stage + 1) * 1731}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FaceMesh() {
  return (
    <svg viewBox="0 0 100 120" width="100" height="120">
      {[...Array(8)].map((_, i) => (
        <motion.ellipse key={i} cx="50" cy="60" rx={40 - i * 4} ry={55 - i * 5} fill="none" stroke="#00AEEF" strokeWidth="0.5" opacity={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: i * 0.08 }} />
      ))}
      <circle cx="40" cy="50" r="2" fill="#00AEEF" />
      <circle cx="60" cy="50" r="2" fill="#00AEEF" />
    </svg>
  );
}

function AIBrain() {
  return (
    <svg viewBox="0 0 100 100" width="100" height="100">
      {[...Array(12)].map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x = 50 + Math.cos(a) * 35;
        const y = 50 + Math.sin(a) * 35;
        return (
          <g key={i}>
            <line x1="50" y1="50" x2={x} y2={y} stroke="#00AEEF" strokeWidth="0.5" opacity="0.5" />
            <motion.circle cx={x} cy={y} r="2.5" fill="#00AEEF"
              animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} />
          </g>
        );
      })}
      <circle cx="50" cy="50" r="6" fill="#00AEEF" />
    </svg>
  );
}

/* ============================================================
   SECTION 5 — INFRASTRUCTURE
   ============================================================ */
function InfraSection() {
  const industries = [
    { name: "Energy & Petrochemicals", icon: "M13 2L3 14h8l-1 8 10-12h-8z", sub: "Aramco · SATORP · SABIC · Ma'aden" },
    { name: "Ports & Marine", icon: "M12 2v10M4 12h16M6 12v8M18 12v8", sub: "Jeddah Islamic · Jazan · Saudi Ports" },
    { name: "EPC & Engineering", icon: "M3 4h18v6H3zM3 14h18v6H3z", sub: "Samsung · Doosan · L&T · Worley" },
    { name: "Government & Infra", icon: "M3 21h18M5 21V10l7-6 7 6v11", sub: "MoI · RCJY · MODON" },
    { name: "Giga-Projects & Hospitality", icon: "M2 16h20l-9-7v-3a2 2 0 1 0-2 0v3z", sub: "Red Sea Intl. · Ritz-Carlton · Amazon" },
  ];
  return (
    <section className="relative bg-background py-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">CHAPTER 05 · OUR ESTEEMED CLIENTS</div>
        <h2 className="mt-4 max-w-3xl text-5xl font-light leading-tight text-foreground md:text-7xl">
          Trusted across the <span className="italic">Kingdom's most critical assets</span>.
        </h2>

        <div className="mt-20 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 80, filter: "blur(20px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-72 overflow-hidden rounded-xl border border-foreground/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-colors hover:border-[#00AEEF]/50"
            >
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(#00AEEF22_1px,transparent_1px),linear-gradient(90deg,#00AEEF22_1px,transparent_1px)] [background-size:20px_20px]" />
              <svg viewBox="0 0 24 24" className="relative h-12 w-12 stroke-[#00AEEF]" fill="none" strokeWidth="1.5">
                <path d={ind.icon} />
              </svg>
              <div className="relative mt-auto pt-24">
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
   SECTION 6 — ASSESSMENT PROCESS (horizontal scroll, GSAP)
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
    { n: "01", t: "Requirements & Brief", d: "Stakeholder workshops align mission, threats and constraints." },
    { n: "02", t: "Security Risk Assessment", d: "ISO 31000 / API 780 / ASIS RA — assets, threats, vulnerability, risk." },
    { n: "03", t: "Concept & Detailed Design", d: "Layered protection, system architecture, drawings, BOQ to tender-ready." },
    { n: "04", t: "Procurement & Construction", d: "Vendor evaluation, technical advisory, quality oversight, witness testing." },
    { n: "05", t: "Commissioning & Handover", d: "Phased mobilization, testing, and operational handover with assurance." },
  ];

  return (
    <section ref={wrapRef} className="relative h-screen overflow-hidden bg-background">
      <div className="absolute top-10 left-8 z-10">
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">CHAPTER 06 · PLANNING & DESIGN</div>
        <h2 className="mt-2 text-3xl font-light text-foreground md:text-5xl">From requirements to implementation.</h2>
      </div>
      <div ref={trackRef} className="flex h-full items-center gap-10 pl-[10vw] pr-[20vw] will-change-transform">
        {steps.map((s, i) => (
          <div key={s.n} className="relative flex h-[60vh] w-[70vw] shrink-0 flex-col justify-between rounded-2xl border border-foreground/10 bg-gradient-to-br from-white/[0.04] to-transparent p-10 backdrop-blur-xl md:w-[40vw]">
            <div className="font-mono text-[180px] leading-none text-[#00AEEF]/10 md:text-[260px]">{s.n}</div>
            <div>
              <div className="font-mono text-xs tracking-[0.3em] text-[#00AEEF]">PHASE {s.n}</div>
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
function IncidentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [phase, setPhase] = useState(0);
  useEffect(() => scrollYProgress.on("change", (v) => setPhase(Math.min(4, Math.floor(v * 5)))), [scrollYProgress]);

  const phases = [
    { t: "Deter — Discourage threats", c: "#ff3855" },
    { t: "Detect — Identify intrusions", c: "#ff8c1a" },
    { t: "Delay — Slow attacker progress", c: "#ffd400" },
    { t: "Respond — Engage & neutralize", c: "#3df58b" },
    { t: "Recover — Restore operations", c: "#00AEEF" },
  ];
  const active = phases[phase];

  return (
    <section ref={ref} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden transition-colors duration-700"
        style={{ background: phase < 4 ? "#1a0508" : "#050a14" }}>
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: phase < 4 ? [0.2, 0.5, 0.2] : 0 }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ background: `radial-gradient(circle at center, ${active.c}33, transparent 60%)` }}
        />
        {/* alarm sweep */}
        {phase < 4 && (
          <motion.div
            className="absolute inset-0 origin-center"
            animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${active.c}22 30deg, transparent 60deg)` }}
          />
        )}

        <div className="relative z-10 mx-auto max-w-5xl px-8 text-center">
          <div className="font-mono text-[10px] tracking-[0.4em]" style={{ color: active.c }}>
            CHAPTER 07 · THE FIVE D's · SECURITY FUNCTIONS
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

          {phase === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="mt-16 inline-block rounded-2xl border border-[#00AEEF]/40 bg-white/[0.03] px-10 py-6 backdrop-blur-xl"
            >
              <div className="font-mono text-[10px] tracking-[0.3em] text-[#00AEEF]">DEFENCE IN DEPTH</div>
              <div className="mt-2 text-4xl font-light text-foreground">Preventative + Reactive — <span className="text-[#00AEEF]">measurable ROI</span></div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 8 — TRUST METRICS
   ============================================================ */
function TrustSection() {
  const metrics = [
    { n: 92, suffix: "+", label: "Projects Delivered (2021–26)" },
    { n: 5, suffix: "", label: "Regional Offices · KSA" },
    { n: 52.5, suffix: "%", label: "Local Content · Verified" },
  ];
  return (
    <section className="relative bg-background py-40">
      <div className="mx-auto max-w-7xl px-8">
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">CHAPTER 08 · BY THE NUMBERS</div>
        <h2 className="mt-4 max-w-3xl text-5xl font-light leading-tight text-foreground md:text-7xl">Numbers we stand behind.</h2>
        <div className="mt-20 grid gap-12 md:grid-cols-3">
          {metrics.map((m, i) => <BigCounter key={i} {...m} delay={i * 0.15} />)}
        </div>
        <div className="mt-20 flex flex-wrap gap-3">
          {["ISO 9001", "ISO 45001", "ISO 27001", "Aramco SACS-002", "HCIS / SAIS", "API 780", "ASIS RA", "VAT Compliant"].map((b) => (
            <span key={b} className="rounded-full border border-[#00AEEF]/30 bg-[#00AEEF]/5 px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-[#00AEEF]">
              ◆ {b}
            </span>
          ))}
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
   SECTION 9 — TESTIMONIALS
   ============================================================ */
function TestimonialsSection() {
  const items = [
    { q: "Specialist focus — a pure-play physical security consultancy, never a side practice.", a: "Why VISO · 01" },
    { q: "KSA-first pedigree — built around HCIS, SAIS and Aramco standards from day one.", a: "Why VISO · 02" },
    { q: "Sector depth across energy, petrochemicals, ports, giga-projects and sovereign assets.", a: "Why VISO · 03" },
    { q: "Independent counsel — vendor-neutral advisory founded on trust and accountability.", a: "Why VISO · 04" },
  ];
  return (
    <section className="relative bg-background py-32">
      <div className="mx-auto max-w-5xl px-8">
        <div className="font-mono text-[10px] tracking-[0.4em] text-[#00AEEF]">CHAPTER 09 · WHY CHOOSE VISO</div>
        <h2 className="mt-4 text-5xl font-light leading-tight text-foreground md:text-6xl">Built for the Kingdom's most demanding assets.</h2>
        <div className="mt-20 space-y-6">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -6, rotate: 0.4 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-10 backdrop-blur-xl"
            >
              <div className="absolute right-6 top-6 font-mono text-[9px] tracking-[0.3em] text-[#00AEEF]/70">CLASSIFIED · CLEARED</div>
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
function MissionControl() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const earthScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.05]);
  const glow = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Magnetic button
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
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-black">
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
            {[...Array(20)].map((_, i) => {
              const a1 = (i / 20) * Math.PI * 2;
              const a2 = ((i + 7) / 20) * Math.PI * 2;
              return (
                <motion.path
                  key={i}
                  d={`M ${200 + Math.cos(a1) * 180} ${200 + Math.sin(a1) * 180} Q 200 200 ${200 + Math.cos(a2) * 180} ${200 + Math.sin(a2) * 180}`}
                  fill="none" stroke="#00AEEF" strokeWidth="0.5" opacity="0.4"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                  transition={{ duration: 2, delay: i * 0.1 }}
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
            CHAPTER 10 · OUR VISION
          </motion.div>
          <h2 className="mt-6 text-6xl font-light leading-[0.95] tracking-tight text-foreground md:text-8xl">
            Fortifying <br /><span className="italic text-[#00AEEF]">Tomorrow</span>.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-foreground/60">
            Where security meets peace of mind — protecting people, property and information across the Kingdom's most critical assets.
          </p>
          <div className="mt-12">
            <motion.button
              ref={btnRef}
              onMouseMove={onMove} onMouseLeave={onLeave}
              style={{ x: sx, y: sy }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-full border border-[#00AEEF] bg-[#00AEEF]/10 px-10 py-5 font-mono text-sm tracking-[0.25em] text-foreground shadow-[0_0_40px_#00AEEF80] backdrop-blur-xl transition-shadow hover:shadow-[0_0_80px_#00AEEFcc]"
            >
              <motion.span
                className="pointer-events-none absolute inset-0 bg-[#00AEEF]"
                animate={{ opacity: [0, 0.25, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="relative">ENGAGE VISO · RIYADH HQ →</span>
            </motion.button>
          </div>
          <div className="mt-12 font-mono text-[10px] tracking-[0.4em] text-foreground/30">
            END OF TRANSMISSION · VISO © 2026
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
        <ThreatSection />
        <SOCSection />
        <AccessControlSection />
        <InfraSection />
        <ProcessSection />
        <IncidentSection />
        <TrustSection />
        <TestimonialsSection />
        <MissionControl />
      </main>
    </div>
  );
}
