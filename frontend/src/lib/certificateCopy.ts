import { supabase } from "./supabase";
import { formatCertDateSlashYmd, formatCertDisplayDate, formatCertLongDateEn } from "./certificateTemplates";
import type { TranslationCertificate } from "./certsApi";
import { localizeCertificateLanguage } from "./certificateDisplay";

export type CertificateCopyOfficial = {
  legalEn1: string;
  legalEn2: string;
  legalEn3: string;
  legalAr1: string;
  legalAr2: string;
  legalAr3: string;
  verifyHeading: string;
  verifyEn: string;
  verifyAr: string;
  closingEn: string;
  closingAr: string;
  officeNameEn: string;
  officeNameAr: string;
  signatoryNameEn: string;
  signatoryNameAr: string;
  signatoryTitleEn: string;
  signatoryTitleAr: string;
  commissionNoteEn: string;
  commissionNoteAr: string;
};

export type CertificateCopyTrilingual = {
  bodyEs: string;
  bodyEn: string;
  bodyAr: string;
  verifyEs: string;
  verifyEn: string;
  verifyAr: string;
};

export type CertificateCopyAccreditation = {
  preambleEn: string;
  preambleAr: string;
  validityEn: string;
  validityAr: string;
};

export type CertificateCopy = {
  official: CertificateCopyOfficial;
  trilingual: CertificateCopyTrilingual;
  accreditation: CertificateCopyAccreditation;
};

const OFFICE_EN = "Vision of Solutions Office for Translation";
const OFFICE_AR = "مكتب رؤية الحلول للترجمة";

export const CERTIFICATE_PLACEHOLDER_HINT =
  "{{clientName}}, {{sourceLang}}, {{targetLang}}, {{sourceLangAr}}, {{targetLangAr}}, {{certId}}, {{issueDate}}, {{issueDateLongEn}}, {{issueDateAr}}, {{expiryDate}}, {{officeNameEn}}, {{officeNameAr}}";

export const DEFAULT_CERTIFICATE_COPY: CertificateCopy = {
  official: {
    legalEn1:
      "{{officeNameEn}} hereby certifies that the accompanying {{sourceLang}} document is a true and accurate translation of the accompanying {{targetLang}} document, and that the translation was prepared by a qualified translator.",
    legalEn2:
      "This certification relates solely to the accuracy of the translation. It does not attest to the authenticity, legality, validity, or content of the original document, and we assume no responsibility for the information contained therein.",
    legalEn3:
      "Accordingly, we hereby certify this translation by our signature and official seal on {{issueDateLongEn}}, in Riyadh, Kingdom of Saudi Arabia.",
    legalAr1:
      "يشهد {{officeNameAr}} بأن المستند المرفق باللغة {{sourceLangAr}} هو ترجمة دقيقة ومطابقة لمعنى المستند المرفق باللغة {{targetLangAr}}، وأن هذه الترجمة قد تم إعدادها بواسطة مترجم مؤهل وكفؤ.",
    legalAr2:
      "يقتصر هذا التصديق على دقة الترجمة ومطابقتها للنص الأصلي، ولا يُعد إقراراً بصحة أو نظامية أو حجية المستند الأصلي أو محتواه، ولا نتحمل أي مسؤولية عن المعلومات الواردة في المستند الأصلي.",
    legalAr3:
      "وعليه، نُصدق ونعتمد هذه الترجمة بتوقيعنا وختمنا بتاريخ {{issueDateAr}} في الرياض، المملكة العربية السعودية.",
    verifyHeading: "VERIFY THIS CERTIFICATION · تحقق من الاعتماد",
    verifyEn:
      "For verification purposes, please scan the certification QR code. This code is valid for up to 3 months.",
    verifyAr:
      "لأغراض التحقق من الاعتماد، يرجى مسح رمز الاستجابة السريعة (QR code)، وتنتهي صلاحية هذا الرمز بعد ثلاثة أشهر من تاريخ الإصدار.",
    closingEn: "Sincerely,",
    closingAr: "أطيب التحيات،",
    officeNameEn: OFFICE_EN,
    officeNameAr: OFFICE_AR,
    signatoryNameEn: "Mohammad BinSadiq",
    signatoryNameAr: "محمد بن صادق",
    signatoryTitleEn: "Authorized Signatory",
    signatoryTitleAr: "المفوض بالتوقيع",
    commissionNoteEn: "Translation Commission license / QR",
    commissionNoteAr: "(paste official copy here)",
  },
  trilingual: {
    bodyEs:
      "Certificamos que la traducción del documento correspondiente a {{clientName}}, de {{sourceLang}} a {{targetLang}}, ha sido realizada por traductores acreditados de {{officeNameEn}}, conforme a los estándares oficiales del Reino de Arabia Saudita.",
    bodyEn:
      "We certify that the translation of the document relating to {{clientName}}, from {{sourceLang}} to {{targetLang}}, has been completed by accredited translators of {{officeNameEn}} in accordance with the official standards of the Kingdom of Saudi Arabia.",
    bodyAr:
      "نشهد بأن الترجمة الخاصة بالوثيقة المتعلقة بـ {{clientName}}، من {{sourceLangAr}} إلى {{targetLangAr}}، قد تمت من قبل مترجمين معتمدين لدى {{officeNameAr}} وفق المعايير الرسمية في المملكة العربية السعودية.",
    verifyEs: "Para verificación, escanee el código QR. Válido hasta {{expiryDate}} (3 meses máx.).",
    verifyEn: "For verification, scan the QR code. Valid through {{expiryDate}} (up to 3 months).",
    verifyAr: "للتحقق، امسح رمز QR. صالح حتى {{expiryDate}} (لمدة 3 أشهر كحد أقصى).",
  },
  accreditation: {
    preambleEn:
      "This certificate is issued in accordance with the accredited translation standards of the Kingdom of Saudi Arabia and confirms that the translation relating to the bearer named below was completed by {{officeNameEn}}.",
    preambleAr:
      "صدرت هذه الشهادة وفق معايير الترجمة المعتمدة في المملكة العربية السعودية وتؤكد إتمام الترجمة لدى {{officeNameAr}} للشخص المذكور أدناه.",
    validityEn: "This certification is valid until: {{expiryDate}}",
    validityAr: "هذه الشهادة صالحة إلى تاريخ: {{expiryDate}}",
  },
};

