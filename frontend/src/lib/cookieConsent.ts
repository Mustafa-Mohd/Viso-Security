export const COOKIE_CONSENT_STORAGE_KEY = "viso_cookie_consent_v1";

export type CookieCategory = "necessary" | "analytics" | "marketing";

export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type StoredCookieConsent = {
  version: 1;
  decidedAt: string;
  preferences: CookiePreferences;
};

export const NECESSARY_ONLY: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export const ACCEPT_ALL_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
};

function parseStored(raw: string | null): StoredCookieConsent | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as StoredCookieConsent;
    if (data?.version !== 1 || !data.preferences) return null;
    if (data.preferences.necessary !== true) return null;
    return data;
  } catch {
    return null;
  }
}

export function getStoredCookieConsent(): StoredCookieConsent | null {
  if (typeof window === "undefined") return null;
  return parseStored(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
}

export function hasCookieConsentChoice(): boolean {
  return getStoredCookieConsent() !== null;
}

export function saveCookieConsent(preferences: CookiePreferences): StoredCookieConsent {
  const record: StoredCookieConsent = {
    version: 1,
    decidedAt: new Date().toISOString(),
    preferences: { ...preferences, necessary: true },
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent("viso:cookie-consent", { detail: record.preferences }));
  }
  return record;
}
