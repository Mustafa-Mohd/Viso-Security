import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import worldMap from "../data/world-atlas.json";

export type MapCity = {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
};

type Props = {
  cities: MapCity[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function LocationsSaudiMap({ cities, activeId, onSelect }: Props) {
  return (
    <div className="relative h-full w-full bg-transparent flex items-center justify-center overflow-visible">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1800,
          center: [45, 24]
        }}
        className="w-[120%] h-[120%] md:w-full md:h-full"
      >
        <defs>
          <filter id="outline-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.85" result="shadow" />
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#D4AF37" floodOpacity="0.5" result="glow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <Geographies geography={worldMap as any}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties?.name === "Saudi Arabia")
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth={2.5}
                  style={{
                    default: { outline: "none", filter: "url(#outline-glow)" },
                    hover: { fill: "rgba(255,255,255,0.05)", outline: "none", filter: "url(#outline-glow)" },
                    pressed: { outline: "none", filter: "url(#outline-glow)" },
                  } as any}
                />
              ))
          }
        </Geographies>

        {cities.map((city) => {
          const isActive = city.id === activeId;
          const coord: [number, number] = [city.coordinates[1], city.coordinates[0]];
          
          return (
            <Marker
              key={city.id}
              coordinates={coord}
              onMouseEnter={() => onSelect(city.id)}
              onClick={() => onSelect(city.id)}
              style={{
                default: { outline: "none", cursor: "pointer" },
                hover: { outline: "none", cursor: "pointer" },
                pressed: { outline: "none", cursor: "pointer" },
              } as any}
            >
              <motion.g
                animate={{
                  scale: isActive ? 2.0 : 1.2,
                  y: isActive ? -8 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="#dc2626"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  transform="translate(-12, -22)"
                />
                
                {city.id === "riyadh" && (
                  <image
                    href="https://cdn-icons-png.flaticon.com/128/1465/1465405.png"
                    x="-16"
                    y="4"
                    width="32"
                    height="32"
                  />
                )}
              </motion.g>
              
              <AnimatePresence>
                {isActive && (
                  <motion.text
                    initial={{ opacity: 0, y: -56 }}
                    animate={{ opacity: 1, y: -72 }}
                    exit={{ opacity: 0, y: -56 }}
                    textAnchor="middle"
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "18px",
                      fontWeight: "bold",
                      fill: "#ffffff",
                    }}
                    className="pointer-events-none drop-shadow-lg"
                  >
                    {city.name}
                  </motion.text>
                )}
              </AnimatePresence>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
