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
  VISO_OFFICIAL_DOC_LOGO_AR,
  VISO_OFFICIAL_DOC_LOGO_EN,
} from "@/lib/certificateTemplates";
import {
  certificateShowsClientCr,
  formatOfficialDocumentDescriptionAr,
  formatOfficialDocumentDescriptionEn,
  localizeCertificateLanguage,
  resolveClassicClientNameAr,
  textDirectionForContent,
} from "@/lib/certificateDisplay";
import { getPublicSiteOrigin } from "@/lib/certificateIds";

const NAVY = "#12284C";
const GOLD = "#B08D3C";
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
        <p className="text-lg font-bold text-neutral-900 mt-2 font-mono tracking-tight break-all">{value}</p>
      </div>
    </div>
  );
}

function GridLabel({ children, rtl }: { children: ReactNode; rtl?: boolean }) {
  return (
    <div
      className="px-3 py-3 text-[11px] font-bold text-neutral-900 border border-[#DDD5BF] flex items-center justify-center min-h-[52px]"
      style={{ backgroundColor: CREAM }}
      dir={rtl ? "rtl" : undefined}
    >
      {children}
    </div>
  );
}

/** Cream-column label: English on top, Arabic below with clear separation */
function GridLabelBilingual({ en, ar }: { en: string; ar: string }) {
  return (
    <div
      className="px-3 py-3 text-[11px] font-bold text-neutral-900 border border-[#DDD5BF] flex flex-col items-center justify-center gap-2 min-h-[52px] text-center"
      style={{ backgroundColor: CREAM }}
    >
      <span className="leading-tight">{en}</span>
      <span
        dir="rtl"
        className="text-[10px] font-bold font-arabic text-neutral-700 leading-snug w-full pt-2 border-t border-[#D5CEC0]"
      >
        {ar}
      </span>
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
      className={`px-3 py-3 text-[11px] text-neutral-900 border border-[#DDD5BF] bg-white flex min-h-[44px] ${
        stacked ? "flex-col items-center justify-center gap-2 py-3.5" : "items-center"
      } ${center ? "justify-center text-center" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function BilingualCellValue({ primary, secondary }: { primary: React.ReactNode; secondary?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 w-full text-center">
      <span className="font-semibold leading-snug">{primary}</span>
      {secondary ? (
        <span
          dir="rtl"
          className="text-[10px] text-neutral-700 font-arabic leading-relaxed w-full pt-2 border-t border-[#E8E4DA]"
        >
          {secondary}
        </span>
      ) : null}
    </div>
  );
}

/** EN label | EN value | AR label | AR value — no stray empty cells */
function OfficialDetailGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-8 mt-5 grid grid-cols-4 gap-0 [&>*:nth-child(-n+4)]:border-t [&>*:nth-child(-n+4)]:border-[#DDD5BF]">
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
      className="max-h-[118px] w-auto max-w-full object-contain"
      onError={() => {
        if (src !== SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK) {
          setSrc(SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK);
        }
      }}
    />
  );
}

export function CertificateTemplateOfficialDoc(props: CertificateViewProps) {
  const { cert, certId, qrUrl, branding, bannerLabel, copy } = props;
  const refDate = formatCertDisplayDate(cert.issue_date);
  const clientEn = cert.project_name;
  const clientAr = resolveClassicClientNameAr(cert.project_name, cert.project_name_ar);
  const srcEn = cert.source_lang;
  const tgtEn = cert.target_lang;
  const srcAr = localizeCertificateLanguage(cert.source_lang, true);
  const tgtAr = localizeCertificateLanguage(cert.target_lang, true);
  const documentLabel = formatOfficialDocumentDescriptionEn(srcEn, tgtEn);
  const documentLabelAr = formatOfficialDocumentDescriptionAr(srcEn, tgtEn);
  const origin = getPublicSiteOrigin();
  const vars = buildCertificatePlaceholderVars(cert, certId, copy);
  const o = copy.official;
  const legalEn1 = fillCertificateCopy(o.legalEn1, vars);
  const legalEn2 = fillCertificateCopy(o.legalEn2, vars);
  const legalEn3 = fillCertificateCopy(o.legalEn3, vars);
  const legalAr1 = fillCertificateCopy(o.legalAr1, vars);
  const legalAr2 = fillCertificateCopy(o.legalAr2, vars);
  const legalAr3 = fillCertificateCopy(o.legalAr3, vars);

  return (
    <div
      className="bg-white w-full max-w-[820px] min-h-[1160px] shadow-2xl mx-auto text-neutral-900 print:shadow-none"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {bannerLabel && (
        <div className="bg-amber-600 text-white text-center text-xs font-bold py-2 px-4">{bannerLabel}</div>
      )}

      <div className="grid grid-cols-2 gap-4 px-8 pt-8 pb-4 items-center">
        <img src={VISO_OFFICIAL_DOC_LOGO_EN} alt="VISO Translation" className="h-[72px] w-auto object-contain object-left" />
        <div className="flex justify-end">
          <img src={VISO_OFFICIAL_DOC_LOGO_AR} alt="" className="h-[84px] w-auto object-contain object-right" />
        </div>
      </div>
      <div className="mx-8 border-b-[3px]" style={{ borderColor: NAVY }} />

      <div className="text-center pt-5 pb-2">
        <h1
          className="text-[22px] font-bold tracking-[0.08em] text-neutral-900"
          style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", color: NAVY }}
        >
          CERTIFICATE OF ACCURACY
        </h1>
        <p className="text-[18px] font-bold mt-1.5 font-arabic" style={{ color: GOLD }} dir="rtl">
          شهادة دقة الترجمة
        </p>
        <p className="text-sm mt-2 tracking-widest" style={{ color: GOLD }}>
          ──────── ◆ ────────
        </p>
      </div>

      <div className="px-8 flex gap-3 mt-4">
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
        <GridLabel rtl>اسم العميل</GridLabel>
        <GridValue>
          <span dir="rtl" className="font-arabic font-semibold leading-snug text-neutral-900">
            {clientAr}
          </span>
        </GridValue>

        {certificateShowsClientCr(cert) ? (
          <>
            <GridLabel>CR No.</GridLabel>
            <GridValue center>
              <span className="font-mono font-semibold tracking-tight">{cert.client_cr_number}</span>
            </GridValue>
            <GridLabel rtl>رقم السجل التجاري</GridLabel>
            <GridValue center>
              <span className="font-mono font-semibold tracking-tight">{cert.client_cr_number}</span>
            </GridValue>
          </>
        ) : null}

        <GridLabelBilingual en="Document" ar="المستند" />
        <GridValue center stacked className="col-span-3">
          <BilingualCellValue primary={documentLabel} secondary={documentLabelAr} />
        </GridValue>

        <GridLabelBilingual en="Source Language" ar="اللغة المصدر" />
        <GridValue center stacked>
          <BilingualCellValue primary={srcEn} secondary={srcAr} />
        </GridValue>
        <GridLabelBilingual en="Target Language" ar="اللغة الهدف" />
        <GridValue center stacked>
          <BilingualCellValue primary={tgtEn} secondary={tgtAr} />
        </GridValue>
      </OfficialDetailGrid>

      <div className="px-8 mt-6 grid grid-cols-[1fr_4px_1fr] gap-0 items-stretch">
        <div className="pr-4 space-y-4 text-[11px] leading-[1.65] text-justify">
          <p>{legalEn1}</p>
          <p>{legalEn2}</p>
          <p>{legalEn3}</p>
        </div>
        <div className="w-1 self-stretch my-1" style={{ backgroundColor: GOLD }} />
        <div className="pl-4 space-y-4 text-[11px] leading-[1.75] text-justify" dir="rtl">
          <p>{legalAr1}</p>
          <p>{legalAr2}</p>
          <p>{legalAr3}</p>
        </div>
      </div>

      {/* Signature (left) + verification QR (right) — no official seal */}
      <div className="px-8 mt-10 grid grid-cols-[1fr_152px] gap-6 items-end">
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-bold text-sm">{o.closingEn}</p>
              <p className="font-bold text-sm mt-1 leading-snug text-[12px]">{o.officeNameEn}</p>
            </div>
            <div dir="rtl" className="text-right">
              <p className="font-bold text-sm">{o.closingAr}</p>
              <p className="font-bold text-sm mt-1 leading-snug text-[12px]">{o.officeNameAr}</p>
            </div>
          </div>

          <div className="relative max-w-[320px] min-h-[64px] mb-2">
            {branding.signatureUrl ? (
              <img
                src={branding.signatureUrl}
                alt=""
                className="absolute left-0 bottom-0 h-14 w-auto max-w-full object-contain object-left pointer-events-none"
              />
            ) : null}
            <div className="border-b-2 pt-12 w-full" style={{ borderColor: NAVY }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-sm">{o.signatoryNameEn}</p>
              <p className="text-[11px] text-neutral-700 mt-0.5">{o.signatoryTitleEn}</p>
              <p className="text-[9px] text-neutral-500 uppercase tracking-wider mt-2">
                Authorized signature
              </p>
            </div>
            <div dir="rtl" className="text-right">
              <p className="font-bold text-sm">{o.signatoryNameAr}</p>
              <p className="text-[11px] text-neutral-700 mt-0.5">{o.signatoryTitleAr}</p>
              <p className="text-[9px] text-neutral-500 mt-2 font-arabic">التوقيع المعتمد</p>
            </div>
          </div>
        </div>

        <div
          className="border-2 p-3 flex flex-col items-center justify-center gap-2 bg-white shrink-0"
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

      {/* Verification + commission logo (QR reserved for later) */}
      <div className="px-8 mt-8 mb-8 grid grid-cols-[1fr_220px] gap-4 items-stretch">
        <div className="border-2 px-4 py-3 flex flex-col justify-center gap-2 min-h-[140px]" style={{ borderColor: GOLD }}>
          <p className="text-[11px] font-bold" style={{ color: NAVY }}>
            {o.verifyHeading}
          </p>
          <p className="text-[10.5px] leading-snug">{fillCertificateCopy(o.verifyEn, vars)}</p>
          <p className="text-[10.5px] leading-snug" dir="rtl">
            {fillCertificateCopy(o.verifyAr, vars)}
          </p>
          <p className="text-[11px] font-bold mt-1" style={{ color: GOLD }}>
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
  );
}