import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { DEFAULT_CERTIFICATE_BRANDING, fetchCertificateBranding } from "@/lib/certificateBranding";
import { DEFAULT_CERTIFICATE_COPY, CERTIFICATE_PREVIEW_SAMPLE, fetchCertificateCopy } from "@/lib/certificateCopy";
import { getPublicSiteOrigin } from "@/lib/certificateIds";
import { normalizeCertificateTemplateParam, type CertificateTemplateId } from "@/lib/certificateTemplates";
import { CertificateTemplateClassic } from "@/components/certificates/CertificateDocument";
import { CertificateTemplateOfficialDoc } from "@/components/certificates/CertificateTemplateOfficialDoc";
import { CertificateTemplateOfficialPanorama } from "@/components/certificates/CertificateTemplateOfficialPanorama";
import { CertificatePrintToolbar } from "@/components/certificates/CertificatePrintToolbar";
import { CERTIFICATE_GLOBAL_PRINT_CSS } from "@/components/certificates/certificatePrintStyles";

export const Route = createFileRoute("/certificate/preview")({
  validateSearch: (search: Record<string, unknown>) => ({
    template: normalizeCertificateTemplateParam(
      typeof search.template === "string" ? search.template : "official"
    ),
  }),
  component: CertificatePreviewPage,
});

function CertificatePreviewPage() {
  const { template } = Route.useSearch();
  const [branding, setBranding] = useState(DEFAULT_CERTIFICATE_BRANDING);
  const [copy, setCopy] = useState(DEFAULT_CERTIFICATE_COPY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [b, c] = await Promise.all([fetchCertificateBranding(), fetchCertificateCopy()]);
        setBranding(b);
        setCopy(c);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cert = {
    ...CERTIFICATE_PREVIEW_SAMPLE,
    template,
    ...(template === "official_trilingual" || template === "official_panorama"
      ? { source_lang: "English", target_lang: "Hindi" }
      : null),
  };
  const certId = cert.id;
  const origin = getPublicSiteOrigin();
  const qrUrl = `${origin}/translation?verify=${certId}&nationalId=${cert.national_id}`;

  const viewProps = {
    cert,
    certId,
    qrUrl,
    branding,
    copy,
    displayStatus: "active" as const,
    bannerLabel: null,
    watermarkLabel: null,
    isWithinValidity: true,
    isPastExpiry: false,
    isRevoked: false,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-200">
        <RefreshCw className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <style>{CERTIFICATE_GLOBAL_PRINT_CSS}</style>
      <div className="certificate-print-root min-h-screen w-full bg-neutral-300 py-6 px-2 overflow-x-hidden flex flex-col items-center print:justify-start print:items-center print:overflow-visible print:min-h-0 print:h-auto print:bg-white print:py-0 print:px-0">
        <CertificatePrintToolbar certId={certId} />
        {(template === "official" || template === "official_trilingual") && (
          <CertificateTemplateOfficialDoc {...viewProps} />
        )}
        {template === "official_panorama" && <CertificateTemplateOfficialPanorama {...viewProps} />}
        {template === "classic" && <CertificateTemplateClassic {...viewProps} />}
      </div>
    </>
  );
}
