const CERT_ID_PATTERN = /^VISO-TR-(\d{4})-(\d+)$/i;

/** Official 5-digit run starting at VISO-TR-2026-00984 (next: 00985, 00986, …). */
const CERT_SERIAL_WIDTH_BY_YEAR: Record<number, number> = {
  2026: 5,
};

/** Highest serial already issued for that year (next = floor + 1 unless a higher valid ID exists). */
const CERT_SERIAL_FLOOR_BY_YEAR: Record<number, number> = {
  2026: 984,
};

export function parseCertificateId(id: string): { year: number; serial: number; width: number } | null {
  const match = id.trim().toUpperCase().match(CERT_ID_PATTERN);
  if (!match) return null;
  return {
    year: parseInt(match[1], 10),
    serial: parseInt(match[2], 10),
    width: match[2].length,
  };
}

function isOfficialSerial(parsed: { serial: number; width: number }, year: number): boolean {
  const maxWidth = CERT_SERIAL_WIDTH_BY_YEAR[year] ?? 6;
  const maxValue = 10 ** maxWidth - 1;
  return (
    parsed.width <= maxWidth &&
    parsed.serial >= 1 &&
    parsed.serial <= maxValue &&
    Number.isFinite(parsed.serial)
  );
}

/** Next ID after the highest valid serial for the year (e.g. …-00984 → …-00985). */
export function computeNextCertificateId(
  existingIds: string[],
  year: number = new Date().getFullYear()
): string {
  const serialWidth = CERT_SERIAL_WIDTH_BY_YEAR[year] ?? 6;
  let maxSerial = CERT_SERIAL_FLOOR_BY_YEAR[year] ?? 0;

  for (const id of existingIds) {
    const parsed = parseCertificateId(id);
    if (!parsed || parsed.year !== year || !isOfficialSerial(parsed, year)) continue;
    if (parsed.serial > maxSerial) {
      maxSerial = parsed.serial;
    }
  }

  const nextSerial = maxSerial + 1;
  return `VISO-TR-${year}-${nextSerial.toString().padStart(serialWidth, "0")}`;
}

/** Internal verification reference stored in DB (not shown on the issue form). */
export function generateVerificationReferenceId(): string {
  return `1${Math.floor(100000000 + Math.random() * 900000000)}`;
}

export function getPublicSiteOrigin(): string {
  const fromEnv = import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined;
  if (typeof fromEnv === "string" && fromEnv.trim()) {
    return fromEnv.trim().replace(/\/$/, "");
  }
  return "https://visogroup.com";
}

export function getPublicCertificateUrl(certificateId: string): string {
  const id = certificateId.trim().toUpperCase();
  return `${getPublicSiteOrigin()}/certificate/${encodeURIComponent(id)}`;
}

export function getCertificatePreviewUrl(template: string): string {
  const t = encodeURIComponent(template);
  return `${getPublicSiteOrigin()}/certificate/preview?template=${t}`;
}
