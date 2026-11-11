export type OfficeLocation = {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number];
  blurb: string;
  bgImage: string;
};

export type LocationsCmsCity = {
  id: string;
  name?: string;
  coordinates?: [number, number];
  blurb?: string;
  bgImage?: string;
};

export type LocationsCmsContent = {
  title?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_ar?: string;
  cities?: LocationsCmsCity[];
};

const TABUK_BG =
  "https://img.magnific.com/free-vector/town-desert-nature-landscape-scene_1308-51267.jpg?semt=ais_hybrid&w=740&q=80";

export const DEFAULT_OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    id: "riyadh",
    name: "Riyadh",
    region: "Main Headquarters",
    coordinates: [24.7136, 46.6753],
    blurb: "Headquarters & national operations hub.",
    bgImage:
      "https://res.cloudinary.com/dppwnds6z/image/upload/v1790668720/ChatGPT_Image_Sep_29_2026_01_27_25_PM.png",
  },
  {
    id: "khobar",
    name: "Khobar",
    region: "Regional Presence",
    coordinates: [26.2172, 50.1971],
    blurb: "Eastern Province operations.",
    bgImage:
      "https://res.cloudinary.com/dppwnds6z/image/upload/v1790761271/ChatGPT_Image_Sep_30_2026_03_10_59_PM.png",
  },
  {
    id: "jubail",
    name: "Jubail",
    region: "Regional Presence",
    coordinates: [27.0112, 49.661],
    blurb: "Industrial & petrochemical security programs.",
    bgImage:
      "https://i.vimeocdn.com/video/2099272543-c3cc6657da44aea5870525710e085cc6c97b501e7baed679991b0c2c1da4fc6d-d?f=webp",
  },
  {
    id: "yanbu",
    name: "Yanbu",
    region: "Regional Presence",
    coordinates: [24.0232, 38.0638],
    blurb: "Red Sea industrial facility coverage.",
    bgImage: "https://www.eritrea-focus.org/wp-content/uploads/2026/07/download.webp",
  },
  {
    id: "jeddah",
    name: "Jeddah",
    region: "Regional Presence",
    coordinates: [21.4858, 39.1925],
    blurb: "Gateway to western coastal projects.",
    bgImage:
      "https://res.cloudinary.com/dppwnds6z/image/upload/v1790761414/ChatGPT_Image_Sep_30_2026_03_13_20_PM.png",
  },
  {
    id: "tabuk",
    name: "Tabuk",
    region: "Regional Presence",
    coordinates: [28.3838, 36.571],
    blurb: "KSA-wide northern region project delivery.",
    bgImage: TABUK_BG,
  },
];

function resolveCityBlurb(cityId: string, cmsBlurb: string | undefined, defaultBlurb: string): string {
  const trimmed = cmsBlurb?.trim();
  if (cityId === "tabuk" && trimmed && /^nationwide$/i.test(trimmed)) {
    return defaultBlurb;
  }
  return trimmed || defaultBlurb;
}

function toCoordPair(value: unknown, fallback: [number, number]): [number, number] {
  if (Array.isArray(value) && value.length >= 2) {
    const lat = Number(value[0]);
    const lng = Number(value[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
  }
  return fallback;
}

export function getDefaultLocationsCmsContent(): Required<Pick<LocationsCmsContent, "title" | "subtitle">> & {
  cities: LocationsCmsCity[];
} {
  return {
    title: "OUR LOCATION",
    subtitle: "Serving Saudi Arabia and Surroundings",
    cities: DEFAULT_OFFICE_LOCATIONS.map(({ id, name, coordinates, blurb, bgImage }) => ({
      id,
      name,
      coordinates,
      blurb,
      bgImage,
    })),
  };
}

/** Merge saved CMS rows with built-in offices (e.g. add Tabuk to older saves). */
export function normalizeLocationsCmsContent(content: LocationsCmsContent | null | undefined): LocationsCmsContent {
  const base = content || {};
  const cmsById = new Map<string, LocationsCmsCity>();
  for (const city of base.cities ?? []) {
    if (city?.id) cmsById.set(city.id, { ...city });
  }

  for (const def of DEFAULT_OFFICE_LOCATIONS) {
    const existing = cmsById.get(def.id);
    cmsById.set(def.id, {
      id: def.id,
      name: existing?.name || def.name,
      coordinates: toCoordPair(existing?.coordinates, def.coordinates),
      blurb: resolveCityBlurb(def.id, existing?.blurb, def.blurb),
      bgImage: existing?.bgImage || def.bgImage,
    });
  }

  const defaultIds = new Set(DEFAULT_OFFICE_LOCATIONS.map((d) => d.id));
  const ordered: LocationsCmsCity[] = DEFAULT_OFFICE_LOCATIONS.map((d) => cmsById.get(d.id)!);
  for (const [id, city] of cmsById) {
    if (!defaultIds.has(id)) ordered.push(city);
  }

  return {
    title: base.title ?? "OUR LOCATION",
    title_ar: base.title_ar,
    subtitle: base.subtitle ?? "Serving Saudi Arabia and Surroundings",
    subtitle_ar: base.subtitle_ar,
    cities: ordered,
  };
}

export function resolveOfficeLocations(data?: LocationsCmsContent | null): OfficeLocation[] {
  const cmsCities = data?.cities ?? [];
  const cmsById = new Map(cmsCities.filter((c) => c?.id).map((c) => [c.id, c]));
  const result: OfficeLocation[] = [];
  const seen = new Set<string>();

  for (const def of DEFAULT_OFFICE_LOCATIONS) {
    const cms = cmsById.get(def.id);
    result.push({
      ...def,
      name: cms?.name?.trim() || def.name,
      blurb: resolveCityBlurb(def.id, cms?.blurb, def.blurb),
      bgImage: cms?.bgImage?.trim() || def.bgImage,
      coordinates: cms?.coordinates ? toCoordPair(cms.coordinates, def.coordinates) : def.coordinates,
    });
    seen.add(def.id);
  }

  for (const cms of cmsCities) {
    if (!cms.id || seen.has(cms.id)) continue;
    const name = cms.name?.trim();
    if (!name) continue;
    const coordinates = cms.coordinates ? toCoordPair(cms.coordinates, [0, 0]) : null;
    if (!coordinates || (coordinates[0] === 0 && coordinates[1] === 0)) continue;
    result.push({
      id: cms.id,
      name,
      region: "Regional Presence",
      coordinates,
      blurb: cms.blurb?.trim() || "",
      bgImage: cms.bgImage?.trim() || "",
    });
    seen.add(cms.id);
  }

  return result;
}

export function emptyLocationsCmsCity(): LocationsCmsCity {
  return {
    id: "",
    name: "",
    coordinates: [24.7, 46.7],
    blurb: "",
    bgImage: "",
  };
}
