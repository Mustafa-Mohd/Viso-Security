import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/TypewriterText";
import { NavLogoTagline } from "@/components/NavLogoTagline";
import { setAppLanguage, type AppLang } from "@/i18n";
import { cn } from "@/lib/utils";
import { EmployeeLoginModal, type Mode } from "@/components/EmployeeLoginModal";
import { supabase } from "@/lib/supabase";
import { adminAppUrl } from "@/lib/adminAppUrl";

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
  const flipLanguage = () => onSwitch(isAr ? "en" : "ar");

  return (
    <div
      dir="ltr"
      title={title}
      role="group"
      aria-label="Language"
      className="group relative inline-flex items-center w-[74px] h-[30px] p-[2.5px] rounded-full bg-black/[0.06] hover:bg-black/[0.1] border border-black/15 hover:border-gold/50 shadow-[inset_0_1px_2.5px_rgba(0,0,0,0.12)] transition-all duration-300 select-none shrink-0"
    >
      {/* Sliding knob — receives clicks so toggling works (not blocked by EN/AR labels) */}
      <motion.button
        type="button"
        onClick={flipLanguage}
        aria-label={isAr ? "Switch to English" : "Switch to Arabic"}
        className="absolute top-[2.5px] bottom-[2.5px] w-[33px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)] border border-black/10 flex items-center justify-center z-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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
      </motion.button>

      <button
        type="button"
        onClick={() => onSwitch("en")}
        aria-label="Switch to English"
        aria-pressed={!isAr}
        className={cn(
          "relative w-[34px] h-full flex items-center justify-center font-mono text-[10px] tracking-wider transition-colors duration-200 z-10 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          !isAr ? "text-primary font-black" : "text-black/50 hover:text-black/80 font-bold",
        )}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => onSwitch("ar")}
        aria-label="التبديل إلى العربية"
        aria-pressed={isAr}
        className={cn(
          "relative w-[34px] h-full flex items-center justify-center font-sans text-[11px] transition-colors duration-200 z-10 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ms-auto",
          isAr ? "text-primary font-black" : "text-black/50 hover:text-black/80 font-bold",
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

  const currentLang = useCallback((): AppLang => (i18n.language?.startsWith("ar") ? "ar" : "en"), [i18n.language]);

  const switchLanguage = (target: AppLang) => {
    if (target !== currentLang()) {
      setAppLanguage(target, true);
    }
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

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
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 group shrink-0 min-w-0">
              <img loading="lazy" decoding="async"
                src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png"
                alt="Viso Group"
                className="h-9 sm:h-11 md:h-12 lg:h-13 xl:h-16 w-auto object-contain shrink-0 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="hidden min-[420px]:block min-w-0">
                <NavLogoTagline
                  visionLine={t("about_page.vision_for").trim()}
                  taglinePhrases={[t("about_page.sec_consult"), t("about_page.trans_services")]}
                  isAr={isAr}
                />
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
                isAr={!!isAr}
                onSwitch={switchLanguage}
                title={t("nav.lang_switch")}
              />
            </div>

            {/* Mobile: language + menu */}
            <div className="flex items-center gap-2 lg:hidden ms-auto shrink-0">
              <WifiLanguageToggle
                isAr={!!isAr}
                onSwitch={switchLanguage}
                title={t("nav.lang_switch")}
              />
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-foreground/10 bg-background/80 text-foreground shadow-sm hover:bg-foreground/5 hover:border-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? t("nav.close_menu", "Close menu") : t("nav.open_menu", "Open menu")}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-main-nav"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>

        {/* Employee Login Hanging Button (Hidden) */}
        {/* 
        <div className="absolute right-4 sm:right-6 md:right-10 top-full">
          {isLoggedIn ? (
            <a
              href={adminAppUrl("/employee-dashboard")}
              className="flex items-center justify-center px-4 py-1.5 bg-background border border-t-0 border-primary/15 rounded-b-lg shadow-sm hover:bg-foreground/5 transition-colors font-mono text-[10px] font-bold uppercase tracking-wider text-primary gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              My Dashboard
            </a>
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
        <>
          <button
            type="button"
            className="fixed inset-0 z-[155] bg-black/50 backdrop-blur-[2px] lg:hidden animate-in fade-in duration-200"
            aria-label={t("nav.close_menu", "Close menu")}
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav
            id="mobile-main-nav"
            className="fixed inset-y-0 end-0 z-[160] flex w-[min(100vw-3rem,340px)] flex-col border-s border-foreground/10 bg-background/98 shadow-2xl backdrop-blur-xl lg:hidden animate-in slide-in-from-right duration-300"
            aria-label="Main"
          >
            <div className="flex items-center justify-between gap-3 border-b border-foreground/10 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                {t("nav.menu", "Menu")}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-foreground/10 hover:bg-foreground/5"
                aria-label={t("nav.close_menu", "Close menu")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <div className="mb-6 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 to-gold/5 p-4">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-primary/70 block mb-1.5">
                  {t("about_page.vision_for")}
                </span>
                <div className="font-display text-sm font-semibold text-primary">
                  <TypewriterText
                    phrases={[t("about_page.sec_consult"), t("about_page.trans_services")]}
                    className="font-bold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${mobileNavClass("/")} py-3 rounded-lg hover:bg-foreground/[0.03]`}
                  aria-current={isActivePath("/") ? "page" : undefined}
                >
                  {t("nav.home")}
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${mobileNavClass("/about")} py-3 rounded-lg hover:bg-foreground/[0.03]`}
                  aria-current={isActivePath("/about") ? "page" : undefined}
                >
                  {t("nav.about")}
                </Link>

                <div className="mt-2 rounded-xl border border-foreground/8 bg-surface/40 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileGroup(securityGroup.id)}
                    className="flex w-full items-center justify-between px-4 py-3.5 font-display text-lg text-foreground"
                  >
                    {securityGroup.label}
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-foreground/50 transition-transform",
                        mobileExpanded === securityGroup.id && "rotate-180",
                      )}
                    />
                  </button>
                  {mobileExpanded === securityGroup.id && (
                    <div className="border-t border-foreground/8 px-2 pb-2 flex flex-col gap-0.5">
                      {securityGroup.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`${mobileNavClass(item.to)} py-2.5 text-base rounded-lg hover:bg-foreground/[0.03]`}
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
                  className={`${mobileNavClass("/translation")} py-3 rounded-lg hover:bg-foreground/[0.03]`}
                  aria-current={isActivePath("/translation") ? "page" : undefined}
                >
                  {t("nav.translation")}
                </Link>

                <div className="rounded-xl border border-foreground/8 bg-surface/40 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileGroup(projectsGroup.id)}
                    className="flex w-full items-center justify-between px-4 py-3.5 font-display text-lg text-foreground"
                  >
                    {projectsGroup.label}
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-foreground/50 transition-transform",
                        mobileExpanded === projectsGroup.id && "rotate-180",
                      )}
                    />
                  </button>
                  {mobileExpanded === projectsGroup.id && (
                    <div className="border-t border-foreground/8 px-2 pb-2 flex flex-col gap-0.5">
                      {projectsGroup.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`${mobileNavClass(item.to)} py-2.5 text-base rounded-lg hover:bg-foreground/[0.03]`}
                          aria-current={isActivePath(item.to) ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-foreground/8 bg-surface/40 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileGroup(joinTeamGroup.id)}
                    className="flex w-full items-center justify-between px-4 py-3.5 font-display text-lg text-foreground"
                  >
                    {joinTeamGroup.label}
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-foreground/50 transition-transform",
                        mobileExpanded === joinTeamGroup.id && "rotate-180",
                      )}
                    />
                  </button>
                  {mobileExpanded === joinTeamGroup.id && (
                    <div className="border-t border-foreground/8 px-2 pb-2 flex flex-col gap-0.5">
                      {joinTeamGroup.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`${mobileNavClass(item.to)} py-2.5 text-base rounded-lg hover:bg-foreground/[0.03]`}
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
                  className={`${mobileNavClass("/contact")} py-3 mt-2 rounded-lg hover:bg-foreground/[0.03]`}
                  aria-current={isActivePath("/contact") ? "page" : undefined}
                >
                  {t("nav.contact_us")}
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-foreground/10">
                <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/45 mb-3">
                  {t("nav.lang_switch")}
                </p>
                <WifiLanguageToggle
                  isAr={!!isAr}
                  onSwitch={switchLanguage}
                  title={t("nav.lang_switch")}
                />
              </div>
            </div>
          </nav>
        </>
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
