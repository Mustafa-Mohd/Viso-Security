import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

export type Mode = "login" | "signup" | "forgot" | "verify_otp" | "update_password";

interface EmployeeLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: Mode;
}

export function EmployeeLoginModal({ isOpen, onClose, initialMode = "login" }: EmployeeLoginModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
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
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setErrorMsg("");
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    setLoading(true);
    setMessage("");
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setMessage("A verification OTP code has been sent to your email. Please check your inbox!");
      setMode("verify_otp");
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    try {
      if (mode === "forgot") {
        await handleSendOtp();
        return;
      }

      if (mode === "verify_otp") {
        if (!otp.trim()) {
          throw new Error("Please enter the OTP code sent to your email.");
        }
        if (!password) {
          throw new Error("Please enter a new password.");
        }
        if (password !== confirmPassword) {
          throw new Error("New password and confirm password do not match.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }

        // 1. Verify OTP with Supabase Auth recovery type
        const { error: verifyErr } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: otp.trim(),
          type: "recovery",
        });

        if (verifyErr) {
          throw new Error(verifyErr.message || "Invalid or expired OTP code.");
        }

        // 2. Update user's password
        const { error: updateErr } = await supabase.auth.updateUser({ password });
        if (updateErr) {
          throw new Error(updateErr.message || "Failed to update password.");
        }

        setMessage("Password reset successfully! Redirecting to login...");
        setOtp("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setMode("login");
          setMessage("Password updated! You can now log in with your new password.");
        }, 2000);
        return;
      }

      if (mode === "update_password") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Password updated successfully! You can now log in.");
        setTimeout(() => setMode("login"), 2000);
        return;
      }

      if (mode === "signup") {
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
        return;
      }

      if (mode === "login") {
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
            {mode === "verify_otp" && "Verify OTP & Reset"}
            {mode === "update_password" && "Set New Password"}
          </DialogTitle>
          <DialogDescription className="text-neutral-500 font-sans mt-2 text-base">
            {mode === "login" && "Enter your credentials to access the employee portal."}
            {mode === "signup" && "Sign up to access your employee dashboard."}
            {mode === "forgot" && "Enter your email to receive a password reset OTP code."}
            {mode === "verify_otp" && "Enter the OTP code sent to your email along with your new password."}
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

            {mode === "verify_otp" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="otp" className="text-xs font-bold uppercase tracking-wider text-neutral-500">OTP Code (from Mail)</Label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input 
                    id="otp"
                    type="text" 
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10 h-12 bg-neutral-50/50 border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all font-mono tracking-widest text-lg"
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
                      {(mode === "update_password" || mode === "verify_otp") ? "New Password" : "Password"}
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

                {(mode === "update_password" || mode === "verify_otp") && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-neutral-500">Confirm New Password</Label>
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
                  {mode === "forgot" && "Send Reset OTP"}
                  {mode === "verify_otp" && "Reset & Update Password"}
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
              <div className="flex flex-col gap-2 items-center">
                <button 
                  type="button" 
                  onClick={() => { setMode("verify_otp"); setMessage(""); setErrorMsg(""); }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Already have an OTP code? Enter it here
                </button>
                <button 
                  type="button" 
                  onClick={() => { setMode("login"); setMessage(""); setErrorMsg(""); }}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors mt-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              </div>
            )}

            {mode === "verify_otp" && (
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

