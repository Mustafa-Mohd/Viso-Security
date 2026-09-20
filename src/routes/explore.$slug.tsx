import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  ContentImagePlaceholder,
  PageSection,
} from "@/components/ContentImagePlaceholder";
import { TopNav } from "@/components/TopNav";
import {
  CAPABILITY_TOPICS,
  getTopicAccent,
  getTopicBySlug,
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
          ? `VISO | ${loaderData.topic.label}`
          : "VISO | Capability",
      },
      {
        name: "description",
        content: loaderData?.topic.summary ?? "VISO security capability.",
      },
    ],
  }),
});

const ease = [0.16, 1, 0.3, 1] as const;

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function ExploreTopicPage() {
  const { topic } = Route.useLoaderData();
  const accent = getTopicAccent(topic.category);
  const related = CAPABILITY_TOPICS.filter(
    (t) => t.category === topic.category && t.slug !== topic.slug,
  ).slice(0, 3);

  const gallery = topic.galleryImageUrls ?? [];
  const gallerySlots = [
    gallery[0] ?? "",
    gallery[1] ?? "",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <TopNav />
      <main className="pt-28 md:pt-32 pb-24 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={topic.slug}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease }}
            className="max-w-[1140px] mx-auto px-6 md:px-10"
          >
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-foreground/50 hover:text-primary transition-colors duration-300 mb-10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch mb-10">
              <PageSection className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-surface/80 flex flex-col justify-center">
                <div
                  className="absolute inset-0 opacity-[0.07] pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 20% 0%, ${accent}, transparent 55%)`,
                  }}
                />
                <div className="relative p-8 md:p-10 lg:p-11">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <motion.span
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.4, ease }}
                      className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {topic.category}
                    </motion.span>
                    <span className="font-mono text-[10px] tracking-[0.25em] text-foreground/40 uppercase">
                      Capability explorer
                    </span>
                  </div>

                  <h1 className="font-display text-3xl md:text-4xl lg:text-[2.35rem] tracking-tight text-balance">
                    {topic.headline}
                  </h1>
                  <p className="mt-5 text-base md:text-lg text-foreground/60 leading-relaxed font-light">
                    {topic.summary}
                  </p>
                </div>
              </PageSection>

              <ContentImagePlaceholder
                src={topic.heroImageUrl}
                alt={topic.headline}
                label="Hero image"
                hint={`Set heroImageUrl on topic "${topic.slug}" in capabilityTopics.ts`}
                aspect="hero"
                accent={accent}
                priority
                className="h-full lg:min-h-[320px]"
              />
            </div>

            <div className="grid lg:grid-cols-[1fr_280px] gap-10 items-start">
              <div className="space-y-8">
                <PageSection delay={0.08}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {gallerySlots.map((url, i) => (
                      <ContentImagePlaceholder
                        key={i}
                        src={url || undefined}
                        alt={`${topic.label} visual ${i + 1}`}
                        label={`Gallery ${i + 1}`}
                        hint={`galleryImageUrls[${i}] in capabilityTopics.ts`}
                        aspect="card"
                        accent={accent}
                      />
                    ))}
                  </div>
                </PageSection>

                <PageSection delay={0.12} className="space-y-6">
                  {topic.body.map((paragraph, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.6, delay: i * 0.06, ease }}
                      className="text-base md:text-lg text-foreground/75 leading-[1.75]"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </PageSection>

                <PageSection delay={0.16} className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to={topic.relatedRoute}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-primary-foreground hover:bg-secondary transition-all duration-300 hover:scale-[1.02]"
                  >
                    {topic.relatedLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 rounded-md border border-foreground/15 px-7 py-3.5 font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-foreground/80 hover:border-primary hover:text-primary transition-all duration-300"
                  >
                    Company profile
                  </Link>
                </PageSection>
              </div>

              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
                className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6 lg:sticky lg:top-32"
              >
                <p className="font-mono text-[10px] tracking-[0.28em] text-primary uppercase mb-4">
                  Related topics
                </p>
                <ul className="space-y-1">
                  {related.map((r, i) => (
                    <motion.li
                      key={r.slug}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.06, duration: 0.45, ease }}
                    >
                      <Link
                        to="/explore/$slug"
                        params={{ slug: r.slug }}
                        className="block text-sm text-foreground/70 hover:text-primary py-2.5 border-b border-foreground/5 transition-colors duration-300"
                      >
                        {r.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.aside>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
