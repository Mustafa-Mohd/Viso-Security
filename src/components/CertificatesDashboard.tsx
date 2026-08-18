import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, ShieldCheck, AlertTriangle, XCircle, Search, RefreshCw, Check } from "lucide-react";

// Standard mock data used as fallback
const DEFAULT_CERTS = {
  "VISO-TR-2026-001245": { nationalId: "1023456789", status: "VALID", source: "Arabic", target: "English", issue: "16 Aug 2026", expiry: "16 Aug 2027", name: "Corporate Legal Contract" },
  "VISO-TR-2025-009812": { nationalId: "1100223344", status: "EXPIRED", source: "French", target: "Arabic", issue: "10 Jan 2025", expiry: "10 Jan 2026", name: "Medical Device Manual" },
  "VISO-TR-2026-000404": { nationalId: "1055566677", status: "REVOKED", source: "English", target: "Arabic", issue: "01 Dec 2025", expiry: "01 Dec 2026", name: "Financial Audit Report" },
};

interface Certificate {
  id: string;
  nationalId: string;
  name: string;
  source: string;
  target: string;
  issue: string;
  expiry: string;
  status: "VALID" | "EXPIRED" | "REVOKED";
}

export function CertificatesDashboard() {
  const [certs, setCerts] = useState<Record<string, Certificate>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VALID" | "EXPIRED" | "REVOKED">("ALL");
  
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
  const [formStatus, setFormStatus] = useState<"VALID" | "EXPIRED" | "REVOKED">("VALID");
  const [formError, setFormError] = useState("");

  // Load certificates
  const loadCerts = () => {
    const stored = localStorage.getItem("viso_certificates");
    if (!stored) {
      localStorage.setItem("viso_certificates", JSON.stringify(DEFAULT_CERTS));
      setCerts(DEFAULT_CERTS as any);
    } else {
      try {
        setCerts(JSON.parse(stored));
      } catch (e) {
        setCerts(DEFAULT_CERTS as any);
      }
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const saveCerts = (newCerts: Record<string, Certificate>) => {
    localStorage.setItem("viso_certificates", JSON.stringify(newCerts));
    setCerts(newCerts);
  };

  // Helper to open form for creating
  const openCreateForm = () => {
    setFormError("");
    setEditingId(null);
    setFormId(`VISO-TR-2026-00${Math.floor(1000 + Math.random() * 9000)}`); // Prefill clean random ID
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
    setFormStatus("VALID");
    setShowForm(true);
  };

  // Helper to open form for editing
  const openEditForm = (id: string, cert: Certificate) => {
    setFormError("");
    setEditingId(id);
    setFormId(id);
    setFormNationalId(cert.nationalId);
    setFormName(cert.name);
    setFormSource(cert.source);
    setFormTarget(cert.target);
    setFormIssue(cert.issue);
    setFormExpiry(cert.expiry);
    setFormStatus(cert.status);
    setShowForm(true);
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
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
    if (!editingId && certs[upperId]) {
      setFormError(`A certificate with ID "${upperId}" already exists.`);
      return;
    }

    const updatedCerts = { ...certs };
    updatedCerts[upperId] = {
      id: upperId,
      nationalId: formNationalId.trim(),
      name: formName.trim(),
      source: formSource,
      target: formTarget,
      issue: formIssue,
      expiry: formExpiry,
      status: formStatus,
    };

    saveCerts(updatedCerts);
    setShowForm(false);
    setEditingId(null);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete certificate ${id}?`)) {
      const updatedCerts = { ...certs };
      delete updatedCerts[id];
      saveCerts(updatedCerts);
    }
  };

  // Quick Toggle Status
  const toggleStatus = (id: string, currentStatus: "VALID" | "EXPIRED" | "REVOKED") => {
    const nextStatusMap: Record<string, "VALID" | "EXPIRED" | "REVOKED"> = {
      VALID: "EXPIRED",
      EXPIRED: "REVOKED",
      REVOKED: "VALID"
    };
    const updatedCerts = { ...certs };
    updatedCerts[id] = {
      ...updatedCerts[id],
      status: nextStatusMap[currentStatus]
    };
    saveCerts(updatedCerts);
  };

  // Filtered Certificates list
  const filteredCerts = Object.entries(certs).filter(([id, data]) => {
    const matchesSearch = 
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.nationalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || data.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "VALID":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "EXPIRED":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "REVOKED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-500 border-neutral-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VALID":
        return <ShieldCheck className="w-4 h-4" />;
      case "EXPIRED":
        return <AlertTriangle className="w-4 h-4" />;
      case "REVOKED":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-foreground/5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground">Translation Certificates</h2>
          <p className="text-xs text-foreground/50 mt-1">Manage, issue, update, and revoke official VISO translation certificates synced with the live Certipedia database.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Issue Certificate
        </button>
      </div>

      {/* Main Filter & Table Card */}
      <div className="bg-surface rounded-2xl border border-foreground/5 shadow-sm overflow-hidden">
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
            {(["ALL", "VALID", "EXPIRED", "REVOKED"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === filter
                    ? "bg-primary text-white"
                    : "bg-background text-foreground/60 border border-foreground/10 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
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
                filteredCerts.map(([id, cert]) => (
                  <tr key={id} className="hover:bg-foreground/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-foreground">{id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-foreground/80">{cert.nationalId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground text-sm max-w-xs truncate">{cert.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-foreground/85">
                        <span>{cert.source}</span>
                        <span className="text-foreground/40">➔</span>
                        <span>{cert.target}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground/60">
                      <div>Issued: <span className="font-semibold text-foreground/80">{cert.issue}</span></div>
                      <div className="mt-0.5">Expires: <span className="font-semibold text-foreground/80">{cert.expiry}</span></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleStatus(id, cert.status)}
                        title="Click to cycle status"
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] font-bold uppercase cursor-pointer hover:scale-105 active:scale-95 transition-all ${getStatusStyle(cert.status)}`}
                      >
                        {getStatusIcon(cert.status)}
                        {cert.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/certificate/${id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors font-semibold shadow-sm hover:shadow"
                          title="View PDF Document"
                        >
                          View PDF
                        </a>
                        <button
                          onClick={() => openEditForm(id, cert)}
                          className="p-2 rounded bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
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
        </div>
      </div>

      {/* Issuing / Editing Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface border border-foreground/10 w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 text-foreground flex flex-col relative max-h-[90vh] overflow-y-auto">
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
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">Saudi National ID</label>
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
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-2">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full bg-background border border-foreground/15 rounded-lg py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-bold"
                >
                  <option value="VALID" className="text-emerald-500">VALID (🟢)</option>
                  <option value="EXPIRED" className="text-amber-500">EXPIRED (🟠)</option>
                  <option value="REVOKED" className="text-rose-500">REVOKED (🔴)</option>
                </select>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-foreground/5 mt-8 font-sans">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-lg border border-foreground/10 text-foreground/75 hover:bg-foreground/5 hover:text-foreground text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  {editingId ? "Save Changes" : "Issue Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
