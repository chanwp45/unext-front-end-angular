export type StudentStatus = 'STUDYING' | 'LEAVE' | 'RESIGNED' | 'GRADUATED' | 'EXPELLED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface StudentCurriculum {
  curriculum_id: number;
  curriculum_code: string;
  curriculum_name_th: string;
}

export interface Student {
  student_id: string;
  national_id: string;
  title_th: string;
  first_name_th: string;
  last_name_th: string;
  first_name_en: string;
  last_name_en: string;
  date_of_birth: string;
  gender: Gender;
  nationality: string;
  email: string;
  phone: string;
  address: string;
  curriculum: StudentCurriculum;
  admission_year: number;
  student_status: StudentStatus;
  guardian_name?: string;
  guardian_phone?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentRequest {
  national_id: string;
  title_th: string;
  first_name_th: string;
  last_name_th: string;
  first_name_en: string;
  last_name_en: string;
  date_of_birth: string;
  gender: Gender;
  nationality: string;
  email: string;
  phone: string;
  address: string;
  curriculum_id: number;
  admission_year: number;
  guardian_name?: string;
  guardian_phone?: string;
}

export interface UpdateStudentRequest {
  email?: string;
  phone?: string;
  address?: string;
  title_th?: string;
  first_name_th?: string;
  last_name_th?: string;
  first_name_en?: string;
  last_name_en?: string;
  date_of_birth?: string;
  gender?: Gender;
  nationality?: string;
  curriculum_id?: number;
  guardian_name?: string;
  guardian_phone?: string;
}

export interface UpdateStudentStatusRequest {
  student_status: StudentStatus;
  effective_date?: string;
  reason?: string;
  document_ref?: string;
}

export interface StudentFilter {
  keyword?: string;
  status?: StudentStatus;
  curriculumId?: number;
  admissionYear?: number;
  page?: number;
  limit?: number;
}
