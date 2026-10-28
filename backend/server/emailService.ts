import { Resend } from "resend";

export interface ContactEmailPayload {
  type: "contact";
  name: string;
  email: string;
  company?: string | null;
  message: string;
}

export interface JobEmailPayload {
  type: "job_application";
  name: string;
  email: string;
  phone: string;
  position: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
}

export type EmailPayload = ContactEmailPayload | JobEmailPayload;

export interface EmailServiceConfig {
  apiKey?: string;
  fromEmail?: string;
  adminEmail?: string | string[];
  hrEmail?: string | string[];
}

/**
 * Parses single string, comma-separated string, or array into a clean list of valid email addresses.
 */
export function parseRecipientEmails(input?: string | string[]): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .flatMap((item) => (typeof item === "string" ? item.split(/[,;]/) : []))
      .map((e) => e.trim())
      .filter((e) => e.length > 0 && e.includes("@"));
  }
  return input
    .split(/[,;]/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0 && e.includes("@"));
}

export interface SendEmailResult {
  success: boolean;
  adminSent?: boolean;
  ackSent?: boolean;
  error?: string;
  details?: any;
}

const VISO_LOGO_URL =
  "https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png";

/* -------------------------------------------------------------------------- */
/*                               EMAIL TEMPLATES                              */
/* -------------------------------------------------------------------------- */

function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailWrapper(title: string, badgeText: string, contentHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; min-height: 100vh; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);">
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #d4af37 0%, #b8972e 50%, #d4af37 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle">
                    <img src="${VISO_LOGO_URL}" alt="VISO Group" width="130" style="display: block; max-width: 140px; height: auto; border: 0;" />
                    <div style="font-size: 11px; letter-spacing: 1.5px; color: #64748b; text-transform: uppercase; margin-top: 6px; font-weight: 600;">
                      Security Architecture &amp; Advisory
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; padding: 5px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; border-radius: 9999px; background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a;">
                      ${escapeHtml(badgeText)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 28px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #64748b; line-height: 1.5;">
                VISO Group Corporate Headquarters &bull; Riyadh, Kingdom of Saudi Arabia
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} VISO Group. Confidential &amp; Proprietary.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* -------------------------------------------------------------------------- */
/*                        CONTACT FORM EMAIL TEMPLATES                        */
/* -------------------------------------------------------------------------- */

export function buildContactAdminEmail(payload: ContactEmailPayload) {
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeCompany = escapeHtml(payload.company || "Not specified");
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br/>");
  const timeStr = new Date().toUTCString();

  const content = `
    <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
      New Inbound Contact Lead
    </h1>
    <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6;">
      A new inquiry has been submitted through the VISO Group contact form. Details are provided below:
    </p>

    <!-- Details Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; width: 32%; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
          Full Name
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a;">
          ${safeName}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
          Email Address
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #b45309;">
          <a href="mailto:${safeEmail}" style="color: #b45309; text-decoration: none;">${safeEmail}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
          Company / Org
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155;">
          ${safeCompany}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
          Received At
        </td>
        <td style="padding: 14px 18px; font-size: 13px; color: #64748b; font-family: monospace;">
          ${timeStr}
        </td>
      </tr>
    </table>

    <!-- Message Section -->
    <div style="margin-bottom: 28px;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #92400e; margin-bottom: 8px;">
        Inquiry Message
      </div>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #d4af37; border-radius: 0 8px 8px 0; padding: 18px; font-size: 14px; line-height: 1.7; color: #1e293b;">
        ${safeMessage}
      </div>
    </div>

    <!-- Actions -->
    <div style="text-align: center; margin-top: 24px;">
      <a href="mailto:${safeEmail}?subject=Re:%20Inquiry%20with%20VISO%20Group" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; padding: 14px 28px; border-radius: 6px; text-decoration: none; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);">
        Reply Directly to ${safeName}
      </a>
    </div>
  `;

  return {
    subject: `[New Lead] Inquiry from ${payload.name}${payload.company ? ` (${payload.company})` : ""}`,
    html: emailWrapper("New Inbound Contact Lead", "New Lead", content),
    text: `New Inbound Lead from VISO Contact Form\n\nName: ${payload.name}\nEmail: ${payload.email}\nCompany: ${payload.company || "N/A"}\nReceived: ${timeStr}\n\nMessage:\n${payload.message}`,
  };
}

