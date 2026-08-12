import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

export type AppLang = "en" | "ar";

const LANG_KEY = "viso_lang";
const LANG_CHOSEN_KEY = "viso_lang_chosen";

export function getStoredLang(): AppLang | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(LANG_KEY);
  return v === "ar" || v === "en" ? v : null;
}

export function hasChosenLang(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(LANG_CHOSEN_KEY) === "1";
}

export function applyDocumentLang(lang: AppLang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

export function setAppLanguage(lang: AppLang, persistChoice = true) {
  i18n.changeLanguage(lang);
  applyDocumentLang(lang);
  if (typeof window !== "undefined") {
    localStorage.setItem(LANG_KEY, lang);
    if (persistChoice) localStorage.setItem(LANG_CHOSEN_KEY, "1");
  }
}

const saved = typeof window !== "undefined" ? getStoredLang() : null;
const initialLng: AppLang = saved || "en";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: "en",
  supportedLngs: ["en", "ar"],
  interpolation: { escapeValue: false },
});

applyDocumentLang(initialLng);

export default i18n;
