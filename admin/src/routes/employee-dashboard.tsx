import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { EmployeeDashboard as EmployeeDashboardComponent } from '@/components/EmployeeDashboard';

export const Route = createFileRoute('/employee-dashboard')({
  component: EmployeeDashboardRoute,
});

function EmployeeDashboardRoute() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not logged in, redirect to home
        navigate({ to: '/' });
        return;
      }

      // We have a session, fetch user details
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Map supabase user to the format expected by EmployeeDashboardComponent
  // or pass it directly.
  const empUser = {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || 'Employee',
    role: user.user_metadata?.job_title || 'Employee',
    department: user.user_metadata?.department || 'Unassigned',
    grade: user.user_metadata?.grade || 'N/A',
    phone: user.user_metadata?.phone || '',
    emergency_contact: user.user_metadata?.emergency_contact || '',
    avatar_url: user.user_metadata?.avatar_url || ''
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#050505] pt-24 px-4 md:px-8 pb-12 transition-colors">
      <div className="max-w-[1400px] mx-auto">
        <EmployeeDashboardComponent user={empUser} supabaseUser={user} />
      </div>
    </div>
  );
}
