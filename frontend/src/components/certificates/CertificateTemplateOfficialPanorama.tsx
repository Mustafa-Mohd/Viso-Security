import type { ReactNode } from "react";
import { useState } from "react";
import type { CertificateViewProps } from "@/components/certificates/CertificateDocument";
import {
  buildCertificatePlaceholderVars,
  fillCertificateCopy,
} from "@/lib/certificateCopy";
import {
  CERTIFICATE_A4_LANDSCAPE_PAGE_CLASS,
  VISO_OFFICIAL_DOC_LOGO_EN,
  VISO_OFFICIAL_DOC_LOGO_MARK,
  SAUDI_TRANSLATION_COMMISSION_LOGO,
  SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK,
  formatCertDisplayDate,
} from "@/lib/certificateTemplates";
import {
  certificateShowsClientCr,
  localizeCertificateLanguage,
  resolveClassicClientNameAr,
  textDirectionForContent,
} from "@/lib/certificateDisplay";
import {
  buildThirdLanguageLegalBlock,
  buildThirdLanguageVerifyLine,
  resolveTrilingualThirdLanguageName,
} from "@/lib/certificateOfficialThirdLegal";
import { getPublicSiteOrigin } from "@/lib/certificateIds";
import { CertificateOfficialViewport } from "@/components/certificates/CertificateOfficialViewport";
import {
  CERTIFICATE_LANDSCAPE_PRINT_CSS,
  CERTIFICATE_SIGNATURE_SCREEN_CSS,
} from "@/components/certificates/certificatePrintStyles";
import {
  OFFICIAL_CERT_GOLD as GOLD,
  OFFICIAL_CERT_NAVY as NAVY,
  ElectronicAuthenticationBadge,
} from "@/components/certificates/officialCertificateAttestation";

const CREAM = "#F1ECE0";
const BORDER = "#DDD5BF";

function formatPanoramaDate(iso: string): string {
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
}

