import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { setAppLanguage, type AppLang } from "@/i18n";
import { cn } from "@/lib/utils";

type NavLink = { to: string; label: string };

type NavGroup = {
  id: string;
  label: string;
  items: NavLink[];
};

function navItemClass(active: boolean) {
  return cn(
    "relative inline-flex items-center gap-1 px-3 py-2.5 font-sans text-[11px] font-semibold tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-300 rounded-md",
    active
      ? "text-primary bg-primary/12 shadow-[inset_0_-2px_0_0_var(--primary)]"
      : "text-foreground/65 hover:text-primary hover:bg-foreground/[0.05]",
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
          className="h-3.5 w-3.5 shrink-0 opacity-55 transition-transform duration-300 group-hover/nav:rotate-180"
          aria-hidden
        />
      </button>

      <div
        className="absolute top-full pt-2 opacity-0 invisible translate-y-1 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-focus-within/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 transition-all duration-200 z-[200] min-w-[220px]"
        style={{ insetInlineStart: 0 }}
      >
        <div className="rounded-md border border-foreground/10 bg-background/98 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.14)] overflow-hidden">
          <ul className="py-1.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 font-sans text-sm tracking-wide transition-colors border-s-2 border-transparent",
                    isActive(item.to)
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "text-foreground/80 hover:bg-foreground/[0.04] hover:text-primary hover:border-primary/40",
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

  const isAr = i18n.language?.startsWith("ar");

  const toggleLanguage = () => {
    const next: AppLang = isAr ? "en" : "ar";
    setAppLanguage(next, true);
  };

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navGroups: NavGroup[] = [
    {
      id: "who",
      label: t("nav.group_who"),
      items: [
        { to: "/about", label: t("nav.about") },
        { to: "/clients", label: t("nav.clients") },
      ],
    },
    {
      id: "services",
      label: t("nav.group_services"),
      items: [
        { to: "/security", label: t("nav.security") },
        { to: "/translation", label: t("nav.translation") },
        { to: "/certificates", label: t("nav.certifications") },
        { to: "/regulatory", label: t("nav.regulatory_overview") },
        { to: "/regulatory/sais", label: t("nav.regulatory_sais") },
        { to: "/regulatory/moi", label: t("nav.regulatory_moi") },
        { to: "/regulatory/hcis", label: t("nav.regulatory_hcis") },
      ],
    },
    {
      id: "impact",
      label: t("nav.group_impact"),
      items: [
        { to: "/gallery", label: t("nav.gallery") },
        { to: "/clients", label: t("nav.overview") },
        { to: "/career", label: t("nav.careers") },
      ],
    },
  ];

  const isActivePath = (to: string) => {
    if (to === "/") return pathname === "/";
    if (to === "/regulatory") {
      return pathname === "/regulatory" || pathname === "/regulatory/";
    }
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const mobileNavClass = (to: string) =>
    isActivePath(to)
      ? "font-display text-xl tracking-wide text-primary font-semibold border-s-4 border-primary ps-3"
      : "font-display text-xl tracking-wide text-foreground/75 hover:text-primary transition-colors ps-3 border-s-4 border-transparent";

  const toggleMobileGroup = (id: string) => {
    setMobileExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[150] bg-background/90 backdrop-blur-md border-b border-primary/15"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex items-center gap-4 md:gap-6 h-[4.25rem] md:h-[4.5rem]">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <img
                src="https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png"
                alt="Viso Group"
                className="h-8 md:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <span className="font-display font-semibold text-sm md:text-base tracking-wide text-primary hidden min-[420px]:inline-block">
                VISO GROUP
              </span>
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
              {navGroups.map((group) => (
                <NavDropdown key={group.id} group={group} isActive={isActivePath} />
              ))}

              <span className="mx-2 h-6 w-px bg-foreground/15 shrink-0" aria-hidden />

              <Link
                to="/career"
                className={navItemClass(isActivePath("/career"))}
                aria-current={isActivePath("/career") ? "page" : undefined}
              >
                {t("nav.join_team")}
              </Link>
              <Link
                to="/contact"
                className={navItemClass(isActivePath("/contact"))}
                aria-current={isActivePath("/contact") ? "page" : undefined}
              >
                {t("nav.contact_us")}
              </Link>

              <span className="mx-2 h-6 w-px bg-foreground/15 shrink-0" aria-hidden />

              <button
                type="button"
                onClick={toggleLanguage}
                className="px-3 py-2 font-sans text-[11px] font-bold tracking-[0.12em] uppercase text-primary hover:text-secondary cursor-pointer transition-colors rounded-md hover:bg-primary/8"
              >
                {t("nav.lang_toggle")}
              </button>
              <ThemeToggle />
              <Link
                to="/others"
                className={cn(
                  "ms-1 shrink-0 rounded-md px-4 py-2 font-sans text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-300",
                  isActivePath("/others")
                    ? "bg-secondary text-white ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "bg-primary text-primary-foreground hover:bg-secondary hover:text-white",
                )}
                aria-current={isActivePath("/others") ? "page" : undefined}
              >
                {t("nav.engage")}
              </Link>
            </nav>

            <div className="flex items-center gap-2 lg:hidden ms-auto">
              <ThemeToggle />
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
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[140] bg-background/98 backdrop-blur-lg flex flex-col overflow-y-auto pt-20 pb-12 px-6 lg:hidden animate-in fade-in duration-300">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`${mobileNavClass("/")} mb-2`}
            aria-current={isActivePath("/") ? "page" : undefined}
          >
            {t("nav.home")}
          </Link>

          {navGroups.map((group) => (
            <div key={group.id} className="border-b border-foreground/10 py-3">
              <button
                type="button"
                onClick={() => toggleMobileGroup(group.id)}
                className="flex w-full items-center justify-between font-display text-xl text-foreground/85"
              >
                {group.label}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform",
                    mobileExpanded === group.id && "rotate-180",
                  )}
                />
              </button>
              {mobileExpanded === group.id && (
                <div className="mt-3 flex flex-col gap-3">
                  {group.items.map((item) => (
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
          ))}

          <div className="mt-4 flex flex-col gap-3 border-t border-foreground/10 pt-4">
            <Link to="/career" onClick={() => setMobileMenuOpen(false)} className={mobileNavClass("/career")}>
              {t("nav.join_team")}
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={mobileNavClass("/contact")}>
              {t("nav.contact_us")}
            </Link>
            <button
              type="button"
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="font-sans text-sm font-bold tracking-wider text-primary text-start ps-3"
            >
              {t("nav.lang_switch")}
            </button>
            <Link
              to="/others"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "w-full max-w-xs rounded-md px-6 py-3.5 font-sans text-sm font-semibold tracking-widest text-center ms-3",
                isActivePath("/others")
                  ? "bg-secondary text-white ring-2 ring-primary"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {t("nav.engage")}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
