import type { ReactNode } from "react";
import type { TranslationCertificate } from "@/lib/certsApi";
import type { CertificateDisplayStatus } from "@/lib/certsApi";
import type { CertificateBranding } from "@/lib/certificateBranding";
import { RIYADH_CHAMBER_LABELS } from "@/lib/certificateBranding";
import {
  formatCertificateProjectNameForDisplay,
  localizeCertificateLanguage,
  textDirectionForContent,
} from "@/lib/certificateDisplay";
import { formatCertDisplayDate, VISO_LOGO_URL } from "@/lib/certificateTemplates";

export type CertificateViewProps = {
  cert: TranslationCertificate;
  certId: string;
  qrUrl: string;
  branding: CertificateBranding;
  displayStatus: CertificateDisplayStatus;
  bannerLabel: string | null;
  watermarkLabel: string | null;
  isWithinValidity: boolean;
  isPastExpiry: boolean;
  isRevoked: boolean;
};

function VisoLogoBlock({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const logoH = size === "lg" ? "h-[72px]" : "h-14";
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <img src={VISO_LOGO_URL} alt="VISO" className={`${logoH} w-auto object-contain`} />
      <span className="text-[9px] font-bold tracking-[0.4em] text-neutral-800 mt-1.5 uppercase pl-0.5">
        Translation
      </span>
    </div>
  );
}

function CertificateOuterFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white w-full shadow-2xl relative text-neutral-900 flex flex-col mx-auto overflow-hidden print:shadow-none ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none border-[3px] border-neutral-800/90 m-3 sm:m-4" />
      <div className="absolute inset-0 pointer-events-none border border-amber-600/40 m-5 sm:m-6" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 z-10" />
      <div className="relative flex flex-col flex-grow min-h-0 m-3 sm:m-4 p-5 sm:p-7 md:p-9 pt-8">{children}</div>
    </div>
  );
}

