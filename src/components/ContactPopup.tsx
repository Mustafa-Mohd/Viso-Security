import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open automatically after 15 seconds
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
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors"
            >
              ✕
            </button>
            <h2 className="font-display text-3xl mb-2">Get in touch</h2>
            <p className="font-sans text-sm text-foreground/60 mb-6">
              Connect with our lead architects and security consultants to begin your project.
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block font-mono text-xs mb-2">Name</label>
                <input type="text" className="w-full bg-background border border-foreground/10 rounded-md p-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block font-mono text-xs mb-2">Email</label>
                <input type="email" className="w-full bg-background border border-foreground/10 rounded-md p-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block font-mono text-xs mb-2">Message</label>
                <textarea className="w-full bg-background border border-foreground/10 rounded-md p-3 text-sm focus:outline-none focus:border-primary transition-colors h-32 resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full bg-primary hover:bg-gold text-white font-bold tracking-widest uppercase text-xs py-4 rounded-md transition-colors mt-4">
                Submit Request
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
