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
      deliverables: [
        t("security.stages.s1.d1"),
        t("security.stages.s1.d2"),
        t("security.stages.s1.d3"),
        t("security.stages.s1.d4"),
        t("security.stages.s1.d5"),
        t("security.stages.s1.d6")
      ].filter(Boolean),
      img: "/images/stage1_risk_1782901845834.png"
    },
    {
      id: 2,
      num: "02",
      title: t("security.stages.s2.title"),
      subtitle: t("security.stages.s2.subtitle"),
      desc: t("security.stages.s2.desc"),
      deliverables: [
        t("security.stages.s2.d1"),
        t("security.stages.s2.d2"),
        t("security.stages.s2.d3"),
        t("security.stages.s2.d4"),
        t("security.stages.s2.d5"),
        t("security.stages.s2.d6")
      ].filter(Boolean),
      img: "/images/stage2_design_1782901857172.png"
    },
    {
      id: 3,
      num: "03",
      title: t("security.stages.s3.title"),
      subtitle: t("security.stages.s3.subtitle"),
      desc: t("security.stages.s3.desc"),
      deliverables: [
        t("security.stages.s3.d1"),
        t("security.stages.s3.d2"),
        t("security.stages.s3.d3"),
        t("security.stages.s3.d4"),
        t("security.stages.s3.d5")
      ].filter(Boolean),
      img: "/images/stage3_review_1782901873102.png"
    },
    {
      id: 4,
      num: "04",
      title: t("security.stages.s4.title"),
      subtitle: t("security.stages.s4.subtitle"),
      desc: t("security.stages.s4.desc"),
      deliverables: [
        t("security.stages.s4.d1"),
        t("security.stages.s4.d2"),
        t("security.stages.s4.d3"),
        t("security.stages.s4.d4"),
        t("security.stages.s4.d5")
      ].filter(Boolean),
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
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                      />
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </main>
    </div>
  );
}
