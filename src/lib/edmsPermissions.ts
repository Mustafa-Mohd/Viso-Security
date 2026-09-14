import type { EdmsDocument } from "./edmsApi";
import type { DmsPortalRole } from "./edmsConstants";

export interface EdmsSessionUser {
  id?: string;
  name?: string;
  role?: string;
  department?: string;
}

const PRIVILEGED_ROLES: DmsPortalRole[] = [
  "super_admin",
  "admin",
  "document_controller",
];

export function normalizeRole(role?: string): DmsPortalRole | "unknown" {
  if (!role) return "unknown";
  if (
    role === "super_admin" ||
    role === "admin" ||
    role === "document_controller" ||
    role === "manager" ||
    role === "reviewer" ||
    role === "employee" ||
    role === "viewer"
  ) {
    return role;
  }
  return "unknown";
}

/** Row-level visibility for the document library */
export function canViewDocument(doc: EdmsDocument, user: EdmsSessionUser): boolean {
  const role = normalizeRole(user.role);
  if (PRIVILEGED_ROLES.includes(role as DmsPortalRole) || role === "manager") {
    return true;
  }
  if (role === "reviewer") {
    if (doc.assigned_reviewer_id && user.id && doc.assigned_reviewer_id === user.id) {
      return true;
    }
    if (doc.owner_id && user.id && doc.owner_id === user.id) return true;
    return ["Submitted", "Under Review", "Pending Approval", "Changes Requested"].includes(
      doc.status,
    );
  }
  if (role === "employee") {
    if (doc.owner_id && user.id && doc.owner_id === user.id) return true;
    if (doc.status === "Approved" && doc.confidentiality !== "Confidential") return true;
    return false;
  }
  if (role === "viewer") {
    return doc.status === "Approved" && doc.confidentiality === "Public";
  }
  return false;
}

export function canUploadDocuments(user: EdmsSessionUser): boolean {
  const role = normalizeRole(user.role);
  return ["super_admin", "admin", "document_controller", "manager", "employee"].includes(role);
}

export function canApproveDocuments(user: EdmsSessionUser): boolean {
  const role = normalizeRole(user.role);
  return ["super_admin", "admin", "document_controller", "manager", "reviewer"].includes(role);
}

export function canAssignReviewer(user: EdmsSessionUser): boolean {
  const role = normalizeRole(user.role);
  return ["super_admin", "admin", "document_controller", "manager"].includes(role);
}

export function canArchiveDocument(user: EdmsSessionUser): boolean {
  const role = normalizeRole(user.role);
  return ["super_admin", "admin", "document_controller"].includes(role);
}

export function canEditMetadata(doc: EdmsDocument, user: EdmsSessionUser): boolean {
  const role = normalizeRole(user.role);
  if (PRIVILEGED_ROLES.includes(role as DmsPortalRole)) return true;
  if (doc.status !== "Draft" && doc.status !== "Changes Requested") return false;
  return doc.owner_id === user.id || role === "manager";
}

export function isDocumentOwner(doc: EdmsDocument, user: EdmsSessionUser): boolean {
  return Boolean(user.id && doc.owner_id && doc.owner_id === user.id);
}
