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

export const edmsApi = {
  // DOCUMENTS
  async getDocuments() {
    const { data, error } = await supabase
      .from('edms_documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as EdmsDocument[];
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

  async updateDocumentStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('edms_documents')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as EdmsDocument;
  },

  // VERSIONS
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

  // AUDIT LOGS
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
    const { error } = await supabase
      .from('edms_audit_logs')
      .insert([log]);
    if (error) console.error("Error logging audit:", error);
  },

  // STORAGE
  async uploadFile(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('edms_files')
      .upload(path, file, { upsert: true });
    if (error) throw error;
    return data.path;
  },
  
  getFileUrl(path: string) {
    const { data } = supabase.storage.from('edms_files').getPublicUrl(path);
    return data.publicUrl;
  }
};
