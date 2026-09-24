import { motion, useInView, animate } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

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

const METRICS_COUNTERS = [
  { num: 5, suffix: "+", label: "Regional Hubs", sub: "KSA-Wide Presence" },
  { num: 100, suffix: "+", label: "Megaprojects", sub: "Secured & Certified" },
  { num: 100, suffix: "%", label: "HCIS / MOI", sub: "Compliance Audit Rate" },
  { num: 24, suffix: "/7", label: "Mission Readiness", sub: "Continuous Protection" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, target, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (value) => {
          if (ref.current) {
            ref.current.textContent = Math.floor(value) + suffix;
          }
        },
      });
      return () => controls.stop();
    } else if (!isInView && ref.current) {
      ref.current.textContent = "0" + suffix;
    }
  }, [isInView, target, suffix]);

  return <span ref={ref} className="text-gold">0{suffix}</span>;
}

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
    <div className="relative w-full h-full flex flex-col justify-center">
      {/* Background ambient gold aura */}
      <div className="pointer-events-none absolute top-0 -left-12 w-96 h-96 bg-primary/[0.03] rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 -right-12 w-96 h-96 bg-primary/[0.03] rounded-full blur-[100px]" />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-12 relative z-10 flex-1">
        {/* Left Column: Simple About Info */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease }}
          >


            {/* Side Heading */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.05, ease }}
              className="mb-4 flex items-center gap-4"
            >
              <div className="h-px w-8 bg-primary" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                About Viso
              </span>
            </motion.div>

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
              className="mt-6 text-base md:text-lg text-foreground/90 leading-relaxed font-light text-pretty"
            >
              {subtitle}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="mt-4 text-sm md:text-base text-foreground/80 leading-relaxed font-light text-pretty"
            >
              {whoWeAreDesc}
            </motion.p>

            {/* Action Link Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.26, ease }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold hover:bg-gold/90 px-6 py-3 font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-black transition-all shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Image */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="relative w-full aspect-[5/4] md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-foreground/10 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            <img loading="lazy" decoding="async"
              src="https://res.cloudinary.com/dppwnds6z/image/upload/v1790274846/ChatGPT_Image_Sep_25_2026_12_03_52_AM.png"
              alt="About VISO Security"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </div>

      {/* Horizontal Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full relative z-10 mt-auto pt-4 border-t border-foreground/5">
        {METRICS_COUNTERS.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease }}
            className="group rounded-xl border border-transparent bg-transparent p-4 text-center hover:bg-surface/50 hover:border-foreground/10 transition-all duration-500 relative flex flex-col justify-center items-center"
          >
            <div className="font-display font-bold text-3xl md:text-4xl text-primary tracking-tight mb-2 group-hover:scale-105 transition-transform duration-500">
              <AnimatedCounter target={m.num} suffix={m.suffix} />
            </div>
            <div className="font-mono text-[11px] font-bold text-foreground/80 uppercase tracking-widest mb-1.5">
              {m.label}
            </div>
            <div className="text-[10px] text-muted-foreground leading-relaxed max-w-[160px]">
              {m.sub}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
