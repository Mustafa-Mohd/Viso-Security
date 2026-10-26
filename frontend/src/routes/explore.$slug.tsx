import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Layers,
  Cpu,
  Lock,
  Sparkles,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  Activity,
  Compass,
  Award,
  Clock,
  Building,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { TopNav } from "@/components/TopNav";
import {
  CAPABILITY_TOPICS,
  getTopicAccent,
  getTopicBySlug,
  type CapabilityTopic,
} from "@/data/capabilityTopics";

export const Route = createFileRoute("/explore/$slug")({
  component: ExploreTopicPage,
  loader: ({ params }) => {
    const topic = getTopicBySlug(params.slug);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `VISO | ${loaderData.topic.label} — Security Engineering Specification`
          : "VISO | Capability Dossier",
      },
      {
        name: "description",
        content:
          loaderData?.topic.summary ??
          "VISO engineering-grade security consultancy and technical specification.",
      },
    ],
  }),
});

const ease = [0.16, 1, 0.3, 1] as const;

// Helper to generate dynamic structured engineering methodology per topic
function getMethodologySteps(topic: CapabilityTopic) {
  const stepsByCategory: Record<CapabilityTopic["category"], { num: string; title: string; desc: string; output: string }[]> = {
    Assessment: [
      { num: "01", title: "Asset & Criticality Profiling", desc: "Identify all physical and digital crown jewels, operational dependencies, and threat exposure levels.", output: "Asset Criticality Matrix" },
      { num: "02", title: "Threat Actor & Vulnerability Modelling", desc: "Evaluate hostile vehicle, intruder, and insider threat vectors against national security baselines.", output: "Threat Hazard Register" },
      { num: "03", title: "Quantitative Risk & Gap Scoring", desc: "Measure probability and impact scoring under HCIS and ISO-31000 risk grading frameworks.", output: "Risk Assessment Report (RAR)" },
      { num: "04", title: "Strategic Mitigation Blueprint", desc: "Formulate defensible mitigation priorities, zoning logic, and technology investment roadmaps.", output: "Security Treatment Plan" },
    ],
    Design: [
      { num: "01", title: "Concept of Protection (CoP)", desc: "Establish concentric defense layers (Deter, Detect, Delay, Respond) tailored to site topography.", output: "Protection Philosophy" },
      { num: "02", title: "Preliminary Engineering & Zoning", desc: "Lay out perimeter barriers, turnstile corridors, CCTV coverage matrices, and command center ergonomics.", output: "Preliminary Design Drawings" },
      { num: "03", title: "Detailed Engineering Packages", desc: "Develop full tender-ready specifications, cable routes, schematics, and Bill of Quantities (BOQ).", output: "Detailed IFC Package & BOQ" },
      { num: "04", title: "Regulatory Design Verification", desc: "Cross-check all drawings and technical submittals against HCIS SEC-01 to SEC-07 directives.", output: "Compliance Validation Pack" },
    ],
    Delivery: [
      { num: "01", title: "Owner's Engineer Technical Review", desc: "Independent peer review of contractor submittals, material approvals, and value-engineering proposals.", output: "Submittal Review Log" },
      { num: "02", title: "Factory Acceptance Testing (FAT)", desc: "Witness and audit hardware/software assembly at factory facilities before site dispatch.", output: "FAT Inspection Certificate" },
      { num: "03", title: "Site Acceptance Testing (SAT)", desc: "Rigorous on-site testing of integrated CCTV, ACS, IDS, and PSIM system performance under load.", output: "SAT Commissioning Dossier" },
      { num: "04", title: "Operational Readiness & Handover", desc: "Develop Standard Operating Procedures (SOPs), operator training packages, and as-built archives.", output: "O&M Handover Manuals" },
    ],
    Compliance: [
      { num: "01", title: "Regulatory Baseline Gap Analysis", desc: "Map existing or planned infrastructure directly against HCIS, MOI, and SAIS regulatory requirements.", output: "Compliance Audit Matrix" },
      { num: "02", title: "Authority Submission Package Assembly", desc: "Structure formal engineering packs with executive summaries, calculations, and compliance evidence.", output: "Formal Submission Dossier" },
      { num: "03", title: "Authority Technical Representation", desc: "Lead technical discussions and clarification workshops directly with regulatory committees.", output: "Clarification Resolution Record" },
      { num: "04", title: "Final Approval & Certification", desc: "Obtain formal authority approvals, security permits, and operational security licenses.", output: "Authority Approval Certificate" },
    ],
    Systems: [
      { num: "01", title: "Ecosystem Architecture Strategy", desc: "Design unified VMS, ACS, IDS, and PSIM architectures to prevent fragmented security silos.", output: "Unified Systems Architecture" },
      { num: "02", title: "Network & Bandwidth Dimensioning", desc: "Calculate storage redundancy (RAID/SAN), camera bandwidth load, and power backup topologies.", output: "Network & Storage Calculations" },
      { num: "03", title: "Cyber-Physical Hardening", desc: "Enforce port security, 802.1X authentication, TLS 1.3 encryption, and firmware integrity defense.", output: "Cyber Hardening Protocol" },
      { num: "04", title: "Control Room & PSIM Integration", desc: "Configure video walls, geospatial map overlays, automated incident workflows, and alarm dispatch.", output: "Control Center SOPs" },
    ],
  };

  return stepsByCategory[topic.category] || stepsByCategory.Assessment;
}

