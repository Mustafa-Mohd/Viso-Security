/**
 * Client-side email API client for Resend integration.
 * Dispatches contact leads and job applications to the backend email service
 * (handled by Vite dev server plugin in development and Netlify Functions in production).
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
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const endpoints = [
    "/api/send-email",
    `${origin}/api/send-email`,
    "/.netlify/functions/send-email",
  ];

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

      // If method not allowed or 404, try next candidate endpoint
      if (res.status === 404 || res.status === 405) {
        continue;
      }

      const data = (await res.json().catch(() => ({}))) as EmailApiResponse;

      if (!res.ok) {
        // Return structured error
        return {
          success: false,
          error: data?.error || `HTTP ${res.status}: Failed to send email`,
        };
      }

      return data;
    } catch (err: any) {
      lastError = err;
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
