export type CurriculumStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export interface Curriculum {
  curriculum_id: number;
  curriculum_code: string;
  curriculum_name_th: string;
  curriculum_name_en: string;
  degree_level: string;
  faculty_id: number;
  faculty_name: string;
  department_id: number;
  department_name: string;
  total_credits: number;
  duration_years: string;
  effective_year: number;
  accreditation_body?: string;
  status: CurriculumStatus;
  description?: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCurriculumRequest {
  curriculum_name_th: string;
  curriculum_name_en: string;
  degree_level: string;
  faculty_id: number;
  department_id: number;
  total_credits: number;
  duration_years: string;
  effective_year: number;
  accreditation_body?: string;
  status?: CurriculumStatus;
  description?: string;
}

export interface UpdateCurriculumRequest {
  curriculum_name_th?: string;
  curriculum_name_en?: string;
  degree_level?: string;
  faculty_id?: number;
  department_id?: number;
  total_credits?: number;
  duration_years?: string;
  effective_year?: number;
  accreditation_body?: string;
  status?: CurriculumStatus;
  description?: string;
}

export interface CurriculumAudit {
  audit_id: number;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  changed_fields?: string[];
  performed_by: string;
  performed_by_name: string;
  user_role: string;
  ip_address?: string;
  reason?: string;
  document_ref?: string;
  performed_at: string;
}

export interface CurriculumFilter {
  degreeLevel?: string;
  status?: CurriculumStatus;
  facultyId?: number;
  keyword?: string;
  page?: number;
  limit?: number;
}
