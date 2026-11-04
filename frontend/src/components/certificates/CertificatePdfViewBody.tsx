import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { certsApi, getCertificateDisplayStatus } from "@/lib/certsApi";
import { fetchCertificateBranding, DEFAULT_CERTIFICATE_BRANDING } from "@/lib/certificateBranding";
import { resolveCertificateTemplate } from "@/lib/certificateTemplates";
import { getPublicSiteOrigin } from "@/lib/certificateIds";
import {
  CertificateTemplateAccreditation,
  CertificateTemplateClassic,
  CertificateTemplateTrilingual,
} from "@/components/certificates/CertificateDocument";
import { CertificateTemplateOfficialDoc } from "@/components/certificates/CertificateTemplateOfficialDoc";

export function CertificatePdfViewBody({ certId }: { certId: string }) {
  const [certData, setCertData] = useState<Awaited<ReturnType<typeof certsApi.getCertificateById>>>(null);
  const [branding, setBranding] = useState(DEFAULT_CERTIFICATE_BRANDING);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const [cert, brand] = await Promise.all([
          certsApi.getCertificateById(certId),
          fetchCertificateBranding(),
        ]);
        setCertData(cert);
        setBranding(brand);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [certId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 font-sans">
        <RefreshCw className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!certData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 font-sans">
        <p className="text-neutral-600">Certificate not found.</p>
      </div>
    );
  }

  const origin = getPublicSiteOrigin();
  const qrUrl = `${origin}/translation?verify=${certId}&nationalId=${certData.national_id}`;
  const displayStatus = getCertificateDisplayStatus(certData);
  const isWithinValidity = displayStatus === "active";
  const isPastExpiry = displayStatus === "expired";
  const isRevoked = displayStatus === "revoked";
  const isPending = displayStatus === "pending";

  const bannerLabel =
    isPastExpiry ? `Validity ended ${certData.expiry_date}` :
    isRevoked ? "Withdrawn from registry" :
    isPending ? `Effective from ${certData.issue_date}` :
    null;

  const watermarkLabel =
    isPastExpiry ? `Ended ${certData.expiry_date}` :
    isRevoked ? "Withdrawn" :
    isPending ? `From ${certData.issue_date}` :
    null;

  const viewProps = {
    cert: certData,
    certId,
    qrUrl,
    branding,
    displayStatus,
    bannerLabel,
    watermarkLabel,
    isWithinValidity,
    isPastExpiry,
    isRevoked,
  };

  const template = resolveCertificateTemplate(certData);

  return (
    <div className="min-h-screen bg-neutral-300 flex flex-col items-center py-8 px-4 font-sans print:bg-white print:py-0">
      {template === "trilingual" && <CertificateTemplateTrilingual {...viewProps} />}
      {template === "accreditation" && <CertificateTemplateAccreditation {...viewProps} />}
      {template === "official" && <CertificateTemplateOfficialDoc {...viewProps} />}
      {template === "classic" && <CertificateTemplateClassic {...viewProps} />}
    </div>
  );
}
