/** Shared print CSS for certificate routes (toolbar hidden, site chrome hidden, single A4 page). */
/** Screen: keep signature script consistent when the page is scaled on mobile */
export const CERTIFICATE_SIGNATURE_SCREEN_CSS = `
  @media screen {
    .certificate-a4-page,
    .certificate-a4-landscape-page {
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    .cert-signature-script {
      font-family: "Segoe Script", "Great Vibes", "Brush Script MT", "Snell Roundhand", cursive !important;
      font-weight: 400 !important;
      font-synthesis: none;
      -webkit-font-smoothing: antialiased;
    }
  }
`;

export const CERTIFICATE_GLOBAL_PRINT_CSS = `
  @media print {
    .no-print,
    .viso-chatbot-root,
    .viso-whatsapp-float,
  .viso-custom-cursor-root {
      display: none !important;
    }
  }
`;

export const CERTIFICATE_SINGLE_PAGE_PRINT_CSS = `
  @media print {
    @page {
      size: A4 portrait;
      margin: 6mm;
    }
    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      height: auto !important;
      min-height: 0 !important;
    }
    .certificate-print-root {
      min-height: 0 !important;
      height: auto !important;
      padding: 0 !important;
      margin: 0 !important;
      background: white !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: flex-start !important;
      width: 100% !important;
    }
    .cert-official-viewport-outer {
      width: 100% !important;
      max-width: none !important;
      display: block !important;
    }
    .cert-official-viewport-box {
      width: auto !important;
      max-width: none !important;
      height: auto !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .certificate-a4-page {
      width: 100% !important;
      max-width: 198mm !important;
      height: auto !important;
      max-height: none !important;
      min-height: 0 !important;
      margin: 0 auto !important;
      box-shadow: none !important;
      overflow: visible !important;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
      break-inside: avoid-page !important;
      zoom: var(--cert-print-zoom, 1);
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .cert-print-footer {
      margin-top: 4mm !important;
      margin-bottom: 2mm !important;
    }
    .cert-print-footer [class*="min-h-"] {
      min-height: 0 !important;
      padding-top: 2mm !important;
      padding-bottom: 2mm !important;
    }
    .cert-print-legal-tri .cert-print-legal-col {
      font-size: 9px !important;
      line-height: 1.42 !important;
    }
    .cert-print-commission {
      max-height: 92px !important;
    }
    .cert-print-qr img {
      width: 84px !important;
      height: 84px !important;
    }
    .cert-signature-script {
      font-family: "Segoe Script", "Great Vibes", "Brush Script MT", "Snell Roundhand", cursive !important;
      font-size: 17px !important;
      font-weight: 400 !important;
    }
    .cert-official-viewport-box,
    .cert-official-viewport-page {
      position: static !important;
      width: auto !important;
      height: auto !important;
      transform: none !important;
    }
  }
`;

export const CERTIFICATE_LANDSCAPE_PRINT_CSS = `
  @media print {
    @page {
      size: A4 landscape;
      margin: 6mm;
    }
    .certificate-a4-landscape-page {
      width: 100% !important;
      max-width: 285mm !important;
      height: auto !important;
      max-height: 198mm !important;
      min-height: 0 !important;
      margin: 0 auto !important;
      box-shadow: none !important;
      overflow: hidden !important;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
      break-inside: avoid-page !important;
      zoom: var(--cert-print-zoom, 1);
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .cert-panorama-page {
      display: flex !important;
      flex-direction: column !important;
    }
    .cert-panorama-header img {
      max-height: 12mm !important;
    }
    .cert-panorama-sidebar {
      width: 26% !important;
      min-width: 50mm !important;
    }
    .cert-panorama-main {
      min-height: 175mm !important;
      flex: 1 !important;
    }
    .cert-panorama-legal.cert-print-legal-tri .cert-print-legal-col {
      font-size: 8.5px !important;
      line-height: 1.5 !important;
      padding-top: 3mm !important;
      padding-bottom: 3mm !important;
    }
    .cert-panorama-legal .space-y-3 > p + p {
      margin-top: 2.5mm !important;
    }
    .cert-print-footer {
      margin-top: 2mm !important;
      margin-bottom: 0 !important;
    }
    .cert-print-qr img {
      width: 72px !important;
      height: 72px !important;
    }
  }
`;