import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, ShieldCheck, AlertTriangle, XCircle, Search, RefreshCw, Check, ExternalLink, FileText, X } from "lucide-react";
import {
  certsApi,
  TranslationCertificate,
  getCertificateDisplayStatus,
  resolveCertificateStatusForStorage,
  CertificateDisplayStatus,
} from "../lib/certsApi";
import {
  computeNextCertificateId,
  generateVerificationReferenceId,
  getPublicCertificateUrl,
} from "../lib/certificateIds";
import {
  formatCertificateClientName,
  parseCertificateClientName,
  type ParentRelation,
} from "../lib/certificateClientName";
import {
  CERTIFICATE_TEMPLATE_OPTIONS,
  certificateUsesLegacyTemplate,
  type CertificateTemplateId,
} from "../lib/certificateTemplates";
import { CertificateBrandingPanel } from "./CertificateBrandingPanel";

const VALIDITY_MONTH_OPTIONS = [1, 2, 3] as const;
type ValidityMonths = (typeof VALIDITY_MONTH_OPTIONS)[number] | "custom";

function addMonthsToDateOnly(dateStr: string, months: number): string {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateStr;
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d);
  date.setMonth(date.getMonth() + months);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function detectValidityMonths(issueDate: string, expiryDate: string): ValidityMonths | null {
  for (const months of VALIDITY_MONTH_OPTIONS) {
    if (addMonthsToDateOnly(issueDate, months) === expiryDate) return months;
  }
  return null;
}

