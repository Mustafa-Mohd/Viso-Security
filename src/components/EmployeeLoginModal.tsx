import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Briefcase, ChevronRight } from "lucide-react";

interface EmployeeLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEMO_ROLES = [
  { id: "employee1", label: "Employee 1" },
  { id: "employee2", label: "Employee 2" },
  { id: "employee3", label: "Employee 3" },
];

export function EmployeeLoginModal({ isOpen, onClose }: EmployeeLoginModalProps) {
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("viso_emp_logged_in", "true");
      if (fullName) {
        localStorage.setItem("viso_emp_name", fullName);
      }
      onClose();
      navigate({ to: "/employee-dashboard" });
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 bg-white border-neutral-200 shadow-2xl rounded-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-display font-bold text-neutral-900">Employee Portal</DialogTitle>
          <DialogDescription className="text-neutral-500 font-sans mt-2">
            Select your employee profile and enter your full name to access the dashboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Select Role</Label>
              <Select value={selectedRole} onValueChange={handleRoleChange} required>
                <SelectTrigger className="w-full bg-neutral-50 border-neutral-200 focus:ring-primary h-12">
                  <SelectValue placeholder="Select an employee profile" />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_ROLES.map(role => (
                    <SelectItem key={role.id} value={role.id} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>{role.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRole && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-neutral-500">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input 
                    id="fullName"
                    type="text" 
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12 bg-neutral-50 border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <Button 
            type="submit"
            disabled={loading || !selectedRole || !fullName}
            className="w-full h-12 bg-neutral-900 hover:bg-primary text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-70 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Access Dashboard</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
