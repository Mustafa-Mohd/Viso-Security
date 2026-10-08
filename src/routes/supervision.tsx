import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  UserCheck,
  ShieldCheck, 
  HardHat, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  ClipboardCheck, 
  SlidersHorizontal,
  Compass,
  Sparkles,
  X,
  Layers,
  MapPin
} from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { getClientLogo } from "./projects";

export const Route = createFileRoute("/supervision")({
  component: SupervisionPage,
  head: () => ({
    meta: [
      { title: "VISO | Project Management & Supervision" },
      { 
        name: "description", 
        content: "End-to-end project management and supervision services supporting water transmission, industrial facilities, and critical infrastructure in KSA." 
      },
    ],
  }),
});

export interface SupervisionProject {
  id: string;
  title: string;
  client: string;
  endUser?: string;
  status: "Ongoing" | "Completed";
  location: string;
  sector: string;
  scope: string;
}

export const SUPERVISION_PROJECTS: SupervisionProject[] = [
  {
    id: "khobar-wts",
    title: "Khobar Water Transmission System (WTS)",
    client: "Saudi Water Authority (SWA)",
    status: "Ongoing",
    location: "Al Khobar, Eastern Province",
    sector: "Integrated Security System",
    scope: "End-to-end technical supervision, contractor interface management, quality assurance, progress monitoring, and SAIS directive compliance for the Khobar WTS network."
  },
  {
    id: "jubail-desalination",
    title: "Jubail Desalination Plant",
    client: "Saudi Water Authority (SWA)",
    status: "Ongoing",
    location: "Jubail Industrial City",
    sector: "Integrated Security System",
    scope: "Comprehensive engineering oversight, progress and cost monitoring, contractor management, risk mitigation, quality & HSE control, and commissioning supervision for Jubail Desalination operations."
  },
  {
    id: "jubail-line-abqc",
    title: "Jubail Water Transmission Line – AB, Q & C",
    client: "WTCO",
    status: "Ongoing",
    location: "Jubail Region",
    sector: "Integrated Security System",
    scope: "Specialized construction supervision across sections AB, Q & C, managing interfaces, technical reviews, commercial coordination, and ensuring compliance with SAIS and SWA specifications."
  }
];

const lifecycleSteps = [
  {
    icon: Compass,
    num: "01",
    title: "Planning & Mobilization",
    desc: "Project planning, baseline scheduling, mobilization audits, and stakeholder alignment."
  },
  {
    icon: Activity,
    num: "02",
    title: "Progress & Cost Monitoring",
    desc: "Continuous progress tracking, earned value monitoring, and cost baseline control."
  },
  {
    icon: HardHat,
    num: "03",
    title: "Contractor Management",
    desc: "Technical and commercial coordination, interface management, and issue resolution."
  },
  {
    icon: ShieldCheck,
    num: "04",
    title: "Quality & HSE Oversight",
    desc: "Rigorous site supervision, safety audits, specification enforcement, and SAIS requirements."
  },
  {
    icon: SlidersHorizontal,
    num: "05",
    title: "Risk & Interface Control",
    desc: "Proactive bottleneck identification, mitigation strategy execution, and interface resolution."
  },
  {
    icon: ClipboardCheck,
    num: "06",
    title: "Testing, Commissioning & Closeout",
    desc: "Testing, commissioning validation, SAIS compliance sign-off, and final handover."
  }
];

