import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TopNav } from "@/components/TopNav";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

export const Route = createFileRoute("/security")({
  component: SecurityAnalysisPage,
  head: () => ({
    meta: [
      { title: "VISO | Security Analysis" },
      { name: "description", content: "Our four-stage security approval framework." },
    ],
  }),
});

function SecurityAnalysisPage() {
  const { t } = useTranslation();
  
  const stages = [
    {
      id: 1,
      num: "01",
      title: t("security.stages.s1.title"),
      subtitle: t("security.stages.s1.subtitle"),
      desc: t("security.stages.s1.desc"),
      deliverables: Array.from({length: 12}, (_, i) => i + 1)
        .map(i => t(`security.stages.s1.d${i}`))
        .filter(val => !val.startsWith("security.stages.")),
      img: "/images/stage1_risk_1782901845834.png"
    },
    {
      id: 2,
      num: "02",
      title: t("security.stages.s2.title"),
      subtitle: t("security.stages.s2.subtitle"),
      desc: t("security.stages.s2.desc"),
      deliverables: Array.from({length: 12}, (_, i) => i + 1)
        .map(i => t(`security.stages.s2.d${i}`))
        .filter(val => !val.startsWith("security.stages.")),
      img: "/images/stage2_design_1782901857172.png"
    },
    {
      id: 3,
      num: "03",
      title: t("security.stages.s3.title"),
      subtitle: t("security.stages.s3.subtitle"),
      desc: t("security.stages.s3.desc"),
      deliverables: Array.from({length: 12}, (_, i) => i + 1)
        .map(i => t(`security.stages.s3.d${i}`))
        .filter(val => !val.startsWith("security.stages.")),
      img: "/images/stage3_review_1782901873102.png"
    },
    {
      id: 4,
      num: "04",
      title: t("security.stages.s4.title"),
      subtitle: t("security.stages.s4.subtitle"),
      desc: t("security.stages.s4.desc"),
      deliverables: Array.from({length: 12}, (_, i) => i + 1)
        .map(i => t(`security.stages.s4.d${i}`))
        .filter(val => !val.startsWith("security.stages.")),
      img: "/images/stage4_validation_viso_1782903046495.png"
    }
  ];

  // Intersection observer is no longer needed since ScrollStack handles the scroll animation

  return (
    <div className="bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <TopNav />
      
      <main className="pt-32 pb-40">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1600px] mx-auto px-8 md:px-16 text-center mb-20"
        >
          <h1 className="font-display text-5xl md:text-7xl leading-tight text-foreground">
            {t("security.title")} <span className="italic text-primary">{t("security.title_italic")}</span>
          </h1>
          <p className="font-sans text-lg text-foreground/60 max-w-2xl mx-auto mt-6">
            {t("security.desc")}
          </p>
        </motion.div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12">
          <ScrollStack 
            useWindowScroll={true} 
            itemDistance={400}
            itemScale={0.03}
            itemStackDistance={40}
            stackPosition="10%"
            baseScale={0.9}
          >
            {stages.map((stage) => (
              <ScrollStackItem key={stage.id} itemClassName="!bg-surface-2 !p-0 !overflow-hidden border border-foreground/5 rounded-3xl shadow-xl">
                <div className="flex flex-col lg:flex-row h-full min-h-[65vh]">
                  {/* Left Side: Content */}
                  <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center">
                    <div className="font-mono text-xs tracking-widest text-primary mb-3">
                      {t("security.phase")} {stage.num}
                    </div>
                    <h3 className="font-display text-4xl lg:text-5xl mb-3 text-foreground leading-tight">
                      {stage.title}
                    </h3>
                    <div className="font-sans text-lg font-medium mb-4 text-gold">
                      {stage.subtitle}
                    </div>
                    <p className="font-sans text-base leading-relaxed text-foreground/70 mb-8 max-w-xl">
                      {stage.desc}
                    </p>
                    <div>
                      <div className="font-mono text-xs font-bold tracking-widest text-foreground/40 uppercase mb-3">{t("security.deliverables")}</div>
                      <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
                        {stage.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                            <span className="font-sans text-sm font-medium text-foreground/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Right Side: Image Frame */}
                  <div className="lg:w-5/12 w-full p-6 lg:p-8 flex items-center justify-center bg-background/30 border-t lg:border-t-0 lg:border-l border-foreground/5">
                    <div className="w-full h-full min-h-[250px] relative rounded-2xl overflow-hidden shadow-2xl border border-foreground/10 group bg-surface">
                      <img 
                        src={stage.img} 
                        alt={stage.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                      />
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>

        {/* Project Management Section */}
        <section className="mt-32 relative overflow-hidden bg-surface-2 border-y border-foreground/5">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />
          
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-24 relative z-10">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
                    {t("security.pm.title")} <br/>
                    <span className="italic text-primary">{t("security.pm.title_italic")}</span>
                  </h2>
                  <p className="font-sans text-lg text-foreground/70 leading-relaxed mb-8 max-w-xl">
                    {t("security.pm.desc")}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-background rounded-3xl p-8 md:p-12 shadow-2xl border border-foreground/5 relative group hover:border-primary/20 transition-colors duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                
                <div className="grid sm:grid-cols-2 gap-y-5 gap-x-8 relative z-10">
                  {Array.isArray(t("security.pm.services", { returnObjects: true })) && 
                    (t("security.pm.services", { returnObjects: true }) as string[]).map((service, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-start gap-4 group/item"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + (idx * 0.05) }}
                    >
                      <div className="w-8 h-8 rounded-full bg-surface-2 group-hover/item:bg-primary/10 flex items-center justify-center shrink-0 text-primary transition-colors duration-300 border border-foreground/5 group-hover/item:border-primary/20 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="font-sans text-sm font-medium text-foreground/80 group-hover/item:text-foreground transition-colors duration-300 pt-1.5 leading-snug">{service}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose VISO Section */}
        <section className="py-32 bg-background relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                {t("security.why_choose.title")} <span className="italic text-primary">{t("security.why_choose.title_italic")}</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'].map((key, idx) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-surface-2 p-8 rounded-3xl border border-foreground/5 hover:border-primary/20 transition-all duration-300 group flex flex-col h-full hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 border border-primary/10">
                    <span className="font-display font-bold text-lg">{idx + 1}</span>
                  </div>
                  <h3 className="font-sans font-bold text-lg md:text-xl text-foreground mb-3 leading-tight">{t(`security.why_choose.items.${key}.title`)}</h3>
                  <p className="font-sans text-foreground/70 leading-relaxed text-sm mt-auto">{t(`security.why_choose.items.${key}.desc`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="py-32 bg-surface-2 border-y border-foreground/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                {t("security.approach.title")} <span className="italic text-primary">{t("security.approach.title_italic")}</span>
              </h2>
              <p className="font-sans text-lg text-foreground/70">{t("security.approach.desc")}</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {['a1', 'a2', 'a3', 'a4', 'a5', 'a6'].map((key, idx) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex gap-6 items-start group"
                >
                  <div className="w-16 h-16 rounded-full bg-background border border-foreground/10 flex flex-col items-center justify-center shrink-0 shadow-lg relative overflow-hidden group-hover:border-primary/30 transition-colors duration-300">
                    <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="font-mono text-[10px] font-bold tracking-widest text-primary/60 group-hover:text-primary transition-colors relative z-10">STEP</span>
                    <span className="font-display font-bold text-xl text-foreground relative z-10">0{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg md:text-xl text-foreground mb-2 mt-1 group-hover:text-primary transition-colors duration-300">{t(`security.approach.items.${key}.title`)}</h3>
                    <p className="font-sans text-foreground/70 leading-relaxed text-sm">{t(`security.approach.items.${key}.desc`)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Let's Discuss CTA */}
        <section className="py-32 bg-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
          
          <div className="max-w-[800px] mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-foreground mb-8 leading-tight">
                {t("security.discuss.title")} <br/>
                <span className="italic text-primary">{t("security.discuss.title_italic")}</span>
              </h2>
              <p className="font-sans text-lg md:text-xl text-foreground/70 mb-12 leading-relaxed max-w-2xl mx-auto">
                {t("security.discuss.desc")}
              </p>
              <button 
                onClick={() => window.dispatchEvent(new Event("open-contact-popup"))}
                className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-5 font-sans text-sm font-bold tracking-widest text-white hover:bg-gold transition-all duration-400 hover:scale-[1.05] shadow-xl hover:shadow-primary/30 group"
              >
                {t("security.discuss.btn")}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-3 transition-transform duration-300 group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
