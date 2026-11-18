import { parseCertificateId } from "./certificateIds";
import type { TranslationCertificate } from "./certsApi";

export type CertificateTemplateId = "classic" | "official";

/** Retired layouts still stored on some rows — resolved to `official` when rendering. */
export type CertificateTemplateStorage = CertificateTemplateId | "trilingual" | "accreditation";

/** Legacy PDF layout through VISO-TR-2026-00985; from 00986 admin may choose new templates. */
export const NEW_TEMPLATE_SERIAL_FROM = 986;
export const NEW_TEMPLATE_YEAR = 2026;

export const VISO_LOGO_URL =
  "https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png";

/** Header artwork from Viso_Certificate_of_Translation.docx */
export const VISO_OFFICIAL_DOC_LOGO_EN = "/images/certificates/viso-doc-logo-en.png";
export const VISO_OFFICIAL_DOC_LOGO_AR = "/images/certificates/viso-doc-logo-ar.png";

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
];

export function normalizeCertificateTemplateParam(value: string | undefined | null): CertificateTemplateId {
  if (value === "classic" || value === "official") return value;
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
  if (t === "classic" || t === "official") return t;
  if (t === "trilingual" || t === "accreditation") return "official";
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
