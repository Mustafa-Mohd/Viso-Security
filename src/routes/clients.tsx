import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TiltCard } from "@/components/TiltCard";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "VISO | Our Clients" },
      { name: "description", content: "Clients who picked VISO. We've designed the security spine for industry titans." },
    ],
  }),
  component: ClientsPage,
});

const clientCategoriesData = [
  {
    title: "ENERGY & PETROCHEMICALS",
    clients: [
      { name: "Saudi Aramco", icon: "/clients/aramco.png", url: "https://www.aramco.com/" },
      { name: "SATORP", icon: "/clients/satorp.png", url: "https://www.satorp.com/" },
      { name: "S-Chem", icon: "https://logo.clearbit.com/schem.com", url: "#" },
      { name: "NMDC Energy", icon: "https://www.nmdc-energy.com/assets/images/logo/NMDC%20Energy%20white.svg", url: "https://www.nmdc-energy.com/" },
      { name: "Advanced Petrochemical Company", icon: "https://advancedpetrochem.com/wp-content/uploads/2022/09/advanced-logos-111-4.gif", url: "https://advancedpetrochem.com/" },
    ]
  },
  {
    title: "GIGA-PROJECTS & INFRASTRUCTURE",
    clients: [
      { name: "NEOM", icon: "/clients/neom.png", url: "https://www.neom.com/" },
      { name: "MA'ADEN", icon: "/clients/maaden.png", url: "https://www.maaden.com.sa/" },
      { name: "RSA (Red Sea Aluminium)", icon: "https://logo.clearbit.com/rsaindustrial.com", url: "#" },
      { name: "OXAGON", icon: "https://logo.clearbit.com/oxagon.com", url: "https://www.neom.com/en-us/regions/oxagon" },
      { name: "MKKN", icon: "https://logo.clearbit.com/mkkn.sa", url: "#" },
    ]
  },
  {
    title: "WATER, POWER & UTILITIES",
    clients: [
      { name: "NWC (National Water Company)", icon: "/clients/nwc.png", url: "https://www.nwc.com.sa/" },
      { name: "Saudi Water Authority", icon: "https://logo.clearbit.com/swa.gov.sa", url: "https://swa.gov.sa/" },
      { name: "Water Transmission Company (WTC)", icon: "https://logo.clearbit.com/wtc.com.sa", url: "https://wtc.com.sa/" },
      { name: "TAQQAT (Abdulla Fouad Group)", icon: "https://logo.clearbit.com/abdulla-fouad.com", url: "#" },
      { name: "SE (Saudi Energy / Saudi Electricity)", icon: "/clients/sec.png", url: "https://www.se.com.sa/" },
      { name: "MARAFIQ", icon: "/clients/marafiq.png", url: "https://www.marafiq.com.sa/" },
    ]
  },
  {
    title: "GOVERNMENT & FINANCIAL",
    clients: [
      { name: "Saudi Central Bank (SAMA)", icon: "/clients/sama.png", url: "https://www.sama.gov.sa/" },
      { name: "MAWANI (Saudi Ports Authority)", icon: "/clients/mawani.png", url: "https://mawani.gov.sa/" },
      { name: "Royal Commission for Riyadh City", icon: "https://logo.clearbit.com/rcrc.gov.sa", url: "https://www.rcrc.gov.sa/" },
      { name: "General Authority for Military Industries (GAMI)", icon: "https://logo.clearbit.com/gami.gov.sa", url: "https://gami.gov.sa/" },
    ]
  },
  {
    title: "EPC & ENGINEERING PARTNERS",
    clients: [
      { name: "Worley", icon: "https://logo.clearbit.com/worley.com", url: "https://www.worley.com/" },
      { name: "Wood", icon: "https://logo.clearbit.com/woodplc.com", url: "https://www.woodplc.com/" },
      { name: "SLFE (SNC-Lavalin Fayez Engineering)", icon: "https://logo.clearbit.com/snclavalin.com", url: "https://www.snclavalin.com/" },
      { name: "KBR", icon: "https://logo.clearbit.com/kbr.com", url: "https://www.kbr.com/" },
      { name: "IDOM", icon: "https://logo.clearbit.com/idom.com", url: "https://www.idom.com/" },
      { name: "SIEMENS", icon: "https://logo.clearbit.com/siemens.com", url: "https://www.siemens.com/" },
      { name: "L&T Energy (Hydrocarbon)", icon: "https://logo.clearbit.com/larsentoubro.com", url: "https://www.larsentoubro.com/" },
      { name: "Samsung Engineering", icon: "https://logo.clearbit.com/samsungengineering.com", url: "https://www.samsungengineering.com/" },
      { name: "DOOSAN", icon: "https://logo.clearbit.com/doosan.com", url: "https://www.doosan.com/" },
    ]
  },
  {
    title: "PRIVATE SECTOR & HOSPITALITY",
    clients: [
      { name: "The Ritz-Carlton", icon: "/clients/ritz.png", url: "https://www.ritzcarlton.com/" },
      { name: "Red Sea International", icon: "/clients/red-sea-intl.png", url: "https://www.redseahousing.com/" },
      { name: "Amazon", icon: "/clients/amazon.svg", url: "https://www.amazon.sa/" },
    ]
  }
];

