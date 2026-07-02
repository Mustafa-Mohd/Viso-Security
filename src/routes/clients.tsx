import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TiltCard } from "@/components/TiltCard";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "VISO | Our Clients" },
      { name: "description", content: "Clients who picked VISO. We've designed the security spine for industry titans." },
    ],
  }),
  component: ClientsPage,
});

const clientsData = [
  { name: "Saudi Aramco", sector: "Oil & Gas", icon: "🛢️", url: "https://www.aramco.com/" },
  { name: "NEOM", sector: "Mega Project", icon: "🏙️", url: "https://www.neom.com/" },
  { name: "National Water Company", sector: "Water Utility", icon: "💧", url: "https://www.nwc.com.sa/" },
  { name: "Saudi Electricity Company", sector: "Power Utility", icon: "⚡", url: "https://www.se.com.sa/" },
  { name: "SAMA — Saudi Central Bank", sector: "Government / Financial", icon: "🏛️", url: "https://www.sama.gov.sa/" },
  { name: "Ma'aden", sector: "Mining", icon: "⛏️", url: "https://www.maaden.com.sa/" },
  { name: "SATORP", sector: "Refinery", icon: "🛢️", url: "https://www.satorp.com/" },
  { name: "MARAFIQ", sector: "Utilities", icon: "🔌", url: "https://www.marafiq.com.sa/" },
  { name: "ACWA Power", sector: "Power & Water", icon: "💡", url: "https://acwapower.com/" },
  { name: "Saudi Chemical Company", sector: "Defense & Chemicals", icon: "🧪", url: "https://saudichemical.com/" },
  { name: "Amazon", sector: "E-commerce", icon: "📦", url: "https://www.amazon.sa/" },
  { name: "Ritz-Carlton", sector: "Hospitality", icon: "🏨", url: "https://www.ritzcarlton.com/" },
  { name: "Jotun", sector: "Paints", icon: "🎨", url: "https://www.jotun.com/" },
  { name: "ROSHN", sector: "Real Estate", icon: "🏘️", url: "https://www.roshn.sa/" },
  { name: "Red Sea Global", sector: "Mega Project", icon: "🌊", url: "https://www.redseaglobal.com/" },
  { name: "Royal Commission for Jubail & Yanbu", sector: "Government", icon: "🏛️", url: "https://www.rcjy.gov.sa/" },
  { name: "Red Sea International", sector: "Construction", icon: "🏗️", url: "https://www.redseahousing.com/" },
  { name: "Dammam Port", sector: "Port Authority", icon: "⚓", url: "https://mawani.gov.sa/" },
  { name: "Jeddah Islamic Port", sector: "Port", icon: "🚢", url: "https://mawani.gov.sa/" },
  { name: "Jazan Port", sector: "Port", icon: "🛳️", url: "https://mawani.gov.sa/" },
];

function ClientsPage() {
  const { t } = useTranslation();

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
            Partnerships
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl leading-tight text-foreground mb-8"
          >
            Clients who <span className="italic text-primary">picked VISO.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-lg text-foreground/60 max-w-3xl mx-auto leading-relaxed mb-24"
          >
            From oil & gas titans to mega projects redrawing the map — we've designed the security spine for the names below.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 text-left">
            {clientsData.map((client, i) => (
              <TiltCard key={client.name} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + (i * 0.05) }}
                  className="group flex flex-col justify-between bg-surface border border-foreground/5 p-6 rounded-2xl hover:border-gold/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(212,175,55,0.06)] transition-all duration-300 h-full relative overflow-hidden w-full"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div>
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left duration-300">{client.icon}</div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{client.name}</h3>
                    <p className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest">{client.sector}</p>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-foreground/5">
                    <a 
                      href={client.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.2em] text-primary group-hover:text-gold transition-colors uppercase"
                    >
                      Visit site
                      <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