function RiyadhChamberRow({ membershipId, compact }: { membershipId: string; compact?: boolean }) {
  return (
    <div className="border border-neutral-300/90 bg-gradient-to-b from-neutral-50 to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <div className="grid grid-cols-3 divide-x divide-neutral-300/80">
        {(
          [
            { label: RIYADH_CHAMBER_LABELS.es, dir: undefined as "rtl" | undefined },
            { label: RIYADH_CHAMBER_LABELS.en, dir: undefined },
            { label: RIYADH_CHAMBER_LABELS.ar, dir: "rtl" as const },
          ] as const
        ).map(({ label, dir }) => (
          <div key={label} className={`${compact ? "px-2 py-2" : "px-3 py-2.5"} text-center`} dir={dir}>
            <div className="text-[8px] sm:text-[9px] text-neutral-600 leading-tight min-h-[2.5em] flex items-end justify-center">
              {label}
            </div>
            <div className="font-bold text-neutral-900 mt-1.5 text-sm tracking-wide tabular-nums">{membershipId}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignatureBlock({
  branding,
  subtitle,
}: {
  branding: CertificateBranding;
  subtitle?: ReactNode;
}) {
  return (
    <div className="text-center min-w-[150px]">
      {branding.signatureUrl ? (
        <img
          src={branding.signatureUrl}
          alt="Authorized signature"
          className="h-[52px] mx-auto object-contain mb-2"
        />
      ) : (
        <div className="h-[52px] w-full max-w-[180px] mx-auto border-b-2 border-neutral-400 mb-2" />
      )}
      {subtitle ?? (
        <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-[0.15em] leading-snug">
          Authorized Signature
        </p>
      )}
    </div>
  );
}

function StampBlock({ branding, className = "" }: { branding: CertificateBranding; className?: string }) {
  if (!branding.digitalStampUrl) return null;
  return (
    <img src={branding.digitalStampUrl} alt="Digital stamp" className={`object-contain ${className || "h-24 w-auto"}`} />
  );
}

function QrBlock({ qrUrl, size = 96 }: { qrUrl: string; size?: number }) {
  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <div className="p-1.5 bg-white border-2 border-neutral-200 shadow-sm">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrUrl)}`}
          className="block"
          style={{ width: size, height: size }}
          alt="Verification QR code"
        />
      </div>
    </div>
  );
}

const VISO_CONTACT = {
  license: "203005000008",
  vat: "310313445500003",
  tel: "+966 (0) 11-450-3289",
  email: "translation@visogroup.com",
  web: "www.visogroup.com",
  addressEn:
    "Abi Bakr As Siddiq, 7423, Office 110, Al-Taawun, 12477 Riyadh, Kingdom of Saudi Arabia",
  addressEs:
    "Abi Bakr As Siddiq, 7423, oficina n.º 110, barrio de Al-Taawun, 12477 Riad, Reino de Arabia Saudí",
  addressAr: "أبي بكر الصديق، 7423، مكتب 110، حي التعاون، 12477 الرياض، المملكة العربية السعودية",
} as const;

export function CertificateTemplateClassic(props: CertificateViewProps) {
  const { cert, certId, qrUrl, bannerLabel, watermarkLabel, isWithinValidity, isPastExpiry, isRevoked } = props;

  return (
    <div className="bg-white w-full max-w-[800px] min-h-[1130px] shadow-2xl relative p-12 md:p-20 text-black flex flex-col mx-auto overflow-hidden print:shadow-none">
      {bannerLabel && (
        <div
          className={`absolute top-12 left-[-60px] text-white font-bold tracking-wide text-sm py-2 w-[300px] text-center -rotate-45 shadow-md border-y z-10 opacity-90 ${
            isRevoked ? "bg-red-600 border-red-700" : "bg-amber-500 border-amber-600"
          }`}
        >
          {bannerLabel}
        </div>
      )}
      <div className="absolute top-0 left-0 w-full h-4 bg-primary" />
      <div className="text-center mt-12 mb-16 flex flex-col items-center">
        <img src={VISO_LOGO_URL} alt="VISO Group" className="h-20 w-auto object-contain mb-6" />
        <h3 className="text-2xl font-serif text-neutral-800 uppercase tracking-widest border-b-2 border-neutral-300 pb-4 inline-block">
          Certificate of Translation
        </h3>
      </div>
      <div className="flex-grow relative z-0">
        <p className="text-base text-neutral-700 mb-12 leading-relaxed text-justify">
          This document officially certifies that the translation provided for the client{" "}
          <strong className="text-neutral-900">{cert.project_name}</strong> has been completed by certified
          professionals and verified for accuracy and fidelity to the source document.
        </p>
        <div className="grid grid-cols-2 gap-y-8 gap-x-12 text-sm mb-16 border border-neutral-200 p-10 rounded-xl bg-neutral-50/50 relative">
          {watermarkLabel && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0 overflow-hidden">
              <span className="text-[80px] md:text-[120px] font-bold -rotate-12 whitespace-nowrap text-center px-4">
                {watermarkLabel}
              </span>
            </div>
          )}
          <div className="relative z-10">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Certificate ID</span>
            <span className="font-mono font-medium text-neutral-800 text-base">{certId}</span>
          </div>
          <div className="relative z-10">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Client Name</span>
            <span className="font-medium text-neutral-800 text-base">{cert.project_name}</span>
          </div>
          <div className="relative z-10">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Source Language</span>
            <span className="font-medium text-neutral-800 text-base">{cert.source_lang}</span>
          </div>
          <div className="relative z-10">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Target Language</span>
            <span className="font-medium text-neutral-800 text-base">{cert.target_lang}</span>
          </div>
          <div className="relative z-10">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Issue Date</span>
            <span className="font-medium text-neutral-800 text-base">{cert.issue_date}</span>
          </div>
          <div className="relative z-10">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Valid Until</span>
            <span
              className={`font-medium text-base ${!isWithinValidity && (isPastExpiry || isRevoked) ? "text-red-600 line-through" : "text-neutral-800"}`}
            >
              {cert.expiry_date}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-auto pt-10 border-t border-neutral-200 flex justify-between items-end relative z-10">
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Scan to Verify</p>
          <div className="p-2 bg-white border border-neutral-200 rounded-lg inline-block shadow-sm">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrUrl)}`}
              className="w-24 h-24"
              alt="QR"
            />
          </div>
        </div>
        <SignatureBlock branding={props.branding} />
      </div>
    </div>
  );
}

export function CertificateTemplateTrilingual(props: CertificateViewProps) {
  const { cert, certId, qrUrl, branding, bannerLabel } = props;
  const refDate = formatCertDisplayDate(cert.issue_date);
  const expiryDate = formatCertDisplayDate(cert.expiry_date);
  const client = cert.project_name;

  const bodyEs = `Certificamos que la traducción del documento correspondiente a ${client}, de ${cert.source_lang} a ${cert.target_lang}, ha sido realizada por traductores acreditados de Vision of Solutions Office for Translation, conforme a los estándares oficiales del Reino de Arabia Saudita.`;
  const bodyEn = `We certify that the translation of the document relating to ${client}, from ${cert.source_lang} to ${cert.target_lang}, has been completed by accredited translators of Vision of Solutions Office for Translation in accordance with the official standards of the Kingdom of Saudi Arabia.`;
  const bodyAr = `نشهد بأن الترجمة الخاصة بالوثيقة المتعلقة بـ ${client}، من ${cert.source_lang} إلى ${cert.target_lang}، قد تمت من قبل مترجمين معتمدين لدى مكتب رؤية الحلول للترجمة وفق المعايير الرسمية في المملكة العربية السعودية.`;

  return (
    <CertificateOuterFrame className="max-w-[940px] min-h-[1280px]">
      {bannerLabel && (
        <div className="absolute top-16 right-8 z-20 px-4 py-1.5 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
          {bannerLabel}
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-start gap-6 pb-5 border-b border-neutral-200/80">
        <VisoLogoBlock size="lg" />
        <div className="hidden sm:block flex-1 text-center px-4 pt-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
            Vision of Solutions Office for Translation
          </p>
          <p className="text-xs text-neutral-600 mt-1 font-medium">Certified Translation Services</p>
        </div>
        <div className="text-right max-w-[200px] pt-1" dir="rtl">
          <p className="text-[13px] font-bold text-neutral-800 leading-snug">
            رؤية الحلول لخدمات الترجمة المعتمدة
          </p>
        </div>
      </header>

      {/* Reference strip */}
      <div className="mt-5 grid grid-cols-3 gap-0 border border-neutral-200 bg-neutral-100/80 text-[10px] divide-x divide-neutral-200">
        <div className="px-4 py-3">
          <span className="text-neutral-500 block mb-1">N.º de referencia</span>
          <span className="font-mono font-bold text-[11px] text-neutral-900">{certId}</span>
        </div>
        <div className="px-4 py-3 text-center">
          <span className="text-neutral-500 block mb-1">Fecha / Date</span>
          <span className="font-bold text-neutral-900">{refDate}</span>
        </div>
        <div className="px-4 py-3 text-right" dir="rtl">
          <span className="text-neutral-500 block mb-1">التاريخ</span>
          <span className="font-bold text-neutral-900">{refDate}</span>
        </div>
      </div>

      <div className="mt-4">
        <RiyadhChamberRow membershipId={branding.riyadhChamberMembershipId} />
      </div>

      {/* Trilingual body */}
      <div className="mt-6 flex-grow flex flex-col min-h-[340px]">
        <div className="grid grid-cols-3 flex-grow border border-neutral-200 divide-x divide-neutral-200 bg-white shadow-[inset_0_2px_12px_rgba(0,0,0,0.02)]">
          {(
            [
              { title: "Certificación", body: bodyEs, dir: undefined },
              { title: "Certification", body: bodyEn, dir: undefined },
              { title: "مشهد", body: bodyAr, dir: "rtl" as const },
            ] as const
          ).map(({ title, body, dir }) => (
            <div key={title} className="flex flex-col p-4 sm:p-5" dir={dir}>
              <div className="mb-4 pb-2 border-b-2 border-amber-600/70">
                <h4 className="font-bold text-center text-[11px] uppercase tracking-[0.12em] text-neutral-800">
                  {title}
                </h4>
              </div>
              <p className="text-[10.5px] sm:text-[11px] leading-[1.65] text-neutral-700 text-justify flex-grow">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Verification notice */}
      <div className="mt-5 py-3 px-4 bg-neutral-100 border border-neutral-200 text-[8.5px] sm:text-[9px] text-neutral-600 leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center sm:text-left">
          <p>
            Para verificación, escanee el código QR. Válido hasta {expiryDate} (3 meses máx.).
          </p>
          <p className="sm:text-center">
            For verification, scan the QR code. Valid through {expiryDate} (up to 3 months).
          </p>
          <p className="sm:text-right" dir="rtl">
            للتحقق، امسح رمز QR. صالح حتى {expiryDate} (لمدة 3 أشهر كحد أقصى).
          </p>
        </div>
      </div>

      {/* Sign-off & assets */}
      <div className="mt-6 pt-5 border-t-2 border-neutral-200 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-end">
        <div className="flex flex-wrap items-end gap-5 order-2 lg:order-1">
          <QrBlock qrUrl={qrUrl} size={88} />
          <div className="flex flex-col gap-2">
            <StampBlock branding={branding} className="h-[88px] w-auto max-w-[120px]" />
            {!branding.digitalStampUrl && (
              <div className="h-20 w-20 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center text-[8px] text-neutral-400 text-center px-2">
                Digital stamp
              </div>
            )}
          </div>
        </div>

        <div className="order-1 lg:order-2 flex flex-col items-center text-center px-2">
          <p className="text-[10px] text-neutral-600 mb-2 leading-relaxed max-w-[280px]">
            Atentamente / Sincerely / <span dir="rtl">أطيب التحيات</span>
          </p>
          <p className="text-[11px] font-bold text-neutral-900 mb-1">
            Vision of Solutions Office for Translation
          </p>
          <p className="text-[10px] text-neutral-600 mb-3" dir="rtl">
            مكتب رؤية الحلول للترجمة
          </p>
          <SignatureBlock
            branding={branding}
            subtitle={
              <span className="text-[9px] text-neutral-700 font-semibold">
                Mohammad BinSadiq / <span dir="rtl">محمد بن صادق</span>
              </span>
            }
          />
        </div>

        <div className="order-3 flex flex-col items-end gap-2 border-l-0 lg:border-l border-neutral-200 pl-0 lg:pl-6">
          <div className="flex items-stretch gap-2 w-full max-w-[140px] ml-auto">
            <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50 border border-neutral-200 py-2 px-1">
              <span className="text-[7px] uppercase tracking-wider text-neutral-500 text-center leading-tight">
                Legalización
              </span>
              <QrBlock qrUrl={qrUrl} size={56} />
            </div>
            <div
              className="w-6 flex items-center justify-center bg-neutral-800 text-white text-[7px] font-bold uppercase tracking-wider"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Certification
            </div>
          </div>
        </div>
      </div>

      {/* Footer contact */}
      <footer className="mt-6 pt-4 border-t border-neutral-300 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[7.5px] sm:text-[8px] text-neutral-600 leading-relaxed">
        <div>
          <p className="font-bold text-neutral-800 mb-1 uppercase tracking-wider text-[8px]">Contacto</p>
          <p>{VISO_CONTACT.addressEs}</p>
          <p className="mt-1.5">
            Lic. traducción: {VISO_CONTACT.license} · IVA: {VISO_CONTACT.vat}
          </p>
          <p>
            {VISO_CONTACT.tel} · {VISO_CONTACT.email}
          </p>
        </div>
        <div className="sm:text-center">
          <p className="font-bold text-neutral-800 mb-1 uppercase tracking-wider text-[8px]">Contact</p>
          <p>{VISO_CONTACT.addressEn}</p>
          <p className="mt-1.5">
            Translation License No.: {VISO_CONTACT.license} · VAT: {VISO_CONTACT.vat}
          </p>
          <p>
            {VISO_CONTACT.tel} · {VISO_CONTACT.web}
          </p>
        </div>
        <div className="sm:text-right" dir="rtl">
          <p className="font-bold text-neutral-800 mb-1 tracking-wider text-[8px]">للتواصل</p>
          <p>{VISO_CONTACT.addressAr}</p>
          <p className="mt-1.5">
            رخصة الترجمة: {VISO_CONTACT.license} · الرقم الضريبي: {VISO_CONTACT.vat}
          </p>
          <p>
            {VISO_CONTACT.tel} · {VISO_CONTACT.email}
          </p>
        </div>
      </footer>
    </CertificateOuterFrame>
  );
}

export function CertificateTemplateAccreditation(props: CertificateViewProps) {
  const { cert, certId, qrUrl, branding, bannerLabel } = props;
  const issueDisplay = formatCertDisplayDate(cert.issue_date);
  const expiryDisplay = formatCertDisplayDate(cert.expiry_date);
  const nameEn = cert.project_name;
  const nameAr = formatCertificateProjectNameForDisplay(cert.project_name, true);
  const srcEn = cert.source_lang;
  const srcAr = localizeCertificateLanguage(cert.source_lang, true);
  const tgtEn = cert.target_lang;
  const tgtAr = localizeCertificateLanguage(cert.target_lang, true);

  const preambleEn = `This certificate is issued in accordance with the accredited translation standards of the Kingdom of Saudi Arabia and confirms that the translation relating to the bearer named below was completed by Vision of Solutions Office for Translation.`;
  const preambleAr = `صدرت هذه الشهادة وفق معايير الترجمة المعتمدة في المملكة العربية السعودية وتؤكد إتمام الترجمة لدى مكتب رؤية الحلول للترجمة للشخص المذكور أدناه.`;

  return (
    <CertificateOuterFrame className="max-w-[920px] min-h-[1280px]">
      {/* Watermark */}
      <div className="pointer-events-none absolute inset-8 flex items-center justify-center opacity-[0.035]">
        <img src={VISO_LOGO_URL} alt="" className="w-[480px] max-w-full h-auto object-contain" />
      </div>

      {bannerLabel && (
        <div className="absolute top-16 left-8 z-20 px-4 py-1.5 bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
          {bannerLabel}
        </div>
      )}

      <header className="relative flex justify-between items-start gap-4 pb-6 border-b border-neutral-200">
        <VisoLogoBlock size="lg" />
        <div className="flex-1 text-center pt-3 hidden md:block">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Kingdom of Saudi Arabia</p>
        </div>
        <div className="text-right max-w-[210px]" dir="rtl">
          <p className="text-[12px] font-bold text-neutral-800 leading-snug">
            رؤية الحلول لخدمات الترجمة المعتمدة
          </p>
          <p className="text-[9px] text-neutral-500 mt-1">Vision of Solutions · Translation</p>
        </div>
      </header>

      <div className="relative mt-4 flex justify-between items-end text-[11px] gap-4 mb-3">
        <div>
          <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Membership no.</span>
          <p className="font-mono font-bold text-base text-neutral-900 mt-0.5">{certId}</p>
        </div>
        <div dir="rtl" className="text-right">
          <span className="text-neutral-500 text-[10px]">عضوية رقم</span>
          <p className="font-mono font-bold text-base text-neutral-900 mt-0.5">{certId}</p>
        </div>
      </div>

      <RiyadhChamberRow membershipId={branding.riyadhChamberMembershipId} compact />

      {/* Title block */}
      <div className="relative my-8 text-center">
        <p className="text-2xl text-neutral-500/90 mb-2 font-serif" dir="rtl">
          شهادة
        </p>
        <div className="inline-block relative">
          <div className="absolute -inset-x-4 -inset-y-1 bg-amber-500/10 blur-sm rounded" />
          <div className="relative border-2 border-amber-700/75 bg-gradient-to-b from-amber-50 via-white to-amber-50/80 px-10 sm:px-14 py-4 shadow-[0_4px_20px_rgba(180,130,0,0.12)]">
            <h1 className="text-2xl sm:text-[1.65rem] font-serif font-bold text-neutral-900 tracking-tight">
              Certificate of Translation
            </h1>
            <p className="text-sm font-bold text-amber-900/90 mt-2" dir="rtl">
              اعتماد مهني — ترجمة معتمدة
            </p>
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mt-4 font-semibold">
          Professional Accreditation
        </p>
      </div>

      {/* Bilingual content */}
      <div className="relative flex-grow grid md:grid-cols-2 gap-0 border border-neutral-200 min-h-[420px] bg-white/80">
        <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col gap-5">
          <p className="text-[11px] leading-[1.7] text-neutral-700 text-justify border-b border-neutral-100 pb-5">
            {preambleEn}
          </p>
          <div className="space-y-4 flex-grow">
            <AccreditationField label="Name" value={nameEn} valueDir={textDirectionForContent(nameEn)} />
            <AccreditationField label="Professional category" value="Certified translation" />
            <AccreditationField label="Specialization" value={`${srcEn} → ${tgtEn}`} />
            <AccreditationField label="Accreditation start date" value={issueDisplay} />
          </div>
        </div>
        <div className="p-6 sm:p-8 flex flex-col gap-5" dir="rtl">
          <p className="text-[11px] leading-[1.85] text-neutral-700 text-justify border-b border-neutral-100 pb-5">
            {preambleAr}
          </p>
          <div className="space-y-4 flex-grow">
            <AccreditationField label="الاسم" value={nameAr} valueDir={textDirectionForContent(nameAr)} rtl />
            <AccreditationField label="فئة الاعتماد المهني" value="ترجمة معتمدة" rtl />
            <AccreditationField label="التخصص" value={`${srcAr} ← ${tgtAr}`} rtl />
            <AccreditationField label="تاريخ بداية الاعتماد" value={issueDisplay} rtl />
          </div>
        </div>
      </div>

      {/* Validity banner */}
      <div className="relative mt-6 py-4 px-6 bg-gradient-to-r from-amber-200/60 via-amber-100 to-amber-200/60 border-y-2 border-amber-600/50">
        <div className="grid md:grid-cols-2 gap-3 text-center md:text-left text-sm font-bold text-amber-950">
          <p>This certification is valid until: {expiryDisplay}</p>
          <p className="md:text-right" dir="rtl">
            هذه الشهادة صالحة إلى تاريخ: {expiryDisplay}
          </p>
        </div>
      </div>

      {/* Footer authentication row */}
      <div className="relative mt-8 pt-6 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-8 items-end">
        <div className="flex flex-col items-start gap-2">
          <QrBlock qrUrl={qrUrl} size={104} />
          <p className="text-[8px] text-neutral-500 max-w-[110px] leading-snug">
            Scan to verify registry record
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="text-[11px] font-bold text-neutral-800">Managing Director</p>
          <p className="text-[11px] font-bold text-neutral-800 mb-4" dir="rtl">
            المدير العام
          </p>
          <SignatureBlock branding={branding} />
        </div>

        <div className="flex flex-col items-center sm:items-end gap-2">
          <div className="w-full max-w-[150px] border-[3px] border-blue-800 bg-gradient-to-b from-blue-50 to-white px-3 py-4 flex flex-col items-center shadow-sm">
            {branding.digitalStampUrl ? (
              <StampBlock branding={branding} className="h-[72px] w-auto" />
            ) : (
              <div className="h-[72px] flex items-center justify-center">
                <img src={VISO_LOGO_URL} alt="" className="h-10 opacity-40 object-contain" />
              </div>
            )}
            <p className="text-[8px] font-bold uppercase text-blue-900 mt-2 tracking-wide">Digitally signed</p>
          </div>
          <p className="text-[9px] text-neutral-600" dir="rtl">
            موقع رقمياً
          </p>
        </div>
      </div>

      <footer className="relative mt-8 pt-4 border-t border-dashed border-neutral-300 text-[8px] text-neutral-500 text-center leading-relaxed">
        <p>{VISO_CONTACT.addressEn}</p>
        <p className="mt-1">
          License {VISO_CONTACT.license} · VAT {VISO_CONTACT.vat} · {VISO_CONTACT.tel} · {VISO_CONTACT.email}
        </p>
      </footer>
    </CertificateOuterFrame>
  );
}

function AccreditationField({
  label,
  value,
  rtl,
  valueDir,
}: {
  label: string;
  value: string;
  rtl?: boolean;
  valueDir?: "rtl" | "ltr" | "auto";
}) {
  return (
    <div className={`rounded-lg bg-neutral-50/90 border border-neutral-200/80 px-4 py-3 ${rtl ? "text-right" : ""}`}>
      <div className="text-[9px] font-bold uppercase text-neutral-400 tracking-[0.12em] mb-1.5">{label}</div>
      <div
        className="font-semibold text-neutral-900 text-[14px] leading-snug"
        dir={valueDir ?? (rtl ? "rtl" : "ltr")}
      >
        {value}
      </div>
    </div>
  );
}
