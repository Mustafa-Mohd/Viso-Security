import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

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

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-12 md:mb-20 relative z-10">
        {/* Left Column: Simple About Info */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease }}
          >


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
              className="mt-6 text-base md:text-lg text-foreground/70 leading-relaxed font-light text-pretty"
            >
              {subtitle}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="mt-4 text-sm md:text-base text-foreground/60 leading-relaxed font-light text-pretty"
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
              <div className="flex items-center gap-2">
                {["SAIS", "MOI", "SuperVision"].map((label) => (
                  <span 
                    key={label}
                    className="inline-flex items-center justify-center rounded-lg border border-foreground/10 bg-surface/30 px-4 py-3 font-mono text-[10px] font-bold tracking-[0.1em] uppercase text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Image */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-foreground/10 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            <img loading="lazy" decoding="async"
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
              alt="About VISO Security"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </div>

      {/* Horizontal Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full relative z-10">
        {METRICS_COUNTERS.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease }}
            className="group rounded-2xl border border-foreground/10 bg-surface/40 p-6 md:p-8 text-center hover:bg-surface hover:border-gold/30 transition-all duration-500 shadow-sm relative overflow-hidden flex flex-col justify-center items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="font-display font-black text-4xl lg:text-5xl text-foreground tracking-tight mb-3 relative z-10 group-hover:scale-105 transition-transform duration-500">
              <span className="text-gold">{m.value}</span>
            </div>
            <div className="font-mono text-xs font-bold text-foreground/90 uppercase tracking-wider mb-2 relative z-10">
              {m.label}
            </div>
            <div className="text-[11px] text-muted-foreground relative z-10 max-w-[140px]">
              {m.sub}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
