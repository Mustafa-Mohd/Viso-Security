/** Base URL for the separate admin Vite app (see `admin/`). */
export function adminAppUrl(path = ""): string {
  const base = (import.meta.env.VITE_ADMIN_APP_URL as string | undefined)?.replace(/\/$/, "") ?? "";
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  if (!base) {
    return normalized || "/";
  }
  return `${base}${normalized}`;
}
