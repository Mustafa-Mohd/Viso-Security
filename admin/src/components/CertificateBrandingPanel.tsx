import { useEffect, useMemo, useState } from "react";
import { Eye, Loader2, RotateCcw, Save } from "lucide-react";
import { uploadGalleryImage } from "@/lib/galleryApi";
import {
  DEFAULT_CERTIFICATE_BRANDING,
  fetchCertificateBranding,
  saveCertificateBranding,
  type CertificateBranding,
  RIYADH_CHAMBER_LABELS,
} from "@/lib/certificateBranding";
import {
  CERTIFICATE_PLACEHOLDER_HINT,
  DEFAULT_CERTIFICATE_COPY,
  fetchCertificateCopy,
  saveCertificateCopy,
  type CertificateCopy,
} from "@/lib/certificateCopy";
import { getCertificatePreviewUrl } from "../lib/certificateIds";
import type { CertificateTemplateId } from "../lib/certificateTemplates";

type TabId = "branding" | "trilingual" | "accreditation" | "official";

function ImageUploadField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = { current: null as HTMLInputElement | null };

  const onFile = async (file: File) => {
    setUploading(true);
    try {
      onChange(await uploadGalleryImage(file, folder));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-background border border-foreground/15 rounded-lg py-2 px-3 text-xs"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="mt-2 px-3 py-1.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <input
            ref={(el) => {
              inputRef.current = el;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
        </div>
        {value ? (
          <img src={value} alt="" className="h-16 w-auto max-w-[100px] object-contain border rounded bg-white p-1" />
        ) : null}
      </div>
    </div>
  );
}

function CopyField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-background border border-foreground/15 rounded-lg py-2 px-3 text-xs leading-relaxed font-sans"
      />
    </div>
  );
}