function SidebarField({
  labelEn,
  labelAr,
  children,
}: {
  labelEn: string;
  labelAr: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[#D5CEC0] last:border-b-0">
      <div className="px-3 pt-2.5 pb-1 text-center">
        <p
          className="text-[7.5px] font-bold text-neutral-900 uppercase leading-tight"
          style={{ letterSpacing: "0.2em" }}
        >
          {labelEn}
        </p>
        <p className="text-[7.5px] font-bold text-neutral-800 font-arabic leading-tight" dir="rtl">
          {labelAr}
        </p>
      </div>
      <div className="px-3 pb-2.5 pt-1 text-center text-[10.5px] font-bold text-neutral-900 leading-snug min-h-[32px] flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

const SIGNATURE_SCRIPT_FONT =
  '"Segoe Script", "Great Vibes", "Brush Script MT", "Snell Roundhand", cursive';

function formatSignatoryScriptName(name: string): string {
  return name.trim().replace(/\s+/g, " ").replace(/Bin([A-Z])/i, "Bin $1");
}

function PanoramaSignatoryCell({
  closingEn,
  officeNameEn,
  signatoryName,
  signatoryTitle,
  signatureUrl,
}: {
  closingEn: string;
  officeNameEn: string;
  signatoryName: string;
  signatoryTitle: string;
  signatureUrl?: string | null;
}) {
  return (
    <div
      className="border-2 px-3 py-2.5 flex flex-col justify-between min-h-[96px] bg-white"
      style={{ borderColor: GOLD }}
    >
      <div>
        <p className="text-[10px] font-bold leading-tight" style={{ color: NAVY }}>
          {closingEn}
        </p>
        <p className="text-[9.5px] font-bold text-neutral-800 mt-1 leading-snug">{officeNameEn}</p>
      </div>
      <div className="mt-3 pt-2 border-t border-[#E8E4DA]">
        {signatureUrl ? (
          <img src={signatureUrl} alt="" className="h-[20px] w-auto object-contain object-left mb-1" />
        ) : (
          <p
            className="cert-signature-script text-[14px] leading-none text-neutral-900 mb-1"
            style={{ fontFamily: SIGNATURE_SCRIPT_FONT, fontWeight: 400 }}
          >
            {formatSignatoryScriptName(signatoryName)}
          </p>
        )}
        <p className="text-[8px] font-semibold text-neutral-500 uppercase tracking-wide">{signatoryTitle}</p>
      </div>
    </div>
  );
}

function PanoramaCommissionLogo() {
  const [src, setSrc] = useState(SAUDI_TRANSLATION_COMMISSION_LOGO);
  return (
    <img
      src={src}
      alt="Literature, Publishing & Translation Commission"
      className="cert-print-commission max-h-[72px] w-auto max-w-full object-contain"
      onError={() => {
        if (src !== SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK) {
          setSrc(SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK);
        }
      }}
    />
  );
}

/** Landscape A4 — matches Three_languages reference layout (sidebar + 3 legal columns). */
export function CertificateTemplateOfficialPanorama(props: CertificateViewProps) {
  const { cert, certId, qrUrl, branding, bannerLabel, copy } = props;
  const refDate = formatPanoramaDate(formatCertDisplayDate(cert.issue_date));
  const clientEn = cert.project_name;
  const clientAr = resolveClassicClientNameAr(cert.project_name, cert.project_name_ar);
  const srcEn = cert.source_lang;
  const tgtEn = cert.target_lang;
  const srcAr = localizeCertificateLanguage(cert.source_lang, true);
  const tgtAr = localizeCertificateLanguage(cert.target_lang, true);
  const origin = getPublicSiteOrigin();
  const vars = buildCertificatePlaceholderVars(cert, certId, copy);
  const o = copy.official;
  const legalEn1 = fillCertificateCopy(o.legalEn1, vars);
  const legalEn2 = fillCertificateCopy(o.legalEn2, vars);
  const legalEn3 = fillCertificateCopy(o.legalEn3, vars);
  const legalAr1 = fillCertificateCopy(o.legalAr1, vars);
  const legalAr2 = fillCertificateCopy(o.legalAr2, vars);
  const legalAr3 = fillCertificateCopy(o.legalAr3, vars);
  const thirdLangName = resolveTrilingualThirdLanguageName(cert.source_lang, cert.target_lang);
  const thirdBlock = buildThirdLanguageLegalBlock(thirdLangName, vars);
  const thirdVerify = buildThirdLanguageVerifyLine(thirdLangName, vars);

  return (
    <>
      <style>
        {CERTIFICATE_SIGNATURE_SCREEN_CSS}
        {CERTIFICATE_LANDSCAPE_PRINT_CSS}
      </style>
      <CertificateOfficialViewport>
        <div
          className={`bg-white ${CERTIFICATE_A4_LANDSCAPE_PAGE_CLASS} shadow-2xl mx-auto text-neutral-900 print:shadow-none overflow-hidden flex flex-col cert-panorama-page`}
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {bannerLabel ? (
            <div className="bg-amber-600 text-white text-center text-[10px] font-bold py-1.5 px-3 print:hidden">
              {bannerLabel}
            </div>
          ) : null}

          {/* Full-height sidebar (top→bottom) + main column */}
          <div className="cert-panorama-main flex-1 min-h-0 grid grid-cols-[minmax(200px,26%)_1fr] gap-0">
            <aside
              className="cert-panorama-sidebar flex flex-col h-full min-h-0 border-r border-[#D5CEC0]"
              style={{ backgroundColor: CREAM }}
            >
              <div className="bg-white px-3 py-3 border-b border-[#D5CEC0]">
                <img
                  src={VISO_OFFICIAL_DOC_LOGO_EN}
                  alt="Vision of Solutions — Translation Services"
                  className="h-[52px] w-full object-contain object-center"
                />
              </div>
              <SidebarField labelEn="Ref. No" labelAr="رقم المرجع">
                <span className="font-mono text-[9.5px] break-all leading-tight">{certId}</span>
              </SidebarField>
              <SidebarField labelEn="Date" labelAr="التاريخ">
                <span dir="ltr">{refDate}</span>
              </SidebarField>
              <SidebarField labelEn="Chamber Membership" labelAr="عضوية الغرفة التجارية">
                <span className="font-mono">{branding.riyadhChamberMembershipId}</span>
              </SidebarField>
              <SidebarField labelEn="Client" labelAr="العميل">
                <span dir={textDirectionForContent(clientEn)}>{clientEn}</span>
                <span dir="rtl" className="font-arabic font-semibold text-[9.5px] mt-0.5">
                  {clientAr}
                </span>
              </SidebarField>
              {certificateShowsClientCr(cert) ? (
                <SidebarField labelEn="CR No." labelAr="رقم السجل التجاري">
                  <span className="font-mono text-[9px]">{cert.client_cr_number}</span>
                </SidebarField>
              ) : null}
              <SidebarField labelEn="From · Source" labelAr="من · اللغة المصدر">
                <div className="w-full grid grid-cols-2 gap-1.5 text-[10px]">
                  <span className="font-semibold">{srcEn}</span>
                  <span dir="rtl" className="font-arabic font-semibold">
                    {srcAr}
                  </span>
                </div>
                <div className="w-full mt-2 pt-2 border-t border-[#D5CEC0]">
                  <p className="text-[7px] font-bold uppercase mb-0.5" style={{ letterSpacing: "0.16em" }}>
                    To · Target
                  </p>
                  <p className="text-[7px] font-bold font-arabic mb-1" dir="rtl">
                    إلى · اللغة الهدف
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <span className="font-semibold">{tgtEn}</span>
                    <span dir="rtl" className="font-arabic font-semibold">
                      {tgtAr}
                    </span>
                  </div>
                </div>
              </SidebarField>
              <div className="mt-auto p-3">
                <div
                  className="cert-print-qr border-2 p-2.5 flex flex-col items-center justify-center gap-1 bg-white"
                  style={{ borderColor: GOLD }}
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=92x92&data=${encodeURIComponent(qrUrl)}`}
                    alt="Certificate verification QR"
                    className="w-[80px] h-[80px]"
                  />
                  <p className="text-[7.5px] font-bold text-center uppercase tracking-wide" style={{ color: NAVY }}>
                    Scan to verify
                  </p>
                </div>
              </div>
            </aside>

            <div className="flex flex-col min-h-0 min-w-0">
              {/* Main header — title center, VISO mark top-right */}
              <div className="cert-panorama-header relative px-4 pt-2.5 pb-2 shrink-0">
                <img
                  src={VISO_OFFICIAL_DOC_LOGO_MARK}
                  alt="VISO"
                  className="absolute right-4 top-2 h-[44px] w-auto object-contain"
                />
                <div className="text-center pr-[72px] pl-2">
                  <h1
                    className="text-[15px] font-bold tracking-[0.03em] leading-tight"
                    style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif", color: NAVY }}
                  >
                    Certificate of Translation Accuracy
                  </h1>
                  <p className="text-[12px] font-bold mt-0.5 font-arabic leading-tight" style={{ color: GOLD }} dir="rtl">
                    شهادة دقة ترجمة الوثائق
                  </p>
                </div>
              </div>
              <div className="mx-4 border-b-[2px] shrink-0" style={{ borderColor: GOLD }} />

              {/* Three certification columns */}
              <div className="cert-print-legal cert-print-legal-tri cert-panorama-legal flex-1 min-h-0 grid grid-cols-[1fr_3px_1fr_3px_1fr] items-stretch px-3 py-2.5">
                <div
                  className="cert-print-legal-col px-3 py-2 text-[9.5px] leading-[1.5] text-justify"
                  style={{ backgroundColor: CREAM }}
                >
                  <p
                    className="text-[8.5px] font-bold uppercase tracking-[0.08em] text-center mb-2.5 pb-1 border-b"
                    style={{ borderColor: BORDER }}
                  >
                    English Certification
                  </p>
                  <div className="space-y-3">
                    <p>{legalEn1}</p>
                    <p>{legalEn2}</p>
                    <p>{legalEn3}</p>
                  </div>
                </div>
                <div className="w-[3px] self-stretch shrink-0" style={{ backgroundColor: GOLD }} aria-hidden />
                <div
                  className="cert-print-legal-col px-3 py-2 text-[9.5px] leading-[1.55] text-justify"
                  style={{ backgroundColor: CREAM }}
                  dir="rtl"
                >
                  <p
                    className="text-[8.5px] font-bold font-arabic text-center mb-2.5 pb-1 border-b"
                    style={{ borderColor: BORDER }}
                  >
                    العربية شهادة
                  </p>
                  <div className="space-y-3 font-arabic">
                    <p>{legalAr1}</p>
                    <p>{legalAr2}</p>
                    <p>{legalAr3}</p>
                  </div>
                </div>
                <div className="w-[3px] self-stretch shrink-0" style={{ backgroundColor: GOLD }} aria-hidden />
                <div
                  className={`cert-print-legal-col px-3 py-2 text-[9.5px] leading-[1.5] text-justify ${thirdBlock.fontClass ?? ""}`}
                  style={{ backgroundColor: CREAM }}
                  dir={thirdBlock.dir ?? "ltr"}
                >
                  <p
                    className="text-[8.5px] font-bold text-center mb-2.5 pb-1 border-b"
                    style={{ borderColor: BORDER }}
                  >
                    {thirdBlock.heading}
                  </p>
                  <p>{thirdBlock.body}</p>
                </div>
              </div>

              <div className="mx-4 border-t-[2px] shrink-0" style={{ borderColor: GOLD }} />

              {/* Sincerely row — directly under legal paragraphs */}
              <div className="cert-print-footer shrink-0 px-4 py-2.5 grid grid-cols-3 gap-2.5">
                <PanoramaSignatoryCell
                  closingEn={o.closingEn}
                  officeNameEn={o.officeNameEn}
                  signatoryName={o.signatoryNameEn}
                  signatoryTitle={o.signatoryTitleEn}
                  signatureUrl={branding.signatureUrl}
                />
                <div
                  className="border-2 px-2 py-2 flex items-center justify-center bg-white"
                  style={{ borderColor: GOLD }}
                >
                  <PanoramaCommissionLogo />
                </div>
                <div
                  className="border-2 px-3 py-2.5 flex flex-col justify-center bg-white"
                  style={{ borderColor: GOLD }}
                >
                  <ElectronicAuthenticationBadge
                    heading={o.electronicAuthHeadingEn}
                    body={o.electronicAuthBodyEn}
                  />
                </div>
              </div>

              <div className="mx-4 border-t shrink-0" style={{ borderColor: NAVY }} />

              {/* Verify footer */}
              <div className="shrink-0 px-4 py-2 mb-3">
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-[7.5px] leading-snug">{fillCertificateCopy(o.verifyEn, vars)}</p>
                  <p className="text-[7.5px] leading-snug text-center" dir="rtl">
                    {fillCertificateCopy(o.verifyAr, vars)}
                  </p>
                  {thirdVerify ? (
                    <p className="text-[7.5px] leading-snug text-right" dir={thirdBlock.dir}>
                      {thirdVerify}
                    </p>
                  ) : (
                    <span />
                  )}
                </div>
                <p className="text-[8.5px] font-bold text-center mt-2 break-all" style={{ color: GOLD }}>
                  {certId} · {origin.replace(/^https?:\/\//, "")}/translation
                </p>
              </div>
            </div>
          </div>
        </div>
      </CertificateOfficialViewport>
    </>
  );
}