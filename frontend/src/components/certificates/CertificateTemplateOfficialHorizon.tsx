import { useState, type ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import type { CertificateViewProps } from "@/components/certificates/CertificateDocument";
import { buildCertificatePlaceholderVars, fillCertificateCopy } from "@/lib/certificateCopy";
import {
  CERTIFICATE_A4_LANDSCAPE_PAGE_CLASS,
  VISO_OFFICIAL_DOC_LOGO_EN,
  VISO_OFFICIAL_DOC_LOGO_MARK,
  SAUDI_TRANSLATION_COMMISSION_LOGO,
  SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK,
  formatCertDisplayDate,
} from "@/lib/certificateTemplates";
import {
  certificateShowsClientCr,
  localizeCertificateLanguage,
  resolveClassicClientNameAr,
  textDirectionForContent,
} from "@/lib/certificateDisplay";
import {
  buildThirdLanguageLegalBlock,
  buildThirdLanguageVerifyLine,
  resolveTrilingualThirdLanguageName,
} from "@/lib/certificateOfficialThirdLegal";
import { getPublicSiteOrigin } from "@/lib/certificateIds";
import { CertificateOfficialViewport } from "@/components/certificates/CertificateOfficialViewport";
import {
  CERTIFICATE_LANDSCAPE_PRINT_CSS,
  CERTIFICATE_SIGNATURE_SCREEN_CSS,
} from "@/components/certificates/certificatePrintStyles";
import {
  CERTIFICATE_HORIZON_FONT_CSS,
  CERTIFICATE_HORIZON_LAYOUT_CSS,
  CERTIFICATE_HORIZON_PRINT_CSS,
} from "@/components/certificates/certificateHorizonStyles";
import { OFFICIAL_CERT_GOLD } from "@/components/certificates/officialCertificateAttestation";

const SIGNATURE_SCRIPT_FONT =
  '"Segoe Script", "Great Vibes", "Brush Script MT", "Snell Roundhand", cursive';

function formatSignatoryScriptName(name: string): string {
  return name.trim().replace(/\s+/g, " ").replace(/Bin([A-Z])/i, "Bin $1");
}

function HorizonMetaItem({
  labelEn,
  labelAr,
  children,
}: {
  labelEn: string;
  labelAr: string;
  children: ReactNode;
}) {
  return (
    <div className="cert-horizon-meta-item">
      <div className="cert-horizon-meta-head">
        <span>{labelEn}</span>
        <span className="cert-horizon-meta-ar">{labelAr}</span>
      </div>
      {children}
    </div>
  );
}

function HorizonCommissionLogo() {
  const [src, setSrc] = useState(SAUDI_TRANSLATION_COMMISSION_LOGO);
  return (
    <img
      src={src}
      alt="Literature, Publishing & Translation Commission"
      onError={() => {
        if (src !== SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK) {
          setSrc(SAUDI_TRANSLATION_COMMISSION_LOGO_FALLBACK);
        }
      }}
    />
  );
}

/** Official — Horizon: landscape registry layout (design reference HTML). */
export function CertificateTemplateOfficialHorizon(props: CertificateViewProps) {
  const { cert, certId, qrUrl, branding, bannerLabel, copy } = props;
  const refDate = formatCertDisplayDate(cert.issue_date);
  const clientEn = cert.project_name;
  const clientAr = resolveClassicClientNameAr(cert.project_name, cert.project_name_ar);
  const srcEn = cert.source_lang;
  const tgtEn = cert.target_lang;
  const srcAr = localizeCertificateLanguage(cert.source_lang, true);
  const tgtAr = localizeCertificateLanguage(cert.target_lang, true);
  const origin = getPublicSiteOrigin();
  const vars = buildCertificatePlaceholderVars(cert, certId, copy);
  const o = copy.official;
  const legalEn1 = fillCertificateCopy(o.legalEn1, vars);
  const legalEn2 = fillCertificateCopy(o.legalEn2, vars);
  const legalEn3 = fillCertificateCopy(o.legalEn3, vars);
  const legalAr1 = fillCertificateCopy(o.legalAr1, vars);
  const legalAr2 = fillCertificateCopy(o.legalAr2, vars);
  const legalAr3 = fillCertificateCopy(o.legalAr3, vars);
  const thirdLangName = resolveTrilingualThirdLanguageName(cert.source_lang, cert.target_lang);
  const thirdBlock = buildThirdLanguageLegalBlock(thirdLangName, vars);
  const thirdVerify = buildThirdLanguageVerifyLine(thirdLangName, vars);

  return (
    <>
      <style>
        {CERTIFICATE_HORIZON_FONT_CSS}
        {CERTIFICATE_SIGNATURE_SCREEN_CSS}
        {CERTIFICATE_LANDSCAPE_PRINT_CSS}
        {CERTIFICATE_HORIZON_LAYOUT_CSS}
        {CERTIFICATE_HORIZON_PRINT_CSS}
      </style>
      <CertificateOfficialViewport>
        <div
          className={`bg-white ${CERTIFICATE_A4_LANDSCAPE_PAGE_CLASS} certificate-a4-landscape-page cert-horizon-root shadow-2xl mx-auto print:shadow-none overflow-hidden`}
        >
          {bannerLabel ? (
            <div className="bg-amber-600 text-white text-center text-[10px] font-bold py-1.5 px-3 print:hidden">
              {bannerLabel}
            </div>
          ) : null}
          <div className="cert-horizon-sheet">
            <aside className="cert-horizon-sidebar">
              <div>
                <div className="cert-horizon-brand">
                  <img src={VISO_OFFICIAL_DOC_LOGO_EN} alt="Vision of Solutions — Translation Services" />
                </div>
                <div className="cert-horizon-meta-list">
                  <HorizonMetaItem labelEn="Ref. No" labelAr="رقم المرجع">
                    <div className="cert-horizon-meta-val font-mono text-[8pt] break-all">{certId}</div>
                  </HorizonMetaItem>
                  <HorizonMetaItem labelEn="Date" labelAr="التاريخ">
                    <div className="cert-horizon-meta-val" dir="ltr">
                      {refDate}
                    </div>
                  </HorizonMetaItem>
                  <HorizonMetaItem labelEn="Chamber Membership" labelAr="عضوية الغرفة التجارية">
                    <div className="cert-horizon-meta-val font-mono">{branding.riyadhChamberMembershipId}</div>
                  </HorizonMetaItem>
                  <HorizonMetaItem labelEn="Client" labelAr="العميل">
                    <div className="cert-horizon-meta-val" dir={textDirectionForContent(clientEn)}>
                      {clientEn}
                    </div>
                    <div className="cert-horizon-meta-val-ar">{clientAr}</div>
                  </HorizonMetaItem>
                  {certificateShowsClientCr(cert) ? (
                    <HorizonMetaItem labelEn="CR No." labelAr="رقم السجل التجاري">
                      <div className="cert-horizon-meta-val font-mono">{cert.client_cr_number}</div>
                    </HorizonMetaItem>
                  ) : null}
                  <HorizonMetaItem labelEn="From · Source" labelAr="من · اللغة المصدر">
                    <div className="cert-horizon-meta-val">{srcEn}</div>
                    <div className="cert-horizon-meta-val-ar">{srcAr}</div>
                  </HorizonMetaItem>
                  <HorizonMetaItem labelEn="To · Target" labelAr="إلى · اللغة الهدف">
                    <div className="cert-horizon-meta-val">{tgtEn}</div>
                    <div className="cert-horizon-meta-val-ar">{tgtAr}</div>
                  </HorizonMetaItem>
                </div>
              </div>
              <div className="cert-horizon-qr-box cert-print-qr">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrUrl)}`}
                  alt="Certificate verification QR"
                />
                <div className="cert-horizon-qr-caption">Scan to verify</div>
              </div>
            </aside>

            <section className="cert-horizon-main">
              <header className="cert-horizon-top-header">
                <div className="cert-horizon-title-group">
                  <h1 className="cert-horizon-title-en">Certificate of Translation Accuracy</h1>
                  <div className="cert-horizon-title-ar">شهادة دقة ترجمة الوثائق</div>
                </div>
                <div className="cert-horizon-emblem">
                  <img src={VISO_OFFICIAL_DOC_LOGO_MARK} alt="VISO — Vision of Solutions" />
                </div>
              </header>

              <div className="cert-horizon-statements cert-print-legal cert-print-legal-tri cert-panorama-legal">
                <article className="cert-horizon-stmt-card cert-print-legal-col">
                  <div className="cert-horizon-stmt-head">
                    <span>English Certification</span>
                    <span>EN</span>
                  </div>
                  <p className="cert-horizon-stmt-body-en">{legalEn1}</p>
                  <p className="cert-horizon-stmt-body-en">{legalEn2}</p>
                  <p className="cert-horizon-stmt-body-en">{legalEn3}</p>
                </article>
                <article className="cert-horizon-stmt-card cert-print-legal-col">
                  <div className="cert-horizon-stmt-head">
                    <span>Arabic Certification</span>
                    <span className="cert-horizon-stmt-head-ar">العربية شهادة</span>
                  </div>
                  <p className="cert-horizon-stmt-body-ar">{legalAr1}</p>
                  <p className="cert-horizon-stmt-body-ar">{legalAr2}</p>
                  <p className="cert-horizon-stmt-body-ar">{legalAr3}</p>
                </article>
                <article
                  className={`cert-horizon-stmt-card cert-print-legal-col ${thirdBlock.fontClass ?? ""}`}
                  dir={thirdBlock.dir ?? "ltr"}
                >
                  <div className="cert-horizon-stmt-head">
                    <span>{thirdLangName} Certification</span>
                    <span>{thirdBlock.heading}</span>
                  </div>
                  <p className="cert-horizon-stmt-body-third">{thirdBlock.body}</p>
                </article>
              </div>

              <div className="cert-horizon-auth-grid cert-print-footer">
                <div className="cert-horizon-auth-box">
                  <div className="cert-horizon-auth-label">
                    {o.closingEn}
                    <br />
                    {o.officeNameEn}
                  </div>
                  <div>
                    <div className="cert-horizon-sig-line" />
                    {branding.signatureUrl ? (
                      <img
                        src={branding.signatureUrl}
                        alt=""
                        className="h-[18px] w-auto object-contain object-left mb-0.5"
                      />
                    ) : (
                      <p
                        className="cert-signature-script text-[9pt] font-normal text-[var(--hz-navy)] mb-0.5"
                        style={{ fontFamily: SIGNATURE_SCRIPT_FONT }}
                      >
                        {formatSignatoryScriptName(o.signatoryNameEn)}
                      </p>
                    )}
                    <div className="cert-horizon-auth-sub">{o.signatoryTitleEn}</div>
                  </div>
                </div>
                <div className="cert-horizon-auth-box cert-horizon-commission cert-print-commission flex items-center justify-center">
                  <HorizonCommissionLogo />
                </div>
                <div className="cert-horizon-auth-box cert-horizon-elec">
                  <div className="cert-horizon-elec-heading">
                    {o.electronicAuthHeadingEn}
                    <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: OFFICIAL_CERT_GOLD }} strokeWidth={1.75} aria-hidden />
                  </div>
                  <p className="cert-horizon-elec-note">{o.electronicAuthBodyEn}</p>
                </div>
              </div>

              <footer className="cert-horizon-footer">
                <div className="cert-horizon-verify-row">
                  <p>{fillCertificateCopy(o.verifyEn, vars)}</p>
                  <p className="cert-horizon-verify-ar">{fillCertificateCopy(o.verifyAr, vars)}</p>
                  {thirdVerify ? (
                    <p className="cert-horizon-stmt-body-third" dir={thirdBlock.dir}>
                      {thirdVerify}
                    </p>
                  ) : (
                    <span />
                  )}
                </div>
                <div className="cert-horizon-footer-meta">
                  <span>{certId}</span>
                  <span>•</span>
                  <span>{origin.replace(/^https?:\/\//, "")}/translation</span>
                </div>
              </footer>
            </section>
          </div>
        </div>
      </CertificateOfficialViewport>
    </>
  );
}