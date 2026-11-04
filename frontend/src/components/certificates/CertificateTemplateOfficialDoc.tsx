import type { ReactNode } from "react";
import type { CertificateViewProps } from "@/components/certificates/CertificateDocument";
import {
  buildCertificatePlaceholderVars,
  fillCertificateCopy,
} from "@/lib/certificateCopy";
import { formatCertDisplayDate, VISO_OFFICIAL_DOC_LOGO_AR, VISO_OFFICIAL_DOC_LOGO_EN } from "@/lib/certificateTemplates";
import { localizeCertificateLanguage, textDirectionForContent } from "@/lib/certificateDisplay";
import { getPublicSiteOrigin } from "@/lib/certificateIds";

const NAVY = "#12284C";
const GOLD = "#B08D3C";
const CREAM = "#F1ECE0";
const BORDER = "#DDD5BF";
const BORDER_GOLD = "#D8CFB6";

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
      className="px-3 py-2.5 text-[11px] font-bold text-neutral-900 border border-[#DDD5BF] flex items-center"
      style={{ backgroundColor: CREAM }}
      dir={rtl ? "rtl" : undefined}
    >
      {children}
    </div>
  );
}

function GridValue({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div
      className={`px-3 py-2.5 text-[11px] text-neutral-900 border border-[#DDD5BF] bg-white flex items-center ${center ? "justify-center text-center" : ""}`}
    >
      {children}
    </div>
  );
}

export function CertificateTemplateOfficialDoc(props: CertificateViewProps) {
  const { cert, certId, qrUrl, branding, bannerLabel, copy } = props;
  const refDate = formatCertDisplayDate(cert.issue_date);
  const clientEn = cert.project_name;
  const srcEn = cert.source_lang;
  const tgtEn = cert.target_lang;
  const srcAr = localizeCertificateLanguage(cert.source_lang, true);
  const tgtAr = localizeCertificateLanguage(cert.target_lang, true);
  const documentLabel = `${srcEn} – ${tgtEn} Translation`;
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

      {/* Header logos from Word template */}
      <div className="grid grid-cols-2 gap-4 px-8 pt-8 pb-4 items-center">
        <img src={VISO_OFFICIAL_DOC_LOGO_EN} alt="VISO Translation" className="h-[72px] w-auto object-contain object-left" />
        <div className="flex justify-end">
          <img src={VISO_OFFICIAL_DOC_LOGO_AR} alt="" className="h-[84px] w-auto object-contain object-right" />
        </div>
      </div>
      <div className="mx-8 border-b-[3px]" style={{ borderColor: NAVY }} />

      {/* Title */}
      <div className="text-center pt-5 pb-2">
        <h1
          className="text-[22px] font-bold tracking-[0.08em] text-neutral-900"
          style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", color: NAVY }}
        >
          CERTIFICATION
        </h1>
        <p className="text-[20px] font-bold mt-1" style={{ color: GOLD }} dir="rtl">
          مشهد
        </p>
        <p className="text-sm mt-2 tracking-widest" style={{ color: GOLD }}>
          ──────── ◆ ────────
        </p>
      </div>

      {/* Ref / Date / Chamber */}
      <div className="px-8 flex gap-3 mt-4">
        <MetaBox labelEn="Ref. No" labelAr="رقم المرجع" value={certId} />
        <MetaBox labelEn="Date" labelAr="التاريخ" value={refDate} />
        <MetaBox
          labelEn="Riyadh Chamber Membership ID No."
          labelAr="رقم عضوية الغرفة التجارية بالرياض"
          value={branding.riyadhChamberMembershipId}
        />
      </div>

      {/* Data grid */}
      <div className="px-8 mt-5 grid grid-cols-6 gap-0">
        <GridLabel>Client Name</GridLabel>
        <GridValue center>
          <span dir={textDirectionForContent(clientEn)}>{clientEn}</span>
        </GridValue>
        <GridLabel rtl>اسم العميل</GridLabel>
        <GridLabel>Document</GridLabel>
        <GridValue center>{documentLabel}</GridValue>
        <GridLabel rtl>المستند</GridLabel>

        <GridLabel>Source Language</GridLabel>
        <GridValue center>{srcEn}</GridValue>
        <GridLabel rtl>اللغة المصدر</GridLabel>
        <GridLabel>Target Language</GridLabel>
        <GridValue center>{tgtEn}</GridValue>
        <GridLabel rtl>اللغة الهدف</GridLabel>
      </div>

      {/* Bilingual legal body */}
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

      {/* Signatures */}
      <div className="px-8 mt-8 grid grid-cols-3 gap-6 items-end">
        <div>
          <p className="font-bold text-sm">{o.closingEn}</p>
          <p className="font-bold text-sm mt-1 mb-6">{o.officeNameEn}</p>
          <div className="relative min-h-[56px] mb-1">
            {branding.signatureUrl && (
              <img
                src={branding.signatureUrl}
                alt=""
                className="absolute bottom-0 left-0 h-14 w-auto max-w-full object-contain object-left"
              />
            )}
            <div className="border-b-2 pt-10" style={{ borderColor: NAVY }} />
          </div>
          <p className="font-bold text-sm">{o.signatoryNameEn}</p>
          <p className="text-[11px] text-neutral-700 mt-0.5">{o.signatoryTitleEn}</p>
        </div>

        <div
          className="border border-dashed border-neutral-400 px-4 py-6 text-center min-h-[160px] flex flex-col items-center justify-center gap-2"
        >
          <p className="text-[11px] font-semibold tracking-wide">OFFICIAL SEAL</p>
          <p className="text-[11px] font-semibold" dir="rtl">
            ختم المكتب
          </p>
          {branding.digitalStampUrl ? (
            <img src={branding.digitalStampUrl} alt="Official seal" className="h-20 w-auto object-contain mt-1" />
          ) : null}
        </div>

        <div dir="rtl" className="text-right">
          <p className="font-bold text-sm">{o.closingAr}</p>
          <p className="font-bold text-sm mt-1 mb-6">{o.officeNameAr}</p>
          <div className="relative min-h-[56px] mb-1">
            {branding.signatureUrl && (
              <img
                src={branding.signatureUrl}
                alt=""
                className="absolute bottom-0 right-0 h-14 w-auto max-w-full object-contain object-right"
              />
            )}
            <div className="border-b-2 pt-10" style={{ borderColor: NAVY }} />
          </div>
          <p className="font-bold text-sm">{o.signatoryNameAr}</p>
          <p className="text-[11px] text-neutral-700 mt-0.5">{o.signatoryTitleAr}</p>
        </div>
      </div>

      {/* Verification row */}
      <div className="px-8 mt-8 grid grid-cols-[180px_1fr_200px] gap-3 items-stretch">
        <div className="border-2 p-3 flex items-center justify-center" style={{ borderColor: GOLD }}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(qrUrl)}`}
            alt="QR"
            className="w-[120px] h-[120px]"
          />
        </div>
        <div className="border-2 px-4 py-3 flex flex-col justify-center gap-2" style={{ borderColor: GOLD }}>
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
        <div className="border border-dashed border-neutral-400 px-2 py-3 flex flex-col items-center justify-center text-center text-[10px] text-neutral-500">
          {branding.digitalStampUrl ? (
            <img src={branding.digitalStampUrl} alt="" className="max-h-24 w-auto object-contain opacity-90" />
          ) : (
            <>
              <p>{o.commissionNoteEn}</p>
              <p className="mt-1" dir="rtl">
                {o.commissionNoteAr}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
