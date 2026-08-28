import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, UploadCloud, X, History, Eye, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react";
import { edmsApi, EdmsDocument, EdmsDocumentVersion, EdmsAuditLog } from "@/lib/edmsApi";

export function DmsDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "documents" | "pending" | "archived">("dashboard");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  
  // Data State
  const [documents, setDocuments] = useState<EdmsDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Permissions based on user.role
  const role = user?.role || "viewer";
  const canUpload = ["super_admin", "admin", "manager", "employee", "document_controller"].includes(role);
  const canApprove = ["super_admin", "admin", "manager", "reviewer"].includes(role);

  const fetchData = async () => {
    setLoading(true);
    try {
      const docs = await edmsApi.getDocuments();
      setDocuments(docs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    if (activeTab === "archived" && doc.status !== "Archived") return false;
    if (activeTab === "pending" && !["Under Review", "Pending Approval"].includes(doc.status)) return false;
    if (activeTab === "documents" && doc.status === "Archived") return false;

    const matchesSearch = doc.document_number.toLowerCase().includes(searchQuery.toLowerCase()) || doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = projectFilter === "All" || doc.project === projectFilter;
    const matchesStatus = statusFilter === "All" || doc.status === statusFilter;
    return matchesSearch && matchesProject && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative"
    >
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold uppercase mb-2 tracking-tight">Document Management</h1>
        <p className="text-foreground/60 max-w-3xl">
          Centralized electronic document management system (EDMS) for uploading, reviewing, approving, and archiving critical project documents.
        </p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Left Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface border border-foreground/10 rounded-2xl p-4 sticky top-6">
            <div className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "documents", label: "Document Library" },
                { id: "pending", label: "Pending Review", count: documents.filter(d => ["Under Review", "Pending Approval"].includes(d.status)).length },
                { id: "archived", label: "Archived" },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-gold/10 text-gold' : 'hover:bg-foreground/5 text-foreground/70'}`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-8 border-t border-foreground/10 pt-6">
              <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-4 px-2">Document Statuses</h4>
              <div className="space-y-3 px-2">
                <div className="flex justify-between text-sm"><span className="text-foreground/70">Draft</span><span className="font-mono font-medium">{documents.filter(d=>d.status==='Draft').length}</span></div>
                <div className="flex justify-between text-sm"><span className="text-foreground/70">Under Review</span><span className="font-mono font-medium">{documents.filter(d=>["Under Review", "Pending Approval"].includes(d.status)).length}</span></div>
                <div className="flex justify-between text-sm"><span className="text-foreground/70 text-emerald-500">Approved</span><span className="font-mono font-medium text-emerald-500">{documents.filter(d=>d.status==='Approved').length}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-8 min-h-[500px]">
          {loading ? (
            <div className="flex justify-center py-20 text-foreground/50">Loading documents...</div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-surface/50 border border-foreground/10 p-4 rounded-xl">
                      <div className="text-2xl font-display font-bold text-gold mb-1">{documents.length}</div>
                      <div className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Total Documents</div>
                    </div>
                    <div className="bg-surface/50 border border-foreground/10 p-4 rounded-xl">
                      <div className="text-2xl font-display font-bold mb-1 text-emerald-500">{documents.filter(d=>d.status==='Approved').length}</div>
                      <div className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Approved</div>
                    </div>
                    <div className="bg-surface/50 border border-foreground/10 p-4 rounded-xl">
                      <div className="text-2xl font-display font-bold mb-1 text-amber-500">{documents.filter(d=>["Under Review", "Pending Approval"].includes(d.status)).length}</div>
                      <div className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Pending Action</div>
                    </div>
                  </div>

                  {canUpload && (
                    <div className="bg-surface border-2 border-dashed border-foreground/20 rounded-xl p-8 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Upload Document</h3>
                      <p className="text-sm text-foreground/60 max-w-md mx-auto mb-6">
                        Upload a new document to the register. It will start as a Draft.
                      </p>
                      <button onClick={() => setShowUploadModal(true)} className="bg-gold text-background px-6 py-2.5 rounded-lg font-medium hover:bg-gold/90 transition-colors">
                        New Document Entry
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {["documents", "pending", "archived"].includes(activeTab) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex justify-between items-center border-b border-foreground/10 pb-4">
                    <h3 className="text-xl font-bold">
                      {activeTab === "documents" ? "Document Library" : activeTab === "pending" ? "Pending Reviews" : "Archived Documents"}
                    </h3>
                    {canUpload && (
                      <button onClick={() => setShowUploadModal(true)} className="bg-gold text-background px-4 py-2 rounded-lg font-medium hover:bg-gold/90 transition-colors text-sm">
                        + Upload Document
                      </button>
                    )}
                  </div>

                  <div className="bg-surface border border-foreground/10 rounded-xl p-2 flex flex-col md:flex-row gap-2">
                    <input 
                      type="text" 
                      placeholder="Search doc number or title..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-background border border-foreground/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gold" 
                    />
                    <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="bg-background border border-foreground/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gold">
                      <option value="All">All projects</option>
                      {Array.from(new Set(documents.map(d => d.project))).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    {activeTab === "documents" && (
                      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-background border border-foreground/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gold">
                        <option value="All">All statuses</option>
                        <option value="Approved">Approved</option>
                        <option value="Draft">Draft</option>
                        <option value="Under Review">Under Review</option>
                      </select>
                    )}
                  </div>

                  <div className="bg-surface border border-foreground/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-foreground/5 text-foreground/60 font-medium">
                          <tr>
                            <th className="px-4 py-3">Doc No.</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Project</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Owner</th>
                            <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/5">
                          {filteredDocuments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-foreground/50">No documents found.</td>
                            </tr>
                          ) : filteredDocuments.map((doc) => (
                            <tr key={doc.id} className="hover:bg-foreground/5 transition-colors group">
                              <td className="px-4 py-3 font-mono text-gold">{doc.document_number}</td>
                              <td className="px-4 py-3 font-medium max-w-[200px] truncate" title={doc.title}>{doc.title}</td>
                              <td className="px-4 py-3 text-foreground/70">{doc.project}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                  doc.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                  ["Under Review", "Pending Approval"].includes(doc.status) ? 'bg-amber-500/10 text-amber-500' :
                                  doc.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                                  'bg-foreground/10 text-foreground/60'
                                }`}>
                                  {doc.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-foreground/70">{doc.owner_name}</td>
                              <td className="px-4 py-3 text-right">
                                <button onClick={() => setSelectedDocId(doc.id)} className="text-gold hover:underline text-xs font-medium">View Details</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showUploadModal && (
          <UploadModal 
            onClose={() => setShowUploadModal(false)} 
            onSuccess={() => {
              setShowUploadModal(false);
              fetchData();
              setActiveTab("documents");
            }}
            user={user}
          />
        )}
        
        {selectedDocId && (
          <DocumentDetailModal
            documentId={selectedDocId}
            onClose={() => setSelectedDocId(null)}
            onUpdate={() => fetchData()}
            user={user}
            canApprove={canApprove}
            canUpload={canUpload}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Upload Modal Component
// -----------------------------------------------------------------------------
function UploadModal({ onClose, onSuccess, user, documentId = null, existingDoc = null }: any) {
  const [loading, setLoading] = useState(false);
  const [docNo, setDocNo] = useState(existingDoc?.document_number || "");
  const [title, setTitle] = useState(existingDoc?.title || "");
  const [type, setType] = useState(existingDoc?.type || "Report");
  const [dept, setDept] = useState(existingDoc?.department || "Operations");
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
      alert("Please select a file to upload.");
      return;
    }
    setLoading(true);
    try {
      let doc = existingDoc;
      const fileExt = file.name.split('.').pop();
      const fileName = `${docNo}_v${isNewVersion ? 'new' : '1'}_${Date.now()}.${fileExt}`;
      const filePath = await edmsApi.uploadFile(file, fileName);
      
      if (!isNewVersion) {
        doc = await edmsApi.createDocument({
          document_number: docNo,
          title, type, department: dept, project, description: desc, tags, confidentiality,
          owner_name: user?.name || "Unknown",
          owner_id: user?.id,
          status: "Draft"
        });
        await edmsApi.logAudit({ document_id: doc.id, user_name: user?.name, user_id: user?.id, action: "Uploaded", details: `Uploaded initial version: ${file.name}` });
      } else {
        await edmsApi.logAudit({ document_id: doc.id, user_name: user?.name, user_id: user?.id, action: "New Version Uploaded", details: `Uploaded new version: ${file.name} - ${changeDesc}` });
      }

      // Add Version
      // We need to fetch current max version number if it's a new version
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
        change_description: isNewVersion ? changeDesc : "Initial Upload"
      });

      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto pt-20">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-surface border border-foreground/10 p-6 rounded-2xl shadow-2xl w-full max-w-2xl relative my-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"><X size={20}/></button>
        <h3 className="text-xl font-bold mb-6">{isNewVersion ? "Upload New Version" : "New Document Entry"}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isNewVersion && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Document Number</label>
                  <input required value={docNo} onChange={e => setDocNo(e.target.value)} type="text" placeholder="e.g. VISO-PRJ-001" className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Title</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="Document Title" className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Project</label>
                  <input required value={project} onChange={e => setProject(e.target.value)} type="text" className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Department</label>
                  <input required value={dept} onChange={e => setDept(e.target.value)} type="text" className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold">
                    <option>Report</option><option>Drawings</option><option>Specifications</option><option>Contract</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Confidentiality</label>
                  <select value={confidentiality} onChange={e => setConfidentiality(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold">
                    <option>Public</option><option>Internal</option><option>Confidential</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Tags</label>
                  <input value={tags} onChange={e => setTags(e.target.value)} type="text" placeholder="e.g. urgent, draft" className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold" />
              </div>
            </>
          )}

          {isNewVersion && (
            <div>
              <label className="block text-xs font-bold text-foreground/60 uppercase mb-2">Change Description</label>
              <textarea required value={changeDesc} onChange={e => setChangeDesc(e.target.value)} rows={2} placeholder="What changed in this version?" className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold" />
            </div>
          )}

          <div className="border-2 border-dashed border-foreground/20 rounded-xl p-6 text-center hover:border-gold/50 transition-colors">
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-8 h-8 text-foreground/50 mb-2" />
              <span className="text-sm font-medium">{file ? file.name : "Click to select file or drag & drop"}</span>
              <span className="text-xs text-foreground/50 mt-1">PDF, DOCX, XLSX up to 50MB</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-foreground/20 rounded-lg font-medium hover:bg-foreground/5 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-gold text-background rounded-lg font-medium hover:bg-gold/90 transition-colors disabled:opacity-50">
              {loading ? "Uploading..." : isNewVersion ? "Upload Version" : "Save Document"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Document Detail Modal
// -----------------------------------------------------------------------------
function DocumentDetailModal({ documentId, onClose, onUpdate, user, canApprove, canUpload }: any) {
  const [doc, setDoc] = useState<EdmsDocument | null>(null);
  const [versions, setVersions] = useState<EdmsDocumentVersion[]>([]);
  const [audits, setAudits] = useState<EdmsAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewVersion, setShowNewVersion] = useState(false);

  useEffect(() => {
    loadDocData();
  }, [documentId]);

  const loadDocData = async () => {
    setLoading(true);
    try {
      const docs = await edmsApi.getDocuments();
      const found = docs.find(d => d.id === documentId);
      if (found) setDoc(found);
      
      const v = await edmsApi.getDocumentVersions(documentId);
      setVersions(v);
      
      const a = await edmsApi.getAuditLogs(documentId);
      setAudits(a);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAction = async (action: "Submit" | "Approve" | "Reject" | "Request Changes", newStatus: string) => {
    const reason = action === "Reject" || action === "Request Changes" ? prompt("Please enter a reason/comment:") : "";
    if ((action === "Reject" || action === "Request Changes") && reason === null) return;
    
    try {
      await edmsApi.updateDocumentStatus(documentId, newStatus);
      await edmsApi.logAudit({
        document_id: documentId,
        user_name: user?.name,
        user_id: user?.id,
        action: action,
        details: reason ? `Reason: ${reason}` : undefined
      });
      loadDocData();
      onUpdate();
    } catch (e) {
      console.error(e);
      alert("Failed to update status.");
    }
  };

  if (!doc && !loading) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-surface border border-foreground/10 p-0 rounded-2xl shadow-2xl w-full max-w-5xl relative flex flex-col md:flex-row min-h-[70vh] my-auto">
        
        {/* Left Col: Details & Actions */}
        <div className="w-full md:w-2/3 p-6 md:border-r border-foreground/10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  doc?.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                  doc?.status === 'Under Review' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-foreground/10 text-foreground/60'
                }`}>{doc?.status}</span>
                <span className="font-mono text-sm text-foreground/60">{doc?.document_number}</span>
              </div>
              <h2 className="text-2xl font-bold">{doc?.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-foreground/5 rounded-full hover:bg-foreground/10"><X size={20}/></button>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm">
            <div><span className="text-foreground/50 block text-xs uppercase">Project</span><span className="font-medium">{doc?.project}</span></div>
            <div><span className="text-foreground/50 block text-xs uppercase">Department</span><span className="font-medium">{doc?.department}</span></div>
            <div><span className="text-foreground/50 block text-xs uppercase">Type</span><span className="font-medium">{doc?.type}</span></div>
            <div><span className="text-foreground/50 block text-xs uppercase">Owner</span><span className="font-medium">{doc?.owner_name}</span></div>
            <div className="col-span-2"><span className="text-foreground/50 block text-xs uppercase">Description</span><p className="text-foreground/80 mt-1">{doc?.description || "No description provided."}</p></div>
          </div>

          <div className="border-t border-foreground/10 pt-6 mb-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><History size={18}/> Version History</h3>
            <div className="space-y-3">
              {versions.map(v => (
                <div key={v.id} className="flex justify-between items-center p-3 border border-foreground/10 rounded-lg bg-background">
                  <div>
                    <div className="font-bold text-sm">Version {v.version_number}</div>
                    <div className="text-xs text-foreground/60">{v.change_description}</div>
                    <div className="text-[10px] text-foreground/40 mt-1">By {v.created_by_name} on {new Date(v.created_at).toLocaleString()}</div>
                  </div>
                  <a href={edmsApi.getFileUrl(v.file_url)} target="_blank" rel="noreferrer" className="p-2 hover:bg-foreground/5 rounded-full text-gold">
                    <Download size={18} />
                  </a>
                </div>
              ))}
            </div>
            {canUpload && (
              <button onClick={() => setShowNewVersion(true)} className="mt-4 text-sm font-medium text-gold hover:underline flex items-center gap-1">
                <UploadCloud size={16}/> Upload New Version
              </button>
            )}
          </div>

          {/* Workflow Actions */}
          <div className="border-t border-foreground/10 pt-6">
            <h3 className="text-lg font-bold mb-4">Workflow Actions</h3>
            <div className="flex flex-wrap gap-3">
              {doc?.status === "Draft" && canUpload && (
                <button onClick={() => handleAction("Submit", "Under Review")} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">Submit for Review</button>
              )}
              {doc?.status === "Under Review" && canApprove && (
                <>
                  <button onClick={() => handleAction("Approve", "Approved")} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">Approve</button>
                  <button onClick={() => handleAction("Request Changes", "Draft")} className="px-4 py-2 border border-amber-500 text-amber-500 rounded-lg text-sm font-medium hover:bg-amber-500/10">Request Changes</button>
                  <button onClick={() => handleAction("Reject", "Rejected")} className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/10">Reject</button>
                </>
              )}
              {!["Draft", "Under Review"].includes(doc?.status || "") && (
                <p className="text-sm text-foreground/50">No actions available in current status.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Audit Trail */}
        <div className="w-full md:w-1/3 bg-foreground/5 p-6 rounded-r-2xl overflow-y-auto max-h-[70vh]">
          <h3 className="text-lg font-bold mb-4">Audit Trail</h3>
          <div className="space-y-4">
            {audits.map(audit => (
              <div key={audit.id} className="relative pl-4 border-l-2 border-foreground/10 pb-4 last:border-0 last:pb-0">
                <div className="absolute w-2.5 h-2.5 bg-gold rounded-full -left-[7px] top-1"></div>
                <div className="text-sm font-bold">{audit.action}</div>
                <div className="text-xs text-foreground/70 my-1">{audit.user_name}</div>
                {audit.details && <div className="text-xs bg-background/50 p-2 rounded text-foreground/80 italic">"{audit.details}"</div>}
                <div className="text-[10px] text-foreground/40 mt-1">{new Date(audit.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Upload New Version Modal */}
        {showNewVersion && (
          <UploadModal 
            onClose={() => setShowNewVersion(false)} 
            onSuccess={() => {
              setShowNewVersion(false);
              loadDocData();
              onUpdate();
            }}
            user={user}
            documentId={documentId}
            existingDoc={doc}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