// Key deliverables per topic category
function getDeliverables(topic: CapabilityTopic) {
  const deliverablesByCategory: Record<CapabilityTopic["category"], { title: string; format: string; standard: string }[]> = {
    Assessment: [
      { title: "Security Risk Assessment Report (SRA)", format: "Executive Dossier & Matrix", standard: "HCIS SEC-01 / ISO 31000" },
      { title: "Site Threat Hazard Analysis (THA)", format: "Spatial Threat Heatmap", standard: "MOI High Security" },
      { title: "Vulnerability Gap Assessment Register", format: "Interactive Data Register", standard: "SAIS Standard" },
      { title: "Security Treatment & Mitigation Plan", format: "Implementation Roadmap", standard: "Executive Board Level" },
    ],
    Design: [
      { title: "Security Concept of Design (CoD)", format: "Narrative & Spatial Diagrams", standard: "HCIS SEC-01 to 07" },
      { title: "Tender Engineering Drawings & Layouts", format: "AutoCAD / BIM Level-2", standard: "IFC Grade" },
      { title: "Technical Specifications & BOQs", format: "CSI MasterFormat Spec", standard: "FIDIC / Client Spec" },
      { title: "Control Room Ergonomics & Video Wall Plan", format: "ISO 11064 Compliance", standard: "24/7 Mission Critical" },
    ],
    Delivery: [
      { title: "Factory Acceptance Test (FAT) Protocol", format: "Structured Verification Scripts", standard: "Vendor & Client Signed" },
      { title: "Site Acceptance Test (SAT) Verification Pack", format: "Live Performance Dossier", standard: "HCIS Commissioning" },
      { title: "Standard Operating Procedures (SOP)", format: "Operational Incident Guides", standard: "Operator Ready" },
      { title: "As-Built Archive & Warranty Package", format: "Complete Digital Handover", standard: "Facility Management" },
    ],
    Compliance: [
      { title: "HCIS Directives Compliance Submission", format: "Comprehensive Authority Pack", standard: "HCIS SEC 01–07" },
      { title: "MOI Security Clearance Documentation", format: "Official Submission Package", standard: "Kingdom-Wide" },
      { title: "SAIS Authority Technical Clarifications", format: "Traceability Matrix", standard: "Statutory Approval" },
      { title: "Authority Inspection Defense Record", format: "Site Audit Defense Pack", standard: "Class-1 Approval" },
    ],
    Systems: [
      { title: "Integrated VMS & Video Analytics Spec", format: "Technical Architecture Pack", standard: "Enterprise Level" },
      { title: "Biometric & High-Security ACS Design", format: "Hardware & Database Topology", standard: "Anti-Passback / Encrypted" },
      { title: "PSIM & Unified Command Platform Schema", format: "Integration API Map", standard: "Zero-Trust Architecture" },
      { title: "Perimeter Intrusion Detection (PIDS) Plan", format: "Fiber / Radar / Fence Sensor", standard: "100% Perimeter Catch" },
    ],
  };

  return deliverablesByCategory[topic.category] || deliverablesByCategory.Assessment;
}

const FAQS = [
  {
    q: "How does VISO ensure compliance with Saudi HCIS and MOI directives?",
    a: "VISO security engineers are certified across Saudi High Commission for Industrial Security (HCIS) directives SEC-01 through SEC-07. Every deliverable includes full regulatory traceability, direct authority submission formatting, and hands-on defense during authority review sessions.",
  },
  {
    q: "Can this engineering package be integrated with existing BIM / CAD architectural models?",
    a: "Yes. All VISO detailed design packages are delivered in native AutoCAD, Revit BIM Level-2, and GIS coordinate systems, enabling seamless coordination with master planners, MEP consultants, and structural engineers.",
  },
  {
    q: "What is the typical timeframe for a complete capability engagement?",
    a: "Project timelines vary by scale. Risk assessments and concept designs typically take 2 to 4 weeks, while comprehensive detailed engineering and authority approval packages span 6 to 12 weeks depending on megaproject complexity.",
  },
];

