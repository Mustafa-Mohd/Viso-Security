import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { TopNav } from "@/components/TopNav";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Briefcase,
  Send,
  CheckCircle2,
  ChevronRight,
  X,
  MapPin,
  Clock,
  Shield,
  Users,
  Sparkles,
  ArrowUpRight,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Link2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "VISO | Careers" },
      { name: "description", content: "Join VISO and build the future of security." },
    ],
  }),
  component: CareerPage,
});

const ease = [0.16, 1, 0.3, 1] as const;

const JOB_IDS = ["doc", "security", "hr"] as const;
const PILLAR_ICONS = [Shield, Sparkles, Users] as const;

export interface CareerJob {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
}

function useCareerJobs(): CareerJob[] {
  const { t } = useTranslation();
  return JOB_IDS.map((id) => ({
    id,
    title: t(`career.jobs.${id}.title`),
    department: t(`career.jobs.${id}.department`),
    type: t("career.full_time"),
    location: t(`career.jobs.${id}.location`),
    description: t(`career.jobs.${id}.description`),
  }));
}

function CareerPage() {
  const { t } = useTranslation();
  const jobs = useCareerJobs();
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [shareJob, setShareJob] = useState<CareerJob | null>(null);
  const [highlightedRoleId, setHighlightedRoleId] = useState<string | null>(null);

  // Detect URL parameter ?role=... or #role-... to auto-scroll & highlight the shared role
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get("role") || urlParams.get("job");
    const rawHash = window.location.hash.replace("#", "").replace("role-", "");
    const targetId = roleParam || (JOB_IDS.includes(rawHash as any) ? rawHash : null);

    if (targetId && JOB_IDS.includes(targetId as any)) {
      setHighlightedRoleId(targetId);
      const timer = setTimeout(() => {
        const el = document.getElementById(`role-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 400);

      // Fade highlight after 8 seconds
      const fadeTimer = setTimeout(() => {
        setHighlightedRoleId(null);
      }, 8000);

      return () => {
        clearTimeout(timer);
        clearTimeout(fadeTimer);
      };
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden flex flex-col">
      <TopNav />
      
      <main className="flex-1">
        <CareerHero jobCount={jobs.length} />
        <ValuesStrip />
        <OpenRoles 
          jobs={jobs} 
          onApply={setActiveJob}
          onShare={setShareJob}
          highlightedRoleId={highlightedRoleId}
        />
        <CultureSection />
        <CareerCta onApply={() => setActiveJob(t("career.cta_btn"))} />
      </main>

      <footer className="border-t border-foreground/10 py-8">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground/45 font-mono tracking-wide">
          <span>© {new Date().getFullYear()} VISO Group</span>
          <Link to="/contact" className="hover:text-primary transition-colors">
            {t("career.contact_hr")}
          </Link>
        </div>
      </footer>

      <AnimatePresence>
        {activeJob && (
          <ApplicationModal jobTitle={activeJob} onClose={() => setActiveJob(null)} />
        )}
        {shareJob && (
          <ShareRoleModal job={shareJob} onClose={() => setShareJob(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Hero with illustration ---------- */
function CareerHero({ jobCount }: { jobCount: number }) {
  const { t } = useTranslation();
  return (
    <section className="relative pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden border-b border-foreground/5">
      <div className="absolute top-0 end-0 w-[50vw] h-[50vw] bg-primary/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="pointer-events-none absolute top-24 start-0 font-display font-extrabold text-[16vw] leading-none text-foreground/[0.03] tracking-tighter select-none">
        {t("nav.careers").toUpperCase()}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-6"
        >
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground mb-6">
            <span className="text-gold">05</span>
            <span className="h-px w-8 bg-border" />
            <span>{t("career.eyebrow")}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[0.95] uppercase">
            {t("career.title")}{" "}
            <span className="text-primary italic font-serif font-medium normal-case tracking-normal">
              VISO
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-foreground/55 font-light leading-relaxed max-w-lg">
            {t("career.desc")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#roles"
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-3.5 font-sans text-[11px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-secondary transition-colors"
            >
              {t("career.view_roles")}
              <ChevronRight className="w-4 h-4" />
            </a>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-sm border border-foreground/15 px-7 py-3.5 font-sans text-[11px] font-bold tracking-[0.2em] text-foreground/70 hover:border-primary hover:text-primary transition-colors"
            >
              {t("career.about_viso")}
            </Link>
          </div>

          <div className="mt-10 flex gap-8 border-t border-foreground/10 pt-6">
            {[
              { n: "2019", l: t("career.founded") },
              { n: "5", l: t("career.offices") },
              { n: "KSA", l: t("career.nationwide") },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-xl text-primary tracking-tight">{s.n}</div>
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/40 mt-0.5">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease }}
          className="lg:col-span-6 relative"
        >
          <TeamIllustration jobCount={jobCount} />
        </motion.div>
      </div>
    </section>
  );
}

/** Formal line-art illustration — team + security architecture */
function TeamIllustration({ jobCount }: { jobCount: number }) {
  const { t } = useTranslation();
  return (
    <div className="relative aspect-[4/3] w-full max-w-xl mx-auto lg:ml-auto">
      <svg
        viewBox="0 0 520 400"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B8860B" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Soft platform */}
        <motion.ellipse
          cx="260"
          cy="340"
          rx="180"
          ry="28"
          fill="#D4AF37"
          fillOpacity="0.08"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />

        {/* Architecture frame */}
        <motion.path
          d="M80 300 V120 H200 V300 M200 120 H340 V300 M340 120 H440 V300"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease }}
        />
        <motion.path
          d="M80 180 H440 M80 240 H440"
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />

        {/* Shield emblem */}
        <motion.g
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease }}
        >
          <path
            d="M260 70 L320 95 V155 C320 195 290 220 260 235 C230 220 200 195 200 155 V95 Z"
            fill="url(#goldGrad)"
            fillOpacity="0.15"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          <path
            d="M260 100 V190 M235 130 H285"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* People silhouettes — abstract formal figures */}
        {[
          { x: 140, delay: 0.55 },
          { x: 260, delay: 0.65 },
          { x: 380, delay: 0.75 },
        ].map((p) => (
          <motion.g
            key={p.x}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: p.delay, duration: 0.7, ease }}
          >
            <circle cx={p.x} cy="250" r="18" stroke="#1F1E1C" strokeWidth="1.75" fill="var(--surface)" />
            <path
              d={`M${p.x - 28} 320 C${p.x - 28} 285, ${p.x - 22} 270, ${p.x} 270 C${p.x + 22} 270, ${p.x + 28} 285, ${p.x + 28} 320`}
              stroke="#1F1E1C"
              strokeWidth="1.75"
              fill="var(--surface)"
            />
            <circle cx={p.x} cy="250" r="4" fill="#D4AF37" />
          </motion.g>
        ))}

        {/* Connection arcs between people */}
        <motion.path
          d="M158 250 Q200 220 242 250"
          stroke="#D4AF37"
          strokeWidth="1.25"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ delay: 1, duration: 0.9 }}
        />
        <motion.path
          d="M278 250 Q320 220 362 250"
          stroke="#D4AF37"
          strokeWidth="1.25"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ delay: 1.15, duration: 0.9 }}
        />

        {/* Floating accent nodes */}
        {[
          { cx: 100, cy: 100 },
          { cx: 420, cy: 90 },
          { cx: 460, cy: 200 },
        ].map((n, i) => (
          <motion.circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r="3"
            fill="#D4AF37"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ delay: 1.2 + i * 0.2, duration: 2.5, repeat: Infinity }}
          />
        ))}
      </svg>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 right-4 md:right-8 rounded-sm border border-foreground/10 bg-surface/90 backdrop-blur px-3 py-2 shadow-sm"
      >
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/40">
          {t("career.now_hiring")}
        </p>
        <p className="font-display text-sm tracking-tight">
          {t("career.open_roles_count", { count: jobCount })}
        </p>
      </motion.div>
    </div>
  );
}

function ValuesStrip() {
  const { t } = useTranslation();
  const pillars = PILLAR_ICONS.map((icon, i) => ({
    icon,
    title: t(`career.pillars.p${i + 1}.title`),
    desc: t(`career.pillars.p${i + 1}.desc`),
  }));
  return (
    <section className="border-b border-foreground/5 bg-surface/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-12 grid md:grid-cols-3 gap-8 md:gap-6">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 shrink-0 rounded-sm border border-primary/25 bg-primary/10 flex items-center justify-center">
              <p.icon className="w-4 h-4 text-primary" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-display text-base tracking-tight mb-1">{p.title}</h3>
              <p className="text-sm text-foreground/50 font-light leading-relaxed">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37h2.79V10.9H6.46M7.86 6.3a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function OpenRoles({
  jobs: roleList,
  onApply,
  onShare,
  highlightedRoleId,
}: {
  jobs: CareerJob[];
  onApply: (title: string) => void;
  onShare: (job: CareerJob) => void;
  highlightedRoleId: string | null;
}) {
  const { t } = useTranslation();
  return (
    <section id="roles" className="py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mb-10 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              <span>{t("career.roles_eyebrow")}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              {t("career.roles_title")}
            </h2>
          </div>
          <p className="text-sm text-foreground/45 font-light max-w-sm md:text-right">
            {t("career.roles_desc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roleList.map((job, index) => {
            const isHighlighted = highlightedRoleId === job.id;

            return (
              <motion.article
                key={job.id}
                id={`role-${job.id}`}
                onClick={() => onApply(job.title)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.55, ease }}
                className={`group flex flex-col border bg-surface transition-all duration-400 cursor-pointer overflow-hidden rounded-xl relative ${
                  isHighlighted
                    ? "border-primary ring-2 ring-primary ring-offset-4 ring-offset-background shadow-[0_0_35px_rgba(212,175,55,0.35)] scale-[1.01]"
                    : "border-foreground/10 hover:border-primary/35 hover:shadow-xl"
                }`}
              >
                {/* Active Highlight Badge */}
                {isHighlighted && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-amber-400 via-primary to-amber-500 text-black px-3.5 py-1 rounded-full font-mono text-[10px] font-extrabold tracking-wider uppercase shadow-lg flex items-center gap-1.5 animate-bounce">
                    <Sparkles className="w-3.5 h-3.5 fill-black" /> Selected Role
                  </div>
                )}

                {/* Image Section */}
                <div className="w-full h-48 overflow-hidden bg-foreground/5 relative">
                  {job.id === "doc" ? (
                    <img 
                      src="https://res.cloudinary.com/dppwnds6z/image/upload/v1790590884/ChatGPT_Image_Sep_28_2026_03_51_15_PM.png" 
                      alt={job.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : job.id === "security" ? (
                    <img 
                      src="https://res.cloudinary.com/dppwnds6z/image/upload/v1790595554/ChatGPT_Image_Sep_28_2026_05_08_48_PM.png" 
                      alt={job.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <img 
                      src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80" 
                      alt={job.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full font-mono text-[10px] tracking-[0.2em] uppercase text-primary">
                    {job.department}
                  </div>

                  {/* Top-Right Quick Share Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare(job);
                    }}
                    className="absolute top-3.5 right-3.5 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/90 hover:bg-background text-foreground/80 hover:text-primary backdrop-blur-md border border-foreground/15 shadow-sm text-xs font-mono font-medium transition-all group-hover:border-primary/40 cursor-pointer"
                    title="Share role & copy link"
                  >
                    <Share2 className="w-3.5 h-3.5 text-primary" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl md:text-2xl tracking-tight group-hover:text-primary transition-colors mb-4">
                    {job.title}
                  </h3>
                  
                  <div className="flex flex-col gap-2 text-xs font-mono text-foreground/50 mb-6">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {job.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground/55 font-light leading-relaxed mb-6 line-clamp-3 flex-1">
                    {job.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-foreground/5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold tracking-[0.18em] text-foreground group-hover:text-primary transition-colors uppercase">
                        {t("career.apply")}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>

                    {/* Share action button in footer */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(job);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/15 hover:border-primary/50 bg-foreground/[0.02] hover:bg-primary/10 text-foreground/75 hover:text-primary transition-all text-xs font-mono font-medium cursor-pointer"
                      title="Share link & social media"
                    >
                      <Share2 className="w-3.5 h-3.5 text-primary" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShareRoleModal({ job, onClose }: { job: CareerJob; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [instagramCopied, setInstagramCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/career?role=${job.id}`
    : `https://visogroup.com/career?role=${job.id}`;

  const shareMessage = `Explore this career opportunity at VISO: ${job.title} (${job.location}) in ${job.department}. Apply here:`;

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstagramShare = async () => {
    const fullText = `${shareMessage}\n${shareUrl}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullText);
      }
    } catch {
      // fallback
    }
    setInstagramCopied(true);

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: job.title,
          text: shareMessage,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled
      }
    }

    setTimeout(() => {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    }, 700);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `VISO Careers — ${job.title}`,
          text: shareMessage,
          url: shareUrl,
        });
      } catch {
        // cancelled
      }
    } else {
      copyToClipboard();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareMessage}\n${shareUrl}`)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}&hashtags=Hiring,SecurityEngineering,VISO`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(`Career Opportunity at VISO: ${job.title}`)}&body=${encodeURIComponent(`${shareMessage}\n\n${shareUrl}\n\nRole: ${job.title}\nDepartment: ${job.department}\nLocation: ${job.location}`)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-surface border border-foreground/15 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-foreground/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground tracking-tight leading-none">
                Share Position
              </h3>
              <span className="text-[11px] font-mono text-foreground/50">
                Direct link & social media sharing
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-foreground/10 hover:border-foreground/25 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Preview Card */}
        <div className="p-3.5 rounded-xl bg-foreground/[0.03] border border-foreground/10 mb-5 flex flex-col gap-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
            {job.department}
          </span>
          <h4 className="font-display font-bold text-base text-foreground leading-snug">
            {job.title}
          </h4>
          <div className="flex items-center gap-3 text-xs font-mono text-foreground/55 mt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-primary" /> {job.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary" /> {job.type}
            </span>
          </div>
        </div>

        {/* Copy Link Input Section */}
        <div className="mb-6">
          <label className="block text-[11px] font-mono uppercase font-bold text-foreground/60 tracking-wider mb-2 flex items-center justify-between">
            <span>Direct Role Link</span>
            {copied && (
              <span className="text-emerald-500 font-bold flex items-center gap-1 text-[11px] normal-case">
                <Check className="w-3.5 h-3.5" /> Copied to clipboard!
              </span>
            )}
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-background border border-foreground/15 focus-within:border-primary transition-colors">
            <div className="pl-2.5 text-foreground/40 shrink-0">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs font-mono text-foreground/80 w-full outline-none select-all truncate px-1"
            />
            <button
              onClick={copyToClipboard}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-primary text-primary-foreground hover:brightness-110 active:scale-95"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-foreground/45 font-mono mt-1.5">
            Redirects directly to this specific role with instant highlighting.
          </p>
        </div>

        {/* Social Share Grid */}
        <div>
          <label className="block text-[11px] font-mono uppercase font-bold text-foreground/60 tracking-wider mb-3">
            Share on Social Media
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/[0.08] hover:bg-emerald-500/[0.15] border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-600 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                <WhatsAppIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-foreground group-hover:text-emerald-600 transition-colors">WhatsApp</span>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#0A66C2]/[0.08] hover:bg-[#0A66C2]/[0.15] border border-[#0A66C2]/20 hover:border-[#0A66C2]/40 text-[#0A66C2] transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                <LinkedInIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-foreground group-hover:text-[#0A66C2] transition-colors">LinkedIn</span>
            </a>

            {/* Instagram */}
            <button
              type="button"
              onClick={handleInstagramShare}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-pink-500/[0.08] hover:bg-pink-500/[0.15] border border-pink-500/20 hover:border-pink-500/40 text-pink-600 transition-all group relative cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-foreground group-hover:text-pink-600 transition-colors">Instagram</span>
            </button>

            {/* X / Twitter */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-foreground/[0.05] hover:bg-foreground/[0.1] border border-foreground/15 hover:border-foreground/30 text-foreground transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <TwitterXIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-foreground transition-colors">X (Twitter)</span>
            </a>
          </div>

          {/* Instagram Notice notification when clicked */}
          <AnimatePresence>
            {instagramCopied && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-xl bg-pink-500/10 border border-pink-500/25 text-pink-700 text-xs flex items-center justify-between gap-2 overflow-hidden"
              >
                <span>✨ Role caption & link copied! Paste into Instagram Story or DM.</span>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-pink-600 text-white rounded font-bold text-[10px] shrink-0 hover:bg-pink-700"
                >
                  Open App
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Extra options: Email & Native OS Sheet */}
          <div className="mt-3.5 pt-3 border-t border-foreground/10 flex items-center justify-between gap-2">
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground/60 hover:text-primary transition-colors py-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Share via Email</span>
            </a>

            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline py-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>More sharing options</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CultureSection() {
  const { t } = useTranslation();
  const items = [1, 2, 3].map((n) => ({
    title: t(`career.culture.c${n}.title`),
    desc: t(`career.culture.c${n}.desc`),
    art: String(n).padStart(2, "0"),
  }));

  return (
    <section className="py-16 md:py-20 bg-surface-2/60 border-y border-foreground/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-3">
            {t("career.culture_title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
              className="relative p-6 md:p-8 border border-foreground/10 bg-background overflow-hidden group"
            >
              <span className="font-display text-5xl text-primary/15 absolute top-4 right-4 group-hover:text-primary/25 transition-colors">
                {item.art}
              </span>
              <CultureMiniArt index={i} />
              <h3 className="font-display text-xl tracking-tight mt-5 mb-2">{item.title}</h3>
              <p className="text-sm text-foreground/50 font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CultureMiniArt({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10 text-primary" fill="none">
        <rect x="8" y="18" width="18" height="24" stroke="currentColor" strokeWidth="1.5" />
        <rect x="32" y="8" width="18" height="34" stroke="currentColor" strokeWidth="1.5" />
        <rect x="56" y="14" width="16" height="28" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 42 H72" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 80 48" className="w-16 h-10 text-primary" fill="none">
        <path d="M12 36 L28 20 L44 28 L68 10" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="28" cy="20" r="3" fill="currentColor" />
        <circle cx="44" cy="28" r="3" fill="currentColor" />
        <circle cx="68" cy="10" r="3" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 48" className="w-16 h-10 text-primary" fill="none">
      <rect x="10" y="12" width="36" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 20 H40 M16 26 H34" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.6" />
      <circle cx="58" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M58 18 V24 L62 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CareerCta({ onApply }: { onApply: () => void }) {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border border-foreground/10 bg-foreground text-background px-8 py-12 md:px-14 md:py-16"
        >
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-primary mb-4">
              {t("career.cta_title")}
            </p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
              {t("career.cta_desc")}
            </h2>
            <button
              type="button"
              onClick={onApply}
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-3.5 text-[11px] font-bold tracking-[0.2em] text-primary-foreground hover:bg-secondary transition-colors"
            >
              {t("career.cta_btn")}
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ApplicationModal({
  jobTitle,
  onClose,
}: {
  jobTitle: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert(t("career.modal_cv_invalid"));
      e.target.value = "";
      setResumeFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(t("career.modal_cv_large"));
      e.target.value = "";
      setResumeFile(null);
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      alert(t("career.modal_cv_required"));
      return;
    }

    setLoading(true);

    try {
      const safeName = resumeFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `applications/${Date.now()}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("resumes").getPublicUrl(filePath);

      const { error } = await supabase.from("job_applications").insert([
        {
          name,
          email,
          phone,
          position: jobTitle,
          cover_letter: coverLetter,
          resume_url: publicUrl,
        },
      ]);

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      alert("Error submitting application: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 16 }}
        transition={{ duration: 0.35, ease }}
        className="bg-surface border border-foreground/10 p-7 md:p-9 shadow-2xl w-full max-w-lg relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-foreground/40 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {success ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3 tracking-tight">
              {t("career.modal_success")}
            </h2>
            <p className="text-foreground/60 mb-8 text-sm font-light leading-relaxed">
              {t("career.modal_success_desc")}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="bg-primary text-primary-foreground px-8 py-3 text-[11px] font-bold tracking-[0.18em] hover:bg-secondary transition-colors"
            >
              {t("career.modal_close")}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-7 pr-8">
              <div className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase mb-2">
                {t("career.apply")}
              </div>
              <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight">
                {t("career.modal_title")} {jobTitle}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">
                  {t("career.modal_name")}
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-foreground/15 rounded-sm px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">
                    {t("career.modal_email")}
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-foreground/15 rounded-sm px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">
                    {t("career.modal_phone")}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background border border-foreground/15 rounded-sm px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">
                  {t("career.modal_cover")}
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full bg-background border border-foreground/15 rounded-sm px-4 py-3 outline-none focus:border-primary transition-colors text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">
                  {t("career.modal_cv")} *
                </label>
                <label className="flex flex-col gap-2 w-full cursor-pointer rounded-sm border border-dashed border-foreground/20 bg-background px-4 py-4 hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    required
                    onChange={onResumeChange}
                    className="sr-only"
                  />
                  <span className="text-sm text-foreground/80">
                    {resumeFile
                      ? `${t("career.modal_cv_chosen")}: ${resumeFile.name}`
                      : t("career.modal_cv_choose")}
                  </span>
                  <span className="text-[11px] text-foreground/40">{t("career.modal_cv_hint")}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-background py-3.5 rounded-sm font-bold text-[11px] tracking-[0.18em] hover:bg-primary hover:text-primary-foreground transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  t("career.modal_cv_uploading")
                ) : (
                  <>
                    <Send size={16} /> {t("career.modal_submit")}
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
