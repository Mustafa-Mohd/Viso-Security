import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, LayoutDashboard, Image as ImageIcon, Settings, LogOut, ChevronRight, Save, Plus, Trash2, Upload, AlertCircle, MessageSquare, Users, Briefcase, FileText, History, ArrowUp, ArrowDown, Loader2, Link, Video, ShieldCheck, ArrowLeft, Layers } from "lucide-react";
import { DmsDashboard } from "@/components/DmsDashboard";
import { HrDashboard } from "@/components/HrDashboard";
import { CertificatesDashboard } from "@/components/CertificatesDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fetchContactSubmissions, markInquiryRead, type ContactSubmission } from "@/lib/inquiriesApi";
import {
  uploadGalleryImage,
  insertGalleryImageRecord,
  fetchGalleryImageRecords,
  deleteGalleryImageRecord,
} from "@/lib/galleryApi";
import { fetchLeaveRequests } from "@/lib/leaveApi";
import { PROJECTS, type ProjectItem, parseMonthYear } from "@/routes/projects";
import { clientCategoriesData, ClientLogo, type ClientCategory, type ClientItem } from "@/data/clientsData";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "VISO | Admin Dashboard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type FieldChange = {
  path: string;
  label: string;
  kind: "changed" | "added" | "removed";
  from: string;
  to: string;
  details?: { label: string; from: string; to: string }[];
};

function isUrl(v: unknown): boolean {
  return typeof v === "string" && (/^https?:\/\//i.test(v) || v.startsWith("/") || v.startsWith("data:"));
}

function formatPlain(value: unknown): string {
  if (value === null || value === undefined || value === "") return "(empty)";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "(empty list)";
    if (value.every((v) => typeof v === "string")) return value.join(", ");
    return value.map((item, i) => summarizeItem(item, i)).join("; ");
  }
  if (typeof value === "object") return summarizeItem(value);
  return String(value);
}

/** Readable one-line summary including image/link URLs when present. */
function summarizeItem(item: unknown, index?: number): string {
  if (item === null || item === undefined) return "(empty)";
  if (typeof item !== "object") return String(item);

  const obj = item as Record<string, unknown>;
  const parts: string[] = [];

  const title =
    (typeof obj.name === "string" && obj.name) ||
    (typeof obj.title === "string" && obj.title) ||
    (typeof obj.label === "string" && obj.label) ||
    (typeof obj.city === "string" && obj.city) ||
    null;

  if (title) parts.push(title);

  for (const key of ["sector", "subtitle", "desc", "description", "region", "num", "type", "role"]) {
    const v = obj[key];
    if (typeof v === "string" && v.trim() && v !== title) {
      const short = v.length > 80 ? v.slice(0, 80) + "…" : v;
      parts.push(`${humanizeKey(key)}: ${short}`);
    }
  }

  for (const key of ["icon", "imageUrl", "image_url", "url", "link", "href", "src"]) {
    const v = obj[key];
    if (typeof v === "string" && v.trim()) {
      if (isUrl(v)) parts.push(`${humanizeKey(key)}: ${v}`);
      else if (v.length <= 8) parts.push(`${humanizeKey(key)}: ${v}`);
    }
  }

  if (parts.length === 0) {
    const simple = Object.entries(obj)
      .filter(([, v]) => typeof v === "string" || typeof v === "number")
      .slice(0, 5)
      .map(([k, v]) => `${humanizeKey(k)}: ${v}`);
    if (simple.length) return simple.join(" · ");
    return index !== undefined ? `Item ${index + 1}` : "Item";
  }

  return parts.join(" · ");
}

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_\-.]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function itemKey(item: unknown, index: number): string {
  if (item && typeof item === "object") {
    const o = item as Record<string, unknown>;
    if (typeof o.id === "string" || typeof o.id === "number") return `id:${o.id}`;
    if (typeof o.name === "string") return `name:${o.name.toLowerCase()}`;
    if (typeof o.title === "string") return `title:${o.title.toLowerCase()}`;
    if (typeof o.num === "string") return `num:${o.num}`;
  }
  return `idx:${index}`;
}

function fieldLabelForUrlKey(key: string): string {
  if (key === "icon" || key === "imageUrl" || key === "image_url" || key === "src") return "Image URL";
  if (key === "url" || key === "link" || key === "href") return "Link";
  return humanizeKey(key);
}

function diffObjects(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>
): { label: string; from: string; to: string }[] {
  const keys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]));
  const details: { label: string; from: string; to: string }[] = [];

  for (const key of keys) {
    if (key === "id") continue;

    const a = oldObj[key];
    const b = newObj[key];
    if (JSON.stringify(a) === JSON.stringify(b)) continue;

    if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
      details.push(...diffObjects(a as Record<string, unknown>, b as Record<string, unknown>));
      continue;
    }

    const urlKeys = ["icon", "imageUrl", "image_url", "url", "link", "href", "src"];
    details.push({
      label: urlKeys.includes(key) ? fieldLabelForUrlKey(key) : humanizeKey(key),
      from: a === null || a === undefined || a === "" ? "(empty)" : String(a),
      to: b === null || b === undefined || b === "" ? "(empty)" : String(b),
    });
  }

  return details;
}

function diffArrays(
  oldArr: unknown[],
  newArr: unknown[],
  fieldLabel: string
): FieldChange[] {
  const changes: FieldChange[] = [];
  const oldMap = new Map<string, { item: unknown; index: number }>();
  const newMap = new Map<string, { item: unknown; index: number }>();

  oldArr.forEach((item, i) => oldMap.set(itemKey(item, i), { item, index: i }));
  newArr.forEach((item, i) => newMap.set(itemKey(item, i), { item, index: i }));

  for (const [key, { item }] of oldMap) {
    if (!newMap.has(key)) {
      changes.push({
        path: `${fieldLabel}.removed.${key}`,
        label: fieldLabel,
        kind: "removed",
        from: summarizeItem(item),
        to: "(removed)",
      });
    }
  }

  for (const [key, { item }] of newMap) {
    if (!oldMap.has(key)) {
      changes.push({
        path: `${fieldLabel}.added.${key}`,
        label: fieldLabel,
        kind: "added",
        from: "(new)",
        to: summarizeItem(item),
      });
    }
  }

  for (const [key, newEntry] of newMap) {
    const oldEntry = oldMap.get(key);
    if (!oldEntry) continue;
    if (JSON.stringify(oldEntry.item) === JSON.stringify(newEntry.item)) continue;

    if (
      oldEntry.item &&
      newEntry.item &&
      typeof oldEntry.item === "object" &&
      typeof newEntry.item === "object" &&
      !Array.isArray(oldEntry.item) &&
      !Array.isArray(newEntry.item)
    ) {
      const details = diffObjects(
        oldEntry.item as Record<string, unknown>,
        newEntry.item as Record<string, unknown>
      );
      const name =
        (newEntry.item as any).name ||
        (newEntry.item as any).title ||
        summarizeItem(newEntry.item).split(" · ")[0];
      changes.push({
        path: `${fieldLabel}.changed.${key}`,
        label: `${fieldLabel}: ${name}`,
        kind: "changed",
        from: summarizeItem(oldEntry.item),
        to: summarizeItem(newEntry.item),
        details: details.length ? details : undefined,
      });
    } else {
      changes.push({
        path: `${fieldLabel}.changed.${key}`,
        label: fieldLabel,
        kind: "changed",
        from: formatPlain(oldEntry.item),
        to: formatPlain(newEntry.item),
      });
    }
  }

  if (changes.length === 0 && JSON.stringify(oldArr) !== JSON.stringify(newArr)) {
    changes.push({
      path: `${fieldLabel}.list`,
      label: fieldLabel,
      kind: "changed",
      from: formatPlain(oldArr),
      to: formatPlain(newArr),
    });
  }

  return changes;
}

function collectChanges(oldObj: any, newObj: any, prefix = ""): FieldChange[] {
  const changes: FieldChange[] = [];
  const oldSafe = oldObj && typeof oldObj === "object" ? oldObj : {};
  const newSafe = newObj && typeof newObj === "object" ? newObj : {};
  const keys = Array.from(new Set([...Object.keys(oldSafe), ...Object.keys(newSafe)]));

  for (const key of keys) {
    const path = prefix ? `${prefix}.${key}` : key;
    const a = oldSafe[key];
    const b = newSafe[key];
    const label = humanizeKey(key);

    if (
      a &&
      b &&
      typeof a === "object" &&
      typeof b === "object" &&
      !Array.isArray(a) &&
      !Array.isArray(b)
    ) {
      changes.push(...collectChanges(a, b, path));
      continue;
    }

    if (Array.isArray(a) || Array.isArray(b)) {
      const oldArr = Array.isArray(a) ? a : [];
      const newArr = Array.isArray(b) ? b : [];
      if (JSON.stringify(oldArr) === JSON.stringify(newArr)) continue;
      changes.push(...diffArrays(oldArr, newArr, label));
      continue;
    }

    const from = a === null || a === undefined || a === "" ? "(empty)" : String(a);
    const to = b === null || b === undefined || b === "" ? "(empty)" : String(b);
    if (from === to) continue;

    const urlKeys = ["icon", "imageUrl", "image_url", "url", "link", "href", "src"];
    const parentBits = path.split(".").slice(0, -1);
    const displayLabel = urlKeys.includes(key)
      ? parentBits.length
        ? `${fieldLabelForUrlKey(key)} (${parentBits.map(humanizeKey).join(" › ")})`
        : fieldLabelForUrlKey(key)
      : parentBits.length > 0
        ? `${label} (${parentBits.map(humanizeKey).join(" › ")})`
        : label;

    changes.push({
      path,
      label: displayLabel,
      kind:
        a === undefined || a === null || a === ""
          ? "added"
          : b === undefined || b === null || b === ""
            ? "removed"
            : "changed",
      from,
      to,
    });
  }

  return changes;
}

function DiffValue({ value, tone }: { value: string; tone: "before" | "after" | "neutral" }) {
  const isLink = isUrl(value);
  const color =
    tone === "before"
      ? "text-red-600 dark:text-red-400"
      : tone === "after"
        ? "text-emerald-700 dark:text-emerald-400"
        : "text-foreground/70";

  if (isLink) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className={`${color} underline underline-offset-2 break-all text-[12px] hover:opacity-80`}
        title={value}
      >
        {value}
      </a>
    );
  }

  return <span className={`${color} break-words text-[13px]`}>{value}</span>;
}

