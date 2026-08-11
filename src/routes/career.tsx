import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { TopNav } from "@/components/TopNav";
import { useState } from "react";
import { Users, FileText, ChevronRight, Lock, LogOut, ArrowLeft, Download } from "lucide-react";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "VISO | Careers & Secure Access" },
      { name: "description", content: "VISO secure employee and document access portal." },
    ],
  }),
  component: CareerPage,
});

function CareerPage() {
  const [activeView, setActiveView] = useState<"gateway" | "dashboard" | "dms">("gateway");

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <TopNav />
      
      <main className="pt-32 pb-24 relative min-h-screen flex items-center justify-center">
        {/* Background Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10 w-full">
          <AnimatePresence mode="wait">
            {activeView === "gateway" ? (
              <PortalGateway 
                onOpenDashboard={() => setActiveView("dashboard")} 
                onOpenDms={() => setActiveView("dms")} 
              />
            ) : activeView === "dashboard" ? (
              <EmployeeDashboard key="dashboard" onBack={() => setActiveView("gateway")} />
            ) : (
              <DmsDashboard key="dms" onBack={() => setActiveView("gateway")} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function PortalGateway({ onOpenDashboard, onOpenDms }: { onOpenDashboard: () => void, onOpenDms: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
          <Lock className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary uppercase">SECURE ACCESS</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase mb-6 tracking-tight">
          Employee, HR and Document Platforms
        </h1>
        <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
          The public website provides one controlled entry point to internal platforms. Access will be role-based and authenticated in the production environment.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* HR / ESS Card */}
        <div className="bg-surface/50 backdrop-blur-xl border border-foreground/10 rounded-2xl p-8 flex flex-col group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-background border border-foreground/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Users className="w-6 h-6 text-primary" />
            </div>
            
            <div className="text-xs font-bold tracking-widest text-primary uppercase mb-2">HR / ESS</div>
            <h2 className="text-2xl font-display font-bold mb-4">Employee & HR Self-Service</h2>
            <p className="text-foreground/60 mb-8 flex-1 leading-relaxed">
              Employees can view only their own employment file, HR documents, reports, grade, employee number, job title and contract, and submit HR requests.
            </p>
            
            <button 
              onClick={onOpenDashboard}
              className="mt-auto flex items-center justify-between w-full bg-background border border-foreground/10 px-6 py-4 rounded-xl group-hover:border-primary/50 transition-colors"
            >
              <span className="font-medium">Open Employee Portal</span>
              <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* DMS / PMIS Card */}
        <div className="bg-surface/50 backdrop-blur-xl border border-foreground/10 rounded-2xl p-8 flex flex-col group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-background border border-foreground/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <FileText className="w-6 h-6 text-gold" />
            </div>
            
            <div className="text-xs font-bold tracking-widest text-gold uppercase mb-2">DMS / PMIS</div>
            <h2 className="text-2xl font-display font-bold mb-4">Document & Project Control</h2>
            <p className="text-foreground/60 mb-8 flex-1 leading-relaxed">
              Document registers, project tracking, incoming/outgoing correspondence, revisions, approvals, archiving and controlled access by role.
            </p>
            
            <button 
              onClick={onOpenDms}
              className="mt-auto flex items-center justify-between w-full bg-background border border-foreground/10 px-6 py-4 rounded-xl group-hover:border-gold/50 transition-colors"
            >
              <span className="font-medium">Open Document Platform</span>
              <ChevronRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DmsDashboard({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-12 border-b border-foreground/10 pb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold uppercase mb-2 tracking-tight">DMS / PMIS PLATFORM</h1>
          <h2 className="text-xl md:text-2xl text-gold font-medium mb-4">Document & Project Control</h2>
          <p className="text-foreground/60 max-w-2xl bg-gold/5 p-4 rounded-lg border border-gold/10">
            Secure document registers, project tracking, and controlled access repository.
          </p>
        </div>
        
        <div className="bg-surface border border-foreground/10 p-4 rounded-xl min-w-[250px]">
          <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Active Project</label>
          <select className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-gold">
            <option>NEOM Line Security - Phase 1</option>
            <option>Qiddiya Access Control</option>
            <option>Aramco Perimeter Upgrade</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface/50 border border-foreground/10 p-6 rounded-xl">
          <div className="text-3xl font-display font-bold text-gold mb-1">12</div>
          <div className="text-sm font-medium text-foreground/60">Pending Approvals</div>
        </div>
        <div className="bg-surface/50 border border-foreground/10 p-6 rounded-xl">
          <div className="text-3xl font-display font-bold mb-1">45</div>
          <div className="text-sm font-medium text-foreground/60">Recent Revisions</div>
        </div>
        <div className="bg-surface/50 border border-foreground/10 p-6 rounded-xl">
          <div className="text-3xl font-display font-bold mb-1">3</div>
          <div className="text-sm font-medium text-foreground/60">Active Projects</div>
        </div>
      </div>

      <div className="bg-surface border border-foreground/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-foreground/10 flex justify-between items-center bg-background">
          <h3 className="font-bold text-lg">Document Register</h3>
          <button className="bg-gold text-background px-4 py-2 rounded-lg font-medium hover:bg-gold/90 transition-colors text-sm">
            + New Transmittal
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/5 text-foreground/60 font-medium">
              <tr>
                <th className="px-6 py-4">Document No.</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Rev</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {[
                { no: "VISO-NM-SEC-001", title: "CCTV Concept Layout", rev: "02", status: "Approved", date: "Oct 12, 2025" },
                { no: "VISO-NM-SEC-004", title: "Access Control Matrix", rev: "01", status: "Issued for Review", date: "Oct 10, 2025" },
                { no: "VISO-QA-RPT-012", title: "Site Security Audit", rev: "00", status: "Pending Approval", date: "Oct 08, 2025" },
                { no: "VISO-AR-DRW-045", title: "Perimeter Gate Details", rev: "03", status: "Approved", date: "Sep 28, 2025" },
              ].map((doc, i) => (
                <tr key={i} className="hover:bg-foreground/5 transition-colors group">
                  <td className="px-6 py-4 font-mono">{doc.no}</td>
                  <td className="px-6 py-4 font-medium">{doc.title}</td>
                  <td className="px-6 py-4">{doc.rev}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doc.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      doc.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/60">{doc.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gold hover:underline font-medium opacity-0 group-hover:opacity-100 transition-opacity">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function EmployeeDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"documents" | "reports" | "requests">("documents");
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* Dashboard Header Navigation */}
      <div className="flex items-center justify-between mb-12 border-b border-foreground/10 pb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold uppercase mb-2 tracking-tight">EMPLOYEE SELF-SERVICE</h1>
        <h2 className="text-xl md:text-2xl text-primary font-medium mb-4">My Employee File</h2>
        <p className="text-foreground/60 max-w-2xl bg-primary/5 p-4 rounded-lg border border-primary/10">
          Prototype workspace managed by HR where each employee can view only their own file, documents, reports and requests.
        </p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* Left Sidebar Profile */}
        <div className="bg-surface border border-foreground/10 rounded-2xl p-6 h-fit sticky top-32">
          <div className="flex flex-col items-center text-center border-b border-foreground/10 pb-6 mb-6">
            <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center mb-4 border border-foreground/10">
              <span className="text-3xl">👤</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Ahmed Alotaibi</h3>
            <p className="text-sm text-primary font-medium">Document Controller</p>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Employee No.</span>
              <span className="font-mono font-medium">VISO-0246</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Grade</span>
              <span className="font-medium">G7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Department</span>
              <span className="font-medium">Projects</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <button 
              onClick={() => setActiveTab("documents")}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'documents' ? 'bg-primary/10 text-primary' : 'hover:bg-foreground/5 text-foreground/70'}`}
            >
              My Documents
            </button>
            <button 
              onClick={() => setActiveTab("reports")}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'reports' ? 'bg-primary/10 text-primary' : 'hover:bg-foreground/5 text-foreground/70'}`}
            >
              My Reports
            </button>
            <button 
              onClick={() => setActiveTab("requests")}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'requests' ? 'bg-primary/10 text-primary' : 'hover:bg-foreground/5 text-foreground/70'}`}
            >
              HR Requests
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="space-y-8">
          {activeTab === 'documents' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h3 className="text-xl font-bold border-b border-foreground/10 pb-4">Employment Profile</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Document Card 1 */}
                <div className="bg-background border border-foreground/10 rounded-xl p-6 group hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2">Employment Contract</h4>
                  <p className="text-sm text-foreground/50 font-mono mb-6">PDF · 2026</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-surface border border-foreground/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <Download className="w-4 h-4" /> View
                  </button>
                </div>

                {/* Document Card 2 */}
                <div className="bg-background border border-foreground/10 rounded-xl p-6 group hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2">Job Description</h4>
                  <p className="text-sm text-foreground/50 font-mono mb-6">PDF · Current</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-surface border border-foreground/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <Download className="w-4 h-4" /> View
                  </button>
                </div>

                {/* Document Card 3 */}
                <div className="bg-background border border-foreground/10 rounded-xl p-6 group hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2">Annual Performance Review</h4>
                  <p className="text-sm text-foreground/50 font-mono mb-6">2025</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-surface border border-foreground/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <Download className="w-4 h-4" /> View
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex justify-between items-center border-b border-foreground/10 pb-4">
                <h3 className="text-xl font-bold">My Reports</h3>
                <button className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">+ Submit Report</button>
              </div>
              <div className="bg-surface border border-foreground/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-foreground/5 text-foreground/60 font-medium">
                    <tr>
                      <th className="px-6 py-4">Report Type</th>
                      <th className="px-6 py-4">Date Submitted</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {[
                      { type: "Weekly Timesheet (W42)", date: "Oct 15, 2025", status: "Approved" },
                      { type: "Monthly Security Audit", date: "Oct 01, 2025", status: "Under Review" },
                      { type: "HSE Incident Log", date: "Sep 28, 2025", status: "Closed" },
                    ].map((report, i) => (
                      <tr key={i} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-6 py-4 font-medium">{report.type}</td>
                        <td className="px-6 py-4 text-foreground/60">{report.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === 'Approved' || report.status === 'Closed' ? 'bg-emerald-500/10 text-emerald-500' :
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-primary hover:underline font-medium">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'requests' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex justify-between items-center border-b border-foreground/10 pb-4">
                <h3 className="text-xl font-bold">HR Requests</h3>
                <button className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">+ New Request</button>
              </div>

              <div className="bg-surface border border-foreground/10 p-6 rounded-xl mb-8">
                <h4 className="font-bold mb-4">Quick Request Form</h4>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Request Type</label>
                      <select className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-primary">
                        <option>Annual Leave</option>
                        <option>Expense Claim</option>
                        <option>Salary Certificate</option>
                        <option>IT Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Date Required</label>
                      <input type="date" className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Additional Details</label>
                    <textarea rows={3} className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-primary" placeholder="Provide any necessary context..."></textarea>
                  </div>
                  <button type="submit" className="bg-primary text-primary-foreground font-medium px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">Submit to HR</button>
                </form>
              </div>

              <h4 className="font-bold mb-4">Recent Requests</h4>
              <div className="bg-surface border border-foreground/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-foreground/5 text-foreground/60 font-medium">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {[
                      { id: "REQ-1029", type: "Annual Leave (Dec)", status: "Approved" },
                      { id: "REQ-0994", type: "Expense Claim (Travel)", status: "Paid" },
                    ].map((req, i) => (
                      <tr key={i} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-foreground/60">{req.id}</td>
                        <td className="px-6 py-4 font-medium">{req.type}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-primary hover:underline font-medium">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
