import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { fetchLeaveRequests, submitLeaveRequest, type LeaveRequest } from '@/lib/leaveApi';
import { Link } from "@tanstack/react-router";

export function EmployeeDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<"profile" | "documents" | "reports" | "requests">("profile");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === 'requests') {
      loadRequests();
    }
  }, [activeTab, user?.id]);

  const loadRequests = async () => {
    setLoadingLeaves(true);
    try {
      const data = await fetchLeaveRequests(user?.id || 'demo-emp-001');
      setLeaveRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeaves(false);
    }
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitLeaveRequest({
        employee_id: user?.id || 'demo-emp-001',
        employee_name: user?.name || 'Demo Employee',
        start_date: startDate,
        end_date: endDate,
        reason: `[${leaveType}] ${reason}`
      });
      setStartDate('');
      setEndDate('');
      setReason('');
      await loadRequests();
    } catch (err) {
      alert("Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="mb-12 relative">
        <Link to="/" className="hidden md:flex absolute right-0 top-2 items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/50 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold uppercase mb-2 tracking-tight">EMPLOYEE SELF-SERVICE</h1>
        <h2 className="text-xl md:text-2xl text-primary font-medium mb-4">My Employee File</h2>
        <p className="text-foreground/60 max-w-2xl bg-primary/5 p-4 rounded-lg border border-primary/10">
          Prototype workspace managed by HR where each employee can view only their own file, documents, reports and requests.
        </p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* Left Sidebar Profile */}
        <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded p-6 h-fit sticky top-6">
          <div className="flex flex-col items-center text-center border-b border-foreground/10 pb-6 mb-6">
            <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center mb-4 border border-foreground/10">
              <span className="text-3xl">👤</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold capitalize">{user?.name || "Employee"}</p>
              <p className="text-xs text-primary capitalize">{user?.role?.replace('_', ' ') || "Employee"}</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Employee No.</span>
              <span className="font-mono font-medium">{user?.id?.substring(0,8) || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Grade</span>
              <span className="font-medium">{user?.grade || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Department</span>
              <span className="font-medium">{user?.department || "N/A"}</span>
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
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-foreground/5 text-foreground/70'}`}
            >
              My Profile
            </button>
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

          <div className="mt-12 border-t border-foreground/10 pt-4">
            <button 
              onClick={() => {
                localStorage.removeItem("viso_emp_logged_in");
                window.location.href = "/";
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg font-bold text-red-500 hover:bg-red-500/10 transition-colors uppercase text-xs tracking-wider"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="space-y-8">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h3 className="text-xl font-bold border-b border-foreground/10 pb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1C2541] p-6 rounded border border-foreground/10 shadow-sm">
                  <h4 className="font-bold mb-4 text-primary">Contact Details</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-foreground/5 pb-2"><span className="text-foreground/60">Email</span> <span>{user?.name?.toLowerCase().replace(' ', '.')}@viso.com</span></li>
                    <li className="flex justify-between border-b border-foreground/5 pb-2"><span className="text-foreground/60">Phone</span> <span>+966 50 123 4567</span></li>
                    <li className="flex justify-between border-b border-foreground/5 pb-2"><span className="text-foreground/60">Location</span> <span>Riyadh HQ</span></li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-[#1C2541] p-6 rounded border border-foreground/10 shadow-sm">
                  <h4 className="font-bold mb-4 text-primary">Emergency Contact</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-foreground/5 pb-2"><span className="text-foreground/60">Name</span> <span>Ahmed Al-Farsi</span></li>
                    <li className="flex justify-between border-b border-foreground/5 pb-2"><span className="text-foreground/60">Relation</span> <span>Brother</span></li>
                    <li className="flex justify-between border-b border-foreground/5 pb-2"><span className="text-foreground/60">Phone</span> <span>+966 55 987 6543</span></li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold border-b border-foreground/10 pb-4 pt-4">Skills & Certifications</h3>
              <div className="bg-white dark:bg-[#1C2541] p-6 rounded border border-foreground/10 shadow-sm">
                 <div className="flex flex-wrap gap-3">
                   <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-wider">HCIS Certified</span>
                   <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-wider">Risk Assessment</span>
                   <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-wider">First Aid</span>
                   <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-wider">Project Management</span>
                   <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-wider">ISO 27001 Lead Auditor</span>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h3 className="text-xl font-bold border-b border-foreground/10 pb-4">Employment Profile</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Document Card 1 */}
                <div className="bg-background border border-foreground/10 rounded p-6 group hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2">Employment Contract</h4>
                  <p className="text-sm text-foreground/50 font-mono mb-6">PDF · 2026</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-[#1C2541] border border-foreground/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <Download className="w-4 h-4" /> View
                  </button>
                </div>

                {/* Document Card 2 */}
                <div className="bg-background border border-foreground/10 rounded p-6 group hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2">Job Description</h4>
                  <p className="text-sm text-foreground/50 font-mono mb-6">PDF · Current</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-[#1C2541] border border-foreground/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <Download className="w-4 h-4" /> View
                  </button>
                </div>

                {/* Document Card 3 */}
                <div className="bg-background border border-foreground/10 rounded p-6 group hover:border-primary/30 transition-colors shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2">Annual Performance Review</h4>
                  <p className="text-sm text-foreground/50 font-mono mb-6">2025</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-[#1C2541] border border-foreground/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all">
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
              <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded overflow-hidden">
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
                <h3 className="text-xl font-bold">HR Requests (Leave & Permissions)</h3>
              </div>

              <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 p-6 rounded mb-8">
                <h4 className="font-bold mb-4">New Leave Request</h4>
                <form className="space-y-4" onSubmit={handleLeaveSubmit}>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Leave Type</label>
                      <select required value={leaveType} onChange={e => setLeaveType(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-primary">
                        <option>Annual Leave</option>
                        <option>Sick Leave</option>
                        <option>Unpaid Leave</option>
                        <option>Other Permission</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Start Date</label>
                      <input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">End Date</label>
                      <input required type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">Reason</label>
                    <textarea required rows={3} value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:border-primary" placeholder="Provide any necessary context..."></textarea>
                  </div>
                  <button type="submit" disabled={submitting} className="bg-primary text-primary-foreground font-medium px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </div>

              <h4 className="font-bold mb-4">My Requests History</h4>
              <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 rounded overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-foreground/5 text-foreground/60 font-medium">
                    <tr>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Reason / Type</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {loadingLeaves ? (
                      <tr><td colSpan={3} className="px-6 py-4 text-center text-foreground/50">Loading...</td></tr>
                    ) : leaveRequests.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-4 text-center text-foreground/50">No leave requests found.</td></tr>
                    ) : leaveRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-foreground/60 text-xs">
                          {req.start_date} <br/>to<br/> {req.end_date}
                        </td>
                        <td className="px-6 py-4 font-medium">{req.reason}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                            req.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {req.status}
                          </span>
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
