/** Shared print CSS for certificate routes (toolbar hidden, site chrome hidden, single A4 page). */
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
      margin: 0;
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
      width: 210mm !important;
      max-width: 210mm !important;
      height: auto !important;
      max-height: none !important;
      min-height: 0 !important;
      margin: 0 auto !important;
      box-shadow: none !important;
      overflow: visible !important;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
      break-inside: avoid-page !important;
      zoom: 0.86;
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
    .cert-print-commission {
      max-height: 92px !important;
    }
    .cert-print-qr img {
      width: 84px !important;
      height: 84px !important;
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