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
  DEFAULT_CERTIFICATE_COPY,
  fetchCertificateCopy,
  saveCertificateCopy,
  type CertificateCopy,
} from "@/lib/certificateCopy";
import { getCertificatePreviewUrl, getPublicCertificateUrl } from "../lib/certificateIds";
import type { CertificateTemplateId } from "../lib/certificateTemplates";

type TabId = "branding" | "trilingual" | "accreditation" | "official";

export type CertificateBrandingPanelProps = {
  /** Inside issue/edit modal — no page-level banner */
  embedded?: boolean;
  /** Issued certificate ID → live public page preview */
  liveCertificateId?: string | null;
  /** Selected layout (synced with issue form) */
  previewTemplate?: CertificateTemplateId;
  onPreviewTemplateChange?: (template: CertificateTemplateId) => void;
  livePreviewToken?: number;
  className?: string;
  /** Use full height of parent (fullscreen issue/edit layout) */
  fillHeight?: boolean;
};

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

const TEMPLATE_PREVIEW_OPTIONS: { id: CertificateTemplateId; label: string }[] = [
  { id: "trilingual", label: "Template 2" },
  { id: "accreditation", label: "Template 3" },
  { id: "official", label: "Template 4" },
];

export function CertificateBrandingPanel({
  embedded = false,
  liveCertificateId = null,
  previewTemplate: controlledTemplate,
  onPreviewTemplateChange,
  livePreviewToken = 0,
  className = "",
  fillHeight = false,
}: CertificateBrandingPanelProps) {
  const [branding, setBranding] = useState<CertificateBranding>(DEFAULT_CERTIFICATE_BRANDING);
  const [copy, setCopy] = useState<CertificateCopy>(DEFAULT_CERTIFICATE_COPY);
  const [tab, setTab] = useState<TabId>("branding");
  const [internalTemplate, setInternalTemplate] = useState<CertificateTemplateId>("official");
  const [previewMode, setPreviewMode] = useState<"live" | "sample">(liveCertificateId ? "live" : "sample");
  const [previewNonce, setPreviewNonce] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const previewTemplate = controlledTemplate ?? internalTemplate;

  const setPreviewTemplate = (t: CertificateTemplateId) => {
    if (onPreviewTemplateChange) onPreviewTemplateChange(t);
    else setInternalTemplate(t);
    if (t !== "classic") setTab(t as TabId);
  };

  useEffect(() => {
    Promise.all([fetchCertificateBranding(), fetchCertificateCopy()]).then(([b, c]) => {
      setBranding(b);
      setCopy(c);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (liveCertificateId) setPreviewMode("live");
    else setPreviewMode("sample");
  }, [liveCertificateId]);

  useEffect(() => {
    if (previewTemplate === "trilingual" || previewTemplate === "accreditation" || previewTemplate === "official") {
      setTab((current) => (current === "branding" ? current : previewTemplate));
    }
  }, [previewTemplate]);

  const samplePreviewUrl = useMemo(
    () => `${getCertificatePreviewUrl(previewTemplate)}&_=${previewNonce}`,
    [previewTemplate, previewNonce]
  );

  const livePreviewUrl = useMemo(() => {
    if (!liveCertificateId) return null;
    return `${getPublicCertificateUrl(liveCertificateId)}?v=${livePreviewToken || previewNonce}`;
  }, [liveCertificateId, livePreviewToken, previewNonce]);

  const iframeSrc = previewMode === "live" && livePreviewUrl ? livePreviewUrl : samplePreviewUrl;

  const publish = async () => {
    setSaving(true);
    try {
      await Promise.all([saveCertificateBranding(branding), saveCertificateCopy(copy)]);
      setPreviewNonce((n) => n + 1);
      alert("Branding and template text published to live certificates.");
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

  if (!loaded) {
    return embedded ? <p className="text-xs text-foreground/50 py-4">Loading template content…</p> : null;
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "branding", label: "Branding" },
    { id: "trilingual", label: "Template 2" },
    { id: "accreditation", label: "Template 3" },
    { id: "official", label: "Template 4" },
  ];

  const shellClass = embedded
    ? `rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4 ${fillHeight ? "h-full min-h-0 flex flex-col" : ""} ${className}`
    : `bg-white dark:bg-[#1C2541] border border-foreground/5 shadow-sm rounded p-6 mb-6 ${className}`;

  return (
    <div className={shellClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70">
          {embedded ? "Template content & branding" : "Certificate branding"}
        </h4>
        <button
          type="button"
          onClick={publish}
          disabled={saving}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold uppercase shrink-0"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save & publish text
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3 border-b border-foreground/10 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              if (t.id !== "branding") setPreviewTemplate(t.id as CertificateTemplateId);
            }}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
              tab === t.id ? "bg-primary text-white" : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        className={`grid gap-4 min-h-0 ${fillHeight ? "flex-1 lg:grid-cols-2" : embedded ? "lg:grid-cols-2" : "xl:grid-cols-2"}`}
      >
        <div
          className={`space-y-3 min-w-0 pr-1 ${
            fillHeight ? "h-full min-h-0 overflow-y-auto" : "max-h-[min(50vh,420px)] overflow-y-auto"
          }`}
        >
          {tab === "branding" && (
            <>
              <div className="grid md:grid-cols-2 gap-3">
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
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">
                  Riyadh Chamber membership ID
                </label>
                <input
                  type="text"
                  value={branding.riyadhChamberMembershipId}
                  onChange={(e) => setBranding({ ...branding, riyadhChamberMembershipId: e.target.value })}
                  className="w-full bg-background border border-foreground/15 rounded-lg py-2 px-3 text-xs font-mono"
                />
                <p className="text-[9px] text-foreground/45 mt-1">{RIYADH_CHAMBER_LABELS.en}</p>
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
              <CopyField label="Legal paragraph 1 (English)" value={copy.official.legalEn1} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalEn1: v } })} rows={3} />
              <CopyField label="Legal paragraph 2 (English)" value={copy.official.legalEn2} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalEn2: v } })} rows={2} />
              <CopyField label="Legal paragraph 3 (English)" value={copy.official.legalEn3} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalEn3: v } })} rows={2} />
              <CopyField label="Legal paragraph 1 (Arabic)" value={copy.official.legalAr1} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalAr1: v } })} rows={3} />
              <CopyField label="Legal paragraph 2 (Arabic)" value={copy.official.legalAr2} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalAr2: v } })} rows={2} />
              <CopyField label="Legal paragraph 3 (Arabic)" value={copy.official.legalAr3} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, legalAr3: v } })} rows={2} />
              <CopyField label="Verify heading" value={copy.official.verifyHeading} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, verifyHeading: v } })} rows={2} />
              <CopyField label="Verify (English)" value={copy.official.verifyEn} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, verifyEn: v } })} rows={2} />
              <CopyField label="Verify (Arabic)" value={copy.official.verifyAr} onChange={(v) => setCopy({ ...copy, official: { ...copy.official, verifyAr: v } })} rows={2} />
            </>
          )}

          {tab === "trilingual" && (
            <>
              <button type="button" onClick={() => resetCopySection("trilingual")} className="text-[10px] font-bold uppercase text-primary flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Reset template 2 text
              </button>
              <CopyField label="Body (Spanish)" value={copy.trilingual.bodyEs} onChange={(v) => setCopy({ ...copy, trilingual: { ...copy.trilingual, bodyEs: v } })} rows={3} />
              <CopyField label="Body (English)" value={copy.trilingual.bodyEn} onChange={(v) => setCopy({ ...copy, trilingual: { ...copy.trilingual, bodyEn: v } })} rows={3} />
              <CopyField label="Body (Arabic)" value={copy.trilingual.bodyAr} onChange={(v) => setCopy({ ...copy, trilingual: { ...copy.trilingual, bodyAr: v } })} rows={3} />
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
              <CopyField label="Preamble (English)" value={copy.accreditation.preambleEn} onChange={(v) => setCopy({ ...copy, accreditation: { ...copy.accreditation, preambleEn: v } })} rows={3} />
              <CopyField label="Preamble (Arabic)" value={copy.accreditation.preambleAr} onChange={(v) => setCopy({ ...copy, accreditation: { ...copy.accreditation, preambleAr: v } })} rows={3} />
              <CopyField label="Validity (English)" value={copy.accreditation.validityEn} onChange={(v) => setCopy({ ...copy, accreditation: { ...copy.accreditation, validityEn: v } })} />
              <CopyField label="Validity (Arabic)" value={copy.accreditation.validityAr} onChange={(v) => setCopy({ ...copy, accreditation: { ...copy.accreditation, validityAr: v } })} />
            </>
          )}
        </div>

        <div className={`min-w-0 flex flex-col ${fillHeight ? "h-full min-h-0" : ""}`}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Preview
            </span>
            {liveCertificateId ? (
              <select
                value={previewMode}
                onChange={(e) => setPreviewMode(e.target.value as "live" | "sample")}
                className="text-[10px] border border-foreground/15 rounded-md py-1 px-2 bg-background font-semibold"
              >
                <option value="live">This certificate (saved)</option>
                <option value="sample">Layout sample</option>
              </select>
            ) : null}
            {(previewMode === "sample" || !liveCertificateId) &&
              (previewTemplate === "classic" ? (
                <span className="text-[10px] font-semibold text-foreground/70">Template 1 (Classic)</span>
              ) : (
                <select
                  value={previewTemplate}
                  onChange={(e) => setPreviewTemplate(e.target.value as CertificateTemplateId)}
                  className="text-[10px] border border-foreground/15 rounded-md py-1 px-2 bg-background font-semibold"
                >
                  {TEMPLATE_PREVIEW_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ))}
            <button
              type="button"
              onClick={() => setPreviewNonce((n) => n + 1)}
              className="text-[9px] font-bold uppercase text-primary hover:underline ml-auto"
            >
              Refresh
            </button>
          </div>
          <p className="text-[9px] text-foreground/45 mb-2">
            {previewMode === "live" && liveCertificateId
              ? "Shows the issued certificate on the public site. Save the form above to refresh client data."
              : "Sample client data — matches the layout you chose. Save & publish text to apply wording changes."}
          </p>
          <div
            className={`border border-foreground/15 rounded-lg overflow-hidden bg-neutral-400/30 flex-1 min-h-[280px] ${
              fillHeight ? "h-full min-h-0" : "h-[min(420px,45vh)]"
            }`}
          >
            <iframe title="Certificate preview" src={iframeSrc} className="w-full h-full bg-neutral-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
