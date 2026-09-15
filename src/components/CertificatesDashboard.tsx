import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, ShieldCheck, AlertTriangle, XCircle, Search, RefreshCw, Check } from "lucide-react";
import {
  certsApi,
  TranslationCertificate,
  getCertificateDisplayStatus,
  resolveCertificateStatusForStorage,
  CertificateDisplayStatus,
} from "../lib/certsApi";

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
  const [formName, setFormName] = useState("");
  const [formSource, setFormSource] = useState("Arabic");
  const [formTarget, setFormTarget] = useState("English");
  const [formIssue, setFormIssue] = useState("");
  const [formExpiry, setFormExpiry] = useState("");
  const [formRevoked, setFormRevoked] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Helper to open form for creating
  const openCreateForm = () => {
    setFormError("");
    setEditingId(null);
    setFormId(`VISO-TR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`); // Prefill clean random ID
    setFormNationalId("");
    setFormName("");
    setFormSource("Arabic");
    setFormTarget("English");
    
    // Set default dates (today & next year)
    const today = new Date().toISOString().split("T")[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearStr = nextYear.toISOString().split("T")[0];
    
    setFormIssue(today);
    setFormExpiry(nextYearStr);
    setFormRevoked(false);
    setShowForm(true);
  };

  // Helper to open form for editing
  const openEditForm = (cert: TranslationCertificate) => {
    setFormError("");
    setEditingId(cert.id);
    setFormId(cert.id);
    setFormNationalId(cert.national_id);
    setFormName(cert.project_name);
    setFormSource(cert.source_lang);
    setFormTarget(cert.target_lang);
    setFormIssue(cert.issue_date);
    setFormExpiry(cert.expiry_date);
    setFormRevoked(cert.status === "REVOKED");
    setShowForm(true);
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const upperId = formId.trim().toUpperCase();
    if (!upperId) {
      setFormError("Certificate ID is required.");
      return;
    }

    if (!formNationalId.trim() || formNationalId.trim().length < 8) {
      setFormError("A valid National ID is required (min 8 digits).");
      return;
    }

    if (!formName.trim()) {
      setFormError("Document/Project Name is required.");
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

      await certsApi.upsertCertificate({
        id: upperId,
        national_id: formNationalId.trim(),
        project_name: formName.trim(),
        source_lang: formSource,
        target_lang: formTarget,
        issue_date: formIssue,
        expiry_date: formExpiry,
        status,
      });

      await loadCerts(); // Refresh list
      setShowForm(false);
      setEditingId(null);
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

  const formPreviewCert: TranslationCertificate = {
    id: formId || "PREVIEW",
    national_id: formNationalId || "0000000000",
    project_name: formName || "Preview",
    source_lang: formSource,
    target_lang: formTarget,
    issue_date: formIssue || new Date().toISOString().split("T")[0],
    expiry_date: formExpiry || new Date().toISOString().split("T")[0],
    status: formRevoked ? "REVOKED" : "VALID",
  };
  const formDisplayStatus = getCertificateDisplayStatus(formPreviewCert);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1C2541] p-6 rounded border border-foreground/5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground">Translation Certificates</h2>
          <p className="text-xs text-foreground/50 mt-1">Manage, issue, update, and revoke official VISO translation certificates synced with the live Certipedia database.</p>
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

        {/* Table View */}
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px] text-foreground/40 font-medium">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading certificates...
            </div>
          ) : (
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-foreground/[0.02] text-foreground/60 font-bold uppercase tracking-wider border-b border-foreground/5">
                <tr>
                  <th className="px-6 py-4">Certificate ID</th>
                  <th className="px-6 py-4">National ID</th>
                  <th className="px-6 py-4">Document Details</th>
                  <th className="px-6 py-4">Languages</th>
                  <th className="px-6 py-4">Timeline</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
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
                    <tr key={cert.id} className="hover:bg-foreground/[0.01] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-foreground">{cert.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-foreground/80">{cert.national_id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground text-sm max-w-xs truncate">{cert.project_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-medium text-foreground/85">
                          <span>{cert.source_lang}</span>
                          <span className="text-foreground/40">➔</span>
                          <span>{cert.target_lang}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground/60">
                        <div>Issued: <span className="font-semibold text-foreground/80">{cert.issue_date}</span></div>
                        <div className="mt-0.5">Expires: <span className="font-semibold text-foreground/80">{cert.expiry_date}</span></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] font-bold max-w-[180px] leading-tight ${getStatusStyle(getCertificateDisplayStatus(cert))}`}
                          >
                            {getStatusIcon(getCertificateDisplayStatus(cert))}
                            {getDisplayStatusLabel(cert)}
                          </span>
                          {cert.status === "REVOKED" ? (
                            <button
                              type="button"
                              onClick={() => setRevokedFlag(cert, false)}
                              className="text-[9px] font-bold uppercase tracking-wider text-primary hover:underline cursor-pointer"
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
                              className="text-[9px] font-bold uppercase tracking-wider text-rose-500 hover:underline cursor-pointer"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/certificate/${cert.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors font-semibold shadow-sm hover:shadow"
                            title="View PDF Document"
                          >
                            View PDF
                          </a>
                          <button
                            onClick={() => openEditForm(cert)}
                            className="p-2 rounded bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cert.id)}
                            className="p-2 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-colors cursor-pointer"
                            title="Delete Record"
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 w-full max-w-lg rounded shadow-2xl p-6 md:p-8 text-foreground flex flex-col relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-foreground border-b border-foreground/5 pb-4 mb-6">
              {editingId ? `Edit Certificate: ${editingId}` : "Issue New Certificate"}
            </h3>
            
            {formError && (
              <div className="mb-4 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">Certificate ID</label>
                <input
                  type="text"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  placeholder="e.g. VISO-TR-2026-001245"
                  className="w-full bg-background border border-foreground/15 rounded-lg py-3 px-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary/50 transition-all uppercase"
                  disabled={!!editingId}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60">Saudi National ID / Order No.</label>
                  <button
                    type="button"
                    onClick={() => setFormNationalId(`1${Math.floor(100000000 + Math.random() * 900000000)}`)}
                    className="text-[9px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors cursor-pointer"
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={formNationalId}
                  onChange={(e) => setFormNationalId(e.target.value)}
                  placeholder="e.g. 1023456789 (10-digit ID)"
                  className="w-full bg-background border border-foreground/15 rounded-lg py-3 px-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">Document / Project Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Corporate Legal Contract"
                  className="w-full bg-background border border-foreground/15 rounded-lg py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">Source Language</label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full bg-background border border-foreground/15 rounded-lg py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-medium"
                  >
                    <option value="Arabic">Arabic</option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">Target Language</label>
                  <select
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    className="w-full bg-background border border-foreground/15 rounded-lg py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-medium"
                  >
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">Issue Date</label>
                  <input
                    type="date"
                    value={formIssue}
                    onChange={(e) => setFormIssue(e.target.value)}
                    className="w-full bg-background border border-foreground/15 rounded-lg py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full bg-background border border-foreground/15 rounded-lg py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">
                  Registry status (from dates)
                </label>
                <div
                  className={`w-full rounded-lg border py-3 px-4 text-xs font-semibold flex items-center gap-2 ${getStatusStyle(formDisplayStatus)}`}
                >
                  {getStatusIcon(formDisplayStatus)}
                  {getDisplayStatusLabel(formPreviewCert)}
                </div>
                <p className="text-[10px] text-foreground/45 mt-2 leading-relaxed">
                  Status is calculated from the issue and expiry dates. Use Withdraw on the list to remove a record from verification.
                </p>
                {editingId && (
                  <label className="mt-3 flex items-center gap-2 text-xs text-foreground/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formRevoked}
                      onChange={(e) => setFormRevoked(e.target.checked)}
                      className="rounded border-foreground/20"
                    />
                    Mark as withdrawn from registry
                  </label>
                )}
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-foreground/5 mt-8">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowForm(false)}
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
                    "Save Changes"
                  ) : (
                    "Issue Certificate"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
