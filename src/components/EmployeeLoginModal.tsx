import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, User, Briefcase, ChevronRight } from "lucide-react";

interface EmployeeLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEMO_ROLES = [
  { id: "hr", label: "HR Manager", username: "hr_manager@viso.com", password: "viso_hr_password_2026" },
  { id: "translator", label: "Lead Translator", username: "translator@viso.com", password: "viso_tr_password_2026" },
  { id: "engineer", label: "Security Engineer", username: "engineer@viso.com", password: "viso_sec_password_2026" },
];

export function EmployeeLoginModal({ isOpen, onClose }: EmployeeLoginModalProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    const role = DEMO_ROLES.find(r => r.id === roleId);
    if (role) {
      setUserId(role.username);
      setPassword(role.password);
    } else {
      setUserId("");
      setPassword("");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      onClose();
      navigate({ to: "/admin" });
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 bg-white border-neutral-200 shadow-2xl rounded-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-display font-bold text-neutral-900">Employee Portal</DialogTitle>
          <DialogDescription className="text-neutral-500 font-sans mt-2">
            Sign in to access your VISO workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Quick Access (Demo)</Label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full bg-neutral-50 border-neutral-200 focus:ring-primary h-12">
                  <SelectValue placeholder="Select a role to auto-fill credentials" />
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

            <div className="space-y-2">
              <Label htmlFor="userId" className="text-xs font-bold uppercase tracking-wider text-neutral-500">User ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input 
                  id="userId"
                  type="text" 
                  placeholder="name@viso.com"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="pl-10 h-12 bg-neutral-50 border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-neutral-500">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-neutral-50 border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary font-mono text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading || !userId || !password}
            className="w-full h-12 bg-neutral-900 hover:bg-primary text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-70 group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Access Workspace</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
