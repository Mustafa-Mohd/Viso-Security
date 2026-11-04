import { createFileRoute } from '@tanstack/react-router'
import { FileText, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'
import { CertificatePdfViewBody } from '@/components/certificates/CertificatePdfViewBody'

export const Route = createFileRoute('/certificate/$id')({
  component: CertificatePdfView,
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.id.toUpperCase()} | VISO Translation Certificate`,
      },
    ],
  }),
})

function CertificatePdfView() {
  const { id } = Route.useParams()
  const certId = id.toUpperCase()

  useEffect(() => {
    document.title = `${certId} | VISO Translation Certificate`;
  }, [certId]);

  return <CertificatePdfViewBody certId={certId} />
}
