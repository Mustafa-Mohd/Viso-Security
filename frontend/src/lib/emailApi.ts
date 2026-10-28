import { apiUrl } from "@/lib/apiBase";

/**
 * Client-side email API client for Resend integration.
 * Dispatches contact leads and job applications to the backend email service
 * Dispatches contact leads and job applications to POST /api/send-email on the server.
 */

export interface ContactNotificationPayload {
  name: string;
  email: string;
  company?: string | null;
  message: string;
}

export interface JobNotificationPayload {
  name: string;
  email: string;
  phone: string;
  position: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
}

export type EmailApiResponse = {
  success: boolean;
  adminSent?: boolean;
  ackSent?: boolean;
  error?: string;
  details?: any;
};

async function postEmailPayload(payload: any): Promise<EmailApiResponse> {
  const endpoints = [apiUrl("/api/send-email"), "/api/send-email"];

  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";

      // If method not allowed, 404, or hit SPA HTML catch-all, try next endpoint
      if (res.status === 404 || res.status === 405 || contentType.includes("text/html")) {
        continue;
      }

      const data = (await res.json().catch(() => ({}))) as EmailApiResponse;

      if (!res.ok) {
        const errorMsg = data?.error || `HTTP ${res.status}: Failed to send email`;
        console.error(`[emailApi] Endpoint ${endpoint} failed:`, errorMsg, data);
        return {
          success: false,
          error: errorMsg,
          details: data?.details,
        };
      }

      return data;
    } catch (err: any) {
      lastError = err;
      console.warn(`[emailApi] Candidate endpoint ${endpoint} threw:`, err?.message);
    }
  }

  return {
    success: false,
    error: lastError?.message || "All email endpoints were unreachable.",
  };
}

/**
 * Sends a contact inquiry email via Resend:
 * 1. Admin lead alert to company team
 * 2. Acknowledgment email to the submitter
 */
export async function sendContactNotification(
  payload: ContactNotificationPayload
): Promise<EmailApiResponse> {
  return postEmailPayload({
    type: "contact",
    name: payload.name,
    email: payload.email,
    company: payload.company || undefined,
    message: payload.message,
  });
}

/**
 * Sends a job application notification via Resend:
 * 1. Lead alert to HR / recruitment team with resume link
 * 2. Acknowledgment confirmation to the candidate
 */
export async function sendJobApplicationNotification(
  payload: JobNotificationPayload
): Promise<EmailApiResponse> {
  return postEmailPayload({
    type: "job_application",
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    position: payload.position,
    coverLetter: payload.coverLetter || undefined,
    resumeUrl: payload.resumeUrl || undefined,
  });
}