function ClientLogoBadge({
  src,
  alt,
  fallbackIcon,
  className = "max-h-5 max-w-5 object-contain"
}: {
  src: string | null;
  alt: string;
  fallbackIcon: React.ReactNode;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <>{fallbackIcon}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

function StatusBadge({ status }: { status: SupervisionProject["status"] }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md border shadow-sm"
      style={{ color: "#F59E0B", background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.3)" }}
    >
      <span className="w-2 h-2 rounded-full animate-ping bg-amber-500" />
      {status}
    </span>
  );
}

function SupervisionProjectCard({
  project,
  index,
  onSelect
}: {
  project: SupervisionProject;
  index: number;
  onSelect: (p: SupervisionProject) => void;
}) {
  const clientLogo = getClientLogo(project.client);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={() => onSelect(project)}
      className="group flex flex-col rounded-3xl p-6 cursor-pointer transition-all duration-300 relative overflow-hidden bg-white border border-black shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.3)]"
    >
      <div className="flex justify-between items-center mb-5 gap-2">
        <span className="text-[11px] font-mono font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1 border border-primary/20 shrink-0">
          <Activity className="w-3 h-3 text-primary" /> Supervision
        </span>
        <StatusBadge status={project.status} />
      </div>

      <h3 className="font-sans font-bold text-[16px] text-black leading-snug mb-1.5 group-hover:text-primary transition-colors">
        {project.title}
      </h3>
      <span className="text-sm font-medium text-primary mb-6 block">
        {project.sector}
      </span>

      <div className="mt-auto pt-2">
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-black/[0.03] border border-black/10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-black/15 flex items-center justify-center shrink-0 overflow-hidden p-2 shadow-sm">
            <ClientLogoBadge
              src={clientLogo}
              alt={project.client}
              fallbackIcon={<Building2 className="w-7 h-7 text-black/60" />}
              className="max-h-10 max-w-10 sm:max-h-12 sm:max-w-12 object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-black/50 font-mono font-bold uppercase tracking-wider">Client Partner</span>
            <span className="text-base sm:text-lg font-bold text-black leading-tight truncate">{project.client}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SupervisionDetailModal({ project, onClose }: { project: SupervisionProject; onClose: () => void }) {
  const clientLogo = getClientLogo(project.client);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 sm:p-6 pt-28 pb-8 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        className="relative w-full max-w-2xl bg-white border border-black/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl flex flex-col max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative h-28 sm:h-36 bg-gradient-to-r from-neutral-900 via-black to-neutral-900 p-6 flex flex-col justify-end rounded-t-3xl shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.25)_0%,transparent_60%)]" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors border border-white/20 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={project.status} />
              <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                <Activity className="w-3.5 h-3.5" /> Project Management & Supervision
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-sans font-bold text-black leading-tight">
              {project.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase text-foreground/50 font-bold mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> Client Contracting Party
                </div>
                <div className="text-lg font-bold text-black">{project.client}</div>
              </div>
              {clientLogo && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-black/15 p-2.5 flex items-center justify-center shrink-0 shadow-md ml-2">
                  <ClientLogoBadge
                    src={clientLogo}
                    alt={project.client}
                    fallbackIcon={null}
                    className="max-h-12 max-w-12 sm:max-h-16 sm:max-w-16 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-black/5 border border-black/10">
              <span className="text-foreground/50 uppercase block mb-0.5 text-[10px]">Sector</span>
              <span className="font-bold text-black tracking-wide">{project.sector}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/5 border border-black/10">
              <span className="text-foreground/50 uppercase block mb-0.5 text-[10px]">Location</span>
              <span className="font-bold text-black tracking-wide flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" /> {project.location}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-[10px] font-mono uppercase font-bold text-primary tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Supervision Scope & Engineering Oversight
            </h4>
            <p className="text-[13px] text-foreground/80 leading-relaxed bg-black/[0.03] p-3 rounded-2xl border border-black/10">
              {project.scope}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SupervisionPage() {
  const [selectedModalProject, setSelectedModalProject] = useState<SupervisionProject | null>(null);

  return (
    <div className="bg-background min-h-screen text-foreground font-sans">
      <SmoothScroll />
      <TopNav />

      <main className="pb-32">
        {/* Banner Hero */}
        <section className="relative w-full overflow-hidden pt-36 pb-20 bg-neutral-950 min-h-[50vh] flex flex-col justify-center">
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src="https://www.ibainfra.com/wp-content/uploads/2025/10/construction-project-manager.jpg" 
              alt="Project Management & Supervision" 
              className="w-full h-full object-cover filter brightness-90 saturate-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(212,175,55,0.2)_0%,transparent_60%)]" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary font-mono text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                <Building2 className="w-3.5 h-3.5" />
                Engineering Services & Project Delivery
              </span>

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-[1.1] mb-6 drop-shadow-2xl">
                PROJECT MANAGEMENT & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-primary to-amber-500">SUPERVISION</span>
              </h1>

              <p className="max-w-3xl text-base sm:text-lg text-neutral-200 font-light leading-relaxed drop-shadow">
                End-to-end technical oversight, quality assurance, and SAIS directive compliance for major water transmission networks and heavy industrial facilities across the Kingdom.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Supervision Projects Portfolio Section (ON TOP) */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12 relative z-20">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-bold uppercase tracking-widest mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Active Project Portfolio
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-black mb-3">
              Supervision Projects
            </h2>
            <p className="text-sm sm:text-base text-black/60 max-w-xl">
              Explore our ongoing engineering supervision and technical management projects across Saudi Arabia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUPERVISION_PROJECTS.map((project, idx) => (
              <SupervisionProjectCard
                key={project.id}
                project={project}
                index={idx}
                onSelect={(p) => setSelectedModalProject(p)}
              />
            ))}
          </div>
        </section>

        {/* Executive Overview Section */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-20 relative z-20">
          <div className="p-8 md:p-12 rounded-3xl bg-white border border-black/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-1 bg-gradient-to-r from-primary to-amber-500 rounded-full" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">Service Scope & Philosophy</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-bold text-black mb-6 leading-tight">
                Project Management & Supervision Overview
              </h2>

              <p className="text-base sm:text-lg text-black/80 leading-relaxed font-sans mb-10 p-6 rounded-2xl bg-black/[0.02] border border-black/5">
                VISO provides end-to-end project management and supervision services, supporting clients throughout the project lifecycle from planning and mobilization through construction, testing, commissioning, and closeout. Our services include project planning and scheduling, progress and cost monitoring, contractor management, technical and commercial coordination, quality and HSE oversight, risk management, reporting, and stakeholder coordination. We work closely with clients, contractors, and project stakeholders to maintain project progress, manage interfaces, resolve issues, and ensure the works are delivered in accordance with SAIS requirements, specifications, schedule, quality, and HSE standards.
              </p>

              {/* Lifecycle Step Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lifecycleSteps.map((step) => {
                  const IconComp = step.icon;
                  return (
                    <motion.div
                      key={step.num}
                      whileHover={{ y: -4 }}
                      className="p-5 rounded-2xl bg-black/[0.02] border border-black/10 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between group shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className="font-mono text-xs font-bold text-black/40 group-hover:text-primary transition-colors">{step.num}</span>
                        </div>
                        <h3 className="font-display font-bold text-base text-black mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                        <p className="text-xs text-black/70 leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-24">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border border-primary/30 relative overflow-hidden shadow-2xl text-center flex flex-col items-center">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <span className="px-3.5 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-mono font-bold uppercase mb-4">
              Certified Engineering Supervision
            </span>

            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mb-4 max-w-2xl leading-tight">
              Ready to Ensure Excellence for Your Critical Projects?
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 max-w-xl mb-8 font-sans">
              Contact our senior project management and supervision team to align your infrastructure with SAIS directives, quality standards, and schedule milestones.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 rounded-xl bg-primary text-black font-display font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-300 shadow-lg flex items-center gap-2"
              >
                Request Technical Proposal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/projects"
                className="px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-display font-bold text-sm uppercase tracking-wider hover:bg-white/20 transition-all duration-300 backdrop-blur-md"
              >
                View Full Master Portfolio
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedModalProject && (
          <SupervisionDetailModal
            project={selectedModalProject}
            onClose={() => setSelectedModalProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
