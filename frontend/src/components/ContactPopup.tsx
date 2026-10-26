import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactInquiry } from "@/lib/inquiriesApi";

export function ContactPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 15000);

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-contact-popup", handleOpen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("open-contact-popup", handleOpen);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus("submitting");
    setErrorMessage("");
    try {
      await submitContactInquiry({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
      }, 2500);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send. Try /contact or email us directly.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface border border-foreground/10 p-8 rounded-2xl shadow-2xl z-10"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
            >
              ✕
            </button>
            <h2 className="font-display text-3xl mb-2">Get in touch</h2>
            <p className="font-sans text-sm text-foreground/60 mb-6">
              Connect with our lead architects and security consultants to begin your project.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block font-mono text-xs mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-foreground/10 rounded-md p-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block font-mono text-xs mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-foreground/10 rounded-md p-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block font-mono text-xs mb-2">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-background border border-foreground/10 rounded-md p-3 text-sm focus:outline-none focus:border-primary transition-colors h-32 resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              {status === "error" && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
              {status === "success" && (
                <p className="text-sm text-emerald-600">Message sent — we will respond shortly.</p>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-primary hover:bg-gold text-white font-bold tracking-widest uppercase text-xs py-4 rounded-md transition-colors mt-4 disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Submit Request"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
