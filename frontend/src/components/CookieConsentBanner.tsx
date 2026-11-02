import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  ACCEPT_ALL_PREFERENCES,
  NECESSARY_ONLY,
  type CookiePreferences,
  getStoredCookieConsent,
  hasCookieConsentChoice,
  saveCookieConsent,
} from "@/lib/cookieConsent";
import { cn } from "@/lib/utils";

export function CookieConsentBanner() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [bannerOpen, setBannerOpen] = useState(() => !hasCookieConsentChoice());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(() => {
    return getStoredCookieConsent()?.preferences ?? { ...ACCEPT_ALL_PREFERENCES };
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_STORAGE_KEY) {
        setBannerOpen(!hasCookieConsentChoice());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const closeBanner = useCallback((next: CookiePreferences) => {
    saveCookieConsent(next);
    setPrefs(next);
    setSettingsOpen(false);
    setBannerOpen(false);
  }, []);

  const openSettings = () => {
    const stored = getStoredCookieConsent()?.preferences;
    setPrefs(stored ? { ...stored } : { ...NECESSARY_ONLY, analytics: false, marketing: false });
    setSettingsOpen(true);
  };

  if (!bannerOpen && !settingsOpen) return null;

  return (
    <>
      {bannerOpen && !settingsOpen && (
        <div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
          className={cn(
            "fixed inset-x-0 bottom-0 z-[200] border-t border-border bg-background/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.12)]",
            isArabic && "font-arabic",
          )}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5 md:px-10">
            <div className="min-w-0 flex-1 space-y-1">
              <p id="cookie-consent-title" className="sr-only">
                {t("cookie_consent.title")}
              </p>
              <p
                id="cookie-consent-desc"
                className="text-sm leading-relaxed text-foreground/85 sm:text-[0.9375rem]"
              >
                {t("cookie_consent.message")}{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                  onClick={() => {
                    setSettingsOpen(false);
                  }}
                >
                  {t("cookie_consent.privacy_link")}
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto border-primary/40 text-primary hover:bg-primary/5"
                onClick={openSettings}
              >
                {t("cookie_consent.settings")}
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto font-semibold"
                onClick={() => closeBanner(ACCEPT_ALL_PREFERENCES)}
              >
                {t("cookie_consent.accept_all")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent
          className={cn("z-[210] max-w-lg sm:max-w-md", isArabic && "font-arabic text-right")}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <DialogHeader className={isArabic ? "sm:text-right" : undefined}>
            <DialogTitle>{t("cookie_consent.settings_title")}</DialogTitle>
            <DialogDescription>{t("cookie_consent.settings_desc")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <PreferenceRow
              id="cookie-necessary"
              title={t("cookie_consent.necessary_title")}
              description={t("cookie_consent.necessary_desc")}
              checked
              disabled
              isArabic={isArabic}
            />
            <PreferenceRow
              id="cookie-analytics"
              title={t("cookie_consent.analytics_title")}
              description={t("cookie_consent.analytics_desc")}
              checked={prefs.analytics}
              onCheckedChange={(checked) => setPrefs((p) => ({ ...p, analytics: checked }))}
              isArabic={isArabic}
            />
            <PreferenceRow
              id="cookie-marketing"
              title={t("cookie_consent.marketing_title")}
              description={t("cookie_consent.marketing_desc")}
              checked={prefs.marketing}
              onCheckedChange={(checked) => setPrefs((p) => ({ ...p, marketing: checked }))}
              isArabic={isArabic}
            />
          </div>

          <DialogFooter
            className={cn(
              "flex flex-col gap-2 sm:flex-col sm:space-x-0",
              isArabic && "sm:flex-col-reverse",
            )}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => closeBanner(NECESSARY_ONLY)}
            >
              {t("cookie_consent.reject_nonessential")}
            </Button>
            <Button type="button" className="w-full font-semibold" onClick={() => closeBanner(prefs)}>
              {t("cookie_consent.save_preferences")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => closeBanner(ACCEPT_ALL_PREFERENCES)}
            >
              {t("cookie_consent.accept_all")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PreferenceRow({
  id,
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
  isArabic,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  isArabic?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-surface/50 p-4",
        isArabic && "flex-row-reverse text-right",
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <Label htmlFor={id} className="text-sm font-semibold text-foreground">
          {title}
        </Label>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-readonly={disabled}
        className="shrink-0"
      />
    </div>
  );
}
