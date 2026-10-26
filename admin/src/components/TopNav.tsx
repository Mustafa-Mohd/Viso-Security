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
    "relative inline-flex items-center gap-1 px-1.5 lg:px-1.5 xl:px-2.5 2xl:px-3 py-1.5 font-sans text-[10px] lg:text-[10.5px] xl:text-[11px] 2xl:text-[12px] font-bold tracking-[0.02em] xl:tracking-[0.05em] uppercase whitespace-nowrap transition-all duration-300 rounded-lg shrink-0",
    active
      ? "text-primary bg-primary/[0.04]"
      : "text-black/85 hover:text-primary hover:bg-black/[0.04]",
  );
}

function NavDropdown({
  group,
  isActive,
  compactLabel,
}: {
  group: NavGroup;
  isActive: (to: string) => boolean;
  compactLabel?: string;
}) {
  const groupActive = group.items.some((item) => isActive(item.to));

  return (
    <div className="relative group/nav shrink-0">
      <button
        type="button"
        className={cn(navItemClass(groupActive), "cursor-default")}
        aria-haspopup="true"
        aria-expanded={undefined}
      >
        {compactLabel ? (
          <>
            <span className="hidden xl:inline">{group.label}</span>
            <span className="xl:hidden">{compactLabel}</span>
          </>
        ) : (
          group.label
        )}
        <ChevronDown
          className="h-3 w-3 xl:h-3.5 xl:w-3.5 shrink-0 text-black/70 transition-transform duration-300 group-hover/nav:rotate-180 group-hover/nav:text-primary"
          aria-hidden
        />
        {groupActive && (
          <span className="absolute bottom-0 inset-x-2 h-0.5 bg-gradient-to-r from-primary via-gold to-primary rounded-full shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
        )}
      </button>

      <div
        className="absolute top-full pt-2 opacity-0 invisible translate-y-1 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-focus-within/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 transition-all duration-200 z-[200] min-w-[200px]"
        style={{ insetInlineStart: 0 }}
      >
        <div className="rounded-xl border border-black/10 bg-white/98 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.14)] overflow-hidden">
          <div className="h-0.5 w-full bg-gradient-to-r from-primary via-gold to-primary/50" />
          <ul className="py-1.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 font-sans text-xs xl:text-sm tracking-wide transition-colors border-s-2 border-transparent",
                    isActive(item.to)
                      ? "text-primary font-bold bg-primary/[0.04] border-primary"
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

function WifiLanguageToggle({
  isAr,
  onSwitch,
  title,
}: {
  isAr: boolean;
  onSwitch: (lang: AppLang) => void;
  title: string;
}) {
  return (
    <div
      dir="ltr"
      title={title}
      onClick={() => onSwitch(isAr ? "en" : "ar")}
      role="switch"
      aria-checked={isAr}
      aria-label="Toggle language between English and Arabic"
      className="group relative inline-flex items-center w-[74px] h-[30px] p-[2.5px] rounded-full bg-black/[0.06] hover:bg-black/[0.1] border border-black/15 hover:border-gold/50 shadow-[inset_0_1px_2.5px_rgba(0,0,0,0.12)] transition-all duration-300 select-none shrink-0 cursor-pointer"
    >
      {/* Sliding Knob (WiFi Switch Handle) */}
      <motion.div
        className="absolute top-[2.5px] bottom-[2.5px] w-[33px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)] border border-black/10 flex items-center justify-center z-10 pointer-events-none"
        initial={false}
        animate={{
          left: isAr ? "38.5px" : "2.5px",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 32,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(220,38,38,0.7)]" />
      </motion.div>

      {/* EN Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSwitch("en");
        }}
        aria-label="Switch to English"
        className={cn(
          "relative w-[34px] h-full flex items-center justify-center font-mono text-[10px] tracking-wider transition-colors duration-200 z-0 cursor-pointer rounded-full focus:outline-none",
          !isAr ? "text-primary font-black" : "text-black/50 hover:text-black/80 font-bold"
        )}
      >
        EN
      </button>

      {/* AR Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSwitch("ar");
        }}
        aria-label="التبديل إلى العربية"
        className={cn(
          "relative w-[34px] h-full flex items-center justify-center font-sans text-[11px] transition-colors duration-200 z-0 cursor-pointer rounded-full focus:outline-none ms-auto",
          isAr ? "text-primary font-black" : "text-black/50 hover:text-black/80 font-bold"
        )}
      >
        عربي
      </button>
    </div>
  );
}

export function TopNav() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<Mode>("login");
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

  const switchLanguage = (target: AppLang) => {
    if (target !== i18n.language) {
      setAppLanguage(target, true);
    }
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
      <header
        className="fixed top-0 left-0 right-0 z-[150] bg-background/90 backdrop-blur-md border-b border-primary/15"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="max-w-[1920px] mx-auto px-3 sm:px-5 md:px-6 lg:px-5 xl:px-10 2xl:px-12">
          <div className="flex items-center justify-between h-16 md:h-20 flex-nowrap">
            {/* Logo on the left */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 group shrink-0">
              <img loading="lazy" decoding="async"
                src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png"
                alt="Viso Group"
                className="h-9 sm:h-11 md:h-12 lg:h-13 xl:h-16 w-auto object-contain shrink-0 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="flex flex-col justify-center w-[150px] sm:w-[170px] md:w-[185px] lg:w-[190px] xl:w-[245px] shrink-0 border-s border-foreground/20 ps-2 sm:ps-2.5 xl:ps-3.5 py-0.5 font-brand-condensed overflow-hidden">
                <span
                  className={cn(
                    "text-foreground font-brand-condensed font-semibold text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[16px] uppercase whitespace-nowrap leading-tight truncate",
                    isAr ? "tracking-normal" : "tracking-[0.035em] xl:tracking-[0.048em]"
                  )}
                >
                  {t("about_page.vision_for").trim()}
                </span>
                <ShiningSwordLine />
                <span
                  className={cn(
                    "text-primary font-brand-condensed font-semibold text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[16px] uppercase whitespace-nowrap leading-tight truncate",
                    isAr ? "tracking-normal" : "tracking-[0.11em] sm:tracking-[0.125em] xl:tracking-[0.145em]"
                  )}
                >
                  <TypewriterText phrases={[t("about_page.sec_consult"), t("about_page.trans_services")]} />
                </span>
              </div>
            </Link>

            {/* Navigation links - responsive spacing and labels to fit at 125%+ zoom */}
            <nav
              className="hidden lg:flex items-center gap-0.5 lg:gap-1 xl:gap-1.5 2xl:gap-2 ms-2 sm:ms-3 lg:ms-4 xl:ms-8 2xl:ms-12 shrink-0 flex-nowrap"
              aria-label="Main"
            >
              <Link
                to="/"
                className={navItemClass(isActivePath("/"))}
                aria-current={isActivePath("/") ? "page" : undefined}
              >
                {t("nav.home")}
                {isActivePath("/") && (
                  <span className="absolute bottom-0 inset-x-2 h-0.5 bg-gradient-to-r from-primary via-gold to-primary rounded-full shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                )}
              </Link>
              <Link
                to="/about"
                className={navItemClass(isActivePath("/about"))}
                aria-current={isActivePath("/about") ? "page" : undefined}
              >
                <span className="hidden xl:inline">{t("nav.about")}</span>
                <span className="xl:hidden">{isAr ? t("nav.about") : "About"}</span>
                {isActivePath("/about") && (
                  <span className="absolute bottom-0 inset-x-2 h-0.5 bg-gradient-to-r from-primary via-gold to-primary rounded-full shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                )}
              </Link>
              <NavDropdown 
                key={securityGroup.id} 
                group={securityGroup} 
                isActive={isActivePath} 
                compactLabel={isAr ? securityGroup.label : "Security"}
              />
              <Link
                to="/translation"
                className={navItemClass(isActivePath("/translation"))}
                aria-current={isActivePath("/translation") ? "page" : undefined}
              >
                <span className="hidden xl:inline">{t("nav.translation")}</span>
                <span className="xl:hidden">{isAr ? t("nav.translation") : "Translation"}</span>
                {isActivePath("/translation") && (
                  <span className="absolute bottom-0 inset-x-2 h-0.5 bg-gradient-to-r from-primary via-gold to-primary rounded-full shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                )}
              </Link>

              <NavDropdown key={projectsGroup.id} group={projectsGroup} isActive={isActivePath} />
              
              <NavDropdown 
                key={joinTeamGroup.id} 
                group={joinTeamGroup} 
                isActive={isActivePath} 
                compactLabel={isAr ? joinTeamGroup.label : "Careers"}
              />

              <Link
                to="/contact"
                className={navItemClass(isActivePath("/contact"))}
                aria-current={isActivePath("/contact") ? "page" : undefined}
              >
                <span className="hidden xl:inline">{t("nav.contact_us")}</span>
                <span className="xl:hidden">{isAr ? t("nav.contact_us") : "Contact"}</span>
                {isActivePath("/contact") && (
                  <span className="absolute bottom-0 inset-x-2 h-0.5 bg-gradient-to-r from-primary via-gold to-primary rounded-full shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                )}
              </Link>
            </nav>

            {/* Desktop Language Switch: WiFi Toggle */}
            <div className="hidden lg:flex items-center shrink-0 ms-auto ps-2 xl:ps-4">
              <div className="h-4 xl:h-5 w-px bg-foreground/15 me-2 xl:me-3.5 shrink-0" aria-hidden />
              <WifiLanguageToggle
                isAr={isAr}
                onSwitch={switchLanguage}
                title={t("nav.lang_switch")}
              />
            </div>

            {/* Mobile Header Right */}
            <div className="flex items-center gap-2.5 lg:hidden ms-auto">
              <WifiLanguageToggle
                isAr={isAr}
                onSwitch={switchLanguage}
                title={t("nav.lang_switch")}
              />
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
