import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";

export function DmsDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "documents" | "archive" | "correspondence" | "translation" | "approvals" | "reports">("dashboard");
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // State for documents
  const [documents, setDocuments] = useState([
    { id: 1, no: "VISO-PRJ-STR-DRW-000123", project: "Vision Tower", type: "Drawings", status: "Approved", owner: "Syed Ajazuddin", date: "2026-07-31" },
    { id: 2, no: "VISO-PRJ-MEP-SCH-000456", project: "Business Complex", type: "MEP", status: "Under Review", owner: "Sarah Alqahtani", date: "2026-07-31" },
    { id: 3, no: "VISO-PRJ-ARC-SPEC-000789", project: "Conference Center", type: "Specifications", status: "Draft", owner: "Mohammed Alshahri", date: "2026-07-30" },
    { id: 4, no: "VISO-PRJ-CIV-RPT-000321", project: "Road Network", type: "Report", status: "Issued", owner: "Fahad Almutairi", date: "2026-07-30" },
    { id: 5, no: "VISO-NM-SEC-001", project: "NEOM Line", type: "Drawings", status: "Approved", owner: "Syed Ajazuddin", date: "2026-07-28" },
    { id: 6, no: "VISO-QA-RPT-012", project: "Qiddiya Access", type: "Report", status: "Pending Approval", owner: "Syed Ajazuddin", date: "2026-07-25" },
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Upload Form State
  const [newDocNo, setNewDocNo] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocProject, setNewDocProject] = useState("Vision Tower");
  const [newDocType, setNewDocType] = useState("Report");

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.no.toLowerCase().includes(searchQuery.toLowerCase()) || doc.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = projectFilter === "All" || doc.project === projectFilter;
    const matchesType = typeFilter === "All" || doc.type === typeFilter;
    const matchesStatus = statusFilter === "All" || doc.status === statusFilter;
    return matchesSearch && matchesProject && matchesType && matchesStatus;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocNo) return;
    const newDoc = {
      id: Date.now(),
      no: newDocNo,
      project: newDocProject,
      type: newDocType,
      status: "Draft",
      owner: user?.name || "Syed Ajazuddin",
      date: new Date().toISOString().split('T')[0]
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
    setActiveTab("documents"); // Jump to documents to see it
    setNewDocNo("");
    setNewDocTitle("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative"
    >
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold uppercase mb-2 tracking-tight">Document & Project Control</h1>
        <p className="text-foreground/60 max-w-3xl">
          A unified platform for document registers, revisions, approvals, archive, incoming/outgoing correspondence, and linking every record to its project, owner and status.
        </p>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-8">
        {/* Left Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface border border-foreground/10 rounded-2xl p-4 sticky top-6">
            <div className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "projects", label: "Projects" },
                { id: "documents", label: "Documents" },
                { id: "archive", label: "Archive" },
                { id: "correspondence", label: "Correspondence" },
                { id: "translation", label: "Translation" },
                { id: "approvals", label: "Approvals", count: documents.filter(d=>d.status==='Pending Approval' || d.status==='Under Review').length },
                { id: "reports", label: "Reports" },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-gold/10 text-gold' : 'hover:bg-foreground/5 text-foreground/70'}`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-foreground/10 pt-6">
              <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-4 px-2">Document Statuses</h4>
              <div className="space-y-3 px-2">
                <div className="flex justify-between text-sm"><span className="text-foreground/70">Draft</span><span className="font-mono font-medium">{documents.filter(d=>d.status==='Draft').length + 245}</span></div>
                <div className="flex justify-between text-sm"><span className="text-foreground/70">Under Review</span><span className="font-mono font-medium">{documents.filter(d=>d.status==='Under Review' || d.status==='Pending Approval').length + 87}</span></div>
                <div className="flex justify-between text-sm"><span className="text-foreground/70 text-emerald-500">Approved</span><span className="font-mono font-medium text-emerald-500">{documents.filter(d=>d.status==='Approved').length + 1256}</span></div>
                <div className="flex justify-between text-sm"><span className="text-foreground/70 text-blue-500">Issued</span><span className="font-mono font-medium text-blue-500">{documents.filter(d=>d.status==='Issued').length + 2345}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-8 min-h-[500px]">
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-surface/50 border border-foreground/10 p-4 rounded-xl">
                  <div className="text-2xl font-display font-bold text-gold mb-1">{18745 + documents.length}</div>
                  <div className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Total Documents</div>
                </div>
                <div className="bg-surface/50 border border-foreground/10 p-4 rounded-xl">
                  <div className="text-2xl font-display font-bold mb-1">24</div>
                  <div className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Active Projects</div>
                </div>
                <div className="bg-surface/50 border border-foreground/10 p-4 rounded-xl">
                  <div className="text-2xl font-display font-bold mb-1">{documents.filter(d=>d.status==='Pending Approval' || d.status==='Under Review').length + 87}</div>
                  <div className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Pending Approval</div>
                </div>
              </div>

              {/* Action Area */}
              <div className="bg-surface border-2 border-dashed border-foreground/20 rounded-xl p-8 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Upload / Create Document</h3>
                <p className="text-sm text-foreground/60 max-w-md mx-auto mb-6">
                  The production system will enforce document numbering, revisions, permissions and workflow.
                </p>
                <button onClick={() => setShowUploadModal(true)} className="bg-gold text-background px-6 py-2.5 rounded-lg font-medium hover:bg-gold/90 transition-colors">
                  New Document Entry
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-xl font-bold border-b border-foreground/10 pb-4">Active Projects</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {["Vision Tower", "Business Complex", "Conference Center", "Road Network", "NEOM Line"].map((prj, i) => (
                  <div key={i} className="bg-surface border border-foreground/10 rounded-xl p-5 hover:border-gold/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg">{prj}</h4>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">ACTIVE</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-foreground/60">
                        <span>Documents</span>
                        <span className="font-medium text-foreground">{documents.filter(d => d.project === prj).length} / 120</span>
                      </div>
                      <div className="w-full bg-foreground/5 rounded-full h-1.5">
                        <div className="bg-gold h-1.5 rounded-full" style={{ width: `${Math.max(10, Math.random() * 80)}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "documents" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center border-b border-foreground/10 pb-4">
                <h3 className="text-xl font-bold">Document Register</h3>
                <button onClick={() => setShowUploadModal(true)} className="bg-gold text-background px-4 py-2 rounded-lg font-medium hover:bg-gold/90 transition-colors text-sm">
                  + Upload Document
                </button>
              </div>

              {/* Search Bar */}
              <div className="bg-surface border border-foreground/10 rounded-xl p-2 flex flex-col md:flex-row gap-2">
                <input 
                  type="text" 
                  placeholder="Search document no..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-background border border-foreground/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gold" 
                />
                <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="bg-background border border-foreground/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gold">
                  <option value="All">All projects</option>
                  <option value="Vision Tower">Vision Tower</option>
                  <option value="Business Complex">Business Complex</option>
                  <option value="Road Network">Road Network</option>
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-background border border-foreground/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gold">
                  <option value="All">All statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Draft">Draft</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Pending Approval">Pending Approval</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-surface border border-foreground/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-foreground/5 text-foreground/60 font-medium">
                      <tr>
                        <th className="px-4 py-3">Document No.</th>
                        <th className="px-4 py-3">Project</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Owner</th>
                        <th className="px-4 py-3">Last Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5">
                      {filteredDocuments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-foreground/50">No documents found matching your filters.</td>
                        </tr>
                      ) : filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-foreground/5 transition-colors group cursor-pointer">
                          <td className="px-4 py-3 font-mono text-gold group-hover:underline">{doc.no}</td>
                          <td className="px-4 py-3 font-medium">{doc.project}</td>
                          <td className="px-4 py-3 text-foreground/70">{doc.type}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              doc.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                              (doc.status === 'Under Review' || doc.status === 'Pending Approval') ? 'bg-amber-500/10 text-amber-500' :
                              doc.status === 'Issued' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-foreground/10 text-foreground/60'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-foreground/70">{doc.owner}</td>
                          <td className="px-4 py-3 font-mono text-xs text-foreground/50">{doc.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "approvals" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-xl font-bold border-b border-foreground/10 pb-4">Pending Approvals</h3>
              <div className="space-y-4">
                {documents.filter(d => d.status === 'Pending Approval' || d.status === 'Under Review').map(doc => (
                  <div key={doc.id} className="bg-surface border border-amber-500/20 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{doc.status}</span>
                        <span className="font-mono text-sm text-foreground/60">{doc.no}</span>
                      </div>
                      <h4 className="font-bold">{doc.project} - {doc.type}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-sm font-medium border border-foreground/20 rounded-lg hover:bg-foreground/5">Review</button>
                      <button className="px-4 py-2 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
        </div>
      </div>

      {/* Upload ModalOverlay */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface border border-foreground/10 p-6 rounded-2xl shadow-2xl w-full max-w-md relative"
            >
              <button 
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold mb-6">New Document Entry</h3>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Document Number</label>
                  <input required value={newDocNo} onChange={e => setNewDocNo(e.target.value)} type="text" placeholder="e.g. VISO-PRJ-001" className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Title</label>
                  <input required value={newDocTitle} onChange={e => setNewDocTitle(e.target.value)} type="text" placeholder="Document Title" className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-gold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Project</label>
                    <select value={newDocProject} onChange={e => setNewDocProject(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-gold">
                      <option>Vision Tower</option>
                      <option>Business Complex</option>
                      <option>Road Network</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Type</label>
                    <select value={newDocType} onChange={e => setNewDocType(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-gold">
                      <option>Report</option>
                      <option>Drawings</option>
                      <option>Specifications</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2 border border-foreground/20 rounded-lg font-medium hover:bg-foreground/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-gold text-background rounded-lg font-medium hover:bg-gold/90 transition-colors">Save Document</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
