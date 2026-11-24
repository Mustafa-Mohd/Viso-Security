/** Printable margin when saving PDF / printing (mm per edge). */
const PRINT_PAGE_MARGIN_MM = 6;
const MM_TO_PX = 96 / 25.4;
function printableAreaPx(landscape: boolean) {
  const m = PRINT_PAGE_MARGIN_MM;
  const widthMm = landscape ? 297 : 210;
  const heightMm = landscape ? 210 : 297;
  return {
    width: (widthMm - 2 * m) * MM_TO_PX,
    height: (heightMm - 2 * m) * MM_TO_PX,
  };
}

/** Scale official A4 certificate to fit one printed page with even border gap. */
export function applyCertificatePrintZoom(): void {
  const landscapeSheet = document.querySelector(".certificate-a4-landscape-page");
  const portraitSheet = document.querySelector(".certificate-a4-page");
  const target =
    landscapeSheet instanceof HTMLElement
      ? landscapeSheet
      : portraitSheet instanceof HTMLElement
        ? portraitSheet
        : null;
  if (!target) {
    document.documentElement.style.removeProperty("--cert-print-zoom");
    return;
  }
  const landscape = target.classList.contains("certificate-a4-landscape-page");
  const { width: maxW, height: maxH } = printableAreaPx(landscape);
  const w = target.offsetWidth;
  const h = target.offsetHeight;
  if (w <= 0 || h <= 0) return;
  const zoom = Math.min(maxW / w, maxH / h, 1);
  document.documentElement.style.setProperty("--cert-print-zoom", String(zoom));
}

export function clearCertificatePrintZoom(): void {
  document.documentElement.style.removeProperty("--cert-print-zoom");
}