import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TopNav } from "@/components/TopNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { useClientCategories, ClientLogo, CLIENT_SECTORS_AR, CLIENT_NAMES_AR } from "@/data/clientsData";
import { TiltCard } from "@/components/TiltCard";

export const Route = createFileRoute("/clients")({
  component: ClientsPage,
  head: () => ({
    meta: [
      { title: "VISO | Our Clients & Partners" },
      { name: "description", content: "Trusted by industry leaders and strategic entities across the Kingdom." },
    ],
  }),
});

function ClientsPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith("ar");
  const { categories } = useClientCategories();

  return (
    <div className={`bg-background min-h-screen text-foreground font-sans selection:bg-primary/20 selection:text-primary ${isAr ? "rtl" : "ltr"}`}>
      <SmoothScroll />
      <TopNav />

      <main className="pb-40">
        <div className="relative w-full overflow-hidden flex items-center justify-center h-[50vh] mb-16">
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src="https://res.cloudinary.com/dppwnds6z/image/upload/v1791402753/xbhbmqdtijfo7a92lwf8.png" 
              alt="Clients Banner" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] uppercase">
                {isAr ? (
                  <>
                    عملاؤنا <span className="text-primary block sm:inline drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">وشركاؤنا</span>
                  </>
                ) : (
                  <>
                    OUR <span className="text-primary block sm:inline drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">CLIENTS</span>
                  </>
                )}
              </h1>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 w-full">
          <div className="text-center mb-16 max-w-3xl mx-auto px-4">
            <span className="font-mono text-xs font-bold tracking-[0.25em] text-primary uppercase mb-3 inline-block">
              {isAr ? "شركاء النجاح والريادة" : "STRATEGIC PARTNERSHIPS"}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              {isAr ? "محل ثقة كبرى الهيئات والشركات الرائدة" : "Trusted by Industry Leaders"}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {isAr
                ? "نعتز بشراكتنا الراسخة مع كبرى الهيئات والجهات الحكومية والشركات العالمية والمشاريع الاستراتيجية الكبرى في المملكة العربية السعودية، حيث نقدم استشارات وحلول هندسية أمنية عالية الدقة تلبي أرفع المعايير."
                : "Providing certified, high-precision translation and security engineering solutions for the most demanding organizations across the Kingdom."}
            </p>
          </div>
          
          <div className="space-y-16">
            {categories.map((category) => {
              const categoryTitle = isAr
                ? (category.titleAr || CLIENT_SECTORS_AR[category.title] || category.title)
                : category.title;

              return (
                <div key={category.title} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`mb-6 border-b border-border/70 pb-3 flex items-center justify-between gap-4 ${
                      isAr ? "flex-row-reverse text-right" : "flex-row text-left"
                    }`}
                  >
                    <h3 className="font-display text-lg md:text-xl font-bold text-foreground flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block flex-shrink-0" />
                      <span>{categoryTitle}</span>
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground tracking-wider font-medium flex-shrink-0">
                      {category.clients.length} {isAr ? "شريك" : "ENTITIES"}
                    </span>
                  </motion.div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 text-center">
                    {category.clients.map((client, i) => {
                      const clientName = isAr
                        ? (client.nameAr || CLIENT_NAMES_AR[client.name] || client.name)
                        : client.name;

                      return (
                        <TiltCard key={client.name + i} className="h-full">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
                            className="group flex flex-col justify-between items-center bg-card hover:bg-card/80 border border-border/70 hover:border-primary/50 p-3.5 md:p-4 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden w-full backdrop-blur-xs"
                          >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="w-full flex flex-col items-center">
                              {/* Dedicated high-contrast logo stage - ensures 100% visibility for both dark & light logos */}
                              <div className="h-20 md:h-24 w-full mb-3 rounded-xl bg-white dark:bg-white/95 p-3 flex items-center justify-center border border-neutral-100 dark:border-neutral-200/50 shadow-2xs group-hover:scale-103 transition-transform duration-300">
                                <ClientLogo src={client.icon} name={clientName} />
                              </div>
                              <h4 className="font-sans font-semibold text-xs md:text-sm text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2 text-center">
                                {clientName}
                              </h4>
                            </div>
                          </motion.div>
                        </TiltCard>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
