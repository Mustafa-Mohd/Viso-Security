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
  const { cert, certId, branding, bannerLabel, copy } = props;
  const refDate = formatCertDisplayDate(cert.issue_date);
  const clientEn = cert.project_name;
  const clientAr = resolveClassicClientNameAr(cert.project_name, cert.project_name_ar);
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
          CERTIFICATION
        </h1>
        <p className="text-[20px] font-bold mt-1" style={{ color: GOLD }} dir="rtl">
          مشهد
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

      <div className="px-8 mt-5 grid grid-cols-6 gap-0">
        <GridLabel>Client Name</GridLabel>
        <GridValue center>
          <span dir={textDirectionForContent(clientEn)} className="font-semibold leading-snug">
            {clientEn}
          </span>
        </GridValue>
        <GridLabel rtl>اسم العميل</GridLabel>
        <GridValue center>
          <span dir="rtl" className="font-arabic font-semibold text-[11px] leading-snug text-neutral-900">
            {clientAr}
          </span>
        </GridValue>
        <div className="col-span-2 border border-[#DDD5BF] bg-white min-h-[42px]" aria-hidden />

        <GridLabel>Document</GridLabel>
        <GridValue center className="col-span-2">
          {documentLabel}
        </GridValue>
        <GridLabel rtl>المستند</GridLabel>
        <div className="col-span-2 border border-[#DDD5BF] bg-white" aria-hidden />

        {certificateShowsClientCr(cert) ? (
          <>
            <GridLabel>CR No.</GridLabel>
            <div className="col-span-2 px-3 py-2.5 text-[11px] text-neutral-900 border border-[#DDD5BF] bg-white flex items-center justify-center text-center">
              <span className="font-mono font-semibold">{cert.client_cr_number}</span>
            </div>
            <GridLabel rtl>رقم السجل التجاري</GridLabel>
            <div className="col-span-2 border border-[#DDD5BF] bg-white" aria-hidden />
          </>
        ) : null}

        <GridLabel>Source Language</GridLabel>
        <GridValue center>
          <span className="block">{srcEn}</span>
          <span className="block text-[10px] mt-0.5" dir="rtl">
            {srcAr}
          </span>
        </GridValue>
        <GridLabel rtl>اللغة المصدر</GridLabel>
        <GridLabel>Target Language</GridLabel>
        <GridValue center>
          <span className="block">{tgtEn}</span>
          <span className="block text-[10px] mt-0.5" dir="rtl">
            {tgtAr}
          </span>
        </GridValue>
        <GridLabel rtl>اللغة الهدف</GridLabel>
      </div>

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

      {/* Single signature — bilingual labels, one image & line; seal centered */}
      <div className="px-8 mt-10">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-6 gap-y-1 items-start">
          <div>
            <p className="font-bold text-sm">{o.closingEn}</p>
            <p className="font-bold text-sm mt-1 leading-snug">{o.officeNameEn}</p>
          </div>
          <div className="w-[148px]" aria-hidden />
          <div className="text-right" dir="rtl">
            <p className="font-bold text-sm">{o.closingAr}</p>
            <p className="font-bold text-sm mt-1 leading-snug">{o.officeNameAr}</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-6 items-end mt-5">
          <div className="pb-2">
            <p className="font-bold text-sm">{o.signatoryNameEn}</p>
            <p className="text-[11px] text-neutral-700 mt-0.5">{o.signatoryTitleEn}</p>
          </div>

          <div
            className="w-[148px] border border-dashed border-neutral-400 px-3 py-4 flex flex-col items-center justify-center gap-1.5 min-h-[150px] bg-white"
          >
            <p className="text-[10px] font-semibold tracking-wide text-center">OFFICIAL SEAL</p>
            <p className="text-[10px] font-semibold text-center" dir="rtl">
              ختم المكتب
            </p>
            {branding.digitalStampUrl ? (
              <img
                src={branding.digitalStampUrl}
                alt="Official seal"
                className="h-[72px] w-auto max-w-[120px] object-contain mt-1"
              />
            ) : null}
          </div>

          <div className="text-right pb-2" dir="rtl">
            <p className="font-bold text-sm">{o.signatoryNameAr}</p>
            <p className="text-[11px] text-neutral-700 mt-0.5">{o.signatoryTitleAr}</p>
          </div>
        </div>

        <div className="relative max-w-md mx-auto mt-2 mb-1 min-h-[58px]">
          {branding.signatureUrl ? (
            <img
              src={branding.signatureUrl}
              alt=""
              className="absolute left-1/2 bottom-0 h-14 w-auto max-w-[min(100%,240px)] -translate-x-1/2 object-contain pointer-events-none"
            />
          ) : null}
          <div className="border-b-2 pt-12 w-full" style={{ borderColor: NAVY }} />
        </div>
        <p className="text-[9px] text-neutral-500 text-center uppercase tracking-wider mt-1">
          Authorized signature · التوقيع المعتمد
        </p>
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