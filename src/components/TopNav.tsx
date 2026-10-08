import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/TypewriterText";
import { setAppLanguage, type AppLang } from "@/i18n";
import { cn } from "@/lib/utils";
import { EmployeeLoginModal, type Mode } from "@/components/EmployeeLoginModal";
import { supabase } from "@/lib/supabase";

function ShiningSwordLine() {
  return <div className="h-0.5 w-full bg-gradient-to-r from-primary via-gold to-primary/50 rounded-full my-1" />;
}

type NavLink = { to: string; label: string };

type NavGroup = {
  id: string;
  label: string;
  items: NavLink[];
};

function navItemClass(active: boolean) {
  return cn(
    "relative inline-flex items-center gap-1 px-1.5 lg:px-2 xl:px-2.5 py-1.5 font-sans text-[10px] xl:text-[11px] font-bold tracking-[0.06em] xl:tracking-[0.08em] uppercase whitespace-nowrap transition-all duration-300 rounded-md",
    active
      ? "text-primary"
      : "text-black hover:text-primary hover:bg-black/[0.05]",
  );
}

function NavDropdown({
  group,
  isActive,
}: {
  group: NavGroup;
  isActive: (to: string) => boolean;
}) {
  const groupActive = group.items.some((item) => isActive(item.to));

  return (
    <div className="relative group/nav">
      <button
        type="button"
        className={cn(navItemClass(groupActive), "cursor-default")}
        aria-haspopup="true"
        aria-expanded={undefined}
      >
        {group.label}
        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 text-black opacity-90 transition-transform duration-300 group-hover/nav:rotate-180 group-hover/nav:text-primary"
          aria-hidden
        />
      </button>

      <div
        className="absolute top-full pt-2 opacity-0 invisible translate-y-1 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-focus-within/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 transition-all duration-200 z-[200] min-w-[220px]"
        style={{ insetInlineStart: 0 }}
      >
        <div className="rounded-md border border-black/10 bg-white/98 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.14)] overflow-hidden">
          <ul className="py-1.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 font-sans text-sm tracking-wide transition-colors border-s-2 border-transparent",
                    isActive(item.to)
                      ? "text-primary font-bold"
                      : "text-black font-semibold hover:bg-black/[0.04] hover:text-primary hover:border-primary/40",
                  )}
                  aria-current={isActive(item.to) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function TopNav() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<Mode>("login");
  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("viso_emp_logged_in") === "true");
    
    // Listen for password recovery
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setAuthMode("update_password");
        setIsLoginModalOpen(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAr = i18n.language?.startsWith("ar");

  const toggleLanguage = () => {
    setIsLanguageSwitching(true);
    setTimeout(() => {
      const next: AppLang = isAr ? "en" : "ar";
      setAppLanguage(next, true);
      setIsLanguageSwitching(false);
    }, 2000);
  };

  const pathname = useRouterState({ select: (s) => s.location.pathname });


  const joinTeamGroup: NavGroup = {
    id: "join_team",
    label: t("nav.join_team"),
    items: [
      { to: "/career", label: t("nav.careers") },
      { to: "/gallery", label: t("nav.gallery") },
    ],
  };

  const securityGroup: NavGroup = {
    id: "security_consultancy",
    label: t("nav.security"),
    items: [
      { to: "/security", label: t("nav.overview", "Overview") },
      { to: "/clients", label: t("nav.clients", "Clients") },
    ],
  };

  const projectsGroup: NavGroup = {
    id: "projects_menu",
    label: t("nav.group_impact", "Projects"),
    items: [
      { to: "/projects", label: "Consultancy" },
      { to: "/supervision", label: "Supervision" },
    ],
  };

  const isActivePath = (to: string) => {
    if (to === "/") return pathname === "/";
    if (to === "/regulatory") {
      return pathname === "/regulatory" || pathname === "/regulatory/";
    }
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const mobileNavClass = (to: string) =>
    isActivePath(to)
      ? "font-display text-xl tracking-wide text-primary font-bold border-s-4 border-primary ps-3"
      : "font-display text-xl tracking-wide text-black font-bold hover:text-primary transition-colors ps-3 border-s-4 border-transparent";

  const toggleMobileGroup = (id: string) => {
    setMobileExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {isLanguageSwitching && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-300">
          <img 
            src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png" 
            alt="VISO Logo" 
            className="h-16 md:h-24 w-auto object-contain animate-pulse drop-shadow-[0_10px_30px_rgba(212,175,55,0.3)] mb-4 md:mb-6 px-4"
          />
          <div className="font-mono text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-primary animate-pulse text-center px-4">
            {isAr ? "Switching to English..." : "جاري التبديل إلى العربية..."}
          </div>
        </div>
      )}
      <header
        className="fixed top-0 left-0 right-0 z-[150] bg-background/90 backdrop-blur-md border-b border-primary/15"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 xl:px-12">
          <div className="flex items-center gap-2 md:gap-4 lg:gap-6 h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
              <img loading="lazy" decoding="async"
                src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png"
                alt="Viso Group"
                className="h-9 sm:h-11 md:h-13 lg:h-16 w-auto object-contain shrink-0 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="flex flex-col justify-center min-w-0 me-1 sm:me-2 lg:me-3 xl:me-6 border-s border-foreground/20 ps-2.5 sm:ps-3.5 py-0.5 font-brand-condensed">
                <span className="text-foreground font-brand-condensed font-semibold text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] tracking-[0.08em] uppercase whitespace-nowrap leading-tight">
                  {t("about_page.vision_for")}
                </span>
                <ShiningSwordLine />
                <span className="text-primary font-brand-condensed font-semibold text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] tracking-[0.06em] uppercase whitespace-nowrap leading-tight">
                  <TypewriterText phrases={[t("about_page.sec_consult"), t("about_page.trans_services")]} />
                </span>
              </div>
            </Link>

            <nav
              className="hidden lg:flex flex-1 items-center justify-end gap-0.5 min-w-0"
              aria-label="Main"
            >
              <Link
                to="/"
                className={navItemClass(isActivePath("/"))}
                aria-current={isActivePath("/") ? "page" : undefined}
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/about"
                className={navItemClass(isActivePath("/about"))}
                aria-current={isActivePath("/about") ? "page" : undefined}
              >
                {t("nav.about")}
              </Link>
              <NavDropdown key={securityGroup.id} group={securityGroup} isActive={isActivePath} />
              <Link
                to="/translation"
                className={navItemClass(isActivePath("/translation"))}
                aria-current={isActivePath("/translation") ? "page" : undefined}
              >
                {t("nav.translation")}
              </Link>

              <NavDropdown key={projectsGroup.id} group={projectsGroup} isActive={isActivePath} />
              
              <NavDropdown key={joinTeamGroup.id} group={joinTeamGroup} isActive={isActivePath} />

              <Link
                to="/contact"
                className={navItemClass(isActivePath("/contact"))}
                aria-current={isActivePath("/contact") ? "page" : undefined}
              >
                {t("nav.contact_us")}
              </Link>

              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center justify-center px-2.5 h-7 rounded-md text-black hover:bg-black/5 hover:text-primary transition-colors font-mono text-[10px] font-bold border border-black/30 hover:border-primary/40 ms-1 shrink-0"
                title={t("nav.lang_switch")}
              >
                {t("nav.lang_toggle")}
              </button>
            </nav>

            <div className="flex items-center gap-2 lg:hidden ms-auto">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center justify-center px-2.5 h-7 rounded-md text-black hover:bg-black/5 hover:text-primary transition-colors font-mono text-[10px] font-bold border border-black/30 hover:border-primary/40"
                title={t("nav.lang_switch")}
              >
                {t("nav.lang_toggle")}
              </button>
              <button
                type="button"
                className="flex flex-col justify-center items-center w-9 h-9 rounded-md hover:bg-foreground/5 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
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
        </div>

        {/* Employee Login Hanging Button (Hidden) */}
        {/* 
        <div className="absolute right-4 sm:right-6 md:right-10 top-full">
          {isLoggedIn ? (
            <Link
              to="/employee-dashboard"
              className="flex items-center justify-center px-4 py-1.5 bg-background border border-t-0 border-primary/15 rounded-b-lg shadow-sm hover:bg-foreground/5 transition-colors font-mono text-[10px] font-bold uppercase tracking-wider text-primary gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              My Dashboard
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center justify-center px-4 py-1.5 bg-background border border-t-0 border-primary/15 rounded-b-lg shadow-sm hover:bg-foreground/5 transition-colors font-mono text-[10px] font-bold uppercase tracking-wider text-primary gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Employee Login
            </button>
          )}
        </div>
        */}
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[140] bg-background/98 backdrop-blur-lg flex flex-col overflow-y-auto pt-20 pb-12 px-6 lg:hidden animate-in fade-in duration-300">
          <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-primary/10 via-gold/5 to-transparent border border-primary/20 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-primary/70">{t("about_page.vision_for")}</span>
            <div className="font-display font-semibold text-xs text-primary flex items-center">
              <TypewriterText phrases={[t("about_page.sec_consult"), t("about_page.trans_services")]} className="min-w-[180px] font-bold" />
            </div>
          </div>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`${mobileNavClass("/")} mb-2`}
            aria-current={isActivePath("/") ? "page" : undefined}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`${mobileNavClass("/about")} mb-2`}
            aria-current={isActivePath("/about") ? "page" : undefined}
          >
            {t("nav.about")}
          </Link>

          <div className="border-b border-foreground/10 pb-3 mb-2 mt-2">
            <button
              type="button"
              onClick={() => toggleMobileGroup(securityGroup.id)}
              className="flex w-full items-center justify-between font-display text-xl text-foreground/85"
            >
              {securityGroup.label}
              <ChevronDown
                className={cn(
                  "h-5 w-5 transition-transform",
                  mobileExpanded === securityGroup.id && "rotate-180",
                )}
              />
            </button>
            {mobileExpanded === securityGroup.id && (
              <div className="mt-3 flex flex-col gap-3">
                {securityGroup.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileNavClass(item.to)}
                    aria-current={isActivePath(item.to) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/translation"
            onClick={() => setMobileMenuOpen(false)}
            className={`${mobileNavClass("/translation")} mb-2`}
            aria-current={isActivePath("/translation") ? "page" : undefined}
          >
            {t("nav.translation")}
          </Link>

          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className={`${mobileNavClass("/projects")} mb-3`}
            aria-current={isActivePath("/projects") ? "page" : undefined}
          >
            {t("nav.group_impact")}
          </Link>

          <div className="border-b border-foreground/10 pb-3 mb-4">
            <button
              type="button"
              onClick={() => toggleMobileGroup(joinTeamGroup.id)}
              className="flex w-full items-center justify-between font-display text-xl text-foreground/85"
            >
              {joinTeamGroup.label}
              <ChevronDown
                className={cn(
                  "h-5 w-5 transition-transform",
                  mobileExpanded === joinTeamGroup.id && "rotate-180",
                )}
              />
            </button>
            {mobileExpanded === joinTeamGroup.id && (
              <div className="mt-3 flex flex-col gap-3">
                {joinTeamGroup.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileNavClass(item.to)}
                    aria-current={isActivePath(item.to) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`${mobileNavClass("/contact")} mb-4`}
            aria-current={isActivePath("/contact") ? "page" : undefined}
          >
            {t("nav.contact_us")}
          </Link>
        </div>
      )}
      
      <EmployeeLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => {
          setIsLoginModalOpen(false);
          // reset mode when closed so next time it opens as login
          setTimeout(() => setAuthMode("login"), 300);
        }} 
        initialMode={authMode}
      />
    </>
  );
}