function todayDateOnly(): string {
  const now = new Date();
  const yy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function CertificatesDashboard() {
  const [certs, setCerts] = useState<TranslationCertificate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | CertificateDisplayStatus>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formId, setFormId] = useState("");
  const [formNationalId, setFormNationalId] = useState("");
  const [formClientName, setFormClientName] = useState("");
  const [formParentRelation, setFormParentRelation] = useState<ParentRelation>("none");
  const [formParentName, setFormParentName] = useState("");
  const [formSource, setFormSource] = useState("Arabic");
  const [formTarget, setFormTarget] = useState("English");
  const [formIssue, setFormIssue] = useState("");
  const [formExpiry, setFormExpiry] = useState("");
  const [formValidityMonths, setFormValidityMonths] = useState<ValidityMonths>(1);
  const [formRevoked, setFormRevoked] = useState(false);
  const [formTemplate, setFormTemplate] = useState<CertificateTemplateId>("trilingual");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** Cache-bust for live public certificate iframe after saves */
  const [livePreviewToken, setLivePreviewToken] = useState(0);
  const [showFormPreview, setShowFormPreview] = useState(false);

  // Load certificates
  const loadCerts = async () => {
    setIsLoading(true);
    try {
      const data = await certsApi.fetchCertificates();
      setCerts(data);
    } catch (err) {
      console.error("Failed to load certificates", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  useEffect(() => {
    if (!showForm || !formIssue || formValidityMonths === "custom") return;
    setFormExpiry(addMonthsToDateOnly(formIssue, formValidityMonths));
  }, [showForm, formIssue, formValidityMonths]);

  // Helper to open form for creating
  const openCreateForm = () => {
    setFormError("");
    setFormSuccess("");
    setEditingId(null);
    setLivePreviewToken(0);
    setShowFormPreview(false);
    setFormId(computeNextCertificateId(certs.map((c) => c.id)));
    setFormNationalId("");
    setFormClientName("");
    setFormParentRelation("none");
    setFormParentName("");
    setFormSource("Arabic");
    setFormTarget("English");
    
    const today = todayDateOnly();
    const defaultMonths: ValidityMonths = 1;
    setFormValidityMonths(defaultMonths);
    setFormIssue(today);
    setFormExpiry(addMonthsToDateOnly(today, defaultMonths));
    setFormRevoked(false);
    setFormTemplate("trilingual");
    setShowForm(true);
  };

  // Helper to open form for editing
  const openEditForm = (cert: TranslationCertificate) => {
    setFormError("");
    setFormSuccess("");
    setLivePreviewToken(Date.now());
    setShowFormPreview(false);
    setEditingId(cert.id);
    setFormId(cert.id);
    setFormNationalId(cert.national_id);
    const parsed = parseCertificateClientName(cert.project_name);
    setFormClientName(parsed.clientName);
    setFormParentRelation(parsed.relation);
    setFormParentName(parsed.parentName);
    setFormSource(cert.source_lang);
    setFormTarget(cert.target_lang);
    setFormIssue(cert.issue_date);
    const months = detectValidityMonths(cert.issue_date, cert.expiry_date);
    setFormValidityMonths(months ?? "custom");
    setFormExpiry(cert.expiry_date);
    setFormRevoked(cert.status === "REVOKED");
    const legacy = certificateUsesLegacyTemplate(cert.id);
    const t = cert.template as CertificateTemplateId | undefined;
    setFormTemplate(
      legacy
        ? "classic"
        : t === "accreditation"
          ? "accreditation"
          : t === "official"
            ? "official"
            : "trilingual"
    );
    setShowForm(true);
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const upperId = formId.trim().toUpperCase();
    if (!upperId) {
      setFormError("Certificate ID is required.");
      return;
    }

    if (!formClientName.trim()) {
      setFormError("Client name is required.");
      return;
    }

    const projectName = formatCertificateClientName(
      formClientName,
      formParentRelation,
      formParentName
    );

    const nationalId = editingId
      ? formNationalId.trim()
      : generateVerificationReferenceId();

    if (!nationalId || nationalId.length < 8) {
      setFormError("Could not assign an internal verification reference. Please try again.");
      return;
    }

    // Check duplicate if creating
    if (!editingId && certs.some(c => c.id === upperId)) {
      setFormError(`A certificate with ID "${upperId}" already exists.`);
      return;
    }

    if (formExpiry && formIssue && formExpiry < formIssue) {
      setFormError("Expiry date must be on or after the issue date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const previousStatus = formRevoked ? "REVOKED" : undefined;
      const status = resolveCertificateStatusForStorage({
        issue_date: formIssue,
        expiry_date: formExpiry,
        previousStatus,
      });

      const idForSave = (editingId ?? upperId).trim().toUpperCase();

      const template: CertificateTemplateId = certificateUsesLegacyTemplate(idForSave)
        ? "classic"
        : formTemplate === "accreditation"
          ? "accreditation"
          : formTemplate === "official"
            ? "official"
            : "trilingual";

      await certsApi.upsertCertificate({
        id: idForSave,
        national_id: nationalId,
        project_name: projectName,
        source_lang: formSource,
        target_lang: formTarget,
        issue_date: formIssue,
        expiry_date: formExpiry,
        status,
        template,
      });

      await loadCerts();

      if (editingId) {
        setLivePreviewToken(Date.now());
        setFormSuccess(
          "Saved. The public certificate page and print/PDF view now use this data. Refresh the preview if it still shows the old version."
        );
      } else {
        setShowForm(false);
        setEditingId(null);
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to save certificate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete certificate ${id}?`)) {
      try {
        await certsApi.deleteCertificate(id);
        setCerts(certs.filter(c => c.id !== id));
      } catch (err) {
        alert("Failed to delete certificate.");
      }
    }
  };

  const setRevokedFlag = async (cert: TranslationCertificate, revoked: boolean) => {
    const nextStatus = revoked
      ? "REVOKED"
      : resolveCertificateStatusForStorage({
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date,
        });
    const updated = { ...cert, status: nextStatus };
    setCerts(certs.map((c) => (c.id === cert.id ? updated : c)));
    try {
      await certsApi.upsertCertificate(updated);
    } catch {
      setCerts(certs.map((c) => (c.id === cert.id ? cert : c)));
      alert("Failed to update certificate status.");
    }
  };

  // Filtered Certificates list
  const filteredCerts = certs.filter((data) => {
    const matchesSearch = 
      data.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.national_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.project_name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const displayStatus = getCertificateDisplayStatus(data);
    const matchesStatus = statusFilter === "ALL" || displayStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getDisplayStatusLabel = (cert: TranslationCertificate) => {
    const displayStatus = getCertificateDisplayStatus(cert);
    switch (displayStatus) {
      case "active":
        return `Active until ${cert.expiry_date}`;
      case "expired":
        return `Ended ${cert.expiry_date}`;
      case "pending":
        return `Starts ${cert.issue_date}`;
      case "revoked":
        return "Withdrawn";
      default:
        return "";
    }
  };

  const getCompactStatusLabel = (cert: TranslationCertificate) => {
    const displayStatus = getCertificateDisplayStatus(cert);
    switch (displayStatus) {
      case "active":
        return "Active";
      case "expired":
        return "Ended";
      case "pending":
        return "Upcoming";
      case "revoked":
        return "Withdrawn";
      default:
        return "";
    }
  };

  const templateShortLabel = (cert: TranslationCertificate) => {
    if (certificateUsesLegacyTemplate(cert.id)) return "T1";
    if (cert.template === "accreditation") return "T3";
    if (cert.template === "official") return "T4";
    return "T2";
  };

  const getStatusStyle = (displayStatus: CertificateDisplayStatus) => {
    switch (displayStatus) {
      case "active":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "expired":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "revoked":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "pending":
        return "bg-sky-500/10 text-sky-600 border-sky-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-500 border-neutral-200";
    }
  };

  const getStatusIcon = (displayStatus: CertificateDisplayStatus) => {
    switch (displayStatus) {
      case "active":
        return <ShieldCheck className="w-4 h-4" />;
      case "expired":
        return <AlertTriangle className="w-4 h-4" />;
      case "revoked":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const clientDisplayPreview = formatCertificateClientName(
    formClientName,
    formParentRelation,
    formParentName
  );

  const formPreviewCert: TranslationCertificate = {
    id: formId || "PREVIEW",
    national_id: formNationalId || "0000000000",
    project_name: clientDisplayPreview || "Preview",
    source_lang: formSource,
    target_lang: formTarget,
    issue_date: formIssue || new Date().toISOString().split("T")[0],
    expiry_date: formExpiry || new Date().toISOString().split("T")[0],
    status: formRevoked ? "REVOKED" : "VALID",
  };
  const formDisplayStatus = getCertificateDisplayStatus(formPreviewCert);

  const formUsesLegacyTemplate = certificateUsesLegacyTemplate(formId || "");

  const formPreviewTemplate: CertificateTemplateId = formUsesLegacyTemplate
    ? "classic"
    : formTemplate === "classic"
      ? "trilingual"
      : formTemplate;

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1C2541] p-6 rounded border border-foreground/5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground">Translation Certificates</h2>
          <p className="text-xs text-foreground/50 mt-1">
            Issue certificates and update issued records at any time—editing changes the live public PDF. Use preview in the issue/edit form to adjust layout and template wording.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadCerts}
            className="p-2.5 rounded-lg border border-foreground/10 text-foreground/70 hover:bg-foreground/5 transition-colors cursor-pointer"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateForm}
            className="bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Issue Certificate
          </button>
        </div>
      </div>

      {/* Main Filter & Table Card */}
      <div className="bg-white dark:bg-[#1C2541] rounded border border-foreground/5 shadow-sm overflow-hidden">
        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-foreground/5 bg-foreground/[0.01] flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
            <input
              type="text"
              placeholder="Search by Certificate ID, National ID, or document name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-foreground/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
          
          <div className="flex gap-1.5 self-stretch md:self-auto overflow-x-auto pb-1 md:pb-0">
            {(
              [
                { id: "ALL", label: "All" },
                { id: "active", label: "Active" },
                { id: "pending", label: "Upcoming" },
                { id: "expired", label: "Ended" },
                { id: "revoked", label: "Withdrawn" },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === filter.id
                    ? "bg-primary text-white"
                    : "bg-background text-foreground/60 border border-foreground/10 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table View — fits viewport width; actions always visible (no horizontal scroll) */}
        <div className="w-full min-h-[200px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[200px] text-foreground/40 font-medium">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading certificates...
            </div>
          ) : (
            <table className="w-full max-w-full text-left text-[11px] table-fixed">
              <colgroup>
                <col className="w-[17%]" />
                <col className="w-[21%]" />
                <col className="w-[11%]" />
                <col className="w-[17%]" />
                <col className="w-[7%]" />
                <col className="w-[15%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead className="bg-foreground/[0.02] text-foreground/60 font-bold uppercase tracking-wider border-b border-foreground/5 text-[10px]">
                <tr>
                  <th className="px-2 sm:px-3 py-2.5">ID</th>
                  <th className="px-2 sm:px-3 py-2.5">Client</th>
                  <th className="px-2 sm:px-3 py-2.5">Lang</th>
                  <th className="px-2 sm:px-3 py-2.5">Dates</th>
                  <th className="px-2 sm:px-3 py-2.5">Tmpl</th>
                  <th className="px-2 sm:px-3 py-2.5 text-center">Status</th>
                  <th className="px-2 sm:px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {filteredCerts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-foreground/40 font-medium">
                      No certificate records found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-foreground/[0.01] transition-colors group align-middle">
                      <td className="px-2 sm:px-3 py-2.5">
                        <span className="font-mono font-bold text-foreground text-[10px] sm:text-[11px] break-all leading-snug">
                          {cert.id}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5">
                        <div className="font-semibold text-foreground truncate" title={cert.project_name}>
                          {cert.project_name}
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 text-foreground/85">
                        <span className="truncate block" title={`${cert.source_lang} → ${cert.target_lang}`}>
                          {cert.source_lang.slice(0, 3)}→{cert.target_lang.slice(0, 3)}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 text-foreground/65 leading-snug">
                        <div className="truncate" title={`Issued ${cert.issue_date}`}>
                          <span className="text-foreground/45">I:</span> {cert.issue_date}
                        </div>
                        <div className="truncate" title={`Expires ${cert.expiry_date}`}>
                          <span className="text-foreground/45">E:</span> {cert.expiry_date}
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 font-mono font-bold text-foreground/70" title={`Template ${templateShortLabel(cert).replace("T", "")}`}>
                        {templateShortLabel(cert)}
                      </td>
                      <td className="px-2 sm:px-3 py-2.5 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[9px] font-bold leading-tight ${getStatusStyle(getCertificateDisplayStatus(cert))}`}
                            title={getDisplayStatusLabel(cert)}
                          >
                            {getStatusIcon(getCertificateDisplayStatus(cert))}
                            <span className="hidden sm:inline">{getCompactStatusLabel(cert)}</span>
                          </span>
                          {cert.status === "REVOKED" ? (
                            <button
                              type="button"
                              onClick={() => setRevokedFlag(cert, false)}
                              className="text-[8px] font-bold uppercase text-primary hover:underline cursor-pointer"
                            >
                              Reinstate
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Withdraw certificate ${cert.id} from the public registry?`)) {
                                  setRevokedFlag(cert, true);
                                }
                              }}
                              className="text-[8px] font-bold uppercase text-rose-500 hover:underline cursor-pointer"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2.5">
                        <div className="flex justify-end items-center gap-1">
                          <a
                            href={getPublicCertificateUrl(cert.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
                            title="View PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => openEditForm(cert)}
                            className="p-1.5 rounded bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors cursor-pointer"
                            title="Edit certificate"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cert.id)}
                            className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Issuing / Editing Modal Overlay */}
      {showForm && (
        <div
          className={`fixed inset-0 z-[200] bg-[#0B1329]/80 text-foreground ${
            showFormPreview ? "" : "flex items-center justify-center backdrop-blur-sm p-4"
          }`}
        >
          <div
            className={`bg-white dark:bg-[#1C2541] flex flex-col min-h-0 ${
              showFormPreview
                ? "w-full h-full border-0"
                : "w-full max-w-4xl max-h-[min(92vh,900px)] overflow-y-auto rounded-xl shadow-2xl border border-foreground/10"
            }`}
          >
            <div
              className={`shrink-0 flex items-start justify-between gap-4 border-b border-foreground/10 ${
                showFormPreview ? "px-5 py-4 bg-white dark:bg-[#1C2541]" : "px-5 md:px-6 pt-5 pb-3"
              }`}
            >
              <div className="min-w-0">
                <h3 className="text-base font-bold text-foreground">
                  {editingId ? `Edit issued certificate: ${editingId}` : "Issue New Certificate"}
                </h3>
                {editingId && !showFormPreview && (
                  <p className="text-[11px] text-foreground/55 mt-1">
                    Changes update the{" "}
                    <a
                      href={getPublicCertificateUrl(editingId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      live certificate
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    .
                  </p>
                )}
                {showFormPreview && (
                  <p className="text-[11px] text-foreground/50 mt-1">
                    Full-screen workspace — certificate details on the left, template content and preview on the right.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setShowFormPreview(false);
                }}
                className="p-2 rounded-lg border border-foreground/15 hover:bg-foreground/5 text-foreground/70 shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mx-5 mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs font-semibold flex items-center gap-2 shrink-0">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="mx-5 mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 shrink-0">
                <Check className="w-4 h-4 shrink-0" />
                {formSuccess}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={`min-w-0 min-h-0 ${
                showFormPreview
                  ? "flex-1 grid grid-cols-1 lg:grid-cols-[minmax(320px,400px)_1fr] overflow-hidden"
                  : "space-y-3 overflow-y-auto px-5 md:px-6 pb-5 md:pb-6"
              }`}
            >
              <div
                className={`space-y-3 min-w-0 ${
                  showFormPreview ? "overflow-y-auto border-b lg:border-b-0 lg:border-r border-foreground/10 p-5" : ""
                }`}
              >
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">Certificate ID</label>
                <input
                  type="text"
                  value={formId}
                  readOnly
                  className="w-full max-w-md bg-foreground/[0.04] border border-foreground/15 rounded-lg py-2.5 px-3 text-xs font-mono text-foreground uppercase cursor-default"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">
                      Client name
                    </label>
                    <input
                      type="text"
                      value={formClientName}
                      onChange={(e) => setFormClientName(e.target.value)}
                      placeholder="e.g. Ahmad Al-Rashid"
                      className="w-full bg-background border border-foreground/15 rounded-lg py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-semibold"
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">
                      Relation
                    </label>
                    <select
                      value={formParentRelation}
                      onChange={(e) => {
                        const next = e.target.value as ParentRelation;
                        setFormParentRelation(next);
                        if (next === "none") setFormParentName("");
                      }}
                      className="w-full bg-background border border-foreground/15 rounded-lg py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-medium"
                    >
                      <option value="none">— None —</option>
                      <option value="son">Son of</option>
                      <option value="daughter">Daughter of</option>
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">
                      Parent name <span className="font-normal normal-case text-foreground/40">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formParentName}
                      onChange={(e) => setFormParentName(e.target.value)}
                      placeholder={formParentRelation === "none" ? "Not used" : "e.g. Mohammed Al-Rashid"}
                      disabled={formParentRelation === "none"}
                      className="w-full bg-background border border-foreground/15 rounded-lg py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-medium disabled:opacity-50 disabled:bg-foreground/[0.04]"
                    />
                  </div>
                  <div className="sm:col-span-12 rounded-lg border border-dashed border-foreground/15 bg-foreground/[0.02] px-3 py-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/45 block mb-1">
                      As shown on certificate & translation page
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {clientDisplayPreview || "Enter client name…"}
                    </span>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">Source Language</label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full bg-background border border-foreground/15 rounded-lg py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-medium"
                  >
                    <option value="Arabic">Arabic</option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">Target Language</label>
                  <select
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    className="w-full bg-background border border-foreground/15 rounded-lg py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-medium"
                  >
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">Issue Date</label>
                  <input
                    type="date"
                    value={formIssue}
                    onChange={(e) => setFormIssue(e.target.value)}
                    className="w-full bg-background border border-foreground/15 rounded-lg py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">Validity</label>
                  <select
                    value={formValidityMonths}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormValidityMonths(v === "custom" ? "custom" : (Number(v) as 1 | 2 | 3));
                    }}
                    className="w-full bg-background border border-foreground/15 rounded-lg py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-medium"
                  >
                    {VALIDITY_MONTH_OPTIONS.map((months) => (
                      <option key={months} value={months}>
                        {months} {months === 1 ? "Month" : "Months"}
                      </option>
                    ))}
                    <option value="custom">Custom expiry date</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">Expiry Date</label>
                  <input
                    type="date"
                    value={formExpiry}
                    readOnly={formValidityMonths !== "custom"}
                    tabIndex={formValidityMonths === "custom" ? undefined : -1}
                    onChange={(e) => formValidityMonths === "custom" && setFormExpiry(e.target.value)}
                    className={`w-full border border-foreground/15 rounded-lg py-2.5 px-3 text-xs text-foreground transition-all ${
                      formValidityMonths === "custom"
                        ? "bg-background focus:outline-none focus:border-primary/50"
                        : "bg-foreground/[0.04] cursor-default"
                    }`}
                    required
                  />
                  {formValidityMonths === "custom" && (
                    <p className="text-[9px] text-foreground/45 mt-1">Pick validity “Custom” to set any expiry (including for corrections after issue).</p>
                  )}
                </div>
              </div>

              {!formUsesLegacyTemplate ? (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">
                    Certificate template
                  </label>
                  <select
                    value={formTemplate === "classic" ? "trilingual" : formTemplate}
                    onChange={(e) => setFormTemplate(e.target.value as CertificateTemplateId)}
                    className="w-full bg-background border border-foreground/15 rounded-lg py-2.5 px-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-medium"
                  >
                    {CERTIFICATE_TEMPLATE_OPTIONS.filter((o) => o.id !== "classic").map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[9px] text-foreground/45 mt-1.5">
                    {CERTIFICATE_TEMPLATE_OPTIONS.find((o) => o.id === formTemplate)?.description ??
                      CERTIFICATE_TEMPLATE_OPTIONS.find((o) => o.id === "trilingual")?.description}
                  </p>
                </div>
              ) : (
                <p className="text-[10px] text-foreground/50 bg-foreground/[0.03] rounded-lg px-3 py-2 border border-foreground/10">
                  This ID uses <strong>Template 1 (Classic)</strong>. New layouts apply from{" "}
                  <span className="font-mono">VISO-TR-2026-00986</span> onward.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center pt-1">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1.5">
                    Registry status
                  </label>
                  <div
                    className={`w-full rounded-lg border py-2.5 px-3 text-xs font-semibold flex items-center gap-2 ${getStatusStyle(formDisplayStatus)}`}
                  >
                    {getStatusIcon(formDisplayStatus)}
                    {getDisplayStatusLabel(formPreviewCert)}
                  </div>
                </div>
                {editingId && (
                  <label className="flex items-center gap-2 text-xs text-foreground/70 cursor-pointer md:pt-5">
                    <input
                      type="checkbox"
                      checked={formRevoked}
                      onChange={(e) => setFormRevoked(e.target.checked)}
                      className="rounded border-foreground/20"
                    />
                    Withdrawn from registry
                  </label>
                )}
              </div>

              <label className="flex items-center gap-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFormPreview}
                  onChange={(e) => setShowFormPreview(e.target.checked)}
                  className="rounded border-foreground/20"
                />
                <span className="text-xs text-foreground/80 font-medium">
                  Show preview — change template layout and edit certificate wording (branding, templates 2–4)
                </span>
              </label>

              <div className={`pt-3 flex justify-end gap-3 border-t border-foreground/5 mt-2 ${showFormPreview ? "sticky bottom-0 bg-white dark:bg-[#1C2541] pb-1" : ""}`}>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setShowForm(false);
                    setShowFormPreview(false);
                  }}
                  className="px-4 py-2 rounded-sm border border-foreground/10 text-foreground/75 hover:bg-foreground/5 hover:text-foreground text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : editingId ? (
                    "Save & update live PDF"
                  ) : (
                    "Issue Certificate"
                  )}
                </button>
              </div>
              </div>

              {showFormPreview && (
                <div className="min-h-0 h-full flex flex-col overflow-hidden p-4 lg:p-5 bg-foreground/[0.02] dark:bg-black/20">
                  {formUsesLegacyTemplate && (
                    <p className="text-[10px] text-foreground/50 mb-2 shrink-0">
                      Template 1 (Classic) on this ID — tabs still edit branding and templates 2–4 for other certificates.
                    </p>
                  )}
                  <div className="flex-1 min-h-0">
                    <CertificateBrandingPanel
                      embedded
                      fillHeight
                      liveCertificateId={editingId}
                      previewTemplate={formPreviewTemplate}
                      livePreviewToken={livePreviewToken}
                      className="h-full border-0 bg-white dark:bg-[#1C2541]"
                      onPreviewTemplateChange={(t) => {
                        if (!formUsesLegacyTemplate && t !== "classic") setFormTemplate(t);
                      }}
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
