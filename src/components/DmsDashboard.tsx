import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  UploadCloud,
  X,
  History,
  Download,
  RefreshCw,
  Search,
  UserCircle,
  Archive,
  RotateCcw,
  Pencil,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { edmsApi, EdmsDocument, EdmsDocumentVersion, EdmsAuditLog, PortalUserOption } from "@/lib/edmsApi";
import {
  EDMS_CONFIDENTIALITY,
  EDMS_DEPARTMENTS,
  EDMS_DOCUMENT_TYPES,
  EDMS_PROJECTS,
  EDMS_STATUSES,
  PENDING_STATUSES,
  generateDocumentNumber,
  statusBadgeClass,
  validateEdmsFile,
} from "@/lib/edmsConstants";
import {
  canApproveDocuments,
  canArchiveDocument,
  canAssignReviewer,
  canEditMetadata,
  canUploadDocuments,
  canViewDocument,
  isDocumentOwner,
  type EdmsSessionUser,
} from "@/lib/edmsPermissions";

type LibraryTab = "dashboard" | "documents" | "mine" | "pending" | "archived";

export function DmsDashboard({ user }: { user: EdmsSessionUser }) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("dashboard");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<EdmsDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const canUpload = canUploadDocuments(user);
  const canApprove = canApproveDocuments(user);
  const showMyDocuments = user.role === "employee" || user.role === "reviewer";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await edmsApi.getDocuments();
      setDocuments(docs.filter((d) => canViewDocument(d, user)));
    } catch (e) {
      console.error(e);
      toast.error("Could not load documents. Check Supabase connection and run edms_setup.sql.");
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (activeTab === "archived" && doc.status !== "Archived") return false;
      if (activeTab === "pending" && !PENDING_STATUSES.includes(doc.status as typeof PENDING_STATUSES[number])) {
        return false;
      }
      if (activeTab === "documents" && doc.status === "Archived") return false;
      if (activeTab === "mine" && !isDocumentOwner(doc, user)) return false;

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        doc.document_number.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        (doc.tags || "").toLowerCase().includes(q);
      const matchesProject = projectFilter === "All" || doc.project === projectFilter;
      const matchesStatus = statusFilter === "All" || doc.status === statusFilter;
      const matchesType = typeFilter === "All" || doc.type === typeFilter;
      return matchesSearch && matchesProject && matchesStatus && matchesType;
    });
  }, [documents, activeTab, searchQuery, projectFilter, statusFilter, typeFilter, user]);

  const pendingCount = documents.filter((d) => PENDING_STATUSES.includes(d.status as typeof PENDING_STATUSES[number])).length;
  const myCount = documents.filter((d) => isDocumentOwner(d, user)).length;

  const roleHint =
    user.role === "viewer"
      ? "You can browse approved public documents only."
      : user.role === "employee"
        ? "You see your own documents and approved non-confidential records."
        : user.role === "reviewer"
          ? "Review documents assigned to you or in the review queue."
          : "Full document control register access.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full relative"
    >
      <Toaster position="top-right" />

      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase mb-2 tracking-tight">EDMS</h1>
          <p className="text-foreground/60 max-w-2xl text-sm md:text-base">
            Electronic document management — register, version, review, approve, and archive project records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchData()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-foreground/15 text-sm hover:bg-foreground/5"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          {canUpload && (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 bg-gold text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold/90"
            >
              <UploadCloud size={16} /> New document
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-foreground/80">
        <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <div>
          <span className="font-medium capitalize">{user.role?.replace("_", " ")}</span>
          <span className="text-foreground/50"> — </span>
          {roleHint}
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded-lg p-3 lg:sticky lg:top-6 h-fit">
          <nav className="space-y-1">
            {(
              [
                { id: "dashboard" as const, label: "Overview" },
                { id: "documents" as const, label: "All documents" },
                ...(showMyDocuments ? [{ id: "mine" as const, label: "My documents", count: myCount }] : []),
                { id: "pending" as const, label: "In progress", count: pendingCount },
                { id: "archived" as const, label: "Archive" },
              ] as { id: LibraryTab; label: string; count?: number }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-gold/10 text-gold" : "hover:bg-foreground/5 text-foreground/70"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-6 pt-4 border-t border-foreground/10 space-y-2 px-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/45">Status summary</p>
            {EDMS_STATUSES.filter((s) => s !== "Archived").map((status) => {
              const n = documents.filter((d) => d.status === status).length;
              if (n === 0) return null;
              return (
                <div key={status} className="flex justify-between text-xs">
                  <span className="text-foreground/60">{status}</span>
                  <span className="font-mono">{n}</span>
                </div>
              );
            })}
          </div>
        </aside>

        <main className="min-h-[480px]">
          {loading ? (
            <div className="flex justify-center py-24 text-foreground/50">Loading register…</div>
          ) : activeTab === "dashboard" ? (
            <DashboardOverview
              documents={documents}
              canUpload={canUpload}
              onUpload={() => setShowUploadModal(true)}
            />
          ) : (
            <DocumentTable
              title={
                activeTab === "documents"
                  ? "Document register"
                  : activeTab === "mine"
                    ? "My documents"
                    : activeTab === "pending"
                      ? "Documents in progress"
                      : "Archived documents"
              }
              documents={filteredDocuments}
              canUpload={canUpload}
              onUpload={() => setShowUploadModal(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              projectFilter={projectFilter}
              onProjectFilterChange={setProjectFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              showStatusFilter={activeTab === "documents"}
              onOpen={(id) => setSelectedDocId(id)}
            />
          )}
        </main>
      </div>

      <AnimatePresence>
        {showUploadModal && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onSuccess={() => {
              setShowUploadModal(false);
              fetchData();
              setActiveTab("documents");
              toast.success("Document saved to the register.");
            }}
            user={user}
          />
        )}
        {selectedDocId && (
          <DocumentDetailModal
            documentId={selectedDocId}
            onClose={() => setSelectedDocId(null)}
            onUpdate={fetchData}
            user={user}
            canApprove={canApprove}
            canUpload={canUpload}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DashboardOverview({
  documents,
  canUpload,
  onUpload,
}: {
  documents: EdmsDocument[];
  canUpload: boolean;
  onUpload: () => void;
}) {
  const cards = [
    { label: "Total in register", value: documents.length, accent: "text-gold" },
    { label: "Approved", value: documents.filter((d) => d.status === "Approved").length, accent: "text-emerald-500" },
    { label: "In progress", value: documents.filter((d) => PENDING_STATUSES.includes(d.status as typeof PENDING_STATUSES[number])).length, accent: "text-amber-500" },
    { label: "Archived", value: documents.filter((d) => d.status === "Archived").length, accent: "text-foreground/60" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-[#1C2541]/50 border border-foreground/10 p-4 rounded-lg">
            <div className={`text-2xl font-bold mb-1 ${c.accent}`}>{c.value}</div>
            <div className="text-xs font-medium text-foreground/55 uppercase tracking-wide">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded-lg p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <FileText size={18} className="text-gold" /> Standard workflow
        </h3>
        <ol className="grid md:grid-cols-2 gap-3 text-sm text-foreground/75 list-decimal list-inside space-y-1">
          <li>Author creates a draft and uploads the controlled file.</li>
          <li>Author submits; document control may assign a reviewer.</li>
          <li>Reviewer approves, requests changes, or rejects.</li>
          <li>Manager gives final approval when required.</li>
          <li>Approved records are published; controllers archive when obsolete.</li>
        </ol>
      </div>

      {canUpload && (
        <button
          type="button"
          onClick={onUpload}
          className="w-full border-2 border-dashed border-foreground/15 rounded-lg p-8 text-center hover:border-gold/40 transition-colors"
        >
          <UploadCloud className="w-10 h-10 text-gold mx-auto mb-3" />
          <p className="font-semibold">Register a new controlled document</p>
          <p className="text-sm text-foreground/55 mt-1">Starts in Draft until submitted for review.</p>
        </button>
      )}
    </div>
  );
}

function DocumentTable({
  title,
  documents,
  canUpload,
  onUpload,
  searchQuery,
  onSearchChange,
  projectFilter,
  onProjectFilterChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  showStatusFilter,
  onOpen,
}: {
  title: string;
  documents: EdmsDocument[];
  canUpload: boolean;
  onUpload: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  projectFilter: string;
  onProjectFilterChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
  showStatusFilter: boolean;
  onOpen: (id: string) => void;
}) {
  const projects = Array.from(new Set(documents.map((d) => d.project)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{title}</h2>
        {canUpload && (
          <button type="button" onClick={onUpload} className="text-sm bg-gold text-background px-3 py-1.5 rounded-lg font-medium">
            + New
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-2 bg-white dark:bg-[#1C2541] border border-foreground/10 rounded-lg p-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="search"
            placeholder="Search number, title, or tags…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-background border border-foreground/10 focus:border-gold outline-none"
          />
        </div>
        <select
          value={projectFilter}
          onChange={(e) => onProjectFilterChange(e.target.value)}
          className="bg-background border border-foreground/10 rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="All">All projects</option>
          {projects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="bg-background border border-foreground/10 rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="All">All types</option>
          {EDMS_DOCUMENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {showStatusFilter && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-background border border-foreground/10 rounded-lg px-3 py-2.5 text-sm"
          >
            <option value="All">All statuses</option>
            {EDMS_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/5 text-foreground/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Document no.</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reviewer</th>
                <th className="px-4 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-foreground/50">
                    No documents match your filters.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-foreground/[0.03]">
                    <td className="px-4 py-3 font-mono text-gold text-xs">{doc.document_number}</td>
                    <td className="px-4 py-3 font-medium max-w-[200px] truncate" title={doc.title}>{doc.title}</td>
                    <td className="px-4 py-3 text-foreground/70">{doc.project}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${statusBadgeClass(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground/60 text-xs">
                      {doc.assigned_reviewer_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => onOpen(doc.id)} className="text-gold text-xs font-semibold hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function WorkflowSteps({ status }: { status: string }) {
  const steps = ["Draft", "Submitted", "Under Review", "Approved"];
  const statusIndex =
    status === "Changes Requested" ? 2
    : status === "Pending Approval" ? 3
    : status === "Rejected" || status === "Archived" ? -1
    : steps.indexOf(status === "Under Review" ? "Under Review" : status === "Submitted" ? "Submitted" : status);

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {steps.map((step, i) => {
        const active = statusIndex >= i && statusIndex !== -1;
        const current = (status === "Pending Approval" && step === "Approved") || step === status;
        return (
          <div
            key={step}
            className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${
              current ? "border-gold bg-gold/10 text-gold" : active ? "border-emerald-500/30 text-emerald-600" : "border-foreground/10 text-foreground/40"
            }`}
          >
            {step}
          </div>
        );
      })}
      {(status === "Rejected" || status === "Archived") && (
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${statusBadgeClass(status)}`}>{status}</span>
      )}
    </div>
  );
}

function UploadModal({
  onClose,
  onSuccess,
  user,
  documentId = null,
  existingDoc = null,
}: {
  onClose: () => void;
  onSuccess: () => void;
  user: EdmsSessionUser;
  documentId?: string | null;
  existingDoc?: EdmsDocument | null;
}) {
  const [loading, setLoading] = useState(false);
  const [docNo, setDocNo] = useState(existingDoc?.document_number || generateDocumentNumber("General"));
  const [title, setTitle] = useState(existingDoc?.title || "");
  const [type, setType] = useState(existingDoc?.type || "Report");
  const [dept, setDept] = useState(existingDoc?.department || user.department || "Operations");
  const [project, setProject] = useState(existingDoc?.project || "General");
  const [desc, setDesc] = useState(existingDoc?.description || "");
  const [tags, setTags] = useState(existingDoc?.tags || "");
  const [confidentiality, setConfidentiality] = useState(existingDoc?.confidentiality || "Internal");
  const [file, setFile] = useState<File | null>(null);
  const [changeDesc, setChangeDesc] = useState("");
  const isNewVersion = !!documentId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please attach a file.");
      return;
    }
    const fileError = validateEdmsFile(file);
    if (fileError) {
      toast.error(fileError);
      return;
    }
    setLoading(true);
    try {
      let doc = existingDoc;
      const fileExt = file.name.split(".").pop();
      const fileName = `${docNo.replace(/[^a-zA-Z0-9-]/g, "_")}_v${Date.now()}.${fileExt}`;
      const filePath = await edmsApi.uploadFile(file, fileName);

      if (!isNewVersion) {
        doc = await edmsApi.createDocument({
          document_number: docNo,
          title,
          type,
          department: dept,
          project,
          description: desc,
          tags,
          confidentiality,
          owner_name: user?.name || "Unknown",
          owner_id: user?.id,
          status: "Draft",
        });
        await edmsApi.logAudit({
          document_id: doc.id,
          user_name: user?.name || "Unknown",
          user_id: user?.id,
          action: "Registered",
          details: `Initial upload: ${file.name}`,
        });
      } else if (doc) {
        await edmsApi.logAudit({
          document_id: doc.id,
          user_name: user?.name || "Unknown",
          user_id: user?.id,
          action: "New version",
          details: `${file.name} — ${changeDesc}`,
        });
      }

      if (!doc) throw new Error("Document missing");

      let versionNum = 1;
      if (isNewVersion) {
        const versions = await edmsApi.getDocumentVersions(doc.id);
        versionNum = versions.length > 0 ? versions[0].version_number + 1 : 1;
      }

      await edmsApi.addDocumentVersion({
        document_id: doc.id,
        version_number: versionNum,
        file_url: filePath,
        created_by_name: user?.name || "Unknown",
        created_by_id: user?.id,
        change_description: isNewVersion ? changeDesc : "Initial upload",
      });

      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-[#1C2541] border border-foreground/10 p-6 rounded-xl shadow-2xl w-full max-w-2xl relative my-8"
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold mb-1">{isNewVersion ? "Upload new revision" : "Register document"}</h3>
        <p className="text-sm text-foreground/55 mb-6">Controlled files are versioned; metadata can be edited while in Draft.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isNewVersion && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Document number">
                  <div className="flex gap-2">
                    <input
                      required
                      value={docNo}
                      onChange={(e) => setDocNo(e.target.value)}
                      className="field-input flex-1"
                    />
                    <button
                      type="button"
                      className="text-xs px-2 rounded border border-foreground/15 hover:bg-foreground/5"
                      onClick={() => setDocNo(generateDocumentNumber(project))}
                    >
                      Auto
                    </button>
                  </div>
                </Field>
                <Field label="Title">
                  <input required value={title} onChange={(e) => setTitle(e.target.value)} className="field-input" />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Project">
                  <select value={project} onChange={(e) => setProject(e.target.value)} className="field-input">
                    {EDMS_PROJECTS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Department">
                  <select value={dept} onChange={(e) => setDept(e.target.value)} className="field-input">
                    {EDMS_DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Type">
                  <select value={type} onChange={(e) => setType(e.target.value)} className="field-input">
                    {EDMS_DOCUMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Confidentiality">
                  <select value={confidentiality} onChange={(e) => setConfidentiality(e.target.value)} className="field-input">
                    {EDMS_CONFIDENTIALITY.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Tags">
                  <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma separated" className="field-input" />
                </Field>
              </div>
              <Field label="Description">
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className="field-input" />
              </Field>
            </>
          )}

          {isNewVersion && (
            <Field label="Change description (required)">
              <textarea required value={changeDesc} onChange={(e) => setChangeDesc(e.target.value)} rows={2} className="field-input" />
            </Field>
          )}

          <label className="block border-2 border-dashed border-foreground/15 rounded-lg p-6 text-center cursor-pointer hover:border-gold/40">
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <UploadCloud className="w-8 h-8 mx-auto text-foreground/45 mb-2" />
            <span className="text-sm font-medium">{file ? file.name : "Choose file (max 50 MB)"}</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-foreground/15 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-gold text-background text-sm font-medium disabled:opacity-50">
              {loading ? "Saving…" : isNewVersion ? "Upload revision" : "Save to register"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wide text-foreground/50 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function DocumentDetailModal({
  documentId,
  onClose,
  onUpdate,
  user,
  canApprove,
  canUpload,
}: {
  documentId: string;
  onClose: () => void;
  onUpdate: () => void;
  user: EdmsSessionUser;
  canApprove: boolean;
  canUpload: boolean;
}) {
  const [doc, setDoc] = useState<EdmsDocument | null>(null);
  const [versions, setVersions] = useState<EdmsDocumentVersion[]>([]);
  const [audits, setAudits] = useState<EdmsAuditLog[]>([]);
  const [reviewers, setReviewers] = useState<PortalUserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewVersion, setShowNewVersion] = useState(false);
  const [editingMeta, setEditingMeta] = useState(false);
  const [commentDialog, setCommentDialog] = useState<null | { action: string; nextStatus: string; requireComment: boolean }>(null);
  const [commentText, setCommentText] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState("");

  const [metaForm, setMetaForm] = useState({
    title: "",
    description: "",
    tags: "",
    confidentiality: "Internal",
    type: "Report",
    project: "General",
    department: "Operations",
  });

  const loadDocData = useCallback(async () => {
    setLoading(true);
    try {
      const found = await edmsApi.getDocument(documentId);
      setDoc(found);
      setMetaForm({
        title: found.title,
        description: found.description || "",
        tags: found.tags || "",
        confidentiality: found.confidentiality,
        type: found.type,
        project: found.project,
        department: found.department,
      });
      setSelectedReviewer(found.assigned_reviewer_id || "");
      const [v, a, r] = await Promise.all([
        edmsApi.getDocumentVersions(documentId),
        edmsApi.getAuditLogs(documentId),
        edmsApi.getAssignableReviewers(),
      ]);
      setVersions(v);
      setAudits(a);
      setReviewers(r);
    } catch (e) {
      console.error(e);
      toast.error("Could not load document details.");
    }
    setLoading(false);
  }, [documentId]);

  useEffect(() => {
    loadDocData();
  }, [loadDocData]);

  const runStatusChange = async (action: string, newStatus: string, details?: string) => {
    try {
      await edmsApi.updateDocumentStatus(documentId, newStatus, details ? { review_notes: details } : undefined);
      await edmsApi.logAudit({
        document_id: documentId,
        user_name: user?.name || "Unknown",
        user_id: user?.id,
        action,
        details,
      });
      toast.success(`Status updated to ${newStatus}`);
      await loadDocData();
      onUpdate();
    } catch {
      toast.error("Could not update status.");
    }
  };

  const handleCommentConfirm = async () => {
    if (!commentDialog) return;
    if (commentDialog.requireComment && !commentText.trim()) {
      toast.error("Please enter a comment.");
      return;
    }
    await runStatusChange(commentDialog.action, commentDialog.nextStatus, commentText.trim() || undefined);
    setCommentDialog(null);
    setCommentText("");
  };

  const handleAssignReviewer = async () => {
    const reviewer = reviewers.find((r) => r.id === selectedReviewer);
    if (!reviewer) {
      toast.error("Select a reviewer.");
      return;
    }
    try {
      await edmsApi.updateDocument(documentId, {
        assigned_reviewer_id: reviewer.id,
        assigned_reviewer_name: reviewer.name,
        status: "Under Review",
      });
      await edmsApi.logAudit({
        document_id: documentId,
        user_name: user?.name || "Unknown",
        user_id: user?.id,
        action: "Assigned reviewer",
        details: `Assigned to ${reviewer.name}`,
      });
      toast.success("Reviewer assigned — document is under review.");
      loadDocData();
      onUpdate();
    } catch {
      toast.error("Could not assign reviewer.");
    }
  };

  const saveMetadata = async () => {
    try {
      await edmsApi.updateDocument(documentId, metaForm);
      await edmsApi.logAudit({
        document_id: documentId,
        user_name: user?.name || "Unknown",
        user_id: user?.id,
        action: "Metadata updated",
      });
      toast.success("Document details saved.");
      setEditingMeta(false);
      loadDocData();
      onUpdate();
    } catch {
      toast.error("Could not save metadata.");
    }
  };

  const downloadVersion = async (path: string) => {
    try {
      const url = await edmsApi.getFileDownloadUrl(path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Download failed. Check storage bucket permissions.");
    }
  };

  if (loading && !doc) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70">
        <p className="text-foreground/60">Loading…</p>
      </div>
    );
  }

  if (!doc) return null;

  const owner = isDocumentOwner(doc, user);
  const mayEdit = canEditMetadata(doc, user);
  const mayArchive = canArchiveDocument(user);
  const mayAssign = canAssignReviewer(user);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.98, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row min-h-[70vh] my-6 overflow-hidden"
        >
          <div className="flex-1 p-6 md:border-r border-foreground/10 overflow-y-auto max-h-[85vh]">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <WorkflowSteps status={doc.status} />
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusBadgeClass(doc.status)}`}>
                    {doc.status}
                  </span>
                  <span className="font-mono text-xs text-foreground/55">{doc.document_number}</span>
                </div>
                <h2 className="text-2xl font-bold">{doc.title}</h2>
              </div>
              <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-foreground/10">
                <X size={20} />
              </button>
            </div>

            {editingMeta ? (
              <div className="space-y-3 mb-6 p-4 rounded-lg border border-foreground/10 bg-foreground/[0.02]">
                <input value={metaForm.title} onChange={(e) => setMetaForm({ ...metaForm, title: e.target.value })} className="field-input w-full" />
                <textarea value={metaForm.description} onChange={(e) => setMetaForm({ ...metaForm, description: e.target.value })} rows={2} className="field-input w-full" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={metaForm.project} onChange={(e) => setMetaForm({ ...metaForm, project: e.target.value })} className="field-input">
                    {EDMS_PROJECTS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <select value={metaForm.department} onChange={(e) => setMetaForm({ ...metaForm, department: e.target.value })} className="field-input">
                    {EDMS_DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={saveMetadata} className="text-sm bg-gold text-background px-3 py-1.5 rounded-lg">Save</button>
                  <button type="button" onClick={() => setEditingMeta(false)} className="text-sm px-3 py-1.5 rounded-lg border border-foreground/15">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <MetaItem label="Project" value={doc.project} />
                <MetaItem label="Department" value={doc.department} />
                <MetaItem label="Type" value={doc.type} />
                <MetaItem label="Confidentiality" value={doc.confidentiality} />
                <MetaItem label="Owner" value={doc.owner_name} />
                <MetaItem label="Reviewer" value={doc.assigned_reviewer_name || "Not assigned"} />
                <div className="col-span-2">
                  <span className="text-foreground/45 text-xs uppercase block">Description</span>
                  <p className="text-foreground/80 mt-1">{doc.description || "—"}</p>
                </div>
                {mayEdit && (
                  <button type="button" onClick={() => setEditingMeta(true)} className="col-span-2 text-xs text-gold flex items-center gap-1 font-medium">
                    <Pencil size={14} /> Edit details
                  </button>
                )}
              </div>
            )}

            <section className="border-t border-foreground/10 pt-5 mb-6">
              <h3 className="font-bold mb-3 flex items-center gap-2"><History size={16} /> Revisions</h3>
              <div className="space-y-2">
                {versions.map((v) => (
                  <div key={v.id} className="flex justify-between items-center p-3 rounded-lg border border-foreground/10 bg-background/50">
                    <div>
                      <p className="font-semibold text-sm">Rev {v.version_number}</p>
                      <p className="text-xs text-foreground/60">{v.change_description}</p>
                      <p className="text-[10px] text-foreground/40 mt-1">{v.created_by_name} · {new Date(v.created_at).toLocaleString()}</p>
                    </div>
                    <button type="button" onClick={() => downloadVersion(v.file_url)} className="p-2 rounded-full hover:bg-foreground/10 text-gold" title="Download">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {canUpload && (owner || user.role === "document_controller" || user.role === "super_admin") && doc.status !== "Archived" && (
                <button type="button" onClick={() => setShowNewVersion(true)} className="mt-3 text-sm text-gold font-medium flex items-center gap-1">
                  <UploadCloud size={16} /> Upload new revision
                </button>
              )}
            </section>

            <section className="border-t border-foreground/10 pt-5">
              <h3 className="font-bold mb-3">Actions</h3>
              <div className="flex flex-wrap gap-2">
                {doc.status === "Draft" && (owner || canUpload) && (
                  <ActionBtn onClick={() => runStatusChange("Submitted", "Submitted")}>Submit for review</ActionBtn>
                )}
                {doc.status === "Submitted" && mayAssign && (
                  <div className="flex flex-wrap items-center gap-2 w-full">
                    <UserCircle size={16} className="text-foreground/50" />
                    <select value={selectedReviewer} onChange={(e) => setSelectedReviewer(e.target.value)} className="field-input text-sm flex-1 min-w-[160px]">
                      <option value="">Select reviewer…</option>
                      {reviewers.map((r) => (
                        <option key={r.id} value={r.id}>{r.name} ({r.role})</option>
                      ))}
                    </select>
                    <ActionBtn onClick={handleAssignReviewer}>Start review</ActionBtn>
                  </div>
                )}
                {doc.status === "Under Review" && canApprove && (
                  <>
                    <ActionBtn variant="success" onClick={() => {
                      const next = user.role === "manager" || user.role === "super_admin" ? "Approved" : "Pending Approval";
                      runStatusChange("Reviewed", next);
                    }}>
                      {user.role === "manager" || user.role === "super_admin" ? "Approve" : "Recommend approval"}
                    </ActionBtn>
                    <ActionBtn variant="warn" onClick={() => setCommentDialog({ action: "Changes requested", nextStatus: "Changes Requested", requireComment: true })}>
                      Request changes
                    </ActionBtn>
                    <ActionBtn variant="danger" onClick={() => setCommentDialog({ action: "Rejected", nextStatus: "Rejected", requireComment: true })}>
                      Reject
                    </ActionBtn>
                  </>
                )}
                {doc.status === "Pending Approval" && (user.role === "manager" || user.role === "super_admin" || user.role === "document_controller") && (
                  <>
                    <ActionBtn variant="success" onClick={() => runStatusChange("Approved", "Approved")}>Final approve</ActionBtn>
                    <ActionBtn variant="danger" onClick={() => setCommentDialog({ action: "Rejected", nextStatus: "Rejected", requireComment: true })}>Reject</ActionBtn>
                  </>
                )}
                {doc.status === "Changes Requested" && owner && (
                  <ActionBtn onClick={() => runStatusChange("Resubmitted", "Submitted")}>Resubmit after changes</ActionBtn>
                )}
                {mayArchive && ["Approved", "Rejected"].includes(doc.status) && (
                  <ActionBtn variant="muted" onClick={() => runStatusChange("Archived", "Archived")}>
                    <Archive size={14} className="inline mr-1" /> Archive
                  </ActionBtn>
                )}
                {doc.status === "Archived" && user.role === "super_admin" && (
                  <ActionBtn variant="muted" onClick={() => runStatusChange("Restored", "Approved")}>
                    <RotateCcw size={14} className="inline mr-1" /> Restore to approved
                  </ActionBtn>
                )}
              </div>
              {doc.review_notes && (
                <p className="mt-3 text-sm text-foreground/70 italic border-l-2 border-gold/40 pl-3">{doc.review_notes}</p>
              )}
            </section>
          </div>

          <aside className="w-full md:w-80 bg-foreground/[0.03] p-5 overflow-y-auto max-h-[85vh]">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-foreground/50">Audit trail</h3>
            <div className="space-y-4">
              {audits.length === 0 ? (
                <p className="text-sm text-foreground/45">No activity yet.</p>
              ) : (
                audits.map((audit) => (
                  <div key={audit.id} className="relative pl-4 border-l-2 border-foreground/10">
                    <div className="absolute w-2 h-2 bg-gold rounded-full -left-[5px] top-1.5" />
                    <p className="text-sm font-semibold">{audit.action}</p>
                    <p className="text-xs text-foreground/55">{audit.user_name}</p>
                    {audit.details && <p className="text-xs mt-1 text-foreground/70">{audit.details}</p>}
                    <p className="text-[10px] text-foreground/40 mt-1">{new Date(audit.created_at).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </aside>

          {showNewVersion && (
            <UploadModal
              onClose={() => setShowNewVersion(false)}
              onSuccess={() => {
                setShowNewVersion(false);
                loadDocData();
                onUpdate();
                toast.success("New revision uploaded.");
              }}
              user={user}
              documentId={documentId}
              existingDoc={doc}
            />
          )}
        </motion.div>
      </motion.div>

      <Dialog open={!!commentDialog} onOpenChange={(open) => !open && setCommentDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comment required</DialogTitle>
            <DialogDescription>Provide a short note for the document owner and audit log.</DialogDescription>
          </DialogHeader>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
            className="field-input w-full"
            placeholder="Reason for rejection or requested changes…"
          />
          <DialogFooter>
            <button type="button" className="px-3 py-2 text-sm rounded-lg border" onClick={() => setCommentDialog(null)}>Cancel</button>
            <button type="button" className="px-3 py-2 text-sm rounded-lg bg-gold text-background" onClick={handleCommentConfirm}>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-foreground/45 text-xs uppercase">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "success" | "danger" | "warn" | "muted";
}) {
  const styles = {
    primary: "bg-gold text-background hover:bg-gold/90",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "border border-red-500 text-red-600 hover:bg-red-500/10",
    warn: "border border-amber-500 text-amber-600 hover:bg-amber-500/10",
    muted: "border border-foreground/20 hover:bg-foreground/5",
  };
  return (
    <button type="button" onClick={onClick} className={`px-3 py-2 rounded-lg text-sm font-medium ${styles[variant]}`}>
      {children}
    </button>
  );
}
