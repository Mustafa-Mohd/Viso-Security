import { createFileRoute } from '@tanstack/react-router'
import { FileText } from 'lucide-react'

// Duplicated mock DB for standalone certificate rendering
const MOCK_CERT_DB: Record<string, any> = {
  "VISO-TR-2026-001245": { nationalId: "1023456789", status: "VALID", source: "Arabic", target: "English", issue: "16 Aug 2026", expiry: "16 Aug 2027", name: "Corporate Legal Contract" },
  "VISO-TR-2025-009812": { nationalId: "1100223344", status: "EXPIRED", source: "French", target: "Arabic", issue: "10 Jan 2025", expiry: "10 Jan 2026", name: "Medical Device Manual" },
  "VISO-TR-2026-000404": { nationalId: "1055566677", status: "REVOKED", source: "English", target: "Arabic", issue: "01 Dec 2025", expiry: "01 Dec 2026", name: "Financial Audit Report" },
};

export const Route = createFileRoute('/certificate/$id')({
  component: CertificatePdfView,
})

function CertificatePdfView() {
  const { id } = Route.useParams()
  const certId = id.toUpperCase()
  const certData = MOCK_CERT_DB[certId]

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

  // Hardcode to production Netlify URL so QR codes scanned from localhost still work on mobile
  const origin = 'https://alternate-v.netlify.app';
  const qrUrl = `${origin}/translation?verify=${certId}&nationalId=${certData.nationalId}`;

  return (
    <div className="min-h-screen bg-neutral-300 flex flex-col items-center py-8 px-4 font-sans selection:bg-primary/20 selection:text-primary">
      {/* 
        This div acts as the A4-like "PDF" page. 
        It has no fixed height, letting it expand naturally or be scrolled natively by the browser.
      */}
      <div className="bg-white w-full max-w-[800px] min-h-[1130px] shadow-2xl relative p-12 md:p-20 text-black flex flex-col mx-auto my-auto">
        <div className="absolute top-0 left-0 w-full h-4 bg-primary" />
        
        <div className="text-center mt-12 mb-16 flex flex-col items-center">
          <img 
            src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png" 
            alt="VISO Group" 
            className="h-20 w-auto object-contain mb-6"
          />
          <h3 className="text-2xl font-serif text-neutral-800 uppercase tracking-widest border-b-2 border-neutral-300 pb-4 inline-block">Certificate of Translation</h3>
        </div>

        <div className="flex-grow">
          <p className="text-base text-neutral-700 mb-12 leading-relaxed text-justify">
            This document officially certifies that the translation provided for the project <strong className="text-neutral-900">{certData.name}</strong> has been completed by certified professionals and verified for accuracy and fidelity to the source document.
          </p>

          <div className="grid grid-cols-2 gap-y-8 gap-x-12 text-sm mb-16 border border-neutral-200 p-10 rounded-xl bg-neutral-50/50">
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Certificate ID</span>
              <span className="font-mono font-medium text-neutral-800 text-base">{certId}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">National ID</span>
              <span className="font-mono font-medium text-neutral-800 text-base">{certData.nationalId}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Source Language</span>
              <span className="font-medium text-neutral-800 text-base">{certData.source}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Target Language</span>
              <span className="font-medium text-neutral-800 text-base">{certData.target}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Issue Date</span>
              <span className="font-medium text-neutral-800 text-base">{certData.issue}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Valid Until</span>
              <span className="font-medium text-neutral-800 text-base">{certData.expiry}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-10 border-t border-neutral-200 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Scan to Verify Live Status</p>
            <div className="p-2 bg-white border border-neutral-200 rounded-lg inline-block shadow-sm">
              <img 
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
