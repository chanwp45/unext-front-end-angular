export interface Faculty {
  id: number;
  code: string;
  name_th: string;
  name_en: string;
}

export interface Department {
  id: number;
  faculty_id: number;
  code: string;
  name_th: string;
  name_en: string;
}
