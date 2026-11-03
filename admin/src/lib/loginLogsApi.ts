import { supabase } from "./supabase";

export type PortalLoginLog = {
  id: string;
  user_id: string | null;
  user_name: string;
  user_email: string;
  role: string;
  logged_in_at: string;
};

const PORTAL_LOGIN_SECTION = "portal_login";

function mapAuditRowToLoginLog(row: {
  id: string;
  changed_at: string;
  changed_by?: string | null;
  new_content?: Record<string, unknown> | null;
}): PortalLoginLog {
  const payload = row.new_content || {};
  return {
    id: row.id,
    user_id: (payload.user_id as string) || null,
    user_name: (payload.name as string) || row.changed_by || "Unknown",
    user_email: (payload.email as string) || row.changed_by || "",
    role: (payload.role as string) || "unknown",
    logged_in_at: row.changed_at,
  };
}

/** Persist sign-in (uses cms_audit_logs — same table as CMS history, already in Supabase). */
export async function recordPortalLogin(user: {
  id: string;
  name: string;
  email: string;
  role: string;
}): Promise<string | null> {
  const { error } = await supabase.from("cms_audit_logs").insert({
    section_key: PORTAL_LOGIN_SECTION,
    old_content: null,
    new_content: {
      user_id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    changed_by: user.email,
  });

  if (error) {
    console.error("Failed to record portal login:", error);
    return error.message;
  }
  return null;
}

export async function fetchPortalLoginLogs(
  limit = 150
): Promise<{ logs: PortalLoginLog[]; error: string | null }> {
  const { data, error } = await supabase
    .from("cms_audit_logs")
    .select("id, changed_at, changed_by, new_content")
    .eq("section_key", PORTAL_LOGIN_SECTION)
    .order("changed_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch portal login logs:", error);
    return { logs: [], error: error.message };
  }

  const logs = (data || []).map(mapAuditRowToLoginLog);
  return { logs, error: null };
}
