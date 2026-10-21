/**
 * Netlify Serverless Function: /api/send-email or /.netlify/functions/send-email
 * Connects with Resend to dispatch inbound contact leads, job applications,
 * and automated user acknowledgment emails.
 *
 * Supports both Netlify Functions v2 (Web Request/Response) and v1 (AWS Lambda event/context).
 */
import { handleEmailDispatch, EmailPayload } from "../../server/emailService";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function handler(reqOrEvent: any, context?: any) {
  // Detect if running in Netlify Functions v2 (Standard Web Request) or v1 (AWS Lambda event)
  const isWebReq = reqOrEvent && typeof reqOrEvent.json === "function";
  const httpMethod = isWebReq ? reqOrEvent.method : reqOrEvent?.httpMethod;

  // Handle CORS Preflight
  if (httpMethod === "OPTIONS") {
    if (isWebReq) {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  if (httpMethod !== "POST") {
    const errorBody = JSON.stringify({ error: "Method Not Allowed" });
    if (isWebReq) {
      return new Response(errorBody, { status: 405, headers: corsHeaders });
    }
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: errorBody,
    };
  }

  try {
    let payload: EmailPayload;
    if (isWebReq) {
      payload = (await reqOrEvent.json()) as EmailPayload;
    } else {
      payload = (typeof reqOrEvent?.body === "string"
        ? JSON.parse(reqOrEvent.body || "{}")
        : reqOrEvent?.body) as EmailPayload;
    }

    if (!payload || !payload.type) {
      const errorBody = JSON.stringify({ error: "Invalid payload: missing type property." });
      if (isWebReq) {
        return new Response(errorBody, { status: 400, headers: corsHeaders });
      }
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: errorBody,
      };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[send-email] Missing RESEND_API_KEY in Netlify environment variables.");
      const errorBody = JSON.stringify({
        success: false,
        error: "RESEND_API_KEY is not configured in Netlify environment variables. Please add it to Netlify Site Settings > Environment Variables.",
      });
      if (isWebReq) {
        return new Response(errorBody, { status: 503, headers: corsHeaders });
      }
      return {
        statusCode: 503,
        headers: corsHeaders,
        body: errorBody,
      };
    }

    const result = await handleEmailDispatch(payload, {
      apiKey,
      fromEmail: process.env.RESEND_FROM_EMAIL,
      adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL,
      hrEmail: process.env.HR_NOTIFICATION_EMAIL || process.env.HR_EMAIL,
    });

    const status = result.success ? 200 : result.error?.includes("RESEND_API_KEY") ? 503 : 500;
    const resBody = JSON.stringify(result);

    if (isWebReq) {
      return new Response(resBody, {
        status,
        headers: corsHeaders,
      });
    }

    return {
      statusCode: status,
      headers: corsHeaders,
      body: resBody,
    };
  } catch (err: any) {
    console.error("[send-email] Server error:", err);
    const errBody = JSON.stringify({
      success: false,
      error: err?.message || "Internal server error processing email.",
    });

    if (isWebReq) {
      return new Response(errBody, {
        status: 500,
        headers: corsHeaders,
      });
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: errBody,
    };
  }
}

export default handler;

