import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Map, Overlay, ZoomControl } from "pigeon-maps";
import { MapPin } from "lucide-react";

// Pigeon maps uses [lat, lng]
const locations = [
  { id: "riyadh", name: "Riyadh", region: "Central Region", coordinates: [24.7136, 46.6753] },
  { id: "jeddah", name: "Jeddah", region: "Western Region", coordinates: [21.4858, 39.1925] },
  { id: "makkah", name: "Makkah", region: "Western Region", coordinates: [21.4225, 39.8262] },
  { id: "madina", name: "Madina", region: "Western Region", coordinates: [24.4686, 39.6122] },
  { id: "dammam", name: "Dammam", region: "Eastern Region", coordinates: [26.4207, 50.1033] },
  { id: "jubail", name: "Jubail", region: "Industrial City", coordinates: [27.0112, 49.6610] },
  { id: "yanbu", name: "Yanbu", region: "Industrial City", coordinates: [24.0232, 38.0638] },
  { id: "neom", name: "NEOM Region", region: "Northwest", coordinates: [28.0841, 35.2974] },
  { id: "taif", name: "Taif", region: "Western Highlands", coordinates: [21.2703, 40.4062] },
  { id: "tabuk", name: "Tabuk", region: "Northern Region", coordinates: [28.3835, 36.5715] },
];

// CartoDB Voyager (Colourful geographic map)
const cartoVoyagerProvider = (x: number, y: number, z: number, dpr?: number) => {
  return `https://basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${dpr && dpr >= 2 ? '@2x' : ''}.png`;
};

export function LocationsSection({ data }: { data?: any }) {
  const { t } = useTranslation();
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const title = data?.title || t("locations.title", "OUR LOCATION");
  const subtitle = data?.subtitle || t("locations.subtitle", "Serving Saudi Arabia and Surroundings");

  return (
    <section className="relative w-full py-24 bg-background text-foreground overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tight uppercase mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 tracking-wide font-light">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: List of locations */}
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {locations.map((loc, idx) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`group flex items-start gap-4 p-4 rounded-xl border border-transparent transition-all duration-300 cursor-pointer ${
                  activeLocation === loc.id
                    ? "bg-primary/10 border-primary/20 shadow-[0_0_20px_rgba(200,169,110,0.1)]"
                    : "hover:bg-foreground/[0.03]"
                }`}
                onMouseEnter={() => setActiveLocation(loc.id)}
                onMouseLeave={() => setActiveLocation(null)}
              >
                <div className="mt-1 flex-shrink-0">
                  <div className={`p-2 rounded-full transition-colors duration-300 ${
                    activeLocation === loc.id ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-primary"
                  }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className={`text-lg font-bold transition-colors duration-300 ${
                    activeLocation === loc.id ? "text-primary" : "text-foreground"
                  }`}>
                    {t(`locations.cities.${loc.id}.name`, loc.name)}
                  </h4>
                  <p className="text-sm text-foreground/50 tracking-wider uppercase mt-1 text-[11px]">
                    {t(`locations.cities.${loc.id}.region`, loc.region)}
                  </p>
                </div>
              </motion.div>
            ))}
            
            <div className="col-span-1 sm:col-span-2 mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-mono text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {t("locations.nationwide", "Saudi Arabia (Nationwide)")}</span>
              <div className="flex gap-6">
                <span>+966 543 966 637</span>
                <span>contact@viso.com.sa</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive Geographic Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[500px] lg:h-[700px] w-full flex items-center justify-center rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-foreground/10"
          >
            <div className="absolute inset-0">
              <Map
                provider={cartoVoyagerProvider}
                dprs={[1, 2]}
                defaultCenter={[24.0, 45.0]} // Center on Saudi Arabia
                defaultZoom={5}
                mouseEvents={true}
                touchEvents={true}
                metaWheelZoom={true} // prevents accidental scrolling
                metaWheelZoomWarning="Use ctrl + scroll to zoom the map"
              >
                <ZoomControl style={{ right: 10, top: 10, left: 'auto', bottom: 'auto' }} buttonStyle={{ background: 'white', color: 'black' }} />
                
                {locations.map((loc) => {
                  const isActive = activeLocation === loc.id;
                  return (
                    <Overlay 
                      key={loc.id} 
                      anchor={loc.coordinates as [number, number]} 
                      offset={[16, 32]} // offset to make the pin point exactly at the coords
                    >
                      <div 
                        className="relative flex flex-col items-center justify-center cursor-pointer group"
                        onMouseEnter={() => setActiveLocation(loc.id)}
                        onMouseLeave={() => setActiveLocation(null)}
                      >
                        {/* Tooltip Label (Always Visible) */}
                        <div className={`absolute bottom-full mb-1 whitespace-nowrap bg-background text-foreground px-3 py-1.5 rounded-md shadow-lg text-xs font-bold transition-all duration-300 pointer-events-none border border-border ${
                          isActive ? "scale-110 shadow-primary/20" : "scale-100 opacity-90"
                        }`}>
                          {t(`locations.cities.${loc.id}.name`, loc.name)}
                          {/* Triangle pointer */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-background" />
                        </div>
                        
                        {/* Interactive Marker Pin (No Circle) */}
                        <div className="relative mt-2">
                          {isActive && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-500/40 rounded-full animate-ping pointer-events-none" />
                          )}
                          <MapPin 
                            className={`w-8 h-8 transition-all duration-300 ${
                              isActive ? "text-red-500 scale-125 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "text-red-600 drop-shadow-md scale-100"
                            }`} 
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>
                    </Overlay>
                  );
                })}
              </Map>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