export function buildContactAckEmail(payload: ContactEmailPayload) {
  const safeName = escapeHtml(payload.name);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br/>");

  const content = `
    <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
      Thank You for Reaching Out
    </h1>
    <p style="margin: 0 0 16px; font-size: 15px; color: #1e293b; line-height: 1.6;">
      Dear ${safeName},
    </p>
    <p style="margin: 0 0 22px; font-size: 14px; color: #475569; line-height: 1.7;">
      We have successfully received your inquiry at VISO Group. Our security architecture and advisory team is reviewing your requirements and will follow up with you shortly (typically within 1 business day).
    </p>

    <!-- Summary Box -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #92400e; margin-bottom: 8px;">
        A copy of your submitted message
      </div>
      <div style="font-size: 13px; line-height: 1.6; color: #334155; font-style: italic;">
        "${safeMessage}"
      </div>
    </div>

    <!-- Additional Info Box -->
    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #d4af37; border-radius: 0 8px 8px 0; padding: 18px; margin-bottom: 28px;">
      <div style="font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 4px;">
        Need Immediate Assistance?
      </div>
      <p style="margin: 0; font-size: 13px; color: #78350f; line-height: 1.6;">
        For urgent advisory or mission-critical consulting, please email our operations team directly at <a href="mailto:info@visogroup.com" style="color: #92400e; font-weight: 600; text-decoration: underline;">info@visogroup.com</a>.
      </p>
    </div>

    <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Warm regards,<br/>
      <strong style="color: #0f172a;">The VISO Group Advisory Team</strong>
    </p>
  `;

  return {
    subject: `We have received your message | VISO Group`,
    html: emailWrapper("Inquiry Confirmation", "Acknowledgment", content),
    text: `Dear ${payload.name},\n\nThank you for reaching out to VISO Group. We have received your inquiry and our team will follow up within 1 business day.\n\nYour message:\n${payload.message}\n\nWarm regards,\nVISO Group Team`,
  };
}

/* -------------------------------------------------------------------------- */
/*                     JOB APPLICATION EMAIL TEMPLATES                        */
/* -------------------------------------------------------------------------- */

export function buildJobAdminEmail(payload: JobEmailPayload) {
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = escapeHtml(payload.phone);
  const safePosition = escapeHtml(payload.position);
  const safeCoverLetter = payload.coverLetter
    ? escapeHtml(payload.coverLetter).replace(/\n/g, "<br/>")
    : null;
  const timeStr = new Date().toUTCString();

  const content = `
    <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
      New Job Application Received
    </h1>
    <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6;">
      A candidate has submitted an application for the role of <strong style="color: #b45309;">${safePosition}</strong>:
    </p>

    <!-- Details Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; width: 32%; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
          Position Applied
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #b45309;">
          ${safePosition}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
          Candidate Name
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a;">
          ${safeName}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
          Email
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #b45309;">
          <a href="mailto:${safeEmail}" style="color: #b45309; text-decoration: none;">${safeEmail}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
          Phone Number
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0f172a;">
          <a href="tel:${safePhone}" style="color: #0f172a; text-decoration: none;">${safePhone}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
          Date Submitted
        </td>
        <td style="padding: 14px 18px; font-size: 13px; color: #64748b; font-family: monospace;">
          ${timeStr}
        </td>
      </tr>
    </table>

    ${
      safeCoverLetter
        ? `
      <!-- Cover Letter Section -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #92400e; margin-bottom: 8px;">
          Cover Note / Statement
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #d4af37; border-radius: 0 8px 8px 0; padding: 18px; font-size: 14px; line-height: 1.7; color: #1e293b;">
          ${safeCoverLetter}
        </div>
      </div>
    `
        : ""
    }

    <!-- Action Buttons -->
    <div style="text-align: center; margin-top: 28px;">
      ${
        payload.resumeUrl
          ? `
        <a href="${escapeHtml(payload.resumeUrl)}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; padding: 14px 28px; border-radius: 6px; text-decoration: none; margin: 6px; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);">
          Download Resume (PDF)
        </a>
      `
          : ""
      }
      <a href="mailto:${safeEmail}?subject=Application%20for%20${encodeURIComponent(payload.position)}%20at%20VISO%20Group" style="display: inline-block; background-color: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; font-size: 13px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; padding: 14px 24px; border-radius: 6px; text-decoration: none; margin: 6px;">
        Email Candidate
      </a>
    </div>
  `;

  return {
    subject: `[Job Application] ${payload.name} applied for ${payload.position}`,
    html: emailWrapper("New Job Application", "Candidate Lead", content),
    text: `New Job Application\n\nPosition: ${payload.position}\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nResume: ${payload.resumeUrl || "None"}\n\nCover Letter:\n${payload.coverLetter || "N/A"}`,
  };
}

