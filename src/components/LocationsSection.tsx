import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail } from "lucide-react";

const LocationsSaudiMap = lazy(() =>
  import("@/components/LocationsSaudiMap").then((m) => ({ default: m.LocationsSaudiMap }))
);

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

  const mapCities = locations.map((l) => ({
    id: l.id,
    name: t(`locations.cities.${l.id}.name`, l.name),
    coordinates: l.coordinates,
  }));

  return (
    <section className="relative w-full py-14 md:py-20 bg-background text-foreground overflow-hidden border-t border-foreground/5">
      <div className="max-w-[1600px] mx-auto px-8 md:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              <span className="text-gold">04</span>
              <span className="h-px w-8 bg-border" />
              <span>{t("locations.presence")}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight uppercase leading-[0.95]">
              {title}
            </h2>
            <p className="mt-2 text-sm md:text-base text-foreground/50 font-light max-w-lg">
              {subtitle}
            </p>
          </motion.div>

          <div className="flex gap-6 md:gap-8">
            {[
              { n: "10+", l: t("locations.cities_count") },
              { n: "5", l: t("locations.regions_count") },
              { n: "100%", l: t("locations.coverage") },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-xl md:text-2xl text-primary tracking-tight">{s.n}</div>
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/40">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-1.5">
              {locations.map((loc, idx) => {
                const isActive = activeId === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => focusLocation(loc.id)}
                    onMouseEnter={() => focusLocation(loc.id)}
                    className={`text-left flex items-center gap-2.5 px-3 py-2.5 rounded-sm border transition-all duration-300 ${
                      isActive
                        ? "border-primary/40 bg-primary/[0.08]"
                        : "border-foreground/8 bg-surface/60 hover:border-foreground/15"
                    }`}
                  >
                    <MapPin
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? "text-primary" : "text-foreground/35"
                      }`}
                    />
                    <div className="min-w-0">
                      <div
                        className={`font-display text-sm tracking-tight truncate ${
                          isActive ? "text-foreground" : "text-foreground/70"
                        }`}
                      >
                        {t(`locations.cities.${loc.id}.name`, loc.name)}
                      </div>
                      <div className="font-mono text-[8px] tracking-[0.14em] uppercase text-foreground/35 truncate">
                        {String(idx + 1).padStart(2, "0")} ·{" "}
                        {t(`locations.cities.${loc.id}.region`, loc.region)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="px-3 py-3 rounded-sm border border-foreground/10 bg-surface"
              >
                <p className="font-display text-base tracking-tight">
                  {t(`locations.cities.${active.id}.name`, active.name)}
                </p>
                <p className="text-xs text-foreground/50 font-light mt-0.5 leading-relaxed">
                  {t(`locations.blurbs.${active.id}`, active.blurb)}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-mono text-foreground/45">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" />
                {t("locations.nationwide_short")}
              </span>
              <a href="tel:+966543966637" className="inline-flex items-center gap-1 hover:text-primary">
                <Phone className="w-3 h-3 text-primary" />
                +966 543 966 637
              </a>
              <a href="mailto:contact@viso.com.sa" className="inline-flex items-center gap-1 hover:text-primary">
                <Mail className="w-3 h-3 text-primary" />
                contact@viso.com.sa
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="lg:col-span-7 relative h-[360px] md:h-[420px] w-full rounded-sm overflow-hidden border border-foreground/10"
          >
            <Suspense
              fallback={
                <div className="h-full w-full animate-pulse bg-foreground/[0.04]" aria-hidden />
              }
            >
              <LocationsSaudiMap
                cities={mapCities}
                activeId={activeId}
                onSelect={focusLocation}
              />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
