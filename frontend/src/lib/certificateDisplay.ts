import { parseCertificateClientName } from "./certificateClientName";

const LANGUAGE_LABELS_AR: Record<string, string> = {
  Arabic: "العربية",
  English: "الإنجليزية",
  French: "الفرنسية",
  German: "الألمانية",
  Spanish: "الإسبانية",
};

export function localizeCertificateLanguage(lang: string, isAr: boolean): string {
  if (!isAr) return lang;
  return LANGUAGE_LABELS_AR[lang] ?? lang;
}

/** Display client line on public UI (Arabic relation labels when site is Arabic). */
export function formatCertificateProjectNameForDisplay(projectName: string, isAr: boolean): string {
  const parsed = parseCertificateClientName(projectName);
  if (!parsed.clientName) return projectName;
  if (!isAr || parsed.relation === "none" || !parsed.parentName) {
    return parsed.relation === "none" ? parsed.clientName : projectName;
  }
  const label = parsed.relation === "son" ? "ابن" : "ابنة";
  return `${parsed.clientName}، ${label} ${parsed.parentName}`;
}

export function containsArabicScript(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export function textDirectionForContent(text: string): "rtl" | "ltr" | "auto" {
  if (containsArabicScript(text)) return "rtl";
  return "auto";
}

export function formatCertDateForLocale(isoDate: string, isAr: boolean): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const [y, m, d] = parts;
  if (isAr) return `${d}/${m}/${y}`;
  return `${d}/${m}/${y}`;
}
