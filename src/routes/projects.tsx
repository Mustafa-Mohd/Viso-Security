import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import {
  Building2, Droplets, Zap, Shield, Briefcase, Anchor, Map, Pickaxe,
  Calendar, Hash, Users, TrendingUp, ArrowRight, ChevronRight, Flame,
  Activity, Globe, Clock, CheckCircle2, Star
} from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "VISO | Projects" },
      { name: "description", content: "Explore the diverse portfolio of VISO projects across various sectors including Oil & Gas, Water, Energy, and Giga Projects." },
    ],
  }),
  component: ProjectsPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  name: string;
  client: string;
  contract: string;
  startDate: string;
  endDate: string;
  status: "Completed" | "Active" | "Ongoing";
  value: string;
  scope: string;
  location: string;
  highlight?: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  accent: string;
  count: number;
  projects: Project[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const projectCategories: Category[] = [
  {
    id: "oil-gas",
    label: "Oil & Gas",
    icon: <Flame className="w-5 h-5" />,
    accent: "#F97316",
    count: 5,
    projects: [
      {
        name: "SAUDI ARAMCO",
        client: "Saudi Aramco Co.",
        contract: "SA-VSO-2021-4471",
        startDate: "Mar 2021",
        endDate: "Dec 2026",
        status: "Active",
        value: "SAR 18.4M",
        scope: "Integrated security management & CCTV surveillance for upstream facilities across Eastern Province",
        location: "Dhahran, Eastern Province",
        highlight: "Flagship"
      },
      {
        name: "S-CHEM",
        client: "Saudi Chevron Phillips Chemical Co.",
        contract: "SC-VSO-2020-3302",
        startDate: "Jan 2020",
        endDate: "Dec 2024",
        status: "Completed",
        value: "SAR 6.2M",
        scope: "Industrial access control & perimeter intrusion detection systems with 24/7 monitoring",
        location: "Al Jubail Industrial City",
        highlight: "ISO Certified"
      },
      {
        name: "SIPCHEM",
        client: "Saudi International Petrochemical Co.",
        contract: "SIP-VSO-2022-5510",
        startDate: "Jun 2022",
        endDate: "May 2025",
        status: "Completed",
        value: "SAR 4.9M",
        scope: "Fire & gas detection systems, emergency response integration and blast-zone coverage",
        location: "Al Jubail, Eastern Province",
      },
      {
        name: "SATORP",
        client: "Saudi Aramco Total Refining & Petrochemical Co.",
        contract: "SATP-VSO-2023-6612",
        startDate: "Sep 2023",
        endDate: "Aug 2027",
        status: "Active",
        value: "SAR 11.1M",
        scope: "Enterprise-grade security command center & AI-powered video analytics deployment",
        location: "Jubail Industrial City II",
        highlight: "Multi-year"
      },
      {
        name: "APOC",
        client: "Arabian Petroleum Offshore Co.",
        contract: "APOC-VSO-2024-7801",
        startDate: "Feb 2024",
        endDate: "Jan 2027",
        status: "Active",
        value: "SAR 7.8M",
        scope: "Offshore platform security systems, marine vessel tracking and remote access management",
        location: "Offshore, Red Sea",
        highlight: "Offshore"
      }
    ]
  },
  {
    id: "water",
    label: "Water",
    icon: <Droplets className="w-5 h-5" />,
    accent: "#38BDF8",
    count: 4,
    projects: [
      {
        name: "NWC",
        client: "National Water Company",
        contract: "NWC-VSO-2020-1100",
        startDate: "Apr 2020",
        endDate: "Mar 2025",
        status: "Completed",
        value: "SAR 8.5M",
        scope: "Nationwide water infrastructure physical security & monitoring across the Kingdom",
        location: "Riyadh, Multiple Sites",
        highlight: "National Scale"
      },
      {
        name: "ACWA POWER",
        client: "ACWA Power International",
        contract: "ACWA-VSO-2022-4455",
        startDate: "Jul 2022",
        endDate: "Jun 2026",
        status: "Active",
        value: "SAR 9.3M",
        scope: "Desalination plant SCADA security & perimeter protection with cyber-physical convergence",
        location: "Yanbu, Mecca Region",
        highlight: "SCADA"
      },
      {
        name: "SWA",
        client: "Saline Water Conversion Corporation",
        contract: "SWA-VSO-2021-3370",
        startDate: "Nov 2021",
        endDate: "Oct 2024",
        status: "Completed",
        value: "SAR 5.1M",
        scope: "Access control and surveillance for conversion stations and distribution networks",
        location: "Al Khobar, Eastern Province",
      },
      {
        name: "WTCO",
        client: "Water Transmission & Technology Co.",
        contract: "WTCO-VSO-2023-5580",
        startDate: "Jan 2023",
        endDate: "Dec 2025",
        status: "Ongoing",
        value: "SAR 3.7M",
        scope: "Pipeline route security and remote sensing integration for cross-region transmission",
        location: "Al Madinah Region",
      }
    ]
  },
  {
    id: "energy",
    label: "Energy",
    icon: <Zap className="w-5 h-5" />,
    accent: "#FACC15",
    count: 3,
    projects: [
      {
        name: "SAUDI ENERGY",
        client: "Saudi Electricity Company (SEC)",
        contract: "SEC-VSO-2019-0990",
        startDate: "Aug 2019",
        endDate: "Jul 2024",
        status: "Completed",
        value: "SAR 12.6M",
        scope: "Grid substation security, fire suppression systems and access management Kingdom-wide",
        location: "Kingdom-wide",
        highlight: "5-Year"
      },
      {
        name: "RABIGH ELECTRICITY",
        client: "Rabigh Electricity Company",
        contract: "REC-VSO-2022-4401",
        startDate: "Mar 2022",
        endDate: "Feb 2026",
        status: "Active",
        value: "SAR 6.8M",
        scope: "Power plant security systems and employee safety compliance monitoring",
        location: "Rabigh, Mecca Region",
      },
      {
        name: "MARAFIQ",
        client: "Marafiq Power & Water Utility",
        contract: "MRQ-VSO-2023-5902",
        startDate: "May 2023",
        endDate: "Apr 2027",
        status: "Active",
        value: "SAR 9.0M",
        scope: "Utility zone perimeter defense and cyber-physical convergence across dual locations",
        location: "Jubail & Yanbu",
        highlight: "Dual Site"
      }
    ]
  },
  {
    id: "infra",
    label: "Infra",
    icon: <Building2 className="w-5 h-5" />,
    accent: "#A78BFA",
    count: 2,
    projects: [
      {
        name: "RCRC",
        client: "Red Crescent Royal Commission",
        contract: "RCRC-VSO-2021-2201",
        startDate: "Jun 2021",
        endDate: "May 2024",
        status: "Completed",
        value: "SAR 2.8M",
        scope: "Emergency operations center security infrastructure and rapid-response systems",
        location: "Riyadh, Al Olaya",
        highlight: "Humanitarian"
      },
      {
        name: "RITZ CARLTON",
        client: "Ritz Carlton Hotel Management",
        contract: "RC-VSO-2022-3310",
        startDate: "Sep 2022",
        endDate: "Ongoing",
        status: "Ongoing",
        value: "SAR 4.2M",
        scope: "Luxury hospitality security infrastructure and VIP executive protection systems",
        location: "Riyadh, Kingdom Center",
        highlight: "VIP Grade"
      }
    ]
  },
  {
    id: "finance",
    label: "Finance",
    icon: <Briefcase className="w-5 h-5" />,
    accent: "#34D399",
    count: 1,
    projects: [
      {
        name: "SAMA",
        client: "Saudi Central Bank (SAMA)",
        contract: "SAMA-VSO-2023-6001",
        startDate: "Jan 2023",
        endDate: "Dec 2026",
        status: "Active",
        value: "SAR 15.5M",
        scope: "Bank vault physical security, tier-4 data center protection and biometric access control",
        location: "Riyadh, King Fahd Road",
        highlight: "Classified"
      }
    ]
  },
  {
    id: "ports",
    label: "Ports",
    icon: <Anchor className="w-5 h-5" />,
    accent: "#22D3EE",
    count: 1,
    projects: [
      {
        name: "MAWANI",
        client: "Saudi Ports Authority",
        contract: "MWNI-VSO-2022-4780",
        startDate: "Apr 2022",
        endDate: "Mar 2026",
        status: "Active",
        value: "SAR 10.2M",
        scope: "Port-wide CCTV, container scanning integration and maritime security operations center",
        location: "Jeddah Islamic Port",
        highlight: "Maritime"
      }
    ]
  },
  {
    id: "defence",
    label: "Defence",
    icon: <Shield className="w-5 h-5" />,
    accent: "#F43F5E",
    count: 1,
    projects: [
      {
        name: "GAMI",
        client: "General Authority for Military Industries",
        contract: "GAMI-VSO-2024-8801",
        startDate: "Mar 2024",
        endDate: "Feb 2028",
        status: "Active",
        value: "SAR 22.0M",
        scope: "Classified facility hardening, EMP-shielded communications and redundant security systems",
        location: "Classified, KSA",
        highlight: "Classified"
      }
    ]
  },
  {
    id: "giga-projects",
    label: "Giga Projects",
    icon: <Map className="w-5 h-5" />,
    accent: "#818CF8",
    count: 2,
    projects: [
      {
        name: "NEOM",
        client: "NEOM Company",
        contract: "NEOM-VSO-2023-7200",
        startDate: "Aug 2023",
        endDate: "Dec 2030",
        status: "Active",
        value: "SAR 45.0M",
        scope: "Smart city security infrastructure — AI analytics, drone defense systems and biometric identity",
        location: "Tabuk Province",
        highlight: "Mega Contract"
      },
      {
        name: "RSA",
        client: "Red Sea Global",
        contract: "RSA-VSO-2024-7750",
        startDate: "Jan 2024",
        endDate: "Dec 2028",
        status: "Active",
        value: "SAR 19.5M",
        scope: "Eco-resort security infrastructure, marine exclusion zones and sustainable tech integration",
        location: "Red Sea Coast, Tabuk",
        highlight: "Eco-Security"
      }
    ]
  },
  {
    id: "mining",
    label: "Mining",
    icon: <Pickaxe className="w-5 h-5" />,
    accent: "#FB923C",
    count: 1,
    projects: [
      {
        name: "MAADEN",
        client: "Saudi Arabian Mining Company",
        contract: "MADN-VSO-2022-5100",
        startDate: "Jun 2022",
        endDate: "May 2026",
        status: "Active",
        value: "SAR 8.8M",
        scope: "Remote mining site surveillance, asset tracking and blast-proof sensor array deployment",
        location: "Al Madinah & Tabuk Regions",
        highlight: "Remote Ops"
      }
    ]
  }
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Project["status"] }) {
  const config = {
    Active: { color: "#22C55E", bg: "rgba(34,197,94,0.12)", label: "Active" },
    Completed: { color: "#94A3B8", bg: "rgba(148,163,184,0.12)", label: "Completed" },
    Ongoing: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", label: "Ongoing" },
  }[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase"
      style={{ color: config.color, background: config.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: config.color }} />
      {config.label}
    </span>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, accent, index }: { project: Project; accent: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); setHovered(false); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setHovered(true)}
      className="relative"
    >
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer border border-foreground/10"
        style={{
          background: "var(--color-surface)",
          borderColor: hovered ? accent + "55" : undefined,
          boxShadow: hovered ? `0 20px 60px -10px ${accent}33, 0 0 0 1px ${accent}22` : "0 4px 20px rgba(0,0,0,0.08)",
          transition: "border-color 0.4s, box-shadow 0.4s",
          transform: "translateZ(20px)",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Animated top-border sweep */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Glow orb background */}
        <motion.div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: accent }}
          animate={{ opacity: hovered ? 0.12 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Corner accent strip */}
        <div
          className="absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none"
          style={{ background: `linear-gradient(225deg, ${accent} 0%, transparent 70%)` }}
        />

        {/* Card Body */}
        <div className="p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <StatusBadge status={project.status} />
                {project.highlight && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
                    style={{ color: accent, background: accent + "18" }}
                  >
                    <Star className="w-3 h-3" />
                    {project.highlight}
                  </span>
                )}
              </div>
              <h3
                className="font-display font-bold text-xl md:text-2xl tracking-wide uppercase leading-tight"
                style={{ color: hovered ? accent : "var(--color-foreground)", transition: "color 0.3s" }}
              >
                {project.name}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 mt-1 opacity-40"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Client */}
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
            <span className="font-sans text-sm text-foreground/60 truncate">{project.client}</span>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3 h-3 opacity-30" />
                <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">Contract</span>
              </div>
              <span className="font-mono text-xs text-foreground/70 truncate">{project.contract}</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 opacity-30" />
                <span className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">Value</span>
              </div>
              <span className="font-mono text-sm font-semibold" style={{ color: accent }}>
                {project.value}
              </span>
            </div>
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-foreground/5">
            <Calendar className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
            <span className="font-mono text-xs text-foreground/60">
              {project.startDate} <span className="opacity-40 mx-1">→</span> {project.endDate}
            </span>
            <Clock className="w-3 h-3 opacity-30 ml-auto flex-shrink-0" />
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
            <span className="font-sans text-xs text-foreground/50 truncate">{project.location}</span>
          </div>

          {/* Expandable scope */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-1 border-t" style={{ borderColor: accent + "30" }}>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                    <p className="font-sans text-sm text-foreground/65 leading-relaxed">{project.scope}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA row */}
          <motion.div
            className="mt-4 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
            style={{ color: accent }}
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <span>{expanded ? "Show less" : "View scope"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.div>
        </div>

        {/* Bottom progress timeline */}
        <div className="h-1 w-full bg-foreground/5">
          <motion.div
            className="h-full"
            style={{ background: `linear-gradient(90deg, ${accent}88, ${accent})` }}
            initial={{ width: 0 }}
            animate={{
              width: project.status === "Completed" ? "100%" : project.status === "Active" ? "62%" : "45%"
            }}
            transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Category Tab ─────────────────────────────────────────────────────────────
function CategoryTab({ category, active, onClick }: { category: Category; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col items-center gap-1.5 px-4 py-3.5 min-w-[100px] rounded-xl outline-none transition-all duration-300 border border-foreground/10"
      style={{
        background: active ? category.accent + "18" : "transparent",
        borderColor: active ? category.accent + "55" : undefined,
        boxShadow: active ? `0 8px 24px -8px ${category.accent}44` : "none",
      }}
    >
      {active && (
        <motion.div
          layoutId="activeTabBg"
          className="absolute inset-0 rounded-xl"
          style={{ background: category.accent + "10" }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        />
      )}
      <span
        className="relative z-10 transition-colors duration-300"
        style={{ color: active ? category.accent : "var(--color-foreground)", opacity: active ? 1 : 0.45 }}
      >
        {category.icon}
      </span>
      <span
        className="relative z-10 font-sans text-[10px] font-bold tracking-widest uppercase transition-colors duration-300"
        style={{ color: active ? category.accent : "var(--color-foreground)", opacity: active ? 1 : 0.5 }}
      >
        {category.label}
      </span>
      <span
        className="relative z-10 font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-foreground/5"
        style={{
          background: active ? category.accent + "25" : undefined,
          color: active ? category.accent : "var(--color-foreground)",
          opacity: active ? 1 : 0.35
        }}
      >
        {category.count}
      </span>
    </motion.button>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const stats = [
    { label: "Active Projects", value: 11, suffix: "+" },
    { label: "Completed Projects", value: 6, suffix: "" },
    { label: "Total Contract Value", value: 203, suffix: "M+" },
    { label: "Sectors Served", value: 9, suffix: "" },
    { label: "Years Operating", value: 10, suffix: "+" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-5 gap-px mb-20 rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/5"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center py-8 px-4 text-center bg-surface relative group"
        >
          {/* Subtle hover effect background */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold mb-2 relative z-10 drop-shadow-sm"
            style={{ 
              background: "linear-gradient(135deg, #D4AF37 0%, #996515 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "#D4AF37"
            }}
          >
            {inView ? <AnimatedCounter target={stat.value} suffix={stat.suffix} /> : "0"}
          </motion.div>
          <div className="font-mono text-[10px] md:text-xs text-foreground/50 tracking-widest uppercase font-semibold relative z-10">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Floating Particles ───────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "rgba(212, 175, 55, 0.35)",
          }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("oil-gas");
  const activeCat = projectCategories.find((c) => c.id === activeCategory)!;
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });

  return (
    <>
      <SmoothScroll />
      <TopNav />
      <main className="bg-background min-h-screen text-foreground pt-40 pb-32 relative overflow-hidden">
        <FloatingParticles />

        {/* Ambient background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)" }}
        />

        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 md:px-16 relative z-10">

          {/* ── Hero Header ── */}
          <div ref={headerRef} className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.3em] text-primary mb-6 uppercase px-4 py-2 rounded-full border border-primary/20 bg-primary/10"
            >
              <Activity className="w-3.5 h-3.5" />
              Portfolio — Our Impact
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl leading-tight text-foreground mb-6"
            >
              Projects &{" "}
              <span 
                className="italic font-bold" 
                style={{ 
                  background: "linear-gradient(135deg, #D4AF37 0%, #996515 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#D4AF37",
                  filter: "drop-shadow(0 4px 12px rgba(212,175,55,0.3))"
                }}
              >
                Partners
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed"
            >
              From classified defence facilities to futuristic giga-cities — we deliver world-class security
              infrastructure across the Kingdom and beyond.
            </motion.p>
          </div>

          {/* ── Stats Bar ── */}
          <StatsBar />

          {/* ── Category Tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12"
          >
            {projectCategories.map((cat) => (
              <CategoryTab
                key={cat.id}
                category={cat}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              />
            ))}
          </motion.div>

          {/* ── Active category headline ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + "-header"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-4 mb-8"
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                style={{ background: activeCat.accent + "20", color: activeCat.accent }}
              >
                {activeCat.icon}
              </div>
              <div>
                <h2
                  className="font-display text-xl font-bold tracking-wide uppercase"
                  style={{ color: activeCat.accent }}
                >
                  {activeCat.label} Projects
                </h2>
                <p className="font-mono text-xs text-foreground/40 tracking-widest">
                  {activeCat.count} contract{activeCat.count !== 1 ? "s" : ""} · Click any card to reveal scope
                </p>
              </div>
              <motion.div
                className="flex-1 h-px ml-4 hidden sm:block"
                style={{ background: `linear-gradient(90deg, ${activeCat.accent}55, transparent)` }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          </AnimatePresence>

          {/* ── Project Cards Grid ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {activeCat.projects.map((project, i) => (
                <ProjectCard
                  key={project.name}
                  project={project}
                  accent={activeCat.accent}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Bottom CTA strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-24 rounded-2xl p-10 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)",
              border: "1px solid rgba(212,175,55,0.18)"
            }}
          >
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(212,175,55,0.12)" }}
            />
            <p className="font-mono text-xs tracking-[0.3em] text-primary uppercase mb-4">Ready to Secure Your Operations?</p>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Let's Build Something{" "}
              <span className="italic text-gradient-gold">Extraordinary</span>
            </h3>
            <p className="font-sans text-foreground/55 max-w-xl mx-auto mb-8 leading-relaxed">
              Join Saudi Arabia's most trusted security infrastructure partner. Our team is ready to assess,
              design, and deploy world-class solutions for your facility.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-sans font-semibold text-sm tracking-wider uppercase"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                color: "#0B0B0B",
                boxShadow: "0 8px 32px -8px rgba(212,175,55,0.6)"
              }}
            >
              Start a Conversation
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

        </div>
      </main>
    </>
  );
}