export function buildJobAckEmail(payload: JobEmailPayload) {
  const safeName = escapeHtml(payload.name);
  const safePosition = escapeHtml(payload.position);

  const content = `
    <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
      Application Received
    </h1>
    <p style="margin: 0 0 16px; font-size: 15px; color: #1e293b; line-height: 1.6;">
      Dear ${safeName},
    </p>
    <p style="margin: 0 0 22px; font-size: 14px; color: #475569; line-height: 1.7;">
      Thank you for applying for the position of <strong style="color: #b45309;">${safePosition}</strong> at VISO Group. We have successfully received your application materials and resume.
    </p>

    <!-- Next Steps Card -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 22px; margin-bottom: 24px;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #92400e; margin-bottom: 14px;">
        What happens next?
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td valign="top" style="width: 32px; padding-bottom: 14px;">
            <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; text-align: center; line-height: 22px; border: 1px solid #fde68a;">1</div>
          </td>
          <td style="padding-bottom: 14px; font-size: 13px; color: #334155; line-height: 1.5;">
            <strong style="color: #0f172a;">Review:</strong> Our talent acquisition and engineering leads will review your portfolio and credentials.
          </td>
        </tr>
        <tr>
          <td valign="top" style="width: 32px; padding-bottom: 14px;">
            <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; text-align: center; line-height: 22px; border: 1px solid #fde68a;">2</div>
          </td>
          <td style="padding-bottom: 14px; font-size: 13px; color: #334155; line-height: 1.5;">
            <strong style="color: #0f172a;">Screening:</strong> Candidates matching the role criteria will be invited for an initial screening call.
          </td>
        </tr>
        <tr>
          <td valign="top" style="width: 32px;">
            <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; text-align: center; line-height: 22px; border: 1px solid #fde68a;">3</div>
          </td>
          <td style="font-size: 13px; color: #334155; line-height: 1.5;">
            <strong style="color: #0f172a;">Interview:</strong> In-depth technical architecture and values interview with executive leadership.
          </td>
        </tr>
      </table>
    </div>

    <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;">
      We appreciate your interest in building critical infrastructure security with VISO Group.
    </p>

    <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Sincerely,<br/>
      <strong style="color: #0f172a;">VISO Group Talent Acquisition</strong>
    </p>
  `;

  return {
    subject: `Application Received: ${payload.position} | VISO Group`,
    html: emailWrapper("Application Received", "Careers", content),
    text: `Dear ${payload.name},\n\nThank you for applying for ${payload.position} at VISO Group. We have received your application and our team is currently reviewing your profile.\n\nWarm regards,\nVISO Group Talent Acquisition`,
  };
}

/* -------------------------------------------------------------------------- */
/*                               DISPATCH LOGIC                               */
/* -------------------------------------------------------------------------- */

type ResendSendResponse = { error: { message: string } | null; data?: unknown };