const ClientLogo = ({ src, name }: { src: string, name: string }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    const initials = name.replace(/[^a-zA-Z\s]/g, '').trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || name.substring(0, 2).toUpperCase();
    return (
      <div className="w-12 h-12 rounded bg-foreground/5 flex items-center justify-center text-foreground/50 font-bold font-mono border border-foreground/10">
        {initials}
      </div>
    );
  }

  return (
    <img 
      loading="lazy" 
      decoding="async" 
      src={src} 
      alt={name} 
      className="max-h-full max-w-full object-contain"
      onError={() => setError(true)}
    />
  );
};

function ClientsPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState(clientCategoriesData);

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data } = await supabase.from('cms_content').select('*').eq('section_key', 'clients').single();
        if (data && data.content && data.content.items) {
          const dbItems = data.content.items;
          const mergedCategories = clientCategoriesData.map(category => ({
            ...category,
            clients: category.clients.map(client => {
              const dbMatch = dbItems.find((dbItem: any) => dbItem.name.toLowerCase() === client.name.toLowerCase());
              return {
                ...client,
                url: dbMatch && dbMatch.url ? dbMatch.url : client.url
              };
            })
          }));
          setCategories(mergedCategories);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchClients();
  }, []);

  return (
    <>
      <SmoothScroll />
      <TopNav />
      <main className="bg-background min-h-screen text-foreground pt-40 pb-32">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-mono text-xs font-bold tracking-[0.3em] text-primary mb-6 uppercase"
          >
            {t("clients.eyebrow")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl leading-tight text-foreground mb-8"
          >
            {t("clients.title")} <span className="italic text-primary">{t("clients.title_italic")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-lg text-foreground/60 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            {t("clients.desc")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{ textAlign: "justify" }}
            className="font-sans text-sm text-foreground/50 max-w-3xl mx-auto leading-relaxed mb-24 text-justify"
          >
            A unified digital experience presenting VISO security consultancy and translation capabilities, while connecting employees, document control and project tracking through one corporate platform.
          </motion.p>

          <div className="space-y-24">
            {categories.map((category) => (
              <div key={category.title}>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="font-display text-2xl md:text-3xl text-left text-foreground mb-10 border-b border-foreground/10 pb-4"
                >
                  {category.title}
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 text-left">
                  {category.clients.map((client, i) => (
                    <TiltCard key={client.name} className="h-full">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 + (i * 0.05) }}
                        className="group flex flex-col justify-between bg-surface border border-foreground/5 p-6 rounded-2xl hover:border-gold/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(212,175,55,0.06)] transition-all duration-300 h-full relative overflow-hidden w-full"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div>
                          <div className="h-12 mb-4 flex items-center group-hover:scale-110 transition-transform origin-left duration-300">
                            <ClientLogo src={client.icon} name={client.name} />
                          </div>
                          <h3 className="font-display font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{client.name}</h3>
                        </div>
                        
                        <div className="mt-8 pt-4 border-t border-foreground/5">
                          <a 
                            href={client.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.2em] text-primary group-hover:text-gold transition-colors uppercase"
                          >
                            {t("clients.visit")}
                            <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
                          </a>
                        </div>
                      </motion.div>
                    </TiltCard>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
