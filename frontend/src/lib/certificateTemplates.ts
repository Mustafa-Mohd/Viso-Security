import { parseCertificateId } from "./certificateIds";
import type { TranslationCertificate } from "./certsApi";

export type CertificateTemplateId = "classic" | "trilingual" | "accreditation";

/** Legacy PDF layout through VISO-TR-2026-00985; from 00986 admin may choose new templates. */
export const NEW_TEMPLATE_SERIAL_FROM = 986;
export const NEW_TEMPLATE_YEAR = 2026;

export const VISO_LOGO_URL =
  "https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png";

export const CERTIFICATE_TEMPLATE_OPTIONS: {
  id: CertificateTemplateId;
  label: string;
  description: string;
}[] = [
  {
    id: "classic",
    label: "Template 1 — Classic registry",
    description: "Original simple certificate (auto for IDs before 00986).",
  },
  {
    id: "trilingual",
    label: "Template 2 — Trilingual certification",
    description: "Spanish / English / Arabic certification layout (VISO translation letter).",
  },
  {
    id: "accreditation",
    label: "Template 3 — Accreditation style",
    description: "Bilingual accreditation certificate layout adapted for VISO.",
  },
];

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
  const t = cert.template as CertificateTemplateId | undefined;
  if (t === "trilingual" || t === "accreditation") return t;
  return "trilingual";
}

export function formatCertDisplayDate(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
