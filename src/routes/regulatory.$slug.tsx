import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  ContentImagePlaceholder,
  PageSection,
} from "@/components/ContentImagePlaceholder";
import { TopNav } from "@/components/TopNav";
import { getRegulatoryBody, REGULATORY_BODIES } from "@/data/regulatoryBodies";

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
          : "VISO | Regulatory",
      },
      { name: "description", content: loaderData?.body.tagline ?? "" },
    ],
  }),
});

const ease = [0.16, 1, 0.3, 1] as const;

function RegulatoryDetailPage() {
  const { body } = Route.useLoaderData();
  const related = REGULATORY_BODIES.filter((b) => body.relatedSlugs.includes(b.slug));

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <TopNav />
      <main className="pt-28 md:pt-32 pb-24 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={body.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease }}
            className="max-w-[1100px] mx-auto px-6 md:px-10"
          >
            <Link
              to="/regulatory"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-foreground/50 hover:text-primary transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              All authorities
            </Link>

            <PageSection className="relative overflow-hidden rounded-2xl border border-foreground/10 mb-10">
              <ContentImagePlaceholder
                src={body.heroImageUrl}
                alt={body.fullName}
                label={`${body.shortName} hero`}
                hint={`heroImageUrl on regulatoryBodies "${body.slug}"`}
                aspect="wide"
                accent={body.accent}
                priority
                className="rounded-2xl border-0 min-h-[220px] md:min-h-[300px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none rounded-2xl" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease }}
                  className="inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-white mb-4"
                  style={{ backgroundColor: body.accent }}
                >
                  {body.shortName}
                </motion.span>
                <h1 className="font-display text-3xl md:text-[2.75rem] leading-tight tracking-tight max-w-3xl text-foreground">
                  {body.fullName}
                </h1>
                {body.arabicName && (
                  <p className="mt-2 text-lg text-foreground/55 font-light" dir="rtl">
                    {body.arabicName}
                  </p>
                )}
                <p className="mt-4 text-base md:text-lg text-foreground/65 max-w-2xl leading-relaxed font-light">
                  {body.tagline}
                </p>
              </div>
            </PageSection>

            <PageSection delay={0.06}>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease }}
                className="text-base md:text-lg text-foreground/70 leading-[1.8]"
              >
                {body.overview}
              </motion.p>
            </PageSection>

            <div className="mt-10 grid md:grid-cols-2 gap-5">
              {body.keyPoints.map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-24px" }}
                  transition={{ duration: 0.65, delay: i * 0.05, ease }}
                  whileHover={{ y: -2 }}
                  className="rounded-xl border border-foreground/10 bg-surface/40 p-6 transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
                >
                  <h2 className="font-display text-lg tracking-tight text-foreground mb-2">
                    {point.title}
                  </h2>
                  <p className="text-sm text-foreground/65 leading-relaxed">{point.description}</p>
                </motion.div>
              ))}
            </div>

            <PageSection delay={0.1} className="mt-12">
              <ContentImagePlaceholder
                src={body.secondaryImageUrl}
                alt={`${body.shortName} diagram`}
                label="Supporting visual"
                hint={`secondaryImageUrl on regulatoryBodies "${body.slug}" (e.g. lifecycle diagram)`}
                aspect="video"
                accent={body.accent}
              />
            </PageSection>

            {body.lifecycleStages && body.lifecycleStages.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
                className="mt-14"
              >
                <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-6">
                  SAIS project lifecycle
                </h2>
                <div className="space-y-4">
                  {body.lifecycleStages.map((stage, i) => (
                    <motion.div
                      key={stage.step}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: i * 0.07, ease }}
                      className="flex gap-4 md:gap-6 rounded-xl border border-foreground/10 p-5 md:p-6 bg-gradient-to-r from-primary/[0.04] to-transparent hover:from-primary/[0.07] transition-colors duration-300"
                    >
                      <span className="font-mono text-sm font-bold text-primary shrink-0">
                        {stage.step}
                      </span>
                      <div>
                        <h3 className="font-display text-lg tracking-tight">{stage.title}</h3>
                        <p className="mt-1 text-sm text-foreground/65 leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease }}
              className="mt-14 rounded-2xl border border-primary/25 bg-primary/[0.06] p-7 md:p-9"
            >
              <h2 className="font-display text-xl md:text-2xl tracking-tight mb-5">
                How VISO supports you
              </h2>
              <ul className="space-y-3">
                {body.visoSupport.map((line, i) => (
                  <motion.li
                    key={line}
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.45, ease }}
                    className="flex gap-3 text-sm md:text-base text-foreground/75"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
                    <span>{line}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/security"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-primary-foreground hover:bg-secondary transition-all duration-300 hover:scale-[1.02]"
                >
                  Security consulting
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-foreground/15 px-6 py-3 font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-foreground/75 hover:border-primary hover:text-primary transition-colors duration-300"
                >
                  Contact VISO
                </Link>
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 pt-8 border-t border-foreground/10"
            >
              <p className="font-mono text-[10px] tracking-[0.28em] text-foreground/40 uppercase mb-4">
                Related authorities
              </p>
              <div className="flex flex-wrap gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to="/regulatory/$slug"
                    params={{ slug: r.slug }}
                    className="rounded-full border border-foreground/15 px-4 py-2 text-sm text-foreground/70 hover:border-primary hover:text-primary transition-all duration-300 hover:scale-[1.02]"
                  >
                    {r.shortName} — {r.fullName}
                  </Link>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
