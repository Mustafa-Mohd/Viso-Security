import { supabase } from "./supabase";

export type CertificateBranding = {
  signatureUrl: string;
  digitalStampUrl: string;
  riyadhChamberMembershipId: string;
};

export const DEFAULT_CERTIFICATE_BRANDING: CertificateBranding = {
  signatureUrl: "",
  digitalStampUrl: "",
  riyadhChamberMembershipId: "653561",
};

const CMS_KEY = "translation_certificate_branding";

export function parseCertificateBranding(raw: unknown): CertificateBranding {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    signatureUrl: typeof o.signatureUrl === "string" ? o.signatureUrl : "",
    digitalStampUrl: typeof o.digitalStampUrl === "string" ? o.digitalStampUrl : "",
    riyadhChamberMembershipId:
      typeof o.riyadhChamberMembershipId === "string" && o.riyadhChamberMembershipId.trim()
        ? o.riyadhChamberMembershipId.trim()
        : DEFAULT_CERTIFICATE_BRANDING.riyadhChamberMembershipId,
  };
}

export async function fetchCertificateBranding(): Promise<CertificateBranding> {
  const { data, error } = await supabase
    .from("cms_content")
    .select("content")
    .eq("section_key", CMS_KEY)
    .maybeSingle();

  if (error || !data?.content) return { ...DEFAULT_CERTIFICATE_BRANDING };
  return parseCertificateBranding(data.content);
}

export async function saveCertificateBranding(branding: CertificateBranding): Promise<void> {
  const { error } = await supabase.from("cms_content").upsert(
    {
      section_key: CMS_KEY,
      content: branding,
    },
    { onConflict: "section_key" }
  );
  if (error) throw error;
}

export const RIYADH_CHAMBER_LABELS = {
  es: "N.º de socio de la Cámara de Comercio de Riad",
  en: "Riyadh Chamber Membership ID No.",
  ar: "رقم عضوية غرفة تجارة الرياض",
} as const;
