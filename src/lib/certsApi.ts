import { supabase } from "./supabase";

export interface TranslationCertificate {
  id: string;
  national_id: string;
  project_name: string;
  source_lang: string;
  target_lang: string;
  issue_date: string;
  expiry_date: string;
  status: "VALID" | "EXPIRED" | "REVOKED";
  created_at?: string;
  updated_at?: string;
}

/** Helper to evaluate if the certificate is technically expired based on the current date */
export const isCertificateExpired = (expiryDateStr: string): boolean => {
  const expiryDate = new Date(expiryDateStr);
  const currentDate = new Date();
  
  // Strip time for accurate date comparison
  expiryDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  return currentDate > expiryDate;
};

export const certsApi = {
  /** Fetch all certificates (Admin) */
  async fetchCertificates(): Promise<TranslationCertificate[]> {
    const { data, error } = await supabase
      .from("translation_certificates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching certificates:", error);
      throw error;
    }

    return (data || []).map(cert => ({
      ...cert,
      // Overwrite the status to EXPIRED on the fly if it hasn't been updated in the DB but time has passed
      status: cert.status === 'VALID' && isCertificateExpired(cert.expiry_date) ? 'EXPIRED' : cert.status
    }));
  },

  /** Get single certificate by ID (Public Verification) */
  async getCertificateById(id: string): Promise<TranslationCertificate | null> {
    const { data, error } = await supabase
      .from("translation_certificates")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching certificate by ID:", error);
      return null;
    }
    
    if (!data) return null;

    return {
      ...data,
      status: data.status === 'VALID' && isCertificateExpired(data.expiry_date) ? 'EXPIRED' : data.status
    };
  },

  /** Issue or Update a Certificate (Admin) */
  async upsertCertificate(cert: TranslationCertificate): Promise<void> {
    const { error } = await supabase
      .from("translation_certificates")
      .upsert({
        id: cert.id,
        national_id: cert.national_id,
        project_name: cert.project_name,
        source_lang: cert.source_lang,
        target_lang: cert.target_lang,
        issue_date: cert.issue_date,
        expiry_date: cert.expiry_date,
        status: cert.status,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error("Error upserting certificate:", error);
      throw error;
    }
  },

  /** Delete a certificate (Admin) */
  async deleteCertificate(id: string): Promise<void> {
    const { error } = await supabase
      .from("translation_certificates")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting certificate:", error);
      throw error;
    }
  },
};
