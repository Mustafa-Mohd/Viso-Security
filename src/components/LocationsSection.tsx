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
  bgImage: string;
};

const locations: Loc[] = [
  { id: "riyadh", name: "Riyadh", region: "Main Headquarters", coordinates: [24.7136, 46.6753], blurb: "Headquarters & national operations hub.", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790668720/ChatGPT_Image_Sep_29_2026_01_27_25_PM.png" },
  { id: "khobar", name: "Khobar", region: "Regional Presence", coordinates: [26.2172, 50.1971], blurb: "Eastern Province operations.", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790761271/ChatGPT_Image_Sep_30_2026_03_10_59_PM.png" },
  { id: "jubail", name: "Jubail", region: "Regional Presence", coordinates: [27.0112, 49.661], blurb: "Industrial & petrochemical security programs.", bgImage: "https://i.vimeocdn.com/video/2099272543-c3cc6657da44aea5870525710e085cc6c97b501e7baed679991b0c2c1da4fc6d-d?f=webp" },
  { id: "yanbu", name: "Yanbu", region: "Regional Presence", coordinates: [24.0232, 38.0638], blurb: "Red Sea industrial facility coverage.", bgImage: "https://www.eritrea-focus.org/wp-content/uploads/2026/07/download.webp" },
  { id: "jeddah", name: "Jeddah", region: "Regional Presence", coordinates: [21.4858, 39.1925], blurb: "Gateway to western coastal projects.", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790761414/ChatGPT_Image_Sep_30_2026_03_13_20_PM.png" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function LocationsSection({ data }: { data?: any }) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string>("riyadh");

  const title = data?.title || t("locations.title", "OUR LOCATION");
  const subtitle =
    data?.subtitle ||
    t("locations.subtitle", "Serving Saudi Arabia and Surroundings");

  const dynamicLocations = locations.map(loc => {
    const cmsCity = data?.cities?.find((c: any) => c.id === loc.id);
    return {
      ...loc,
      bgImage: cmsCity?.bgImage || loc.bgImage
    };
  });

  const active = dynamicLocations.find((l) => l.id === activeId) || dynamicLocations[0];
  const focusLocation = (id: string) => setActiveId(id);

  const mapCities = dynamicLocations.map((l) => ({
    id: l.id,
    name: t(`locations.cities.${l.id}.name`, l.name),
    coordinates: l.coordinates,
  }));

  return (
    <section className="relative w-full py-14 md:py-20 bg-black text-white overflow-hidden border-t border-foreground/5">
      {/* Full section animated background */}
      <AnimatePresence initial={false}>
        <motion.img
          key={active.id}
          src={active.bgImage}
          alt={active.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/60 pointer-events-none" />



      <div className="max-w-[1600px] mx-auto px-8 md:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 mb-3">
              <span className="text-gold">04</span>
              <span className="h-px w-8 bg-white/20" />
              <span>{t("locations.presence")}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight uppercase leading-[0.95] text-white">
              {title}
            </h2>
            <p className="mt-2 text-sm md:text-base text-white/80 max-w-lg">
              {subtitle}
            </p>
          </motion.div>


        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col items-start gap-6">
            {/* Headquarters Card */}
            <div
              className="w-full flex flex-col gap-3 transition-all duration-300 cursor-pointer group"
              onMouseEnter={() => focusLocation("riyadh")}
              onClick={() => focusLocation("riyadh")}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${activeId === "riyadh" ? "bg-primary/20 border border-primary/30 shadow-[0_0_20px_rgba(220,38,38,0.15)]" : "bg-black/20 border border-white/10 group-hover:bg-black/40 group-hover:border-white/20"}`}>
                  <MapPin className="w-5 h-5 transition-colors text-primary" />
                </div>
                
                <div className="flex flex-col items-start gap-2">
                  <div className={`inline-flex px-2.5 py-1 rounded-md backdrop-blur-md transition-colors duration-300 font-mono text-[10px] tracking-[0.2em] uppercase ${activeId === "riyadh" ? "bg-primary/10 text-primary border border-primary/20" : "bg-black/30 text-white/50 border border-white/5"}`}>
                    {t("locations.headquarters", "Headquarters")}
                  </div>
                  
                  <h3 className={`inline-flex px-3 py-1.5 rounded-lg backdrop-blur-md transition-colors duration-300 font-display text-2xl md:text-3xl font-bold ${activeId === "riyadh" ? "bg-black/50 text-white border border-white/10 shadow-lg" : "bg-black/20 text-white/80 border border-transparent"}`}>
                    Riyadh
                  </h3>
                  
                  <p className={`inline-flex px-4 py-3 rounded-lg backdrop-blur-md transition-colors duration-300 text-sm leading-relaxed max-w-sm ${activeId === "riyadh" ? "bg-black/50 text-white/90 border border-white/10 shadow-lg" : "bg-black/20 text-white/60 border border-transparent"}`}>
                    Office No. 110, At Taawun, 7423 Abi Bakr As Siddiq, Riyadh Saudi Arabia
                  </p>
                  
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Office+No.+110,+At+Taawun,+7423+Abi+Bakr+As+Siddiq,+Riyadh+Saudi+Arabia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg backdrop-blur-md font-mono text-[10px] uppercase tracking-wider transition-all shadow-lg ${activeId === "riyadh" ? "bg-primary/80 hover:bg-primary text-white border border-primary/50" : "bg-black/40 hover:bg-black/60 text-white/70 border border-white/10"}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MapPin className="w-3.5 h-3.5" /> Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Regional Offices */}
            <div className="mt-4 w-full">
              <div className="inline-block px-2.5 py-1.5 rounded-md bg-black/30 backdrop-blur-md border border-white/5 font-mono text-[10px] tracking-[0.15em] uppercase text-white/50 mb-4">
                Regional Presence
              </div>
              <div className="flex flex-wrap gap-3">
                {dynamicLocations.filter(l => l.id !== "riyadh").map((loc) => {
                  const isActive = activeId === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => focusLocation(loc.id)}
                      onMouseEnter={() => focusLocation(loc.id)}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                        isActive
                          ? "bg-primary/20 border border-primary/40 shadow-[0_0_15px_rgba(220,38,38,0.15)] text-white"
                          : "bg-black/30 border border-white/10 hover:bg-black/50 hover:border-white/20 text-white/70"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0 transition-colors text-primary" />
                      <span className="font-display text-sm tracking-tight truncate font-medium">
                        {t(`locations.cities.${loc.id}.name`, loc.name)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-mono text-white/50">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary" />
                {t("locations.nationwide_short")}
              </span>
              <a href="tel:+966114503289" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                <Phone className="w-3 h-3 text-primary" />
                +966 11 450 3289
              </a>
              <a href="mailto:info@visogroup.com" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                <Mail className="w-3 h-3 text-primary" />
                info@visogroup.com
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="lg:col-span-7 relative h-[360px] md:h-[420px] w-full rounded-sm -mt-8 lg:-mt-24"
          >
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
              <Suspense
                fallback={
                  <div className="h-full w-full animate-pulse bg-white/5 rounded-sm" aria-hidden />
                }
              >
                <LocationsSaudiMap
                  cities={mapCities}
                  activeId={activeId}
                  onSelect={focusLocation}
                />
              </Suspense>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
