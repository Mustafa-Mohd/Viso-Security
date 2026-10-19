/**
 * Netlify Serverless Function: /api/send-email or /.netlify/functions/send-email
 * Connects with Resend to dispatch inbound contact leads, job applications,
 * and automated user acknowledgment emails.
 */
import { handleEmailDispatch, EmailPayload } from "../../server/emailService";

export default async function handler(req: Request): Promise<Response> {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const payload = (await req.json()) as EmailPayload;

    if (!payload || !payload.type) {
      return new Response(
        JSON.stringify({ error: "Invalid payload: missing type property." }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const result = await handleEmailDispatch(payload, {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL,
      adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL,
      hrEmail: process.env.HR_NOTIFICATION_EMAIL || process.env.HR_EMAIL,
    });

    const status = result.success ? 200 : result.error?.includes("RESEND_API_KEY") ? 503 : 500;

    return new Response(JSON.stringify(result), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || "Internal server error processing email.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
