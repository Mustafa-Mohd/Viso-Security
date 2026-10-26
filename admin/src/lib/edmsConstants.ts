export const EDMS_DOCUMENT_TYPES = [
  "Report",
  "Drawings",
  "Specifications",
  "Contract",
  "Procedure",
  "Correspondence",
  "Other",
] as const;

export const EDMS_DEPARTMENTS = [
  "Operations",
  "Engineering",
  "IT",
  "Legal",
  "Finance",
  "HR",
  "Management",
] as const;

export const EDMS_PROJECTS = [
  "General",
  "NEOM",
  "Red Sea",
  "ARAMCO",
  "Internal",
] as const;

export const EDMS_CONFIDENTIALITY = ["Public", "Internal", "Confidential"] as const;

/** Document lifecycle — matches database comments in edms_setup.sql */
export const EDMS_STATUSES = [
  "Draft",
  "Submitted",
  "Under Review",
  "Changes Requested",
  "Pending Approval",
  "Approved",
  "Rejected",
  "Archived",
] as const;

export type EdmsStatus = (typeof EDMS_STATUSES)[number];

export const EDMS_STATUS_LABELS: Record<EdmsStatus, string> = {
  Draft: "Draft",
  Submitted: "Submitted",
  "Under Review": "Under Review",
  "Changes Requested": "Changes Requested",
  "Pending Approval": "Pending Approval",
  Approved: "Approved",
  Rejected: "Rejected",
  Archived: "Archived",
};

export const PENDING_STATUSES: EdmsStatus[] = [
  "Submitted",
  "Under Review",
  "Pending Approval",
  "Changes Requested",
];

export const EDMS_ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "dwg",
  "png",
  "jpg",
  "jpeg",
  "zip",
];

export const EDMS_MAX_FILE_BYTES = 50 * 1024 * 1024;

export const DMS_PORTAL_ROLES = [
  "super_admin",
  "admin",
  "document_controller",
  "manager",
  "reviewer",
  "employee",
  "viewer",
] as const;

export type DmsPortalRole = (typeof DMS_PORTAL_ROLES)[number];

export function statusBadgeClass(status: string): string {
  switch (status) {
    case "Approved":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "Rejected":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    case "Archived":
      return "bg-foreground/10 text-foreground/50";
    case "Under Review":
    case "Pending Approval":
    case "Submitted":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "Changes Requested":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    default:
      return "bg-foreground/10 text-foreground/60";
  }
}

export function generateDocumentNumber(project: string): string {
  const slug = project
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase() || "GEN";
  const year = new Date().getFullYear();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `VISO-${slug}-${year}-${seq}`;
}

export function validateEdmsFile(file: File): string | null {
  if (file.size > EDMS_MAX_FILE_BYTES) {
    return "File exceeds the 50 MB limit.";
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !EDMS_ALLOWED_EXTENSIONS.includes(ext)) {
    return `File type not allowed. Use: ${EDMS_ALLOWED_EXTENSIONS.join(", ")}`;
  }
  return null;
}
