import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Cpu,
  ArrowRight,
  Sparkles,
  Award,
  Lock,
} from "lucide-react";
import { KineticSecurityThread } from "@/components/KineticSecurityThread";

const ease = [0.16, 1, 0.3, 1] as const;

function renderVisionTitle(title: string) {
  const split = title.match(/^(.+?\s+to)\s+(.+)$/i);
  if (!split) return title;
  return (
    <>
      {split[1]}{" "}
      <span className="text-gold font-light">{split[2]}</span>
    </>
  );
}

const STRATEGIC_PILLARS = [
  {
    icon: <ShieldCheck className="w-4 h-4 text-gold" />,
    title: "Threat Assessment & Master Planning",
    desc: "Comprehensive vulnerability modelling and site risk mitigation.",
    tag: "Stage 01",
  },
  {
    icon: <Lock className="w-4 h-4 text-gold" />,
    title: "HCIS & MOI Regulatory Engineering",
    desc: "100% compliance traceability and authority defense submissions.",
    tag: "Directives",
  },
  {
    icon: <Cpu className="w-4 h-4 text-gold" />,
    title: "Cyber-Physical Systems Integration",
    desc: "CCTV, VMS, PSIM, biometric access, and perimeter radar networks.",
    tag: "Architecture",
  },
  {
    icon: <Award className="w-4 h-4 text-gold" />,
    title: "Commissioning & 24/7 Operational Readiness",
    desc: "Rigorous FAT/SAT testing and seamless operational handover.",
    tag: "Handover",
  },
];

const METRICS_COUNTERS = [
  { value: "5+", label: "Regional Hubs", sub: "KSA-Wide Presence" },
  { value: "100+", label: "Megaprojects", sub: "Secured & Certified" },
  { value: "100%", label: "HCIS / MOI", sub: "Compliance Audit Rate" },
  { value: "24/7", label: "Mission Readiness", sub: "Continuous Protection" },
];

/* ---------- Main export ---------- */
export function AboutInteractive({
  title,
  subtitle,
  whoWeAreTitle,
  whoWeAreDesc,
}: {
  title: string;
  subtitle: string;
  whoWeAreTitle: string;
  whoWeAreDesc: string;
}) {
  return (
    <div className="relative">
      {/* Background ambient gold aura */}
      <div className="pointer-events-none absolute -top-12 -left-12 w-96 h-96 bg-gold/[0.04] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 w-96 h-96 bg-gold/[0.04] rounded-full blur-[120px]" />

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-16 md:mb-24">
        {/* Left Column: Editorial & Corporate Credentials */}
        <div className="lg:col-span-6 relative z-10 flex flex-col justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease }}
            className="relative flex-1 rounded-2xl border border-foreground/10 bg-gradient-to-br from-surface/90 via-background to-primary/[0.04] p-7 md:p-10 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.04)]"
          >
            {/* Background luxury glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

            {/* Section Tag */}
            <div className="flex items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 border border-gold/30 font-mono text-xs font-bold text-gold">
                  01
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Corporate Profile
                  </p>
                  <p className="font-display text-base font-semibold tracking-tight text-foreground">
                    About VISO Security
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 font-mono text-[10px] text-gold font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-gold" />
                Est. 2020 · KSA
              </span>
            </div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.08, ease }}
              className="font-display text-3xl md:text-4xl lg:text-[2.65rem] leading-[1.12] tracking-tight text-foreground font-bold"
            >
              {renderVisionTitle(title)}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.14, ease }}
              className="mt-5 text-base md:text-lg text-foreground/70 leading-relaxed font-light text-pretty"
            >
              {subtitle}
            </motion.p>

            {/* Who We Are Box */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="mt-7 rounded-xl border border-gold/25 bg-background/80 p-6 shadow-sm relative overflow-hidden group hover:border-gold/50 transition-colors"
            >
              <div className="pointer-events-none absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold via-amber-400 to-transparent" />
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-[10px] tracking-[0.28em] text-gold uppercase font-bold">
                  Who We Are
                </p>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[9px] text-muted-foreground uppercase">Certified</span>
                </div>
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground mb-2">
                {whoWeAreTitle}
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed font-normal">
                {whoWeAreDesc}
              </p>

              {/* Action Link Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold hover:bg-gold/90 px-5 py-2.5 font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-black transition-all shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Corporate Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/security"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface hover:bg-surface-2 border border-foreground/10 px-5 py-2.5 font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-foreground transition-all hover:border-gold/40"
                >
                  <span>Lifecycle Framework</span>
                </Link>
              </div>
            </motion.div>

            {/* Strategic Pillars Grid */}
            <div className="mt-7 grid sm:grid-cols-2 gap-3">
              {STRATEGIC_PILLARS.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-foreground/5 bg-surface/60 hover:bg-surface hover:border-gold/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-gold/10 border border-gold/20 group-hover:scale-110 transition-transform">
                      {pillar.icon}
                    </div>
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-foreground/5 text-muted-foreground uppercase tracking-wider">
                      {pillar.tag}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-xs text-foreground mb-1 group-hover:text-gold transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Regional Badges */}
            <div className="mt-6 pt-5 border-t border-foreground/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mr-1">
                  Offices:
                </span>
                {["Riyadh HQ", "Khobar", "Jubail", "Jeddah", "Yanbu"].map((hub) => (
                  <span
                    key={hub}
                    className="rounded-md border border-foreground/10 bg-surface px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase text-foreground/75 font-medium"
                  >
                    {hub}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/regulatory/moi"
                  className="rounded-md border border-foreground/15 bg-background px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase text-foreground/70 hover:border-gold hover:text-gold transition-colors"
                >
                  MOI
                </Link>
                <Link
                  to="/regulatory/hcis"
                  className="rounded-md border border-gold/30 bg-gold/10 px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase text-gold font-bold hover:bg-gold/20 transition-colors"
                >
                  HCIS
                </Link>
                <Link
                  to="/regulatory/sais"
                  className="rounded-md border border-foreground/15 bg-background px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase text-foreground/70 hover:border-gold hover:text-gold transition-colors"
                >
                  SAIS
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Kinetic Security Thread */}
        <div className="lg:col-span-6 flex flex-col gap-5 min-h-[500px] justify-between">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="flex-1 w-full"
          >
            <KineticSecurityThread />
          </motion.div>

          {/* Metrics Counters Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {METRICS_COUNTERS.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                className="rounded-xl border border-foreground/10 bg-surface/70 p-3.5 text-center hover:border-gold/40 transition-colors shadow-sm"
              >
                <div className="font-display font-black text-2xl text-foreground tracking-tight">
                  <span className="text-gold">{m.value}</span>
                </div>
                <div className="font-mono text-[10px] font-bold text-foreground/90 uppercase tracking-wider mt-0.5">
                  {m.label}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {m.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
