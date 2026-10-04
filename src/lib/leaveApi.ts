import { supabase } from "./supabase";

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export async function fetchLeaveRequests(employeeId?: string) {
  let query = supabase
    .from('leave_requests')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (employeeId) {
    query = query.eq('employee_id', employeeId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching leave requests from Supabase. Falling back to mock data.", error);
    // Mock fallback if table doesn't exist
    const mockStr = localStorage.getItem('mock_leave_requests');
    if (mockStr) return JSON.parse(mockStr) as LeaveRequest[];
    return [];
  }
  
  return data as LeaveRequest[];
}

export async function submitLeaveRequest(request: Omit<LeaveRequest, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('leave_requests')
    .insert([{
      ...request,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) {
    console.error("Error submitting leave request to Supabase. Using mock data.", error);
    // Mock fallback
    const mockStr = localStorage.getItem('mock_leave_requests');
    const existing = mockStr ? JSON.parse(mockStr) : [];
    const newReq = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    localStorage.setItem('mock_leave_requests', JSON.stringify([newReq, ...existing]));
    return newReq;
  }
  
  return data as LeaveRequest;
}

export async function updateLeaveRequestStatus(id: string, status: 'approved' | 'rejected') {
  const { error } = await supabase
    .from('leave_requests')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Error updating leave request in Supabase. Using mock data.", error);
    // Mock fallback
    const mockStr = localStorage.getItem('mock_leave_requests');
    if (mockStr) {
      const existing = JSON.parse(mockStr) as LeaveRequest[];
      const updated = existing.map(req => req.id === id ? { ...req, status } : req);
      localStorage.setItem('mock_leave_requests', JSON.stringify(updated));
    }
    return;
  }
}
