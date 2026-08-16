import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { setAppLanguage, type AppLang } from "@/i18n";

export function TopNav() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAr = i18n.language?.startsWith("ar");

  const toggleLanguage = () => {
    const next: AppLang = isAr ? "en" : "ar";
    setAppLanguage(next, true);
  };

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/security", label: t("nav.security") },
    { to: "/translation", label: t("nav.translation") },
    { to: "/clients", label: t("nav.clients") },
    { to: "/certificates", label: t("nav.certifications") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/career", label: t("nav.careers") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-between px-6 md:px-16 py-3 md:py-4.5 backdrop-blur-md bg-background/80 border-b border-foreground/5 transition-all duration-500">
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png"
              alt="Viso Group"
              className="h-10 md:h-15 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <span className="font-display font-semibold text-lg md:text-xl tracking-wide text-primary hidden sm:inline-block">
              VISO GROUP
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleLanguage}
            className="hidden md:flex font-sans text-sm font-bold tracking-wider text-primary hover:text-gold cursor-pointer transition-colors duration-300"
          >
            {t("nav.lang_toggle")}
          </button>
          <Link
            to="/others"
            className="hidden lg:flex items-center justify-center rounded bg-primary px-6 py-2.5 font-sans text-xs font-semibold tracking-widest text-white hover:bg-secondary transition-all duration-400 hover:scale-[1.03]"
          >
            {t("nav.engage")}
          </Link>
          <button
            type="button"
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-[160]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-foreground transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[140] bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center space-y-8 md:hidden px-6 text-center animate-in fade-in duration-300">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-2xl tracking-wide hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}

          <div className="w-16 h-px bg-foreground/20 my-4" />

          <button
            type="button"
            onClick={() => {
              toggleLanguage();
              setMobileMenuOpen(false);
            }}
            className="font-sans text-sm font-bold tracking-wider text-primary"
          >
            {t("nav.lang_switch")}
          </button>
          <Link
            to="/others"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full max-w-xs rounded bg-primary px-6 py-4 font-sans text-sm font-semibold tracking-widest text-white mt-4 hover:bg-secondary transition-colors text-center"
          >
            {t("nav.engage")}
          </Link>
        </div>
      )}
    </>
  );
}
