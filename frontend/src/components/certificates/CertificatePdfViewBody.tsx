import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { certsApi, getCertificateDisplayStatus } from "@/lib/certsApi";
import { fetchCertificateBranding, DEFAULT_CERTIFICATE_BRANDING } from "@/lib/certificateBranding";
import { fetchCertificateCopy, DEFAULT_CERTIFICATE_COPY } from "@/lib/certificateCopy";
import { resolveCertificateTemplate } from "@/lib/certificateTemplates";
import { getPublicSiteOrigin } from "@/lib/certificateIds";
import { CertificateTemplateClassic } from "@/components/certificates/CertificateDocument";
import { CertificateTemplateOfficialDoc } from "@/components/certificates/CertificateTemplateOfficialDoc";
import { CertificateTemplateOfficialPanorama } from "@/components/certificates/CertificateTemplateOfficialPanorama";
import { CertificatePrintToolbar } from "@/components/certificates/CertificatePrintToolbar";
import { CERTIFICATE_GLOBAL_PRINT_CSS } from "@/components/certificates/certificatePrintStyles";

export function CertificatePdfViewBody({ certId }: { certId: string }) {
  const [certData, setCertData] = useState<Awaited<ReturnType<typeof certsApi.getCertificateById>>>(null);
  const [branding, setBranding] = useState(DEFAULT_CERTIFICATE_BRANDING);
  const [copy, setCopy] = useState(DEFAULT_CERTIFICATE_COPY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const [cert, brand, publishedCopy] = await Promise.all([
          certsApi.getCertificateById(certId),
          fetchCertificateBranding(),
          fetchCertificateCopy(),
        ]);
        setCertData(cert);
        setBranding(brand);
        setCopy(publishedCopy);
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
    copy,
    displayStatus,
    bannerLabel,
    watermarkLabel,
    isWithinValidity,
    isPastExpiry,
    isRevoked,
  };

  const template = resolveCertificateTemplate(certData);

  return (
  <>
    <style>{CERTIFICATE_GLOBAL_PRINT_CSS}</style>
    <div className="certificate-print-root min-h-screen w-full bg-neutral-300 flex flex-col items-center py-4 px-2 sm:py-8 sm:px-4 font-sans overflow-x-hidden print:flex print:justify-start print:items-center print:overflow-visible print:min-h-0 print:h-auto print:bg-white print:py-0 print:px-0">
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
