import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Shield,
  Layers,
  Award,
  FileCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { TopNav } from "@/components/TopNav";
import {
  getRegulatoryBody,
  REGULATORY_BODIES,
  type RegulatoryBody,
} from "@/data/regulatoryBodies";

export const Route = createFileRoute("/regulatory/$slug")({
  component: RegulatoryDetailPage,
  loader: ({ params }) => {
    const body = getRegulatoryBody(params.slug);
    if (!body) throw notFound();
    return { body };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `VISO | ${loaderData.body.shortName} — ${loaderData.body.fullName}`
          : "VISO | Regulatory Authority & Standards",
      },
      {
        name: "description",
        content: loaderData?.body.tagline ?? "VISO Security Consultations & Regulatory Compliance.",
      },
    ],
  }),
});

const ease = [0.16, 1, 0.3, 1] as const;

function RegulatoryDetailPage() {
  const { body } = Route.useLoaderData() as { body: RegulatoryBody };
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  const related = REGULATORY_BODIES.filter((b) =>
    body.relatedSlugs?.includes(b.slug)
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <TopNav />

      <main className="pt-28 md:pt-36 pb-24 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={body.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease }}
            className="max-w-[1200px] mx-auto px-6 md:px-12"
            dir={isArabic ? "rtl" : "ltr"}
          >
            {/* Back Navigation Bar */}
            <div className="mb-8 flex items-center justify-between border-b border-foreground/10 pb-4">
              <Link
                to="/about"
                hash="standards-compliance"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary hover:text-gold transition-colors duration-200"
              >
                <ArrowLeft className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
                <span>
                  {isArabic ? "العودة إلى المعايير والامتثال" : "Back to Standards & Compliance"}
                </span>
              </Link>

              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60">
                {body.shortName} Specification
              </span>
            </div>

            {/* Header / Hero Section */}
            <section className="relative rounded-3xl border border-foreground/10 bg-surface/50 p-8 md:p-14 overflow-hidden mb-12 shadow-sm">
              {/* Decorative Accent Glow */}
              <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 pointer-events-none translate-x-1/4 -translate-y-1/4"
                style={{ backgroundColor: body.accent || "#D4AF37" }}
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="max-w-3xl flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-6 shadow-md"
                    style={{ backgroundColor: body.accent || "#D4AF37" }}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{body.shortName}</span>
                  </motion.div>

                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-3">
                    {body.fullName}
                  </h1>

                  {body.arabicName && (
                    <p className="font-arabic text-xl md:text-2xl text-foreground/60 font-medium mb-5" dir="rtl">
                      {body.arabicName}
                    </p>
                  )}

                  <p className="text-lg md:text-xl text-foreground/80 font-normal leading-relaxed text-pretty">
                    {body.tagline}
                  </p>
                </div>

                {/* Authority Logo Badge */}
                {body.heroImageUrl && (
                  <div className="shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white p-4 shadow-xl border border-foreground/10 flex items-center justify-center self-start">
                    <img
                      src={body.heroImageUrl}
                      alt={body.fullName}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Overview Section */}
            <section className="mb-14">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-0.5 w-6 bg-primary" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {isArabic ? "نظرة عامة على الإطار التنظيمي" : "Framework Overview"}
                </span>
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-surface/30 p-8 md:p-10">
                <div className="text-base md:text-lg text-foreground/80 leading-[1.8] whitespace-pre-line font-light">
                  {body.overview}
                </div>
              </div>
            </section>

            {/* Key Regulatory Points */}
            {body.keyPoints && body.keyPoints.length > 0 && (
              <section className="mb-14">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-0.5 w-6 bg-primary" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    {isArabic ? "البنود والاشتراطات الجوهرية" : "Key Regulatory Pillars"}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {body.keyPoints.map((point, i) => (
                    <motion.div
                      key={point.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="rounded-2xl border border-foreground/10 bg-surface/40 p-6 md:p-8 hover:border-foreground/20 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mt-0.5"
                          style={{ backgroundColor: body.accent || "#D4AF37" }}
                        >
                          {i + 1}
                        </div>
                        <div>
                          <h2 className="font-display text-xl font-bold tracking-tight text-foreground mb-2">
                            {point.title}
                          </h2>
                          <p className="text-sm md:text-base text-foreground/70 leading-relaxed font-light">
                            {point.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Lifecycle Stages */}
            {body.lifecycleStages && body.lifecycleStages.length > 0 && (
              <section className="mb-14">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-0.5 w-6 bg-primary" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    {isArabic ? "مراحل دورة المشروع والاعتماد" : "Project Lifecycle & Milestones"}
                  </span>
                </div>

                <div className="space-y-4">
                  {body.lifecycleStages.map((stage, i) => (
                    <motion.div
                      key={stage.step}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 rounded-2xl border border-foreground/10 p-6 bg-gradient-to-r from-primary/[0.04] to-transparent hover:from-primary/[0.08] transition-colors"
                    >
                      <span className="font-mono text-lg font-black text-primary shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        {stage.step}
                      </span>
                      <div>
                        <h3 className="font-display text-lg md:text-xl font-bold tracking-tight text-foreground">
                          {stage.title}
                        </h3>
                        <p className="mt-1 text-sm md:text-base text-foreground/70 leading-relaxed font-light">
                          {stage.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* How VISO Supports You */}
            {body.visoSupport && body.visoSupport.length > 0 && (
              <section className="mb-14 rounded-3xl border border-primary/30 bg-primary/[0.05] p-8 md:p-12 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      {isArabic ? "حلول وخدمات فيسو" : "VISO Value Delivery"}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-6">
                    {isArabic
                      ? `كيف تدعم فيسو مشاريعكم وفق اشتراطات ${body.shortName}؟`
                      : `How VISO Delivers Full ${body.shortName} Compliance`}
                  </h2>

                  <ul className="space-y-4 mb-8">
                    {body.visoSupport.map((line, i) => (
                      <li key={i} className="flex items-start gap-3.5 text-base text-foreground/80 leading-relaxed font-normal">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-primary/20">
                    <Link
                      to="/security"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-sans text-xs font-bold tracking-[0.14em] uppercase text-white hover:bg-gold transition-all duration-300 shadow-lg hover:scale-[1.02]"
                    >
                      <span>{isArabic ? "استكشف خدماتنا الأمنية" : "Explore Security Consultancy"}</span>
                      <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-lg border border-foreground/20 px-7 py-3.5 font-sans text-xs font-bold tracking-[0.14em] uppercase text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <span>{isArabic ? "طلب استشارة معتمدة" : "Request Consultation"}</span>
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Related Authorities */}
            {related && related.length > 0 && (
              <section className="pt-8 border-t border-foreground/10">
                <p className="font-mono text-[11px] tracking-[0.25em] text-foreground/50 uppercase mb-4">
                  {isArabic ? "أطر تنظيمية أخرى ذات صلة" : "Other Regulatory Frameworks"}
                </p>
                <div className="flex flex-wrap gap-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      to="/regulatory/$slug"
                      params={{ slug: r.slug }}
                      className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-xs font-bold text-foreground/80 hover:border-primary hover:text-primary hover:bg-surface transition-all duration-200"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.accent }} />
                      <span>{r.shortName}</span>
                      <span className="text-foreground/40 font-normal">— {r.fullName}</span>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isArabic ? "rotate-180" : ""}`} />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