function CmsChangeDiff({
  oldContent,
  newContent,
}: {
  oldContent: any;
  newContent: any;
}) {
  if (!oldContent) {
    return (
      <p className="text-sm text-emerald-700 dark:text-emerald-400">
        Section created — all content is new.
      </p>
    );
  }

  const changes = collectChanges(oldContent, newContent);

  if (changes.length === 0) {
    return <p className="text-sm text-foreground/50">No visible changes.</p>;
  }

  const added = changes.filter((c) => c.kind === "added").length;
  const removed = changes.filter((c) => c.kind === "removed").length;
  const updated = changes.filter((c) => c.kind === "changed").length;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] text-foreground/45">
        {[
          added ? `${added} added` : null,
          removed ? `${removed} removed` : null,
          updated ? `${updated} updated` : null,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <div className="rounded-lg border border-foreground/10 divide-y divide-foreground/8 overflow-hidden">
        {changes.map((change) => (
          <div key={change.path} className="px-3 py-2 bg-background">
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className={`text-[10px] font-bold uppercase tracking-wide shrink-0 ${
                  change.kind === "added"
                    ? "text-emerald-600"
                    : change.kind === "removed"
                      ? "text-red-500"
                      : "text-amber-600"
                }`}
              >
                {change.kind === "added" ? "Added" : change.kind === "removed" ? "Removed" : "Changed"}
              </span>
              <span className="text-xs font-semibold text-foreground/80 truncate">{change.label}</span>
            </div>

            {change.details && change.details.length > 0 ? (
              <div className="flex flex-col gap-1 pl-0 sm:pl-1">
                {change.details.map((d, i) => (
                  <div key={i} className="text-[13px] leading-snug">
                    <span className="text-foreground/45 text-xs mr-1.5">{d.label}:</span>
                    <DiffValue value={d.from} tone="before" />
                    <span className="text-foreground/30 mx-1.5">→</span>
                    <DiffValue value={d.to} tone="after" />
                  </div>
                ))}
              </div>
            ) : change.kind === "added" ? (
              <div className="leading-snug">
                <DiffValue value={change.to} tone="after" />
              </div>
            ) : change.kind === "removed" ? (
              <div className="leading-snug">
                <DiffValue value={change.from} tone="before" />
              </div>
            ) : (
              <div className="leading-snug">
                <span className="text-[10px] uppercase text-foreground/35 mr-1">Before</span>
                <DiffValue value={change.from} tone="before" />
                <span className="text-foreground/30 mx-1.5">→</span>
                <span className="text-[10px] uppercase text-foreground/35 mr-1">After</span>
                <DiffValue value={change.to} tone="after" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const MediaUploader = ({ value, onChange, folder, label, type = "image", className = "mb-4" }: { value: string, onChange: (url: string) => void, folder: string, label: string, type?: "image" | "video", className?: string }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const publicUrl = await uploadGalleryImage(file, folder);
      onChange(publicUrl);
    } catch (err) {
      alert(`Error uploading ${type}: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (type === "video" && !file.type.startsWith("video/")) {
        alert("Please upload a valid video file.");
        return;
      }
      if (type === "image" && !file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      handleFile(file);
    }
  };

  return (
    <div className={className}>
      <label className="block text-xs font-bold mb-1 capitalize opacity-70">{label}</label>
      <div 
        className={`flex items-center gap-2 border border-dashed p-2 rounded transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-foreground/20 bg-surface hover:border-primary/50'}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex-1 flex flex-col justify-center">
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className="w-full px-2 py-1.5 text-xs rounded bg-background border border-foreground/10 focus:border-primary focus:outline-none" 
            placeholder={`Enter ${type} URL or upload...`}
            disabled={uploading}
          />
        </div>
        <label className="flex items-center justify-center bg-primary text-primary-foreground px-3 py-1.5 rounded cursor-pointer hover:bg-primary/90 transition-colors shrink-0 text-xs font-bold whitespace-nowrap" title={`Upload ${type}`}>
          {uploading ? (
             <Loader2 size={14} className="mr-1.5 animate-spin" />
          ) : (
             <Upload size={14} className="mr-1.5" />
          )}
          <span>{uploading ? 'Uploading...' : 'Upload'}</span>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept={type === "video" ? "video/*" : "image/*"}
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
};

function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Gallery state
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Core Values state
  const [coreValues, setCoreValues] = useState<any[]>([]);
  const [cvTitle, setCvTitle] = useState("");
  const [cvDesc, setCvDesc] = useState("");
  const [cvPoints, setCvPoints] = useState("");
  const [cvImageUrl, setCvImageUrl] = useState("");
  const [cvUploading, setCvUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const seedAttempted = useRef(false);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<"gallery" | "core_values" | "homepage" | "cms" | "inquiries" | "users" | "auth_users" | "job_apps" | "dms" | "hr" | "cms_history" | "certificates">("cms");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Job Apps State
  const [jobApps, setJobApps] = useState<any[]>([]);
  const [jobAppsLoading, setJobAppsLoading] = useState(false);

  const fetchJobApps = async () => {
    setJobAppsLoading(true);
    const { data } = await supabase.from('job_applications').select('*').order('created_at', { ascending: false });
    if (data) setJobApps(data);
    setJobAppsLoading(false);
  };

  // Users State
  const [users, setUsers] = useState<any[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("document_controller");
  const [newUserDept, setNewUserDept] = useState("Operations");

  const fetchUsers = async () => {
    const { data } = await supabase.from('portal_users').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
  };

  // Auth Users (Registered Employees) State
  const [authUsers, setAuthUsers] = useState<any[]>([]);
  const [authUsersLoading, setAuthUsersLoading] = useState(false);

  const fetchAuthUsers = async () => {
    setAuthUsersLoading(true);
    const { data, error } = await supabase.rpc('get_all_employees');
    if (data && !error) setAuthUsers(data);
    else console.error("Error fetching auth users:", error);
    setAuthUsersLoading(false);
  };

  // CMS State
  const [selectedCmsPage, setSelectedCmsPage] = useState<string | null>(null);
  const [cmsSection, setCmsSection] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);

  const fetchAuditLogs = async () => {
    setAuditLogsLoading(true);
    const { data } = await supabase.from('cms_audit_logs').select('*').order('changed_at', { ascending: false });
    if (data) setAuditLogs(data);
    setAuditLogsLoading(false);
  };
const DEFAULT_HERO_SLIDES = [
  { title: "Security Consultancy" },
  { title: "Translation Services" },
];

  const [heroData, setHeroData] = useState<{
    videoUrl?: string;
    slides: { title: string; subtitle?: string; link?: string; buttonText?: string; imageUrl?: string }[];
    title1?: string;
    title2?: string;
    subtitle?: string;
    desc?: string;
    images?: string[];
    regulatoryLogos?: { slug: string; label: string; img: string }[];
  }>({ 
    videoUrl: "https://res.cloudinary.com/dppwnds6z/video/upload/v1790273816/gemini_generated_video_8399bb9c.mp4",
    slides: [...DEFAULT_HERO_SLIDES],
    title1: "Designing", 
    title2: "The Future", 
    subtitle: "Elevating physical security through sophisticated architectural integration.", 
    desc: "We merge high-end architectural design with rigorous security protocols to create spaces that are both exceptionally safe and visually stunning. Inspired by global innovation leaders.", 
    images: [],
    regulatoryLogos: [
      { slug: "moi", label: "MOI", img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790599258/download.png" },
      { slug: "sais", label: "SAIS", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBwqTj0FNNJJm59mHR1GKznOvHK23QpPB5jwKZQuFaQ&s=10" },
      { slug: "neom", label: "NEOM", img: "https://neom.scene7.com/is/image/neom/logo-neom-en-spaced?fmt=png-alpha&scl=1" },
      { slug: "api780", label: "API 780", img: "https://theshopmag.com/wp-content/uploads/2023/05/api-logo-stacked.png" },
      { slug: "aramco", label: "ARAMCO", img: "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Saudi_Aramco_logo.svg/1200px-Saudi_Aramco_logo.svg.png" },
    ]
  });
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState<number | null>(null);
  const [draggingSlideIdx, setDraggingSlideIdx] = useState<number | null>(null);
  const [aboutData, setAboutData] = useState<{
    title: string;
    subtitle: string;
    whoWeAreTitle: string;
    whoWeAreDesc: string;
    services: { title: string; desc: string }[];
    profileContents: { num: string; title: string; desc: string }[];
  }>({ 
    title: "A Professional Digital Company Profile", 
    subtitle: "A structured presentation of VISO's identity, security consultancy lifecycle, capabilities, sectors, credentials and integrated digital services.", 
    whoWeAreTitle: "VISO Security Consultancy",
    whoWeAreDesc: "VISO provides security consultancy services across the lifecycle of security risk assessment, concept and detailed design, construction supervision, testing, commissioning and operational readiness. The website is intended to present this capability clearly while connecting supporting services and secure internal portals.",
    services: [
      { title: "Security Consulting", desc: "Physical security lifecycle" },
      { title: "Translation", desc: "Certified translation services" },
      { title: "Digital Portal", desc: "Employee + DMS access" },
      { title: "SAIS", desc: "Regulatory alignment" }
    ],
    profileContents: [
      { num: "01", title: "Identity & Positioning", desc: "Clear corporate introduction, value proposition and service positioning." },
      { num: "02", title: "Capabilities & Lifecycle", desc: "Four connected security consultancy stages." },
      { num: "03", title: "Sectors & Clients", desc: "Approved client logos, sectors and project environments." },
      { num: "04", title: "Credentials & Verification", desc: "Licensing, qualification and official verification links." }
    ]
  });

  const [aboutPageData, setAboutPageData] = useState<{
    visionTitle: string;
    visionSub: string;
    visionP: string;
    missionTitle: string;
    missionSub: string;
    missionP: string;
    valuesTitle: string;
    valuesSub: string;
    valuesP: string;
  }>({
    visionTitle: "Our Vision",
    visionSub: "TRUSTED LEADERSHIP IN PHYSICAL SECURITY",
    visionP: "To lead the physical security consultancy sector through technical expertise, continuous innovation, and rigorous standards. We build resilient security frameworks that protect communities, operations, and assets for generations to come.",
    missionTitle: "Our Mission",
    missionSub: "SECURING CRITICAL ASSETS",
    missionP: "To deliver integrated physical security consulting services that safeguard national infrastructure, corporate assets, and human life. We protect our clients through proactive risk management, robust engineering, and strict compliance with global standards.",
    valuesTitle: "Our Values",
    valuesSub: "INTEGRITY, EXCELLENCE & INNOVATION",
    valuesP: "Grounded in transparency, integrity, and fair stakeholder engagement. We consistently exceed expectations by pairing client-focused service with disciplined leadership to build a culture of lasting operational safety."
  });

  const [coreValuesData, setCoreValuesData] = useState<{ title: string, subtitle: string, items: any[] }>({
    title: "Our Core Values",
    subtitle: "Guiding principles that drive our excellence.",
    items: [
      { id: "1", title: "Honesty & Integrity", desc: "Our guiding philosophy revolves around transparency and professionalism. We remain prudent and fair in dealing with all stakeholders.", points: ["Transparent Communication", "Uncompromising Ethics", "Fair Stakeholder Practices"], imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80" },
      { id: "2", title: "Customer Excellence", desc: "We strive to fully understand our clients' needs to deliver tailored, premium security solutions that exceed expectations.", points: ["Tailored Security Solutions", "Proactive Client Support", "Exceeding Expectations"], imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" },
      { id: "3", title: "Leadership & Prudence", desc: "As we build a robust security culture, we optimize resources and lead by example in setting industry standards.", points: ["Robust Security Culture", "Resource Optimization", "Setting Industry Standards"], imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },
      { id: "4", title: "Innovation & Change", desc: "We are an organization in constant progress, continuously adapting to new threats and integrating cutting-edge technologies.", points: ["Continuous Progress", "Threat Adaptation", "Cutting-Edge Technologies"], imageUrl: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=400&q=80" }
    ]
  });
  const [areasData, setAreasData] = useState<{ title: string, subtitle: string, items: any[] }>({ 
    title: "Areas We Serve", 
    subtitle: "Protecting vital sectors with specialized physical security consulting and architectural integration.", 
    items: [
      { title: "Integrated Security Systems", desc: "Delivering comprehensive physical and cyber security architectures, ensuring end-to-end compliance with SAIS and national security directives.", image_url: "https://res.cloudinary.com/dppwnds6z/image/upload/v1789932578/ChatGPT_Image_Sep_21_2026_12_59_12_AM.png" },
      { title: "Meteorological Solutions", desc: "Advanced monitoring and predictive frameworks for atmospheric conditions, optimizing flight safety and complex airport operations.", image_url: "https://res.cloudinary.com/dppwnds6z/image/upload/v1789932592/ChatGPT_Image_Sep_21_2026_12_59_37_AM.png" },
      { title: "Aviation Technology", desc: "Engineering and deploying state-of-the-art Air Traffic Control, NAVAIDS, and communication networks for civil and military airspace.", image_url: "https://res.cloudinary.com/dppwnds6z/image/upload/v1789932597/ChatGPT_Image_Sep_21_2026_12_59_48_AM.png" },
      { title: "ICT & Connectivity", desc: "Providing high-performance information and communication technology consulting to maximize operational workflow and secure data infrastructures.", image_url: "" },
      { title: "Marine Surveying", desc: "Executing precision hydrographic surveys, spatial mapping, and maritime analytics to support complex offshore deployments.", image_url: "" },
      { title: "Engineering Design", desc: "End-to-end turnkey engineering blueprints spanning structural security, ICT, and unified protection systems, from concept to final execution.", image_url: "" }
    ] 
  });
  const [servicesData, setServicesData] = useState<{ title1: string, title2: string, desc: string, items: any[] }>({ 
    title1: "Our Core", 
    title2: "Services", 
    desc: "Supporting Every Stage of the HCIS / SAIS Security Project Lifecycle\nWhether developing a new facility or upgrading an existing asset, security requirements evolve throughout the project lifecycle. VISO provides specialist security engineering consultancy from project initiation through operational readiness, ensuring security objectives, engineering deliverables, and regulatory requirements remain aligned at every stage.", 
    items: [] 
  });
  const [frameworkData, setFrameworkData] = useState<{ titleMono: string, title1: string, title2: string, desc: string, items: any[] }>({ 
    titleMono: "Security Consulting Framework", 
    title1: "A Structured Four-Stage", 
    title2: "Security Approval Process", 
    desc: "We guide organizations through a comprehensive security consultancy process designed to support regulatory compliance and operational readiness. Discover how our structured methodology ensures every phase is meticulously designed and validated.", 
    items: [] 
  });
  const [showcaseData, setShowcaseData] = useState<{ imageUrl: string }>({ imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80" });
  const [clientsData, setClientsData] = useState<{ titleMono: string, title1: string, title2: string, items: any[] }>({ 
    titleMono: "Trusted By", 
    title1: "Leading", 
    title2: "Companies.", 
    items: [
      { name: "Saudi Aramco", sector: "Oil & Gas", icon: "🛢️" },
      { name: "NEOM", sector: "Mega Project", icon: "🏙️" },
      { name: "National Water Company", sector: "Water Utility", icon: "💧" },
      { name: "Saudi Electricity Company", sector: "Power Utility", icon: "⚡" },
      { name: "SAMA — Saudi Central Bank", sector: "Government / Financial", icon: "🏛️" },
      { name: "Ma'aden", sector: "Mining", icon: "⛏️" },
      { name: "SATORP", sector: "Refinery", icon: "🛢️" },
      { name: "MARAFIQ", sector: "Utilities", icon: "🔌" },
      { name: "ACWA Power", sector: "Power & Water", icon: "💡" },
      { name: "Saudi Chemical Company", sector: "Defense & Chemicals", icon: "🧪" },
      { name: "Amazon", sector: "E-commerce", icon: "📦" },
      { name: "Ritz-Carlton", sector: "Hospitality", icon: "🏨" },
      { name: "Jotun", sector: "Paints", icon: "🎨" },
      { name: "ROSHN", sector: "Real Estate", icon: "🏘️" },
      { name: "Red Sea Global", sector: "Mega Project", icon: "🌊" },
      { name: "Royal Commission for Jubail & Yanbu", sector: "Government", icon: "🏛️" },
      { name: "Red Sea International", sector: "Construction", icon: "🏗️" },
      { name: "Dammam Port", sector: "Port Authority", icon: "⚓" },
      { name: "Jeddah Islamic Port", sector: "Port", icon: "🚢" },
      { name: "Jazan Port", sector: "Port", icon: "🛳️" },
    ] 
  });
  const [clientPageCategoriesData, setClientPageCategoriesData] = useState<ClientCategory[]>(clientCategoriesData);
  
  const [lifecycleData, setLifecycleData] = useState<{ title: string, subtitle: string, items: any[] }>({
    title: "Service Lifecycle",
    subtitle: "Four Stages. One Security Lifecycle.",
    items: [
      { num: "01", title: "Security Risk Assessment", desc: "Assessment of threats, vulnerabilities, perimeter, gates, access points, critical assets and the initial security concept around the facility.", points: "Threat and vulnerability assessment\nPerimeter, gate and access-point review\nCritical asset identification\nInitial protection requirements", deliverable: "Risk & Threat Matrix", imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80", color: "from-blue-900/40 to-blue-900/5", accent: "text-blue-400", bgAccent: "bg-blue-400", border: "border-blue-900/30", bgHover: "group-hover:bg-blue-900/10" },
      { num: "02", title: "Concept / Preliminary Design", desc: "Translate risk findings into a protection philosophy, security zoning, system concepts, preliminary layouts and technology requirements.", points: "Protection philosophy\nConcept CCTV coverage\nAccess control and zoning\nPreliminary control-room concept", deliverable: "Preliminary Design Report", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", color: "from-emerald-900/40 to-emerald-900/5", accent: "text-emerald-400", bgAccent: "bg-emerald-400", border: "border-emerald-900/30", bgHover: "group-hover:bg-emerald-900/10" },
      { num: "03", title: "Detailed Design", desc: "Develop implementation-level drawings, specifications, schedules, interfaces and integration requirements suitable for procurement and construction.", points: "Detailed layouts and schematics\nEquipment and device schedules\nTechnical specifications\nSystems integration requirements", deliverable: "Tender-Ready Blueprints", imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", color: "from-purple-900/40 to-purple-900/5", accent: "text-purple-400", bgAccent: "bg-purple-400", border: "border-purple-900/30", bgHover: "group-hover:bg-purple-900/10" },
      { num: "04", title: "Construction & Readiness", desc: "Supervision, technical submittal review, inspections, testing, commissioning, handover and confirmation of operational readiness.", points: "Construction supervision\nFAT / SAT and commissioning\nDefect and closeout tracking\nOperational readiness and handover", deliverable: "Operational Handover", imageUrl: "https://nxio.net/wp-content/uploads/2024/11/Two-coworkers-collaborating-in-server-room.jpg", color: "from-orange-900/40 to-orange-900/5", accent: "text-orange-400", bgAccent: "bg-orange-400", border: "border-orange-900/30", bgHover: "group-hover:bg-orange-900/10" }
    ]
  });

  const [locationsData, setLocationsData] = useState<{ title: string, subtitle: string, cities: any[] }>({
    title: "OUR LOCATION",
    subtitle: "Serving Saudi Arabia and Surroundings",
    cities: [
      { id: "riyadh", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790668720/ChatGPT_Image_Sep_29_2026_01_27_25_PM.png" },
      { id: "khobar", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790761271/ChatGPT_Image_Sep_30_2026_03_10_59_PM.png" },
      { id: "jubail", bgImage: "https://i.vimeocdn.com/video/2099272543-c3cc6657da44aea5870525710e085cc6c97b501e7baed679991b0c2c1da4fc6d-d?f=webp" },
      { id: "yanbu", bgImage: "https://www.eritrea-focus.org/wp-content/uploads/2026/07/download.webp" },
      { id: "jeddah", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790761414/ChatGPT_Image_Sep_30_2026_03_13_20_PM.png" },
    ]
  });

  const [statsData, setStatsData] = useState<{ title: string, items: any[] }>({
    title: "Measurable Excellence",
    items: [
      { target: 2, prefix: "$", suffix: "B+", label: "Assets Protected" },
      { target: 45, prefix: "", suffix: "", label: "Global Partners" },
      { target: 99, prefix: "", suffix: "%", label: "Design Compliance" }
    ]
  });

  const [ctaData, setCtaData] = useState<{ title1: string, title2: string, desc: string, buttonText: string, imageUrl: string }>({
    title1: "SECURE",
    title2: "YOUR VISION.",
    desc: "Partner with VISO to engineer resilience into your next architectural masterpiece.",
    buttonText: "Schedule a Consultation",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
  });

  const [footerData, setFooterData] = useState<{ imageUrl: string }>({
    imageUrl: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790680329/ChatGPT_Image_Sep_29_2026_04_41_56_PM.png"
  });

  const [projectsData, setProjectsData] = useState<ProjectItem[]>([...PROJECTS]);

  // Inquiries State
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiriesError, setInquiriesError] = useState<string | null>(null);

  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);

  const fetchPendingLeaves = async () => {
    try {
      const data = await fetchLeaveRequests();
      setPendingLeavesCount(data.filter(req => req.status === 'pending').length);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    setInquiriesError(null);
    try {
      const data = await fetchContactSubmissions();
      setInquiries(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load inquiries";
      console.error("Inquiries fetch error:", e);
      setInquiriesError(msg);
      setInquiries([]);
    }
    setInquiriesLoading(false);
  };

  useEffect(() => {
    const storedSessionStr = localStorage.getItem('viso_admin_session');
    if (storedSessionStr) {
      try {
        const storedSession = JSON.parse(storedSessionStr);
        setSession(storedSession);
        if (storedSession.role === 'super_admin' || storedSession.role === 'admin') {
          fetchImages();
          fetchCoreValues();
          fetchCmsData();
          fetchInquiries();
          fetchAuditLogs();
        }
        if (storedSession.role === 'super_admin' || storedSession.role === 'hr') {
          fetchJobApps();
          fetchPendingLeaves();
        }
        if (storedSession.role === 'super_admin') {
          fetchUsers();
          fetchAuthUsers();
        }

        // Default tab based on role if they re-open the page
        const dmsRoles = ['document_controller', 'manager', 'reviewer', 'viewer'];
        if (dmsRoles.includes(storedSession.role) && !["dms"].includes(activeTab)) setActiveTab("dms");
        else if ((storedSession.role === 'employee' || storedSession.role === 'hr') && !["hr", "job_apps", "dms"].includes(activeTab)) setActiveTab("hr");
      } catch (e) {
        localStorage.removeItem('viso_admin_session');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (
      activeTab === "inquiries" &&
      (session?.role === "super_admin" || session?.role === "admin")
    ) {
      fetchInquiries();
    }
  }, [activeTab, session?.role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { data, error } = await supabase
      .from('portal_users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle();
      
    if (error || !data) {
      setLoginError("Invalid email or password");
    } else {
       setSession(data);
       localStorage.setItem('viso_admin_session', JSON.stringify(data));
       
       if (data.role === 'super_admin' || data.role === 'admin') {
         fetchImages();
         fetchCoreValues();
         fetchCmsData();
         fetchInquiries();
         fetchAuditLogs();
       }
       if (data.role === 'super_admin' || data.role === 'hr') {
         fetchJobApps();
         fetchPendingLeaves();
       }
       if (data.role === 'super_admin') {
         fetchUsers();
         fetchAuthUsers();
       }
       
       if (['document_controller', 'manager', 'reviewer', 'viewer'].includes(data.role)) setActiveTab("dms");
       else if (data.role === 'employee' || data.role === 'hr') setActiveTab("hr");
       else setActiveTab("homepage");
    }
  };

  const handleLogout = async () => {
    setSession(null);
    localStorage.removeItem('viso_admin_session');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('portal_users').insert([{
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      department: newUserDept,
      grade: "Professional"
    }]);
    if (error) {
      alert("Error creating user: " + error.message);
    } else {
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      fetchUsers();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await supabase.from('portal_users').delete().eq('id', id);
    fetchUsers();
  };

  const fetchImages = async () => {
    try {
      const data = await fetchGalleryImageRecords();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchCoreValues = async () => {
    const { data, error } = await supabase
      .from("core_values")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (error) {
      console.error("Error fetching core values:", error);
    } else {
      if (data && data.length === 0 && !seedAttempted.current) {
        seedAttempted.current = true;
        handleSeedCoreValues();
      } else {
        setCoreValues(data || []);
      }
    }
  };

  const handleSeedCmsData = async () => {
    const defaultData: any[] = [
      { section_key: 'hero', content: heroData },
      { section_key: 'about', content: aboutData },
      { section_key: 'about_page', content: aboutPageData },
      { section_key: 'core_values', content: coreValuesData },
      { section_key: 'areas', content: areasData },
      { section_key: 'services', content: servicesData },
      { section_key: 'framework', content: frameworkData },
      { section_key: 'showcase', content: showcaseData },
      { section_key: 'clients', content: clientsData },
      { section_key: 'lifecycle', content: lifecycleData },
      { section_key: 'locations', content: locationsData },
      { section_key: 'stats', content: statsData },
      { section_key: 'cta', content: ctaData },
      { section_key: 'footer', content: footerData },
      { section_key: 'client_page_categories', content: clientPageCategoriesData },
      { section_key: 'projects', content: projectsData }
    ];
    for (const item of defaultData) {
      await supabase.from('cms_content').upsert(item, { onConflict: 'section_key' }).select();
    }
    // reload data after seeding
    const { data, error } = await supabase.from('cms_content').select('*');
    if (!error && data) {
      data.forEach(row => {
        if (row.section_key === 'client_page_categories') setClientPageCategoriesData(row.content || clientCategoriesData);
        if (row.section_key === 'hero') {
          const content = row.content || {};
          if (!content.slides || content.slides.length === 0) {
            content.slides = [...DEFAULT_HERO_SLIDES];
          }
          if (!content.regulatoryLogos || content.regulatoryLogos.length === 0) {
            content.regulatoryLogos = [
              { slug: "moi", label: "MOI", img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790599258/download.png" },
              { slug: "sais", label: "SAIS", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBwqTj0FNNJJm59mHR1GKznOvHK23QpPB5jwKZQuFaQ&s=10" },
              { slug: "neom", label: "NEOM", img: "https://neom.scene7.com/is/image/neom/logo-neom-en-spaced?fmt=png-alpha&scl=1" },
              { slug: "api780", label: "API 780", img: "https://theshopmag.com/wp-content/uploads/2023/05/api-logo-stacked.png" },
              { slug: "aramco", label: "ARAMCO", img: "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Saudi_Aramco_logo.svg/1200px-Saudi_Aramco_logo.svg.png" },
            ];
          }
          setHeroData(content);
        }
        if (row.section_key === 'about') {
          const content = row.content || {};
          if (!content.services || content.services.length === 0) {
            content.services = [
              { title: "Security Consulting", desc: "Physical security lifecycle" },
              { title: "Translation", desc: "Certified translation services" },
              { title: "Digital Portal", desc: "Employee + DMS access" },
              { title: "SAIS", desc: "Regulatory alignment" }
            ];
          }
          if (!content.profileContents || content.profileContents.length === 0) {
            content.profileContents = [
              { num: "01", title: "Identity & Positioning", desc: "Clear corporate introduction, value proposition and service positioning." },
              { num: "02", title: "Capabilities & Lifecycle", desc: "Four connected security consultancy stages." },
              { num: "03", title: "Sectors & Clients", desc: "Approved client logos, sectors and project environments." },
              { num: "04", title: "Credentials & Verification", desc: "Licensing, qualification and official verification links." }
            ];
          }
          setAboutData(content);
        }
        if (row.section_key === 'about_page') {
          setAboutPageData(row.content || {});
        }
        if (row.section_key === 'core_values') setCoreValuesData(row.content);
        if (row.section_key === 'areas') setAreasData(row.content);
        if (row.section_key === 'services') setServicesData(row.content);
        if (row.section_key === 'framework') setFrameworkData(row.content);
        if (row.section_key === 'showcase') setShowcaseData(row.content);
        if (row.section_key === 'clients') setClientsData(row.content);
        if (row.section_key === 'lifecycle') setLifecycleData(row.content);
        if (row.section_key === 'locations') {
          const content = row.content || {};
          if (!content.cities || content.cities.length === 0) {
            content.cities = [
              { id: "riyadh", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790668720/ChatGPT_Image_Sep_29_2026_01_27_25_PM.png" },
              { id: "khobar", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790761271/ChatGPT_Image_Sep_30_2026_03_10_59_PM.png" },
              { id: "jubail", bgImage: "https://i.vimeocdn.com/video/2099272543-c3cc6657da44aea5870525710e085cc6c97b501e7baed679991b0c2c1da4fc6d-d?f=webp" },
              { id: "yanbu", bgImage: "https://www.eritrea-focus.org/wp-content/uploads/2026/07/download.webp" },
              { id: "jeddah", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790761414/ChatGPT_Image_Sep_30_2026_03_13_20_PM.png" },
            ];
          }
          setLocationsData(content);
        }
        if (row.section_key === 'stats') setStatsData(row.content);
        if (row.section_key === 'cta') setCtaData(row.content);
        if (row.section_key === 'footer') setFooterData(row.content);
        if (row.section_key === 'projects') setProjectsData(row.content || PROJECTS);
      });
    }
  };

  const fetchCmsData = async () => {
    const { data, error } = await supabase.from('cms_content').select('*');
    if (!error && data) {
      if (data.length === 0) {
        handleSeedCmsData();
        return;
      }
      data.forEach(row => {
        if (row.section_key === 'hero') {
          const content = row.content || {};
          if (!content.slides || content.slides.length === 0) {
            content.slides = [...DEFAULT_HERO_SLIDES];
          }
          if (!content.regulatoryLogos || content.regulatoryLogos.length === 0) {
            content.regulatoryLogos = [
              { slug: "moi", label: "MOI", img: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790599258/download.png" },
              { slug: "sais", label: "SAIS", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgBwqTj0FNNJJm59mHR1GKznOvHK23QpPB5jwKZQuFaQ&s=10" },
              { slug: "neom", label: "NEOM", img: "https://neom.scene7.com/is/image/neom/logo-neom-en-spaced?fmt=png-alpha&scl=1" },
              { slug: "api780", label: "API 780", img: "https://theshopmag.com/wp-content/uploads/2023/05/api-logo-stacked.png" },
              { slug: "aramco", label: "ARAMCO", img: "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Saudi_Aramco_logo.svg/1200px-Saudi_Aramco_logo.svg.png" },
            ];
          }
          setHeroData(content);
        }
        if (row.section_key === 'about') {
          const content = row.content || {};
          if (!content.services || content.services.length === 0) {
            content.services = [
              { title: "Security Consulting", desc: "Physical security lifecycle" },
              { title: "Translation", desc: "Certified translation services" },
              { title: "Digital Portal", desc: "Employee + DMS access" },
              { title: "SAIS", desc: "Regulatory alignment" }
            ];
          }
          if (!content.profileContents || content.profileContents.length === 0) {
            content.profileContents = [
              { num: "01", title: "Identity & Positioning", desc: "Clear corporate introduction, value proposition and service positioning." },
              { num: "02", title: "Capabilities & Lifecycle", desc: "Four connected security consultancy stages." },
              { num: "03", title: "Sectors & Clients", desc: "Approved client logos, sectors and project environments." },
              { num: "04", title: "Credentials & Verification", desc: "Licensing, qualification and official verification links." }
            ];
          }
          setAboutData(content);
        }
        if (row.section_key === 'about_page') {
          setAboutPageData(row.content || {});
        }
        if (row.section_key === 'core_values') setCoreValuesData(row.content);
        if (row.section_key === 'areas') setAreasData(row.content);
        if (row.section_key === 'services') setServicesData(row.content);
        if (row.section_key === 'framework') setFrameworkData(row.content);
        if (row.section_key === 'showcase') setShowcaseData(row.content);
        if (row.section_key === 'clients') setClientsData(row.content);
        if (row.section_key === 'lifecycle') setLifecycleData(row.content);
        if (row.section_key === 'locations') {
          const content = row.content || {};
          if (!content.cities || content.cities.length === 0) {
            content.cities = [
              { id: "riyadh", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790668720/ChatGPT_Image_Sep_29_2026_01_27_25_PM.png" },
              { id: "khobar", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790761271/ChatGPT_Image_Sep_30_2026_03_10_59_PM.png" },
              { id: "jubail", bgImage: "https://i.vimeocdn.com/video/2099272543-c3cc6657da44aea5870525710e085cc6c97b501e7baed679991b0c2c1da4fc6d-d?f=webp" },
              { id: "yanbu", bgImage: "https://www.eritrea-focus.org/wp-content/uploads/2026/07/download.webp" },
              { id: "jeddah", bgImage: "https://res.cloudinary.com/dppwnds6z/image/upload/v1790761414/ChatGPT_Image_Sep_30_2026_03_13_20_PM.png" },
            ];
          }
          setLocationsData(content);
        }
        if (row.section_key === 'stats') setStatsData(row.content);
        if (row.section_key === 'cta') setCtaData(row.content);
        if (row.section_key === 'footer') setFooterData(row.content);
        if (row.section_key === 'client_page_categories') setClientPageCategoriesData(row.content || clientCategoriesData);
        if (row.section_key === 'projects') setProjectsData(row.content || PROJECTS);
      });
    }
  };

  const handleSlideFileUpload = async (file: File, index: number) => {
    setUploadingSlideIdx(index);
    try {
      const publicUrl = await uploadGalleryImage(file, "hero");
      const updated = [...(heroData.slides || [])];
      if (!updated[index]) updated[index] = { title: "", imageUrl: "" };
      updated[index] = { ...updated[index], imageUrl: publicUrl };
      setHeroData({ ...heroData, slides: updated });
    } catch (err) {
      console.error("Hero image upload failed:", err);
      alert(`Upload failed: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setUploadingSlideIdx(null);
    }
  };

  const uploadFileToGallery = async (file: File) => {
    setUploading(true);
    try {
      const publicUrl = await uploadGalleryImage(file);
      await insertGalleryImageRecord(publicUrl);
      fetchImages();
    } catch (err) {
      console.error("Gallery upload error:", err);
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(
        `Error uploading gallery image: ${msg}\n\nIf this is your first time, run gallery_setup.sql in Supabase SQL Editor.`
      );
    }
    setUploading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    await uploadFileToGallery(e.target.files[0]);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput) return;
    
    setUploading(true);
    try {
      await insertGalleryImageRecord(imageUrlInput);
      fetchImages();
      setImageUrlInput("");
    } catch (err) {
      console.error("Database error:", err);
      alert(
        `Error saving image URL: ${err instanceof Error ? err.message : "unknown"}\n\nRun gallery_setup.sql in Supabase if the table is missing.`
      );
    }
    setUploading(false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFileToGallery(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteGalleryImageRecord(id, imageUrl);
      fetchImages();
    } catch (err) {
      alert(`Could not delete image: ${err instanceof Error ? err.message : "unknown"}`);
    }
  };

  const handleCoreValueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = (e.currentTarget.elements.namedItem("cvImage") as HTMLInputElement);
    let publicUrl = cvImageUrl;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      setCvUploading(true);
      try {
        publicUrl = await uploadGalleryImage(file, "core-values");
      } catch (err) {
        console.error("Upload error:", err);
        alert(`Error uploading image: ${err instanceof Error ? err.message : "unknown"}`);
        setCvUploading(false);
        return;
      }
    }

    if (!publicUrl) {
      alert("Please provide an image URL or upload a file.");
      return;
    }

    setCvUploading(true);
    const pointsArray = cvPoints.split(",").map(p => p.trim()).filter(p => p !== "");
    
    if (editingId) {
      const { error: dbError } = await supabase
        .from('core_values')
        .update({ 
          title: cvTitle, 
          description: cvDesc, 
          points: pointsArray, 
          image_url: publicUrl 
        })
        .eq('id', editingId);

      if (dbError) {
        console.error("Database error:", dbError);
        alert("Error updating core value.");
      } else {
        handleCancelEdit();
        if (fileInput) fileInput.value = "";
        fetchCoreValues();
      }
    } else {
      const { error: dbError } = await supabase
        .from('core_values')
        .insert([{ 
          title: cvTitle, 
          description: cvDesc, 
          points: pointsArray, 
          image_url: publicUrl 
        }]);

      if (dbError) {
        console.error("Database error:", dbError);
        alert("Error saving core value to database.");
      } else {
        handleCancelEdit();
        if (fileInput) fileInput.value = "";
        fetchCoreValues();
      }
    }
    
    setCvUploading(false);
  };

  const handleEdit = (cv: any) => {
    setEditingId(cv.id);
    setCvTitle(cv.title);
    setCvDesc(cv.description);
    setCvPoints(cv.points ? cv.points.join(", ") : "");
    setCvImageUrl(cv.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCvTitle("");
    setCvDesc("");
    setCvPoints("");
    setCvImageUrl("");
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...coreValues];
    const temp = newArr[index];
    newArr[index] = newArr[index - 1];
    newArr[index - 1] = temp;
    setCoreValues(newArr);
    setOrderChanged(true);
  };

  const handleMoveDown = (index: number) => {
    if (index === coreValues.length - 1) return;
    const newArr = [...coreValues];
    const temp = newArr[index];
    newArr[index] = newArr[index + 1];
    newArr[index + 1] = temp;
    setCoreValues(newArr);
    setOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    const now = Date.now();
    // Rewrite created_at to strictly increasing dates based on current visual order
    const promises = coreValues.map((cv, index) => {
      // Each item gets a date 1 second later than the previous
      const newDate = new Date(now + index * 1000).toISOString();
      return supabase.from('core_values').update({ created_at: newDate }).eq('id', cv.id);
    });

    try {
      await Promise.all(promises);
      setOrderChanged(false);
      fetchCoreValues();
    } catch (err) {
      console.error("Failed to save order", err);
      alert("Failed to save order.");
    }
  };

  const handleCancelOrder = () => {
    setOrderChanged(false);
    fetchCoreValues();
  };

  const handleDeleteCoreValue = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this core value?")) return;

    // 1. Delete from database
    await supabase.from('core_values').delete().eq('id', id);

    // 2. Extract filename from URL and delete from storage
    try {
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('gallery').remove([fileName]);
    } catch (err) {
      console.error("Could not delete from storage", err);
    }

    fetchCoreValues(); // Refresh list
  };

  const handleSeedCoreValues = async () => {
    const seedData = [
      { 
        title: "Honesty & Integrity", 
        description: "Our guiding philosophy revolves around transparency and professionalism. We remain prudent and fair in dealing with all stakeholders.", 
        points: ["Transparent Communication", "Uncompromising Ethics", "Fair Stakeholder Practices"], 
        image_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80" 
      },
      { 
        title: "Customer Excellence", 
        description: "We strive to fully understand our clients' needs to deliver tailored, premium security solutions that exceed expectations.", 
        points: ["Tailored Security Solutions", "Proactive Client Support", "Exceeding Expectations"], 
        image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" 
      },
      { 
        title: "Leadership & Prudence", 
        description: "As we build a robust security culture, we optimize resources and lead by example in setting industry standards.", 
        points: ["Robust Security Culture", "Resource Optimization", "Setting Industry Standards"], 
        image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" 
      },
      { 
        title: "Innovation & Change", 
        description: "We are an organization in constant progress, continuously adapting to new threats and integrating cutting-edge technologies.", 
        points: ["Continuous Progress", "Threat Adaptation", "Cutting-Edge Technologies"], 
        image_url: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=400&q=80" 
      }
    ];

    const { error } = await supabase.from('core_values').insert(seedData);
    if (error) {
      console.error("Seed error:", error);
      alert("Failed to seed core values. Did you create the table?");
    } else {
      fetchCoreValues();
    }
  };

  const handleSaveCmsSection = async (section: string, data: any) => {
    try {
      const { data: existing } = await supabase
        .from('cms_content')
        .select('section_key, content')
        .eq('section_key', section)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('cms_content')
          .update({ content: data })
          .eq('section_key', section);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cms_content')
          .insert([{ section_key: section, content: data }]);
        if (error) throw error;
      }
      
      // Save audit log
      const auditPayload = {
        section_key: section,
        old_content: existing ? existing.content : null,
        new_content: data,
        changed_by: session?.email || 'Unknown User'
      };
      
      const { error: auditError } = await supabase
        .from('cms_audit_logs')
        .insert([auditPayload]);
        
      if (auditError) {
        console.error("Failed to save audit log:", auditError);
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("viso_cms_updated"));
      }

      alert(`${section} section saved successfully!`);
    } catch (error: any) {
      console.error("Error saving CMS section:", error);
      alert(`Failed to save ${section} section: ` + error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
        <div className="absolute top-6 right-8">
          <ThemeToggle />
        </div>
        <div className="max-w-md w-full bg-white dark:bg-[#1C2541] p-8 rounded border border-foreground/10 text-center">
          <div className="flex justify-center mb-6">
            <img loading="lazy" decoding="async" src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png" alt="VISO Logo" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded bg-background border border-foreground/20 focus:outline-none focus:border-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors mt-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }


  const navItems = [
    { id: 'cms', label: 'CMS', icon: LayoutDashboard, roles: ['super_admin', 'admin'] },
    { id: 'cms_history', label: 'CMS History', icon: History, roles: ['super_admin', 'admin'] },
    { id: 'certificates', label: 'Certificates', icon: FileText, roles: ['super_admin', 'admin'] },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, roles: ['super_admin', 'admin'] },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, roles: ['super_admin', 'admin'], badge: inquiries.filter((inq) => inq.status === 'unread').length, badgeColor: 'bg-red-500 text-white' },
    { id: 'job_apps', label: 'Job Applications', icon: Briefcase, roles: ['super_admin', 'hr', 'admin'], badge: jobApps.filter((app) => app.status === 'New').length, badgeColor: 'bg-primary text-primary-foreground' },
    { id: 'dms', label: 'DMS Platform', icon: FileText, roles: ['super_admin', 'admin', 'manager', 'reviewer', 'employee', 'viewer', 'document_controller'] },
    { id: 'hr', label: 'HR / ESS Portal', icon: Users, roles: ['super_admin', 'hr', 'employee'], badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined, badgeColor: 'bg-orange-500 text-white' },
    { id: 'users', label: 'Admin Access', icon: Settings, roles: ['super_admin'] },
    { id: 'auth_users', label: 'Registered Employees', icon: Users, roles: ['super_admin'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(session?.role || ''));

  return (
    <div className="flex h-screen bg-surface-2 text-foreground overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <aside className={`flex-none z-[40] bg-[#0B1329] text-white border-r border-[#1C2541] transition-all duration-300 ${mobileSidebarOpen ? 'w-64 absolute h-full shadow-2xl' : 'w-0 lg:w-64 hidden lg:flex'} flex-col overflow-y-auto`}>
         <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
             <img loading="lazy" decoding="async" src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png" alt="VISO Logo" className="h-8 w-auto object-contain mr-3" />
             <span className="font-bold text-sm tracking-wider">VISO ADMIN</span>
         </div>
         
         <div className="flex-1 py-4 flex flex-col gap-1 px-3">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 px-3">Modules</div>
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setMobileSidebarOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 text-sm w-full text-left ${isActive ? 'bg-primary text-[#0B1329] font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon size={16} />
                  <span className="flex-1">{item.label}</span>
                  {(item.badge || 0) > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-[#0B1329] text-primary' : 'bg-primary text-[#0B1329]'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
         </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] dark:bg-[#050505]">
        
        {/* Top Header */}
        <header className="h-16 flex-none bg-white dark:bg-[#070B14] border-b border-foreground/10 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded hover:bg-white dark:bg-[#1C2541] text-foreground/70"
            >
              <div className="space-y-1">
                <div className="w-5 h-0.5 bg-current"></div>
                <div className="w-5 h-0.5 bg-current"></div>
                <div className="w-5 h-0.5 bg-current"></div>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/50">Admin Console</span>
              <ChevronRight size={14} className="text-foreground/30" />
              <h1 className="text-sm font-semibold text-foreground/90 tracking-tight">
                {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-sm font-medium text-foreground/60 hidden md:flex items-center gap-2">
               <span>{session.email}</span>
               <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{session.role.replace('_', ' ')}</span>
             </div>
             <div className="w-px h-6 bg-foreground/10 mx-2 hidden sm:block"></div>
             <ThemeToggle />
             <button
               onClick={handleLogout}
               className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors text-sm font-medium"
             >
               <LogOut size={16} />
               <span className="hidden sm:inline">Sign Out</span>
             </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] dark:bg-[#050505] relative">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full h-full">

        {activeTab === 'gallery' && (
          <>
            <div className="bg-white dark:bg-[#1C2541] p-6 rounded border border-foreground/10 mb-8 grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl mb-4">Upload New Image</h2>
                <div 
                  className={`border-2 border-dashed rounded p-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-foreground/20 hover:border-primary/50'}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <Upload className="w-8 h-8 mx-auto mb-4 text-foreground/40" />
                  <p className="text-sm text-foreground/60 mb-4">Drag and drop your image here, or</p>
                  <label className="cursor-pointer inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors shadow-sm">
                    {uploading ? 'Uploading...' : 'Browse Files'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl mb-4">Or Add via URL</h2>
                <form onSubmit={handleUrlSubmit} className="flex flex-col gap-4 bg-surface p-6 rounded border border-foreground/10 h-full justify-center">
                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-70">Image Address (URL)</label>
                    <input 
                      type="url" 
                      required
                      placeholder="https://example.com/image.jpg"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/20 focus:outline-none focus:border-primary transition-colors"
                      disabled={uploading}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={uploading || !imageUrlInput}
                    className="bg-primary text-primary-foreground font-medium px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {uploading ? 'Saving...' : 'Add Image URL'}
                  </button>
                </form>
              </div>
            </div>

            <h2 className="text-xl mb-4">Current Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-foreground/10 aspect-square">
                  <img loading="lazy" decoding="async" src={img.image_url} alt="Gallery item" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(img.id, img.image_url)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {images.length === 0 && (
                <p className="text-foreground/60 col-span-full">No images in the gallery yet.</p>
              )}
            </div>
          </>
        )}


        {activeTab === 'cms_history' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">CMS Revision History</h2>
              <button 
                onClick={fetchAuditLogs}
                className="bg-primary/10 text-primary px-4 py-2 rounded hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                Refresh History
              </button>
            </div>
            {auditLogsLoading ? (
              <p>Loading history...</p>
            ) : auditLogs.length === 0 ? (
              <div className="bg-surface p-8 rounded border border-foreground/10 text-center text-foreground/50">
                No changes have been recorded yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-surface px-4 py-3 rounded-lg border border-foreground/10 flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-primary/20 text-primary font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                          {String(log.section_key || "").replace(/_/g, " ")}
                        </span>
                        <span className="text-foreground/60 text-xs">
                          by <strong className="text-foreground font-medium">{log.changed_by}</strong>
                        </span>
                      </div>
                      <span className="text-xs text-foreground/45">{new Date(log.changed_at).toLocaleString()}</span>
                    </div>

                    <CmsChangeDiff oldContent={log.old_content} newContent={log.new_content} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeTab === 'homepage' || activeTab === 'cms') && (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1C2541] p-6 rounded-2xl border border-foreground/10 shadow-xs">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                  {selectedCmsPage 
                    ? `${[
                        { id: "home", title: "Home Page" },
                        { id: "about_us", title: "About Us Page" },
                        { id: "security", title: "Security & Services Page" },
                        { id: "projects_page", title: "Projects Portfolio Page" },
                        { id: "clients_page", title: "Clients Portfolio Page" },
                        { id: "footer_contact", title: "Contact & Footer" },
                      ].find(p => p.id === selectedCmsPage)?.title || 'Page'} CMS Management`
                    : "Website Content Management System (CMS)"}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCmsPage
                    ? "Editing sections and content for this page."
                    : "Select a page card below to manage its specific content and sections."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedCmsPage && (
                  <button
                    onClick={() => { setSelectedCmsPage(null); setCmsSection(null); }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    All Pages Cards
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to overwrite all sections with the default seed content? This cannot be undone.")) {
                      await handleSeedCmsData();
                      alert("Successfully seeded defaults!");
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-medium transition-colors"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* LEVEL 1: PAGE CARDS GRID (When no page is selected) */}
            {!selectedCmsPage ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: "home",
                    title: "Home Page",
                    badge: "MAIN LANDING PAGE",
                    desc: "Hero background video, executive intro, core values, areas served, services, framework & clients.",
                    icon: LayoutDashboard,
                    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
                    defaultSection: "hero",
                    sectionCount: 9,
                  },
                  {
                    id: "about_us",
                    title: "About Us Page",
                    badge: "ABOUT PAGE",
                    desc: "Corporate vision statement, mission, core identity, and company values.",
                    icon: Users,
                    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                    defaultSection: "about_page",
                    sectionCount: 2,
                  },
                  {
                    id: "security",
                    title: "Security & Services Page",
                    badge: "SOLUTIONS & SERVICES",
                    desc: "HCIS / SAIS security engineering directives, 4-stage framework & lifecycle deliverables.",
                    icon: Briefcase,
                    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
                    defaultSection: "services",
                    sectionCount: 3,
                  },
                  {
                    id: "projects_page",
                    title: "Projects Portfolio Page",
                    badge: "PROJECTS & METRICS",
                    desc: "Aramco/SIPCHEM project database, sector filters & performance metrics counters.",
                    icon: Briefcase,
                    badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20",
                    defaultSection: "projects",
                    sectionCount: 2,
                  },
                  {
                    id: "clients_page",
                    title: "Clients Portfolio Page",
                    badge: "OUR CLIENTS",
                    desc: "Manage side headings (categories like ENERGY & PETROCHEMICALS) and logos with names.",
                    icon: Briefcase,
                    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
                    defaultSection: "client_page_categories",
                    sectionCount: 1,
                  },
                  {
                    id: "footer_contact",
                    title: "Contact & Footer",
                    badge: "FOOTER & BANNERS",
                    desc: "Call-to-action consultation request banners, footer links, copyright & address.",
                    icon: Link,
                    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                    defaultSection: "cta",
                    sectionCount: 2,
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        setSelectedCmsPage(card.id);
                        setCmsSection(card.defaultSection);
                      }}
                      className="group cursor-pointer rounded-2xl border border-foreground/10 bg-white dark:bg-[#1C2541] p-6 shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-md uppercase tracking-wider ${card.badgeColor}`}>
                            {card.badge}
                          </span>
                          <div className="p-2.5 rounded-xl bg-foreground/5 group-hover:bg-primary/10 transition-colors">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                          {card.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                          {card.desc}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-foreground/10 flex items-center justify-between text-xs font-bold text-primary">
                        <span>Manage Page Content ({card.sectionCount} Sections)</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LEVEL 2: PAGE SECTIONS & EDITOR AREA */
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Sidebar: ONLY SECTIONS BELONGING TO THIS SELECTED PAGE */}
                <div className="w-full md:w-60 flex flex-col gap-1.5 shrink-0 bg-white dark:bg-[#1C2541] p-4 rounded-2xl border border-foreground/10 shadow-xs h-fit">
                  <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-foreground/10">
                    <span className="font-bold text-foreground/70 uppercase tracking-widest text-[10px]">
                      Page Sections
                    </span>
                    <button
                      onClick={() => { setSelectedCmsPage(null); setCmsSection(null); }}
                      className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      Cards View
                    </button>
                  </div>
                  {(selectedCmsPage === 'home'
                    ? [
                        { id: "hero", label: "Hero Banner & Video" },
                        { id: "about", label: "Executive Intro" },
                        { id: "core_values", label: "Core Values" },
                        { id: "areas", label: "Areas We Serve" },
                        { id: "services", label: "Security Services Overview" },
                        { id: "framework", label: "Approval Framework Overview" },
                        { id: "showcase", label: "Showcase Banner" },
                        { id: "clients", label: "Leading Clients" },
                        { id: "locations", label: "Office Locations" },
                      ]
                    : selectedCmsPage === 'about_us'
                    ? [
                        { id: "about_page", label: "Vision & Mission Statements" },
                        { id: "core_values", label: "Core Values" },
                      ]
                    : selectedCmsPage === 'security'
                    ? [
                        { id: "services", label: "Security Engineering Directives" },
                        { id: "framework", label: "4-Stage Approval Framework" },
                        { id: "lifecycle", label: "Service Lifecycle Deliverables" },
                      ]
                    : selectedCmsPage === 'projects_page'
                    ? [
                        { id: "projects", label: "Projects Database" },
                        { id: "stats", label: "Performance Metrics" },
                      ]
                    : selectedCmsPage === 'clients_page'
                    ? [
                        { id: "client_page_categories", label: "Client Categories & Logos" },
                      ]
                    : [
                        { id: "cta", label: "Call to Action Banners" },
                        { id: "footer", label: "Footer & Legal Info" },
                      ]
                  ).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCmsSection(s.id)}
                      className={`text-left px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                        cmsSection === s.id
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground font-medium'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Right Area: CMS Editor */}
                <div className="flex-1 bg-white dark:bg-[#1C2541] p-6 rounded-2xl border border-foreground/10 shadow-xs">
              {cmsSection === 'hero' && (
                <div className="flex flex-col gap-4 max-w-5xl">
                  {/* Compact Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-foreground/10">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Hero Section Configuration</h2>
                      <p className="text-[11px] text-muted-foreground">
                        Configure the homepage hero background video and compliance logos.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveCmsSection('hero', heroData)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Hero
                      </button>
                    </div>
                  </div>

                  {/* Hero Background Video Section */}
                  <div className="p-4 rounded-xl border border-foreground/10 bg-background/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <Video className="w-4 h-4 text-primary" />
                        Hero Background Video URL
                      </label>
                      <span className="text-[10px] text-muted-foreground">MP4 video link for homepage background</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://res.cloudinary.com/.../video.mp4"
                        value={heroData.videoUrl || ""}
                        onChange={(e) => setHeroData({ ...heroData, videoUrl: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-lg bg-surface border border-foreground/15 text-xs text-foreground font-mono placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
                      />
                      {heroData.videoUrl && (
                        <a
                          href={heroData.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview Video
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Hero Featured Core Services Section (Security Consultancy & Translation Services) */}
                  <div className="p-4 rounded-xl border border-foreground/10 bg-background/60 space-y-4 mt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-foreground/10">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                          <Layers className="w-4 h-4 text-primary" />
                          Hero Core Services (Security Consultancy & Translation)
                        </h3>
                        <p className="text-[11px] text-muted-foreground">Manage the text, descriptions, links, and buttons for the 2 hero section services.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Service 1: Security Consultancy */}
                      <div className="p-3.5 rounded-lg border border-foreground/10 bg-surface space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary uppercase font-mono">Service #1: Security Consultancy</span>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-foreground/60 mb-1">Title</label>
                          <input
                            type="text"
                            value={heroData.slides?.[0]?.title || "Security Consultancy"}
                            onChange={(e) => {
                              const slides = [...(heroData.slides || [{ title: "Security Consultancy" }, { title: "Translation Services" }])];
                              slides[0] = { ...slides[0], title: e.target.value };
                              setHeroData({ ...heroData, slides });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-foreground/60 mb-1">Subtitle / Description</label>
                          <textarea
                            value={heroData.slides?.[0]?.subtitle || "Comprehensive Physical Security Threat and Risk Assessment."}
                            onChange={(e) => {
                              const slides = [...(heroData.slides || [{ title: "Security Consultancy" }, { title: "Translation Services" }])];
                              slides[0] = { ...slides[0], subtitle: e.target.value };
                              setHeroData({ ...heroData, slides });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none min-h-[55px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/60 mb-1">Button Link</label>
                            <input
                              type="text"
                              value={heroData.slides?.[0]?.link || "/security"}
                              onChange={(e) => {
                                const slides = [...(heroData.slides || [{ title: "Security Consultancy" }, { title: "Translation Services" }])];
                                slides[0] = { ...slides[0], link: e.target.value };
                                setHeroData({ ...heroData, slides });
                              }}
                              className="w-full px-2.5 py-1 text-xs font-mono rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/60 mb-1">Button Text</label>
                            <input
                              type="text"
                              value={heroData.slides?.[0]?.buttonText || "Go to Security"}
                              onChange={(e) => {
                                const slides = [...(heroData.slides || [{ title: "Security Consultancy" }, { title: "Translation Services" }])];
                                slides[0] = { ...slides[0], buttonText: e.target.value };
                                setHeroData({ ...heroData, slides });
                              }}
                              className="w-full px-2.5 py-1 text-xs rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Service 2: Translation Services */}
                      <div className="p-3.5 rounded-lg border border-foreground/10 bg-surface space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary uppercase font-mono">Service #2: Translation Services</span>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-foreground/60 mb-1">Title</label>
                          <input
                            type="text"
                            value={heroData.slides?.[1]?.title || "Translation Services"}
                            onChange={(e) => {
                              const slides = [...(heroData.slides || [{ title: "Security Consultancy" }, { title: "Translation Services" }])];
                              slides[1] = { ...slides[1], title: e.target.value };
                              setHeroData({ ...heroData, slides });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-foreground/60 mb-1">Subtitle / Description</label>
                          <textarea
                            value={heroData.slides?.[1]?.subtitle || "Certified Translation Services for Technical, Legal, Medical, Official, and Security Documents."}
                            onChange={(e) => {
                              const slides = [...(heroData.slides || [{ title: "Security Consultancy" }, { title: "Translation Services" }])];
                              slides[1] = { ...slides[1], subtitle: e.target.value };
                              setHeroData({ ...heroData, slides });
                            }}
                            className="w-full px-3 py-1.5 text-xs rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none min-h-[55px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/60 mb-1">Button Link</label>
                            <input
                              type="text"
                              value={heroData.slides?.[1]?.link || "/translation"}
                              onChange={(e) => {
                                const slides = [...(heroData.slides || [{ title: "Security Consultancy" }, { title: "Translation Services" }])];
                                slides[1] = { ...slides[1], link: e.target.value };
                                setHeroData({ ...heroData, slides });
                              }}
                              className="w-full px-2.5 py-1 text-xs font-mono rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/60 mb-1">Button Text</label>
                            <input
                              type="text"
                              value={heroData.slides?.[1]?.buttonText || "Go to Translation"}
                              onChange={(e) => {
                                const slides = [...(heroData.slides || [{ title: "Security Consultancy" }, { title: "Translation Services" }])];
                                slides[1] = { ...slides[1], buttonText: e.target.value };
                                setHeroData({ ...heroData, slides });
                              }}
                              className="w-full px-2.5 py-1 text-xs rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Regulatory Logos Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 pt-6 border-b border-foreground/10 mt-4">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Standard & Compliance Logos</h2>
                      <p className="text-[11px] text-muted-foreground">
                        Logos displayed on the top left of the Hero Section.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentLogos = heroData.regulatoryLogos || [];
                          setHeroData({
                            ...heroData,
                            regulatoryLogos: [
                              ...currentLogos,
                              { slug: "new", label: "New Standard", img: "" },
                            ],
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-foreground/15 hover:bg-foreground/5 text-foreground transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Logo
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(heroData.regulatoryLogos || []).map((logo, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 p-2 rounded-lg border border-foreground/10 bg-background/60 hover:border-foreground/20 transition-all"
                      >
                        {/* Logo Thumbnail */}
                        <div className="relative shrink-0 w-12 h-12 rounded-md overflow-hidden border border-foreground/15 bg-surface flex items-center justify-center">
                          {logo.img ? (
                            <img src={logo.img} alt={logo.label} className="w-full h-full object-contain p-1" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                          )}
                        </div>

                        {/* Inputs */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Label (e.g. SAIS)"
                            value={logo.label || ""}
                            onChange={(e) => {
                              const updated = [...(heroData.regulatoryLogos || [])];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setHeroData({ ...heroData, regulatoryLogos: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-md bg-surface border border-foreground/15 text-xs text-foreground font-medium placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Slug (e.g. sais)"
                            value={logo.slug || ""}
                            onChange={(e) => {
                              const updated = [...(heroData.regulatoryLogos || [])];
                              updated[idx] = { ...updated[idx], slug: e.target.value };
                              setHeroData({ ...heroData, regulatoryLogos: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-md bg-surface border border-foreground/15 text-xs text-foreground font-mono placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                          />
                          <input
                            type="url"
                            placeholder="Image URL"
                            value={logo.img || ""}
                            onChange={(e) => {
                              const updated = [...(heroData.regulatoryLogos || [])];
                              updated[idx] = { ...updated[idx], img: e.target.value };
                              setHeroData({ ...heroData, regulatoryLogos: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-md bg-surface border border-foreground/15 text-xs text-foreground font-mono placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                          />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0 self-end md:self-center">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx === 0) return;
                              const updated = [...(heroData.regulatoryLogos || [])];
                              const temp = updated[idx];
                              updated[idx] = updated[idx - 1];
                              updated[idx - 1] = temp;
                              setHeroData({ ...heroData, regulatoryLogos: updated });
                            }}
                            className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:hover:text-muted-foreground transition-colors cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (heroData.regulatoryLogos || []).length - 1}
                            onClick={() => {
                              if (idx === (heroData.regulatoryLogos || []).length - 1) return;
                              const updated = [...(heroData.regulatoryLogos || [])];
                              const temp = updated[idx];
                              updated[idx] = updated[idx + 1];
                              updated[idx + 1] = temp;
                              setHeroData({ ...heroData, regulatoryLogos: updated });
                            }}
                            className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:hover:text-muted-foreground transition-colors cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (heroData.regulatoryLogos || []).filter((_, i) => i !== idx);
                              setHeroData({ ...heroData, regulatoryLogos: updated });
                            }}
                            className="p-1 rounded text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(heroData.regulatoryLogos || []).length === 0 && (
                      <div className="p-4 text-center rounded-lg border border-dashed border-foreground/20 text-muted-foreground text-xs">
                        No logos configured. Click "Add Logo" to create one.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {cmsSection === 'about' && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl mb-2">Edit Digital Company Profile</h2>
                  
                  <div className="bg-background p-6 rounded border border-foreground/10 space-y-4">
                    <h3 className="font-bold text-lg border-b border-foreground/10 pb-2 mb-4">Header</h3>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={aboutData.title}
                        onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subtitle</label>
                      <textarea
                        value={aboutData.subtitle}
                        onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-20"
                      />
                    </div>
                  </div>

                  <div className="bg-background p-6 rounded border border-foreground/10 space-y-4">
                    <h3 className="font-bold text-lg border-b border-foreground/10 pb-2 mb-4">Who We Are</h3>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={aboutData.whoWeAreTitle}
                        onChange={(e) => setAboutData({ ...aboutData, whoWeAreTitle: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={aboutData.whoWeAreDesc}
                        onChange={(e) => setAboutData({ ...aboutData, whoWeAreDesc: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-32"
                      />
                    </div>
                  </div>

                  <div className="bg-background p-6 rounded border border-foreground/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-foreground/10 pb-2 mb-4">
                      <h3 className="font-bold text-lg">Digital Services</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {aboutData.services.map((srv, idx) => (
                        <div key={idx} className="bg-surface p-4 rounded border border-foreground/10 relative">
                          <div><label className="block text-xs font-bold mb-1 opacity-70">Title</label><input type="text" value={srv.title} onChange={(e) => { const newSrv = [...aboutData.services]; newSrv[idx].title = e.target.value; setAboutData({ ...aboutData, services: newSrv }); }} className="w-full px-3 py-2 rounded bg-background border border-foreground/20 mb-2" /></div>
                          <div><label className="block text-xs font-bold mb-1 opacity-70">Description</label><input type="text" value={srv.desc} onChange={(e) => { const newSrv = [...aboutData.services]; newSrv[idx].desc = e.target.value; setAboutData({ ...aboutData, services: newSrv }); }} className="w-full px-3 py-2 rounded bg-background border border-foreground/20" /></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-background p-6 rounded border border-foreground/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-foreground/10 pb-2 mb-4">
                      <h3 className="font-bold text-lg">Profile Contents</h3>
                    </div>
                    <div className="space-y-4">
                      {aboutData.profileContents.map((pc, idx) => (
                        <div key={idx} className="bg-surface p-4 rounded border border-foreground/10 grid md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-2"><label className="block text-xs font-bold mb-1 opacity-70">Num</label><input type="text" value={pc.num} onChange={(e) => { const newPc = [...aboutData.profileContents]; newPc[idx].num = e.target.value; setAboutData({ ...aboutData, profileContents: newPc }); }} className="w-full px-3 py-2 rounded bg-background border border-foreground/20" /></div>
                          <div className="md:col-span-4"><label className="block text-xs font-bold mb-1 opacity-70">Title</label><input type="text" value={pc.title} onChange={(e) => { const newPc = [...aboutData.profileContents]; newPc[idx].title = e.target.value; setAboutData({ ...aboutData, profileContents: newPc }); }} className="w-full px-3 py-2 rounded bg-background border border-foreground/20" /></div>
                          <div className="md:col-span-6"><label className="block text-xs font-bold mb-1 opacity-70">Description</label><input type="text" value={pc.desc} onChange={(e) => { const newPc = [...aboutData.profileContents]; newPc[idx].desc = e.target.value; setAboutData({ ...aboutData, profileContents: newPc }); }} className="w-full px-3 py-2 rounded bg-background border border-foreground/20" /></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveCmsSection('about', aboutData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Digital Company Profile
                  </button>
                </div>
              )}

              {cmsSection === 'about_page' && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl mb-2">Edit About Page Content</h2>
                  
                  {/* Vision */}
                  <div className="bg-background p-6 rounded border border-foreground/10 space-y-4">
                    <h3 className="font-bold text-lg border-b border-foreground/10 pb-2 mb-4">Vision</h3>
                    <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={aboutPageData.visionTitle} onChange={(e) => setAboutPageData({ ...aboutPageData, visionTitle: e.target.value })} className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium mb-1">Subtitle</label><input type="text" value={aboutPageData.visionSub} onChange={(e) => setAboutPageData({ ...aboutPageData, visionSub: e.target.value })} className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium mb-1">Paragraph</label><textarea value={aboutPageData.visionP} onChange={(e) => setAboutPageData({ ...aboutPageData, visionP: e.target.value })} className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-24" /></div>
                  </div>

                  {/* Mission */}
                  <div className="bg-background p-6 rounded border border-foreground/10 space-y-4">
                    <h3 className="font-bold text-lg border-b border-foreground/10 pb-2 mb-4">Mission</h3>
                    <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={aboutPageData.missionTitle} onChange={(e) => setAboutPageData({ ...aboutPageData, missionTitle: e.target.value })} className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium mb-1">Subtitle</label><input type="text" value={aboutPageData.missionSub} onChange={(e) => setAboutPageData({ ...aboutPageData, missionSub: e.target.value })} className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium mb-1">Paragraph</label><textarea value={aboutPageData.missionP} onChange={(e) => setAboutPageData({ ...aboutPageData, missionP: e.target.value })} className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-24" /></div>
                  </div>

                  {/* Values */}
                  <div className="bg-background p-6 rounded border border-foreground/10 space-y-4">
                    <h3 className="font-bold text-lg border-b border-foreground/10 pb-2 mb-4">Values</h3>
                    <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={aboutPageData.valuesTitle} onChange={(e) => setAboutPageData({ ...aboutPageData, valuesTitle: e.target.value })} className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium mb-1">Subtitle</label><input type="text" value={aboutPageData.valuesSub} onChange={(e) => setAboutPageData({ ...aboutPageData, valuesSub: e.target.value })} className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium mb-1">Paragraph</label><textarea value={aboutPageData.valuesP} onChange={(e) => setAboutPageData({ ...aboutPageData, valuesP: e.target.value })} className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-24" /></div>
                  </div>

                  <button
                    onClick={() => handleSaveCmsSection('about_page', aboutPageData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save About Page Content
                  </button>
                </div>
              )}
              {cmsSection === 'core_values' && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl mb-2">Edit Core Values</h2>
                  <div className="bg-background p-6 rounded border border-foreground/10 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Section Title</label>
                      <input
                        type="text"
                        value={coreValuesData.title}
                        onChange={(e) => setCoreValuesData({ ...coreValuesData, title: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Section Subtitle</label>
                      <input
                        type="text"
                        value={coreValuesData.subtitle}
                        onChange={(e) => setCoreValuesData({ ...coreValuesData, subtitle: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b border-foreground/10 pb-2">Value Cards</h3>
                    {coreValuesData.items.map((cv: any, idx: number) => (
                      <div key={cv.id || idx} className="bg-background p-6 rounded border border-foreground/10 space-y-4 relative">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold mb-1 opacity-70">Card Title</label>
                            <input
                              type="text"
                              value={cv.title}
                              onChange={(e) => {
                                const newItems = [...coreValuesData.items];
                                newItems[idx].title = e.target.value;
                                setCoreValuesData({ ...coreValuesData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <MediaUploader 
                              label="Image URL" 
                              value={cv.imageUrl} 
                              folder="core_values" 
                              onChange={(url) => {
                                const newItems = [...coreValuesData.items];
                                newItems[idx].imageUrl = url;
                                setCoreValuesData({ ...coreValuesData, items: newItems });
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 opacity-70">Description</label>
                          <textarea
                            value={cv.desc}
                            onChange={(e) => {
                              const newItems = [...coreValuesData.items];
                              newItems[idx].desc = e.target.value;
                              setCoreValuesData({ ...coreValuesData, items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1 opacity-70">Bullet Points (comma separated)</label>
                          <input
                            type="text"
                            value={cv.points?.join(', ')}
                            onChange={(e) => {
                              const newItems = [...coreValuesData.items];
                              newItems[idx].points = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                              setCoreValuesData({ ...coreValuesData, items: newItems });
                            }}
                            className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSaveCmsSection('core_values', coreValuesData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Core Values
                  </button>
                </div>
              )}
              {cmsSection === 'areas' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl mb-4">Edit Areas We Serve</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Section Title</label>
                      <input
                        type="text"
                        value={areasData.title}
                        onChange={(e) => setAreasData({ ...areasData, title: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Section Subtitle</label>
                      <input
                        type="text"
                        value={areasData.subtitle}
                        onChange={(e) => setAreasData({ ...areasData, subtitle: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-foreground/10 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Area Cards</h3>
                      <button
                        onClick={() => setAreasData({ ...areasData, items: [...areasData.items, { title: "", desc: "", image_url: "" }] })}
                        className="bg-primary/20 text-primary px-4 py-2 rounded text-sm hover:bg-primary/30 transition-colors"
                      >
                        + Add Area
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {areasData.items.map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10 relative">
                          <button
                            onClick={() => {
                              const newItems = [...areasData.items];
                              newItems.splice(idx, 1);
                              setAreasData({ ...areasData, items: newItems });
                            }}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold"
                          >
                            Remove
                          </button>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-xs font-bold mb-1 opacity-70">Area Title</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const newItems = [...areasData.items];
                                  newItems[idx].title = e.target.value;
                                  setAreasData({ ...areasData, items: newItems });
                                }}
                                className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold mb-1 opacity-70">Icon Image URL</label>
                              <input
                                type="text"
                                value={item.image_url}
                                placeholder="Leave blank to use default SVG"
                                onChange={(e) => {
                                  const newItems = [...areasData.items];
                                  newItems[idx].image_url = e.target.value;
                                  setAreasData({ ...areasData, items: newItems });
                                }}
                                className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1 opacity-70">Description</label>
                            <textarea
                              value={item.desc}
                              onChange={(e) => {
                                const newItems = [...areasData.items];
                                newItems[idx].desc = e.target.value;
                                setAreasData({ ...areasData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-20"
                            />
                          </div>
                        </div>
                      ))}
                      {areasData.items.length === 0 && (
                        <div className="text-center p-8 text-foreground/50 border border-dashed border-foreground/20 rounded">
                          No area cards added yet. The default SVGs will be used on the homepage.
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveCmsSection('areas', areasData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Areas We Serve
                  </button>
                </div>
              )}

              {/* SERVICES CMS */}
              {cmsSection === 'services' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl mb-4">Edit Services</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 1</label>
                      <input
                        type="text"
                        value={servicesData.title1}
                        onChange={(e) => setServicesData({ ...servicesData, title1: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 2 (Italic)</label>
                      <input
                        type="text"
                        value={servicesData.title2}
                        onChange={(e) => setServicesData({ ...servicesData, title2: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={servicesData.desc}
                      onChange={(e) => setServicesData({ ...servicesData, desc: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-20"
                    />
                  </div>
                  
                  <div className="mt-8 border-t border-foreground/10 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Service Items</h3>
                      <button
                        onClick={() => setServicesData({ ...servicesData, items: [...servicesData.items, { num: "0" + (servicesData.items.length + 1), title: "", desc: "" }] })}
                        className="bg-primary/20 text-primary px-4 py-2 rounded text-sm hover:bg-primary/30 transition-colors"
                      >
                        + Add Service
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {servicesData.items.map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10 relative grid grid-cols-12 gap-4">
                          <button
                            onClick={() => {
                              const newItems = [...servicesData.items];
                              newItems.splice(idx, 1);
                              setServicesData({ ...servicesData, items: newItems });
                            }}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold"
                          >
                            Remove
                          </button>
                          <div className="col-span-2">
                            <label className="block text-xs font-bold mb-1 opacity-70">Num</label>
                            <input
                              type="text"
                              value={item.num}
                              onChange={(e) => {
                                const newItems = [...servicesData.items];
                                newItems[idx].num = e.target.value;
                                setServicesData({ ...servicesData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div className="col-span-10">
                            <label className="block text-xs font-bold mb-1 opacity-70">Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...servicesData.items];
                                newItems[idx].title = e.target.value;
                                setServicesData({ ...servicesData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none mb-2"
                            />
                            <label className="block text-xs font-bold mb-1 opacity-70">Description</label>
                            <textarea
                              value={item.desc}
                              onChange={(e) => {
                                const newItems = [...servicesData.items];
                                newItems[idx].desc = e.target.value;
                                setServicesData({ ...servicesData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-16"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveCmsSection('services', servicesData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Services
                  </button>
                </div>
              )}

              {/* FRAMEWORK CMS */}
              {cmsSection === 'framework' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl mb-4">Edit Framework Section</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Small Top Title</label>
                    <input
                      type="text"
                      value={frameworkData.titleMono}
                      onChange={(e) => setFrameworkData({ ...frameworkData, titleMono: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 1</label>
                      <input
                        type="text"
                        value={frameworkData.title1}
                        onChange={(e) => setFrameworkData({ ...frameworkData, title1: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 2 (Italic)</label>
                      <input
                        type="text"
                        value={frameworkData.title2}
                        onChange={(e) => setFrameworkData({ ...frameworkData, title2: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={frameworkData.desc}
                      onChange={(e) => setFrameworkData({ ...frameworkData, desc: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-20"
                    />
                  </div>

                  <div className="mt-8 border-t border-foreground/10 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Framework Stages</h3>
                      <button
                        onClick={() => setFrameworkData({ ...frameworkData, items: [...frameworkData.items, { id: Date.now(), num: "0" + (frameworkData.items.length + 1), title: "", subtitle: "" }] })}
                        className="bg-primary/20 text-primary px-4 py-2 rounded text-sm hover:bg-primary/30 transition-colors"
                      >
                        + Add Stage
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {frameworkData.items.map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10 relative grid grid-cols-12 gap-4">
                          <button
                            onClick={() => {
                              const newItems = [...frameworkData.items];
                              newItems.splice(idx, 1);
                              setFrameworkData({ ...frameworkData, items: newItems });
                            }}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold"
                          >
                            Remove
                          </button>
                          <div className="col-span-2">
                            <label className="block text-xs font-bold mb-1 opacity-70">Num</label>
                            <input
                              type="text"
                              value={item.num}
                              onChange={(e) => {
                                const newItems = [...frameworkData.items];
                                newItems[idx].num = e.target.value;
                                setFrameworkData({ ...frameworkData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div className="col-span-10">
                            <label className="block text-xs font-bold mb-1 opacity-70">Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...frameworkData.items];
                                newItems[idx].title = e.target.value;
                                setFrameworkData({ ...frameworkData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none mb-2"
                            />
                            <label className="block text-xs font-bold mb-1 opacity-70">Subtitle</label>
                            <textarea
                              value={item.subtitle}
                              onChange={(e) => {
                                const newItems = [...frameworkData.items];
                                newItems[idx].subtitle = e.target.value;
                                setFrameworkData({ ...frameworkData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none h-16"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveCmsSection('framework', frameworkData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Framework
                  </button>
                </div>
              )}

              {/* SHOWCASE CMS */}
              {cmsSection === 'showcase' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl mb-4">Edit Showcase Section</h2>
                  <MediaUploader 
                    label="Background Image URL"
                    value={showcaseData.imageUrl}
                    folder="showcase"
                    onChange={(url) => setShowcaseData({ imageUrl: url })}
                  />
                  <button
                    onClick={() => handleSaveCmsSection('showcase', showcaseData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Showcase
                  </button>
                </div>
              )}

              {/* CLIENTS CMS */}
              {cmsSection === 'clients' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl mb-4">Edit Leading Companies (Clients) Section</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Small Top Title</label>
                    <input
                      type="text"
                      value={clientsData.titleMono}
                      onChange={(e) => setClientsData({ ...clientsData, titleMono: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 1</label>
                      <input
                        type="text"
                        value={clientsData.title1}
                        onChange={(e) => setClientsData({ ...clientsData, title1: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title Part 2 (Italic)</label>
                      <input
                        type="text"
                        value={clientsData.title2}
                        onChange={(e) => setClientsData({ ...clientsData, title2: e.target.value })}
                        className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-foreground/10 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Clients</h3>
                      <button
                        onClick={() => setClientsData({ ...clientsData, items: [...clientsData.items, { name: "", sector: "", icon: "🏢" }] })}
                        className="bg-primary/20 text-primary px-4 py-2 rounded text-sm hover:bg-primary/30 transition-colors"
                      >
                        + Add Client
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientsData.items.map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10 relative">
                          <button
                            onClick={() => {
                              const newItems = [...clientsData.items];
                              newItems.splice(idx, 1);
                              setClientsData({ ...clientsData, items: newItems });
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
                          >
                            X
                          </button>
                          
                          <div className="flex flex-col gap-3">
                            <div>
                              <label className="block text-xs font-bold mb-1 opacity-70">Icon (URL, Emoji, or Upload)</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={item.icon}
                                  placeholder="Emoji or Image URL"
                                  onChange={(e) => {
                                    const newItems = [...clientsData.items];
                                    newItems[idx].icon = e.target.value;
                                    setClientsData({ ...clientsData, items: newItems });
                                  }}
                                  className="w-full px-2 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none text-center"
                                />
                                <label className="flex items-center justify-center bg-primary/10 text-primary p-2 rounded cursor-pointer hover:bg-primary/20 transition-colors" title="Upload Image">
                                  <Upload size={16} />
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        try {
                                          const publicUrl = await uploadGalleryImage(file, "clients");
                                          const newItems = [...clientsData.items];
                                          newItems[idx].icon = publicUrl;
                                          setClientsData({ ...clientsData, items: newItems });
                                        } catch (err) {
                                          alert(
                                            `Error uploading image: ${err instanceof Error ? err.message : "unknown"}\n\nRun gallery_setup.sql in Supabase.`
                                          );
                                        }
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              {item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/')) && (
                                <div className="mt-2 flex justify-center bg-surface p-2 rounded border border-foreground/10">
                                  <img loading="lazy" decoding="async" src={item.icon} alt="Preview" className="h-8 object-contain" />
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-bold mb-1 opacity-70">Name</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const newItems = [...clientsData.items];
                                  newItems[idx].name = e.target.value;
                                  setClientsData({ ...clientsData, items: newItems });
                                }}
                                className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none mb-2"
                              />
                              <label className="block text-xs font-bold mb-1 opacity-70">Sector</label>
                              <input
                                type="text"
                                value={item.sector}
                                onChange={(e) => {
                                  const newItems = [...clientsData.items];
                                  newItems[idx].sector = e.target.value;
                                  setClientsData({ ...clientsData, items: newItems });
                                }}
                                className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveCmsSection('clients', clientsData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Clients
                  </button>
                </div>
              )}
              {/* LIFECYCLE CMS */}
              {cmsSection === 'lifecycle' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl mb-4">Edit Service Lifecycle Section</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input type="text" value={lifecycleData.title} onChange={(e) => setLifecycleData({ ...lifecycleData, title: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <input type="text" value={lifecycleData.subtitle} onChange={(e) => setLifecycleData({ ...lifecycleData, subtitle: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" />
                  </div>
                  <div className="mt-8 border-t border-foreground/10 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Lifecycle Stages</h3>
                      <button onClick={() => setLifecycleData({ ...lifecycleData, items: [...lifecycleData.items, { num: "05", title: "", desc: "", points: "", deliverable: "", imageUrl: "", color: "from-blue-900/40 to-blue-900/5", accent: "text-blue-400", bgAccent: "bg-blue-400", border: "border-blue-900/30", bgHover: "group-hover:bg-blue-900/10" }] })} className="bg-primary/20 text-primary px-4 py-2 rounded text-sm hover:bg-primary/30 transition-colors">
                        + Add Stage
                      </button>
                    </div>
                    <div className="flex flex-col gap-6">
                      {lifecycleData.items.map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10 relative">
                          <button onClick={() => { const newItems = [...lifecycleData.items]; newItems.splice(idx, 1); setLifecycleData({ ...lifecycleData, items: newItems }); }} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold">X</button>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold mb-1 opacity-70">Number (e.g. 01)</label><input type="text" value={item.num} onChange={(e) => { const newItems = [...lifecycleData.items]; newItems[idx].num = e.target.value; setLifecycleData({ ...lifecycleData, items: newItems }); }} className="w-full px-3 py-2 rounded bg-surface border border-foreground/20" /></div>
                            <div><label className="block text-xs font-bold mb-1 opacity-70">Title</label><input type="text" value={item.title} onChange={(e) => { const newItems = [...lifecycleData.items]; newItems[idx].title = e.target.value; setLifecycleData({ ...lifecycleData, items: newItems }); }} className="w-full px-3 py-2 rounded bg-surface border border-foreground/20" /></div>
                            <div className="md:col-span-2"><label className="block text-xs font-bold mb-1 opacity-70">Description</label><textarea value={item.desc} onChange={(e) => { const newItems = [...lifecycleData.items]; newItems[idx].desc = e.target.value; setLifecycleData({ ...lifecycleData, items: newItems }); }} className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 h-20" /></div>
                            <div className="md:col-span-2"><label className="block text-xs font-bold mb-1 opacity-70">Bullet Points (One per line)</label><textarea value={item.points} onChange={(e) => { const newItems = [...lifecycleData.items]; newItems[idx].points = e.target.value; setLifecycleData({ ...lifecycleData, items: newItems }); }} className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 h-24" /></div>
                            <div><label className="block text-xs font-bold mb-1 opacity-70">Deliverable</label><input type="text" value={item.deliverable} onChange={(e) => { const newItems = [...lifecycleData.items]; newItems[idx].deliverable = e.target.value; setLifecycleData({ ...lifecycleData, items: newItems }); }} className="w-full px-3 py-2 rounded bg-surface border border-foreground/20" /></div>
                            <div className="md:col-span-2">
                              <MediaUploader 
                                label="Image URL" 
                                value={item.imageUrl || ''} 
                                folder="lifecycle" 
                                onChange={(url) => { const newItems = [...lifecycleData.items]; newItems[idx].imageUrl = url; setLifecycleData({ ...lifecycleData, items: newItems }); }} 
                              />
                            </div>
                            <div className="md:col-span-2">
                              <MediaUploader 
                                label="Video URL (Optional - Replaces Image)" 
                                value={item.videoUrl || ''} 
                                folder="lifecycle" 
                                type="video"
                                onChange={(url) => { const newItems = [...lifecycleData.items]; newItems[idx].videoUrl = url; setLifecycleData({ ...lifecycleData, items: newItems }); }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleSaveCmsSection('lifecycle', lifecycleData)} className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium">Save Service Lifecycle</button>
                </div>
              )}

              {/* LOCATIONS CMS */}
              {cmsSection === 'locations' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl mb-4">Edit Locations Section</h2>
                  <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={locationsData.title} onChange={(e) => setLocationsData({ ...locationsData, title: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Subtitle</label><input type="text" value={locationsData.subtitle} onChange={(e) => setLocationsData({ ...locationsData, subtitle: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <p className="text-sm text-foreground/50 mt-4 italic">Note: The interactive map markers and specific cities are currently hardcoded in the component for geographic precision, but the titles and background images can be edited here.</p>
                  
                  <div className="mt-4 border-t border-foreground/10 pt-6">
                    <h3 className="font-bold mb-4">City Background Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {locationsData.cities?.map((city, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10">
                          <MediaUploader 
                            label={`${city.id} Background Image URL`}
                            value={city.bgImage}
                            folder="locations"
                            onChange={(url) => {
                              const newCities = [...(locationsData.cities || [])];
                              newCities[idx].bgImage = url;
                              setLocationsData({ ...locationsData, cities: newCities });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleSaveCmsSection('locations', locationsData)} className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium">Save Locations</button>
                </div>
              )}

              {/* STATS CMS */}
              {cmsSection === 'stats' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl mb-4">Edit Stats Section</h2>
                  <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={statsData.title} onChange={(e) => setStatsData({ ...statsData, title: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <div className="mt-8 border-t border-foreground/10 pt-8">
                    <h3 className="font-bold mb-4">Statistics</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {statsData.items.map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded border border-foreground/10 relative">
                          <label className="block text-xs font-bold mb-1 opacity-70">Target Number</label>
                          <input type="number" value={item.target} onChange={(e) => { const newItems = [...statsData.items]; newItems[idx].target = Number(e.target.value); setStatsData({ ...statsData, items: newItems }); }} className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 mb-2" />
                          <label className="block text-xs font-bold mb-1 opacity-70">Prefix (e.g. $)</label>
                          <input type="text" value={item.prefix} onChange={(e) => { const newItems = [...statsData.items]; newItems[idx].prefix = e.target.value; setStatsData({ ...statsData, items: newItems }); }} className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 mb-2" />
                          <label className="block text-xs font-bold mb-1 opacity-70">Suffix (e.g. %)</label>
                          <input type="text" value={item.suffix} onChange={(e) => { const newItems = [...statsData.items]; newItems[idx].suffix = e.target.value; setStatsData({ ...statsData, items: newItems }); }} className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 mb-2" />
                          <label className="block text-xs font-bold mb-1 opacity-70">Label</label>
                          <input type="text" value={item.label} onChange={(e) => { const newItems = [...statsData.items]; newItems[idx].label = e.target.value; setStatsData({ ...statsData, items: newItems }); }} className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 mb-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleSaveCmsSection('stats', statsData)} className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium">Save Stats</button>
                </div>
              )}

              {/* CTA CMS */}
              {cmsSection === 'cta' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl mb-4">Edit Call to Action Section</h2>
                  <div><label className="block text-sm font-medium mb-1">Title Part 1</label><input type="text" value={ctaData.title1} onChange={(e) => setCtaData({ ...ctaData, title1: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Title Part 2</label><input type="text" value={ctaData.title2} onChange={(e) => setCtaData({ ...ctaData, title2: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={ctaData.desc} onChange={(e) => setCtaData({ ...ctaData, desc: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-20" /></div>
                  <div><label className="block text-sm font-medium mb-1">Button Text</label><input type="text" value={ctaData.buttonText} onChange={(e) => setCtaData({ ...ctaData, buttonText: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <MediaUploader 
                    label="Background Image URL"
                    value={ctaData.imageUrl}
                    folder="cta"
                    onChange={(url) => setCtaData({ ...ctaData, imageUrl: url })}
                  />
                  <button onClick={() => handleSaveCmsSection('cta', ctaData)} className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium">Save CTA</button>
                </div>
              )}

              {/* FOOTER CMS */}
              {cmsSection === 'footer' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl mb-4">Edit Footer Section</h2>
                  <MediaUploader 
                    label="Background Image URL (Cities)"
                    value={footerData.imageUrl}
                    folder="footer"
                    onChange={(url) => setFooterData({ ...footerData, imageUrl: url })}
                  />
                  <button onClick={() => handleSaveCmsSection('footer', footerData)} className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium">Save Footer</button>
                </div>
              )}

              {/* PROJECTS CMS */}
              {cmsSection === 'projects' && (
                <div className="flex flex-col gap-4 max-w-5xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-foreground/10">
                    <div>
                      <h2 className="text-2xl mb-1 font-semibold">Projects Portfolio</h2>
                      <p className="text-[11px] text-muted-foreground">Manage project cards, order position (Up/Down arrows), and month settings for the Projects page.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const sorted = [...projectsData].sort((a, b) => parseMonthYear(b.month) - parseMonthYear(a.month));
                          setProjectsData(sorted);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-foreground/20 text-foreground/80 hover:bg-foreground/5 transition-all cursor-pointer"
                        title="Sort cards by month (Newest to Oldest)"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-primary" /> Month (Newest)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const sorted = [...projectsData].sort((a, b) => parseMonthYear(a.month) - parseMonthYear(b.month));
                          setProjectsData(sorted);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-foreground/20 text-foreground/80 hover:bg-foreground/5 transition-all cursor-pointer"
                        title="Sort cards by month (Oldest to Newest)"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-primary" /> Month (Oldest)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProjectsData([
                            {
                              sNo: projectsData.length > 0 ? Math.max(...projectsData.map(p => p.sNo)) + 1 : 1,
                              name: "New Project",
                              client: "Client Name",
                              endUser: "End User",
                              sector: "SECTOR",
                              category: "infra",
                              status: "Ongoing",
                              scope: "Project scope description...",
                              month: "October 2024"
                            },
                            ...projectsData
                          ]);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-primary text-primary hover:bg-primary/10 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Project
                      </button>
                      <button
                        onClick={() => handleSaveCmsSection('projects', projectsData)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Projects
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 mt-2 h-[65vh] overflow-y-auto pr-2">
                    {projectsData.map((project, idx) => (
                      <div key={idx} className="bg-surface p-4 rounded-xl border border-foreground/10 space-y-3 relative group shadow-xs">
                        {/* Header bar with Up/Down arrows and controls */}
                        <div className="flex items-center justify-between pb-2 border-b border-foreground/10 bg-background/50 -mx-4 -mt-4 p-3 rounded-t-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                              Card #{idx + 1}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              (S.No #{project.sNo})
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Move Up Arrow Button */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                if (idx <= 0) return;
                                const newArr = [...projectsData];
                                const temp = newArr[idx];
                                newArr[idx] = newArr[idx - 1];
                                newArr[idx - 1] = temp;
                                setProjectsData(newArr);
                              }}
                              className="p-1.5 rounded-md border border-foreground/20 text-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground cursor-pointer"
                              title="Move Card Up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>

                            {/* Move Down Arrow Button */}
                            <button
                              type="button"
                              disabled={idx === projectsData.length - 1}
                              onClick={() => {
                                if (idx >= projectsData.length - 1) return;
                                const newArr = [...projectsData];
                                const temp = newArr[idx];
                                newArr[idx] = newArr[idx + 1];
                                newArr[idx + 1] = temp;
                                setProjectsData(newArr);
                              }}
                              className="p-1.5 rounded-md border border-foreground/20 text-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground cursor-pointer"
                              title="Move Card Down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove project "${project.name}"?`)) {
                                  const newArr = [...projectsData];
                                  newArr.splice(idx, 1);
                                  setProjectsData(newArr);
                                }
                              }}
                              className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10 transition-colors ml-2 cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Project Name</label>
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => {
                                const newArr = [...projectsData];
                                newArr[idx] = { ...newArr[idx], name: e.target.value };
                                setProjectsData(newArr);
                              }}
                              className="w-full px-3 py-1.5 text-sm rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-primary mb-1">Month / Date (Order Basis)</label>
                            <input
                              type="text"
                              value={project.month || ""}
                              onChange={(e) => {
                                const newArr = [...projectsData];
                                newArr[idx] = { ...newArr[idx], month: e.target.value };
                                setProjectsData(newArr);
                              }}
                              className="w-full px-3 py-1.5 text-sm rounded bg-background border border-primary/40 focus:border-primary focus:outline-none font-mono"
                              placeholder="e.g. October 2024, 2024-10"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Status</label>
                            <select
                              value={project.status}
                              onChange={(e) => {
                                const newArr = [...projectsData];
                                newArr[idx] = { ...newArr[idx], status: e.target.value as "Ongoing" | "Completed" };
                                setProjectsData(newArr);
                              }}
                              className="w-full px-3 py-1.5 text-sm rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                            >
                              <option value="Ongoing">Ongoing</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Client</label>
                            <input
                              type="text"
                              value={project.client}
                              onChange={(e) => {
                                const newArr = [...projectsData];
                                newArr[idx] = { ...newArr[idx], client: e.target.value };
                                setProjectsData(newArr);
                              }}
                              className="w-full px-3 py-1.5 text-sm rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">End User</label>
                            <input
                              type="text"
                              value={project.endUser}
                              onChange={(e) => {
                                const newArr = [...projectsData];
                                newArr[idx] = { ...newArr[idx], endUser: e.target.value };
                                setProjectsData(newArr);
                              }}
                              className="w-full px-3 py-1.5 text-sm rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Category (ID)</label>
                            <select
                              value={project.category}
                              onChange={(e) => {
                                const newArr = [...projectsData];
                                newArr[idx] = { ...newArr[idx], category: e.target.value };
                                setProjectsData(newArr);
                              }}
                              className="w-full px-3 py-1.5 text-sm rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                            >
                              <option value="oil-gas">Oil & Gas</option>
                              <option value="water">Water</option>
                              <option value="energy">Energy</option>
                              <option value="giga-projects">Giga Projects</option>
                              <option value="infra">Infra</option>
                              <option value="defence">Defence</option>
                              <option value="ports">Ports</option>
                              <option value="mining">Mining</option>
                              <option value="finance">Finance</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Sector Name (Display)</label>
                            <input
                              type="text"
                              value={project.sector}
                              onChange={(e) => {
                                const newArr = [...projectsData];
                                newArr[idx] = { ...newArr[idx], sector: e.target.value };
                                setProjectsData(newArr);
                              }}
                              className="w-full px-3 py-1.5 text-sm rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Location</label>
                            <input
                              type="text"
                              value={project.location || ""}
                              onChange={(e) => {
                                const newArr = [...projectsData];
                                newArr[idx] = { ...newArr[idx], location: e.target.value };
                                setProjectsData(newArr);
                              }}
                              className="w-full px-3 py-1.5 text-sm rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                              placeholder="e.g. Riyadh, KSA"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Highlight Badge</label>
                            <input
                              type="text"
                              value={project.highlight || ""}
                              onChange={(e) => {
                                const newArr = [...projectsData];
                                newArr[idx] = { ...newArr[idx], highlight: e.target.value };
                                setProjectsData(newArr);
                              }}
                              className="w-full px-3 py-1.5 text-sm rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                              placeholder="e.g. Flagship, VIP"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-foreground/50 mb-1">Scope of Work</label>
                          <textarea
                            value={project.scope}
                            onChange={(e) => {
                              const newArr = [...projectsData];
                              newArr[idx] = { ...newArr[idx], scope: e.target.value };
                              setProjectsData(newArr);
                            }}
                            className="w-full px-3 py-2 text-sm rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none min-h-[60px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CLIENTS PAGE CATEGORIES & LOGOS CMS */}
              {cmsSection === 'client_page_categories' && (
                <CmsClientsPageEditor
                  categories={clientPageCategoriesData}
                  onChange={(updated) => setClientPageCategoriesData(updated)}
                  onSave={() => handleSaveCmsSection('client_page_categories', clientPageCategoriesData)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (session?.role === 'super_admin' || session?.role === 'admin') && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl mb-2">Inquiries</h1>
                <p className="text-foreground/60">Submissions from the Contact page (and site popup).</p>
              </div>
              <button
                type="button"
                onClick={() => fetchInquiries()}
                className="text-sm px-4 py-2 rounded border border-foreground/15 hover:bg-foreground/5"
              >
                Refresh
              </button>
            </div>

            {inquiriesError && (
              <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-sm">
                <p className="font-semibold text-red-700 dark:text-red-300">Could not load inquiries</p>
                <p className="mt-1 text-red-600/90 dark:text-red-200/90">{inquiriesError}</p>
                <p className="mt-2 text-xs text-foreground/70">
                  In Supabase → SQL Editor, run <code className="bg-foreground/10 px-1 rounded">contact_submissions_rls_fix.sql</code> from this project, then click Refresh.
                </p>
              </div>
            )}

            {inquiriesLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : inquiries.length === 0 && !inquiriesError ? (
              <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded p-12 text-center">
                <p className="text-foreground/60 mb-2">No inquiries yet.</p>
                <p className="text-sm text-foreground/45">Submit a test message at <strong>/contact</strong>, then refresh here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg">{inq.name}</h3>
                        {inq.company && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{inq.company}</span>}
                        {inq.status === 'unread' && (
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-red-500/15 text-red-600 px-2 py-0.5 rounded">New</span>
                        )}
                      </div>
                      <span className="text-xs text-foreground/50">{new Date(inq.created_at).toLocaleString()}</span>
                    </div>
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                      <a href={`mailto:${inq.email}`} className="text-sm text-primary hover:underline">{inq.email}</a>
                      {inq.status === 'unread' && (
                        <button
                          type="button"
                          className="text-xs text-foreground/60 hover:text-primary underline"
                          onClick={async () => {
                            try {
                              await markInquiryRead(inq.id);
                              fetchInquiries();
                            } catch {
                              alert("Could not update status. Run contact_submissions_rls_fix.sql in Supabase.");
                            }
                          }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    <div className="bg-background rounded-lg p-4 border border-foreground/5">
                      <p className="text-foreground/80 text-sm whitespace-pre-wrap">{inq.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USERS & ROLES TAB */}
        {activeTab === 'users' && session?.role === 'super_admin' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <h1 className="text-3xl mb-2">Users & Roles</h1>
            <p className="text-foreground/60 mb-8">Manage employee credentials and portal access.</p>

            <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded p-6 mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={18} /> Create New User</h2>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input required type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input required type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input required type="text" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <input required type="text" value={newUserDept} onChange={e => setNewUserDept(e.target.value)} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none">
                    <option value="super_admin">Super Admin (Full Admin Access)</option>
                    <option value="admin">Admin (CMS & Inquiries Only)</option>
                    <option value="document_controller">Document Controller (EDMS)</option>
                    <option value="manager">Manager (EDMS approvals)</option>
                    <option value="reviewer">Reviewer (EDMS review)</option>
                    <option value="viewer">Viewer (EDMS read-only)</option>
                    <option value="hr">HR (ESS Portal)</option>
                    <option value="employee">Employee (EDMS + ESS)</option>
                  </select>
                </div>
                <div className="md:col-span-2 mt-2">
                  <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded font-medium hover:bg-primary/90 transition-colors">Create User</button>
                </div>
              </form>
            </div>

            <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white dark:bg-[#1C2541] text-foreground/60 font-medium border-b border-foreground/10">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-white dark:bg-[#1C2541] transition-colors">
                        <td className="px-6 py-4 font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-foreground/70">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase">{user.role.replace('_', ' ')}</span>
                        </td>
                        <td className="px-6 py-4 text-foreground/70">{user.department}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-600 transition-colors" disabled={user.email === 'superadmin@visogroup.com'}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REGISTERED EMPLOYEES TAB */}
        {activeTab === 'auth_users' && session?.role === 'super_admin' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="text-3xl mb-2">Registered Employees</h1>
                <p className="text-foreground/60">Employees who signed up via the employee login portal.</p>
              </div>
              <button
                type="button"
                onClick={() => fetchAuthUsers()}
                className="text-sm px-4 py-2 rounded border border-foreground/15 hover:bg-foreground/5 font-medium"
              >
                Refresh
              </button>
            </div>

            {authUsersLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : authUsers.length === 0 ? (
              <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded p-12 text-center">
                <p className="text-foreground/60 mb-2">No employees have signed up yet.</p>
                <p className="text-sm text-foreground/45">They will appear here once they create an account.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white dark:bg-[#1C2541] text-foreground/60 font-medium border-b border-foreground/10">
                      <tr>
                        <th className="px-6 py-4">Full Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Signed Up At</th>
                        <th className="px-6 py-4">Last Sign In</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5">
                      {authUsers.map((user: any) => (
                        <tr key={user.id} className="hover:bg-white dark:bg-[#1C2541] transition-colors">
                          <td className="px-6 py-4 font-bold">{user.full_name || 'N/A'}</td>
                          <td className="px-6 py-4 text-primary font-medium">{user.email}</td>
                          <td className="px-6 py-4 text-foreground/70">
                            {new Date(user.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-foreground/70">
                            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* JOB APPLICATIONS TAB */}
        {activeTab === 'job_apps' && (session?.role === 'super_admin' || session?.role === 'hr' || session?.role === 'admin') && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <h1 className="text-3xl mb-2">Job Applications</h1>
            <p className="text-foreground/60 mb-8">Review candidates from the public Careers portal.</p>

            {jobAppsLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : jobApps.length === 0 ? (
              <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded p-12 text-center">
                <p className="text-foreground/60">No applications received yet.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white dark:bg-[#1C2541] text-foreground/60 font-medium border-b border-foreground/10">
                      <tr>
                        <th className="px-6 py-4">Applicant</th>
                        <th className="px-6 py-4">Position</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Resume</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5">
                      {jobApps.map(app => (
                        <tr key={app.id} className="hover:bg-white dark:bg-[#1C2541] transition-colors">
                          <td className="px-6 py-4 font-medium">{app.name}</td>
                          <td className="px-6 py-4 text-primary font-bold">{app.position}</td>
                          <td className="px-6 py-4 text-foreground/70">
                            <div>{app.email}</div>
                            {app.phone && <div className="text-xs">{app.phone}</div>}
                          </td>
                          <td className="px-6 py-4">
                            {app.resume_url ? (
                              <a
                                href={app.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                View PDF
                              </a>
                            ) : (
                              <span className="text-foreground/35 text-xs">No file</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs font-bold uppercase">{app.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-foreground/50">{new Date(app.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DMS DASHBOARD */}
        {activeTab === 'dms' && ['super_admin', 'admin', 'document_controller', 'manager', 'reviewer', 'employee', 'viewer'].includes(session?.role || '') && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <DmsDashboard user={session} />
          </div>
        )}

        {/* HR DASHBOARD */}
        {activeTab === 'hr' && (session?.role === 'super_admin' || session?.role === 'hr' || session?.role === 'employee') && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <HrDashboard />
          </div>
        )}

        {/* CERTIFICATES DASHBOARD */}
        {activeTab === 'certificates' && (session?.role === 'super_admin' || session?.role === 'admin') && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <CertificatesDashboard />
          </div>
        )}
        </div>
      </main>
      </div>
    </div>
  );
}

function MinimalClientLogoForm({
  onSave,
  onCancel,
  initialData,
}: {
  onSave: (client: ClientItem) => void;
  onCancel?: () => void;
  initialData?: ClientItem;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      let publicUrl = "";
      try {
        publicUrl = await uploadGalleryImage(file, "clients");
      } catch (err) {
        publicUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      if (publicUrl) setIcon(publicUrl);
    } catch (err) {
      alert("Failed to process image file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#0B1329]/5 dark:bg-[#0B1329]/60 border border-primary/30 rounded-xl p-3 text-xs space-y-3 shadow-inner my-2">
      <div>
        <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">
          Client Name *
        </label>
        <input
          type="text"
          placeholder="e.g. Saudi Aramco"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg bg-background border border-foreground/20 text-xs focus:outline-none focus:border-primary"
        />
      </div>

      {/* Minimal Image Upload/Link Bar */}
      <div>
        <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">
          Client Logo (Upload File, Drag & Drop, or Image Link)
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* File Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className={`flex-1 w-full border border-dashed rounded-lg p-2 text-center transition-colors flex items-center justify-between px-3 ${
              isDragging ? "border-primary bg-primary/10" : "border-foreground/25 hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-1.5 text-foreground/70">
              <Upload className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px]">
                {uploading ? "Uploading..." : "Drag & drop file or browse"}
              </span>
            </div>
            <label className="cursor-pointer bg-primary/15 text-primary hover:bg-primary/25 px-2.5 py-1 rounded text-[10px] font-bold">
              Choose File
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
                disabled={uploading}
              />
            </label>
          </div>

          <span className="text-[10px] font-bold text-foreground/40 uppercase">OR</span>

          {/* URL Input */}
          <input
            type="text"
            placeholder="Paste Logo Image URL"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="flex-1 w-full px-3 py-2 rounded-lg bg-background border border-foreground/20 text-xs focus:outline-none focus:border-primary"
          />

          {/* Preview Thumbnail */}
          {icon && (
            <div className="h-9 w-12 shrink-0 bg-white rounded-lg border border-foreground/15 p-1 flex items-center justify-center">
              <img src={icon} alt="Preview" className="max-h-full max-w-full object-contain" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1.5 border-t border-foreground/10">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 rounded-lg bg-foreground/10 hover:bg-foreground/20 text-xs font-medium"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={!name.trim() || uploading}
          onClick={() => {
            if (!name.trim()) return;
            onSave({ name: name.trim(), icon: icon.trim(), url: initialData?.url || "" });
          }}
          className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-xs disabled:opacity-50"
        >
          {initialData ? "Update Logo" : "Add Logo"}
        </button>
      </div>
    </div>
  );
}

function CmsClientsPageEditor({
  categories,
  onChange,
  onSave,
}: {
  categories: ClientCategory[];
  onChange: (updated: ClientCategory[]) => void;
  onSave: () => void;
}) {
  const [addingToCategoryIdx, setAddingToCategoryIdx] = useState<number | null>(null);
  const [editingClientKey, setEditingClientKey] = useState<string | null>(null);

  const addCategory = () => {
    const title = prompt("Enter new category side heading name (e.g. ENERGY & PETROCHEMICALS):");
    if (!title || !title.trim()) return;
    onChange([...categories, { title: title.trim().toUpperCase(), clients: [] }]);
  };

  const updateCategoryTitle = (idx: number, newTitle: string) => {
    const updated = [...categories];
    updated[idx] = { ...updated[idx], title: newTitle };
    onChange(updated);
  };

  const deleteCategory = (idx: number) => {
    if (!confirm(`Are you sure you want to delete category "${categories[idx].title}"?`)) return;
    const updated = categories.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const moveCategory = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;
    const updated = [...categories];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);
  };

  const addClientLogo = (categoryIdx: number, client: ClientItem) => {
    const updated = [...categories];
    updated[categoryIdx] = {
      ...updated[categoryIdx],
      clients: [...updated[categoryIdx].clients, client],
    };
    onChange(updated);
    setAddingToCategoryIdx(null);
  };

  const updateClientLogo = (categoryIdx: number, clientIdx: number, client: ClientItem) => {
    const updated = [...categories];
    const newClients = [...updated[categoryIdx].clients];
    newClients[clientIdx] = client;
    updated[categoryIdx] = { ...updated[categoryIdx], clients: newClients };
    onChange(updated);
    setEditingClientKey(null);
  };

  const deleteClientLogo = (categoryIdx: number, clientIdx: number) => {
    const updated = [...categories];
    const newClients = updated[categoryIdx].clients.filter((_, i) => i !== clientIdx);
    updated[categoryIdx] = { ...updated[categoryIdx], clients: newClients };
    onChange(updated);
  };

  const moveClientLogo = (categoryIdx: number, clientIdx: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? clientIdx - 1 : clientIdx + 1;
    const list = categories[categoryIdx].clients;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const updated = [...categories];
    const newClients = [...list];
    const temp = newClients[clientIdx];
    newClients[clientIdx] = newClients[targetIdx];
    newClients[targetIdx] = temp;
    updated[categoryIdx] = { ...updated[categoryIdx], clients: newClients };
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-foreground/10">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Clients Page Categories & Logos CMS
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage industry side headings (e.g. ENERGY & PETROCHEMICALS) and client logos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Side Heading Category
          </button>
          <button
            type="button"
            onClick={() => {
              onSave();
              window.dispatchEvent(new Event("viso_cms_updated"));
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            Save Client Page Changes
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="flex flex-col gap-6">
        {categories.map((category, catIdx) => (
          <div
            key={catIdx}
            className="p-5 rounded-2xl border border-foreground/15 bg-background/50 space-y-4 shadow-xs"
          >
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-foreground/10">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                  Side Heading #{catIdx + 1}
                </span>
                <input
                  type="text"
                  value={category.title}
                  onChange={(e) => updateCategoryTitle(catIdx, e.target.value)}
                  className="font-display font-bold text-base md:text-lg text-foreground bg-transparent border-b border-dashed border-foreground/30 focus:border-primary focus:outline-none px-1 py-0.5 w-full max-w-lg"
                  placeholder="e.g. ENERGY & PETROCHEMICALS"
                />
                <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                  ({category.clients.length} logos)
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={catIdx === 0}
                  onClick={() => moveCategory(catIdx, "up")}
                  className="p-1.5 rounded-lg hover:bg-foreground/10 text-foreground/70 disabled:opacity-30"
                  title="Move category up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={catIdx === categories.length - 1}
                  onClick={() => moveCategory(catIdx, "down")}
                  className="p-1.5 rounded-lg hover:bg-foreground/10 text-foreground/70 disabled:opacity-30"
                  title="Move category down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAddingToCategoryIdx(addingToCategoryIdx === catIdx ? null : catIdx)
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Logo
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(catIdx)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Minimal Form when adding logo to this category */}
            {addingToCategoryIdx === catIdx && (
              <MinimalClientLogoForm
                onSave={(client) => addClientLogo(catIdx, client)}
                onCancel={() => setAddingToCategoryIdx(null)}
              />
            )}

            {/* Logos Grid */}
            {category.clients.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-3 text-center">
                No logos added yet under this side heading. Click "+ Add Logo" above.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {category.clients.map((client, clientIdx) => {
                  const key = `${catIdx}-${clientIdx}`;
                  const isEditing = editingClientKey === key;

                  if (isEditing) {
                    return (
                      <div key={key} className="col-span-full">
                        <MinimalClientLogoForm
                          initialData={client}
                          onSave={(updated) => updateClientLogo(catIdx, clientIdx, updated)}
                          onCancel={() => setEditingClientKey(null)}
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={key}
                      className="group relative flex flex-col items-center justify-between p-3 rounded-xl border border-foreground/10 bg-white dark:bg-[#1C2541] hover:border-primary/40 hover:shadow-md transition-all text-center"
                    >
                      <div className="h-16 w-full flex items-center justify-center p-1 mb-2">
                        <ClientLogo src={client.icon} name={client.name} />
                      </div>
                      <h4 className="font-semibold text-xs text-foreground line-clamp-2 mb-2">
                        {client.name}
                      </h4>

                      {/* Action buttons */}
                      <div className="flex items-center justify-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity pt-1 border-t border-foreground/10 w-full">
                        <button
                          type="button"
                          disabled={clientIdx === 0}
                          onClick={() => moveClientLogo(catIdx, clientIdx, "left")}
                          className="p-1 hover:text-primary disabled:opacity-20 text-xs"
                          title="Move Left"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingClientKey(key)}
                          className="px-2 py-0.5 text-[10px] font-bold rounded bg-foreground/10 hover:bg-primary hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteClientLogo(catIdx, clientIdx)}
                          className="p-1 text-red-500 hover:text-red-700 text-xs"
                          title="Delete logo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={clientIdx === category.clients.length - 1}
                          onClick={() => moveClientLogo(catIdx, clientIdx, "right")}
                          className="p-1 hover:text-primary disabled:opacity-20 text-xs"
                          title="Move Right"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

