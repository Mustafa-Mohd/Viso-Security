/**
 * POST /api/send-email — Resend integration for contact and job application emails.
 */
import { handleEmailDispatch, type EmailPayload } from "../emailService";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const payload = (await req.json()) as EmailPayload;

    if (!payload || !payload.type) {
      return new Response(JSON.stringify({ error: "Invalid payload: missing type property." }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[send-email] Missing RESEND_API_KEY in backend/.env");
      return new Response(
        JSON.stringify({
          success: false,
          error: "RESEND_API_KEY is not configured on the server. Add it to backend/.env (or your host environment).",
        }),
        { status: 503, headers: corsHeaders },
      );
    }

    const result = await handleEmailDispatch(payload, {
      apiKey,
      fromEmail: process.env.RESEND_FROM_EMAIL,
      adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL,
      hrEmail: process.env.HR_NOTIFICATION_EMAIL || process.env.HR_EMAIL,
    });

    const status = result.success ? 200 : result.error?.includes("RESEND_API_KEY") ? 503 : 500;
    return new Response(JSON.stringify(result), { status, headers: corsHeaders });
  } catch (err: unknown) {
    console.error("[send-email] Server error:", err);
    const message = err instanceof Error ? err.message : "Internal server error processing email.";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
