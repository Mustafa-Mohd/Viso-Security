import { supabase } from "./supabase";

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
}

export async function markInquiryRead(id: string): Promise<void> {
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status: "read" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
