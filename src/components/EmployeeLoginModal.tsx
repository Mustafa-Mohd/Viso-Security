import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export type Mode = "login" | "signup" | "forgot" | "update_password";

interface EmployeeLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: Mode;
}

export function EmployeeLoginModal({ isOpen, onClose, initialMode = "login" }: EmployeeLoginModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleReset = () => {
    setMode("login");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    try {
      if (mode === "update_password") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Password updated successfully! You can now log in.");
        setTimeout(() => setMode("login"), 2000);
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage("Password reset instructions have been sent to your email.");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        setMessage("Account created successfully! You can now log in.");
        setTimeout(() => setMode("login"), 2000);
      } else if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        const name = data.user?.user_metadata?.full_name || email.split('@')[0];
        
        localStorage.setItem("viso_emp_logged_in", "true");
        localStorage.setItem("viso_emp_name", name);
        
        handleReset();
        onClose();
        navigate({ to: "/employee-dashboard" });
      }
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setTimeout(handleReset, 300); // reset state after animation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-8 bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-3xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-display font-bold text-neutral-900 tracking-tight">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Reset Password"}
            {mode === "update_password" && "Set New Password"}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 font-sans mt-2 text-base">
            {mode === "login" && "Enter your credentials to access the employee portal."}
            {mode === "signup" && "Sign up to access your employee dashboard."}
            {mode === "forgot" && "Enter your email to receive a password reset link."}
            {mode === "update_password" && "Enter your new password below."}
          </DialogDescription>
        </DialogHeader>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
            {message}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-neutral-500">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input 
                    id="fullName"
                    type="text" 
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12 bg-neutral-50/50 border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {mode !== "update_password" && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-neutral-50/50 border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {mode !== "forgot" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      {mode === "update_password" ? "New Password" : "Password"}
                    </Label>
                    {mode === "login" && (
                      <button 
                        type="button" 
                        onClick={() => { setMode("forgot"); setMessage(""); setErrorMsg(""); }}
                        className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input 
                      id="password"
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 bg-neutral-50/50 border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all"
                      required
                    />
                  </div>
                </div>

                {mode === "update_password" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-neutral-500">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input 
                        id="confirmPassword"
                        type="password" 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-12 bg-neutral-50/50 border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-neutral-900 hover:bg-primary text-white font-bold tracking-wide rounded-xl transition-all disabled:opacity-70 group shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>
                  {mode === "login" && "Sign In"}
                  {mode === "signup" && "Create Account"}
                  {mode === "forgot" && "Send Reset Link"}
                  {mode === "update_password" && "Update Password"}
                </span>
                {mode !== "forgot" && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </div>
            )}
          </Button>
          
          <div className="pt-2 text-center">
            {mode === "login" && (
              <p className="text-sm text-neutral-500">
                Don't have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => { setMode("signup"); setMessage(""); setErrorMsg(""); }}
                  className="font-semibold text-neutral-900 hover:text-primary transition-colors hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
            
            {mode === "signup" && (
              <p className="text-sm text-neutral-500">
                Already have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => { setMode("login"); setMessage(""); setErrorMsg(""); }}
                  className="font-semibold text-neutral-900 hover:text-primary transition-colors hover:underline"
                >
                  Log in
                </button>
              </p>
            )}

            {mode === "forgot" && (
              <button 
                type="button" 
                onClick={() => { setMode("login"); setMessage(""); setErrorMsg(""); }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
