import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { clientCategoriesData, ClientLogo } from "@/data/clientsData";
import { TiltCard } from "@/components/TiltCard";

export const Route = createFileRoute("/clients")({
  component: ClientsPage,
  head: () => ({
    meta: [
      { title: "VISO | Our Clients" },
      { name: "description", content: "Trusted by industry leaders across the Kingdom." },
    ],
  }),
});

function ClientsPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");

  return (
    <div className={`bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary ${isAr ? "rtl" : "ltr"}`}>
      <SmoothScroll />
      <TopNav />

      <main className="pb-40">
        <div className="relative w-full overflow-hidden flex items-center justify-center bg-black h-[50vh] mb-16">
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" 
              alt="Clients" 
              className="w-full h-full object-cover filter brightness-[0.5] saturate-125"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4 drop-shadow-lg uppercase">
                OUR <span className="text-primary block sm:inline">CLIENTS</span>
              </h1>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 w-full">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-display font-bold text-neutral-800 mb-4">Trusted by Industry Leaders</h3>
            <p className="text-sm text-neutral-500 max-w-2xl mx-auto">Providing certified, high-precision translation and security engineering solutions for the most demanding organizations across the Kingdom.</p>
          </div>
          
          <div className="space-y-16">
            {clientCategoriesData.map((category) => (
              <div key={category.title}>
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="font-display text-lg md:text-xl text-left text-neutral-800 mb-6 border-b border-neutral-200 pb-3"
                >
                  {category.title}
                </motion.h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 text-center">
                  {category.clients.map((client, i) => (
                    <TiltCard key={client.name} className="h-full">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.03 }}
                        className="group flex flex-col justify-between items-center bg-white border border-neutral-200 p-4 rounded-xl hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden w-full"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="w-full flex flex-col items-center">
                          <div className="h-20 md:h-24 w-full mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <ClientLogo src={client.icon} name={client.name} />
                          </div>
                          <h3 className="font-sans font-semibold text-xs md:text-sm text-neutral-800 mb-1 group-hover:text-primary transition-colors line-clamp-2">{client.name}</h3>
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
    </div>
  );
}
