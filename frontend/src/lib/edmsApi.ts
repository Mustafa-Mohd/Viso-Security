import { supabase } from './supabase';

export interface EdmsDocument {
  id: string;
  document_number: string;
  title: string;
  type: string;
  department: string;
  project: string;
  description?: string;
  tags?: string;
  confidentiality: string;
  status: string;
  owner_name: string;
  owner_id?: string;
  assigned_reviewer_id?: string | null;
  assigned_reviewer_name?: string | null;
  review_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EdmsDocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_url: string;
  created_by_name: string;
  created_by_id?: string;
  change_description?: string;
  created_at: string;
}

export interface EdmsAuditLog {
  id: string;
  document_id?: string;
  user_name: string;
  user_id?: string;
  action: string;
  details?: string;
  created_at: string;
}

export interface PortalUserOption {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

export const edmsApi = {
  async getDocuments() {
    const { data, error } = await supabase
      .from('edms_documents')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data as EdmsDocument[];
  },

  async getDocument(id: string) {
    const { data, error } = await supabase
      .from('edms_documents')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as EdmsDocument;
  },

  async createDocument(doc: Partial<EdmsDocument>) {
    const { data, error } = await supabase
      .from('edms_documents')
      .insert([doc])
      .select()
      .single();
    if (error) throw error;
    return data as EdmsDocument;
  },

  async updateDocument(id: string, updates: Partial<EdmsDocument>) {
    const { data, error } = await supabase
      .from('edms_documents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as EdmsDocument;
  },

  async updateDocumentStatus(id: string, status: string, extra?: Partial<EdmsDocument>) {
    return this.updateDocument(id, { status, ...extra });
  },

  async getDocumentVersions(documentId: string) {
    const { data, error } = await supabase
      .from('edms_document_versions')
      .select('*')
      .eq('document_id', documentId)
      .order('version_number', { ascending: false });
    if (error) throw error;
    return data as EdmsDocumentVersion[];
  },

  async addDocumentVersion(version: Partial<EdmsDocumentVersion>) {
    const { data, error } = await supabase
      .from('edms_document_versions')
      .insert([version])
      .select()
      .single();
    if (error) throw error;
    return data as EdmsDocumentVersion;
  },

  async getAuditLogs(documentId?: string) {
    let query = supabase.from('edms_audit_logs').select('*').order('created_at', { ascending: false });
    if (documentId) {
      query = query.eq('document_id', documentId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as EdmsAuditLog[];
  },

  async logAudit(log: Partial<EdmsAuditLog>) {
    const { error } = await supabase.from('edms_audit_logs').insert([log]);
    if (error) console.error('Error logging audit:', error);
  },

  async getAssignableReviewers() {
    const { data, error } = await supabase
      .from('portal_users')
      .select('id, name, email, role, department')
      .in('role', ['reviewer', 'manager', 'document_controller', 'admin', 'super_admin']);
    if (error) throw error;
    return (data || []) as PortalUserOption[];
  },

  async uploadFile(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('edms_files')
      .upload(path, file, { upsert: true });
    if (error) throw error;
    return data.path;
  },

  async getFileDownloadUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('edms_files')
      .createSignedUrl(path, 3600);
    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
    const { data: publicData } = supabase.storage.from('edms_files').getPublicUrl(path);
    return publicData.publicUrl;
  },
};
