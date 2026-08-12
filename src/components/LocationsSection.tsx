import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail, Navigation, Hand } from "lucide-react";
import { LocationsGlobe } from "@/components/LocationsGlobe";

type Loc = {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number];
  blurb: string;
};

const locations: Loc[] = [
  { id: "riyadh", name: "Riyadh", region: "Central Region", coordinates: [24.7136, 46.6753], blurb: "Headquarters & national operations hub." },
  { id: "jeddah", name: "Jeddah", region: "Western Region", coordinates: [21.4858, 39.1925], blurb: "Gateway to western coastal projects." },
  { id: "makkah", name: "Makkah", region: "Western Region", coordinates: [21.4225, 39.8262], blurb: "High-security heritage & pilgrimage environments." },
  { id: "madina", name: "Madina", region: "Western Region", coordinates: [24.4686, 39.6122], blurb: "Regional coverage for sacred-city assets." },
  { id: "dammam", name: "Dammam", region: "Eastern Region", coordinates: [26.4207, 50.1033], blurb: "Eastern Province commercial corridor." },
  { id: "jubail", name: "Jubail", region: "Industrial City", coordinates: [27.0112, 49.661], blurb: "Industrial & petrochemical security programs." },
  { id: "yanbu", name: "Yanbu", region: "Industrial City", coordinates: [24.0232, 38.0638], blurb: "Red Sea industrial facility coverage." },
  { id: "neom", name: "NEOM Region", region: "Northwest", coordinates: [28.0841, 35.2974], blurb: "Next-gen mega-project security consulting." },
  { id: "taif", name: "Taif", region: "Western Highlands", coordinates: [21.2703, 40.4062], blurb: "Highland regional support." },
  { id: "tabuk", name: "Tabuk", region: "Northern Region", coordinates: [28.3835, 36.5715], blurb: "Northern Kingdom project delivery." },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function LocationsSection({ data }: { data?: any }) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string>("riyadh");

  const title = data?.title || t("locations.title", "OUR LOCATION");
  const subtitle =
    data?.subtitle ||
    t("locations.subtitle", "Serving Saudi Arabia and Surroundings");

  const active = locations.find((l) => l.id === activeId) || locations[0];

  const focusLocation = (id: string) => setActiveId(id);

  const globeLocations = locations.map((l) => ({
    id: l.id,
    name: t(`locations.cities.${l.id}.name`, l.name),
    coordinates: l.coordinates,
  }));

  return (
    <section className="relative w-full py-20 md:py-28 bg-background text-foreground overflow-hidden border-t border-foreground/5">
      <div className="pointer-events-none absolute -top-10 right-0 font-display font-extrabold text-[18vw] leading-none text-foreground/[0.03] tracking-tighter select-none">
        KSA
      </div>
      <div className="absolute top-1/3 left-0 w-[45vw] h-[45vw] bg-primary/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[35vw] h-[35vw] bg-[#1B4F72]/[0.08] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-8 md:px-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-14 md:mb-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-5">
              <span className="text-gold">04</span>
              <span className="h-px w-8 bg-border" />
              <span>Presence</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[0.95]">
              {title}
            </h2>
            <p className="mt-4 text-base md:text-lg text-foreground/55 font-light max-w-xl leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="lg:col-span-5 grid grid-cols-3 gap-4"
          >
            {[
              { n: "10+", l: "Cities" },
              { n: "5", l: "Regions" },
              { n: "100%", l: "KSA Coverage" },
            ].map((s) => (
              <div
                key={s.l}
                className="border border-foreground/10 bg-surface/60 px-4 py-4 rounded-sm"
              >
                <div className="font-display text-2xl md:text-3xl text-primary tracking-tight">
                  {s.n}
                </div>
                <div className="mt-1 font-mono text-[9px] tracking-[0.22em] uppercase text-foreground/40">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* City list */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 space-y-1.5 max-h-[480px] lg:max-h-[620px] overflow-y-auto pr-2 custom-scroll">
              {locations.map((loc, idx) => {
                const isActive = activeId === loc.id;
                return (
                  <motion.button
                    key={loc.id}
                    type="button"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.04, ease }}
                    onClick={() => focusLocation(loc.id)}
                    onMouseEnter={() => focusLocation(loc.id)}
                    className={`w-full text-left group relative flex items-center gap-4 px-4 py-3.5 rounded-sm border transition-all duration-400 ${
                      isActive
                        ? "border-primary/40 bg-primary/[0.08] shadow-[0_12px_30px_-18px_rgba(212,175,55,0.55)]"
                        : "border-transparent hover:border-foreground/10 hover:bg-foreground/[0.02]"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] tracking-widest w-7 shrink-0 transition-colors ${
                        isActive ? "text-primary" : "text-foreground/30"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-display text-lg tracking-tight transition-colors ${
                            isActive ? "text-foreground" : "text-foreground/70"
                          }`}
                        >
                          {t(`locations.cities.${loc.id}.name`, loc.name)}
                        </h4>
                        {isActive && (
                          <motion.span
                            layoutId="loc-dot"
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                          />
                        )}
                      </div>
                      <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-foreground/40 mt-0.5">
                        {t(`locations.cities.${loc.id}.region`, loc.region)}
                      </p>
                    </div>
                    <Navigation
                      className={`w-4 h-4 shrink-0 transition-all duration-400 ${
                        isActive
                          ? "text-primary opacity-100 translate-x-0"
                          : "text-foreground/20 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"
                      }`}
                    />
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease }}
                className="mt-5 p-5 rounded-sm border border-foreground/10 bg-surface"
              >
                <p className="font-mono text-[10px] tracking-[0.25em] text-primary uppercase mb-2">
                  Selected city
                </p>
                <h3 className="font-display text-2xl tracking-tight mb-1">
                  {t(`locations.cities.${active.id}.name`, active.name)}
                </h3>
                <p className="text-sm text-foreground/55 font-light leading-relaxed">
                  {active.blurb}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 pt-4 border-t border-foreground/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-foreground/45">
                <MapPin className="w-4 h-4 text-primary" />
                {t("locations.nationwide", "Saudi Arabia (Nationwide)")}
              </span>
              <div className="flex flex-wrap gap-4 font-mono text-[11px] text-foreground/55">
                <a
                  href="tel:+966543966637"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  +966 543 966 637
                </a>
                <a
                  href="mailto:contact@viso.com.sa"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  contact@viso.com.sa
                </a>
              </div>
            </div>
          </div>

          {/* 3D Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="lg:col-span-7 relative h-[460px] md:h-[560px] lg:h-[700px] w-full rounded-sm overflow-hidden border border-foreground/10 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)]"
          >
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-[#07090f]/95 to-transparent pointer-events-none">
              <div>
                <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/45">
                  Interactive 3D globe
                </p>
                <p className="font-display text-sm tracking-tight text-white">
                  {t(`locations.cities.${active.id}.name`, active.name)}
                  <span className="text-white/40 font-sans font-light">
                    {" "}
                    · {active.region}
                  </span>
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-wide text-primary/90">
                <Hand className="w-3.5 h-3.5" />
                Drag to rotate · Scroll to zoom
              </div>
            </div>

            <LocationsGlobe
              locations={globeLocations}
              activeId={activeId}
              onSelect={focusLocation}
            />

            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3 bg-gradient-to-t from-[#07090f] via-[#07090f]/80 to-transparent flex items-center justify-between gap-3 pointer-events-none">
              <div className="flex items-center gap-4 text-[10px] font-mono tracking-wide text-white/50">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  Active city
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E74C3C]" />
                  Network
                </span>
              </div>
              <p className="hidden sm:block text-[10px] font-light text-white/35">
                Hover a city — the globe turns to face it
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.35); border-radius: 4px; }
      `}</style>
    </section>
  );
}