function ExploreTopicPage() {
  const { topic } = Route.useLoaderData();
  const accent = getTopicAccent(topic.category);
  const methodology = getMethodologySteps(topic);
  const deliverables = getDeliverables(topic);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const related = CAPABILITY_TOPICS.filter(
    (t) => t.category === topic.category && t.slug !== topic.slug
  ).slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-gold/20 selection:text-gold">
      <TopNav />

      {/* Hero Ambient Background Beam */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[85vw] h-[400px] bg-gradient-to-b from-gold/[0.07] via-primary/[0.03] to-transparent blur-[140px] z-0" />

      <main className="relative z-10 pt-28 md:pt-34 pb-32 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Breadcrumb & Navigation Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-foreground/10"
          >
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Link to="/" className="hover:text-gold transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
              <Link to="/about" className="hover:text-gold transition-colors">
                Capabilities
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
              <span className="text-foreground font-bold">{topic.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-foreground/15 bg-surface hover:bg-surface-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-gold" />
                <span>{copied ? "Copied Link!" : "Share Dossier"}</span>
              </button>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs font-mono uppercase tracking-wider text-foreground transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Link>
            </div>
          </motion.div>

          {/* ============================================================
              HERO DOSSIER HEADER
             ============================================================ */}
          <div className="grid lg:grid-cols-12 gap-8 items-stretch mb-14">
            {/* Left Header Box */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease }}
              className="lg:col-span-8 rounded-2xl border border-gold/25 bg-gradient-to-br from-surface/90 via-background to-primary/[0.03] p-8 md:p-12 relative overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.04)] flex flex-col justify-between"
            >
              {/* Decorative Watermark */}
              <div className="pointer-events-none absolute -bottom-10 -right-10 font-display font-extrabold text-[12vw] leading-none text-foreground/[0.02] select-none">
                {topic.category.toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-white shadow-sm"
                    style={{ backgroundColor: accent }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                    {topic.category}
                  </span>

                  <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase flex items-center gap-1.5">
                    <Compass className="w-3 h-3 text-gold" />
                    VISO ARCHITECTURAL DISCIPLINE // SPEC-ID: {topic.slug.toUpperCase()}
                  </span>
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12] tracking-tight text-foreground text-balance">
                  {topic.headline || topic.label}
                </h1>

                <p className="mt-6 text-lg md:text-xl text-foreground/75 leading-relaxed font-light text-pretty max-w-3xl">
                  {topic.summary}
                </p>
              </div>

              {/* Live Telemetry HUD Strip */}
              <div className="mt-10 pt-6 border-t border-foreground/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Standards Matrix
                  </p>
                  <p className="font-display font-bold text-sm text-foreground mt-0.5">
                    HCIS / MOI / SAIS
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Deliverables
                  </p>
                  <p className="font-display font-bold text-sm text-foreground mt-0.5">
                    IFC Drawings & Spec
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Audit Defense
                  </p>
                  <p className="font-display font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Traceable
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Regional Scope
                  </p>
                  <p className="font-display font-bold text-sm text-gold mt-0.5">
                    Kingdom-Wide KSA
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Action & Clearance Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="lg:col-span-4 rounded-2xl border border-foreground/10 bg-surface/80 p-8 flex flex-col justify-between shadow-sm relative overflow-hidden"
            >
              <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-gold uppercase tracking-wider">
                    <Shield className="w-4 h-4 text-gold" />
                    Security Clearance
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                    Class-1 Ready
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  Request Technical Specification
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Engage VISO security architects for site reviews, regulatory submission roadmaps, or engineering peer review.
                </p>

                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span>Direct submission packs for regulatory approval</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span>BIM Level-2 & AutoCAD spatial integration</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span>On-site engineering defense with authorities</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gold hover:bg-gold/90 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-widest text-black transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Engage Security Consultant</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={topic.relatedRoute || "/security"}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-background hover:bg-surface border border-foreground/15 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:border-gold/50"
                >
                  <span>{topic.relatedLabel || "View Security Framework"}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* ============================================================
              MAIN CONTENT GRID WITH METHODOLOGY & SIDEBAR
             ============================================================ */}
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Main Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Detailed Narrative Section */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="p-8 md:p-10 rounded-2xl border border-foreground/10 bg-surface/50 relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold font-mono font-bold text-xs">
                    01
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      Engineering Scope
                    </p>
                    <h2 className="font-display font-bold text-2xl text-foreground">
                      Architectural Overview & Philosophy
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-base md:text-lg text-foreground/80 leading-[1.8] font-light">
                  {topic.body.map((p: string, idx: number) => (
                    <p key={idx}>{p}</p>
                  ))}
                  <p>
                    Every engagement follows strict defense-in-depth principles, ensuring that physical barriers, electronic surveillance, access zoning, and response protocols function as one coherent shield.
                  </p>
                </div>
              </motion.section>

              {/* 4-Stage Methodology Cards with Scroll Entrance */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold font-mono font-bold text-xs">
                      02
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        Execution Workflow
                      </p>
                      <h2 className="font-display font-bold text-2xl text-foreground">
                        4-Stage Engineering Methodology
                      </h2>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest hidden sm:inline-block">
                    Standardized Lifecycle
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {methodology.map((step, idx) => (
                    <motion.div
                      key={step.num}
                      initial={{ opacity: 0, y: 25, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.08, ease }}
                      className="group p-6 rounded-xl border border-foreground/10 bg-surface/70 hover:border-gold/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="pointer-events-none absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl group-hover:bg-gold/10 transition-colors" />

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                            STAGE {step.num}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground uppercase">
                            Milestone
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-gold transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs md:text-sm text-foreground/70 leading-relaxed font-light">
                          {step.desc}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-foreground/10 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-muted-foreground">Deliverable:</span>
                        <span className="text-foreground font-semibold">{step.output}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Engineering Deliverables Matrix */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold font-mono font-bold text-xs">
                    03
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      Tangible Outputs
                    </p>
                    <h2 className="font-display font-bold text-2xl text-foreground">
                      Key Deliverables & Specifications
                    </h2>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {deliverables.map((d, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      className="p-5 rounded-xl border border-foreground/10 bg-surface/60 hover:bg-surface hover:border-gold/30 transition-all flex items-start gap-4"
                    >
                      <div className="p-2.5 rounded-lg bg-gold/10 border border-gold/25 text-gold shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display font-bold text-sm text-foreground mb-1">
                          {d.title}
                        </h4>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          Format: {d.format}
                        </p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded bg-foreground/5 font-mono text-[9px] text-foreground/80 uppercase tracking-wider">
                          Standard: {d.standard}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Frequently Asked Questions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold font-mono font-bold text-xs">
                    04
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      Authority & Execution
                    </p>
                    <h2 className="font-display font-bold text-2xl text-foreground">
                      Governance & Implementation FAQs
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {FAQS.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-xl border border-foreground/10 bg-surface/60 overflow-hidden transition-colors hover:border-gold/30"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-5 text-left font-display font-semibold text-base text-foreground cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gold transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-5 pb-5 text-sm text-foreground/75 leading-relaxed font-light border-t border-foreground/5 pt-3"
                            >
                              {faq.a}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
              {/* Related Capabilities Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="rounded-2xl border border-foreground/10 bg-surface/80 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-foreground/10">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-gold uppercase font-bold">
                    Related Disciplines
                  </p>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {topic.category}
                  </span>
                </div>

                <div className="space-y-2">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      to="/explore/$slug"
                      params={{ slug: r.slug }}
                      className="group flex items-center justify-between p-3 rounded-xl border border-foreground/5 hover:border-gold/40 hover:bg-background transition-all"
                    >
                      <div>
                        <h5 className="font-display font-semibold text-sm text-foreground group-hover:text-gold transition-colors">
                          {r.label}
                        </h5>
                        <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                          {r.category}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>

                <Link
                  to="/about"
                  className="mt-6 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-foreground/15 bg-background hover:bg-surface text-xs font-mono font-bold uppercase tracking-wider text-foreground/80 hover:text-foreground transition-all"
                >
                  <span>Explore All 22 Capabilities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>

              {/* KSA Direct Regional Coverage Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 via-background to-surface p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 text-gold font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  <Activity className="w-4 h-4" />
                  <span>KSA Regional Presence</span>
                </div>
                <p className="text-xs text-foreground/75 leading-relaxed mb-4">
                  VISO operates strategic offices and on-site engineering hubs across the Kingdom of Saudi Arabia.
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] uppercase">
                  {["Riyadh HQ", "Khobar", "Jubail", "Jeddah", "Yanbu"].map((hub) => (
                    <span
                      key={hub}
                      className="px-2.5 py-1 rounded-md bg-background border border-foreground/10 text-foreground/80 font-medium"
                    >
                      {hub}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