const CMS_KEY = "translation_certificate_copy";

export type CertificatePlaceholderVars = {
  clientName: string;
  sourceLang: string;
  targetLang: string;
  sourceLangAr: string;
  targetLangAr: string;
  certId: string;
  issueDate: string;
  issueDateLongEn: string;
  issueDateAr: string;
  expiryDate: string;
  officeNameEn: string;
  officeNameAr: string;
};

export function buildCertificatePlaceholderVars(
  cert: Pick<
    TranslationCertificate,
    "project_name" | "source_lang" | "target_lang" | "issue_date" | "expiry_date"
  >,
  certId: string,
  copy: CertificateCopy = DEFAULT_CERTIFICATE_COPY
): CertificatePlaceholderVars {
  return {
    clientName: cert.project_name,
    sourceLang: cert.source_lang,
    targetLang: cert.target_lang,
    sourceLangAr: localizeCertificateLanguage(cert.source_lang, true),
    targetLangAr: localizeCertificateLanguage(cert.target_lang, true),
    certId,
    issueDate: formatCertDisplayDate(cert.issue_date),
    issueDateLongEn: formatCertLongDateEn(cert.issue_date),
    issueDateAr: formatCertDateSlashYmd(cert.issue_date),
    expiryDate: formatCertDisplayDate(cert.expiry_date),
    officeNameEn: copy.official.officeNameEn || OFFICE_EN,
    officeNameAr: copy.official.officeNameAr || OFFICE_AR,
  };
}

export function fillCertificateCopy(text: string, vars: CertificatePlaceholderVars): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const v = vars[key as keyof CertificatePlaceholderVars];
    return v !== undefined && v !== "" ? String(v) : match;
  });
}

function mergeSection<T extends Record<string, string>>(defaults: T, raw: unknown): T {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out = { ...defaults };
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    if (typeof o[key as string] === "string" && (o[key as string] as string).trim()) {
      out[key] = o[key as string] as T[keyof T];
    }
  }
  return out;
}

export function parseCertificateCopy(raw: unknown): CertificateCopy {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    official: mergeSection(DEFAULT_CERTIFICATE_COPY.official, o.official),
    trilingual: mergeSection(DEFAULT_CERTIFICATE_COPY.trilingual, o.trilingual),
    accreditation: mergeSection(DEFAULT_CERTIFICATE_COPY.accreditation, o.accreditation),
  };
}

export async function fetchCertificateCopy(): Promise<CertificateCopy> {
  const { data, error } = await supabase
    .from("cms_content")
    .select("content")
    .eq("section_key", CMS_KEY)
    .maybeSingle();

  if (error || !data?.content) return structuredClone(DEFAULT_CERTIFICATE_COPY);
  return parseCertificateCopy(data.content);
}

export async function saveCertificateCopy(copy: CertificateCopy): Promise<void> {
  const { error } = await supabase.from("cms_content").upsert(
    { section_key: CMS_KEY, content: copy },
    { onConflict: "section_key" }
  );
  if (error) throw error;
}

export const CERTIFICATE_PREVIEW_SAMPLE: TranslationCertificate = {
  id: "VISO-TR-2026-00986",
  national_id: "123456789012",
  project_name: "Sample Client, Daughter of Parent Name",
  source_lang: "Arabic",
  target_lang: "English",
  issue_date: "2026-02-01",
  expiry_date: "2026-05-01",
  status: "VALID",
  template: "official",
};
