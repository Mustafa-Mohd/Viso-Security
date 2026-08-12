import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { TopNav } from "@/components/TopNav";
import { useState } from "react";
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

function useCareerJobs() {
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

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden flex flex-col">
      <TopNav />
      
      <main className="flex-1">
        <CareerHero jobCount={jobs.length} />
        <ValuesStrip />
        <OpenRoles jobs={jobs} onApply={setActiveJob} />
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
      </AnimatePresence>
    </div>
  );
}

/* ---------- Hero with illustration ---------- */
function CareerHero({ jobCount }: { jobCount: number }) {
  const { t } = useTranslation();
  return (
    <section className="relative pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden border-b border-foreground/5">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="pointer-events-none absolute top-24 left-0 font-display font-extrabold text-[16vw] leading-none text-foreground/[0.03] tracking-tighter select-none">
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
              { n: "2020", l: t("career.founded") },
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
            <circle cx={p.x} cy="250" r="18" stroke="#1F1E1C" strokeWidth="1.75" fill="#F9F8F5" />
            <path
              d={`M${p.x - 28} 320 C${p.x - 28} 285, ${p.x - 22} 270, ${p.x} 270 C${p.x + 22} 270, ${p.x + 28} 285, ${p.x + 28} 320`}
              stroke="#1F1E1C"
              strokeWidth="1.75"
              fill="#F9F8F5"
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

function OpenRoles({
  jobs: roleList,
  onApply,
}: {
  jobs: ReturnType<typeof useCareerJobs>;
  onApply: (title: string) => void;
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

        <div className="flex flex-col gap-3">
          {roleList.map((job, index) => (
            <motion.article
              key={job.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.55, ease }}
              className="group border border-foreground/10 bg-surface hover:border-primary/35 transition-colors duration-400"
            >
              <div className="grid lg:grid-cols-12 gap-4 p-5 md:p-7 items-center">
                <div className="lg:col-span-1 font-mono text-xs text-primary/70 tracking-widest">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="lg:col-span-4">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-1">
                    {job.department}
                  </p>
                  <h3 className="font-display text-xl md:text-2xl tracking-tight group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                </div>
                <div className="lg:col-span-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono text-foreground/50">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {job.type}
                  </span>
                </div>
                <div className="lg:col-span-3 flex lg:justify-end">
                  <button
                    type="button"
                    onClick={() => onApply(job.title)}
                    className="inline-flex items-center gap-2 rounded-sm bg-foreground text-background px-5 py-3 text-[11px] font-bold tracking-[0.18em] hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {t("career.apply")}
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="px-5 md:px-7 pb-6 md:pb-7 md:pl-[calc(theme(spacing.7)+2.5rem)] lg:pl-[calc(8.33%+theme(spacing.7))]">
                <p className="text-sm text-foreground/55 font-light leading-relaxed max-w-3xl">
                  {job.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from("job_applications").insert([
      {
        name,
        email,
        phone,
        position: jobTitle,
        cover_letter: coverLetter,
      },
    ]);

    setLoading(false);
    if (error) {
      alert("Error submitting application: " + error.message);
    } else {
      setSuccess(true);
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
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-background py-3.5 rounded-sm font-bold text-[11px] tracking-[0.18em] hover:bg-primary hover:text-primary-foreground transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  t("career.modal_sending")
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