function summarizeDualSendResults(
  adminRes: PromiseSettledResult<ResendSendResponse>,
  ackRes: PromiseSettledResult<ResendSendResponse>,
  adminLabel: string,
  ackLabel: string,
): Pick<SendEmailResult, "adminSent" | "ackSent" | "error" | "details"> & { success: boolean } {
  const errors: string[] = [];

  let adminSent = false;
  if (adminRes.status === "fulfilled") {
    adminSent = !adminRes.value.error;
    if (adminRes.value.error) errors.push(`${adminLabel}: ${adminRes.value.error.message}`);
  } else {
    errors.push(`${adminLabel}: ${String(adminRes.reason)}`);
  }

  let ackSent = false;
  if (ackRes.status === "fulfilled") {
    ackSent = !ackRes.value.error;
    if (ackRes.value.error) errors.push(`${ackLabel}: ${ackRes.value.error.message}`);
  } else {
    errors.push(`${ackLabel}: ${String(ackRes.reason)}`);
  }

  return {
    success: adminSent || ackSent,
    adminSent,
    ackSent,
    error: errors.length > 0 ? errors.join("; ") : undefined,
    details: {
      admin: adminRes.status === "fulfilled" ? adminRes.value : null,
      ack: ackRes.status === "fulfilled" ? ackRes.value : null,
    },
  };
}

export async function handleEmailDispatch(
  payload: EmailPayload,
  config: EmailServiceConfig
): Promise<SendEmailResult> {
  const apiKey = config.apiKey || process.env.RESEND_API_KEY || "";

  if (!apiKey) {
    return {
      success: false,
      error: "RESEND_API_KEY is not configured in environment variables.",
    };
  }

  // Sender email: Use custom verified sender or default to Resend sandbox
  const fromEmail =
    config.fromEmail ||
    process.env.RESEND_FROM_EMAIL ||
    "VISO Group <onboarding@resend.dev>";

  // Admin recipient emails (supports single email or comma/semicolon-separated list)
  const adminEmails = parseRecipientEmails(
    config.adminEmail ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.ADMIN_EMAIL ||
    "info@visogroup.com"
  );
  if (adminEmails.length === 0) {
    adminEmails.push("info@visogroup.com");
  }

  // HR recipient emails (defaults to adminEmails if not set)
  const hrEmails = parseRecipientEmails(
    config.hrEmail ||
    process.env.HR_NOTIFICATION_EMAIL ||
    process.env.HR_EMAIL ||
    adminEmails
  );
  if (hrEmails.length === 0) {
    hrEmails.push(...adminEmails);
  }

  const skipSend =
    process.env.RESEND_SKIP_SEND === "1" || process.env.RESEND_SKIP_SEND === "true";
  if (skipSend) {
    return {
      success: true,
      adminSent: false,
      ackSent: false,
    };
  }

  const resend = new Resend(apiKey);

  if (payload.type === "contact") {
    const contactPayload: ContactEmailPayload = payload;
    const adminEmailData = buildContactAdminEmail(contactPayload);
    const ackEmailData = buildContactAckEmail(contactPayload);

    const [adminRes, ackRes] = await Promise.allSettled([
      resend.emails.send({
        from: fromEmail,
        to: adminEmails,
        replyTo: contactPayload.email,
        subject: adminEmailData.subject,
        html: adminEmailData.html,
        text: adminEmailData.text,
      }),
      resend.emails.send({
        from: fromEmail,
        to: [contactPayload.email],
        replyTo: adminEmails[0],
        subject: ackEmailData.subject,
        html: ackEmailData.html,
        text: ackEmailData.text,
      }),
    ]);

    return summarizeDualSendResults(adminRes, ackRes, "Admin", "User Ack");
  }

  if (payload.type === "job_application") {
    const jobPayload: JobEmailPayload = payload;
    const adminEmailData = buildJobAdminEmail(jobPayload);
    const ackEmailData = buildJobAckEmail(jobPayload);

    const [adminRes, ackRes] = await Promise.allSettled([
      resend.emails.send({
        from: fromEmail,
        to: hrEmails,
        replyTo: jobPayload.email,
        subject: adminEmailData.subject,
        html: adminEmailData.html,
        text: adminEmailData.text,
      }),
      resend.emails.send({
        from: fromEmail,
        to: [jobPayload.email],
        replyTo: hrEmails[0],
        subject: ackEmailData.subject,
        html: ackEmailData.html,
        text: ackEmailData.text,
      }),
    ]);

    return summarizeDualSendResults(adminRes, ackRes, "HR/Admin", "Candidate Ack");
  }

  return {
    success: false,
    error: "Unknown email payload type.",
  };
}