export function CertificateBrandingPanel() {
  const [branding, setBranding] = useState<CertificateBranding>(DEFAULT_CERTIFICATE_BRANDING);
  const [copy, setCopy] = useState<CertificateCopy>(DEFAULT_CERTIFICATE_COPY);
  const [tab, setTab] = useState<TabId>("official");
  const [previewTemplate, setPreviewTemplate] = useState<CertificateTemplateId>("official");
  const [previewNonce, setPreviewNonce] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetchCertificateBranding(), fetchCertificateCopy()]).then(([b, c]) => {
      setBranding(b);
      setCopy(c);
      setLoaded(true);
    });
  }, []);

  const previewUrl = useMemo(
    () => `${getCertificatePreviewUrl(previewTemplate)}&_=${previewNonce}`,
    [previewTemplate, previewNonce]
  );

  const publish = async () => {
    setSaving(true);
    try {
      await Promise.all([saveCertificateBranding(branding), saveCertificateCopy(copy)]);
      setPreviewNonce((n) => n + 1);
      alert("Certificate branding and text published.");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  };

  const resetCopySection = (section: keyof CertificateCopy) => {
    if (!confirm("Reset this section to default text?")) return;
    setCopy({ ...copy, [section]: structuredClone(DEFAULT_CERTIFICATE_COPY[section]) });
  };

  if (!loaded) return null;

  const tabs: { id: TabId; label: string; preview: CertificateTemplateId }[] = [
    { id: "branding", label: "Branding", preview: "official" },
    { id: "trilingual", label: "Template 2", preview: "trilingual" },
    { id: "accreditation", label: "Template 3", preview: "accreditation" },
    { id: "official", label: "Template 4", preview: "official" },
  ];

  return (
    <div className="bg-white dark:bg-[#1C2541] border border-foreground/5 shadow-sm rounded p-6 mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold mb-1">Certificate templates — content & branding</h3>
          <p className="text-xs text-foreground/50 max-w-xl">
            Text fields are pre-filled with the current certificate wording. Use placeholders, then{" "}
            <strong>Save & publish</strong> to update live certificates (IDs from{" "}
            <span className="font-mono">VISO-TR-2026-00986</span> onward).
          </p>
          <p className="text-[9px] text-foreground/45 mt-2 font-mono">{CERTIFICATE_PLACEHOLDER_HINT}</p>
        </div>
        <button
          type="button"
          onClick={publish}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save & publish
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 border-b border-foreground/10 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              if (t.id !== "branding") setPreviewTemplate(t.preview);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${
              tab === t.id ? "bg-primary text-white" : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="space-y-4 min-w-0">
          {tab === "branding" && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <ImageUploadField
                  label="Authorized signature"
                  value={branding.signatureUrl}
                  onChange={(signatureUrl) => setBranding({ ...branding, signatureUrl })}
                  folder="certificates"
                />
                <ImageUploadField
                  label="Digital stamp / seal"
                  value={branding.digitalStampUrl}
                  onChange={(digitalStampUrl) => setBranding({ ...branding, digitalStampUrl })}
                  folder="certificates"
                />
              </div>
              <div className="max-w-sm">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">
                  Riyadh Chamber membership ID
                </label>
                <input
                  type="text"
                  value={branding.riyadhChamberMembershipId}
                  onChange={(e) => setBranding({ ...branding, riyadhChamberMembershipId: e.target.value })}
                  className="w-full bg-background border border-foreground/15 rounded-lg py-2.5 px-3 text-xs font-mono"
                />
                <p className="text-[9px] text-foreground/45 mt-2">{RIYADH_CHAMBER_LABELS.en}</p>
              </div>
            </>
          )}

          {tab === "official" && (
            <>
              <button
                type="button"
                onClick={() => resetCopySection("official")}
                className="text-[10px] font-bold uppercase text-primary flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset template 4 text
              </button>
              <CopyField label="Legal paragraph 1 (English)" value={copy.official.legalEn1} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalEn1: v } })} rows={4} />
              <CopyField label="Legal paragraph 2 (English)" value={copy.official.legalEn2} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalEn2: v } })} rows={3} />
              <CopyField label="Legal paragraph 3 (English)" value={copy.official.legalEn3} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalEn3: v } })} rows={2} />
              <CopyField label="Legal paragraph 1 (Arabic)" value={copy.official.legalAr1} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalAr1: v } })} rows={4} />
              <CopyField label="Legal paragraph 2 (Arabic)" value={copy.official.legalAr2} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalAr2: v } })} rows={3} />
              <CopyField label="Legal paragraph 3 (Arabic)" value={copy.official.legalAr3} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalAr3: v } })} rows={2} />
              <div className="grid md:grid-cols-2 gap-3">
                <CopyField label="Verify heading" value={copy.official.verifyHeading} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, verifyHeading: v } })} rows={2} />
                <CopyField label="Verify (English)" value={copy.official.verifyEn} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, verifyEn: v } })} rows={2} />
                <CopyField label="Verify (Arabic)" value={copy.official.verifyAr} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, verifyAr: v } })} rows={2} />
                <CopyField label="Signatory name (EN)" value={copy.official.signatoryNameEn} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, signatoryNameEn: v } })} />
                <CopyField label="Signatory name (AR)" value={copy.official.signatoryNameAr} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, signatoryNameAr: v } })} />
              </div>
            </>
          )}

          {tab === "trilingual" && (
            <>
              <button type="button" onClick={() => resetCopySection("trilingual")} className="text-[10px] font-bold uppercase text-primary flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Reset template 2 text
              </button>
              <CopyField label="Body (Spanish)" value={copy.trilingual.bodyEs} onChange={(v) => setCopy({ ...copy, trilingual: { ...copy.trilingual, bodyEs: v } })} rows={4} />
              <CopyField label="Body (English)" value={copy.trilingual.bodyEn} onChange={(v) => setCopy({ ...copy, trilingual: { ...copy.trilingual, bodyEn: v } })} rows={4} />
              <CopyField label="Body (Arabic)" value={copy.trilingual.bodyAr} onChange={(v) => setCopy({ ...copy, trilingual: { ...copy.trilingual, bodyAr: v } })} rows={4} />
              <CopyField label="Verify (Spanish)" value={copy.trilingual.verifyEs} onChange={(v) => setCopy({ ...copy, trilingual: { ...copy.trilingual, verifyEs: v } })} />
              <CopyField label="Verify (English)" value={copy.trilingual.verifyEn} onChange={(v) => setCopy({ ...copy, trilingual: { ...copy.trilingual, verifyEn: v } })} />
              <CopyField label="Verify (Arabic)" value={copy.trilingual.verifyAr} onChange={(v) => setCopy({ ...copy, trilingual: { ...copy.trilingual, verifyAr: v } })} />
            </>
          )}

          {tab === "accreditation" && (
            <>
              <button type="button" onClick={() => resetCopySection("accreditation")} className="text-[10px] font-bold uppercase text-primary flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Reset template 3 text
              </button>
              <CopyField label="Preamble (English)" value={copy.accreditation.preambleEn} onChange={(v) => setCopy({ ...copy, accreditation: { ...copy.accreditation, preambleEn: v } })} rows={4} />
              <CopyField label="Preamble (Arabic)" value={copy.accreditation.preambleAr} onChange={(v) => setCopy({ ...copy, accreditation: { ...copy.accreditation, preambleAr: v } })} rows={4} />
              <CopyField label="Validity (English)" value={copy.accreditation.validityEn} onChange={(v) => setCopy({ ...copy, accreditation: { ...copy.accreditation, validityEn: v } })} />
              <CopyField label="Validity (Arabic)" value={copy.accreditation.validityAr} onChange={(v) => setCopy({ ...copy, accreditation: { ...copy.accreditation, validityAr: v } })} />
            </>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Published preview
            </span>
            <select
              value={previewTemplate}
              onChange={(e) => setPreviewTemplate(e.target.value as CertificateTemplateId)}
              className="text-xs border border-foreground/15 rounded-lg py-1.5 px-2 bg-background"
            >
              <option value="official">Template 4</option>
              <option value="trilingual">Template 2</option>
              <option value="accreditation">Template 3</option>
            </select>
          </div>
          <p className="text-[9px] text-foreground/45 mb-2">
            Preview uses sample client data. Save & publish to refresh after edits.
          </p>
          <div className="border border-foreground/15 rounded-lg overflow-hidden bg-neutral-400/30 h-[min(720px,70vh)]">
            <iframe title="Certificate preview" src={previewUrl} className="w-full h-full bg-neutral-300" />
          </div>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs font-bold text-primary hover:underline"
          >
            Open preview in new tab
          </a>
        </div>
      </div>
    </div>
  );
}
