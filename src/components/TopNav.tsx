import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function TopNav() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-between px-8 md:px-16 py-6 backdrop-blur-md bg-[#F8F8F6]/80 border-b border-foreground/5 transition-all duration-500">

        {/* Logo - Left */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="https://res.cloudinary.com/dcefror3c/image/upload/v1782911668/Luxurious_black_and_gold_logo_design_kjv4np.png" alt="Viso Group" className="h-10 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
            <span className="font-display font-semibold text-xl tracking-wide text-primary hidden sm:inline-block">VISO GROUP</span>
          </Link>
        </div>

        {/* Links - Center */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-10">
          <Link to="/" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">Home</Link>
          <Link to="/security" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">{t("nav.security")}</Link>
          <Link to="/clients" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">Clients</Link>
          <Link to="/certificates" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">{t("nav.certifications")}</Link>
          <Link to="/gallery" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">Gallery</Link>
          <button onClick={() => window.dispatchEvent(new Event("open-contact-popup"))} className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">Contact</button>
        </div>

        {/* Language & CTA - Right */}
        <div className="flex-1 flex items-center justify-end gap-6">
          <button
            onClick={toggleLanguage}
            className="hidden md:flex font-sans text-sm font-bold tracking-wider text-primary hover:text-gold cursor-pointer transition-colors duration-300"
          >
            {i18n.language === 'en' ? 'العربية' : 'ENGLISH'}
          </button>
          <Link to="/others" className="hidden lg:flex items-center justify-center rounded bg-primary px-6 py-2.5 font-sans text-xs font-semibold tracking-widest text-white hover:bg-secondary transition-all duration-400 hover:scale-[1.03]">
            {t("nav.engage")}
          </Link>
        </div>

      </div>
    </>
  );
}
