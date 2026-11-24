import { parseCertificateId } from "./certificateIds";
import type { TranslationCertificate } from "./certsApi";

export type CertificateTemplateId =
  | "classic"
  | "official"
  | "official_trilingual"
  | "official_panorama"
  | "official_horizon";

/** Retired layouts still stored on some rows — resolved to `official` when rendering. */
export type CertificateTemplateStorage = CertificateTemplateId | "trilingual" | "accreditation";

/** Legacy PDF layout through VISO-TR-2026-00985; from 00986 admin may choose new templates. */
export const NEW_TEMPLATE_SERIAL_FROM = 986;
export const NEW_TEMPLATE_YEAR = 2026;

export const VISO_LOGO_URL =
  "https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png";

/** Header artwork from Viso_Certificate_of_Translation.docx */
export const VISO_OFFICIAL_DOC_LOGO_EN = "/images/certificates/viso-doc-logo-en.png";
/** Center VISO mark from Viso_Certificate_of_Translation.docx (stored as viso-doc-logo-ar.png). */
export const VISO_OFFICIAL_DOC_LOGO_MARK = "/images/certificates/viso-doc-logo-ar.png";
/** Right header — Arabic title + gold rule + tagline artwork */
export const VISO_OFFICIAL_DOC_LOGO_AR_TEXT = "/images/certificates/viso-doc-logo-ar-text.png";

/** Literature, Publishing & Translation Commission — local copy preferred; Wikimedia fallback */
export const SAUDI_TRANSLATION_COMMISSION_LOGO =
  "/images/certificates/saudi-translation-commission-logo.png";
export const SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Saudi_Literature%2C_Publishing%2C_and_Translation_Commission_Logo.svg/500px-Saudi_Literature%2C_Publishing%2C_and_Translation_Commission_Logo.svg.png";

export const CERTIFICATE_TEMPLATE_OPTIONS: {
  id: CertificateTemplateId;
  label: string;
  description: string;
}[] = [
  {
    id: "classic",
    label: "Simple — Certificate of Translation",
    description: "Original registry layout with logo, client grid, QR, and signature (your classic PDF).",
  },
  {
    id: "official",
    label: "Official — bilingual certification",
    description: "Formal bilingual certification layout matching the VISO Word template.",
  },
  {
    id: "official_trilingual",
    label: "Official — trilingual (EN · AR · 3rd language)",
    description:
      "Same official layout with a third legal column in the certificate target language (Hindi, French, Spanish, etc.).",
  },
  {
    id: "official_panorama",
    label: "Official — Panorama (landscape · 3 languages)",
    description:
      "Horizontal A4 layout with EN · AR · third legal columns; VISO mark and official verify footer (per Three_languages reference).",
  },
  {
    id: "official_horizon",
    label: "Official — Horizon (landscape registry)",
    description:
      "Professional landscape registry layout: full-height sidebar, three statement cards, commission logo, and electronic authentication.",
  },
];

export function normalizeCertificateTemplateParam(value: string | undefined | null): CertificateTemplateId {
  if (
    value === "classic" ||
    value === "official" ||
    value === "official_trilingual" ||
    value === "official_panorama" ||
    value === "official_horizon"
  ) {
    return value;
  }
  if (value === "trilingual") return "official_trilingual";
  return "official";
}

export function certificateUsesLegacyTemplate(certId: string): boolean {
  const parsed = parseCertificateId(certId);
  if (!parsed) return true;
  if (parsed.year < NEW_TEMPLATE_YEAR) return true;
  if (parsed.year === NEW_TEMPLATE_YEAR && parsed.serial < NEW_TEMPLATE_SERIAL_FROM) return true;
  return false;
}

export function resolveCertificateTemplate(
  cert: Pick<TranslationCertificate, "id" | "template">
): CertificateTemplateId {
  if (certificateUsesLegacyTemplate(cert.id)) return "classic";
  const t = cert.template as CertificateTemplateStorage | undefined;
  if (
    t === "classic" ||
    t === "official" ||
    t === "official_trilingual" ||
    t === "official_panorama" ||
    t === "official_horizon"
  ) {
    return t;
  }
  if (t === "trilingual") return "official_trilingual";
  if (t === "accreditation") return "official";
  return "official";
}

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function formatCertLongDateEn(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!y || m < 1 || m > 12 || !d) return isoDate;
  return `${MONTHS_EN[m - 1]} ${String(d).padStart(2, "0")}, ${y}`;
}

export function formatCertDateSlashYmd(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  return `${parts[0]}/${parts[1]}/${parts[2]}`;
}

export function formatCertDisplayDate(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/** ISO 216 A4 — official certificate page (screen preview + print). */
export const CERTIFICATE_A4_WIDTH = "210mm";
export const CERTIFICATE_A4_HEIGHT = "297mm";
export const CERTIFICATE_A4_PAGE_CLASS =
  "certificate-a4-page w-[210mm] min-w-[210mm] shrink-0 min-h-[297mm] box-border";

/** ISO 216 A4 landscape — Panorama certificate */
export const CERTIFICATE_A4_LANDSCAPE_PAGE_CLASS =
  "certificate-a4-landscape-page w-[297mm] min-w-[297mm] shrink-0 min-h-[210mm] max-h-[210mm] box-border";
