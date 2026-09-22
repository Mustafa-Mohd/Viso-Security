import { createFileRoute } from '@tanstack/react-router'
import { FileText, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { certsApi, TranslationCertificate, getCertificateDisplayStatus } from '@/lib/certsApi'

export const Route = createFileRoute('/certificate/$id')({
  component: CertificatePdfView,
})

function CertificatePdfView() {
  const { id } = Route.useParams()
  const certId = id.toUpperCase()
  const [certData, setCertData] = useState<TranslationCertificate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCert = async () => {
      setIsLoading(true)
      try {
        const data = await certsApi.getCertificateById(certId)
        setCertData(data)
      } catch (err) {
        console.error("Failed to load certificate", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCert()
  }, [certId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 font-sans">
        <div className="text-center flex flex-col items-center">
          <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
          <h1 className="text-xl font-bold text-neutral-800">Verifying Certificate...</h1>
          <p className="text-neutral-500 mt-2">Connecting to VISO secure registry</p>
        </div>
      </div>
    )
  }

  if (!certData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 font-sans">
        <div className="text-center">
          <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-800">Certificate Not Found</h1>
          <p className="text-neutral-500 mt-2">The certificate ID {certId} does not exist in our registry.</p>
        </div>
      </div>
    )
  }

  // Use the current origin for the QR Code to scan back to the live site
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://viso-group.com';
  const qrUrl = `${origin}/translation?verify=${certId}&nationalId=${certData.national_id}`;
  const displayStatus = getCertificateDisplayStatus(certData);
  const isWithinValidity = displayStatus === 'active';
  const isPastExpiry = displayStatus === 'expired';
  const isRevoked = displayStatus === 'revoked';
  const isPending = displayStatus === 'pending';

  const bannerLabel =
    isPastExpiry ? `Validity ended ${certData.expiry_date}` :
    isRevoked ? 'Withdrawn from registry' :
    isPending ? `Effective from ${certData.issue_date}` :
    null;

  const watermarkLabel =
    isPastExpiry ? `Ended ${certData.expiry_date}` :
    isRevoked ? 'Withdrawn' :
    isPending ? `From ${certData.issue_date}` :
    null;

  return (
    <div className="min-h-screen bg-neutral-300 flex flex-col items-center py-8 px-4 font-sans selection:bg-primary/20 selection:text-primary">
      {/* 
        This div acts as the A4-like "PDF" page. 
        It has no fixed height, letting it expand naturally or be scrolled natively by the browser.
      */}
      <div className="bg-white w-full max-w-[800px] min-h-[1130px] shadow-2xl relative p-12 md:p-20 text-black flex flex-col mx-auto my-auto overflow-hidden">
        
        {bannerLabel && (
           <div className={`absolute top-12 left-[-60px] text-white font-bold tracking-wide text-sm py-2 w-[300px] text-center -rotate-45 shadow-md border-y z-10 opacity-90 ${
             isRevoked ? 'bg-red-600 border-red-700' : 'bg-amber-500 border-amber-600'
           }`}>
             {bannerLabel}
           </div>
        )}

        <div className="absolute top-0 left-0 w-full h-4 bg-primary" />
        
        <div className="text-center mt-12 mb-16 flex flex-col items-center">
          <img loading="lazy" decoding="async" 
            src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png" 
            alt="VISO Group" 
            className="h-20 w-auto object-contain mb-6"
          />
          <h3 className="text-2xl font-serif text-neutral-800 uppercase tracking-widest border-b-2 border-neutral-300 pb-4 inline-block">Certificate of Translation</h3>
        </div>

        <div className="flex-grow relative z-0">
          <p className="text-base text-neutral-700 mb-12 leading-relaxed text-justify">
            This document officially certifies that the translation provided for the project <strong className="text-neutral-900">{certData.project_name}</strong> has been completed by certified professionals and verified for accuracy and fidelity to the source document.
          </p>

          <div className="grid grid-cols-2 gap-y-8 gap-x-12 text-sm mb-16 border border-neutral-200 p-10 rounded-xl bg-neutral-50/50 relative">
            
            {watermarkLabel && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                 <span className="text-[80px] md:text-[120px] font-bold -rotate-12 whitespace-nowrap text-center px-4">
                   {watermarkLabel}
                 </span>
               </div>
            )}

            <div className="relative z-10">
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Certificate ID</span>
              <span className="font-mono font-medium text-neutral-800 text-base">{certId}</span>
            </div>
            <div className="relative z-10">
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">National ID</span>
              <span className="font-mono font-medium text-neutral-800 text-base">{certData.national_id}</span>
            </div>
            <div className="relative z-10">
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Source Language</span>
              <span className="font-medium text-neutral-800 text-base">{certData.source_lang}</span>
            </div>
            <div className="relative z-10">
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Target Language</span>
              <span className="font-medium text-neutral-800 text-base">{certData.target_lang}</span>
            </div>
            <div className="relative z-10">
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Issue Date</span>
              <span className="font-medium text-neutral-800 text-base">{certData.issue_date}</span>
            </div>
            <div className="relative z-10">
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Valid Until</span>
              <span className={`font-medium text-base ${!isWithinValidity && (isPastExpiry || isRevoked) ? 'text-red-600 line-through' : 'text-neutral-800'}`}>
                {certData.expiry_date}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-10 border-t border-neutral-200 flex justify-between items-end relative z-10">
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Scan to Verify Live Status</p>
            <div className="p-2 bg-white border border-neutral-200 rounded-lg inline-block shadow-sm">
              <img loading="lazy" decoding="async" 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrUrl)}`} 
                className="w-24 h-24" 
                alt="Scan QR Code" 
              />
            </div>
          </div>
          <div className="text-right">
            <div className="w-40 h-12 border-b border-[#D4AF37] mb-2 inline-block italic font-serif text-2xl text-neutral-700 flex items-end justify-center pb-1">
              Viso Director
            </div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  )
}
