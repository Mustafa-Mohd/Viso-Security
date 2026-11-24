/** Landscape Horizon registry layout (scoped under .cert-horizon-sheet). */
export const CERTIFICATE_HORIZON_FONT_CSS = `
  @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap");
`;

export const CERTIFICATE_HORIZON_LAYOUT_CSS = `
  .cert-horizon-sheet {
    --hz-navy: #132238;
    --hz-navy-mid: #233856;
    --hz-gold: #a8823c;
    --hz-gold-light: #c8a258;
    --hz-cream-panel: #f6f3ec;
    --hz-cream-soft: #faf8f4;
    --hz-border-soft: #e3dccb;
    --hz-text-main: #1f2933;
    --hz-text-muted: #52606d;
    font-family: "IBM Plex Sans", system-ui, sans-serif;
    color: var(--hz-text-main);
    display: grid;
    grid-template-columns: 76mm 1fr;
    overflow: hidden;
    height: 100%;
    min-height: 210mm;
  }
  .cert-horizon-sidebar {
    background: var(--hz-cream-panel);
    border-right: 1px solid var(--hz-border-soft);
    padding: 6mm 5.5mm 5.5mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 0;
  }
  .cert-horizon-brand {
    border-bottom: 1.5px solid var(--hz-gold);
    padding-bottom: 3mm;
  }
  .cert-horizon-brand img {
    width: 100%;
    max-height: 14mm;
    object-fit: contain;
    object-position: left center;
  }
  .cert-horizon-meta-list {
    display: flex;
    flex-direction: column;
    gap: 2.8mm;
    margin-top: 2mm;
    flex: 1;
  }
  .cert-horizon-meta-item {
    border-bottom: 1px solid #e7e1d2;
    padding-bottom: 2mm;
  }
  .cert-horizon-meta-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 4px;
    font-size: 6.8pt;
    font-weight: 700;
    letter-spacing: 0.7px;
    color: var(--hz-text-muted);
    text-transform: uppercase;
  }
  .cert-horizon-meta-ar {
    font-family: "Noto Naskh Arabic", serif;
    font-size: 7.2pt;
    font-weight: 600;
    color: var(--hz-gold);
    direction: rtl;
    text-transform: none;
    letter-spacing: 0;
  }
  .cert-horizon-meta-val {
    font-size: 9pt;
    font-weight: 700;
    color: var(--hz-navy);
    margin-top: 0.8mm;
    line-height: 1.25;
  }
  .cert-horizon-meta-val-ar {
    font-family: "Noto Naskh Arabic", serif;
    font-size: 8.4pt;
    font-weight: 600;
    color: var(--hz-navy-mid);
    direction: rtl;
    text-align: right;
    margin-top: 0.5mm;
  }
  .cert-horizon-qr-box {
    background: #fff;
    border: 1px solid var(--hz-border-soft);
    border-radius: 4px;
    padding: 2.5mm;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5mm;
    margin-top: 3mm;
  }
  .cert-horizon-qr-box img {
    width: 20mm;
    height: 20mm;
  }
  .cert-horizon-qr-caption {
    font-size: 7pt;
    font-weight: 700;
    letter-spacing: 0.9px;
    color: var(--hz-navy);
    text-transform: uppercase;
  }
  .cert-horizon-main {
    padding: 6.5mm 8mm 5.5mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 3mm;
    min-width: 0;
    min-height: 0;
  }
  .cert-horizon-top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid var(--hz-gold);
    padding-bottom: 2.5mm;
    gap: 8px;
  }
  .cert-horizon-title-group {
    text-align: center;
    flex: 1;
  }
  .cert-horizon-title-en {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 19pt;
    font-weight: 700;
    color: var(--hz-navy);
    line-height: 1.08;
    letter-spacing: 0.2px;
    text-transform: uppercase;
  }
  .cert-horizon-title-ar {
    font-family: "Noto Naskh Arabic", serif;
    font-size: 13pt;
    font-weight: 700;
    color: var(--hz-gold);
    direction: rtl;
    margin-top: 0.5mm;
  }
  .cert-horizon-emblem {
    width: 22mm;
    flex-shrink: 0;
    text-align: right;
    border-left: 1px solid var(--hz-border-soft);
    padding-left: 2.5mm;
  }
  .cert-horizon-emblem img {
    max-height: 16mm;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    object-position: right center;
    margin-left: auto;
    display: block;
  }
  .cert-horizon-statements {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3mm;
    flex: 1;
    min-height: 0;
    align-items: stretch;
  }
  .cert-horizon-stmt-card {
    background: var(--hz-cream-soft);
    border: 1px solid var(--hz-border-soft);
    border-top: 2.5px solid var(--hz-gold);
    border-radius: 3px;
    padding: 2.5mm 3mm;
    display: flex;
    flex-direction: column;
    gap: 1.5mm;
    min-height: 0;
  }
  .cert-horizon-stmt-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e7e1d2;
    padding-bottom: 1.2mm;
    font-size: 7pt;
    font-weight: 700;
    color: var(--hz-navy);
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .cert-horizon-stmt-head-ar {
    font-family: "Noto Naskh Arabic", serif;
    font-size: 8.2pt;
    font-weight: 700;
    color: var(--hz-gold);
    direction: rtl;
    text-transform: none;
  }
  .cert-horizon-stmt-body-en {
    font-size: 7.4pt;
    line-height: 1.46;
    text-align: left;
  }
  .cert-horizon-stmt-body-ar {
    font-family: "Noto Naskh Arabic", serif;
    font-size: 8pt;
    line-height: 1.52;
    direction: rtl;
    text-align: right;
  }
  .cert-horizon-stmt-body-third {
    font-size: 7.3pt;
    line-height: 1.48;
    text-align: left;
  }
  .cert-horizon-auth-grid {
    display: grid;
    grid-template-columns: 1.15fr 1fr 1.05fr;
    gap: 3mm;
    flex-shrink: 0;
  }
  .cert-horizon-auth-box {
    background: var(--hz-cream-soft);
    border: 1px solid var(--hz-border-soft);
    border-top: 2px solid var(--hz-navy);
    border-radius: 3px;
    padding: 2.4mm 3mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 24mm;
  }
  .cert-horizon-auth-label {
    font-size: 7.1pt;
    font-weight: 700;
    color: var(--hz-navy);
    line-height: 1.32;
  }
  .cert-horizon-sig-line {
    border-bottom: 1px solid var(--hz-navy);
    margin-top: 3.5mm;
    margin-bottom: 1mm;
  }
  .cert-horizon-auth-sub {
    font-size: 6.6pt;
    font-weight: 600;
    color: var(--hz-text-muted);
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .cert-horizon-commission img {
    max-height: 18mm;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    margin: 0 auto;
    display: block;
  }
  .cert-horizon-elec .cert-horizon-elec-heading {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    font-size: 7.1pt;
    font-weight: 700;
    color: var(--hz-navy);
    letter-spacing: 0.05em;
  }
  .cert-horizon-elec-note {
    font-size: 6.9pt;
    line-height: 1.38;
    color: var(--hz-text-muted);
    margin-top: 1.2mm;
    font-style: italic;
  }
  .cert-horizon-footer {
    border-top: 1.5px solid var(--hz-navy);
    padding-top: 2mm;
    flex-shrink: 0;
  }
  .cert-horizon-verify-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3mm;
    font-size: 6.7pt;
    line-height: 1.35;
    color: var(--hz-text-muted);
  }
  .cert-horizon-verify-ar {
    font-family: "Noto Naskh Arabic", serif;
    font-size: 7.2pt;
    line-height: 1.4;
    color: var(--hz-text-main);
    direction: rtl;
    text-align: right;
  }
  .cert-horizon-footer-meta {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    font-size: 7.5pt;
    font-weight: 700;
    color: var(--hz-gold);
    letter-spacing: 0.4px;
    margin-top: 1.5mm;
  }
`;

export const CERTIFICATE_HORIZON_PRINT_CSS = `
  @media print {
    @page {
      size: A4 landscape;
      margin: 0;
    }
    .certificate-a4-landscape-page.cert-horizon-root {
      zoom: var(--cert-print-zoom, 1);
    }
  }
`;