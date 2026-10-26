import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ArrowLeft, Edit2, Check, X, Upload, Camera } from "lucide-react";
import { fetchLeaveRequests, submitLeaveRequest, type LeaveRequest } from '@/lib/leaveApi';
import { Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export function EmployeeDashboard({ user, supabaseUser }: { user: any, supabaseUser?: any }) {
  const [activeTab, setActiveTab] = useState<"profile" | "documents" | "reports" | "requests">("profile");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editDepartment, setEditDepartment] = useState(user?.department || '');
  const [editJobTitle, setEditJobTitle] = useState(user?.role || '');
  const [editEmergency, setEditEmergency] = useState(user?.emergency_contact || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

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

  const handleProfileSave = async () => {
    if (!supabaseUser) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          phone: editPhone,
          department: editDepartment,
          job_title: editJobTitle,
          emergency_contact: editEmergency
        }
      });
      if (error) throw error;
      alert("Profile updated! Refresh the page to see changes across the app.");
      setIsEditingProfile(false);
      // Force page reload to reflect changes in routing wrapper
      window.location.reload();
    } catch (err: any) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !supabaseUser) return;
    const file = e.target.files[0];
    
    setAvatarUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${supabaseUser.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to supabase storage 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;
      
      alert("Profile picture updated! Refresh the page to see changes.");
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert("Failed to upload image. Note: An Admin must run the SQL to create the 'avatars' bucket first! Error: " + err.message);
    } finally {
      setAvatarUploading(false);
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
            <div className="relative group mb-4">
              <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center border border-foreground/10 overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              {/* Overlay for avatar upload */}
              <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {avatarUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-white mb-1" />
                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload} 
                  disabled={avatarUploading}
                />
              </label>
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
              onClick={async () => {
                const { supabase } = await import("@/lib/supabase");
                await supabase.auth.signOut();
                localStorage.removeItem("viso_emp_logged_in");
                localStorage.removeItem("viso_emp_name");
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
              <div className="flex justify-between items-center border-b border-foreground/10 pb-4">
                <h3 className="text-xl font-bold">Personal Information</h3>
                {!isEditingProfile ? (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 px-3 py-1.5 rounded transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground/50 hover:bg-foreground/5 px-3 py-1.5 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <button 
                      onClick={handleProfileSave}
                      disabled={savingProfile}
                      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                    >
                      {savingProfile ? 'Saving...' : <><Check className="w-3.5 h-3.5" /> Save</>}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1C2541] p-6 rounded border border-foreground/10 shadow-sm">
                  <h4 className="font-bold mb-4 text-primary">Contact & Role</h4>
                  {isEditingProfile ? (
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1">Phone Number</label>
                        <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full bg-background border border-foreground/20 rounded px-3 py-2" placeholder="+966 5X XXX XXXX" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1">Job Title</label>
                        <input type="text" value={editJobTitle} onChange={e => setEditJobTitle(e.target.value)} className="w-full bg-background border border-foreground/20 rounded px-3 py-2" placeholder="e.g. Security Engineer" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1">Department</label>
                        <input type="text" value={editDepartment} onChange={e => setEditDepartment(e.target.value)} className="w-full bg-background border border-foreground/20 rounded px-3 py-2" placeholder="e.g. Operations" />
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-3 text-sm">
                      <li className="flex justify-between border-b border-foreground/5 pb-2"><span className="text-foreground/60">Email</span> <span>{user?.email || 'N/A'}</span></li>
                      <li className="flex justify-between border-b border-foreground/5 pb-2"><span className="text-foreground/60">Phone</span> <span>{user?.phone || 'Not provided'}</span></li>
                      <li className="flex justify-between border-b border-foreground/5 pb-2"><span className="text-foreground/60">Job Title</span> <span className="capitalize">{user?.role?.replace('_', ' ') || 'Not provided'}</span></li>
                      <li className="flex justify-between border-b border-foreground/5 pb-2"><span className="text-foreground/60">Department</span> <span>{user?.department || 'Not provided'}</span></li>
                    </ul>
                  )}
                </div>
                
                <div className="bg-white dark:bg-[#1C2541] p-6 rounded border border-foreground/10 shadow-sm">
                  <h4 className="font-bold mb-4 text-primary">Emergency Contact</h4>
                  {isEditingProfile ? (
                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-1">Emergency Contact Details</label>
                        <textarea 
                          value={editEmergency} 
                          onChange={e => setEditEmergency(e.target.value)} 
                          className="w-full bg-background border border-foreground/20 rounded px-3 py-2 h-24" 
                          placeholder="Name, Relation, Phone Number"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                      {user?.emergency_contact ? (
                        <p className="whitespace-pre-line">{user.emergency_contact}</p>
                      ) : (
                        <p className="text-foreground/50 italic">No emergency contact provided.</p>
                      )}
                    </div>
                  )}
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

              {/* LEAVE BALANCES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 p-4 rounded text-center shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-1">21</div>
                  <div className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider">Annual Leave (Days)</div>
                </div>
                <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 p-4 rounded text-center shadow-sm">
                  <div className="text-3xl font-bold text-emerald-500 mb-1">10</div>
                  <div className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider">Sick Leave (Days)</div>
                </div>
                <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 p-4 rounded text-center shadow-sm">
                  <div className="text-3xl font-bold text-amber-500 mb-1">0</div>
                  <div className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider">Unpaid Leave (Days)</div>
                </div>
                <div className="bg-white dark:bg-[#1C2541] border border-foreground/10 p-4 rounded text-center shadow-sm">
                  <div className="text-3xl font-bold text-purple-500 mb-1">{leaveRequests.filter(r => r.status === 'pending').length}</div>
                  <div className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider">Pending Requests</div>
                </div>
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
