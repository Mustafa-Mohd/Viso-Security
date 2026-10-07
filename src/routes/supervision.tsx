import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Building2, 
  ShieldCheck, 
  HardHat, 
  Activity, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2, 
  ClipboardCheck, 
  SlidersHorizontal,
  Compass,
  Sparkles
} from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TiltCard } from "@/components/TiltCard";

export const Route = createFileRoute("/supervision")({
  component: SupervisionPage,
  head: () => ({
    meta: [
      { title: "VISO | Project Management & Supervision" },
      { 
        name: "description", 
        content: "End-to-end project management and supervision services for major industrial, infrastructure, and water transmission projects in KSA." 
      },
    ],
  }),
});

interface SupervisionProject {
  id: string;
  title: string;
  client: string;
  clientLogo: string;
  clientUrl?: string;
  status: "Ongoing" | "Completed";
  location: string;
  sector: string;
  description: string;
  highlights: string[];
  image: string;
}

const supervisionProjects: SupervisionProject[] = [
  {
    id: "khobar-wts",
    title: "Khobar Water Transmission System (WTS)",
    client: "Saudi Water Authority (SWA)",
    clientLogo: "https://www.swa.gov.sa/assets/images/logos/swa-logo-dark.svg",
    clientUrl: "https://swa.gov.sa/",
    status: "Ongoing",
    location: "Al Khobar, Eastern Province, KSA",
    sector: "Water Infrastructure & Transmission",
    description: "End-to-end technical supervision, contractor interface management, quality assurance, and SAIS directive compliance for the Khobar WTS network.",
    highlights: [
      "Full Project Lifecycle Supervision & Scheduling",
      "SAIS Security & Engineering Directive Compliance",
      "Contractor Technical & Commercial Coordination",
      "HSE & Quality Control Oversight"
    ],
    image: "https://res.cloudinary.com/dppwnds6z/image/upload/v1791402753/xbhbmqdtijfo7a92lwf8.png"
  },
  {
    id: "jubail-desalination",
    title: "Jubail Desalination Plant",
    client: "Saudi Water Authority (SWA)",
    clientLogo: "https://www.swa.gov.sa/assets/images/logos/swa-logo-dark.svg",
    clientUrl: "https://swa.gov.sa/",
    status: "Ongoing",
    location: "Jubail Industrial City, KSA",
    sector: "Desalination & Heavy Industrial Facility",
    description: "Comprehensive engineering oversight, progress and cost monitoring, risk management, and commissioning supervision for Jubail Desalination operations.",
    highlights: [
      "Industrial Physical Security & Plant Oversight",
      "Progress & Cost Baseline Control",
      "Testing & Commissioning Validation",
      "Multi-Contractor Interface Management"
    ],
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "jubail-line-abqc",
    title: "Jubail Water Transmission Line – AB, Q & C",
    client: "Water Transmission Company (WTCO)",
    clientLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4rNUCMe2NSrf-9bHhEVrJAiweLdjsaPBTDaoVKBrw6A&s=10",
    clientUrl: "https://wtc.com.sa/",
    status: "Ongoing",
    location: "Jubail Region, KSA",
    sector: "Pipeline & Civil Infrastructure",
    description: "Specialized construction supervision across sections AB, Q & C, managing interfaces, technical reviews, and ensuring compliance with SAIS and SWA specifications.",
    highlights: [
      "Sectional AB, Q & C Technical Supervision",
      "Civil & Pipeline Engineering Quality Audit",
      "Risk Mitigation & Site Safety Oversight",
      "Commercial & Milestone Deliverable Handover"
    ],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
  }
];

const lifecycleSteps = [
  {
    icon: Compass,
    num: "01",
    title: "Planning & Mobilization",
    desc: "Project planning, baseline scheduling, mobilization audit, and stakeholder alignment."
  },
  {
    icon: Activity,
    num: "02",
    title: "Progress & Cost Control",
    desc: "Continuous progress tracking, earned value monitoring, and cost baseline control."
  },
  {
    icon: HardHat,
    num: "03",
    title: "Contractor Coordination",
    desc: "Technical and commercial coordination, interface management, and query resolution."
  },
  {
    icon: ShieldCheck,
    num: "04",
    title: "Quality & HSE Oversight",
    desc: "Rigorous site supervision, safety audits, specification enforcement, and KSA regulations."
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
    title: "Commissioning & Closeout",
    desc: "Testing, commissioning validation, SAIS compliance sign-off, and final handover."
  }
];

function SupervisionPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = isAr 
        ? (direction === "left" ? 440 : -440)
        : (direction === "left" ? -440 : 440);
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className={`bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary ${isAr ? "rtl" : "ltr"}`}>
      <SmoothScroll />
      <TopNav />

      <main className="pb-32">
        {/* Banner + Horizontal Projects Showcase Hero */}
        <section className="relative w-full overflow-hidden pt-24 pb-20 bg-neutral-950 min-h-[85vh] flex flex-col justify-between">
          {/* Background Image & Ambient Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src="https://res.cloudinary.com/dppwnds6z/image/upload/v1791402753/xbhbmqdtijfo7a92lwf8.png" 
              alt="Project Management & Supervision Banner" 
              className="w-full h-full object-cover filter brightness-[0.7] saturate-125 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-neutral-950" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(212,175,55,0.2)_0%,transparent_60%)]" />
          </div>

          {/* Hero Header Text */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-10 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary font-mono text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
                <Building2 className="w-3.5 h-3.5" />
                Engineering Services & Project Delivery
              </span>

              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight uppercase leading-[1.1] mb-4 drop-shadow-2xl">
                PROJECT MANAGEMENT & <span className="text-primary block sm:inline">SUPERVISION</span>
              </h1>

              <p className="max-w-3xl text-sm sm:text-base md:text-lg text-neutral-200 font-light leading-relaxed drop-shadow">
                End-to-end project management and supervision services supporting major water transmission, industrial facilities, and critical infrastructure across the Kingdom of Saudi Arabia.
              </p>
            </motion.div>
          </div>

          {/* Integrated Horizontal Projects Carousel */}
          <div className="relative z-10 max-w-[1450px] mx-auto px-4 md:px-8 w-full mt-4">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                  Featured Supervision Projects
                </span>
                <span className="text-[10px] font-mono text-white/50 hidden sm:inline-block ms-2">
                  (Drag or scroll horizontally)
                </span>
              </div>

              {/* Slider Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  aria-label="Scroll left"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary hover:text-black text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  aria-label="Scroll right"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary hover:text-black text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-1 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {supervisionProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="w-[88vw] sm:w-[440px] lg:w-[470px] shrink-0 snap-center"
                >
                  <TiltCard className="h-full">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      className="flex flex-col justify-between bg-black/60 backdrop-blur-xl border border-primary/30 rounded-3xl overflow-hidden hover:border-primary transition-all duration-500 h-full group shadow-2xl relative"
                    >
                      {/* Top Image Banner */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-900">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover filter brightness-[0.8] group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono font-bold uppercase backdrop-blur-md shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {project.status}
                          </span>
                        </div>

                        {/* Sector Badge */}
                        <div className="absolute bottom-3 left-3 z-10">
                          <span className="px-2.5 py-1 rounded-md bg-black/70 border border-white/20 text-white text-[10px] font-mono uppercase tracking-wider backdrop-blur-md">
                            {project.sector}
                          </span>
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Client Header with Logo */}
                          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-mono uppercase font-bold text-white/50">Client Partner</span>
                              <span className="text-xs font-display font-bold text-white group-hover:text-primary transition-colors">{project.client}</span>
                            </div>
                            {project.clientLogo && (
                              <div className="h-9 w-20 bg-white/95 rounded-lg p-1 border border-white/20 flex items-center justify-center shrink-0 shadow-sm">
                                <img 
                                  src={project.clientLogo} 
                                  alt={project.client} 
                                  className="max-h-full max-w-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Project Title */}
                          <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2 leading-snug group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>

                          <p className="text-xs text-neutral-300 leading-relaxed mb-4 font-sans line-clamp-3">
                            {project.description}
                          </p>

                          {/* Key Highlights */}
                          <div className="space-y-1.5 mb-4">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">Supervision Scope</span>
                            {project.highlights.slice(0, 3).map((h, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-[11px] text-neutral-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
                          <span>{project.location}</span>
                          <span className="text-primary font-bold">SAIS Compliant</span>
                        </div>
                      </div>
                    </motion.div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Executive Overview Section */}
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 mt-16 relative z-20">
          <div className="p-8 md:p-12 rounded-3xl bg-surface border border-primary/20 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-1 bg-gradient-to-r from-primary to-gold rounded-full" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">Service Scope & Philosophy</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">
                Comprehensive Supervision Throughout the Project Lifecycle
              </h2>

              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed font-sans mb-8">
                VISO provides end-to-end project management and supervision services, supporting clients throughout the project lifecycle from planning and mobilization through construction, testing, commissioning, and closeout. Our services include project planning and scheduling, progress and cost monitoring, contractor management, technical and commercial coordination, quality and HSE oversight, risk management, reporting, and stakeholder coordination. We work closely with clients, contractors, and project stakeholders to maintain project progress, manage interfaces, resolve issues, and ensure the works are delivered in accordance with SAIS requirements, specifications, schedule, quality, and HSE standards.
              </p>

              {/* Lifecycle Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {lifecycleSteps.map((step) => {
                  const IconComp = step.icon;
                  return (
                    <motion.div
                      key={step.num}
                      whileHover={{ y: -4 }}
                      className="p-5 rounded-2xl bg-background border border-foreground/10 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className="font-mono text-xs font-bold text-foreground/40 group-hover:text-primary transition-colors">{step.num}</span>
                        </div>
                        <h3 className="font-display font-bold text-base text-foreground mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                        <p className="text-xs text-foreground/70 leading-relaxed">{step.desc}</p>
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
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

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
                className="px-8 py-3.5 rounded-xl bg-primary text-black font-display font-bold text-sm uppercase tracking-wider hover:bg-gold transition-all duration-300 shadow-lg hover:shadow-primary/30 flex items-center gap-2"
              >
                Request Technical Proposal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/projects"
                className="px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-display font-bold text-sm uppercase tracking-wider hover:bg-white/20 transition-all duration-300 backdrop-blur-md"
              >
                View Full Portfolio
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
