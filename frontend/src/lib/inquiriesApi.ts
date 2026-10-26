import { supabase, isSupabaseConfigured } from "./supabase";
import { sendContactNotification } from "./emailApi";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  message: string;
  status?: string;
  created_at: string;
}

export async function fetchContactSubmissions(): Promise<ContactSubmission[]> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are missing in deployment. Please add them in your hosting provider's project settings (e.g. Vercel / Netlify) and redeploy."
    );
  }

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to load inquiries");
  }
  return (data || []) as ContactSubmission[];
}

export async function submitContactInquiry(payload: {
  name: string;
  email: string;
  company?: string | null;
  message: string;
}): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase configuration is missing in deployment. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in hosting environment variables."
    );
  }

  const { error } = await supabase.from("contact_submissions").insert([
    {
      name: payload.name,
      email: payload.email,
      company: payload.company || null,
      message: payload.message,
      status: "unread",
    },
  ]);

  if (error) {
    throw new Error(error.message || "Failed to send message");
  }

  // Trigger Resend email delivery (Admin lead notification + submitter acknowledgment)
  try {
    const emailResult = await sendContactNotification({
      name: payload.name,
      email: payload.email,
      company: payload.company,
      message: payload.message,
    });
    if (!emailResult.success) {
      console.warn("Contact inquiry email dispatch notice:", emailResult.error);
    }
  } catch (emailErr) {
    console.warn("Could not dispatch contact email:", emailErr);
  }
}

export async function markInquiryRead(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase
    .from("contact_submissions")
    .update({ status: "read" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

