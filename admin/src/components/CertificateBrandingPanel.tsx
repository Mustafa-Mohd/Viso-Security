import { useEffect, useRef, useState } from "react";
import { Loader2, Save, Upload } from "lucide-react";
import { uploadGalleryImage } from "@/lib/galleryApi";
import {
  DEFAULT_CERTIFICATE_BRANDING,
  fetchCertificateBranding,
  saveCertificateBranding,
  type CertificateBranding,
  RIYADH_CHAMBER_LABELS,
} from "@/lib/certificateBranding";

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
  const inputRef = useRef<HTMLInputElement>(null);

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
            placeholder="Image URL or upload…"
            className="w-full bg-background border border-foreground/15 rounded-lg py-2 px-3 text-xs"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase"
          >
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
            Upload
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </div>
        {value ? (
          <img src={value} alt="" className="h-16 w-auto max-w-[100px] object-contain border border-foreground/10 rounded bg-white p-1" />
        ) : (
          <div className="h-16 w-24 border border-dashed border-foreground/20 rounded flex items-center justify-center text-[9px] text-foreground/40">
            Preview
          </div>
        )}
      </div>
    </div>
  );
}

export function CertificateBrandingPanel() {
  const [branding, setBranding] = useState<CertificateBranding>(DEFAULT_CERTIFICATE_BRANDING);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchCertificateBranding().then((b) => {
      setBranding(b);
      setLoaded(true);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await saveCertificateBranding(branding);
      alert("Certificate branding saved.");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return null;

  return (
    <div className="bg-white dark:bg-[#1C2541] border border-foreground/5 shadow-sm rounded p-6 mb-6">
      <h3 className="text-sm font-bold mb-1">Certificate templates 2–4 — branding</h3>
      <p className="text-xs text-foreground/50 mb-4">
        Used on new certificates from <strong className="font-mono">VISO-TR-2026-00986</strong> onward. Template 1 stays unchanged for older IDs.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-4">
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
      <div className="mb-4 max-w-xs">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">
          Riyadh Chamber membership ID
        </label>
        <input
          type="text"
          value={branding.riyadhChamberMembershipId}
          onChange={(e) => setBranding({ ...branding, riyadhChamberMembershipId: e.target.value })}
          className="w-full bg-background border border-foreground/15 rounded-lg py-2.5 px-3 text-xs font-mono"
        />
        <p className="text-[9px] text-foreground/45 mt-2 leading-relaxed">
          {RIYADH_CHAMBER_LABELS.es} · {RIYADH_CHAMBER_LABELS.en} · {RIYADH_CHAMBER_LABELS.ar}
        </p>
      </div>
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save branding
      </button>
    </div>
  );
}
