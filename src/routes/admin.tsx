import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, LayoutDashboard, Image as ImageIcon, Settings, LogOut, ChevronRight, Save, Plus, Trash2, Upload, AlertCircle, MessageSquare, Users, Briefcase, FileText, History } from "lucide-react";
import { DmsDashboard } from "@/components/DmsDashboard";
import { EmployeeDashboard } from "@/components/EmployeeDashboard";
import { CertificatesDashboard } from "@/components/CertificatesDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const [activeTab, setActiveTab] = useState<"gallery" | "core_values" | "homepage" | "inquiries" | "users" | "job_apps" | "dms" | "hr" | "cms_history" | "certificates">("homepage");
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

  // CMS State
  const [cmsSection, setCmsSection] = useState<"hero" | "about" | "core_values" | "areas" | "services" | "framework" | "showcase" | "clients" | "lifecycle" | "locations" | "stats" | "cta">("hero");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);

  const fetchAuditLogs = async () => {
    setAuditLogsLoading(true);
    const { data } = await supabase.from('cms_audit_logs').select('*').order('changed_at', { ascending: false });
    if (data) setAuditLogs(data);
    setAuditLogsLoading(false);
  };
  const [heroData, setHeroData] = useState({ 
    title1: "Designing", 
    title2: "The Future", 
    subtitle: "Elevating physical security through sophisticated architectural integration.", 
    desc: "We merge high-end architectural design with rigorous security protocols to create spaces that are both exceptionally safe and visually stunning. Inspired by global innovation leaders.", 
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"] 
  });
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
      { title: "Integrated Security Systems", desc: "Delivering comprehensive physical and cyber security architectures, ensuring end-to-end compliance with SAIS and national security directives.", image_url: "" },
      { title: "Meteorological Solutions", desc: "Advanced monitoring and predictive frameworks for atmospheric conditions, optimizing flight safety and complex airport operations.", image_url: "" },
      { title: "Aviation Technology", desc: "Engineering and deploying state-of-the-art Air Traffic Control, NAVAIDS, and communication networks for civil and military airspace.", image_url: "" },
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
    title1: "Industry", 
    title2: "Titans.", 
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
  
  const [lifecycleData, setLifecycleData] = useState<{ title: string, subtitle: string, items: any[] }>({
    title: "Service Lifecycle",
    subtitle: "Four Stages. One Security Lifecycle.",
    items: [
      { num: "01", title: "Security Risk Assessment", desc: "Assessment of threats, vulnerabilities, perimeter, gates, access points, critical assets and the initial security concept around the facility.", points: "Threat and vulnerability assessment\nPerimeter, gate and access-point review\nCritical asset identification\nInitial protection requirements", deliverable: "Risk & Threat Matrix", imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80", color: "from-blue-900/40 to-blue-900/5", accent: "text-blue-400", bgAccent: "bg-blue-400", border: "border-blue-900/30", bgHover: "group-hover:bg-blue-900/10" },
      { num: "02", title: "Concept / Preliminary Design", desc: "Translate risk findings into a protection philosophy, security zoning, system concepts, preliminary layouts and technology requirements.", points: "Protection philosophy\nConcept CCTV coverage\nAccess control and zoning\nPreliminary control-room concept", deliverable: "Preliminary Design Report", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", color: "from-emerald-900/40 to-emerald-900/5", accent: "text-emerald-400", bgAccent: "bg-emerald-400", border: "border-emerald-900/30", bgHover: "group-hover:bg-emerald-900/10" },
      { num: "03", title: "Detailed Design", desc: "Develop implementation-level drawings, specifications, schedules, interfaces and integration requirements suitable for procurement and construction.", points: "Detailed layouts and schematics\nEquipment and device schedules\nTechnical specifications\nSystems integration requirements", deliverable: "Tender-Ready Blueprints", imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", color: "from-purple-900/40 to-purple-900/5", accent: "text-purple-400", bgAccent: "bg-purple-400", border: "border-purple-900/30", bgHover: "group-hover:bg-purple-900/10" },
      { num: "04", title: "Construction & Readiness", desc: "Supervision, technical submittal review, inspections, testing, commissioning, handover and confirmation of operational readiness.", points: "Construction supervision\nFAT / SAT and commissioning\nDefect and closeout tracking\nOperational readiness and handover", deliverable: "Operational Handover", imageUrl: "https://www.planswift.com/wp-content/uploads/2019/02/shutterstock_303643469.jpg", color: "from-orange-900/40 to-orange-900/5", accent: "text-orange-400", bgAccent: "bg-orange-400", border: "border-orange-900/30", bgHover: "group-hover:bg-orange-900/10" }
    ]
  });

  const [locationsData, setLocationsData] = useState<{ title: string, subtitle: string }>({
    title: "OUR LOCATION",
    subtitle: "Serving Saudi Arabia and Surroundings"
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

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setInquiries(data);
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
        if (storedSession.role === 'super_admin') fetchUsers();
        if (storedSession.role === 'super_admin' || storedSession.role === 'hr') fetchJobApps();

        // Default tab based on role if they re-open the page
        if (storedSession.role === 'document_controller' && !["dms"].includes(activeTab)) setActiveTab("dms");
        else if ((storedSession.role === 'employee' || storedSession.role === 'hr') && !["hr", "job_apps"].includes(activeTab)) setActiveTab("hr");
      } catch (e) {
        localStorage.removeItem('viso_admin_session');
      }
    }
    setLoading(false);
  }, []);

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
       if (data.role === 'super_admin') fetchUsers();
       if (data.role === 'super_admin' || data.role === 'hr') fetchJobApps();
       
       if (data.role === 'document_controller') setActiveTab("dms");
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
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) console.error("Error fetching images:", error);
    else setImages(data || []);
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
      { section_key: 'core_values', content: coreValuesData },
      { section_key: 'areas', content: areasData },
      { section_key: 'services', content: servicesData },
      { section_key: 'framework', content: frameworkData },
      { section_key: 'showcase', content: showcaseData },
      { section_key: 'clients', content: clientsData },
      { section_key: 'lifecycle', content: lifecycleData },
      { section_key: 'locations', content: locationsData },
      { section_key: 'stats', content: statsData },
      { section_key: 'cta', content: ctaData }
    ];
    for (const item of defaultData) {
      await supabase.from('cms_content').upsert(item, { onConflict: 'section_key' }).select();
    }
    // reload data after seeding
    const { data, error } = await supabase.from('cms_content').select('*');
    if (!error && data) {
      data.forEach(row => {
        if (row.section_key === 'hero') setHeroData(row.content);
        if (row.section_key === 'about') setAboutData(row.content);
        if (row.section_key === 'core_values') setCoreValuesData(row.content);
        if (row.section_key === 'areas') setAreasData(row.content);
        if (row.section_key === 'services') setServicesData(row.content);
        if (row.section_key === 'framework') setFrameworkData(row.content);
        if (row.section_key === 'showcase') setShowcaseData(row.content);
        if (row.section_key === 'clients') setClientsData(row.content);
        if (row.section_key === 'lifecycle') setLifecycleData(row.content);
        if (row.section_key === 'locations') setLocationsData(row.content);
        if (row.section_key === 'stats') setStatsData(row.content);
        if (row.section_key === 'cta') setCtaData(row.content);
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
        if (row.section_key === 'hero') setHeroData(row.content);
        if (row.section_key === 'about') setAboutData(row.content);
        if (row.section_key === 'core_values') setCoreValuesData(row.content);
        if (row.section_key === 'areas') setAreasData(row.content);
        if (row.section_key === 'services') setServicesData(row.content);
        if (row.section_key === 'framework') setFrameworkData(row.content);
        if (row.section_key === 'showcase') setShowcaseData(row.content);
        if (row.section_key === 'clients') setClientsData(row.content);
        if (row.section_key === 'lifecycle') setLifecycleData(row.content);
        if (row.section_key === 'locations') setLocationsData(row.content);
        if (row.section_key === 'stats') setStatsData(row.content);
        if (row.section_key === 'cta') setCtaData(row.content);
      });
    }
  };

  const uploadFileToGallery = async (file: File) => {
    setUploading(true);
    
    // 1. Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Error uploading file.");
      setUploading(false);
      return;
    }

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    // 3. Save to database
    const { error: dbError } = await supabase
      .from('gallery_images')
      .insert([{ image_url: publicUrl }]);

    if (dbError) {
      console.error("Database error:", dbError);
      alert("Error saving image to database.");
    } else {
      fetchImages(); // Refresh list
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
    const { error: dbError } = await supabase
      .from('gallery_images')
      .insert([{ image_url: imageUrlInput }]);

    if (dbError) {
      console.error("Database error:", dbError);
      alert("Error saving image URL to database.");
    } else {
      fetchImages(); // Refresh list
      setImageUrlInput(""); // Clear input
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

    // 1. Delete from database
    await supabase.from('gallery_images').delete().eq('id', id);

    // 2. Extract filename from URL and delete from storage
    try {
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('gallery').remove([fileName]);
    } catch (err) {
      console.error("Could not delete from storage", err);
    }

    fetchImages(); // Refresh list
  };

  const handleCoreValueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = (e.currentTarget.elements.namedItem("cvImage") as HTMLInputElement);
    let publicUrl = cvImageUrl;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      setCvUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `cv_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Error uploading file.");
        setCvUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      publicUrl = data.publicUrl;
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
        <div className="max-w-md w-full bg-foreground/5 p-8 rounded-xl border border-foreground/10 text-center">
          <div className="flex justify-center mb-6">
            <img src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png" alt="VISO Logo" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-bold mb-6 font-display">Admin Login</h1>
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
    { id: 'homepage', label: 'Homepage CMS', icon: LayoutDashboard, roles: ['super_admin', 'admin'] },
    { id: 'cms_history', label: 'CMS History', icon: History, roles: ['super_admin', 'admin'] },
    { id: 'certificates', label: 'Certificates', icon: FileText, roles: ['super_admin', 'admin'] },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, roles: ['super_admin', 'admin'] },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, roles: ['super_admin', 'admin'], badge: inquiries.filter((inq) => inq.status === 'unread').length, badgeColor: 'bg-red-500 text-white' },
    { id: 'job_apps', label: 'Job Applications', icon: Briefcase, roles: ['super_admin', 'hr', 'admin'], badge: jobApps.filter((app) => app.status === 'New').length, badgeColor: 'bg-primary text-primary-foreground' },
    { id: 'dms', label: 'DMS Platform', icon: FileText, roles: ['super_admin', 'document_controller'] },
    { id: 'hr', label: 'HR / ESS Portal', icon: Users, roles: ['super_admin', 'hr', 'employee'] },
    { id: 'users', label: 'Users & Roles', icon: Settings, roles: ['super_admin'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(session?.role || ''));

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      
      {/* Top Navbar */}
      <header className="flex-none z-[40] w-full border-b border-foreground/10 bg-surface/95 backdrop-blur-xl">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex flex-col items-center justify-center flex-shrink-0 pt-1">
              <img src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png" alt="VISO Logo" className="h-6 md:h-8 w-auto object-contain" />
              <span className="mt-0.5 font-bold uppercase tracking-widest text-foreground/50 text-[9px] hidden md:block">Admin Console</span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex space-x-1.5 flex-1 justify-center px-2 flex-wrap">
              {visibleNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-300 text-xs whitespace-nowrap ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
                  >
                    <Icon size={14} />
                    {item.label}
                    {(item.badge || 0) > 0 && (
                      <span className={`ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Right Side (Theme, Logout, Mobile Menu) */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>


              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden p-2 border border-foreground/10 rounded focus:outline-none bg-surface"
              >
                <div className={`w-5 h-0.5 bg-foreground mb-1 transition-transform ${mobileSidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-foreground mb-1 transition-opacity ${mobileSidebarOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-foreground transition-transform ${mobileSidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out border-t border-foreground/10 absolute w-full bg-surface/95 backdrop-blur-xl z-[35] shadow-lg ${mobileSidebarOpen ? 'max-h-[80vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
           <div className="px-4 py-4 space-y-1 flex flex-col">
              {visibleNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as any); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm ${isActive ? 'bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20' : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'}`}
                  >
                    <Icon size={18} />
                    {item.label}
                    {(item.badge || 0) > 0 && (
                      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
              
              <div className="flex items-center justify-between p-2 mt-4 border-t border-foreground/10 sm:hidden">
                 <ThemeToggle />
                 <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium px-2 py-2 hover:bg-red-500/10 rounded-md transition-colors"><LogOut size={16}/> Sign Out</button>
              </div>
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background relative">
        <div className="absolute top-4 right-4 sm:right-6 md:right-10 z-30 hidden sm:flex">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors text-xs font-medium shadow-sm backdrop-blur-sm"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
        <div className="p-4 sm:p-6 md:p-10 max-w-screen-2xl mx-auto w-full pt-14 sm:pt-6 md:pt-10">

        {activeTab === 'gallery' && (
          <>
            <div className="bg-foreground/5 p-6 rounded-xl border border-foreground/10 mb-8 grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl mb-4 font-display">Upload New Image</h2>
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-foreground/20 hover:border-primary/50'}`}
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
                <h2 className="text-xl mb-4 font-display">Or Add via URL</h2>
                <form onSubmit={handleUrlSubmit} className="flex flex-col gap-4 bg-surface p-6 rounded-xl border border-foreground/10 h-full justify-center">
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
                  <img src={img.image_url} alt="Gallery item" className="w-full h-full object-cover" />
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
              <h2 className="text-2xl font-display">CMS Revision History</h2>
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
              <div className="bg-surface p-8 rounded-xl border border-foreground/10 text-center text-foreground/50">
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

        {activeTab === 'homepage' && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* CMS Sidebar */}
            <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
              <h3 className="font-bold text-foreground/60 mb-2 uppercase tracking-widest text-xs">Sections</h3>
              <button
                onClick={() => setCmsSection('hero')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'hero' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Hero Section
              </button>
              <button
                onClick={() => setCmsSection('about')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'about' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                About Section
              </button>
              <button
                onClick={() => setCmsSection('core_values')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'core_values' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Core Values
              </button>
              <button
                onClick={() => setCmsSection('areas')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'areas' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Areas We Serve
              </button>
              <button
                onClick={() => setCmsSection('services')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'services' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Services
              </button>
              <button
                onClick={() => setCmsSection('framework')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'framework' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Framework
              </button>
              <button
                onClick={() => setCmsSection('showcase')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'showcase' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Showcase
              </button>
              <button
                onClick={() => setCmsSection('clients')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'clients' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Industry Titans (Clients)
              </button>
              <button
                onClick={() => setCmsSection('lifecycle')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'lifecycle' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Service Lifecycle
              </button>
              <button
                onClick={() => setCmsSection('locations')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'locations' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Locations
              </button>
              <button
                onClick={() => setCmsSection('stats')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'stats' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Stats
              </button>
              <button
                onClick={() => setCmsSection('cta')}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${cmsSection === 'cta' ? 'bg-primary text-primary-foreground font-medium' : 'bg-surface hover:bg-foreground/5'}`}
              >
                Call to Action
              </button>
              <div className="mt-8 border-t border-foreground/10 pt-4">
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to overwrite all sections with the default seed content? This cannot be undone.")) {
                      await handleSeedCmsData();
                      alert("Successfully seeded defaults!");
                    }
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium transition-colors"
                >
                  Reset All to Defaults
                </button>
              </div>
            </div>

            {/* CMS Editor Area */}
            <div className="flex-1 bg-surface p-6 rounded-xl border border-foreground/10">
              {cmsSection === 'hero' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-display mb-4">Edit Hero Section</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title Part 1</label>
                    <input
                      type="text"
                      value={heroData.title1}
                      onChange={(e) => setHeroData({ ...heroData, title1: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title Part 2 (Italicized)</label>
                    <input
                      type="text"
                      value={heroData.title2}
                      onChange={(e) => setHeroData({ ...heroData, title2: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <textarea
                      value={heroData.subtitle}
                      onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={heroData.desc}
                      onChange={(e) => setHeroData({ ...heroData, desc: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-24"
                    />
                  </div>
                  <div className="pt-4 mt-4 border-t border-foreground/10">
                    <label className="block text-sm font-medium mb-3">Hero Background Images (3 URLs)</label>
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="mb-3">
                        <input
                          type="url"
                          placeholder={`Image URL ${idx + 1}`}
                          value={heroData.images[idx] || ""}
                          onChange={(e) => {
                            const newImages = [...heroData.images];
                            newImages[idx] = e.target.value;
                            setHeroData({ ...heroData, images: newImages });
                          }}
                          className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSaveCmsSection('hero', heroData)}
                    className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium"
                  >
                    Save Hero Section
                  </button>
                </div>
              )}

              {cmsSection === 'about' && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl font-display mb-2">Edit Digital Company Profile</h2>
                  
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
              {cmsSection === 'core_values' && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-2xl font-display mb-2">Edit Core Values</h2>
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
                          <div>
                            <label className="block text-xs font-bold mb-1 opacity-70">Image URL</label>
                            <input
                              type="text"
                              value={cv.imageUrl}
                              onChange={(e) => {
                                const newItems = [...coreValuesData.items];
                                newItems[idx].imageUrl = e.target.value;
                                setCoreValuesData({ ...coreValuesData, items: newItems });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-foreground/20 focus:border-primary focus:outline-none"
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
                  <h2 className="text-2xl font-display mb-4">Edit Areas We Serve</h2>
                  
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
                  <h2 className="text-2xl font-display mb-4">Edit Services</h2>
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
                  <h2 className="text-2xl font-display mb-4">Edit Framework Section</h2>
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
                  <h2 className="text-2xl font-display mb-4">Edit Showcase Section</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Background Image URL</label>
                    <input
                      type="url"
                      value={showcaseData.imageUrl}
                      placeholder="https://images.unsplash.com/..."
                      onChange={(e) => setShowcaseData({ imageUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none"
                    />
                    {showcaseData.imageUrl && (
                       <img src={showcaseData.imageUrl} alt="Showcase Preview" className="mt-4 w-full h-48 object-cover rounded" />
                    )}
                  </div>
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
                  <h2 className="text-2xl font-display mb-4">Edit Industry Titans (Clients) Section</h2>
                  
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
                                        const fileExt = file.name.split('.').pop();
                                        const fileName = `${Math.random()}.${fileExt}`;
                                        const filePath = `clients/${fileName}`;
                                        
                                        const { error: uploadError } = await supabase.storage
                                          .from('gallery_images')
                                          .upload(filePath, file);
                                          
                                        if (uploadError) {
                                          alert("Error uploading image");
                                          return;
                                        }
                                        
                                        const { data: urlData } = supabase.storage
                                          .from('gallery_images')
                                          .getPublicUrl(filePath);
                                          
                                        const newItems = [...clientsData.items];
                                        newItems[idx].icon = urlData.publicUrl;
                                        setClientsData({ ...clientsData, items: newItems });
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              {item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/')) && (
                                <div className="mt-2 flex justify-center bg-surface p-2 rounded border border-foreground/10">
                                  <img src={item.icon} alt="Preview" className="h-8 object-contain" />
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
                  <h2 className="text-2xl font-display mb-4">Edit Service Lifecycle Section</h2>
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
                            <div><label className="block text-xs font-bold mb-1 opacity-70">Image URL</label><input type="text" value={item.imageUrl} onChange={(e) => { const newItems = [...lifecycleData.items]; newItems[idx].imageUrl = e.target.value; setLifecycleData({ ...lifecycleData, items: newItems }); }} className="w-full px-3 py-2 rounded bg-surface border border-foreground/20" /></div>
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
                  <h2 className="text-2xl font-display mb-4">Edit Locations Section</h2>
                  <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={locationsData.title} onChange={(e) => setLocationsData({ ...locationsData, title: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Subtitle</label><input type="text" value={locationsData.subtitle} onChange={(e) => setLocationsData({ ...locationsData, subtitle: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <p className="text-sm text-foreground/50 mt-4 italic">Note: The interactive map markers and specific cities are currently hardcoded in the component for geographic precision, but the titles above can be edited here.</p>
                  <button onClick={() => handleSaveCmsSection('locations', locationsData)} className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium">Save Locations</button>
                </div>
              )}

              {/* STATS CMS */}
              {cmsSection === 'stats' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-display mb-4">Edit Stats Section</h2>
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
                  <h2 className="text-2xl font-display mb-4">Edit Call to Action Section</h2>
                  <div><label className="block text-sm font-medium mb-1">Title Part 1</label><input type="text" value={ctaData.title1} onChange={(e) => setCtaData({ ...ctaData, title1: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Title Part 2</label><input type="text" value={ctaData.title2} onChange={(e) => setCtaData({ ...ctaData, title2: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={ctaData.desc} onChange={(e) => setCtaData({ ...ctaData, desc: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none h-20" /></div>
                  <div><label className="block text-sm font-medium mb-1">Button Text</label><input type="text" value={ctaData.buttonText} onChange={(e) => setCtaData({ ...ctaData, buttonText: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Background Image URL</label><input type="text" value={ctaData.imageUrl} onChange={(e) => setCtaData({ ...ctaData, imageUrl: e.target.value })} className="w-full px-4 py-2 rounded bg-background border border-foreground/20 focus:border-primary focus:outline-none" /></div>
                  <button onClick={() => handleSaveCmsSection('cta', ctaData)} className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit font-medium">Save CTA</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <h1 className="text-3xl font-display mb-2">Inquiries</h1>
            <p className="text-foreground/60 mb-8">View and manage contact submissions.</p>

            {inquiriesLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="bg-surface/50 border border-foreground/10 rounded-xl p-12 text-center">
                <p className="text-foreground/60">No inquiries found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq: any) => (
                  <div key={inq.id} className="bg-surface/50 border border-foreground/10 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{inq.name}</h3>
                          {inq.company && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{inq.company}</span>}
                        </div>
                        <span className="text-xs text-foreground/50">{new Date(inq.created_at).toLocaleString()}</span>
                      </div>
                      <div className="mb-4">
                        <a href={`mailto:${inq.email}`} className="text-sm text-primary hover:underline">{inq.email}</a>
                      </div>
                      <div className="bg-background rounded-lg p-4 border border-foreground/5">
                        <p className="text-foreground/80 text-sm whitespace-pre-wrap">{inq.message}</p>
                      </div>
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
            <h1 className="text-3xl font-display mb-2">Users & Roles</h1>
            <p className="text-foreground/60 mb-8">Manage employee credentials and portal access.</p>

            <div className="bg-surface/50 border border-foreground/10 rounded-xl p-6 mb-8">
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
                    <option value="document_controller">Document Controller (DMS Portal)</option>
                    <option value="hr">HR (ESS Portal)</option>
                    <option value="employee">Employee (ESS Portal)</option>
                  </select>
                </div>
                <div className="md:col-span-2 mt-2">
                  <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded font-medium hover:bg-primary/90 transition-colors">Create User</button>
                </div>
              </form>
            </div>

            <div className="bg-surface/50 border border-foreground/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-foreground/5 text-foreground/60 font-medium border-b border-foreground/10">
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
                      <tr key={user.id} className="hover:bg-foreground/5 transition-colors">
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

        {/* JOB APPLICATIONS TAB */}
        {activeTab === 'job_apps' && (session?.role === 'super_admin' || session?.role === 'hr' || session?.role === 'admin') && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <h1 className="text-3xl font-display mb-2">Job Applications</h1>
            <p className="text-foreground/60 mb-8">Review candidates from the public Careers portal.</p>

            {jobAppsLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : jobApps.length === 0 ? (
              <div className="bg-surface/50 border border-foreground/10 rounded-xl p-12 text-center">
                <p className="text-foreground/60">No applications received yet.</p>
              </div>
            ) : (
              <div className="bg-surface/50 border border-foreground/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-foreground/5 text-foreground/60 font-medium border-b border-foreground/10">
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
                        <tr key={app.id} className="hover:bg-foreground/5 transition-colors">
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
        {activeTab === 'dms' && (session?.role === 'super_admin' || session?.role === 'document_controller') && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <DmsDashboard user={session} />
          </div>
        )}

        {/* HR DASHBOARD */}
        {activeTab === 'hr' && (session?.role === 'super_admin' || session?.role === 'hr' || session?.role === 'employee') && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <EmployeeDashboard user={session} />
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
  );
}
