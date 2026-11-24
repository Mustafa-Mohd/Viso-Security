import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

export const OFFICIAL_CERT_NAVY = "#12284C";
export const OFFICIAL_CERT_GOLD = "#B08D3C";

const DOCUSIGN_STROKE = "#2A5F9E";
const DOCUSIGN_SIGNATURE_W = 262;
const SIGNATURE_SCRIPT_FONT =
  '"Segoe Script", "Great Vibes", "Brush Script MT", "Snell Roundhand", cursive';

function formatSignatoryScriptName(name: string): string {
  return name.trim().replace(/\s+/g, " ").replace(/Bin([A-Z])/i, "Bin $1");
}

function docuLeftBracketPath(height: number): string {
  const top = 10;
  const bottom = height - 10;
  const x = 1;
  const r = 4;
  return `M ${x + r} ${top}
          Q ${x} ${top} ${x} ${top + r}
          L ${x} ${bottom - r}
          Q ${x} ${bottom} ${x + r} ${bottom}`;
}

function DocuSignBracketFrame({
  topLabel,
  bottomLabel,
  height,
  children,
  captionBelow,
  width = DOCUSIGN_SIGNATURE_W,
  clipContent = true,
  contentClassName = "left-2.5 right-2 top-[23px] bottom-[19px] items-center",
}: {
  topLabel: string;
  bottomLabel: ReactNode;
  height: number;
  children: ReactNode;
  captionBelow?: ReactNode;
  width?: number;
  clipContent?: boolean;
  contentClassName?: string;
}) {
  return (
    <div className="inline-flex flex-col" style={{ width }}>
      <div className="relative rounded-[2px] bg-white print:bg-white" style={{ width, height }}>
        <svg
          className="absolute left-0 top-0 pointer-events-none"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden
        >
          <path
            fill="none"
            stroke={DOCUSIGN_STROKE}
            strokeWidth={1.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            d={docuLeftBracketPath(height)}
          />
        </svg>
        <p className="absolute left-2 top-[7px] z-[1] bg-white pr-2 text-[10px] font-bold leading-none text-neutral-900">
          {topLabel}
        </p>
        <div
          className={`absolute flex justify-start ${contentClassName} ${clipContent ? "overflow-hidden" : "overflow-visible"}`}
        >
          {children}
        </div>
        <div className="absolute left-2 bottom-[7px] z-[1] max-w-[calc(100%-14px)] truncate bg-white pr-2 leading-none">
          {bottomLabel}
        </div>
      </div>
      {captionBelow ? (
        <p className="mt-1.5 mb-1 pl-2 text-[8.5px] font-medium text-neutral-500 leading-none">{captionBelow}</p>
      ) : null}
    </div>
  );
}

function ElectronicSignatureSeal({
  name,
  title,
  signatureUrl,
  membershipId,
}: {
  name: string;
  title: string;
  signatureUrl?: string | null;
  membershipId: string;
}) {
  return (
    <DocuSignBracketFrame
      topLabel="DocuSigned by:"
      captionBelow={title}
      bottomLabel={
        <span className="text-[8.5px] font-normal tracking-tight text-neutral-800">
          {membershipId}
          ..
        </span>
      }
      height={58}
      width={DOCUSIGN_SIGNATURE_W}
      clipContent={false}
      contentClassName="left-2.5 right-2 top-[21px] bottom-[20px] items-center"
    >
      {signatureUrl ? (
        <img src={signatureUrl} alt="" className="h-[24px] w-auto max-w-full object-contain object-left" />
      ) : (
        <p
          className="cert-signature-script w-full shrink-0 whitespace-nowrap text-[17px] leading-none text-neutral-900 max-[480px]:text-[19px]"
          style={{ fontFamily: SIGNATURE_SCRIPT_FONT, fontWeight: 400 }}
        >
          {formatSignatoryScriptName(name)}
        </p>
      )}
    </DocuSignBracketFrame>
  );
}

export function VerifyHeadingRow({ heading }: { heading: string }) {
  const sep = heading.indexOf("·");
  if (sep === -1) {
    return (
      <p className="text-[11px] font-bold" style={{ color: OFFICIAL_CERT_NAVY }}>
        {heading}
      </p>
    );
  }
  const en = heading.slice(0, sep).trim();
  const ar = heading.slice(sep + 1).trim();
  return (
    <div className="flex w-full items-baseline justify-between gap-3">
      <p className="text-[11px] font-bold leading-tight text-left" style={{ color: OFFICIAL_CERT_NAVY }}>
        {en}
      </p>
      <p
        className="text-[11px] font-bold font-arabic leading-tight text-right"
        dir="rtl"
        style={{ color: OFFICIAL_CERT_NAVY }}
      >
        {ar}
      </p>
    </div>
  );
}

export function OfficialSignatoryStack({
  closingEn,
  officeNameEn,
  signatoryName,
  signatoryTitle,
  signatureUrl,
  membershipId,
  electronicAuthHeading,
  electronicAuthBody,
  compact,
}: {
  closingEn: string;
  officeNameEn: string;
  signatoryName: string;
  signatoryTitle: string;
  signatureUrl?: string | null;
  membershipId: string;
  electronicAuthHeading: string;
  electronicAuthBody: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[7px]">
      <div className={compact ? "mb-0.5" : "mb-1 pt-1"}>
        <p className={`${compact ? "text-xs" : "text-sm"} font-bold leading-tight text-neutral-900`}>{closingEn}</p>
        <p className={`mt-0.5 ${compact ? "text-[10px]" : "text-[12px]"} font-bold leading-snug text-neutral-800`}>
          {officeNameEn}
        </p>
      </div>
      <div className="flex flex-col gap-0">
        <ElectronicSignatureSeal
          name={signatoryName}
          title={signatoryTitle}
          signatureUrl={signatureUrl}
          membershipId={membershipId}
        />
        <ElectronicAuthenticationBadge heading={electronicAuthHeading} body={electronicAuthBody} />
      </div>
    </div>
  );
}

export function ElectronicAuthenticationBadge({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="mt-0.5 w-full max-w-[262px] pl-2 pr-1 text-left">
      <div className="border-b border-neutral-400" style={{ borderColor: OFFICIAL_CERT_NAVY }} aria-hidden />
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        <p className="text-[9px] font-bold tracking-[0.06em] text-neutral-900 leading-tight not-italic">{heading}</p>
        <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: OFFICIAL_CERT_GOLD }} strokeWidth={1.75} aria-hidden />
      </div>
      <p className="mt-1 text-[8.5px] font-normal italic leading-[1.45] text-neutral-600">{body}</p>
    </div>
  );
}