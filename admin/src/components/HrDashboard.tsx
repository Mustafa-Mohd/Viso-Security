import { useState, useEffect } from "react";
import { fetchLeaveRequests, updateLeaveRequestStatus, type LeaveRequest } from '@/lib/leaveApi';
import { format } from "date-fns";

export function HrDashboard() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaveRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateLeaveRequestStatus(id, status);
      await loadRequests();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl mb-2">HR & Leave Management</h1>
          <p className="text-foreground/60">Review and approve employee leave requests.</p>
        </div>
        <button onClick={loadRequests} className="text-primary hover:underline text-sm font-medium">Refresh</button>
      </div>

      <div className="bg-background border border-foreground/10 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-foreground/60 font-medium">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Leave Dates</th>
              <th className="px-6 py-4">Reason / Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground/50">Loading requests...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground/50">No leave requests found.</td></tr>
            ) : requests.map((req) => (
              <tr key={req.id} className="hover:bg-foreground/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold">{req.employee_name}</div>
                  <div className="text-xs text-foreground/50 font-mono">{req.employee_id}</div>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-foreground/60">
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
                <td className="px-6 py-4 text-right">
                  {req.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleUpdate(req.id, 'approved')} className="text-xs font-medium bg-emerald-500 text-white px-3 py-1.5 rounded hover:bg-emerald-600 transition-colors">Approve</button>
                      <button onClick={() => handleUpdate(req.id, 'rejected')} className="text-xs font-medium bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors">Reject</button>
                    </div>
                  ) : (
                    <span className="text-xs text-foreground/40 font-medium italic">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
