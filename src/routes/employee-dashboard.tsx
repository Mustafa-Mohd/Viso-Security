import { createFileRoute } from '@tanstack/react-router';
import { EmployeeDashboard as EmployeeDashboardComponent } from '@/components/EmployeeDashboard';

export const Route = createFileRoute('/employee-dashboard')({
  component: EmployeeDashboardRoute,
});

function EmployeeDashboardRoute() {
  const demoUser = {
    id: 'emp-123',
    name: 'Demo Employee',
    role: 'engineer',
    department: 'IT',
    grade: 'L3'
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 px-4 md:px-8 pb-12">
      <div className="max-w-[1400px] mx-auto">
        <EmployeeDashboardComponent user={demoUser} />
      </div>
    </div>
  );
}
