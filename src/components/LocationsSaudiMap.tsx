import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Overlay } from "pigeon-maps";

export type MapCity = {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
};

/** Light, quiet basemap */
const lightProvider = (x: number, y: number, z: number, dpr?: number) =>
  `https://basemaps.cartocdn.com/light_all/${z}/${x}/${y}${dpr && dpr >= 2 ? "@2x" : ""}.png`;

const KSA_CENTER: [number, number] = [24.2, 44.5];
const KSA_ZOOM = 5.35;
const CITY_ZOOM = 7.4;

type Props = {
  cities: MapCity[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function LocationsSaudiMap({ cities, activeId, onSelect }: Props) {
  const active = useMemo(
    () => cities.find((c) => c.id === activeId) || cities[0],
    [cities, activeId]
  );

  const [center, setCenter] = useState<[number, number]>(KSA_CENTER);
  const [zoom, setZoom] = useState(KSA_ZOOM);

  useEffect(() => {
    if (!active) return;
    setCenter(active.coordinates);
    setZoom(CITY_ZOOM);
  }, [active]);

  return (
    <div className="relative h-full w-full bg-surface">
      <Map
        provider={lightProvider}
        dprs={[1, 2]}
        center={center}
        zoom={zoom}
        onBoundsChanged={({ center: c, zoom: z }) => {
          setCenter(c as [number, number]);
          setZoom(z);
        }}
        animate
        mouseEvents
        touchEvents
        metaWheelZoom
        metaWheelZoomWarning="Use ctrl + scroll to zoom"
        attribution={false}
      >
        {cities.map((city) => {
          const isActive = city.id === activeId;
          return (
            <Overlay key={city.id} anchor={city.coordinates} offset={[14, 34]}>
              <button
                type="button"
                onMouseEnter={() => onSelect(city.id)}
                onClick={() => onSelect(city.id)}
                className="relative flex flex-col items-center outline-none"
                aria-label={city.name}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      className="absolute bottom-full mb-1.5 whitespace-nowrap rounded-sm bg-foreground px-2.5 py-1 text-[10px] font-semibold tracking-wide text-background shadow-md"
                    >
                      {city.name}
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.span
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative block"
                >
                  {isActive && (
                    <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 animate-ping" />
                  )}
                  <svg
                    width="28"
                    height="36"
                    viewBox="0 0 24 36"
                    className="drop-shadow-sm relative z-10"
                  >
                    <path
                      d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"
                      fill={isActive ? "#D4AF37" : "#1F1E1C"}
                    />
                    <circle cx="12" cy="12" r="4.5" fill="var(--background)" />
                  </svg>
                </motion.span>
              </button>
            </Overlay>
          );
        })}
      </Map>

      <div className="absolute top-3 left-3 z-10 rounded-sm border border-foreground/10 bg-background/90 backdrop-blur px-3 py-1.5">
        <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-foreground/40">
          Coverage
        </p>
        <p className="font-display text-xs tracking-tight text-foreground">
          {active?.name}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setCenter(KSA_CENTER);
          setZoom(KSA_ZOOM);
        }}
        className="absolute top-3 right-3 z-10 rounded-sm border border-foreground/10 bg-background/90 backdrop-blur px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-foreground/50 hover:text-primary hover:border-primary/30 transition-colors"
      >
        Reset
      </button>

      <div className="absolute bottom-3 left-3 z-10 font-mono text-[9px] tracking-[0.2em] uppercase text-foreground/40 bg-background/80 backdrop-blur px-2 py-1 rounded-sm border border-foreground/8">
        Kingdom of Saudi Arabia
      </div>
    </div>
  );
}
