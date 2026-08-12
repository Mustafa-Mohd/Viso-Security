import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";

export function TopNav() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-between px-6 md:px-16 py-4 md:py-6 backdrop-blur-md bg-background/80 border-b border-foreground/5 transition-all duration-500">
        {/* Logo - Left */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="https://res.cloudinary.com/dcefror3c/image/upload/v1782911668/Luxurious_black_and_gold_logo_design_kjv4np.png" alt="Viso Group" className="h-8 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
            <span className="font-display font-semibold text-lg md:text-xl tracking-wide text-primary hidden sm:inline-block">VISO GROUP</span>
          </Link>
        </div>

        {/* Links - Center */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-10">
          <Link to="/" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">Home</Link>
          <Link to="/about" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">About</Link>
          <Link to="/security" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">{t("nav.security")}</Link>
          <Link to="/clients" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">Clients</Link>
          <Link to="/certificates" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">{t("nav.certifications")}</Link>
          <Link to="/gallery" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">Gallery</Link>
          <Link to="/career" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">Careers</Link>
          <Link to="/contact" className="font-sans text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors duration-300">Contact</Link>
        </div>

        {/* Language & CTA & Theme - Right */}
        <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">
          <ThemeToggle />
          <button
            onClick={toggleLanguage}
            className="hidden md:flex font-sans text-sm font-bold tracking-wider text-primary hover:text-gold cursor-pointer transition-colors duration-300"
          >
            {i18n.language === 'en' ? 'العربية' : 'ENGLISH'}
          </button>
          <Link to="/others" className="hidden lg:flex items-center justify-center rounded bg-primary px-6 py-2.5 font-sans text-xs font-semibold tracking-widest text-white hover:bg-secondary transition-all duration-400 hover:scale-[1.03]">
            {t("nav.engage")}
          </Link>
          <button 
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-[160]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-foreground transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[140] bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center space-y-8 md:hidden px-6 text-center animate-in fade-in duration-300">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide hover:text-primary transition-colors">Home</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide hover:text-primary transition-colors">About</Link>
          <Link to="/security" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide hover:text-primary transition-colors">{t("nav.security")}</Link>
          <Link to="/clients" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide hover:text-primary transition-colors">Clients</Link>
          <Link to="/certificates" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide hover:text-primary transition-colors">{t("nav.certifications")}</Link>
          <Link to="/gallery" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide hover:text-primary transition-colors">Gallery</Link>
          <Link to="/career" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide hover:text-primary transition-colors">Careers</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="font-display text-2xl tracking-wide hover:text-primary transition-colors">Contact</Link>
          
          <div className="w-16 h-px bg-foreground/20 my-4"></div>
          
          <button onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }} className="font-sans text-sm font-bold tracking-wider text-primary">
            {i18n.language === 'en' ? 'Switch to العربية' : 'Switch to ENGLISH'}
          </button>
          <Link to="/others" onClick={() => setMobileMenuOpen(false)} className="w-full max-w-xs rounded bg-primary px-6 py-4 font-sans text-sm font-semibold tracking-widest text-white mt-4 hover:bg-secondary transition-colors text-center">
            {t("nav.engage")}
          </Link>
        </div>
      )}
    </>
  );
}
