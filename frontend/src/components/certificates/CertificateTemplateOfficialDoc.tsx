import type { ReactNode } from "react";
import { useState } from "react";
import type { CertificateViewProps } from "@/components/certificates/CertificateDocument";
import {
  buildCertificatePlaceholderVars,
  fillCertificateCopy,
} from "@/lib/certificateCopy";
import {
  formatCertDisplayDate,
  SAUDI_TRANSLATION_COMMISSION_LOGO,
  SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK,
  VISO_OFFICIAL_DOC_LOGO_AR_TEXT,
  VISO_OFFICIAL_DOC_LOGO_EN,
  VISO_OFFICIAL_DOC_LOGO_MARK,
  CERTIFICATE_A4_PAGE_CLASS,
} from "@/lib/certificateTemplates";
import {
  certificateShowsClientCr,
  localizeCertificateLanguage,
  resolveClassicClientNameAr,
  textDirectionForContent,
} from "@/lib/certificateDisplay";
import {
  buildCompactArabicLegal,
  buildCompactEnglishLegal,
  buildThirdLanguageLegalBlock,
  buildThirdLanguageVerifyLine,
  resolveTrilingualThirdLanguageName,
} from "@/lib/certificateOfficialThirdLegal";
import { getPublicSiteOrigin } from "@/lib/certificateIds";
import { CertificateOfficialViewport } from "@/components/certificates/CertificateOfficialViewport";
import {
  CERTIFICATE_SIGNATURE_SCREEN_CSS,
  CERTIFICATE_SINGLE_PAGE_PRINT_CSS,
} from "@/components/certificates/certificatePrintStyles";
import {
  OFFICIAL_CERT_GOLD as GOLD,
  OFFICIAL_CERT_NAVY as NAVY,
  OfficialSignatoryStack,
  VerifyHeadingRow,
} from "@/components/certificates/officialCertificateAttestation";

const CREAM = "#F1ECE0";

function MetaBox({
  labelEn,
  labelAr,
  value,
}: {
  labelEn: string;
  labelAr: string;
  value: string;
}) {
  return (
    <div
      className="flex-1 min-w-0 border border-[#D8CFB6] bg-white"
      style={{ borderTopWidth: 3, borderTopColor: NAVY }}
    >
      <div className="px-4 py-3">
        <p className="text-[11px] font-bold text-neutral-900">{labelEn}</p>
        <p className="text-[11px] text-neutral-900 mt-0.5" dir="rtl">
          {labelAr}
        </p>
        <p className="text-lg font-bold text-neutral-900 mt-2 font-mono tracking-tight break-all">
          {value}
        </p>
      </div>
    </div>
  );
}

function GridLabel({ children, rtl }: { children: ReactNode; rtl?: boolean }) {
  return (
    <div
      className="px-2 py-3 text-[10px] font-bold text-neutral-900 border border-[#DDD5BF] flex items-center justify-center min-h-[52px] min-w-0 text-center leading-snug"
      style={{ backgroundColor: CREAM }}
      dir={rtl ? "rtl" : undefined}
    >
      {children}
    </div>
  );
}

