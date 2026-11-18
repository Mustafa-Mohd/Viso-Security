import { Printer } from "lucide-react";

type CertificatePrintToolbarProps = {
  certId?: string;
};

export function CertificatePrintToolbar({ certId }: CertificatePrintToolbarProps) {
  return (
    <div className="no-print sticky top-0 z-[200] w-full max-w-[210mm] mx-auto mb-3 flex flex-wrap items-center justify-between gap-2 px-1 py-2">
      <p className="text-xs text-neutral-600">
        {certId ? (
          <>
            Certificate <span className="font-mono font-semibold text-neutral-800">{certId}</span>
          </>
        ) : (
          "Certificate preview"
        )}
      </p>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
      >
        <Printer className="h-4 w-4" aria-hidden />
        Print / Save PDF
      </button>
    </div>
  );
}