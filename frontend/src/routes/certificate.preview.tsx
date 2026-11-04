import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { DEFAULT_CERTIFICATE_BRANDING, fetchCertificateBranding } from "@/lib/certificateBranding";
import { DEFAULT_CERTIFICATE_COPY, CERTIFICATE_PREVIEW_SAMPLE, fetchCertificateCopy } from "@/lib/certificateCopy";
import { getPublicSiteOrigin } from "@/lib/certificateIds";
import type { CertificateTemplateId } from "@/lib/certificateTemplates";
import {
  CertificateTemplateAccreditation,
  CertificateTemplateClassic,
  CertificateTemplateTrilingual,
} from "@/components/certificates/CertificateDocument";
import { CertificateTemplateOfficialDoc } from "@/components/certificates/CertificateTemplateOfficialDoc";

export const Route = createFileRoute("/certificate/preview")({
  validateSearch: (search: Record<string, unknown>) => ({
    template: (typeof search.template === "string" ? search.template : "official") as CertificateTemplateId,
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

  const cert = { ...CERTIFICATE_PREVIEW_SAMPLE, template };
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
    <div className="min-h-screen bg-neutral-300 py-6 px-2 print:bg-white">
      {template === "trilingual" && <CertificateTemplateTrilingual {...viewProps} />}
      {template === "accreditation" && <CertificateTemplateAccreditation {...viewProps} />}
      {template === "official" && <CertificateTemplateOfficialDoc {...viewProps} />}
      {template === "classic" && <CertificateTemplateClassic {...viewProps} />}
    </div>
  );
}