function GridValue({
  children,
  center,
  stacked,
  className = "",
}: {
  children: React.ReactNode;
  center?: boolean;
  stacked?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`px-2 py-3 text-[11px] text-neutral-900 border border-[#DDD5BF] bg-white flex min-h-[44px] min-w-0 ${
        stacked ? "flex-col items-center justify-center gap-2 py-3.5" : "items-center"
      } ${center ? "justify-center text-center" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function GridLabelStackedEn({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div
      className="px-2 py-3 text-[10px] font-bold text-neutral-900 border border-[#DDD5BF] flex flex-col items-center justify-center gap-2 min-h-[52px] min-w-0 text-center"
      style={{ backgroundColor: CREAM }}
    >
      <span className="leading-tight">{top}</span>
      <span className="leading-tight w-full pt-2 border-t border-[#D5CEC0]">{bottom}</span>
    </div>
  );
}

function GridLabelStackedAr({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div
      dir="rtl"
      className="px-2 py-3 text-[10px] font-bold text-neutral-900 border border-[#DDD5BF] flex flex-col items-center justify-center gap-2 min-h-[52px] min-w-0 text-center font-arabic"
      style={{ backgroundColor: CREAM }}
    >
      <span className="leading-snug">{top}</span>
      <span className="leading-snug w-full pt-2 border-t border-[#D5CEC0]">{bottom}</span>
    </div>
  );
}

function StackedLangValuesEn({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="flex flex-col items-center gap-2 w-full text-center">
      <span className="font-semibold leading-snug">{top}</span>
      <span className="font-semibold leading-snug w-full pt-2 border-t border-[#E8E4DA]">{bottom}</span>
    </div>
  );
}

function StackedLangValuesAr({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div dir="rtl" className="flex flex-col items-center gap-2 w-full text-center font-arabic">
      <span className="font-semibold leading-snug text-neutral-900">{top}</span>
      <span className="font-semibold leading-snug text-neutral-900 w-full pt-2 border-t border-[#E8E4DA]">
        {bottom}
      </span>
    </div>
  );
}

/** EN label | EN value | AR label | AR value — stacks on mobile, 4 cols from md; print keeps desktop grid */
function OfficialDetailGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="cert-print-detail-grid px-8 mt-5 grid grid-cols-4 gap-0 min-w-0">
      {children}
    </div>
  );
}

function CommissionLogo() {
  const [src, setSrc] = useState(SAUDI_TRANSLATION_COMMISSION_LOGO);
  return (
    <img
      src={src}
      alt="Literature, Publishing & Translation Commission"
      className="cert-print-commission max-h-[118px] w-auto max-w-full object-contain"
      onError={() => {
        if (src !== SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK) {
          setSrc(SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK);
        }
      }}
    />
  );
}

function isOfficialTrilingualTemplate(cert: CertificateViewProps["cert"]) {
  const t = cert.template;
  return t === "official_trilingual" || t === "trilingual";
}

export function CertificateTemplateOfficialDoc(props: CertificateViewProps) {
  const { cert, certId, qrUrl, branding, bannerLabel, copy } = props;
  const trilingual = isOfficialTrilingualTemplate(cert);
  const refDate = formatCertDisplayDate(cert.issue_date);
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
  const thirdBlock = trilingual ? buildThirdLanguageLegalBlock(thirdLangName, vars) : null;
  const thirdVerify = trilingual ? buildThirdLanguageVerifyLine(thirdLangName, vars) : null;
  const legalEnCompact = buildCompactEnglishLegal(legalEn1, legalEn2, legalEn3);
  const legalArCompact = buildCompactArabicLegal(legalAr1, legalAr2, legalAr3);

  return (
    <>
      <style>
        {CERTIFICATE_SIGNATURE_SCREEN_CSS}
        {CERTIFICATE_SINGLE_PAGE_PRINT_CSS}
      </style>
      <CertificateOfficialViewport>
      <div
        className={`bg-white ${CERTIFICATE_A4_PAGE_CLASS} shadow-2xl mx-auto text-neutral-900 print:shadow-none overflow-x-hidden flex flex-col`}
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
      {bannerLabel && (
        <div className="bg-amber-600 text-white text-center text-xs font-bold py-2 px-4 print:hidden">{bannerLabel}</div>
      )}

      <div className="cert-print-header grid grid-cols-[1fr_auto_1fr] gap-3 px-8 pt-8 pb-4 items-center min-w-0">
        <img
          src={VISO_OFFICIAL_DOC_LOGO_EN}
          alt="Vision of Solutions — Translation Services"
          className="h-[72px] w-auto object-contain object-left justify-self-start"
        />
        <img
          src={VISO_OFFICIAL_DOC_LOGO_MARK}
          alt="VISO"
          className="h-[84px] w-auto max-w-[140px] object-contain justify-self-center"
        />
        <img
          src={VISO_OFFICIAL_DOC_LOGO_AR_TEXT}
          alt="رؤية الحلول — خدمات الترجمة"
          className="h-[80px] w-auto object-contain object-right justify-self-end"
        />
      </div>
      <div className="mx-8 border-b-[3px]" style={{ borderColor: NAVY }} />

      <div className="text-center pt-5 pb-2 px-4">
        <h1
          className="text-[20px] font-bold tracking-[0.08em] text-neutral-900 leading-snug max-w-[95%] mx-auto"
          style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", color: NAVY }}
        >
          CERTIFICATE OF TRANSLATION ACCURACY
        </h1>
        <p
          className="text-[18px] font-bold mt-1.5 font-arabic px-1"
          style={{ color: GOLD }}
          dir="rtl"
        >
          شهادة دقة ترجمة الوثائق
        </p>
        <p className="text-sm mt-2 tracking-widest" style={{ color: GOLD }}>
          ──────── ◆ ────────
        </p>
      </div>

      <div className="px-8 flex flex-row gap-3 mt-4">
        <MetaBox labelEn="Ref. No" labelAr="رقم المرجع" value={certId} />
        <MetaBox labelEn="Date" labelAr="التاريخ" value={refDate} />
        <MetaBox
          labelEn="Riyadh Chamber Membership ID No."
          labelAr="رقم عضوية الغرفة التجارية بالرياض"
          value={branding.riyadhChamberMembershipId}
        />
      </div>

      <OfficialDetailGrid>
        <GridLabel>Client Name</GridLabel>
        <GridValue>
          <span dir={textDirectionForContent(clientEn)} className="font-semibold leading-snug">
            {clientEn}
          </span>
        </GridValue>
        <GridValue>
          <span dir="rtl" className="font-arabic font-semibold leading-snug text-neutral-900">
            {clientAr}
          </span>
        </GridValue>
        <GridLabel rtl>اسم العميل</GridLabel>

        {certificateShowsClientCr(cert) ? (
          <>
            <GridLabel>CR No.</GridLabel>
            <GridValue center>
              <span className="font-mono font-semibold tracking-tight">{cert.client_cr_number}</span>
            </GridValue>
            <GridValue center>
              <span className="font-mono font-semibold tracking-tight">{cert.client_cr_number}</span>
            </GridValue>
            <GridLabel rtl>رقم السجل التجاري</GridLabel>
          </>
        ) : null}

        <GridLabelStackedEn top="Source Language" bottom="Target Language" />
        <GridValue center stacked>
          <StackedLangValuesEn top={srcEn} bottom={tgtEn} />
        </GridValue>
        <GridValue center stacked>
          <StackedLangValuesAr top={srcAr} bottom={tgtAr} />
        </GridValue>
        <GridLabelStackedAr top="اللغة المصدر" bottom="اللغة الهدف" />
      </OfficialDetailGrid>

      {trilingual && thirdBlock ? (
        <div className="cert-print-legal cert-print-legal-tri px-8 mt-5 grid grid-cols-[1fr_3px_1fr_3px_1fr] gap-0 items-stretch">
          <div className="cert-print-legal-col pr-2 pb-1 text-[9.5px] leading-[1.48] text-justify">
            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-center mb-2 pb-1 border-b border-[#E8E4DA]">
              Certification
            </p>
            <p>{legalEnCompact}</p>
          </div>
          <div
            className="cert-print-legal-divider-v w-[3px] self-stretch shrink-0"
            style={{ backgroundColor: GOLD }}
            aria-hidden
          />
          <div
            className="cert-print-legal-col px-2 pb-1 text-[9.5px] leading-[1.55] text-justify"
            dir="rtl"
          >
            <p className="text-[8px] font-bold font-arabic text-center mb-2 pb-1 border-b border-[#E8E4DA]">
              شهادة
            </p>
            <p className="font-arabic">{legalArCompact}</p>
          </div>
          <div
            className="cert-print-legal-divider-v w-[3px] self-stretch shrink-0"
            style={{ backgroundColor: GOLD }}
            aria-hidden
          />
          <div
            className={`cert-print-legal-col pl-2 pb-1 text-[9.5px] leading-[1.48] text-justify ${thirdBlock.fontClass ?? ""}`}
            dir={thirdBlock.dir ?? "ltr"}
          >
            <p className="text-[8px] font-bold text-center mb-2 pb-1 border-b border-[#E8E4DA]">
              {thirdBlock.heading}
            </p>
            <p>{thirdBlock.body}</p>
          </div>
        </div>
      ) : (
        <div className="cert-print-legal px-8 mt-6 grid grid-cols-[1fr_4px_1fr] gap-0 items-stretch">
          <div className="cert-print-legal-col pr-3 space-y-4 text-[11px] leading-[1.65] text-justify">
            <p>{legalEn1}</p>
            <p>{legalEn2}</p>
            <p>{legalEn3}</p>
          </div>
          <div
            className="cert-print-legal-divider-v w-1 self-stretch my-0.5 shrink-0"
            style={{ backgroundColor: GOLD }}
            aria-hidden
          />
          <div
            className="cert-print-legal-col pl-3 space-y-4 text-[11px] leading-[1.75] text-justify"
            dir="rtl"
          >
            <p>{legalAr1}</p>
            <p>{legalAr2}</p>
            <p>{legalAr3}</p>
          </div>
        </div>
      )}

      <div className="px-8 mt-5 grid grid-cols-[1fr_152px] gap-6 items-end">
        <div className="min-w-0 w-full">
          <OfficialSignatoryStack
            closingEn={o.closingEn}
            officeNameEn={o.officeNameEn}
            signatoryName={o.signatoryNameEn}
            signatoryTitle={o.signatoryTitleEn}
            signatureUrl={branding.signatureUrl}
            membershipId={branding.riyadhChamberMembershipId}
            electronicAuthHeading={o.electronicAuthHeadingEn}
            electronicAuthBody={o.electronicAuthBodyEn}
          />
        </div>

        <div
          className="cert-print-qr border-2 p-3 flex flex-col items-center justify-center gap-2 bg-white shrink-0 w-auto"
          style={{ borderColor: GOLD }}
        >
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=132x132&data=${encodeURIComponent(qrUrl)}`}
            alt="Certificate verification QR"
            className="w-[120px] h-[120px]"
          />
          <p className="text-[9px] font-bold text-center leading-tight" style={{ color: NAVY }}>
            Scan to verify
          </p>
          <p className="text-[9px] font-arabic text-center leading-tight" dir="rtl">
            امسح للتحقق
          </p>
        </div>
      </div>

      <div className="cert-print-footer px-8 mt-8 mb-8 grid grid-cols-[1fr_220px] gap-4 items-stretch">
        <div className="border-2 px-4 py-3 flex flex-col justify-center gap-2 min-h-[140px]" style={{ borderColor: GOLD }}>
          <VerifyHeadingRow heading={o.verifyHeading} />
          <p className="text-[10.5px] leading-snug">{fillCertificateCopy(o.verifyEn, vars)}</p>
          <p className="text-[10.5px] leading-snug" dir="rtl">
            {fillCertificateCopy(o.verifyAr, vars)}
          </p>
          {trilingual && thirdVerify ? (
            <p className="text-[9.5px] leading-snug pt-1 border-t border-[#E8E4DA]" dir={thirdBlock?.dir}>
              {thirdVerify}
            </p>
          ) : null}
          <p className="text-[11px] font-bold mt-1 break-all" style={{ color: GOLD }}>
            {certId} · {origin.replace(/^https?:\/\//, "")}/translation
          </p>
        </div>
        <div
          className="border-2 px-3 py-4 flex items-center justify-center bg-white min-h-[140px]"
          style={{ borderColor: GOLD }}
        >
          <CommissionLogo />
        </div>
      </div>
    </div>
      </CertificateOfficialViewport>
    </>
  );
}
