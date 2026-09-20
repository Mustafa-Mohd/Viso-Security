import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Shield, Landmark } from "lucide-react";
import { ContentImagePlaceholder, PageSection } from "@/components/ContentImagePlaceholder";
import { TopNav } from "@/components/TopNav";
import { REGULATORY_BODIES, REGULATORY_HUB_BANNER } from "@/data/regulatoryBodies";

export const Route = createFileRoute("/regulatory/")({
  component: RegulatoryHubPage,
  head: () => ({
    meta: [
      { title: "VISO | Regulatory Authorities" },
      {
        name: "description",
        content:
          "MOI, SAIS, and HCIS industrial security frameworks in Saudi Arabia—and how VISO supports compliance.",
      },
    ],
  }),
});

const ease = [0.16, 1, 0.3, 1] as const;

const icons = {
  moi: Landmark,
  sais: Shield,
  hcis: Building2,
} as const;

function RegulatoryHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <TopNav />
      <main className="pt-28 md:pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <PageSection className="text-center max-w-3xl mx-auto mb-8">
            <p className="font-mono text-[10px] tracking-[0.32em] text-primary uppercase mb-4">
              Kingdom of Saudi Arabia
            </p>
            <h1 className="font-display text-3xl md:text-5xl tracking-tight text-balance">
              Industrial security{" "}
              <span className="text-primary font-light">regulatory landscape</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-foreground/55 leading-relaxed font-light">
              Understand how the Ministry of Interior (MOI), the Supreme Authority for Industrial
              Security (SAIS), and the legacy High Commission for Industrial Security (HCIS)
              framework shape security engineering for critical facilities—and how VISO supports
              each stage.
            </p>
          </PageSection>

          <PageSection delay={0.06} className="mb-12 md:mb-14">
            <ContentImagePlaceholder
              src={REGULATORY_HUB_BANNER}
              alt="Industrial security and critical infrastructure"
              aspect="wide"
              accent="#D4AF37"
              className="max-w-4xl mx-auto"
              priority
            />
          </PageSection>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {REGULATORY_BODIES.map((body, i) => {
              const Icon = icons[body.slug];
              return (
                <motion.div
                  key={body.slug}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease }}
                >
                  <Link
                    to="/regulatory/$slug"
                    params={{ slug: body.slug }}
                    className="group flex h-full flex-col rounded-2xl border border-foreground/10 bg-surface/50 overflow-hidden hover:border-primary/35 hover:shadow-[0_24px_50px_rgba(0,0,0,0.08)] transition-all duration-500"
                  >
                    <ContentImagePlaceholder
                      src={body.cardImageUrl}
                      alt={body.fullName}
                      label={`${body.shortName} image`}
                      hint={`cardImageUrl on regulatoryBodies "${body.slug}"`}
                      aspect="card"
                      accent={body.accent}
                      className="rounded-none border-0 border-b border-foreground/10"
                    />
                    <div
                      className="h-1 w-full shrink-0"
                      style={{ background: `linear-gradient(90deg, ${body.accent}, transparent)` }}
                    />
                    <div className="p-6 md:p-7 flex flex-col flex-1">
                      <div
                        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundColor: body.accent }}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <p className="font-mono text-[10px] tracking-[0.25em] text-foreground/40 uppercase">
                        {body.shortName}
                      </p>
                      <h2 className="mt-2 font-display text-xl md:text-2xl tracking-tight group-hover:text-primary transition-colors duration-300">
                        {body.fullName}
                      </h2>
                      {body.arabicName && (
                        <p className="mt-1 text-sm text-foreground/45 font-light" dir="rtl">
                          {body.arabicName}
                        </p>
                      )}
                      <p className="mt-4 text-sm text-foreground/60 leading-relaxed flex-1">
                        {body.tagline}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-primary">
                        Read overview
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.75, ease }}
            className="mt-12 rounded-xl border border-dashed border-foreground/15 bg-foreground/[0.02] p-6 md:p-8 text-sm text-foreground/55 leading-relaxed"
          >
            <strong className="text-foreground/80 font-semibold">HCIS, SAIS &amp; HAIS:</strong>{" "}
            HCIS was the long-standing name for Saudi Arabia&apos;s industrial security regulator;
            SAIS is the current authority title. &quot;HAIS&quot; in project language usually means
            HCIS/SAIS—not a separate approval body. VISO delivers consultancy aligned with SEC
            directives and SAIS stage gates.
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/security"
              className="rounded-md bg-primary px-7 py-3.5 font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-primary-foreground hover:bg-secondary transition-all duration-300 hover:scale-[1.02]"
            >
              VISO security framework
            </Link>
            <Link
              to="/certificates"
              className="rounded-md border border-foreground/15 px-7 py-3.5 font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-foreground/75 hover:border-primary hover:text-primary transition-colors duration-300"
            >
              Licenses &amp; credentials
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
