import { useEffect, useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

export type MapCity = {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
};

const KSA_CENTER = { lat: 24.2, lng: 44.5 };
const KSA_ZOOM = 5.35;
const CITY_ZOOM = 7.4;

const GOOGLE_MAPS_API_KEY = "AIzaSyAnKzrqHgGAdjZjNSkyr9z1zrnqc89Qnxo";

type Props = {
  cities: MapCity[];
  activeId: string;
  onSelect: (id: string) => void;
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export function LocationsSaudiMap({ cities, activeId, onSelect }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const active = useMemo(
    () => cities.find((c) => c.id === activeId) || cities[0],
    [cities, activeId]
  );

  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!active || !map) return;
    map.panTo({ lat: active.coordinates[0], lng: active.coordinates[1] });
    map.setZoom(CITY_ZOOM);
  }, [active, map]);

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  if (!isLoaded) {
    return <div className="h-full w-full animate-pulse bg-foreground/[0.04]" aria-hidden />;
  }

  return (
    <div className="relative h-full w-full bg-surface">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={KSA_CENTER}
        zoom={KSA_ZOOM}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#7c93a3" }, { lightness: "-10" }]
            },
            {
              featureType: "administrative.country",
              elementType: "geometry",
              stylers: [{ visibility: "on" }]
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [{ color: "#a0a4a5" }]
            },
            {
              featureType: "administrative.province",
              elementType: "geometry.stroke",
              stylers: [{ color: "#a0a4a5" }]
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#a0bacb" }]
            },
            {
              featureType: "landscape.natural.landcover",
              elementType: "geometry.fill",
              stylers: [{ color: "#f2f2f2" }]
            }
          ]
        }}
      >
        {cities.map((city) => {
          const isActive = city.id === activeId;
          return (
            <Marker
              key={city.id}
              position={{ lat: city.coordinates[0], lng: city.coordinates[1] }}
              onClick={() => onSelect(city.id)}
              icon={{
                url: isActive 
                  ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png" 
                  : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            >
              {isActive && (
                <InfoWindow
                  position={{ lat: city.coordinates[0], lng: city.coordinates[1] }}
                  onCloseClick={() => {}}
                >
                  <div className="text-black font-semibold text-xs py-0.5 px-1">{city.name}</div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>

      <button
        type="button"
        onClick={() => {
          if (map) {
            map.panTo(KSA_CENTER);
            map.setZoom(KSA_ZOOM);
          }
        }}
        className="absolute top-3 right-3 z-10 rounded-sm border border-foreground/10 bg-background/90 backdrop-blur px-2.5 py-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-foreground/50 hover:text-primary hover:border-primary/30 transition-colors shadow-sm"
      >
        Reset
      </button>
    </div>
  );
}
