import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hasChosenLang, setAppLanguage, type AppLang } from "@/i18n";

/**
 * First-visit language gate. Later changes still work via TopNav.
 */
export function LanguagePicker() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasChosenLang()) setOpen(true);
  }, []);

  const choose = (lang: AppLang) => {
    setAppLanguage(lang, true);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0c0c0c]/70 backdrop-blur-md p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md border border-white/10 bg-[#111110] text-white p-8 md:p-10 shadow-2xl"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] mb-4">
              VISO Group
            </p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-2">
              Choose your language
            </h2>
            <p className="font-display text-2xl md:text-3xl tracking-tight text-white/70 mb-3" dir="rtl">
              اختر لغتك
            </p>
            <p className="text-sm text-white/45 font-light mb-8 leading-relaxed">
              You can change this anytime from the menu.
              <br />
              <span dir="rtl" className="inline-block mt-1">
                يمكنك تغيير اللغة لاحقًا من القائمة.
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => choose("en")}
                className="rounded-sm border border-white/15 bg-white/5 px-5 py-5 text-left hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors group"
              >
                <span className="block font-display text-xl tracking-tight group-hover:text-[#D4AF37] transition-colors">
                  English
                </span>
                <span className="block mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
                  Continue
                </span>
              </button>
              <button
                type="button"
                onClick={() => choose("ar")}
                className="rounded-sm border border-white/15 bg-white/5 px-5 py-5 text-right hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors group"
                dir="rtl"
              >
                <span className="block font-display text-xl tracking-tight group-hover:text-[#D4AF37] transition-colors">
                  العربية
                </span>
                <span className="block mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
                  متابعة
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
